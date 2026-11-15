import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HISTORY_BY_ID } from '../content/history';
import { DOSSIER_BY_ID } from '../content/dossiers';
import { QUESTION_BANK } from '../content/quiz';
import { HISTORY_TYPE_LABELS, PERIOD_LABELS } from '../content/types';
import { COUNTRY_BY_ISO3 } from '../lib/gazetteer';
import { relatedClusters } from '../lib/daily';
import { useLatest, useLinkStatus } from '../lib/data';
import { markStudied, toggleToReview, useStore } from '../lib/store';
import AskPanel from '../components/AskPanel';
import QuizRunner from '../components/QuizRunner';
import SaveButton from '../components/SaveButton';
import WorldMap from '../components/WorldMap';
import { Card, Empty, ExtLink, Pill, Prose } from '../components/ui';

export default function HistoryFichePage() {
  const { id = '' } = useParams();
  const h = HISTORY_BY_ID[id];
  const { latest } = useLatest();
  const links = useLinkStatus();
  const review = useStore((s) => !!s.toReview[`histoire:${id}`]);
  const item = h ? { id: `histoire:${h.id}`, kind: 'histoire' as const, title: h.title, url: `#/histoire/fiche/${h.id}` } : null;
  useEffect(() => {
    if (item) markStudied(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (!h || !item) return <Empty title="Fiche introuvable" />;
  const dossier = h.lienActualite?.dossierId ? DOSSIER_BY_ID[h.lienActualite.dossierId] : null;
  const news = latest && dossier ? relatedClusters(dossier.keywords, latest.clusters, 3) : [];
  const quiz = QUESTION_BANK.filter((q) => q.id.startsWith(`h-${h.id}-`));

  return (
    <article className="space-y-6">
      <header>
        <Link to="/histoire" className="text-sm text-muted hover:text-ink">
          ← Histoire
        </Link>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill tone="accent">{PERIOD_LABELS[h.period]}</Pill>
          <Pill>{HISTORY_TYPE_LABELS[h.type]}</Pill>
          <Pill>{h.civilisation}</Pill>
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{h.title}</h1>
            <div className="mt-1 text-muted">{h.dateLabel}</div>
          </div>
          <SaveButton item={item} />
        </div>
      </header>

      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Contexte</h2>
        <Prose text={h.contexte} />
      </section>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Personnages importants</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {h.personnages.map((p) => (
            <li key={p.name} className="rounded-xl border border-line bg-card px-3 py-2">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted">{p.role}</div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Déroulement</h2>
        <Prose text={h.deroulement} />
      </section>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Conséquences</h2>
        <Prose text={h.consequences} />
      </section>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Héritage historique</h2>
        <Prose text={h.heritage} />
      </section>

      {h.countries.some((c) => COUNTRY_BY_ISO3[c]) && (
        <Card className="p-2 sm:p-3">
          <WorldMap highlight={h.countries} label={`Pays actuels concernés par : ${h.title}`} />
          <p className="px-2 pb-1 text-xs text-muted">Pays actuels correspondant aux territoires concernés (frontières contemporaines, pas une carte historique).</p>
        </Card>
      )}

      {h.lienActualite && (
        <section>
          <h2 className="mb-2 font-serif text-xl font-semibold">Lien avec l'actualité</h2>
          <Card>
            <p className="text-[15px] leading-relaxed">{h.lienActualite.text}</p>
            {dossier && (
              <Link to={`/geopolitique/dossier/${dossier.id}`} className="mt-2 inline-block text-sm text-accent hover:underline">
                Dossier : {dossier.title} →
              </Link>
            )}
            {news.length > 0 && (
              <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-muted">
                {news.map((c) => <li key={c.id}>{c.title}</li>)}
              </ul>
            )}
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

      <AskPanel seed={h.title} />

      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Sources</h2>
        <ul className="space-y-1.5 text-sm">
          {h.sources.map((s) => (
            <li key={s.url}>
              <ExtLink href={s.url}>{s.label}</ExtLink>
              {links.data?.links[s.url]?.ok === false && <span className="ml-2 text-xs text-bad">lien inaccessible</span>}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Pour approfondir : Gallica (BnF), Archives nationales, encyclopédies et publications universitaires.</p>
      </section>
      <button onClick={() => toggleToReview(item)} className={`rounded-full border px-3 py-1.5 text-sm ${review ? 'border-accent text-accent' : 'border-line text-muted hover:text-ink'}`}>
        {review ? 'Dans « Sujets à revoir »' : 'Ajouter aux sujets à revoir'}
      </button>
    </article>
  );
}
