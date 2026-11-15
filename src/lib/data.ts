import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Briefing, BriefingIndexEntry, CountriesFile, LatestData, LinkStatusFile, RunStatus } from './types';

const BASE = `${import.meta.env.BASE_URL}data/`;

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface DataState {
  status: Status;
  latest: LatestData | null;
  run: RunStatus | null;
  error: string | null;
  fetchedAt: number | null;
}

let ds: DataState = { status: 'idle', latest: null, run: null, error: null, fetchedAt: null };
const listeners = new Set<() => void>();
const set = (patch: Partial<DataState>) => {
  ds = { ...ds, ...patch };
  listeners.forEach((l) => l());
};

async function getJson<T>(file: string, bust = false): Promise<T> {
  const res = await fetch(`${BASE}${file}${bust ? `?t=${Date.now()}` : ''}`, { cache: bust ? 'no-store' : 'default' });
  if (!res.ok) throw new Error(res.status === 404 ? 'Aucune donnée publiée pour le moment.' : `Erreur ${res.status}`);
  return (await res.json()) as T;
}

/** Charge (ou recharge) les dernières données publiées par le pipeline. */
export async function loadLatest(force = false): Promise<void> {
  if (ds.status === 'loading') return;
  set({ status: 'loading', error: null });
  try {
    const [latest, run] = await Promise.all([
      getJson<LatestData>('latest.json', force),
      getJson<RunStatus>('status.json', force).catch(() => null),
    ]);
    if (latest.schema !== 1) throw new Error('Format de données inattendu.');
    set({ status: 'ready', latest, run, fetchedAt: Date.now() });
  } catch (e) {
    // Hors ligne : le service worker sert la dernière version en cache si elle existe.
    set({ status: 'error', error: (e as Error).message });
  }
}

export function useLatest(): DataState {
  const snapshot = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ds,
  );
  useEffect(() => {
    if (ds.status === 'idle') void loadLatest();
  }, []);
  return snapshot;
}

/** Petit chargeur générique pour les fichiers secondaires. */
function useJson<T>(file: string | null): { data: T | null; error: string | null; loading: boolean } {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({ data: null, error: null, loading: !!file });
  useEffect(() => {
    if (!file) return;
    let alive = true;
    setState({ data: null, error: null, loading: true });
    getJson<T>(file)
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((e: Error) => alive && setState({ data: null, error: e.message, loading: false }));
    return () => {
      alive = false;
    };
  }, [file]);
  return state;
}

export const useCountries = () => useJson<CountriesFile>('countries.json');
export const useLinkStatus = () => useJson<LinkStatusFile>('link-status.json');
export const useBriefingIndex = () => useJson<BriefingIndexEntry[]>('briefings/index.json');
export const useArchivedBriefing = (date: string | null) => useJson<Briefing>(date ? `briefings/${date}.json` : null);
