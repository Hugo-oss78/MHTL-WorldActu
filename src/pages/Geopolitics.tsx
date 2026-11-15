import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DOSSIERS, DOSSIER_CATEGORY_LABELS } from '../content/dossiers';
import type { DossierCategory } from '../content/types';
import { COUNTRIES, REGION_LABELS } from '../lib/gazetteer';
import { normalize } from '../lib/text';
import { useStore } from '../lib/store';
import WorldMap from '../components/WorldMap';
import { Card, PageHeader, Pill, RowLink, Tabs } from '../components/ui';

export default function Geopolitics() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('vue') as 'dossiers' | 'pays') ?? 'dossiers';
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const studied = useStore((s) => s.studied);

  const byCat = useMemo(() => {
    const m = new Map<DossierCategory, typeof DOSSIERS>();
    for (const d of DOSSIERS) m.set(d.category, [...(m.get(d.category) ?? []), d]);
    return m;
  }, []);

  const countries = useMemo(() => {
    const n = normalize(q).trim();
    return COUNTRIES.filter((c) => !n || normalize(c.name).includes(n) || c.aliases.some((a) => a.startsWith(n))).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [q]);

  return (
    <div>
      <PageHeader title="Géopolitique" subtitle="Dossiers permanents et fiches pays datées et sourcées" />
      <Tabs
        value={tab}
        onChange={(v) => setParams(v === 'dossiers' ? {} : { vue: v }, { replace: true })}
        options={[
          { value: 'dossiers', label: `Dossiers (${DOSSIERS.length})` },
          { value: 'pays', label: `Fiches pays (${COUNTRIES.length})` },
        ]}
      />
      {tab === 'dossiers' ? (
        <div className="space-y-5">
          {[...byCat.entries()].map(([cat, list]) => (
            <Card key={cat}>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{DOSSIER_CATEGORY_LABELS[cat]}</h2>
              {list.map((d) => (
                <RowLink
                  key={d.id}
                  to={`/geopolitique/dossier/${d.id}`}
                  title={d.title}
                  meta={<span className="line-clamp-2">{d.summary}</span>}
                  right={studied[`dossier:${d.id}`] ? <Pill tone="ok">Étudié</Pill> : undefined}
                />
              ))}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-2 sm:p-3">
            <WorldMap highlight={COUNTRIES.map((c) => c.iso3)} onSelect={(iso) => iso && nav(`/geopolitique/pays/${iso}`)} label="Carte des fiches pays" />
            <p className="px-2 pb-1 text-xs text-muted">Touchez un pays pour ouvrir sa fiche.</p>
          </Card>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un pays…" className="w-full rounded-xl border border-line bg-card px-3 py-2 text-[16px]" aria-label="Rechercher un pays" />
          <Card>
            {countries.map((c) => (
              <RowLink key={c.iso3} to={`/geopolitique/pays/${c.iso3}`} title={c.name} meta={REGION_LABELS[c.region]} />
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
