import { useState } from 'react';
import type { NewsCluster } from '../lib/types';
import { flag } from '../lib/gazetteer';
import { formatDate } from '../lib/format';
import { RELIABILITY } from './Reliability';

const dateFr = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso)) : 'date inconnue';

const DOT: Record<string, string> = { ok: 'bg-ok', accent: 'bg-accent', warn: 'bg-warn', bad: 'bg-bad', info: 'bg-info' };

function parts(c: NewsCluster) {
  // Source citée : un autre média que celui du titre principal (seconde formulation), sinon la source unique.
  const main = c.sources.find((s) => s.title === c.title) ?? c.sources[0];
  const lead = c.sources.find((s) => s.group !== main?.group && s.title !== c.title) ?? main;
  const showTitle = !!lead && lead.title !== c.title;
  const others = [...new Set(c.sources.filter((s) => s.sourceName !== lead?.sourceName).map((s) => s.sourceName))];
  const flags = c.places.slice(0, 3).map(flag).filter(Boolean).join(' ');
  return { lead, showTitle, others, flags };
}

/** Texte prêt à partager, au format « liste numérotée + sources ». */
export function briefingText(date: string, clusters: NewsCluster[]): string {
  const lines = [`Briefing du ${formatDate(date)}`, ''];
  clusters.forEach((c, i) => {
    const { lead, showTitle, others, flags } = parts(c);
    lines.push(`${i + 1}. ${flags ? `${flags} ` : ''}${c.title}`);
    if (lead) lines.push(`   • ${lead.sourceName}${showTitle ? ` — « ${lead.title} »` : ''} (${dateFr(lead.publishedAt)})`);
    if (others.length) lines.push(`   • ${others.slice(0, 3).join(', ')}${others.length > 3 ? ` +${others.length - 3}` : ''}`);
    lines.push(`   [${RELIABILITY[c.reliability.level].label}]`, '');
  });
  lines.push('Source : ATLAS — recoupement automatique de flux RSS publics.');
  return lines.join('\n');
}

export default function BriefFlash({ date, clusters, onOpen }: { date: string; clusters: NewsCluster[]; onOpen: (index: number) => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const share = async () => {
    const text = briefingText(date, clusters);
    try {
      if (navigator.share) await navigator.share({ title: `Briefing du ${formatDate(date)}`, text });
      else {
        await navigator.clipboard.writeText(text);
        setMsg('Briefing copié dans le presse-papiers.');
      }
    } catch {
      /* partage annulé */
    }
  };
  return (
    <div className="rounded-2xl border border-line bg-card">
      <ol className="divide-y divide-line">
        {clusters.map((c, i) => {
          const { lead, showTitle, others, flags } = parts(c);
          const r = RELIABILITY[c.reliability.level];
          return (
            <li key={c.id} className="flex gap-3 px-4 py-3 sm:px-5">
              <span className="w-6 shrink-0 pt-0.5 text-right font-serif text-lg font-semibold tabular-nums text-muted">{i + 1}.</span>
              <div className="min-w-0 flex-1">
                <button onClick={() => onOpen(i)} className="text-left font-semibold leading-snug hover:text-accent">
                  {flags && <span className="mr-1.5" aria-hidden>{flags}</span>}
                  {c.title}
                </button>
                {lead && (
                  <div className="mt-1 text-sm text-muted">
                    •{' '}
                    <a href={lead.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">
                      <span className="font-medium text-ink">{lead.sourceName}</span>
                      {showTitle && <> — « {lead.title} »</>} ({dateFr(lead.publishedAt)})
                    </a>
                  </div>
                )}
                {others.length > 0 && (
                  <div className="text-sm text-muted">
                    • {others.slice(0, 3).join(', ')}
                    {others.length > 3 && ` +${others.length - 3}`}
                  </div>
                )}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted" title={r.help}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT[r.tone]}`} /> {r.label}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3 sm:px-5">
        <button onClick={() => void share()} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
          Partager le briefing
        </button>
        {msg && <span className="text-sm text-accent">{msg}</span>}
      </div>
    </div>
  );
}
