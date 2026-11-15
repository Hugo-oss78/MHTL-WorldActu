import type { QuizQuestion } from '../lib/types';
import { seededRandom, shuffle } from '../lib/text';
import { CONCEPTS } from './concepts';
import { CULTURE } from './culture';
import { DOSSIERS } from './dossiers';
import { HISTORY } from './history';

/** Questions rédigées à la main (culture générale et géographie). */
const HANDWRITTEN: QuizQuestion[] = [
  { id: 'q-capitale-australie', theme: 'culture', question: "Quelle est la capitale de l'Australie ?", options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 2, explanation: 'Canberra a été créée comme compromis entre Sydney et Melbourne ; le Parlement fédéral y siège depuis 1927.', extra: 'Plusieurs pays ont une capitale distincte de leur plus grande ville : Turquie (Ankara), Canada (Ottawa), Brésil (Brasília).' },
  { id: 'q-capitale-turquie', theme: 'culture', question: 'Quelle est la capitale de la Turquie ?', options: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'], answer: 1, explanation: "Mustafa Kemal (Atatürk) fait d'Ankara la capitale en 1923, à la fondation de la République.", extra: 'Istanbul reste le cœur économique et la plus grande ville du pays.' },
  { id: 'q-membres-ue', theme: 'geopolitique', question: "Combien d'États membres compte l'Union européenne depuis le départ du Royaume-Uni ?", options: ['25', '27', '28', '30'], answer: 1, explanation: "L'UE compte 27 membres depuis le Brexit, effectif le 31 janvier 2020.", extra: 'Le dernier pays à avoir adhéré est la Croatie, en 2013.' },
  { id: 'q-brics', theme: 'geopolitique', question: 'Quels pays ont fondé le groupe BRIC(S) à l’origine ?', options: ['Brésil, Russie, Inde, Chine', 'Brésil, Royaume-Uni, Iran, Canada', 'Bolivie, Russie, Indonésie, Chili', 'Belgique, Roumanie, Italie, Croatie'], answer: 0, explanation: "Le BRIC réunit d'abord le Brésil, la Russie, l'Inde et la Chine (premier sommet en 2009) ; l'Afrique du Sud rejoint le groupe en 2010-2011, d'où le « S ».", extra: "Le groupe s'est élargi à partir de 2024 à de nouveaux membres." },
  { id: 'q-schengen', theme: 'geopolitique', question: "Que permet l'espace Schengen ?", options: ['Une monnaie commune', 'La libre circulation des personnes sans contrôles aux frontières intérieures', 'Une défense commune', 'Un marché commun de l’énergie'], answer: 1, explanation: "Les accords de Schengen (1985) et leur convention d'application (1990) suppriment les contrôles systématiques aux frontières intérieures.", extra: "Des contrôles temporaires peuvent être rétablis en cas de menace grave ; certains pays de l'espace Schengen ne sont pas membres de l'UE (Suisse, Norvège, Islande, Liechtenstein)." },
  { id: 'q-chapitre7', theme: 'concepts', question: 'Quel chapitre de la Charte des Nations unies permet au Conseil de sécurité d’autoriser le recours à la force ?', options: ['Chapitre I', 'Chapitre VI', 'Chapitre VII', 'Chapitre XII'], answer: 2, explanation: 'Le chapitre VII porte sur l’action en cas de menace contre la paix, de rupture de la paix et d’acte d’agression.', extra: 'Le chapitre VI concerne le règlement pacifique des différends.' },
  { id: 'q-detroit-malacca', theme: 'geopolitique', question: 'Quel détroit relie l’océan Indien à la mer de Chine méridionale ?', options: ['Le détroit de Malacca', 'Le détroit de Béring', 'Le détroit de Gibraltar', 'Le Bosphore'], answer: 0, explanation: 'Le détroit de Malacca, entre la péninsule malaise et Sumatra, est l’une des routes maritimes les plus fréquentées du monde.', extra: 'La dépendance chinoise à ce passage est souvent appelée le « dilemme de Malacca ».' },
  { id: 'q-tnp', theme: 'concepts', question: 'Combien d’États sont reconnus comme « dotés de l’arme nucléaire » par le TNP ?', options: ['3', '5', '7', '9'], answer: 1, explanation: 'Le TNP reconnaît les cinq États ayant fait exploser un engin nucléaire avant le 1er janvier 1967 : États-Unis, URSS/Russie, Royaume-Uni, France, Chine.', extra: "L'Inde, le Pakistan, la Corée du Nord et Israël (non déclaré) possèdent aussi l'arme nucléaire hors du cadre du TNP." },
  { id: 'q-ve-republique', theme: 'culture', question: 'Depuis quelle année le président de la République française est-il élu au suffrage universel direct ?', options: ['1958', '1962', '1969', '2000'], answer: 1, explanation: 'La réforme a été adoptée par référendum en octobre 1962 ; la première élection a eu lieu en 1965.', extra: 'Le quinquennat a remplacé le septennat après le référendum de 2000.' },
  { id: 'q-onu-membres', theme: 'geopolitique', question: "Combien d'États sont membres de l'ONU ?", options: ['51', '150', '193', '211'], answer: 2, explanation: "L'ONU compte 193 États membres ; le dernier admis est le Soudan du Sud (2011).", extra: "51 États ont fondé l'organisation en 1945. Le Saint-Siège et la Palestine ont le statut d'observateur." },
];

function yearOptions(year: number, rnd: () => number): { options: string[]; answer: number } {
  const offsets = shuffle([-27, -12, -5, 6, 14, 31, 48], rnd).slice(0, 3);
  const fmt = (y: number) => (y < 0 ? `${-y} av. J.-C.` : String(y));
  const values = [year, ...offsets.map((o) => year + o)];
  const options = shuffle(values, rnd);
  return { options: options.map(fmt), answer: options.indexOf(year) };
}

/** Banque complète : questions rédigées + questions générées à partir des fiches (jamais d'information extérieure). */
export function buildQuestionBank(): QuizQuestion[] {
  const bank: QuizQuestion[] = [...HANDWRITTEN];
  for (const d of DOSSIERS)
    d.quiz.forEach((q, i) =>
      bank.push({ ...q, id: `d-${d.id}-${i}`, theme: 'geopolitique', link: { label: `Dossier : ${d.title}`, url: `/geopolitique/dossier/${d.id}`, internal: true } }),
    );
  for (const h of HISTORY) {
    const rnd = seededRandom(h.id);
    const y = yearOptions(h.year, rnd);
    bank.push({
      id: `h-${h.id}-annee`,
      theme: 'histoire',
      question: `En quelle année situe-t-on : « ${h.title} » ?`,
      options: y.options,
      answer: y.answer,
      explanation: `Date retenue : ${h.dateLabel}. ${h.contexte.split('. ')[0]}.`,
      extra: h.consequences.split('. ')[0] + '.',
      link: { label: `Fiche : ${h.title}`, url: `/histoire/fiche/${h.id}`, internal: true },
      generated: true,
    });
    const main = h.personnages[0];
    const others = shuffle(HISTORY.filter((o) => o.id !== h.id && o.period !== h.period).flatMap((o) => o.personnages.map((p) => p.name)), rnd).filter((n) => !h.personnages.some((p) => p.name === n));
    if (main && others.length >= 3) {
      const options = shuffle([main.name, ...others.slice(0, 3)], rnd);
      bank.push({
        id: `h-${h.id}-perso`,
        theme: 'histoire',
        question: `Quel personnage est directement associé à « ${h.title} » (${h.dateLabel}) ?`,
        options,
        answer: options.indexOf(main.name),
        explanation: `${main.name} : ${main.role}.`,
        extra: h.heritage.split('. ')[0] + '.',
        link: { label: `Fiche : ${h.title}`, url: `/histoire/fiche/${h.id}`, internal: true },
        generated: true,
      });
    }
  }
  for (const c of CONCEPTS) {
    const rnd = seededRandom(c.id);
    const distract = shuffle(CONCEPTS.filter((o) => o.id !== c.id), rnd).slice(0, 3).map((o) => o.term);
    const options = shuffle([c.term, ...distract], rnd);
    bank.push({
      id: `c-${c.id}`,
      theme: 'concepts',
      question: `Quelle notion correspond à cette définition ? « ${c.definition.split('. ')[0].replace(new RegExp(c.term, 'ig'), '…')}. »`,
      options,
      answer: options.indexOf(c.term),
      explanation: c.definition,
      extra: `Exemple : ${c.exemple}`,
      link: { label: `Concept : ${c.term}`, url: `/culture/concept/${c.id}`, internal: true },
      generated: true,
    });
  }
  for (const f of CULTURE) {
    const rnd = seededRandom(f.id);
    const idea = f.keyIdeas[0];
    const same = CULTURE.filter((o) => o.id !== f.id && o.category === f.category);
    const pool = same.length >= 3 ? same : CULTURE.filter((o) => o.id !== f.id);
    const options = shuffle([f.name, ...shuffle(pool, rnd).slice(0, 3).map((o) => o.name)], rnd);
    bank.push({
      id: `k-${f.id}`,
      theme: 'culture',
      question: `À qui ou à quoi associe-t-on cette idée : « ${idea} » ?`,
      options,
      answer: options.indexOf(f.name),
      explanation: `${f.name} (${f.dates}) : ${f.summary}`,
      extra: f.whyItMatters,
      link: { label: f.name, url: `/culture/fiche/${f.id}`, internal: true },
      generated: true,
    });
  }
  return bank;
}

export const QUESTION_BANK = buildQuestionBank();
export const QUESTION_BY_ID: Record<string, QuizQuestion> = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]));
