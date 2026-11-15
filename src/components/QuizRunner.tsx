import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizQuestion } from '../lib/types';
import { recordAnswer } from '../lib/srs';
import { THEME_LABELS } from '../lib/levels';
import type { QuizAttempt } from '../lib/store';
import { IconCheck, IconX } from './Icons';
import { ExtLink, Pill } from './ui';

export default function QuizRunner({
  questions,
  mode,
  onFinish,
}: {
  questions: QuizQuestion[];
  mode: QuizAttempt['mode'];
  onFinish?: (score: number, total: number) => void;
}) {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) return <p className="text-sm text-muted">Aucune question disponible.</p>;
  const q = questions[i];

  if (done)
    return (
      <div className="text-center">
        <div className="font-serif text-4xl font-semibold">
          {score}/{questions.length}
        </div>
        <p className="mt-1 text-sm text-muted">
          {score === questions.length ? 'Sans faute !' : 'Les questions manquées reviendront dans vos révisions espacées.'}
        </p>
      </div>
    );

  const answer = (idx: number) => {
    if (choice !== null) return;
    setChoice(idx);
    const ok = idx === q.answer;
    if (ok) setScore((s) => s + 1);
    recordAnswer(q, ok, mode);
  };

  const next = () => {
    if (i + 1 >= questions.length) {
      setDone(true);
      onFinish?.(score, questions.length);
    } else {
      setI(i + 1);
      setChoice(null);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>
          Question {i + 1} / {questions.length}
        </span>
        <span className="flex gap-1.5">
          <Pill>{THEME_LABELS[q.theme]}</Pill>
          {q.generated && <Pill title="Question construite automatiquement à partir des fiches ou des données d'actualité">Générée</Pill>}
        </span>
      </div>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-accent transition-all" style={{ width: `${(i / questions.length) * 100}%` }} />
      </div>
      <p className="mb-4 font-serif text-lg font-semibold leading-snug">{q.question}</p>
      <div className="grid gap-2">
        {q.options.map((o, idx) => {
          const state = choice === null ? 'idle' : idx === q.answer ? 'good' : idx === choice ? 'bad' : 'dim';
          const cls = {
            idle: 'border-line bg-card hover:border-accent',
            good: 'border-ok bg-ok/10',
            bad: 'border-bad bg-bad/10',
            dim: 'border-line bg-card opacity-60',
          }[state];
          return (
            <button key={idx} onClick={() => answer(idx)} disabled={choice !== null} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left text-[15px] ${cls}`}>
              <span>{o}</span>
              {state === 'good' && <IconCheck size={18} className="shrink-0 text-ok" />}
              {state === 'bad' && <IconX size={18} className="shrink-0 text-bad" />}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <div className="mt-4 space-y-2 rounded-xl border border-line bg-paper p-3 text-sm">
          <div className={`font-semibold ${choice === q.answer ? 'text-ok' : 'text-bad'}`}>
            {choice === q.answer ? 'Bonne réponse' : `Réponse attendue : ${q.options[q.answer]}`}
          </div>
          <p>
            <span className="font-medium">Pourquoi : </span>
            {q.explanation}
          </p>
          {q.extra && (
            <p className="text-muted">
              <span className="font-medium text-ink">Pour aller plus loin : </span>
              {q.extra}
            </p>
          )}
          {q.link &&
            (q.link.internal ? (
              <Link to={q.link.url} className="text-accent hover:underline">
                {q.link.label} →
              </Link>
            ) : (
              <ExtLink href={q.link.url}>{q.link.label}</ExtLink>
            ))}
          <div className="pt-1">
            <button onClick={next} className="rounded-lg bg-ink px-4 py-2 text-paper">
              {i + 1 >= questions.length ? 'Voir le résultat' : 'Question suivante'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
