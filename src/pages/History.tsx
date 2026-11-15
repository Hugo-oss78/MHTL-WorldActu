import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HISTORY } from '../content/history';
import { HISTORY_TYPE_LABELS, PERIOD_LABELS, type HistoryType, type Period } from '../content/types';
import { COUNTRY_BY_ISO3 } from '../lib/gazetteer';
import { normalize } from '../lib/text';
import { useStore } from '../lib/store';
import Timeline from '../components/Timeline';
import { Card, Empty, PageHeader, Pill, RowLink, Tabs } from '../components/ui';

export default function History() {
  const [params, setParams] = useSearchParams();
  const view = (params.get('vue') as 'liste' | 'chronologie') ?? 'liste';
  const [period, setPeriod] = useState<Period | ''>('');
  const [type, setType] = useState<HistoryType | ''>('');
  const [civ, setCiv] = useState('');
  const [country, setCountry] = useState('');
  const [q, setQ] = useState('');
  const studied = useStore((s) => s.studied);

  const civs = useMemo(() => [...new Set(HISTORY.map((h) => h.civilisation))].sort((a, b) => a.localeCompare(b, 'fr')), []);
  const countries = useMemo(() => [...new Set(HISTORY.flatMap((h) => h.countries))].filter((c) => COUNTRY_BY_ISO3[c]).sort((a, b) => COUNTRY_BY_ISO3[a].name.localeCompare(COUNTRY_BY_ISO3[b].name, 'fr')), []);

  const list = useMemo(() => {
    const n = normalize(q).trim();
    return HISTORY.filter(
      (h) =>
        (!period || h.period === period) &&
        (!type || h.type === type) &&
        (!civ || h.civilisation === civ) &&
        (!country || h.countries.includes(country)) &&
        (!n || normalize(`${h.title} ${h.contexte} ${h.personnages.map((p) => p.name).join(' ')}`).includes(n)),
    ).sort((a, b) => a.year - b.year);
  }, [period, type, civ, country, q]);

  const select = 'rounded-full border border-line bg-card px-3 py-1.5 text-sm max-w-full';

  return (
    <div>
      <PageHeader title="Histoire" subtitle={`${HISTORY.length} fiches, de l'Antiquité à nos jours`} right={<Link to="/culture" className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:text-ink">Culture générale →</Link>} />
      <Tabs
        value={view}
        onChange={(v) => setParams(v === 'liste' ? {} : { vue: v }, { replace: true })}
        options={[
          { value: 'liste', label: 'Bibliothèque' },
          { value: 'chronologie', label: 'Chronologie' },
        ]}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <select className={select} value={period} onChange={(e) => setPeriod(e.target.value as Period | '')} aria-label="Époque">
          <option value="">Toutes les époques</option>
          {Object.entries(PERIOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={select} value={type} onChange={(e) => setType(e.target.value as HistoryType | '')} aria-label="Type">
          <option value="">Tous les types</option>
          {Object.entries(HISTORY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={select} value={civ} onChange={(e) => setCiv(e.target.value)} aria-label="Civilisation">
          <option value="">Toutes les civilisations</option>
          {civs.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={select} value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Pays">
          <option value="">Tous les pays</option>
          {countries.map((c) => <option key={c} value={c}>{COUNTRY_BY_ISO3[c].name}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Personnage, événement…" className="min-w-0 flex-1 rounded-full border border-line bg-card px-3 py-1.5 text-[16px] sm:text-sm" aria-label="Rechercher" />
      </div>
      {list.length === 0 ? (
        <Empty title="Aucune fiche ne correspond" />
      ) : view === 'chronologie' ? (
        <Card>
          <Timeline items={list.map((h) => ({ year: h.year, label: h.title, sub: `${h.dateLabel} · ${PERIOD_LABELS[h.period]}`, to: `/histoire/fiche/${h.id}` }))} />
        </Card>
      ) : (
        <Card>
          {list.map((h) => (
            <RowLink
              key={h.id}
              to={`/histoire/fiche/${h.id}`}
              title={h.title}
              meta={`${h.dateLabel} · ${PERIOD_LABELS[h.period]} · ${HISTORY_TYPE_LABELS[h.type]}`}
              right={studied[`histoire:${h.id}`] ? <Pill tone="ok">Étudiée</Pill> : undefined}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
