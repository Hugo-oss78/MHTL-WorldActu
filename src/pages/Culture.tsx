import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CONCEPTS, CONCEPT_BY_ID } from '../content/concepts';
import { CULTURE, CULTURE_BY_ID } from '../content/culture';
import { CULTURE_LABELS, type CultureCategory } from '../content/types';
import { QUESTION_BANK } from '../content/quiz';
import { relatedClusters } from '../lib/daily';
import { useLatest } from '../lib/data';
import { markStudied, useStore } from '../lib/store';
import AskPanel from '../components/AskPanel';
import QuizRunner from '../components/QuizRunner';
import SaveButton from '../components/SaveButton';
import { Card, Empty, ExtLink, PageHeader, Pill, RowLink, Tabs } from '../components/ui';

export default function Culture() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('vue') as 'fiches' | 'concepts') ?? 'fiches';
  const studied = useStore((s) => s.studied);
  const cats = Object.keys(CULTURE_LABELS) as CultureCategory[];
  return (
    <div>
      <PageHeader title="Culture générale" subtitle="Dirigeants, penseurs, stratèges, doctrines, institutions, civilisations, inventions et notions clés" />
      <Tabs
        value={tab}
        onChange={(v) => setParams(v === 'fiches' ? {} : { vue: v }, { replace: true })}
        options={[
          { value: 'fiches', label: `Fiches (${CULTURE.length})` },
          { value: 'concepts', label: `Concepts (${CONCEPTS.length})` },
        ]}
      />
      {tab === 'fiches' ? (
        <div className="space-y-4">
          {cats.map((cat) => {
            const list = CULTURE.filter((c) => c.category === cat);
            if (!list.length) return null;
            return (
              <Card key={cat}>
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{CULTURE_LABELS[cat]}</h2>
                {list.map((f) => (
                  <RowLink key={f.id} to={`/culture/fiche/${f.id}`} title={f.name} meta={f.dates} right={studied[`culture:${f.id}`] ? <Pill tone="ok">Étudiée</Pill> : undefined} />
                ))}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          {[...CONCEPTS].sort((a, b) => a.term.localeCompare(b.term, 'fr')).map((c) => (
            <RowLink key={c.id} to={`/culture/concept/${c.id}`} title={c.term} meta={<span className="line-clamp-1">{c.definition}</span>} right={studied[`concept:${c.id}`] ? <Pill tone="ok">Vu</Pill> : undefined} />
          ))}
        </Card>
      )}
    </div>
  );
}

export function CultureFichePage() {
  const { id = '' } = useParams();
  const f = CULTURE_BY_ID[id];
  const item = f ? { id: `culture:${f.id}`, kind: 'culture' as const, title: f.name, url: `#/culture/fiche/${f.id}` } : null;
  useEffect(() => {
    if (item) markStudied(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (!f || !item) return <Empty title="Fiche introuvable" />;
  const quiz = QUESTION_BANK.filter((q) => q.id === `k-${f.id}`);
  return (
    <article className="space-y-5">
      <Link to="/culture" className="text-sm text-muted hover:text-ink">
        ← Culture générale
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Pill tone="accent">{CULTURE_LABELS[f.category]}</Pill>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{f.name}</h1>
          <div className="text-muted">{f.dates}</div>
        </div>
        <SaveButton item={item} />
      </div>
      <p className="text-[17px] leading-relaxed">{f.summary}</p>
      <Card>
        <h2 className="mb-2 font-serif text-lg font-semibold">Idées et repères clés</h2>
        <ul className="list-disc space-y-1 pl-5 text-[15px]">{f.keyIdeas.map((k) => <li key={k}>{k}</li>)}</ul>
      </Card>
      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Pourquoi c'est important</h2>
        <p className="text-[15px] leading-relaxed">{f.whyItMatters}</p>
      </Card>
      {quiz.length > 0 && (
        <Card>
          <QuizRunner questions={quiz} mode="practice" />
        </Card>
      )}
      <AskPanel seed={f.name} />
      <div className="space-y-1 text-sm">
        {f.sources.map((s) => (
          <div key={s.url}>
            <ExtLink href={s.url}>{s.label}</ExtLink>
          </div>
        ))}
      </div>
    </article>
  );
}

export function ConceptPage() {
  const { id = '' } = useParams();
  const c = CONCEPT_BY_ID[id];
  const { latest } = useLatest();
  const item = c ? { id: `concept:${c.id}`, kind: 'concept' as const, title: c.term, url: `#/culture/concept/${c.id}` } : null;
  useEffect(() => {
    if (item) markStudied(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (!c || !item) return <Empty title="Concept introuvable" />;
  const news = latest ? relatedClusters(c.keywords, latest.clusters, 4) : [];
  const quiz = QUESTION_BANK.filter((q) => q.id === `c-${c.id}`);
  return (
    <article className="space-y-5">
      <Link to="/culture?vue=concepts" className="text-sm text-muted hover:text-ink">
        ← Concepts
      </Link>
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{c.term}</h1>
        <SaveButton item={item} />
      </div>
      <Card>
        <dl className="space-y-4 text-[15px] leading-relaxed">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Définition simple</dt>
            <dd>{c.definition}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Exemple concret</dt>
            <dd>{c.exemple}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Application dans l'actualité</dt>
            <dd>{c.actualite}</dd>
          </div>
        </dl>
      </Card>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">Articles récents en rapport</h2>
        {news.length ? (
          <ul className="space-y-1.5 text-sm">
            {news.map((n) => (
              <li key={n.id}>
                <ExtLink href={n.sources[0].url}>{n.title}</ExtLink> <span className="text-muted">— {n.sources[0].sourceName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Aucun article récent ne mentionne explicitement cette notion.</p>
        )}
      </section>
      {c.related && c.related.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-sm text-muted">Voir aussi :</span>
          {c.related.map((r) => CONCEPT_BY_ID[r] && (
            <Link key={r} to={`/culture/concept/${r}`}>
              <Pill tone="accent">{CONCEPT_BY_ID[r].term}</Pill>
            </Link>
          ))}
        </div>
      )}
      {quiz.length > 0 && (
        <Card>
          <QuizRunner questions={quiz} mode="practice" />
        </Card>
      )}
      <AskPanel seed={c.term} />
    </article>
  );
}
