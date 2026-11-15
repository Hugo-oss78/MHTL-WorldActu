import { useMemo, useRef, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { parisDate } from '../lib/daily';
import { computeLevel, streak, themeStats, THEME_LABELS } from '../lib/levels';
import { dueCards, weeklyQuestions } from '../lib/srs';
import { exportData, importData, isStorageOk, resetData, toggleSaved, toggleToReview, update, useStore, type SavedItem } from '../lib/store';
import { formatDateTime } from '../lib/format';
import QuizRunner from '../components/QuizRunner';
import { Card, Empty, Notice, PageHeader, Pill } from '../components/ui';
import { QUESTION_BANK } from '../content/quiz';
import { seededRandom, shuffle } from '../lib/text';

const SUBNAV = [
  { to: '/progression', label: 'Tableau de bord', end: true },
  { to: '/progression/quiz', label: 'Quiz et révisions' },
  { to: '/progression/favoris', label: 'Favoris' },
  { to: '/progression/historique', label: 'Historique' },
  { to: '/progression/reglages', label: 'Réglages et données' },
];

function itemHref(i: SavedItem): { internal: boolean; href: string } {
  if (i.url.startsWith('#')) return { internal: true, href: i.url.slice(1) };
  return { internal: false, href: i.url };
}

function ItemList({ items, empty, onRemove }: { items: SavedItem[]; empty: string; onRemove?: (i: SavedItem) => void }) {
  if (!items.length) return <Empty title={empty} />;
  return (
    <ul className="divide-y divide-line">
      {items.map((i) => {
        const { internal, href } = itemHref(i);
        return (
          <li key={i.id} className="flex items-center gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              {internal ? (
                <Link to={href} className="font-medium hover:text-accent">{i.title}</Link>
              ) : (
                <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-accent">{i.title}</a>
              )}
              <div className="text-xs text-muted">
                {{ article: 'Article', dossier: 'Dossier', histoire: 'Fiche historique', culture: 'Culture générale', concept: 'Concept', pays: 'Fiche pays' }[i.kind]} · {formatDateTime(i.at)}
              </div>
            </div>
            {onRemove && (
              <button onClick={() => onRemove(i)} className="text-xs text-muted hover:text-bad">
                Retirer
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Dashboard() {
  const s = useStore((x) => x);
  const today = parisDate();
  const level = computeLevel(s);
  const themes = themeStats(s);
  const due = dueCards(today).length;
  const studiedCount = Object.keys(s.studied).length;
  const quizDays = Object.values(s.quizDone);
  const avg = quizDays.length ? quizDays.reduce((a, q) => a + q.score / q.total, 0) / quizDays.length : null;
  const last14 = useMemo(() => {
    const out: { date: string; n: number; ok: number }[] = [];
    const d = new Date(`${today}T12:00:00Z`);
    for (let i = 13; i >= 0; i--) {
      const x = new Date(d);
      x.setUTCDate(d.getUTCDate() - i);
      const ds = x.toISOString().slice(0, 10);
      const list = s.attempts.filter((a) => a.date === ds);
      out.push({ date: ds, n: list.length, ok: list.filter((a) => a.correct).length });
    }
    return out;
  }, [s.attempts, today]);
  const maxN = Math.max(1, ...last14.map((x) => x.n));

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Niveau</div>
            <div className="font-serif text-3xl font-semibold">{level.name}</div>
          </div>
          <div className="text-right text-sm text-muted">
            {level.answers} réponses · {Math.round(level.accuracy * 100)} % de réussite récente · {level.mastered} questions maîtrisées
          </div>
        </div>
        {level.next && <p className="mt-2 text-sm text-muted">Prochain palier — {level.next}.</p>}
        <p className="mt-1 text-xs text-muted">Le niveau dépend uniquement de vos résultats aux quiz, pas du nombre d'articles consultés.</p>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Jours d’utilisation', s.days.length],
          ['Série en cours', `${streak(s.days, today)} j`],
          ['Fiches étudiées', studiedCount],
          ['Moyenne quiz du jour', avg === null ? '—' : `${Math.round(avg * 100)} %`],
        ].map(([k, v]) => (
          <Card key={k as string} className="p-3 sm:p-4">
            <div className="text-xs text-muted">{k}</div>
            <div className="mt-1 font-serif text-2xl font-semibold tabular-nums">{v}</div>
          </Card>
        ))}
      </div>

      {due > 0 && (
        <Link to="/progression/quiz" className="block">
          <Notice tone="warn">
            {due} question{due > 1 ? 's' : ''} à réviser aujourd'hui (répétition espacée). Touchez pour commencer.
          </Notice>
        </Link>
      )}

      <Card>
        <h2 className="mb-3 font-serif text-lg font-semibold">Réponses des 14 derniers jours</h2>
        <div className="flex h-28 items-end gap-1" role="img" aria-label="Histogramme des réponses par jour">
          {last14.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center justify-end gap-0.5" title={`${d.date} : ${d.ok}/${d.n}`}>
              <div className="w-full rounded-t bg-line" style={{ height: `${(d.n / maxN) * 100}%` }}>
                <div className="w-full rounded-t bg-accent" style={{ height: d.n ? `${(d.ok / d.n) * 100}%` : 0 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          <span>il y a 13 j</span>
          <span>aujourd'hui</span>
        </div>
        <p className="mt-1 text-xs text-muted">Barre grise : réponses ; partie colorée : bonnes réponses.</p>
      </Card>

      <Card>
        <h2 className="mb-2 font-serif text-lg font-semibold">Thématiques</h2>
        <ul className="divide-y divide-line">
          {themes.map((t) => (
            <li key={t.theme} className="flex items-center gap-3 py-2">
              <span className="w-36 shrink-0 text-sm">{t.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-accent" style={{ width: `${(t.acc ?? 0) * 100}%` }} />
              </div>
              <span className="w-12 text-right text-sm tabular-nums">{t.acc === null ? '—' : `${Math.round(t.acc * 100)} %`}</span>
              <span className="hidden w-28 text-right sm:block">
                {t.status === 'maitrise' && <Pill tone="ok">Maîtrisé</Pill>}
                {t.status === 'a-approfondir' && <Pill tone="warn">À approfondir</Pill>}
                {t.status === 'en-cours' && <Pill>En cours</Pill>}
                {t.status === 'insuffisant' && <span className="text-xs text-muted">{t.total} rép.</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Maîtrisé : ≥ 80 % sur au moins 10 réponses. À approfondir : &lt; 60 % sur au moins 5 réponses.</p>
      </Card>

      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Sujets à revoir</h2>
        <ItemList items={Object.values(s.toReview).sort((a, b) => b.at.localeCompare(a.at))} empty="Aucun sujet marqué « à revoir »" onRemove={(i) => toggleToReview(i)} />
      </Card>
    </div>
  );
}

function QuizHub() {
  const today = parisDate();
  const srs = useStore((s) => s.srs);
  const weeklyDone = useStore((s) => s.quizDone[`semaine-${today}`]);
  const [mode, setMode] = useState<'none' | 'review' | 'weekly' | 'practice'>('none');
  const [seed, setSeed] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const due = useMemo(() => dueCards(today), [today, mode, srs]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weekly = useMemo(() => weeklyQuestions(today, 10), [today, mode]);
  const practice = useMemo(() => shuffle(QUESTION_BANK, seededRandom(`p-${seed}-${Date.now()}`)).slice(0, 10), [seed]);

  if (mode !== 'none') {
    const qs = mode === 'review' ? due.slice(0, 15) : mode === 'weekly' ? weekly : practice;
    return (
      <Card>
        <button onClick={() => setMode('none')} className="mb-3 text-sm text-muted hover:text-ink">
          ← Retour
        </button>
        <QuizRunner
          key={`${mode}-${seed}`}
          questions={qs}
          mode={mode}
          onFinish={(score, total) => {
            if (mode === 'weekly') update((s) => ({ ...s, quizDone: { ...s.quizDone, [`semaine-${today}`]: { score, total, mode: 'weekly' } } }));
          }}
        />
      </Card>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card>
        <h2 className="font-serif text-lg font-semibold">Révisions espacées</h2>
        <p className="mt-1 text-sm text-muted">Les questions reviennent après 1, 3, 7, 14 puis 30 jours ; une erreur ramène la question au début.</p>
        <div className="mt-3 font-serif text-3xl font-semibold">{due.length}</div>
        <div className="text-xs text-muted">question(s) à réviser aujourd'hui</div>
        <button disabled={!due.length} onClick={() => setMode('review')} className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40">
          Réviser
        </button>
      </Card>
      <Card>
        <h2 className="font-serif text-lg font-semibold">Quiz hebdomadaire</h2>
        <p className="mt-1 text-sm text-muted">Jusqu'à 10 questions vues ces 7 derniers jours, en priorité celles que vous avez manquées.</p>
        {weeklyDone && <p className="mt-2 text-sm">Fait aujourd'hui : {weeklyDone.score}/{weeklyDone.total}</p>}
        <button disabled={weekly.length < 3} onClick={() => setMode('weekly')} className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40">
          {weekly.length < 3 ? 'Pas assez de questions cette semaine' : `Lancer (${weekly.length})`}
        </button>
      </Card>
      <Card>
        <h2 className="font-serif text-lg font-semibold">Entraînement libre</h2>
        <p className="mt-1 text-sm text-muted">10 questions au hasard parmi {QUESTION_BANK.length} (histoire, géopolitique, concepts, culture).</p>
        <button
          onClick={() => {
            setSeed((x) => x + 1);
            setMode('practice');
          }}
          className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm text-paper"
        >
          S'entraîner
        </button>
      </Card>
    </div>
  );
}

function Favorites() {
  const saved = useStore((s) => s.saved);
  return (
    <Card>
      <ItemList items={Object.values(saved).sort((a, b) => b.at.localeCompare(a.at))} empty="Aucun favori. Utilisez l'icône signet sur un article ou une fiche." onRemove={(i) => toggleSaved(i)} />
    </Card>
  );
}

function HistoryLog() {
  const s = useStore((x) => x);
  const byDay = useMemo(() => {
    const m = new Map<string, { n: number; ok: number }>();
    for (const a of s.attempts) {
      const v = m.get(a.date) ?? { n: 0, ok: 0 };
      v.n++;
      if (a.correct) v.ok++;
      m.set(a.date, v);
    }
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 60);
  }, [s.attempts]);
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Résultats aux quiz</h2>
        {byDay.length ? (
          <ul className="divide-y divide-line text-sm">
            {byDay.map(([d, v]) => (
              <li key={d} className="flex justify-between py-2">
                <span>{d}</span>
                <span className="tabular-nums">
                  {v.ok}/{v.n} ({Math.round((v.ok / v.n) * 100)} %)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="Aucun quiz pour le moment" />
        )}
      </Card>
      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Fiches étudiées</h2>
        <ItemList items={Object.values(s.studied).sort((a, b) => b.at.localeCompare(a.at))} empty="Aucune fiche étudiée" />
      </Card>
      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Articles lus</h2>
        <ItemList items={Object.values(s.read).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 100)} empty="Aucun article ouvert" />
      </Card>
      <p className="text-xs text-muted">Thèmes des quiz : {Object.values(THEME_LABELS).join(', ')}.</p>
    </div>
  );
}

function Settings() {
  const s = useStore((x) => x);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [ai, setAi] = useState(s.ai);

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-sauvegarde-${parisDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {!isStorageOk() && <Notice tone="bad">Le stockage local est indisponible (navigation privée ?) : votre progression ne sera pas conservée.</Notice>}
      <Card>
        <h2 className="mb-3 font-serif text-lg font-semibold">Affichage</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            Thème
            <select value={s.theme} onChange={(e) => update((x) => ({ ...x, theme: e.target.value as typeof s.theme }))} className="rounded-lg border border-line bg-card px-2 py-1">
              <option value="system">Automatique</option>
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            Taille du texte
            <select value={s.textSize} onChange={(e) => update((x) => ({ ...x, textSize: e.target.value as typeof s.textSize }))} className="rounded-lg border border-line bg-card px-2 py-1">
              <option value="normal">Normale</option>
              <option value="large">Grande</option>
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Assistant IA (facultatif)</h2>
        <p className="mb-3 text-sm text-muted">
          « Comprendre davantage » fonctionne sans IA (recherche dans les fiches d'ATLAS). Vous pouvez connecter un modèle compatible avec l'API OpenAI : OpenRouter (certains modèles gratuits), Groq, Mistral, ou un modèle local via Ollama (<code>http://localhost:11434/v1/chat/completions</code>, sur ordinateur). Vérifiez les conditions et quotas gratuits du fournisseur : ils évoluent.
        </p>
        <div className="grid gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={ai.enabled} onChange={(e) => setAi({ ...ai, enabled: e.target.checked })} /> Activer l'assistant
          </label>
          <label className="grid gap-1">
            Adresse de l'API (chat/completions)
            <input value={ai.endpoint} onChange={(e) => setAi({ ...ai, endpoint: e.target.value })} className="rounded-lg border border-line bg-card px-2 py-1.5 text-[16px]" />
          </label>
          <label className="grid gap-1">
            Modèle
            <input value={ai.model} onChange={(e) => setAi({ ...ai, model: e.target.value })} placeholder="identifiant exact du modèle chez le fournisseur" className="rounded-lg border border-line bg-card px-2 py-1.5 text-[16px]" />
          </label>
          <label className="grid gap-1">
            Clé d'API (stockée uniquement sur cet appareil)
            <input type="password" value={ai.apiKey} onChange={(e) => setAi({ ...ai, apiKey: e.target.value })} autoComplete="off" className="rounded-lg border border-line bg-card px-2 py-1.5 text-[16px]" />
          </label>
          <div>
            <button
              onClick={() => {
                update((x) => ({ ...x, ai }));
                setMsg('Réglages de l’assistant enregistrés.');
              }}
              className="rounded-lg bg-ink px-4 py-2 text-paper"
            >
              Enregistrer
            </button>
          </div>
          <p className="text-xs text-muted">La clé n'est jamais incluse dans l'export et n'est envoyée qu'à l'adresse indiquée ci-dessus. N'utilisez pas une clé liée à un moyen de paiement si vous voulez rester dans la gratuité.</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-serif text-lg font-semibold">Mes données</h2>
        <p className="mb-3 text-sm text-muted">
          Aucune création de compte, aucune donnée envoyée à un serveur : progression, favoris et réglages sont stockés dans ce navigateur. Exportez-les régulièrement pour les sauvegarder ou les transférer sur un autre appareil.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <button onClick={download} className="rounded-lg border border-line px-3 py-2 hover:border-accent">
            Exporter (JSON)
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-line px-3 py-2 hover:border-accent">
            Importer une sauvegarde
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                importData(await f.text());
                setMsg('Sauvegarde importée.');
              } catch (err) {
                setMsg((err as Error).message);
              }
              e.target.value = '';
            }}
          />
          <button
            onClick={() => {
              if (confirm('Supprimer définitivement toute votre progression, vos favoris et vos réglages sur cet appareil ?')) {
                resetData();
                setAi(useStoreSnapshotAi());
                setMsg('Toutes les données ont été supprimées.');
              }
            }}
            className="rounded-lg border border-bad/40 px-3 py-2 text-bad hover:bg-bad/5"
          >
            Supprimer mes données
          </button>
        </div>
        {msg && <p className="mt-2 text-sm text-accent">{msg}</p>}
      </Card>
      <p className="text-center text-xs text-muted">
        <Link to="/methode" className="hover:underline">Méthode et fiabilité</Link> · <Link to="/sources" className="hover:underline">État des sources</Link>
      </p>
    </div>
  );
}

const useStoreSnapshotAi = () => ({ enabled: false, endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: '', apiKey: '' });

export default function Progress() {
  const { section } = useParams();
  return (
    <div>
      <PageHeader title="Progression" subtitle="Votre apprentissage, vos favoris et vos données" />
      <div className="-mx-4 mb-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div className="flex w-max gap-1.5">
          {SUBNAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `rounded-full border px-3 py-1.5 text-sm ${isActive ? 'border-ink bg-ink text-paper' : 'border-line bg-card text-muted'}`}>
              {n.label}
            </NavLink>
          ))}
        </div>
      </div>
      {section === 'quiz' || section === 'revisions' ? <QuizHub /> : section === 'favoris' ? <Favorites /> : section === 'historique' ? <HistoryLog /> : section === 'reglages' ? <Settings /> : <Dashboard />}
    </div>
  );
}
