import { useMemo, useState } from 'react';
import { useLatest } from '../lib/data';
import type { NewsCluster, ThemeId } from '../lib/types';
import { COUNTRY_BY_ISO3 } from '../lib/gazetteer';
import { normalize } from '../lib/text';
import { formatDateTime } from '../lib/format';
import NewsCard, { THEME_NAMES } from '../components/NewsCard';
import WorldMap from '../components/WorldMap';
import { Card, Empty, Notice, PageHeader, Pill, Tabs } from '../components/ui';
import { ReliabilityLegend } from '../components/Reliability';

type Tab = 'tout' | 'france' | 'europe' | 'moyen-orient' | 'ameriques' | 'asie' | 'afrique' | 'defense' | 'economie';
const TABS: { value: Tab; label: string }[] = [
  { value: 'tout', label: 'Tout' },
  { value: 'france', label: 'France' },
  { value: 'europe', label: 'Europe' },
  { value: 'moyen-orient', label: 'Moyen-Orient' },
  { value: 'ameriques', label: 'Amériques' },
  { value: 'asie', label: 'Asie' },
  { value: 'afrique', label: 'Afrique' },
  { value: 'defense', label: 'Défense et sécurité' },
  { value: 'economie', label: 'Économie mondiale' },
];

const PERIODS = [
  { value: 24, label: '24 h' },
  { value: 48, label: '48 h' },
  { value: 168, label: '7 jours' },
];

function matchTab(c: NewsCluster, tab: Tab): boolean {
  if (tab === 'tout') return true;
  if (tab === 'defense') return c.themes.some((t) => t === 'defense' || t === 'conflits' || t === 'securite');
  if (tab === 'economie') return c.themes.some((t) => t === 'economie' || t === 'energie');
  return c.region === tab || c.regions.includes(tab);
}

export default function News() {
  const { latest, status, error } = useLatest();
  const [tab, setTab] = useState<Tab>('tout');
  const [hours, setHours] = useState(48);
  const [theme, setTheme] = useState<ThemeId | ''>('');
  const [country, setCountry] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(25);
  const [legend, setLegend] = useState(false);

  const base = useMemo(() => {
    if (!latest) return [];
    const ref = Date.parse(latest.generatedAt);
    return latest.clusters.filter((c) => ref - Date.parse(c.lastPublishedAt) <= hours * 3600_000 && c.themes.length > 0);
  }, [latest, hours]);

  const filtered = useMemo(() => {
    const q = normalize(query).trim();
    return base.filter(
      (c) =>
        matchTab(c, tab) &&
        (!theme || c.themes.includes(theme)) &&
        (!country || c.places.includes(country)) &&
        (!q || normalize(`${c.title} ${c.summary} ${c.sources.map((s) => s.title).join(' ')}`).includes(` ${q}`)),
    );
  }, [base, tab, theme, country, query]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of base.filter((x) => matchTab(x, tab) && (!theme || x.themes.includes(theme)))) for (const p of c.places.slice(0, 2)) m[p] = (m[p] ?? 0) + 1;
    return m;
  }, [base, tab, theme]);

  return (
    <div>
      <PageHeader
        title="Actualité"
        subtitle={latest ? `Fil recoupé · actualisé le ${formatDateTime(latest.generatedAt)}` : 'Fil d’actualité recoupé'}
        right={
          <button onClick={() => setLegend((l) => !l)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:text-ink">
            Fiabilité ?
          </button>
        }
      />
      {legend && (
        <Card className="mb-4">
          <ReliabilityLegend />
        </Card>
      )}
      {status === 'error' && !latest && <Notice tone="warn">Actualité indisponible : {error}</Notice>}

      <Tabs value={tab} onChange={(v) => { setTab(v); setLimit(25); }} options={TABS} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-line bg-card p-0.5 text-sm">
          {PERIODS.map((p) => (
            <button key={p.value} onClick={() => setHours(p.value)} className={`rounded-full px-3 py-1 ${hours === p.value ? 'bg-accent-soft font-medium text-accent' : 'text-muted'}`}>
              {p.label}
            </button>
          ))}
        </div>
        <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeId | '')} className="rounded-full border border-line bg-card px-3 py-1.5 text-sm" aria-label="Thématique">
          <option value="">Toutes les thématiques</option>
          {Object.entries(THEME_NAMES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" className="min-w-0 flex-1 rounded-full border border-line bg-card px-3 py-1.5 text-[16px] sm:text-sm" aria-label="Rechercher dans l'actualité" />
      </div>

      {latest && (
        <Card className="mb-4 p-2 sm:p-3">
          <WorldMap counts={counts} selected={country} onSelect={setCountry} label="Carte des sujets d'actualité par pays" />
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 text-xs text-muted">
            <span>Touchez un pays pour filtrer. Intensité = nombre de sujets.</span>
            {country && (
              <button onClick={() => setCountry(null)}>
                <Pill tone="accent">{COUNTRY_BY_ISO3[country]?.name} ✕</Pill>
              </button>
            )}
          </div>
        </Card>
      )}

      <div className="mb-2 text-sm text-muted">
        {filtered.length} sujet{filtered.length > 1 ? 's' : ''}
      </div>
      {filtered.length === 0 && latest ? (
        <Empty title="Aucun sujet ne correspond à ces filtres">Élargissez la période ou changez de rubrique.</Empty>
      ) : (
        <div className="space-y-3">
          {filtered.slice(0, limit).map((c) => (
            <NewsCard key={c.id} cluster={c} />
          ))}
        </div>
      )}
      {filtered.length > limit && (
        <div className="mt-4 text-center">
          <button onClick={() => setLimit((l) => l + 25)} className="rounded-full border border-line px-4 py-2 text-sm hover:border-accent">
            Afficher plus
          </button>
        </div>
      )}
    </div>
  );
}
