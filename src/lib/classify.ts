import type { StatementType, ThemeId } from './types';
import { normalize } from './text';

/** Mots-clés (normalisés, FR + EN) par thématique, séparés par des virgules. */
const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

export const THEME_KEYWORDS: Record<ThemeId, string[]> = {
  politique: csv(`election, elections, elu, elue, scrutin, presidentielle, legislatives, referendum, gouvernement, premier ministre, parlement, assemblee nationale, senat, motion de censure, coalition, opposition, parti, ministre, reforme, dissolution, depute, deputes, candidat, candidature, campagne electorale,
    government, parliament, prime minister, lawmakers, ballot, candidate, candidacy, presidential race, impeachment, cabinet, opposition leader, election campaign`),
  diplomatie: csv(`diplomatie, diplomatique, diplomates, sommet, ambassade, ambassadeur, negociations, pourparlers, accord de paix, traite, visite officielle, mediation, bilateral, multilateral, reconnaissance, emissaire, chef de la diplomatie, affaires etrangeres, sanctions,
    diplomacy, diplomatic, summit, embassy, ambassador, talks, negotiations, peace deal, treaty, envoy, mediation, foreign minister, foreign ministry, sanctions, joint meeting`),
  defense: csv(`armee, armees, militaire, militaires, defense, armement, armements, missile, missiles, drone, drones, char, chars, rafale, porte avions, marine nationale, sous marin, soldats, troupes, dissuasion, munitions, budget militaire, base militaire, exercice militaire, otan,
    military, army, navy, air force, troops, soldiers, weapons, arms, defence, defense, fighter jets, warship, submarine, munitions, deterrence, pentagon, nato, nuclear weapons`),
  conflits: csv(`guerre, frappe, frappes, bombardement, bombardements, combats, offensive, attaque, attaques, cessez le feu, otage, otages, ligne de front, rebelles, insurges, jihadistes, tues, invasion, assaut, riposte, armistice, commandant,
    war, strike, strikes, airstrike, airstrikes, bombing, bombardment, fighting, offensive, attack, attacks, ceasefire, truce, hostages, frontline, rebels, militants, jihadists, killed, invasion, shelling, raid, clashes, commander`),
  economie: csv(`economie, economique, croissance, inflation, taux d interet, bourse, marches financiers, commerce, droits de douane, tarifs douaniers, exportations, importations, pib, dette, deficit, banque centrale, chomage, recession, investissement, industrie, amende,
    economy, economic, growth, inflation, interest rates, stocks, markets, trade, tariffs, exports, imports, gdp, debt, deficit, central bank, recession, unemployment, investment, fines`),
  energie: csv(`energie, energetique, petrole, gaz, gnl, electricite, renouvelable, renouvelables, gazoduc, oleoduc, opep, baril, centrale nucleaire, uranium, hydrogene, detroit d ormuz,
    energy, oil, gas, lng, crude, electricity, renewable, renewables, pipeline, opec, barrel, power plant, uranium, strait of hormuz`),
  technologie: csv(`intelligence artificielle, technologie, technologique, numerique, semi conducteurs, puces, cybersecurite, spatial, satellite, satellites, fusee, quantique,
    artificial intelligence, technology, tech, chip, chips, semiconductor, semiconductors, space, rocket, satellite, quantum, ai chips`),
  securite: csv(`terrorisme, terroriste, terroristes, attentat, securite, renseignement, espionnage, espion, cyberattaque, sabotage, menace, hybride, ingerence, desinformation, fusillade,
    terrorism, terrorist, security, intelligence, espionage, spy, spying, cyberattack, cyber attack, sabotage, threat, interference, disinformation, shooting`),
};

const EXCLUDE_PHRASES = csv(`football, ligue des champions, ligue 1, tennis, rugby, basket, nba, cricket, golf, formule 1, jeux olympiques, match, matchs, buteur, cinema, film, festival, album, chanteur, chanteuse, concert, netflix, recette, horoscope, celebrite, celebrity, soccer, premier league, oscars, grammy, eurovision, gorilla, zoo, auction, enchere`);
const THEME_PHRASES = THEME_KEYWORDS;

export function hasPhrase(normText: string, phrase: string): boolean {
  return normText.includes(` ${phrase} `);
}

