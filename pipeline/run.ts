/**
 * Pipeline d'actualisation d'ATLAS.
 * Exécuté par GitHub Actions (ou à la main : `npm run pipeline`).
 * Lit des flux RSS publics, regroupe les articles par événement, évalue la fiabilité,
 * sélectionne le briefing et écrit des fichiers JSON statiques lus par l'application.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Briefing, BriefingIndexEntry, CountriesFile, LatestData, NewsCluster, QuizQuestion, RegionId, RunStatus, SourceStatus } from '../src/lib/types';
import { COUNTRIES, COUNTRY_BY_ISO3 } from '../src/lib/gazetteer';
import { DOSSIERS } from '../src/content/dossiers';
import { normalize, seededRandom, shuffle } from '../src/lib/text';
import { parisDate } from '../src/lib/daily';
import { FEEDS } from './sources';
import { fetchText, parseFeed, USER_AGENT, type RawItem } from './rss';
import { buildCluster, clusterItems, enrich, type PersonMatcher } from './cluster';
import { checkLinks } from './links';
import { aiSummaries } from './ai';
import { updateCountries } from './countries';

const DATA_DIR = process.env.ATLAS_DATA_DIR ?? 'public/data';
const ARCHIVE_DAYS = 7;
const BRIEFING_WINDOW_H = 30;
const now = process.env.ATLAS_NOW ? Date.parse(process.env.ATLAS_NOW) : Date.now();
// Mode test hors ligne : lit les flux dans un dossier local au lieu d'Internet (jamais utilisé en production).
const FIXTURES = process.env.ATLAS_FIXTURES_DIR;
const today = parisDate(new Date(now));

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8')) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  const full = path.join(DATA_DIR, file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, JSON.stringify(data));
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

interface ArchivedItem extends Omit<RawItem, 'source'> {
  sourceId: string;
}

function personMatchers(countries: CountriesFile | null): PersonMatcher[] {
  if (!countries) return [];
  const out: PersonMatcher[] = [];
  for (const c of Object.values(countries.countries)) {
    if (!COUNTRY_BY_ISO3[c.iso3]) continue;
    for (const p of [...c.headOfState, ...c.headOfGovernment]) {
      const full = normalize(p.name).trim();
      if (full.length >= 6) out.push({ alias: full, id: p.qid, name: p.name, country: c.iso3 });
      const last = full.split(' ').at(-1) ?? '';
      // Nom de famille seul : uniquement s'il est assez long pour limiter les homonymies.
      if (last.length >= 6 && last !== full) out.push({ alias: last, id: p.qid, name: p.name, country: c.iso3 });
    }
  }
  return out;
}

function chooseDossier(top: NewsCluster[]): Briefing['decryptage'] {
  const scores = DOSSIERS.map((d) => {
    let s = 0;
    const related: string[] = [];
    top.forEach((c, rank) => {
      const text = normalize(`${c.title} ${c.summary} ${c.sources.map((x) => x.title).join(' ')}`);
      let hit = 0;
      for (const k of d.keywords) if (text.includes(` ${k} `)) hit += 2;
      for (const iso of d.countries) if (c.places.slice(0, 3).includes(iso)) hit += 1;
      for (const o of d.orgs) if (c.actors.some((a) => a.id === o)) hit += 1;
      if (hit >= 3) {
        // Les premiers sujets du briefing pèsent davantage.
        s += Math.min(hit, 8) * c.score * (1 / (1 + rank * 0.35));
        related.push(c.id);
      }
    });
    // Les dossiers « grande puissance » ont des mots-clés très généraux : on les pénalise.
    if (d.category === 'puissance') s *= 0.5;
    return { d, s, related };
  }).sort((a, b) => b.s - a.s);
  const best = scores[0];
  if (!best || best.s <= 0) return null;
  const lead = top.find((c) => c.id === best.related[0]);
  return {
    dossierId: best.d.id,
    relatedClusterIds: best.related,
    reason: lead ? `En lien avec l'actualité : « ${lead.title} »` : "En lien avec l'actualité du jour",
  };
}

function assignDossiers(clusters: NewsCluster[]): void {
  for (const c of clusters) {
    const text = normalize(`${c.title} ${c.summary}`);
    let best: { id: string; s: number } | null = null;
    for (const d of DOSSIERS) {
      let s = 0;
      for (const k of d.keywords) if (text.includes(` ${k} `)) s += 2;
      for (const iso of d.countries) if (c.places.slice(0, 2).includes(iso)) s += 1;
      if (s >= 3 && (!best || s > best.s)) best = { id: d.id, s };
    }
    c.relatedDossier = best?.id ?? null;
  }
}

/** Sélection du briefing : récence, pertinence thématique, priorité géographique, diversité des régions. */
function selectTop(clusters: NewsCluster[]): NewsCluster[] {
  const recent = clusters.filter(
    (c) =>
      now - Date.parse(c.lastPublishedAt) <= BRIEFING_WINDOW_H * 3600_000 &&
      c.themes.length > 0 &&
      c.reliability.level !== 'analyse',
  );
  const perRegion = new Map<RegionId, number>();
  const top: NewsCluster[] = [];
  for (const c of recent) {
    const n = perRegion.get(c.region) ?? 0;
    if (n >= 3) continue;
    top.push(c);
    perRegion.set(c.region, n + 1);
    if (top.length >= 10) break;
  }
  return top;
}

