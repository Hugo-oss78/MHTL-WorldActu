import { CONCEPTS } from '../content/concepts';
import { CULTURE } from '../content/culture';
import { DOSSIERS } from '../content/dossiers';
import { HISTORY } from '../content/history';
import { normalize, tokens } from './text';

export interface Passage {
  id: string;
  title: string;
  section: string;
  text: string;
  link: string; // route interne
  kind: 'dossier' | 'histoire' | 'concept' | 'culture';
}

const SECTION_LABELS: Record<string, string> = {
  situation: 'Présentation de la situation',
  histoire: 'Contexte historique',
  acteurs: 'Acteurs impliqués',
  interets: 'Intérêts',
  alliances: 'Alliances et oppositions',
  rapports: 'Rapports de force',
  scenarios: 'Scénarios possibles (analyse)',
  europeFrance: "Conséquences pour l'Europe et la France",
};

function buildPassages(): Passage[] {
  const out: Passage[] = [];
  for (const d of DOSSIERS) {
    out.push({ id: `${d.id}-resume`, title: d.title, section: 'Résumé', text: `${d.summary} ${d.whyItMatters}`, link: `/geopolitique/dossier/${d.id}`, kind: 'dossier' });
    for (const [k, v] of Object.entries(d.sections))
      out.push({ id: `${d.id}-${k}`, title: d.title, section: SECTION_LABELS[k] ?? k, text: Array.isArray(v) ? v.join(' ') : v, link: `/geopolitique/dossier/${d.id}`, kind: 'dossier' });
  }
  for (const h of HISTORY)
    for (const [k, label] of [['contexte', 'Contexte'], ['deroulement', 'Déroulement'], ['consequences', 'Conséquences'], ['heritage', 'Héritage']] as const)
      out.push({ id: `${h.id}-${k}`, title: `${h.title} (${h.dateLabel})`, section: label, text: h[k], link: `/histoire/fiche/${h.id}`, kind: 'histoire' });
  for (const c of CONCEPTS)
    out.push({ id: c.id, title: c.term, section: 'Concept', text: `${c.definition} ${c.exemple} ${c.actualite}`, link: `/culture/concept/${c.id}`, kind: 'concept' });
  for (const f of CULTURE)
    out.push({ id: f.id, title: f.name, section: 'Culture générale', text: `${f.summary} ${f.keyIdeas.join('. ')} ${f.whyItMatters}`, link: `/culture/fiche/${f.id}`, kind: 'culture' });
  return out;
}

// Racinisation très simple du français/anglais (pluriels, quelques suffixes).
const stem = (t: string) => t.replace(/(iennes|iens|ienne|ien|ennes|enne|aises|aise|ais|ines|ine|ques|que|ions|ion|ments|ment|es|s|x)$/, '') || t;
const tok = (s: string) => tokens(s).map(stem);

let index: { passages: Passage[]; docs: string[][]; df: Map<string, number>; avg: number } | null = null;

function getIndex() {
  if (index) return index;
  const passages = buildPassages();
  const docs = passages.map((p) => tok(`${p.title} ${p.title} ${p.text}`));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
  const avg = docs.reduce((s, d) => s + d.length, 0) / docs.length;
  index = { passages, docs, df, avg };
  return index;
}

/** Recherche BM25 dans la bibliothèque d'ATLAS. */
export function searchKnowledge(query: string, limit = 5): Passage[] {
  const { passages, docs, df, avg } = getIndex();
  const q = [...new Set(tok(query))];
  if (!q.length) return [];
  const N = docs.length;
  const scored = docs.map((d, i) => {
    let s = 0;
    const len = d.length;
    for (const t of q) {
      const f = d.filter((x) => x === t).length;
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
      s += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (len / avg))));
    }
    return { p: passages[i], s };
  });
  const best = scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  // Diversité : au plus deux passages par fiche.
  const per = new Map<string, number>();
  const out: Passage[] = [];
  for (const { p } of best) {
    const n = per.get(p.link) ?? 0;
    if (n >= 2) continue;
    per.set(p.link, n + 1);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function highlight(text: string, query: string): string {
  const q = new Set(tok(query));
  return text
    .split(/(\s+)/)
    .map((w) => (q.has(stem(normalize(w).trim())) ? `**${w}**` : w))
    .join('');
}
