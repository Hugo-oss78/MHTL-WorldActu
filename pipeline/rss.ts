import { XMLParser } from 'fast-xml-parser';
import { stripHtml, truncate } from '../src/lib/text';
import type { FeedSource } from './sources';

export interface RawItem {
  source: FeedSource;
  title: string;
  url: string;
  summary: string;
  publishedAt: string | null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  processEntities: true,
  htmlEntities: true,
});

function text(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return text(v[0]);
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if ('#text' in o) return text(o['#text']);
    if ('@_href' in o) return text(o['@_href']);
  }
  return '';
}

function link(v: unknown): string {
  if (Array.isArray(v)) {
    const alt = v.find((l) => typeof l === 'object' && l && ((l as Record<string, unknown>)['@_rel'] ?? 'alternate') === 'alternate');
    return link(alt ?? v[0]);
  }
  if (v && typeof v === 'object' && '@_href' in (v as Record<string, unknown>)) return String((v as Record<string, unknown>)['@_href']);
  return text(v).trim();
}

function parseDate(v: string): string | null {
  if (!v) return null;
  const d = new Date(v.trim());
  if (Number.isNaN(d.getTime())) return null;
  // Rejette les dates dans le futur (au-delà de 2 h de tolérance) : probablement erronées.
  if (d.getTime() > Date.now() + 2 * 3600_000) return null;
  return d.toISOString();
}

export function parseFeed(xml: string, source: FeedSource): RawItem[] {
  const doc = parser.parse(xml) as Record<string, any>;
  let entries: any[] = [];
  if (doc.rss?.channel) entries = [].concat(doc.rss.channel.item ?? []);
  else if (doc.feed) entries = [].concat(doc.feed.entry ?? []);
  else if (doc['rdf:RDF']) entries = [].concat(doc['rdf:RDF'].item ?? []);
  return entries
    .map((e) => {
      const title = stripHtml(text(e.title));
      const url = link(e.link) || text(e.guid);
      const summary = truncate(stripHtml(text(e.description ?? e.summary ?? e['content:encoded'] ?? e.content)), 420);
      const publishedAt = parseDate(text(e.pubDate ?? e['dc:date'] ?? e.published ?? e.updated));
      return { source, title, url, summary, publishedAt };
    })
    .filter((i) => i.title.length > 8 && /^https?:\/\//.test(i.url));
}

export const USER_AGENT = 'ATLAS-veille-personnelle/1.0 (+lecture de flux RSS publics)';

export async function fetchText(url: string, timeoutMs = 20000): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}
