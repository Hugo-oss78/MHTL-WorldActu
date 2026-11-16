import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { NewsCluster } from '../lib/types';
import { COUNTRY_BY_ISO3, REGION_LABELS } from '../lib/gazetteer';
import { DOSSIER_BY_ID } from '../content/dossiers';
import { formatDateTime, relativeTime } from '../lib/format';
import { markRead } from '../lib/store';
import { ReliabilityBadge, StatementBadge } from './Reliability';
import { ExtLink, Pill } from './ui';
import SaveButton from './SaveButton';
import AskPanel from './AskPanel';
import { IconChevron, IconSparkle } from './Icons';
import { BackdropMap } from './WorldMap';

export const THEME_NAMES: Record<string, string> = {
  politique: 'Politique',
  diplomatie: 'Relations internationales',
  defense: 'Défense',
  conflits: 'Conflits armés',
  economie: 'Économie',
  energie: 'Énergie',
  technologie: 'Technologies',
  securite: 'Sécurité internationale',
};

function Block({ title, children, tag }: { title: string; children: React.ReactNode; tag?: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
        {tag}
      </div>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

export default function NewsCard({ cluster: c, rank, defaultOpen = false }: { cluster: NewsCluster; rank?: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [ask, setAsk] = useState(false);
  const dossier = c.relatedDossier ? DOSSIER_BY_ID[c.relatedDossier] : null;
  const places = c.places.map((p) => COUNTRY_BY_ISO3[p]?.name ?? p);
  const people = c.actors.filter((a) => a.type !== 'pays');
  const item = { id: `article:${c.id}`, kind: 'article' as const, title: c.title, url: c.sources[0]?.url ?? '' };

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) markRead(item);
  };

  return (
    <article className="rounded-2xl border border-line bg-card">
      <button onClick={toggle} className="relative flex w-full items-start gap-3 overflow-hidden rounded-t-2xl p-4 text-left sm:p-5" aria-expanded={open}>
        {c.places.length > 0 && <BackdropMap countries={c.places.slice(0, 4)} />}
        {rank !== undefined && <span className="relative mt-0.5 font-serif text-2xl font-semibold text-muted/60 tabular-nums">{rank}</span>}
        <div className="relative min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-accent">{REGION_LABELS[c.region]}</span>
            <span>·</span>
            <time dateTime={c.lastPublishedAt} title={formatDateTime(c.lastPublishedAt)}>
              {relativeTime(c.lastPublishedAt)}
            </time>
            <span>·</span>
            <span>
              {c.sources.length} source{c.sources.length > 1 ? 's' : ''}
            </span>
            {c.lang === 'en' && <Pill>EN</Pill>}
          </div>
          <h3 className="font-serif text-lg font-semibold leading-snug sm:text-xl">{c.title}</h3>
          {!open && c.summary && <p className="mt-1.5 line-clamp-2 text-sm text-muted">{c.summary}</p>}
          <div className="mt-2">
            <ReliabilityBadge level={c.reliability.level} />
          </div>
        </div>
        <IconChevron size={18} className={`relative mt-1 shrink-0 text-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-line px-4 pb-4 pt-4 sm:px-5">
          {c.ai ? (
            <Block title="Résumé" tag={<Pill tone="info">Généré par IA à partir des extraits — à vérifier</Pill>}>
              {c.ai.resume}
            </Block>
          ) : (
            c.summary && <Block title="Résumé (extrait de la source principale)">{c.summary}</Block>
          )}

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Publication</div>
              <div>
                {formatDateTime(c.firstPublishedAt)}
                {c.lastPublishedAt !== c.firstPublishedAt && <span className="text-muted"> · mis à jour {formatDateTime(c.lastPublishedAt)}</span>}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Lieu(x) concerné(s)</div>
              <div>
                {places.length ? (
                  c.places.map((iso, i) => (
                    <span key={iso}>
                      {i > 0 && ', '}
                      {COUNTRY_BY_ISO3[iso] ? <Link className="text-accent hover:underline" to={`/geopolitique/pays/${iso}`}>{places[i]}</Link> : places[i]}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">Non détecté automatiquement</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Acteurs impliqués</div>
              <div>{people.length ? people.map((a) => a.name).join(', ') : <span className="text-muted">{places.length ? places.join(', ') : 'Non détectés automatiquement'}</span>}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Thématiques</div>
              <div>{c.themes.map((t) => THEME_NAMES[t]).join(', ') || '—'}</div>
            </div>
          </div>

          <Block title="Pourquoi c'est important">
            {c.ai ? (
              <>
                <p>{c.ai.pourquoi}</p>
                <p className="mt-1 text-xs text-muted">Texte généré par IA ({c.ai.model}) à partir des seuls extraits des sources ci-dessous.</p>
              </>
            ) : dossier ? (
              <>
                <p>{dossier.whyItMatters}</p>
                <p className="mt-1 text-xs text-muted">
                  Contexte issu du dossier ATLAS «&nbsp;<Link to={`/geopolitique/dossier/${dossier.id}`} className="text-accent hover:underline">{dossier.title}</Link>&nbsp;» — explication générale du sujet, non spécifique à cet article.
                </p>
              </>
            ) : (
              <p className="text-muted">Aucun contexte disponible pour ce sujet dans la bibliothèque ATLAS. Consultez les sources ci-dessous ou utilisez «&nbsp;Comprendre davantage&nbsp;».</p>
            )}
          </Block>

          <Block title="Conséquences possibles" tag={<Pill tone="info">Analyse, pas un fait</Pill>}>
            {c.ai && c.ai.consequences.length ? (
              <ul className="list-disc space-y-1 pl-5">{c.ai.consequences.map((x, i) => <li key={i}>{x}</li>)}</ul>
            ) : dossier ? (
              <>
                <ul className="list-disc space-y-1 pl-5">{dossier.sections.scenarios.map((x, i) => <li key={i}>{x}</li>)}</ul>
                <p className="mt-1 text-xs text-muted">Scénarios généraux du dossier «&nbsp;{dossier.title}&nbsp;» ({dossier.asOf})</p>
              </>
            ) : (
              <p className="text-muted">Pas d'analyse disponible : ATLAS ne génère pas d'hypothèses sans base documentaire.</p>
            )}
          </Block>

          <Block title="Fiabilité et recoupement">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ReliabilityBadge level={c.reliability.level} />
              <span className="text-sm text-muted">
                {c.reliability.independentOrigins} origine{c.reliability.independentOrigins > 1 ? 's' : ''} indépendante{c.reliability.independentOrigins > 1 ? 's' : ''} : {c.reliability.origins.join(', ')}
              </span>
            </div>
            {c.reliability.notes.length > 0 && (
              <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted">{c.reliability.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
            )}
            <p className="mt-1 text-xs text-muted">
              Évaluation automatique (regroupement des titres, groupes de presse, agences citées). <Link to="/methode" className="text-accent hover:underline">Comment c'est calculé</Link>
            </p>
          </Block>

          <Block title={`Sources consultées (${c.sources.length})`}>
            <ul className="divide-y divide-line">
              {c.sources.map((s) => (
                <li key={s.url} className="py-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    <span className="font-semibold text-ink">{s.sourceName}</span>
                    <span>· {formatDateTime(s.publishedAt)}</span>
                    {s.lang === 'en' && <Pill>EN</Pill>}
                    {s.kind === 'institution' && <Pill tone="ok">Source primaire</Pill>}
                    {s.kind === 'analyse' && <Pill tone="info">Analyse</Pill>}
                    {s.wire && <Pill>Agence citée : {s.wire}</Pill>}
                    {s.stateAffiliated && <Pill tone="warn">Média affilié à un État</Pill>}
                    <StatementBadge type={s.statement} />
                  </div>
                  <div className="mt-1 text-sm">
                    <ExtLink href={s.url}>{s.title}</ExtLink>
                  </div>
                  {s.linkOk === false && <div className="mt-0.5 text-xs text-bad">Lien inaccessible lors de la dernière vérification.</div>}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-muted">La nature de chaque titre (fait, déclaration, accusation, hypothèse) est détectée automatiquement à partir de sa formulation.</p>
          </Block>

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <SaveButton item={item} label />
            <button onClick={() => setAsk((a) => !a)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
              <IconSparkle size={16} /> Comprendre davantage
            </button>
            {dossier && (
              <Link to={`/geopolitique/dossier/${dossier.id}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
                Dossier : {dossier.title}
              </Link>
            )}
          </div>
          {ask && (
            <AskPanel
              initialQuestion={dossier ? `Quel est le contexte de « ${c.title} » ?` : ''}
              seed={`${c.title} ${dossier?.title ?? ''} ${places.join(' ')}`}
              context={c.sources.slice(0, 6).map((s) => ({ label: `${s.sourceName} — ${s.title}`, url: s.url, text: s.summary }))}
            />
          )}
        </div>
      )}
    </article>
  );
}
