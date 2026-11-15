import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchKnowledge } from '../lib/search';
import { askAi, type AiContext } from '../lib/ai';
import { useStore } from '../lib/store';
import { IconSearch, IconSparkle } from './Icons';
import { Pill } from './ui';

/** Rendu minimal d'un texte façon Markdown (gras, listes, paragraphes) sans HTML injecté. */
export function MiniMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>));
  return (
    <div className="space-y-2 text-[15px] leading-relaxed">
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s/.test(l)))
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s/, ''))}</li>)}
            </ul>
          );
        if (/^#{1,4}\s/.test(b)) return <div key={i} className="font-semibold">{inline(b.replace(/^#{1,4}\s/, ''))}</div>;
        return <p key={i}>{lines.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l)}</span>)}</p>;
      })}
    </div>
  );
}

export default function AskPanel({ initialQuestion = '', seed = '', context = [] }: { initialQuestion?: string; seed?: string; context?: AiContext[] }) {
  const ai = useStore((s) => s.ai);
  const [q, setQ] = useState(initialQuestion);
  const [submitted, setSubmitted] = useState(initialQuestion || seed);
  const [answer, setAnswer] = useState<string | null>(null);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passages = useMemo(() => searchKnowledge(`${submitted} ${submitted.length < 25 ? seed : ''}`, 5), [submitted, seed]);
  const aiReady = ai.enabled && !!ai.model && !!ai.endpoint;

  const run = async (question: string) => {
    setSubmitted(question);
    if (!aiReady || !question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const ctx: AiContext[] = [
        ...context,
        ...searchKnowledge(question, 4).map((p) => ({ label: `ATLAS — ${p.title} (${p.section})`, text: p.text })),
      ];
      const text = await askAi(ai, question, ctx, history);
      setAnswer(text);
      setHistory((h) => [...h, { role: 'user' as const, content: question }, { role: 'assistant' as const, content: text }].slice(-8));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-line bg-paper p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <IconSparkle size={16} /> Comprendre davantage
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(q);
        }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex. : Pourquoi le détroit d'Ormuz est-il stratégique ?"
          className="min-w-0 flex-1 rounded-lg border border-line bg-card px-3 py-2 text-[16px] outline-none focus:border-accent"
          aria-label="Votre question"
        />
        <button className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm text-paper disabled:opacity-50" disabled={loading}>
          <IconSearch size={16} /> {aiReady ? 'Demander' : 'Chercher'}
        </button>
      </form>

      {aiReady && (loading || answer || error) && (
        <div className="mt-3 rounded-lg border border-line bg-card p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            <Pill tone="info">Réponse IA ({ai.model})</Pill> Peut contenir des erreurs : vérifiez avec les sources.
          </div>
          {loading && <div className="text-sm text-muted">Rédaction de la réponse…</div>}
          {error && <div className="text-sm text-bad">{error}</div>}
          {answer && !loading && <MiniMarkdown text={answer} />}
        </div>
      )}

      <div className="mt-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Dans la bibliothèque ATLAS</div>
        {passages.length === 0 ? (
          <p className="text-sm text-muted">Aucune fiche correspondante. Essayez d'autres mots-clés (pays, organisation, notion).</p>
        ) : (
          <ul className="space-y-2">
            {passages.map((p) => (
              <li key={p.id} className="text-sm">
                <Link to={p.link} className="font-medium text-accent hover:underline">
                  {p.title}
                </Link>{' '}
                <span className="text-xs text-muted">— {p.section}</span>
                <p className="line-clamp-3 text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {!aiReady && (
        <p className="mt-3 text-xs text-muted">
          Assistant IA facultatif non activé : la recherche se fait dans les fiches d'ATLAS. Vous pouvez connecter un modèle de votre choix dans{' '}
          <Link to="/progression/reglages" className="text-accent hover:underline">
            Réglages
          </Link>
          .
        </p>
      )}
    </div>
  );
}
