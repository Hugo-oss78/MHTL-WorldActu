import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArchivedBriefing, useBriefingIndex, useLatest } from '../lib/data';
import { formatDate, formatDateTime, relativeTime } from '../lib/format';
import NewsCard from '../components/NewsCard';
import { ReliabilityLegend } from '../components/Reliability';
import { Card, Empty, ExtLink, Notice, PageHeader, Pill } from '../components/ui';

export function SourcesPage() {
  const { latest, run } = useLatest();
  return (
    <div className="space-y-4">
      <PageHeader title="État des sources" subtitle={latest ? `Dernière actualisation réussie : ${formatDateTime(latest.generatedAt)}` : 'Aucune actualisation publiée'} />
      {run && <Notice tone={run.ok ? 'info' : 'warn'}>Dernière tentative : {formatDateTime(run.lastAttemptAt)} — {run.message}</Notice>}
      {latest ? (
        <Card>
          <ul className="divide-y divide-line">
            {latest.sources.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className={`h-2 w-2 shrink-0 rounded-full ${s.ok ? 'bg-ok' : 'bg-bad'}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{s.name}</div>
                  <div className="truncate text-xs text-muted">{s.url}</div>
                </div>
                <div className="text-right text-xs text-muted">
                  {s.ok ? `${s.items} articles` : <span className="text-bad">{s.error ?? 'Indisponible'}</span>}
                  {!s.ok && <div>{s.lastSuccessAt ? `dernier succès ${relativeTime(s.lastSuccessAt)}` : 'jamais joint'}</div>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty title="Aucune donnée" />
      )}
      <p className="text-sm text-muted">
        Reuters, Associated Press et l'AFP ne proposent pas de flux public gratuit : leurs dépêches sont repérées lorsqu'elles sont citées par les médias suivis. Une source indisponible est simplement ignorée ; les autres continuent d'être utilisées.
      </p>
    </div>
  );
}

export function MethodPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Méthode et fiabilité" subtitle="Comment ATLAS sélectionne, recoupe et présente l'information" />
      <Card>
        <h2 className="mb-2 font-serif text-lg font-semibold">Indicateur de fiabilité</h2>
        <ReliabilityLegend />
      </Card>
      <Card className="space-y-3 text-[15px] leading-relaxed">
        <h2 className="font-serif text-lg font-semibold">Recoupement automatique</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Plusieurs fois par jour, ATLAS lit les flux RSS publics d'environ 35 sources (médias français et internationaux, médias régionaux, institutions, centres d'analyse, presse de défense).</li>
          <li>Les articles traitant du même événement sont regroupés par similarité des titres et des entités citées (pays, organisations, dirigeants, chiffres), y compris entre français et anglais.</li>
          <li>
            Chaque groupe reçoit un nombre d'<strong>origines indépendantes</strong> : deux médias d'un même groupe (ex. France 24 et RFI) comptent pour une origine ; plusieurs médias citant la même agence (« avec AFP ») comptent pour une origine ; des textes quasi identiques sont considérés comme une même dépêche.
          </li>
          <li>Les bilans chiffrés (morts, blessés) sont comparés entre origines : une divergence importante classe l'information en « contradictoire » — un bilan peut aussi simplement évoluer dans le temps.</li>
          <li>La formulation de chaque titre est analysée pour distinguer fait rapporté, déclaration, accusation et hypothèse (conditionnel).</li>
          <li>Les contenus de centres d'analyse sont classés « analyse ou hypothèse » et ne sont jamais présentés comme des faits.</li>
        </ol>
        <h2 className="pt-2 font-serif text-lg font-semibold">Limites honnêtes</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Le recoupement est statistique : il ne vérifie pas le fond des faits et peut regrouper ou séparer des sujets à tort. Lisez les sources pour tout point important.</li>
          <li>Sans IA activée, les résumés sont les extraits fournis par les médias ; les articles en anglais restent en anglais.</li>
          <li>« Pourquoi c'est important » et « Conséquences possibles » proviennent des dossiers ATLAS (contexte général daté) ou, si activée, d'une IA limitée aux extraits des sources ; c'est toujours signalé.</li>
          <li>Les dossiers et fiches ont été rédigés à partir de connaissances générales arrêtées mi-2026 et sont datés.</li>
        </ul>
        <h2 className="pt-2 font-serif text-lg font-semibold">Sélection du briefing</h2>
        <p>Le score combine le nombre d'origines indépendantes, le nombre d'articles, la récence (moins de 30 heures), les thématiques suivies (conflits, diplomatie, défense, sécurité, politique, énergie, économie, technologies) et la priorité géographique : France, Europe, Moyen-Orient, États-Unis, Asie, Afrique, puis le reste du monde. Au plus trois sujets par région, pour garder une vision d'ensemble.</p>
      </Card>
      <p className="text-sm text-muted">
        Code source et fonctionnement détaillé : voir le fichier README du projet. <Link to="/sources" className="text-accent hover:underline">État des sources</Link>
      </p>
    </div>
  );
}

export function ArchivesPage() {
  const index = useBriefingIndex();
  const [date, setDate] = useState<string | null>(null);
  const briefing = useArchivedBriefing(date);
  const { latest } = useLatest();
  return (
    <div className="space-y-4">
      <PageHeader title="Historique des briefings" subtitle="Chaque briefing quotidien est conservé" />
      {date ? (
        <>
          <button onClick={() => setDate(null)} className="text-sm text-muted hover:text-ink">
            ← Tous les briefings
          </button>
          {briefing.loading && <p className="text-sm text-muted">Chargement…</p>}
          {briefing.error && <Notice tone="warn">{briefing.error}</Notice>}
          {briefing.data && (
            <>
              <h2 className="font-serif text-2xl font-semibold first-letter:uppercase">{formatDate(briefing.data.date)}</h2>
              <p className="text-sm text-muted">Généré le {formatDateTime(briefing.data.generatedAt)} — informations de ce jour-là, qui ont pu évoluer depuis.</p>
              <div className="space-y-3">{briefing.data.top.map((c, i) => <NewsCard key={c.id} cluster={c} rank={i + 1} />)}</div>
            </>
          )}
        </>
      ) : index.loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : index.data && index.data.length ? (
        <Card>
          <ul className="divide-y divide-line">
            {index.data.map((e) => (
              <li key={e.date}>
                <button onClick={() => setDate(e.date)} className="w-full py-3 text-left hover:text-accent">
                  <div className="flex items-center gap-2 font-medium first-letter:uppercase">
                    {formatDate(e.date)} {latest?.briefing.date === e.date && <Pill tone="accent">Actuel</Pill>}
                  </div>
                  <div className="line-clamp-2 text-xs text-muted">{e.headlines.join(' · ')}</div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty title="Aucun briefing archivé pour le moment">{index.error}</Empty>
      )}
      <p className="text-xs text-muted">
        Archives aussi disponibles dans le dépôt GitHub (branche <code>data</code>). <ExtLink href="https://docs.github.com/fr/pages">Documentation GitHub Pages</ExtLink>
      </p>
    </div>
  );
}
