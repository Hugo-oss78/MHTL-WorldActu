import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadLatest, useLatest } from '../lib/data';
import { conceptOfDay, dailyQuiz, decryptageOfDay, historyOfDay, parisDate, relatedClusters } from '../lib/daily';
import { formatDate, formatDateTime, relativeTime } from '../lib/format';
import { markBriefingSection, markStudied, update, useStore } from '../lib/store';
import { dueCards } from '../lib/srs';
import { DOSSIER_BY_ID } from '../content/dossiers';
import { PERIOD_LABELS } from '../content/types';
import NewsCard from '../components/NewsCard';
import BriefFlash from '../components/BriefFlash';
import QuizRunner from '../components/QuizRunner';
import SaveButton from '../components/SaveButton';
import { Card, ExtLink, Notice, Pill, SectionTitle, Tabs } from '../components/ui';
import { IconCheck, IconRefresh } from '../components/Icons';

const NO_SECTIONS: string[] = [];

const SECTIONS = [
  { id: 'essentiel', label: "L'essentiel" },
  { id: 'decryptage', label: 'Décryptage' },
  { id: 'histoire', label: 'Histoire' },
  { id: 'concept', label: 'Concept' },
  { id: 'quiz', label: 'Quiz' },
];

function DoneButton({ date, section, onDone }: { date: string; section: string; onDone?: () => void }) {
  const done = useStore((s) => (s.briefingDone[date] ?? []).includes(section));
  return (
    <button
      onClick={() => {
        markBriefingSection(date, section);
        onDone?.();
      }}
      disabled={done}
      className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${done ? 'border-ok/40 text-ok' : 'border-line hover:border-accent hover:text-accent'}`}
    >
      <IconCheck size={16} /> {done ? 'Lu' : 'Marquer comme lu'}
    </button>
  );
}

export default function Home() {
  const today = parisDate();
  const { status, latest, run, error } = useLatest();
  const done = useStore((s) => s.briefingDone[today]) ?? NO_SECTIONS;
  const quizDone = useStore((s) => s.quizDone[today]);
  const view = useStore((s) => s.briefView);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  useStore((s) => s.srs); // rafraîchit le compteur de révisions
  const due = dueCards(today).length;

  const briefing = latest?.briefing ?? null;
  const stale = briefing && briefing.date !== today;
  const history = historyOfDay(today);
  const concept = conceptOfDay(today);
  const dec = decryptageOfDay(today, briefing);
  const dossier = DOSSIER_BY_ID[dec.dossierId];
  const quiz = useMemo(() => dailyQuiz(today, stale ? null : briefing), [today, briefing, stale]);
  const conceptNews = latest ? relatedClusters(concept.keywords, latest.clusters, 3) : [];
  const decNews = latest && briefing?.decryptage ? latest.clusters.filter((c) => briefing.decryptage!.relatedClusterIds.includes(c.id)).slice(0, 3) : [];

  return (
    <div className="space-y-10">
      <section>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Briefing quotidien · environ 5 minutes</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight first-letter:uppercase sm:text-4xl">{formatDate(today)}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {latest ? (
            <span>
              Données actualisées le {formatDateTime(latest.generatedAt)} ({relativeTime(latest.generatedAt)}) · {latest.stats.sourcesOk}/{latest.stats.sourcesTotal} sources
            </span>
          ) : status === 'loading' ? (
            <span>Chargement…</span>
          ) : null}
          <button onClick={() => void loadLatest(true)} className="inline-flex items-center gap-1 text-accent hover:underline" disabled={status === 'loading'}>
            <IconRefresh size={15} className={status === 'loading' ? 'animate-spin' : ''} /> Actualiser
          </button>
          <Link to="/sources" className="hover:text-ink hover:underline">
            État des sources
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Pill tone={done.includes(s.id) || (s.id === 'quiz' && quizDone) ? 'ok' : 'neutral'}>
                {(done.includes(s.id) || (s.id === 'quiz' && quizDone)) && <IconCheck size={12} />} {s.label}
              </Pill>
            </a>
          ))}
          {due > 0 && (
            <Link to="/progression/revisions">
              <Pill tone="accent">{due} révision{due > 1 ? 's' : ''} à faire</Pill>
            </Link>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {status === 'error' && !latest && (
            <Notice tone="warn">
              Impossible de charger l'actualité ({error}). Le reste du briefing (histoire, concept, décryptage, quiz) reste disponible. Si l'application vient d'être installée, les données apparaîtront après la première actualisation automatique.
            </Notice>
          )}
          {run && !run.ok && <Notice tone="warn">{run.message} Dernière tentative : {formatDateTime(run.lastAttemptAt)}.</Notice>}
          {stale && briefing && (
            <Notice tone="warn">
              Aucun briefing n'a encore été produit aujourd'hui. Les actualités ci-dessous datent du briefing du {formatDate(briefing.date)}.
            </Notice>
          )}
        </div>
      </section>

      {/* Rubrique 1 */}
      <section id="essentiel" className="scroll-mt-20">
        <SectionTitle kicker="Rubrique 1" title="L'essentiel de l'actualité" right={<Link to="/actualite" className="text-sm text-accent hover:underline">Tout le fil →</Link>} />
        {briefing && briefing.top.length > 0 ? (
          <>
            {briefing.top.length < 5 && (
              <div className="mb-3">
                <Notice>Seulement {briefing.top.length} sujet(s) remplissent les critères (récence, pertinence, recoupement) lors de la dernière actualisation.</Notice>
              </div>
            )}
            <Tabs
              value={view}
              onChange={(v) => update((s) => ({ ...s, briefView: v }))}
              options={[
                { value: 'bref', label: 'En bref' },
                { value: 'detail', label: 'Détaillé' },
              ]}
            />
            {view === 'bref' ? (
              <BriefFlash
                date={briefing.date}
                clusters={briefing.top}
                onOpen={(i) => {
                  setOpenIdx(i);
                  update((s) => ({ ...s, briefView: 'detail' }));
                  setTimeout(() => document.getElementById(`sujet-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
              />
            ) : (
              <div className="space-y-3">
                {briefing.top.map((c, i) => (
                  <div key={c.id} id={`sujet-${i}`} className="scroll-mt-20">
                    <NewsCard cluster={c} rank={i + 1} defaultOpen={openIdx === i} />
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-muted">
              Sélection automatique selon le recoupement des sources, la récence, les thématiques suivies et la priorité géographique (France, Europe, Moyen-Orient, États-Unis, Asie, Afrique).{' '}
              <Link to="/methode" className="text-accent hover:underline">Méthode</Link>
            </p>
            <DoneButton date={today} section="essentiel" />
          </>
        ) : (
          status !== 'loading' && <Notice>Aucune actualité disponible pour le moment.</Notice>
        )}
      </section>

      {/* Rubrique 2 */}
      <section id="decryptage" className="scroll-mt-20">
        <SectionTitle kicker="Rubrique 2" title="Le décryptage géopolitique" />
        <Card>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold leading-tight">{dossier.title}</h3>
            <SaveButton item={{ id: `dossier:${dossier.id}`, kind: 'dossier', title: dossier.title, url: `#/geopolitique/dossier/${dossier.id}` }} />
          </div>
          <p className="mb-3 text-sm text-muted">{dec.reason}</p>
          <p className="text-[15px] leading-relaxed">{dossier.summary}</p>
          {decNews.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Actualité liée</div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm">
                {decNews.map((c) => <li key={c.id}>{c.title}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link to={`/geopolitique/dossier/${dossier.id}`} className="rounded-lg bg-ink px-4 py-2 text-sm text-paper">
              Lire le dossier complet
            </Link>
            <span className="text-xs text-muted">8 parties : situation, histoire, acteurs, intérêts, alliances, rapports de force, scénarios, conséquences pour l'Europe et la France</span>
          </div>
        </Card>
        <DoneButton date={today} section="decryptage" onDone={() => markStudied({ id: `dossier:${dossier.id}`, kind: 'dossier', title: dossier.title, url: `#/geopolitique/dossier/${dossier.id}` })} />
      </section>

      {/* Rubrique 3 */}
      <section id="histoire" className="scroll-mt-20">
        <SectionTitle kicker="Rubrique 3" title="L'histoire du jour" />
        <Card>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Pill tone="accent">{PERIOD_LABELS[history.fiche.period]}</Pill>
            <Pill>{history.fiche.dateLabel}</Pill>
            {history.anniversary && <Pill tone="ok">Anniversaire du jour</Pill>}
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold leading-tight">{history.fiche.title}</h3>
            <SaveButton item={{ id: `histoire:${history.fiche.id}`, kind: 'histoire', title: history.fiche.title, url: `#/histoire/fiche/${history.fiche.id}` }} />
          </div>
          <p className="mt-2 text-[15px] leading-relaxed">{history.fiche.contexte}</p>
          <div className="mt-4">
            <Link
              to={`/histoire/fiche/${history.fiche.id}`}
              onClick={() => markStudied({ id: `histoire:${history.fiche.id}`, kind: 'histoire', title: history.fiche.title, url: `#/histoire/fiche/${history.fiche.id}` })}
              className="rounded-lg bg-ink px-4 py-2 text-sm text-paper"
            >
              Lire la fiche complète
            </Link>
          </div>
        </Card>
        {briefing?.onThisDay && !stale && (
          <Card className="mt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Ce jour-là — source : {briefing.onThisDay.source}</div>
            <ul className="space-y-1.5 text-sm">
              {briefing.onThisDay.events.slice(0, 5).map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-12 shrink-0 font-semibold tabular-nums text-accent">{e.year}</span>
                  <span>{e.url ? <ExtLink href={e.url}>{e.text}</ExtLink> : e.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        <DoneButton date={today} section="histoire" onDone={() => markStudied({ id: `histoire:${history.fiche.id}`, kind: 'histoire', title: history.fiche.title, url: `#/histoire/fiche/${history.fiche.id}` })} />
      </section>

      {/* Rubrique 4 */}
      <section id="concept" className="scroll-mt-20">
        <SectionTitle kicker="Rubrique 4" title="Le concept à connaître" />
        <Card>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">{concept.term}</h3>
            <SaveButton item={{ id: `concept:${concept.id}`, kind: 'concept', title: concept.term, url: `#/culture/concept/${concept.id}` }} />
          </div>
          <dl className="mt-2 space-y-3 text-[15px] leading-relaxed">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Définition</dt>
              <dd>{concept.definition}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Exemple concret</dt>
              <dd>{concept.exemple}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Dans l'actualité</dt>
              <dd>{concept.actualite}</dd>
              {conceptNews.length > 0 ? (
                <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm">
                  {conceptNews.map((c) => (
                    <li key={c.id}>
                      {c.title} <span className="text-muted">({c.sources[0]?.sourceName})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                latest && <p className="mt-1 text-xs text-muted">Aucun article récent ne mentionne explicitement cette notion.</p>
              )}
            </div>
          </dl>
        </Card>
        <DoneButton date={today} section="concept" onDone={() => markStudied({ id: `concept:${concept.id}`, kind: 'concept', title: concept.term, url: `#/culture/concept/${concept.id}` })} />
      </section>

      {/* Rubrique 5 */}
      <section id="quiz" className="scroll-mt-20">
        <SectionTitle kicker="Rubrique 5" title="Le quiz quotidien" right={<Link to="/progression/quiz" className="text-sm text-accent hover:underline">Quiz hebdo et révisions →</Link>} />
        <Card>
          {quizDone ? (
            <div className="text-center">
              <div className="font-serif text-4xl font-semibold">
                {quizDone.score}/{quizDone.total}
              </div>
              <p className="mt-1 text-sm text-muted">Quiz du jour terminé. Rendez-vous demain, ou faites vos révisions.</p>
              <Link to="/progression" className="mt-3 inline-block text-sm text-accent hover:underline">
                Voir ma progression
              </Link>
            </div>
          ) : (
            <QuizRunner
              questions={quiz}
              mode="daily"
              onFinish={(score, total) => {
                update((s) => ({ ...s, quizDone: { ...s.quizDone, [today]: { score, total, mode: 'daily' } } }));
                markBriefingSection(today, 'quiz');
                markStudied({ id: `concept:${concept.id}`, kind: 'concept', title: concept.term, url: `#/culture/concept/${concept.id}` });
              }}
            />
          )}
        </Card>
      </section>

      <div className="text-center">
        <Link to="/archives" className="text-sm text-muted hover:text-ink hover:underline">
          Historique des briefings
        </Link>
      </div>
    </div>
  );
}
