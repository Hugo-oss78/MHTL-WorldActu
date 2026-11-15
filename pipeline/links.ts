import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { LinkStatusFile, SourceRef } from '../src/lib/types';
import { DOSSIERS } from '../src/content/dossiers';
import { HISTORY } from '../src/content/history';
import { CULTURE } from '../src/content/culture';
import { USER_AGENT } from './rss';

/**
 * Vérifie un lien. Retourne true (accessible), false (cassé : 404/410/5xx/erreur réseau)
 * ou null (indéterminé : le site refuse les robots, 401/403/429).
 */
export async function checkUrl(url: string): Promise<{ ok: boolean | null; status: number | null }> {
  for (const method of ['HEAD', 'GET'] as const) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': USER_AGENT } });
      if (res.ok) return { ok: true, status: res.status };
      if ([401, 403, 429].includes(res.status)) return { ok: null, status: res.status };
      if (method === 'HEAD' && [405, 400, 501].includes(res.status)) continue;
      return { ok: false, status: res.status };
    } catch {
      if (method === 'GET') return { ok: false, status: null };
    } finally {
      clearTimeout(t);
    }
  }
  return { ok: null, status: null };
}

export async function checkLinks(sources: SourceRef[]): Promise<void> {
  const queue = [...sources];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const s = queue.shift()!;
        s.linkOk = (await checkUrl(s.url)).ok;
      }
    }),
  );
}

/** Vérification hebdomadaire des liens cités dans les fiches éditoriales. */
export async function checkContentLinks(dataDir: string): Promise<void> {
  const urls = [
    ...new Set([...DOSSIERS.flatMap((d) => d.sources), ...HISTORY.flatMap((h) => h.sources), ...CULTURE.flatMap((c) => c.sources)].map((r) => r.url)),
  ];
  const out: LinkStatusFile = { checkedAt: new Date().toISOString(), links: {} };
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const url = queue.shift()!;
        const r = await checkUrl(url);
        out.links[url] = { ok: r.ok !== false, status: r.status, checkedAt: new Date().toISOString() };
      }
    }),
  );
  await writeFile(path.join(dataDir, 'link-status.json'), JSON.stringify(out));
  const broken = Object.entries(out.links).filter(([, v]) => !v.ok);
  console.log(`Liens éditoriaux vérifiés : ${urls.length}, cassés : ${broken.length}`);
  for (const [u, v] of broken) console.log(`  ✗ ${v.status ?? 'erreur'} ${u}`);
}
