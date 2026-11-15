import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CountriesFile, CountryData } from '../src/lib/types';
import { COUNTRIES } from '../src/lib/gazetteer';
import { normalize } from '../src/lib/text';
import { USER_AGENT } from './rss';
import { checkContentLinks } from './links';

/** Indicateurs Banque mondiale (sources citées dans l'application). */
export const INDICATORS: Record<string, { label: string; source: string }> = {
  'SP.POP.TOTL': { label: 'Population', source: 'Banque mondiale' },
  'NY.GDP.MKTP.CD': { label: 'PIB (dollars courants)', source: 'Banque mondiale' },
  'NY.GDP.PCAP.CD': { label: 'PIB par habitant (dollars courants)', source: 'Banque mondiale' },
  'NY.GDP.MKTP.KD.ZG': { label: 'Croissance du PIB (%)', source: 'Banque mondiale' },
  'MS.MIL.XPND.CD': { label: 'Dépenses militaires (dollars courants)', source: 'Banque mondiale, d’après le SIPRI' },
  'MS.MIL.XPND.GD.ZS': { label: 'Dépenses militaires (% du PIB)', source: 'Banque mondiale, d’après le SIPRI' },
  'MS.MIL.TOTL.P1': { label: 'Effectifs des forces armées', source: 'Banque mondiale, d’après l’IISS' },
};

const KEY_ORGS: [string, string][] = [
  ['organisation du traite de l atlantique nord', 'OTAN'],
  ['union europeenne', 'Union européenne'],
  ['organisation des nations unies', 'ONU'],
  ['groupe des sept', 'G7'],
  ['g7', 'G7'],
  ['g20', 'G20'],
  ['groupe des vingt', 'G20'],
  ['brics', 'BRICS'],
  ['organisation de cooperation de shanghai', 'Organisation de coopération de Shanghai'],
  ['organisation du traite de securite collective', 'OTSC'],
  ['union africaine', 'Union africaine'],
  ['ligue arabe', 'Ligue arabe'],
  ['ligue des etats arabes', 'Ligue arabe'],
  ['association des nations de l asie du sud est', 'ASEAN'],
  ['organisation des pays exportateurs de petrole', 'OPEP'],
  ['conseil de l europe', "Conseil de l'Europe"],
  ['commonwealth', 'Commonwealth'],
  ['organisation internationale de la francophonie', 'Francophonie (OIF)'],
  ['mercosur', 'Mercosur'],
  ['communaute economique des etats de l afrique de l ouest', 'CEDEAO'],
  ['conseil de cooperation du golfe', 'Conseil de coopération du Golfe'],
  ['organisation mondiale du commerce', 'OMC'],
  ['communaute des etats independants', 'CEI'],
];

async function sparql<T>(query: string): Promise<T[]> {
  const res = await fetch(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/sparql-results+json' },
  });
  if (!res.ok) throw new Error(`Wikidata HTTP ${res.status}`);
  const json = (await res.json()) as { results: { bindings: Record<string, { value: string }>[] } };
  return json.results.bindings.map((b) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.value])) as T);
}

const qid = (uri: string) => uri.split('/').pop() ?? uri;

export async function updateCountries(dataDir: string): Promise<CountriesFile> {
  const values = COUNTRIES.map((c) => `"${c.iso3}"`).join(' ');
  const base = `VALUES ?iso3 { ${values} } ?country wdt:P298 ?iso3. FILTER NOT EXISTS { ?country wdt:P576 [] }`;
  const rows = await sparql<Record<string, string>>(`
    SELECT ?iso3 ?country ?countryLabel ?iso2 ?capitalLabel ?govLabel ?hos ?hosLabel ?hog ?hogLabel WHERE {
      ${base}
      OPTIONAL { ?country wdt:P297 ?iso2 }
      OPTIONAL { ?country wdt:P36 ?capital }
      OPTIONAL { ?country wdt:P122 ?gov }
      OPTIONAL { ?country p:P35 ?s1. ?s1 ps:P35 ?hos; wikibase:rank ?r1. FILTER(?r1 != wikibase:DeprecatedRank) FILTER NOT EXISTS { ?s1 pq:P582 [] } }
      OPTIONAL { ?country p:P6 ?s2. ?s2 ps:P6 ?hog; wikibase:rank ?r2. FILTER(?r2 != wikibase:DeprecatedRank) FILTER NOT EXISTS { ?s2 pq:P582 [] } }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
    }`);
  const members = await sparql<Record<string, string>>(`
    SELECT ?iso3 ?orgLabel WHERE {
      ${base}
      ?country p:P463 ?st. ?st ps:P463 ?org. FILTER NOT EXISTS { ?st pq:P582 [] }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
    }`);

  const out: Record<string, CountryData> = {};
  for (const r of rows) {
    const c = (out[r.iso3] ??= {
      iso3: r.iso3,
      iso2: r.iso2 ?? null,
      name: COUNTRIES.find((x) => x.iso3 === r.iso3)?.name ?? r.countryLabel,
      wikidata: qid(r.country),
      government: [],
      headOfState: [],
      headOfGovernment: [],
      capital: r.capitalLabel ?? null,
      memberOf: [],
      indicators: {},
    });
    if (r.govLabel && !c.government.includes(r.govLabel)) c.government.push(r.govLabel);
    if (r.hos && !c.headOfState.some((p) => p.qid === qid(r.hos))) c.headOfState.push({ name: r.hosLabel, qid: qid(r.hos) });
    if (r.hog && !c.headOfGovernment.some((p) => p.qid === qid(r.hog))) c.headOfGovernment.push({ name: r.hogLabel, qid: qid(r.hog) });
  }
  for (const m of members) {
    const c = out[m.iso3];
    if (!c || !m.orgLabel) continue;
    const n = normalize(m.orgLabel);
    const hit = KEY_ORGS.find(([k]) => n.includes(` ${k} `));
    if (hit && !c.memberOf.includes(hit[1])) c.memberOf.push(hit[1]);
  }

  for (const ind of Object.keys(INDICATORS)) {
    try {
      const res = await fetch(`https://api.worldbank.org/v2/country/all/indicator/${ind}?format=json&mrnev=1&per_page=500`, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const [, data] = (await res.json()) as [unknown, { countryiso3code: string; date: string; value: number | null }[] | null];
      for (const row of data ?? []) {
        const c = out[row.countryiso3code];
        if (c && row.value != null) c.indicators[ind] = { value: row.value, year: row.date };
      }
    } catch (e) {
      console.warn(`Indicateur ${ind} indisponible :`, (e as Error).message);
    }
  }

  const file: CountriesFile = {
    generatedAt: new Date().toISOString(),
    sources: [
      { label: 'Wikidata (régime, dirigeants, capitale, organisations)', url: 'https://www.wikidata.org' },
      { label: 'Banque mondiale — Indicateurs du développement', url: 'https://data.worldbank.org' },
      { label: 'SIPRI — dépenses militaires (via la Banque mondiale)', url: 'https://www.sipri.org/databases/milex' },
    ],
    countries: out,
  };
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, 'countries.json'), JSON.stringify(file));
  console.log(`Données pays : ${Object.keys(out).length} pays`);
  try {
    await checkContentLinks(dataDir);
  } catch (e) {
    console.warn('Vérification des liens éditoriaux impossible :', (e as Error).message);
  }
  return file;
}

// Exécution directe : `npm run pipeline:countries`
if (process.argv[1]?.endsWith('countries.ts')) {
  updateCountries(process.env.ATLAS_DATA_DIR ?? 'public/data').catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
