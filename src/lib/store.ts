import { useSyncExternalStore } from 'react';
import type { QuizQuestion } from './types';
import { parisDate } from './daily';

/** Toutes les données personnelles restent dans le navigateur (localStorage). Aucune donnée n'est envoyée à un serveur. */
export interface QuizAttempt {
  qid: string;
  theme: QuizQuestion['theme'];
  correct: boolean;
  at: string;
  date: string;
  mode: 'daily' | 'weekly' | 'review' | 'practice';
}

export interface SrsCard {
  box: number; // 1 à 5 (système de Leitner)
  due: string; // AAAA-MM-JJ
  last: string;
  question: QuizQuestion; // copie, pour pouvoir réviser une question d'actualité ensuite disparue
}

export interface SavedItem {
  id: string;
  kind: 'article' | 'dossier' | 'histoire' | 'culture' | 'concept' | 'pays';
  title: string;
  url: string; // lien interne (#/…) ou externe
  at: string;
}

export interface AiConfig {
  enabled: boolean;
  endpoint: string;
  model: string;
  apiKey: string;
}

export interface AtlasState {
  version: 1;
  theme: 'system' | 'light' | 'dark';
  textSize: 'normal' | 'large';
  days: string[];
  read: Record<string, SavedItem>;
  saved: Record<string, SavedItem>;
  studied: Record<string, SavedItem>;
  toReview: Record<string, SavedItem>;
  attempts: QuizAttempt[];
  srs: Record<string, SrsCard>;
  quizDone: Record<string, { score: number; total: number; mode: 'daily' | 'weekly' }>;
  briefingDone: Record<string, string[]>; // date -> sections terminées
  ai: AiConfig;
}

const KEY = 'atlas:v1';

export const DEFAULT_STATE: AtlasState = {
  version: 1,
  theme: 'system',
  textSize: 'normal',
  days: [],
  read: {},
  saved: {},
  studied: {},
  toReview: {},
  attempts: [],
  srs: {},
  quizDone: {},
  briefingDone: {},
  ai: { enabled: false, endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: '', apiKey: '' },
};

function load(): AtlasState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<AtlasState>;
    return { ...DEFAULT_STATE, ...parsed, ai: { ...DEFAULT_STATE.ai, ...(parsed.ai ?? {}) } };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let state: AtlasState = load();
let storageOk = true;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOk = true;
  } catch {
    storageOk = false; // navigation privée ou stockage plein : l'application continue en mémoire
  }
}

export function isStorageOk(): boolean {
  return storageOk;
}

export function getState(): AtlasState {
  return state;
}

export function update(fn: (s: AtlasState) => AtlasState): void {
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}

export function useStore<T>(selector: (s: AtlasState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
  );
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

// — Actions

export function markDay(): void {
  const d = parisDate();
  if (!state.days.includes(d)) update((s) => ({ ...s, days: [...s.days, d] }));
}

export function toggleSaved(item: Omit<SavedItem, 'at'>): void {
  update((s) => {
    const saved = { ...s.saved };
    if (saved[item.id]) delete saved[item.id];
    else saved[item.id] = { ...item, at: new Date().toISOString() };
    return { ...s, saved };
  });
}

export function markRead(item: Omit<SavedItem, 'at'>): void {
  if (state.read[item.id]) return;
  update((s) => ({ ...s, read: { ...s.read, [item.id]: { ...item, at: new Date().toISOString() } } }));
}

export function markStudied(item: Omit<SavedItem, 'at'>): void {
  update((s) => ({ ...s, studied: { ...s.studied, [item.id]: { ...item, at: new Date().toISOString() } } }));
}

export function toggleToReview(item: Omit<SavedItem, 'at'>): void {
  update((s) => {
    const toReview = { ...s.toReview };
    if (toReview[item.id]) delete toReview[item.id];
    else toReview[item.id] = { ...item, at: new Date().toISOString() };
    return { ...s, toReview };
  });
}

export function markBriefingSection(date: string, section: string): void {
  const done = state.briefingDone[date] ?? [];
  if (done.includes(section)) return;
  update((s) => ({ ...s, briefingDone: { ...s.briefingDone, [date]: [...done, section] } }));
}

export function exportData(): string {
  const { ai, ...rest } = state;
  // La clé d'API n'est jamais exportée.
  return JSON.stringify({ ...rest, ai: { ...ai, apiKey: '' }, exportedAt: new Date().toISOString(), app: 'ATLAS' }, null, 2);
}

export function importData(json: string): void {
  const parsed = JSON.parse(json) as Partial<AtlasState> & { app?: string };
  if (parsed.app !== 'ATLAS' || parsed.version !== 1) throw new Error('Fichier non reconnu : il doit provenir de l’export ATLAS.');
  update(() => ({ ...DEFAULT_STATE, ...parsed, ai: { ...DEFAULT_STATE.ai, ...(parsed.ai ?? {}), apiKey: state.ai.apiKey } }));
}

export function resetData(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  state = { ...DEFAULT_STATE };
  listeners.forEach((l) => l());
}
