import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconAlert, IconChevron, IconExternal } from './Icons';

export function Card({ children, className = '', as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'section' }) {
  return <As className={`rounded-2xl border border-line bg-card p-4 sm:p-5 ${className}`}>{children}</As>;
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function SectionTitle({ kicker, title, right, id }: { kicker?: string; title: string; right?: ReactNode; id?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3" id={id}>
      <div>
        {kicker && <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{kicker}</div>}
        <h2 className="font-serif text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function Pill({ children, tone = 'neutral', title }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'ok' | 'warn' | 'bad' | 'info'; title?: string }) {
  const tones = {
    neutral: 'border-line text-muted',
    accent: 'border-accent/30 bg-accent-soft text-accent',
    ok: 'border-ok/30 text-ok',
    warn: 'border-warn/30 text-warn',
    bad: 'border-bad/30 text-bad',
    info: 'border-info/30 text-info',
  } as const;
  return (
    <span title={title} className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'bad' }) {
  const tones = { info: 'border-line bg-card text-muted', warn: 'border-warn/40 bg-warn/5 text-ink', bad: 'border-bad/40 bg-bad/5 text-ink' } as const;
  return (
    <div className={`flex gap-2 rounded-xl border px-3 py-2.5 text-sm ${tones[tone]}`}>
      {tone !== 'info' && <IconAlert size={18} className={tone === 'bad' ? 'mt-0.5 shrink-0 text-bad' : 'mt-0.5 shrink-0 text-warn'} />}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-accent underline-offset-2 hover:underline ${className}`}>
      {children}
      <IconExternal />
    </a>
  );
}

export function RowLink({ to, title, meta, right }: { to: string; title: ReactNode; meta?: ReactNode; right?: ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0 hover:text-accent">
      <div className="min-w-0 flex-1">
        <div className="font-medium leading-snug">{title}</div>
        {meta && <div className="mt-0.5 text-xs text-muted">{meta}</div>}
      </div>
      {right}
      <IconChevron size={16} className="shrink-0 text-muted" />
    </Link>
  );
}

export function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <div className="flex w-max gap-1.5" role="tablist">
        {options.map((o) => (
          <button
            key={o.value}
            role="tab"
            aria-selected={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${value === o.value ? 'border-ink bg-ink text-paper' : 'border-line bg-card text-muted hover:text-ink'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
      <div className="font-medium">{title}</div>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Prose({ text }: { text: string }) {
  return (
    <div className="prose-atlas text-[15px]">
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
