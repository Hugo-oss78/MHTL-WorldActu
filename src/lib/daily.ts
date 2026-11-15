import { CONCEPTS } from '../content/concepts';
import { DOSSIERS, DOSSIER_BY_ID } from '../content/dossiers';
import { HISTORY } from '../content/history';
import { QUESTION_BANK } from '../content/quiz';
import type { Concept, HistoryFiche, Period } from '../content/types';
import type { Briefing, NewsCluster, QuizQuestion } from './types';
import { normalize, seededRandom, shuffle } from './text';

const PERIOD_ORDER: Period[] = ['antiquite', 'moyen-age', 'empires', 'revolutions', 'napoleon', 'ww1', 'ww2', 'guerre-froide', 'contemporain'];

/** Date du jour à Paris, au format AAAA-MM-JJ. */
export function parisDate(d = new Date()): string {
  return new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function dayIndex(date: string): number {
  return Math.floor(Date.parse(`${date}T12:00:00Z`) / 86_400_000);
}

/** Histoire du jour : un anniversaire si une fiche correspond à la date, sinon rotation des périodes. */
export function historyOfDay(date: string): { fiche: HistoryFiche; anniversary: boolean } {
  const md = date.slice(5);
  const anniv = HISTORY.find((h) => h.monthDay === md);
  if (anniv) return { fiche: anniv, anniversary: true };
  const idx = dayIndex(date);
  const period = PERIOD_ORDER[idx % PERIOD_ORDER.length];
  const pool = HISTORY.filter((h) => h.period === period);
  return { fiche: pool[Math.floor(idx / PERIOD_ORDER.length) % pool.length], anniversary: false };
}

export function conceptOfDay(date: string): Concept {
  return CONCEPTS[dayIndex(date) % CONCEPTS.length];
}

/** Articles du jour en rapport avec une liste de mots-clés (recherche dans les titres et résumés). */
export function relatedClusters(keywords: string[], clusters: NewsCluster[], limit = 3): NewsCluster[] {
  const kws = keywords.map((k) => ` ${normalize(k).trim()} `);
  return clusters
    .map((c) => {
      const text = normalize(`${c.title} ${c.summary} ${c.sources.map((s) => s.title).join(' ')}`);
      return { c, hits: kws.filter((k) => text.includes(k)).length };
    })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.c.score - a.c.score)
    .slice(0, limit)
    .map((x) => x.c);
}

/** Dossier du décryptage : choisi par le pipeline selon l'actualité ; sinon rotation (signalée comme telle). */
export function decryptageOfDay(date: string, briefing: Briefing | null): { dossierId: string; reason: string; fromNews: boolean } {
  if (briefing?.decryptage && DOSSIER_BY_ID[briefing.decryptage.dossierId])
    return { dossierId: briefing.decryptage.dossierId, reason: briefing.decryptage.reason, fromNews: true };
  const d = DOSSIERS[dayIndex(date) % DOSSIERS.length];
  return { dossierId: d.id, reason: "Aucune actualité récente n'a pu être analysée : dossier choisi par rotation.", fromNews: false };
}

/** Quiz du jour : 5 questions (actualité, géopolitique, histoire, culture, concept), stable pour une date donnée. */
export function dailyQuiz(date: string, briefing: Briefing | null): QuizQuestion[] {
  const rnd = seededRandom(`quiz-${date}`);
  const { fiche } = historyOfDay(date);
  const concept = conceptOfDay(date);
  const dec = decryptageOfDay(date, briefing);
  const pick = (pred: (q: QuizQuestion) => boolean, exclude: Set<string>) => {
    const pool = QUESTION_BANK.filter((q) => pred(q) && !exclude.has(q.id));
    return pool.length ? shuffle(pool, rnd)[0] : null;
  };
  const used = new Set<string>();
  const out: QuizQuestion[] = [];
  const add = (q: QuizQuestion | null | undefined) => {
    if (q && !used.has(q.id)) {
      used.add(q.id);
      out.push(q);
    }
  };
  // 1. Actualité : question générée à partir du briefing (si disponible).
  add(briefing?.newsQuiz?.[0]);
  // 2. Géopolitique : en lien avec le décryptage du jour.
  add(pick((q) => q.id.startsWith(`d-${dec.dossierId}-`), used) ?? pick((q) => q.theme === 'geopolitique', used));
  // 3. Histoire : sur la fiche du jour.
  add(pick((q) => q.id.startsWith(`h-${fiche.id}-`), used));
  // 4. Culture générale.
  add(pick((q) => q.theme === 'culture', used));
  // 5. Concept du jour.
  add(pick((q) => q.id === `c-${concept.id}`, used) ?? pick((q) => q.theme === 'concepts', used));
  while (out.length < 5) add(pick((q) => q.theme === 'geopolitique' || q.theme === 'histoire', used));
  return out.slice(0, 5);
}