/** Questions d'actualité générées à partir des données (pays au cœur de l'information, masqué dans le titre). */
function newsQuiz(top: NewsCluster[]): QuizQuestion[] {
  const rnd = seededRandom(`news-${today}`);
  const out: QuizQuestion[] = [];
  for (const c of top) {
    const iso = c.places[0];
    const country = COUNTRY_BY_ISO3[iso];
    if (!country || c.reliability.level === 'non_confirme') continue;
    // Masque le nom du pays et ses alias dans le titre.
    let masked = c.title;
    const words = c.title.split(/(\s+)/);
    let replaced = false;
    masked = words
      .map((w) => {
        const n = normalize(w).trim();
        if (n && country.aliases.includes(n)) {
          replaced = true;
          return '___';
        }
        return w;
      })
      .join('');
    if (!replaced) continue;
    const others = shuffle(COUNTRIES.filter((x) => x.region === country.region && x.iso3 !== iso), rnd).slice(0, 3);
    if (others.length < 3) continue;
    const options = shuffle([country.name, ...others.map((o) => o.name)], rnd);
    out.push({
      id: `n-${today}-${c.id}`,
      theme: 'actualite',
      question: `Actualité du jour — quel pays manque dans ce titre ? « ${masked} »`,
      options,
      answer: options.indexOf(country.name),
      explanation: `Il s'agit de : ${country.name}. Titre original : « ${c.title} » (${c.sources[0]?.sourceName ?? 'source'}).`,
      extra: c.summary ? c.summary : undefined,
      link: c.sources[0] ? { label: `Lire : ${c.sources[0].sourceName}`, url: c.sources[0].url } : undefined,
      generated: true,
    });
    if (out.length >= 3) break;
  }
  return out;
}

async function fetchOnThisDay(): Promise<Briefing['onThisDay']> {
  const [, mm, dd] = today.split('-');
  const urls = [
    `https://api.wikimedia.org/feed/v1/wikipedia/fr/onthisday/selected/${mm}/${dd}`,
    `https://fr.wikipedia.org/api/rest_v1/feed/onthisday/selected/${mm}/${dd}`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
      if (!res.ok) continue;
      const json = (await res.json()) as { selected?: { year: number; text: string; pages?: { content_urls?: { desktop?: { page?: string } } }[] }[] };
      const events = (json.selected ?? [])
        .slice(0, 8)
        .map((e) => ({ year: e.year, text: e.text, url: e.pages?.[0]?.content_urls?.desktop?.page ?? null }));
      if (events.length) return { source: 'Wikipédia (français) — « Éphéméride »', events };
    } catch {
      /* source suivante */
    }
  }
  return null;
}

