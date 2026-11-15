import { parisDate } from './daily';
import { getState, update, type QuizAttempt } from './store';
import type { QuizQuestion } from './types';

/** Intervalles (en jours) du système de Leitner : boîte 1 → 1 jour … boîte 5 → 30 jours. */
export const BOX_INTERVALS = [0, 1, 3, 7, 14, 30];

function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Enregistre une réponse et planifie la prochaine révision. */
export function recordAnswer(q: QuizQuestion, correct: boolean, mode: QuizAttempt['mode']): void {
  const today = parisDate();
  update((s) => {
    const prev = s.srs[q.id];
    const box = correct ? Math.min(5, (prev?.box ?? 0) + 1) : 1;
    const attempt: QuizAttempt = { qid: q.id, theme: q.theme, correct, at: new Date().toISOString(), date: today, mode };
    return {
      ...s,
      attempts: [...s.attempts, attempt].slice(-5000),
      srs: { ...s.srs, [q.id]: { box, due: addDays(today, BOX_INTERVALS[box]), last: today, question: q } },
    };
  });
}

export function dueCards(date = parisDate()): QuizQuestion[] {
  return Object.values(getState().srs)
    .filter((c) => c.due <= date && c.box < 5)
    .sort((a, b) => a.box - b.box || a.due.localeCompare(b.due))
    .map((c) => c.question);
}

/** Quiz hebdomadaire : questions vues ces 7 derniers jours, en priorité celles ratées. */
export function weeklyQuestions(date = parisDate(), n = 10): QuizQuestion[] {
  const since = addDays(date, -7);
  const s = getState();
  const recent = s.attempts.filter((a) => a.date > since && a.mode !== 'weekly');
  const byQ = new Map<string, { wrong: number; total: number }>();
  for (const a of recent) {
    const v = byQ.get(a.qid) ?? { wrong: 0, total: 0 };
    v.total++;
    if (!a.correct) v.wrong++;
    byQ.set(a.qid, v);
  }
  return [...byQ.entries()]
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([id]) => s.srs[id]?.question)
    .filter((q): q is QuizQuestion => !!q)
    .slice(0, n);
}
