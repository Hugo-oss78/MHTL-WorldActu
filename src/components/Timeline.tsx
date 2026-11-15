import { Link } from 'react-router-dom';

export interface TimelineItem {
  year: number;
  label: string;
  sub?: string;
  to?: string;
  tone?: string;
}

const fmt = (y: number) => (y < 0 ? `${-y} av. J.-C.` : String(y));

/** Chronologie verticale, cliquable lorsque les éléments renvoient vers une fiche. */
export default function Timeline({ items }: { items: TimelineItem[] }) {
  const sorted = [...items].sort((a, b) => a.year - b.year);
  return (
    <ol className="relative ml-2 border-l border-line">
      {sorted.map((it, i) => {
        const content = (
          <>
            <div className="text-xs font-semibold tabular-nums text-accent">{fmt(it.year)}</div>
            <div className="font-medium leading-snug">{it.label}</div>
            {it.sub && <div className="text-xs text-muted">{it.sub}</div>}
          </>
        );
        return (
          <li key={`${it.year}-${i}`} className="relative pb-4 pl-5 last:pb-0">
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />
            {it.to ? (
              <Link to={it.to} className="block rounded-lg hover:text-accent">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
