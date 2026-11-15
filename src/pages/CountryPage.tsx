import { Link, useParams } from 'react-router-dom';
import { COUNTRY_BY_ISO3, REGION_LABELS } from '../lib/gazetteer';
import { useCountries, useLatest } from '../lib/data';
import { DOSSIERS } from '../content/dossiers';
import { formatBig, formatDateTime, formatNumber } from '../lib/format';
import NewsCard from '../components/NewsCard';
import SaveButton from '../components/SaveButton';
import WorldMap from '../components/WorldMap';
import { Card, Empty, ExtLink, Notice, Pill } from '../components/ui';

const IND_LABEL: Record<string, string> = {
  'SP.POP.TOTL': 'Population',
  'NY.GDP.MKTP.CD': 'PIB',
  'NY.GDP.PCAP.CD': 'PIB par habitant',
  'NY.GDP.MKTP.KD.ZG': 'Croissance du PIB',
  'MS.MIL.XPND.CD': 'Dépenses militaires',
  'MS.MIL.XPND.GD.ZS': 'Dépenses militaires (% du PIB)',
  'MS.MIL.TOTL.P1': 'Effectifs des forces armées',
};
const IND_SOURCE: Record<string, string> = {
  'MS.MIL.XPND.CD': 'Banque mondiale d’après le SIPRI',
  'MS.MIL.XPND.GD.ZS': 'Banque mondiale d’après le SIPRI',
  'MS.MIL.TOTL.P1': 'Banque mondiale d’après l’IISS',
};

function fmt(ind: string, v: number): string {
  if (ind === 'SP.POP.TOTL' || ind === 'MS.MIL.TOTL.P1') return formatBig(v);
  if (ind.endsWith('.ZS') || ind.endsWith('.ZG')) return `${formatNumber(v, { maximumFractionDigits: 1 })} %`;
  if (ind === 'NY.GDP.PCAP.CD') return `${formatNumber(v, { maximumFractionDigits: 0 })} $`;
  return `${formatBig(v)} $`;
}

function DataRow({ label, value, meta }: { label: string; value: React.ReactNode; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line py-2 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right">
        <div className="font-medium">{value}</div>
        {meta && <div className="text-xs text-muted">{meta}</div>}
      </dd>
    </div>
  );
}

