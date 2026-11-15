import type { ReliabilityLevel, StatementType } from '../lib/types';
import { Pill } from './ui';

export const RELIABILITY: Record<ReliabilityLevel, { label: string; tone: 'ok' | 'accent' | 'warn' | 'bad' | 'info'; help: string }> = {
  confirme: { label: 'Confirmé par plusieurs sources', tone: 'ok', help: 'Au moins trois origines indépendantes rapportent cette information.' },
  partiel: { label: 'Corroboré partiellement', tone: 'accent', help: 'Deux origines indépendantes rapportent cette information.' },
  non_confirme: { label: 'Non confirmé', tone: 'warn', help: 'Une seule origine identifiée : pas de recoupement indépendant.' },
  contradictoire: { label: 'Informations contradictoires', tone: 'bad', help: 'Des sources indépendantes rapportent des éléments divergents (par ex. des bilans chiffrés).' },
  analyse: { label: 'Analyse ou hypothèse', tone: 'info', help: 'Contenu d’analyse (think tank, tribune) : ce n’est pas un fait rapporté.' },
};

export function ReliabilityBadge({ level }: { level: ReliabilityLevel }) {
  const r = RELIABILITY[level];
  return (
    <Pill tone={r.tone} title={r.help}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {r.label}
    </Pill>
  );
}

export const STATEMENT: Record<StatementType, { label: string; tone: 'neutral' | 'accent' | 'warn' | 'info' }> = {
  fait: { label: 'Fait rapporté', tone: 'neutral' },
  declaration: { label: 'Déclaration', tone: 'accent' },
  accusation: { label: 'Accusation', tone: 'warn' },
  hypothese: { label: 'Hypothèse / conditionnel', tone: 'info' },
};

export function StatementBadge({ type }: { type: StatementType }) {
  const s = STATEMENT[type];
  return <Pill tone={s.tone}>{s.label}</Pill>;
}

export function ReliabilityLegend() {
  return (
    <ul className="space-y-2 text-sm">
      {(Object.keys(RELIABILITY) as ReliabilityLevel[]).map((k) => (
        <li key={k} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="sm:w-64">
            <ReliabilityBadge level={k} />
          </span>
          <span className="text-muted">{RELIABILITY[k].help}</span>
        </li>
      ))}
    </ul>
  );
}
