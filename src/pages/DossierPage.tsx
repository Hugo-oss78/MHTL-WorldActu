import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DOSSIER_BY_ID, DOSSIER_CATEGORY_LABELS } from '../content/dossiers';
import { HISTORY } from '../content/history';
import { QUESTION_BANK } from '../content/quiz';
import { COUNTRY_BY_ISO3 } from '../lib/gazetteer';
import { relatedClusters } from '../lib/daily';
import { useLatest, useLinkStatus } from '../lib/data';
import { markStudied, toggleToReview, useStore } from '../lib/store';
import { formatDateTime } from '../lib/format';
import AskPanel from '../components/AskPanel';
import NewsCard from '../components/NewsCard';
import QuizRunner from '../components/QuizRunner';
import SaveButton from '../components/SaveButton';
import Timeline from '../components/Timeline';
import { Card, Empty, ExtLink, Notice, Pill, Prose } from '../components/ui';

const PARTS = [
  ['situation', '1. Présentation de la situation'],
  ['histoire', '2. Contexte historique'],
  ['acteurs', '3. Acteurs impliqués'],
  ['interets', '4. Intérêts politiques, économiques et militaires'],
  ['alliances', '5. Alliances et oppositions'],
  ['rapports', '6. Rapports de force'],
  ['scenarios', '7. Scénarios possibles'],
  ['europeFrance', "8. Conséquences pour l'Europe et la France"],
] as const;

export default function DossierPage() {
  const { id = '' } = useParams();
  const d = DOSSIER_BY_ID[id];
  const { latest } = useLatest();
  const links = useLinkStatus();
  const review = useStore((s) => !!s.toReview[`dossier:${id}`]);
  const item = d ? { id: `dossier:${d.id}`, kind: 'dossier' as const, title: d.title, url: `#/geopolitique/dossier/${d.id}` } : null;
  useEffect(() => {
    if (item) markStudied(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (!d || !item) return <Empty title="Dossier introuvable" />;

  const news = latest ? relatedClusters([...d.keywords], latest.clusters, 4) : [];
  const historyLinks = HISTORY.filter((h) => h.lienActualite?.dossierId === d.id);
  const quiz = QUESTION_BANK.filter((q) => q.id.startsWith(`d-${d.id}-`));

  return (
    <article className="space-y-6">
      <header>
        <Link to="/geopolitique" className="text-sm text-muted hover:text-ink">
          ← Géopolitique
        </Link>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill tone="accent">{DOSSIER_CATEGORY_LABELS[d.category]}</Pill>
          {d.countries.slice(0, 6).map((iso) => (
            <Link key={iso} to={`/geopolitique/pays/${iso}`}>
              <Pill>{COUNTRY_BY_ISO3[iso]?.name ?? iso}</Pill>
            </Link>
          ))}
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{d.title}</h1>
          <SaveButton item={item} />
        </div>
        <p className="mt-3 text-[17px] leading-relaxed">{d.summary}</p>
        <div className="mt-3">
          <Notice>{d.asOf} Les parties « Scénarios » relèvent de l'analyse et non des faits. Pour l'état présent, voir « Actualité liée » ci-dessous.</Notice>
        </div>
      </header>

      <Card>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Pourquoi c'est important</h2>
        <p className="text-[15px] leading-relaxed">{d.whyItMatters}</p>
      </Card>

      {PARTS.map(([key, label]) => (
        <section key={key}>
          <h2 className="mb-2 flex flex-wrap items-center gap-2 font-serif text-xl font-semibold">
            {label}
            {key === 'scenarios' && <Pill tone="info">Analyse ou hypothèse</Pill>}
          </h2>
          {key === 'scenarios' ? (
            <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
              {d.sections.scenarios.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : (
            <Prose text={d.sections[key]} />
          )}
        </section>
      ))}

      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold">Chronologie</h2>
        <Card>
          <Timeline items={d.timeline} />
        </Card>
      </section>

      <section>
        <h2 className="mb-1 font-serif text-xl font-semibold">Actualité liée</h2>
        <p className="mb-3 text-sm text-muted">Articles récents mentionnant ce sujet {latest ? `(données du ${formatDateTime(latest.generatedAt)})` : ''}.</p>
        {news.length ? <div className="space-y-3">{news.map((c) => <NewsCard key={c.id} cluster={c} />)}</div> : <Empty title="Pas d'article récent sur ce sujet" />}
      </section>

      {historyLinks.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-xl font-semibold">Passerelles avec l'histoire</h2>
          <Card>
            <ul className="space-y-2 text-sm">
              {historyLinks.map((h) => (
                <li key={h.id}>
                  <Link to={`/histoire/fiche/${h.id}`} className="font-medium text-accent hover:underline">
                    {h.title} ({h.dateLabel})
                  </Link>
                  <div className="text-muted">{h.lienActualite?.text}</div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {quiz.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-xl font-semibold">Testez-vous</h2>
          <Card>
            <QuizRunner questions={quiz} mode="practice" />
          </Card>
        </section>
      )}

      <AskPanel seed={d.title} />

      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Sources et pour aller plus loin</h2>
        <ul className="space-y-1.5 text-sm">
          {d.sources.map((s) => (
            <li key={s.url}>
              <ExtLink href={s.url}>{s.label}</ExtLink>
              {links.data?.links[s.url]?.ok === false && <span className="ml-2 text-xs text-bad">lien inaccessible lors de la dernière vérification</span>}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Les liens Wikipédia sont des recherches qui mènent à l'article correspondant. Synthèse rédigée pour ATLAS à partir de connaissances générales ; vérifiez les points importants dans les sources.</p>
      </section>

      <div>
        <button onClick={() => toggleToReview(item)} className={`rounded-full border px-3 py-1.5 text-sm ${review ? 'border-accent text-accent' : 'border-line text-muted hover:text-ink'}`}>
          {review ? 'Dans « Sujets à revoir »' : 'Ajouter aux sujets à revoir'}
        </button>
      </div>
    </article>
  );
}
