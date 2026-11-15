import type { Actor, NewsCluster, Reliability, RegionId, SourceRef, ThemeId } from '../src/lib/types';
import { COUNTRY_BY_ISO3, ORG_BY_ID, REGION_PRIORITY, detectEntities } from '../src/lib/gazetteer';
import { casualtyFigures, detectEventKeys, detectStatement, detectThemes, isOffTopic, properNouns } from '../src/lib/classify';
import { jaccard, normalize, tokens } from '../src/lib/text';
import { WIRES } from './sources';
import type { RawItem } from './rss';

export interface PersonMatcher {
  alias: string; // normalisé
  id: string;
  name: string;
  country: string;
}

export interface Item extends RawItem {
  id: string;
  titleTokens: Set<string>;
  bodyTokens: Set<string>;
  entities: Set<string>; // c:FRA, o:otan, p:Q123
  crossKeys: Set<string>;
  countries: string[];
  orgs: string[];
  persons: { id: string; name: string; country: string }[];
  themes: ThemeId[];
  offTopic: boolean;
  wire: string | null;
  time: number;
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export function enrich(raw: RawItem, persons: PersonMatcher[]): Item {
  const full = `${raw.title}. ${raw.summary}`;
  const { countries, orgs } = detectEntities(full);
  const norm = normalize(full);
  const foundPersons = persons.filter((p) => norm.includes(` ${p.alias} `));
  const uniqPersons = [...new Map(foundPersons.map((p) => [p.id, p])).values()];
  for (const p of uniqPersons) if (!countries.includes(p.country)) countries.push(p.country);
  const entities = new Set<string>([
    ...countries.map((c) => `c:${c}`),
    ...orgs.map((o) => `o:${o}`),
    ...uniqPersons.map((p) => `p:${p.id}`),
  ]);
  const titleEnt = detectEntities(raw.title);
  const eventKeys = detectEventKeys(raw.title);
  const crossKeys = new Set<string>([
    ...titleEnt.countries.map((c) => `c:${c}`),
    ...titleEnt.orgs.map((o) => `o:${o}`),
    ...uniqPersons.filter((p) => normalize(raw.title).includes(` ${p.alias} `)).map((p) => `p:${p.id}`),
    ...eventKeys,
    ...properNouns(raw.title).filter((pn) => !entities.has(pn)),
    ...(raw.title.match(/\b\d{2,}\b/g) ?? []).map((n) => `n:${n}`),
  ]);
  const wire = WIRES.find((w) => w.re.test(full))?.name ?? null;
  const { themes } = detectThemes(full);
  const themeList = [...themes];
  if (raw.source.themeHint && !themeList.includes(raw.source.themeHint)) themeList.push(raw.source.themeHint);
  return {
    ...raw,
    id: hash(raw.url),
    titleTokens: new Set([...tokens(raw.title), ...eventKeys]),
    bodyTokens: new Set(tokens(full)),
    entities,
    crossKeys,
    countries,
    orgs,
    persons: uniqPersons.map(({ id, name, country }) => ({ id, name, country })),
    themes: themeList,
    offTopic: isOffTopic(full) && themes.length === 0,
    wire,
    time: raw.publishedAt ? new Date(raw.publishedAt).getTime() : 0,
  };
}

/** Similarité entre deux articles (0–1). */
export function similarity(a: Item, b: Item): number {
  if (a.time && b.time && Math.abs(a.time - b.time) > 48 * 3600_000) return 0;
  const ent = jaccard(a.entities, b.entities);
  if (a.source.lang === b.source.lang) {
    const t = jaccard(a.titleTokens, b.titleTokens);
    const body = jaccard(a.bodyTokens, b.bodyTokens);
    let shared = 0;
    for (const x of a.titleTokens) if (b.titleTokens.has(x)) shared++;
    if (shared < 2) return 0;
    // Noms propres communs dans les titres (ex. une personnalité non répertoriée) : fort indice de même sujet.
    let sharedPN = 0;
    for (const k of a.crossKeys) if (k.startsWith('pn:') && b.crossKeys.has(k)) sharedPN++;
    return 0.5 * t + 0.25 * body + 0.25 * ent + 0.1 * Math.min(sharedPN, 3);
  }
  // Langues différentes : on ne s'appuie que sur les entités, les événements, les noms propres et les nombres.
  let shared = 0;
  let specific = 0;
  for (const k of a.crossKeys)
    if (b.crossKeys.has(k)) {
      shared++;
      if (!k.startsWith('c:')) specific++;
    }
  if (shared < 3 || specific < 1) return 0;
  return 0.7 * jaccard(a.crossKeys, b.crossKeys) + 0.3 * ent;
}

export const SAME_LANG_THRESHOLD = 0.3;
export const CROSS_LANG_THRESHOLD = 0.42;

export function clusterItems(items: Item[]): Item[][] {
  const sorted = [...items].sort((a, b) => b.time - a.time);
  const clusters: Item[][] = [];
  for (const it of sorted) {
    let best: Item[] | null = null;
    let bestScore = 0;
    for (const c of clusters) {
      // Comparaison à la « graine » et au meilleur membre : limite les chaînages abusifs.
      let max = 0;
      for (const m of c) max = Math.max(max, similarity(it, m));
      const seed = similarity(it, c[0]);
      const threshold = it.source.lang === c[0].source.lang ? SAME_LANG_THRESHOLD : CROSS_LANG_THRESHOLD;
      const score = Math.max(max, seed);
      if (max >= threshold && seed >= threshold * 0.6 && score > bestScore) {
        best = c;
        bestScore = score;
      }
    }
    if (best) {
      // Un même flux ne contribue qu'une fois par sujet (doublons de rubriques).
      if (!best.some((m) => m.url === it.url)) best.push(it);
    } else clusters.push([it]);
  }
  return clusters;
}

/** Calcule l'indépendance des sources et le niveau de fiabilité d'un groupe d'articles. */
export function assessReliability(items: Item[]): Reliability {
  const notes: string[] = [];
  const allAnalysis = items.every((i) => i.source.kind === 'analyse');
  // Origine = agence citée si détectée, sinon groupe éditorial.
  const origin = (i: Item) => i.wire ?? i.source.group;
  const originOf = new Map<Item, string>(items.map((i) => [i, origin(i)]));
  // Textes quasi identiques provenant de groupes différents : probable reprise d'une même dépêche.
  for (let a = 0; a < items.length; a++)
    for (let b = a + 1; b < items.length; b++) {
      const A = items[a];
      const B = items[b];
      if (A.source.group === B.source.group || A.source.lang !== B.source.lang) continue;
      if (jaccard(A.bodyTokens, B.bodyTokens) >= 0.6) {
        const o = originOf.get(A)!;
        originOf.set(B, o);
        if (!notes.includes('Textes quasi identiques chez plusieurs médias : probable reprise d’une même dépêche.'))
          notes.push('Textes quasi identiques chez plusieurs médias : probable reprise d’une même dépêche.');
      }
    }
  const origins = [...new Set(originOf.values())];
  const wires = [...new Set(items.map((i) => i.wire).filter(Boolean))] as string[];
  if (wires.length) notes.push(`Agence(s) citée(s) : ${wires.join(', ')}. Les reprises d’une même agence comptent pour une seule origine.`);
  const groups = new Set(items.map((i) => i.source.group));
  if (groups.size > origins.length) notes.push(`${groups.size} médias, mais ${origins.length} origine(s) réellement indépendante(s).`);
  if (items.some((i) => i.source.kind === 'institution')) notes.push('Comprend une source institutionnelle (source primaire).');
  if (items.some((i) => i.source.stateAffiliated)) notes.push('Comprend un média affilié à un État : à lire comme une position officielle.');

  // Divergences de bilans chiffrés entre origines indépendantes.
  let contradictory = false;
  for (const kind of ['morts', 'blesses'] as const) {
    const byOrigin = new Map<string, number>();
    for (const i of items) {
      const figs = casualtyFigures(`${i.title}. ${i.summary}`).filter((f) => f.kind === kind);
      if (figs.length) byOrigin.set(originOf.get(i)!, Math.max(...figs.map((f) => f.value)));
    }
    if (byOrigin.size >= 2) {
      const vals = [...byOrigin.values()];
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      if (max > min * 1.25 && max - min >= 3) {
        contradictory = true;
        notes.push(
          `Bilans divergents (${kind}) : ${[...byOrigin.entries()].map(([o, v]) => `${v} selon ${o}`).join(', ')}. Un bilan peut évoluer dans le temps : vérifier l’heure de chaque source.`,
        );
      }
    }
  }

  let level: Reliability['level'];
  if (allAnalysis) level = 'analyse';
  else if (contradictory) level = 'contradictoire';
  else if (origins.length >= 3) level = 'confirme';
  else if (origins.length === 2) level = 'partiel';
  else level = 'non_confirme';
  if (level === 'non_confirme') notes.unshift(items.length > 1 ? 'Une seule origine identifiée : information non recoupée de manière indépendante.' : 'Source unique : information non recoupée.');
  return { level, independentOrigins: origins.length, origins, notes };
}

const THEME_WEIGHT: Record<ThemeId, number> = {
  conflits: 3,
  diplomatie: 2.5,
  defense: 2.5,
  securite: 2,
  politique: 2,
  energie: 2,
  economie: 1.5,
  technologie: 1,
};

const HEADLINE_BOOST = ['guerre', 'war', 'cessez le feu', 'ceasefire', 'nucleaire', 'nuclear', 'invasion', 'sommet', 'summit', 'sanctions', 'missile', 'missiles', 'coup d etat', 'gouvernement', 'election', 'otan', 'nato', 'ormuz', 'hormuz'];

export function primaryRegion(countries: string[], items: Item[]): { region: RegionId; regions: RegionId[] } {
  const regions = [...new Set(countries.map((c) => COUNTRY_BY_ISO3[c]?.region).filter(Boolean))] as RegionId[];
  if (regions.length === 0) {
    const hint = items.find((i) => i.source.regionHint)?.source.regionHint;
    return { region: hint ?? 'monde', regions: hint ? [hint] : ['monde'] };
  }
  // Le pays le plus cité (les mentions dans les titres comptent double) détermine la région principale ;
  // à égalité, la priorité géographique du briefing départage.
  const counts = new Map<string, number>();
  for (const i of items) {
    const inTitle = new Set(detectEntities(i.title).countries);
    for (const c of i.countries) counts.set(c, (counts.get(c) ?? 0) + (inTitle.has(c) ? 2 : 1));
  }
  const prio = (iso: string) => REGION_PRIORITY[COUNTRY_BY_ISO3[iso]?.region ?? 'monde'];
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || prio(b[0]) - prio(a[0]))[0]?.[0];
  return { region: (top && COUNTRY_BY_ISO3[top]?.region) || regions[0], regions };
}

