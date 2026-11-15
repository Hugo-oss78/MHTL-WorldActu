import type { QuizQuestion } from '../lib/types';

export interface Ref {
  label: string;
  url: string;
}

/** Lien de recherche Wikipédia : redirige vers l'article s'il existe, sinon vers les résultats (jamais de lien cassé). */
export const wp = (term: string): Ref => ({
  label: `Wikipédia — « ${term} »`,
  url: `https://fr.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(term)}&go=Go`,
});
export const site = (label: string, url: string): Ref => ({ label, url });

export type DossierCategory =
  | 'puissance'
  | 'organisation'
  | 'alliance'
  | 'conflit'
  | 'tension'
  | 'ressource'
  | 'route'
  | 'energie';

export interface Dossier {
  id: string;
  title: string;
  category: DossierCategory;
  /** Date de rédaction et limite de connaissance : la situation a pu évoluer depuis. */
  asOf: string;
  summary: string;
  whyItMatters: string;
  countries: string[]; // ISO3
  orgs: string[];
  keywords: string[]; // formes normalisées
  sections: {
    situation: string;
    histoire: string;
    acteurs: string;
    interets: string;
    alliances: string;
    rapports: string;
    scenarios: string[];
    europeFrance: string;
  };
  timeline: { year: number; label: string }[];
  sources: Ref[];
  quiz: Omit<QuizQuestion, 'theme' | 'id'>[];
}

export type Period =
  | 'antiquite'
  | 'moyen-age'
  | 'empires'
  | 'revolutions'
  | 'napoleon'
  | 'ww1'
  | 'ww2'
  | 'guerre-froide'
  | 'contemporain';

export const PERIOD_LABELS: Record<Period, string> = {
  antiquite: 'Antiquité',
  'moyen-age': 'Moyen Âge',
  empires: 'Grandes civilisations et empires',
  revolutions: 'Révolutions',
  napoleon: 'Guerres napoléoniennes',
  ww1: 'Première Guerre mondiale',
  ww2: 'Seconde Guerre mondiale',
  'guerre-froide': 'Guerre froide',
  contemporain: 'Histoire contemporaine',
};

export type HistoryType = 'evenement' | 'guerre' | 'bataille' | 'personnalite' | 'thematique' | 'revolution' | 'traite';

export const HISTORY_TYPE_LABELS: Record<HistoryType, string> = {
  evenement: 'Événement',
  guerre: 'Guerre',
  bataille: 'Bataille',
  personnalite: 'Personnalité',
  thematique: 'Thématique',
  revolution: 'Révolution',
  traite: 'Traité',
};

export interface HistoryFiche {
  id: string;
  title: string;
  dateLabel: string;
  year: number; // négatif avant notre ère
  monthDay?: string; // MM-JJ pour les anniversaires
  period: Period;
  type: HistoryType;
  civilisation: string;
  countries: string[];
  contexte: string;
  personnages: { name: string; role: string }[];
  deroulement: string;
  consequences: string;
  heritage: string;
  lienActualite?: { text: string; dossierId?: string };
  keywords: string[];
  sources: Ref[];
}

export interface Concept {
  id: string;
  term: string;
  definition: string;
  exemple: string;
  actualite: string;
  keywords: string[];
  related?: string[];
}

export type CultureCategory =
  | 'dirigeants'
  | 'philosophes'
  | 'strateges'
  | 'economistes'
  | 'doctrines'
  | 'institutions'
  | 'religions'
  | 'inventions';

export const CULTURE_LABELS: Record<CultureCategory, string> = {
  dirigeants: 'Grands dirigeants',
  philosophes: 'Philosophes',
  strateges: 'Stratèges',
  economistes: 'Économistes',
  doctrines: 'Doctrines politiques',
  institutions: 'Grandes institutions',
  religions: 'Religions et civilisations',
  inventions: 'Grandes inventions',
};

export interface CultureFiche {
  id: string;
  name: string;
  category: CultureCategory;
  dates: string;
  summary: string;
  keyIdeas: string[];
  whyItMatters: string;
  sources: Ref[];
}