export function detectThemes(text: string): { themes: ThemeId[]; scores: Partial<Record<ThemeId, number>> } {
  const n = normalize(text);
  const scores: Partial<Record<ThemeId, number>> = {};
  for (const [theme, phrases] of Object.entries(THEME_PHRASES) as [ThemeId, string[]][]) {
    let s = 0;
    for (const p of phrases) if (p.length > 1 && hasPhrase(n, p)) s += p.includes(' ') ? 2 : 1;
    if (s > 0) scores[theme] = s;
  }
  const themes = (Object.entries(scores) as [ThemeId, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
  return { themes, scores };
}

export function isOffTopic(text: string): boolean {
  const n = normalize(text);
  return EXCLUDE_PHRASES.some((p) => hasPhrase(n, p));
}

const ACCUSATION = /\b(accus\w*|d[ée]nonc\w*|all[èe]gu\w*|pr[ée]sum[ée]e?s?|blames?d?|alleg\w*|charged with)\b/i;
const HYPOTHESE = /\b(pourrai(t|ent)|risque(nt)? de|envisag\w*|serai(t|ent)|aurai(t|ent)|probabl\w*|possible|could|may|might|considering|weighs|poised|likely|expected to|mulls|reportedly|set to)\b/i;
const DECLARATION = /\b(affirm\w*|d[ée]clar\w*|annonc\w*|assur\w*|estim\w*|promet\w*|menac\w*|appell?\w*|selon|says|said|announc\w*|vows?|warns?|claims?|insists?|tells|calls? for|pledges?|urges?|according to)\b|[«“"]|:\s/i;

/** Nature de l'énoncé d'un titre. Heuristique : la priorité va à la catégorie la plus prudente. */
export function detectStatement(title: string): StatementType {
  if (ACCUSATION.test(title)) return 'accusation';
  if (HYPOTHESE.test(title)) return 'hypothese';
  if (DECLARATION.test(title)) return 'declaration';
  return 'fait';
}

/** Correspondances bilingues d'événements, pour rapprocher un titre français et un titre anglais. */
const EVENT_KEYS: [string, string[]][] = [
  ['strike', ['frappe', 'frappes', 'strike', 'strikes', 'airstrike', 'airstrikes', 'bombardement', 'bombardements', 'bombing']],
  ['ceasefire', ['cessez le feu', 'ceasefire', 'treve', 'truce']],
  ['summit', ['sommet', 'summit']],
  ['election', ['election', 'elections', 'scrutin', 'presidentielle', 'legislatives', 'vote', 'ballot']],
  ['sanctions', ['sanctions', 'sanction']],
  ['missile', ['missile', 'missiles']],
  ['drone', ['drone', 'drones']],
  ['hostage', ['otage', 'otages', 'hostage', 'hostages']],
  ['deal', ['accord', 'deal', 'agreement', 'traite', 'treaty']],
  ['talks', ['negociations', 'pourparlers', 'talks', 'negotiations']],
  ['tariff', ['droits de douane', 'tarifs douaniers', 'tariff', 'tariffs']],
  ['quake', ['seisme', 'tremblement de terre', 'earthquake']],
  ['resign', ['demission', 'demissionne', 'resign', 'resigns', 'resignation']],
  ['attack', ['attentat', 'attaque', 'attack', 'attacks']],
  ['protest', ['manifestation', 'manifestations', 'manifestants', 'protest', 'protests', 'protesters']],
  ['nuclear', ['nucleaire', 'nuclear']],
  ['oil', ['petrole', 'oil', 'brut', 'crude']],
  ['gas', ['gaz', 'gas', 'gnl', 'lng']],
  ['flood', ['inondations', 'inondation', 'floods', 'flooding']],
  ['coup', ['coup d etat', 'putsch', 'coup']],
  ['arrest', ['arrestation', 'arrete', 'interpelle', 'arrested', 'arrest', 'detained']],
  ['visit', ['visite', 'visit']],
  ['budget', ['budget', 'budgetaire']],
  ['aid', ['aide', 'aid']],
  ['ship', ['navire', 'navires', 'petrolier', 'ship', 'ships', 'tanker', 'vessel']],
  ['blast', ['explosion', 'blast']],
  ['fire', ['incendie', 'incendies', 'wildfire', 'wildfires', 'fire']],
  ['migration', ['migrants', 'refugies', 'refugees', 'migration']],
  ['dead', ['morts', 'tues', 'killed', 'dead', 'deaths']],
  ['death_sentence', ['condamne a mort', 'condamnes a mort', 'peine de mort', 'sentenced to death', 'death penalty']],
  ['ebola', ['ebola']],
  ['meeting', ['rencontre', 'reunion', 'meeting', 'meet']],
  ['membership', ['adhesion', 'membership']],
  ['spy', ['espion', 'espionnage', 'spy', 'espionage']],
  ['chips', ['puces', 'semi conducteurs', 'chips', 'semiconductors']],
];

export function detectEventKeys(text: string): string[] {
  const n = normalize(text);
  const keys: string[] = [];
  for (const [key, words] of EVENT_KEYS) if (words.some((w) => hasPhrase(n, w))) keys.push(`ev:${key}`);
  return keys;
}

/** Noms propres (mots capitalisés hors début de phrase), utiles pour rapprocher des langues différentes. */
export function properNouns(title: string): string[] {
  const words = title.replace(/[«»"“”‘’'():,;!?]/g, ' ').split(/\s+/).filter(Boolean);
  const out: string[] = [];
  words.forEach((w, i) => {
    if (i === 0) return;
    if (/^[A-ZÀ-Ý][a-zà-ÿ\-]{3,}$/.test(w)) out.push(`pn:${normalize(w).trim()}`);
  });
  return out;
}

/** Chiffres associés à un bilan humain, pour repérer d'éventuelles divergences. */
export function casualtyFigures(text: string): { kind: 'morts' | 'blesses'; value: number }[] {
  const out: { kind: 'morts' | 'blesses'; value: number }[] = [];
  const re = /(\d[\d\s.,]*)\s+(?:personnes?\s+|people\s+|civils?\s+|civilians?\s+)?(morts?|tu[ée]s|victimes|killed|dead|bless[ée]s|injured|wounded)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const value = Number(m[1].replace(/[\s.,]/g, ''));
    if (!Number.isFinite(value) || value <= 0 || value > 10_000_000) continue;
    out.push({ kind: /bless|injur|wound/i.test(m[2]) ? 'blesses' : 'morts', value });
  }
  return out;
}