export function buildCluster(items: Item[], now: number): NewsCluster | null {
  const dated = items.filter((i) => i.time > 0);
  if (dated.length === 0) return null;
  // Titre et résumé : priorité aux sources francophones, puis aux médias (plutôt qu'aux analyses).
  const rank = (i: Item) => (i.source.lang === 'fr' ? 2 : 0) + (i.source.kind === 'media' ? 1 : 0) + Math.min(i.summary.length, 300) / 1000;
  const lead = [...dated].sort((a, b) => rank(b) - rank(a))[0];
  const countryCount = new Map<string, number>();
  for (const i of items) for (const c of i.countries) countryCount.set(c, (countryCount.get(c) ?? 0) + 1);
  const places = [...countryCount.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 6);
  const orgCount = new Map<string, number>();
  for (const i of items) for (const o of i.orgs) orgCount.set(o, (orgCount.get(o) ?? 0) + 1);
  const persons = new Map<string, { id: string; name: string }>();
  for (const i of items) for (const p of i.persons) persons.set(p.id, p);
  const actors: Actor[] = [
    ...[...persons.values()].slice(0, 5).map((p) => ({ id: p.id, name: p.name, type: 'personne' as const })),
    ...[...orgCount.keys()].slice(0, 5).map((o) => ({ id: o, name: ORG_BY_ID[o]?.name ?? o, type: 'organisation' as const })),
    ...places.slice(0, 4).map((c) => ({ id: c, name: COUNTRY_BY_ISO3[c]?.name ?? c, type: 'pays' as const })),
  ];
  const themeCount = new Map<ThemeId, number>();
  for (const i of items) for (const t of i.themes) themeCount.set(t, (themeCount.get(t) ?? 0) + 1);
  const themes = [...themeCount.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 3);
  const { region, regions } = primaryRegion(places, items);
  const reliability = assessReliability(items);
  const times = dated.map((i) => i.time);
  const last = Math.max(...times);
  const ageH = (now - last) / 3600_000;
  const n = normalize(items.map((i) => i.title).join(' '));
  const boost = HEADLINE_BOOST.filter((k) => n.includes(` ${k} `)).length;
  const themeScore = themes.reduce((s, t, idx) => s + THEME_WEIGHT[t] / (idx + 1), 0);
  const allAnalysis = items.every((i) => i.source.kind === 'analyse');
  const score =
    3 * reliability.independentOrigins +
    Math.min(items.length, 8) * 0.8 +
    themeScore +
    REGION_PRIORITY[region] * 0.8 +
    Math.min(boost, 3) * 1.2 -
    Math.max(0, ageH - 6) / 6 -
    (themes.length === 0 ? 6 : 0) -
    (allAnalysis ? 4 : 0) -
    (items.every((i) => i.offTopic) ? 10 : 0);
  const sources: SourceRef[] = items
    .sort((a, b) => a.time - b.time)
    .map((i) => ({
      sourceId: i.source.id,
      sourceName: i.source.name,
      group: i.source.group,
      kind: i.source.kind,
      lang: i.source.lang,
      title: i.title,
      url: i.url,
      summary: i.summary,
      publishedAt: i.publishedAt,
      statement: detectStatement(i.title),
      wire: i.wire,
      stateAffiliated: i.source.stateAffiliated,
    }));
  return {
    id: hash(items.map((i) => i.url).sort()[0]),
    title: lead.title,
    summary: lead.summary,
    lang: lead.source.lang,
    firstPublishedAt: new Date(Math.min(...times)).toISOString(),
    lastPublishedAt: new Date(last).toISOString(),
    region,
    regions,
    themes,
    places,
    actors,
    reliability,
    sources,
    score: Math.round(score * 10) / 10,
    relatedDossier: null,
  };
}