export default function CountryPage() {
  const { iso = '' } = useParams();
  const c = COUNTRY_BY_ISO3[iso];
  const { data, loading, error } = useCountries();
  const { latest } = useLatest();
  if (!c) return <Empty title="Pays introuvable" />;
  const d = data?.countries[iso];
  const dossiers = DOSSIERS.filter((x) => x.countries.includes(iso));
  const news = latest ? latest.clusters.filter((x) => x.places.slice(0, 3).includes(iso)).slice(0, 5) : [];
  const ind = (k: string) => d?.indicators[k];
  const wd = d?.wikidata ? `https://www.wikidata.org/wiki/${d.wikidata}` : null;

  return (
    <article className="space-y-6">
      <header>
        <Link to="/geopolitique?vue=pays" className="text-sm text-muted hover:text-ink">
          ← Fiches pays
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <Pill tone="accent">{REGION_LABELS[c.region]}</Pill>
            <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{c.name}</h1>
          </div>
          <SaveButton item={{ id: `pays:${iso}`, kind: 'pays', title: c.name, url: `#/geopolitique/pays/${iso}` }} />
        </div>
      </header>

      <Card className="p-2 sm:p-3">
        <WorldMap selected={iso} label={`Carte : ${c.name}`} />
      </Card>

      {loading && <p className="text-sm text-muted">Chargement des données…</p>}
      {!loading && (error || !d) && (
        <Notice tone="warn">Données chiffrées indisponibles pour ce pays ({error ?? 'non publiées'}). Elles sont mises à jour chaque semaine par le pipeline à partir de Wikidata et de la Banque mondiale.</Notice>
      )}

      {d && data && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="mb-1 font-serif text-lg font-semibold">Régime et dirigeants</h2>
            <dl>
              <DataRow label="Régime politique" value={d.government.length ? d.government.join(', ') : '—'} />
              <DataRow label="Chef de l'État" value={d.headOfState.map((p) => p.name).join(', ') || '—'} />
              <DataRow label="Chef du gouvernement" value={d.headOfGovernment.map((p) => p.name).join(', ') || '—'} />
              <DataRow label="Capitale" value={d.capital ?? '—'} />
            </dl>
            <p className="mt-2 text-xs text-muted">
              Source : {wd ? <ExtLink href={wd}>Wikidata</ExtLink> : 'Wikidata'}, consulté le {formatDateTime(data.generatedAt)}. Base collaborative : un changement récent de dirigeant peut ne pas encore y figurer.
            </p>
          </Card>
          <Card>
            <h2 className="mb-1 font-serif text-lg font-semibold">Population et économie</h2>
            <dl>
              {['SP.POP.TOTL', 'NY.GDP.MKTP.CD', 'NY.GDP.PCAP.CD', 'NY.GDP.MKTP.KD.ZG'].map((k) => {
                const v = ind(k);
                return <DataRow key={k} label={IND_LABEL[k]} value={v ? fmt(k, v.value) : '—'} meta={v ? `${v.year} · Banque mondiale` : 'non disponible'} />;
              })}
            </dl>
          </Card>
          <Card>
            <h2 className="mb-1 font-serif text-lg font-semibold">Forces armées</h2>
            <dl>
              {['MS.MIL.TOTL.P1', 'MS.MIL.XPND.CD', 'MS.MIL.XPND.GD.ZS'].map((k) => {
                const v = ind(k);
                return <DataRow key={k} label={IND_LABEL[k]} value={v ? fmt(k, v.value) : '—'} meta={v ? `${v.year} · ${IND_SOURCE[k]}` : 'non disponible'} />;
              })}
            </dl>
            <p className="mt-2 text-xs text-muted">Les données militaires publiques ont souvent un ou deux ans de décalage et peuvent être des estimations.</p>
          </Card>
          <Card>
            <h2 className="mb-1 font-serif text-lg font-semibold">Alliances et organisations</h2>
            {d.memberOf.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">{d.memberOf.map((m) => <Pill key={m}>{m}</Pill>)}</div>
            ) : (
              <p className="text-sm text-muted">Aucune des principales organisations suivies n'est renseignée.</p>
            )}
            <p className="mt-2 text-xs text-muted">Source : Wikidata (propriété « membre de »), filtrée sur les principales organisations.</p>
          </Card>
        </div>
      )}

      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Intérêts stratégiques et relations</h2>
        {dossiers.length ? (
          <Card>
            <p className="mb-2 text-sm text-muted">Dossiers ATLAS dans lesquels ce pays est un acteur :</p>
            <ul className="space-y-2">
              {dossiers.map((x) => (
                <li key={x.id}>
                  <Link to={`/geopolitique/dossier/${x.id}`} className="font-medium text-accent hover:underline">
                    {x.title}
                  </Link>
                  <div className="line-clamp-2 text-sm text-muted">{x.sections.interets}</div>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Empty title="Pas encore de dossier ATLAS consacré à ce pays">Les relations et intérêts stratégiques sont analysés dans les dossiers thématiques.</Empty>
        )}
      </section>

      <section>
        <h2 className="mb-1 font-serif text-xl font-semibold">Situation actuelle</h2>
        <p className="mb-3 text-sm text-muted">Sujets d'actualité récents où ce pays figure parmi les lieux principaux.</p>
        {news.length ? <div className="space-y-3">{news.map((n) => <NewsCard key={n.id} cluster={n} />)}</div> : <Empty title="Aucun sujet récent" />}
      </section>

      {data && (
        <p className="text-xs text-muted">
          Sources des données : {data.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <ExtLink href={s.url}>{s.label}</ExtLink>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
