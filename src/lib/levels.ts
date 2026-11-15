import type { AtlasState } from './store';
import type { QuizQuestion } from './types';

export const THEME_LABELS: Record<QuizQuestion['theme'], string> = {
  actualite: 'Actualité',
  geopolitique: 'Géopolitique',
  histoire: 'Histoire',
  culture: 'Culture générale',
  concepts: 'Concepts',
};

export interface Level {
  name: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  next: string | null;
}

/**
 * Niveau calculé uniquement à partir des résultats réels aux quiz :
 * nombre de réponses, taux de réussite récent et nombre de questions maîtrisées
 * (boîte ≥ 4 en répétition espacée, c'est-à-dire réussies plusieurs fois à des jours d'intervalle).
 */
export function computeLevel(s: AtlasState): Level & { answers: number; accuracy: number; mastered: number } {
  const answers = s.attempts.length;
  const recent = s.attempts.slice(-200);
  const accuracy = recent.length ? recent.filter((a) => a.correct).length / recent.length : 0;
  const mastered = Object.values(s.srs).filter((c) => c.box >= 4).length;
  const pct = (x: number) => `${Math.round(x * 100)} %`;
  if (answers >= 400 && accuracy >= 0.82 && mastered >= 120) return { name: 'Expert', next: null, answers, accuracy, mastered };
  if (answers >= 150 && accuracy >= 0.72 && mastered >= 30)
    return { name: 'Avancé', next: `Expert : 400 réponses, ${pct(0.82)} de réussite récente et 120 questions maîtrisées`, answers, accuracy, mastered };
  if (answers >= 40 && accuracy >= 0.6)
    return { name: 'Intermédiaire', next: `Avancé : 150 réponses, ${pct(0.72)} de réussite récente et 30 questions maîtrisées`, answers, accuracy, mastered };
  return { name: 'Débutant', next: `Intermédiaire : 40 réponses et ${pct(0.6)} de réussite récente`, answers, accuracy, mastered };
}

export function themeStats(s: AtlasState) {
  return (Object.keys(THEME_LABELS) as QuizQuestion['theme'][]).map((theme) => {
    const list = s.attempts.filter((a) => a.theme === theme);
    const correct = list.filter((a) => a.correct).length;
    const acc = list.length ? correct / list.length : null;
    const status = list.length < 5 ? 'insuffisant' : acc! >= 0.8 && list.length >= 10 ? 'maitrise' : acc! < 0.6 ? 'a-approfondir' : 'en-cours';
    return { theme, label: THEME_LABELS[theme], total: list.length, correct, acc, status };
  });
}

export function streak(days: string[], today: string): number {
  const set = new Set(days);
  let n = 0;
  const d = new Date(`${today}T12:00:00Z`);
  while (set.has(d.toISOString().slice(0, 10))) {
    n++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}
