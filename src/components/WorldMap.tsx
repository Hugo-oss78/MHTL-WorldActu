import { useEffect, useMemo, useState } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import { COUNTRY_BY_NUM } from '../lib/gazetteer';

type Geo = FeatureCollection<Geometry, { name: string }>;
let cache: Geo | null = null;

async function loadWorld(): Promise<Geo> {
  if (cache) return cache;
  const topo = (await import('world-atlas/countries-110m.json')).default as unknown as Parameters<typeof feature>[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache = feature(topo, (topo as any).objects.countries) as unknown as Geo;
  return cache;
}

const W = 960;
const H = 420;

export default function WorldMap({
  counts = {},
  highlight = [],
  selected,
  onSelect,
  label = 'Carte du monde',
}: {
  counts?: Record<string, number>;
  highlight?: string[];
  selected?: string | null;
  onSelect?: (iso3: string | null) => void;
  label?: string;
}) {
  const [geo, setGeo] = useState<Geo | null>(cache);
  const [hover, setHover] = useState<{ name: string; n: number } | null>(null);
  useEffect(() => {
    if (!geo) void loadWorld().then(setGeo);
  }, [geo]);

  const paths = useMemo(() => {
    if (!geo) return [];
    const land = { ...geo, features: geo.features.filter((f) => f.properties.name !== 'Antarctica') };
    const proj = geoEqualEarth().fitSize([W, H], land);
    const path = geoPath(proj);
    return land.features
      .map((f) => {
        const c = COUNTRY_BY_NUM[String(f.id)];
        return { d: path(f) ?? '', id: String(f.id), iso3: c?.iso3 ?? null, name: c?.name ?? f.properties.name };
      });
  }, [geo]);

  const max = Math.max(1, ...Object.values(counts));
  const fill = (iso3: string | null) => {
    if (!iso3) return 'var(--line)';
    if (selected === iso3) return 'var(--accent)';
    if (highlight.includes(iso3)) return 'color-mix(in srgb, var(--accent) 70%, var(--card))';
    const n = counts[iso3];
    if (!n) return 'var(--line)';
    const t = 0.25 + 0.6 * Math.sqrt(n / max);
    return `color-mix(in srgb, var(--accent) ${Math.round(t * 100)}%, var(--card))`;
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
        {!geo && <rect width={W} height={H} rx="12" fill="var(--line)" opacity="0.4" />}
        {paths.map((p) => (
          <path
            key={p.id + p.name}
            d={p.d}
            fill={fill(p.iso3)}
            stroke="var(--card)"
            strokeWidth={0.6}
            className={onSelect && p.iso3 ? 'cursor-pointer hover:opacity-80' : ''}
            onMouseEnter={() => setHover({ name: p.name, n: p.iso3 ? counts[p.iso3] ?? 0 : 0 })}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect && p.iso3 && onSelect(selected === p.iso3 ? null : p.iso3)}
          >
            <title>{`${p.name}${p.iso3 && counts[p.iso3] ? ` — ${counts[p.iso3]} sujet(s)` : ''}`}</title>
          </path>
        ))}
      </svg>
      {hover && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-md border border-line bg-card px-2 py-1 text-xs shadow-sm">
          {hover.name}
          {hover.n > 0 && ` — ${hover.n} sujet(s)`}
        </div>
      )}
    </div>
  );
}

const MW = 600;
const MH = 300;

/**
 * Carte d'arrière-plan : cadrée sur les pays concernés (surlignés), estompée vers la gauche
 * pour laisser le texte lisible. Purement décorative (aria-hidden).
 */
export function BackdropMap({ countries, className = '' }: { countries: string[]; className?: string }) {
  const [geo, setGeo] = useState<Geo | null>(cache);
  useEffect(() => {
    if (!geo) void loadWorld().then(setGeo);
  }, [geo]);
  const key = countries.join(',');
  const paths = useMemo(() => {
    if (!geo) return [];
    const land = geo.features.filter((f) => f.properties.name !== 'Antarctica');
    const focus = land.filter((f) => countries.includes(COUNTRY_BY_NUM[String(f.id)]?.iso3 ?? ''));
    const target = { type: 'FeatureCollection' as const, features: focus.length ? focus : land };
    // Marge généreuse autour des pays concernés pour garder du contexte géographique.
    const pad = focus.length ? 70 : 10;
    const proj = geoEqualEarth().fitExtent([[MW * 0.35 + pad, pad], [MW - pad, MH - pad]], target);
    const path = geoPath(proj);
    return land.map((f) => {
      const iso3 = COUNTRY_BY_NUM[String(f.id)]?.iso3 ?? null;
      return { d: path(f) ?? '', id: String(f.id) + f.properties.name, hit: !!iso3 && countries.includes(iso3) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, key]);
  return (
    <svg
      viewBox={`0 0 ${MW} ${MH}`}
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent 15%, black 70%)', WebkitMaskImage: 'linear-gradient(to right, transparent 15%, black 70%)' }}
    >
      {paths.map((p) => (
        <path key={p.id} d={p.d} fill={p.hit ? 'var(--accent)' : 'var(--line)'} fillOpacity={p.hit ? 0.45 : 0.55} stroke="var(--card)" strokeWidth={0.6} />
      ))}
    </svg>
  );
}