async function main(): Promise<void> {
  console.log(`ATLAS pipeline — ${new Date(now).toISOString()} — données : ${DATA_DIR}`);
  await mkdir(DATA_DIR, { recursive: true });

  // Données pays (hebdomadaire) : sert aussi à reconnaître les dirigeants dans les articles.
  let countries = await readJson<CountriesFile>('countries.json');
  if (!FIXTURES && (!countries || now - Date.parse(countries.generatedAt) > 7 * 86_400_000 || process.env.ATLAS_FORCE_COUNTRIES)) {
    try {
      countries = await updateCountries(DATA_DIR);
    } catch (e) {
      console.warn('Données pays non mises à jour :', (e as Error).message);
    }
  }

  const previous = await readJson<LatestData>('latest.json');
  const prevStatus = new Map((previous?.sources ?? []).map((s) => [s.id, s]));

  // 1. Collecte
  const statuses: SourceStatus[] = [];
  const fresh: RawItem[] = [];
  await mapLimit(FEEDS, 8, async (src) => {
    const checkedAt = new Date().toISOString();
    try {
      const xml = FIXTURES ? await readFile(path.join(FIXTURES, `${src.id}.xml`), 'utf8') : await fetchText(src.url);
      const items = parseFeed(xml, src);
      fresh.push(...items);
      statuses.push({ id: src.id, name: src.name, url: src.url, ok: items.length > 0, items: items.length, error: items.length ? undefined : 'Flux vide ou illisible', checkedAt, lastSuccessAt: items.length ? checkedAt : prevStatus.get(src.id)?.lastSuccessAt ?? null });
    } catch (e) {
      statuses.push({ id: src.id, name: src.name, url: src.url, ok: false, items: 0, error: (e as Error).message, checkedAt, lastSuccessAt: prevStatus.get(src.id)?.lastSuccessAt ?? null });
    }
  });
  const okCount = statuses.filter((s) => s.ok).length;
  console.log(`Sources OK : ${okCount}/${FEEDS.length} — articles récupérés : ${fresh.length}`);

  if (fresh.length === 0) {
    // Panne générale : on conserve les dernières données valides et on l'indique.
    const status: RunStatus = { lastAttemptAt: new Date().toISOString(), ok: false, message: 'Aucun flux accessible lors de la dernière tentative : les données affichées sont celles de la dernière actualisation réussie.' };
    await writeJson('status.json', status);
    console.error(status.message);
    return;
  }

  // 2. Archive glissante (7 jours) : permet les filtres par date et protège contre les pannes ponctuelles.
  const archive = (await readJson<ArchivedItem[]>('items.json')) ?? [];
  const byUrl = new Map<string, ArchivedItem>();
  for (const a of archive) byUrl.set(a.url, a);
  for (const f of fresh) {
    const { source, ...rest } = f;
    byUrl.set(f.url, { ...rest, sourceId: source.id, publishedAt: f.publishedAt ?? byUrl.get(f.url)?.publishedAt ?? null });
  }
  const feedById = new Map(FEEDS.map((f) => [f.id, f]));
  const kept = [...byUrl.values()].filter(
    (a) => a.publishedAt && now - Date.parse(a.publishedAt) <= ARCHIVE_DAYS * 86_400_000 && feedById.has(a.sourceId),
  );
  await writeJson('items.json', kept);

  // 3. Enrichissement et regroupement
  const persons = personMatchers(countries);
  const items = kept.map((a) => enrich({ ...a, source: feedById.get(a.sourceId)! }, persons));
  const groups = clusterItems(items);
  const clusters = groups
    .map((g) => buildCluster(g, now))
    .filter((c): c is NewsCluster => c !== null)
    .sort((a, b) => b.score - a.score);
  assignDossiers(clusters);
  console.log(`Groupes d'articles : ${clusters.length}`);

  // 4. Briefing
  const top = selectTop(clusters);
  if (!FIXTURES) await checkLinks(top.flatMap((c) => c.sources));
  const ai = await aiSummaries(top);
  for (const c of top) c.ai = ai.get(c.id) ?? null;

  const briefing: Briefing = {
    date: today,
    generatedAt: new Date().toISOString(),
    top,
    decryptage: chooseDossier(top.length ? top : clusters.slice(0, 15)),
    newsQuiz: newsQuiz(top),
    onThisDay: FIXTURES ? null : await fetchOnThisDay(),
    aiEnabled: ai.size > 0,
  };

  const latest: LatestData = {
    schema: 1,
    generatedAt: briefing.generatedAt,
    briefing,
    clusters: clusters.slice(0, 400),
    sources: statuses.sort((a, b) => a.name.localeCompare(b.name)),
    stats: { items: items.length, clusters: clusters.length, sourcesOk: okCount, sourcesTotal: FEEDS.length },
  };
  await writeJson('latest.json', latest);
  await writeJson(`briefings/${today}.json`, briefing);

  // 5. Historique des briefings
  const index = (await readJson<BriefingIndexEntry[]>('briefings/index.json')) ?? [];
  const entry: BriefingIndexEntry = { date: today, generatedAt: briefing.generatedAt, headlines: top.slice(0, 3).map((c) => c.title) };
  const nextIndex = [entry, ...index.filter((e) => e.date !== today)].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 400);
  await writeJson('briefings/index.json', nextIndex);

  const status: RunStatus = {
    lastAttemptAt: briefing.generatedAt,
    ok: true,
    message: okCount < FEEDS.length ? `${FEEDS.length - okCount} source(s) indisponible(s) lors de la dernière actualisation.` : 'Toutes les sources ont répondu.',
  };
  await writeJson('status.json', status);
  console.log(`Briefing : ${top.length} sujets — décryptage : ${briefing.decryptage?.dossierId ?? 'aucun'}`);
  if (!existsSync(path.join(DATA_DIR, 'countries.json'))) console.warn('Attention : countries.json absent (fiches pays sans données chiffrées).');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
