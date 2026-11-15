// Types partagés entre le pipeline (Node) et l'application (navigateur).

export type RegionId =
  | 'france'
  | 'europe'
  | 'moyen-orient'
  | 'ameriques'
  | 'asie'
  | 'afrique'
  | 'oceanie'
  | 'monde';

export type ThemeId =
  | 'politique'
  | 'diplomatie'
  | 'defense'
  | 'conflits'
  | 'economie'
  | 'energie'
  | 'technologie'
  | 'securite';

export type SourceKind = 'media' | 'institution' | 'analyse' | 'defense';

/** Niveaux de fiabilité affichés. */
export type ReliabilityLevel =
  | 'confirme' // ≥ 3 origines indépendantes
  | 'partiel' // 2 origines indépendantes
  | 'non_confirme' // 1 seule origine
  | 'contradictoire' // divergences détectées
  | 'analyse'; // contenu d'analyse / hypothèse

/** Nature d'un énoncé, détectée automatiquement à partir du titre. */
export type StatementType = 'fait' | 'declaration' | 'accusation' | 'hypothese';

export interface SourceRef {
  sourceId: string;
  sourceName: string;
  group: string;
  kind: SourceKind;
  lang: 'fr' | 'en';
  title: string;
  url: string;
  summary: string;
  publishedAt: string | null;
  statement: StatementType;
  wire: string | null; // agence citée (AFP, Reuters, AP…) si détectée
  stateAffiliated?: boolean;
  /** Résultat de la vérification du lien (null = non vérifié). */
  linkOk?: boolean | null;
}

export interface Reliability {
  level: ReliabilityLevel;
  independentOrigins: number;
  origins: string[];
  notes: string[];
}

export interface Actor {
  id: string;
  name: string;
  type: 'pays' | 'organisation' | 'personne';
}

export interface NewsCluster {
  id: string;
  title: string;
  summary: string;
  lang: 'fr' | 'en';
  firstPublishedAt: string;
  lastPublishedAt: string;
  region: RegionId;
  regions: RegionId[];
  themes: ThemeId[];
  places: string[]; // ISO3
  actors: Actor[];
  reliability: Reliability;
  sources: SourceRef[];
  score: number;
  relatedDossier: string | null;
  ai?: AiSummary | null;
}

export interface AiSummary {
  model: string;
  generatedAt: string;
  resume: string;
  pourquoi: string;
  consequences: string[];
}

export interface SourceStatus {
  id: string;
  name: string;
  url: string;
  ok: boolean;
  items: number;
  error?: string;
  checkedAt: string;
  lastSuccessAt: string | null;
}

export interface QuizQuestion {
  id: string;
  theme: 'actualite' | 'geopolitique' | 'histoire' | 'culture' | 'concepts';
  question: string;
  options: string[];
  answer: number; // index dans options
  explanation: string;
  extra?: string;
  link?: { label: string; url: string; internal?: boolean };
  generated?: boolean; // question générée automatiquement à partir des données
}

export interface OnThisDayEvent {
  year: number;
  text: string;
  url: string | null;
}

export interface Briefing {
  date: string; // AAAA-MM-JJ (heure de Paris)
  generatedAt: string; // ISO
  top: NewsCluster[];
  decryptage: { dossierId: string; reason: string; relatedClusterIds: string[] } | null;
  newsQuiz: QuizQuestion[];
  onThisDay: { source: string; events: OnThisDayEvent[] } | null;
  aiEnabled: boolean;
}

export interface RunStatus {
  lastAttemptAt: string;
  ok: boolean;
  message: string;
}

export interface LatestData {
  schema: 1;
  generatedAt: string;
  briefing: Briefing;
  clusters: NewsCluster[];
  sources: SourceStatus[];
  stats: { items: number; clusters: number; sourcesOk: number; sourcesTotal: number };
}

export interface BriefingIndexEntry {
  date: string;
  generatedAt: string;
  headlines: string[];
}

export interface CountryData {
  iso3: string;
  iso2: string | null;
  name: string;
  wikidata: string | null;
  government: string[];
  headOfState: { name: string; qid: string }[];
  headOfGovernment: { name: string; qid: string }[];
  capital: string | null;
  memberOf: string[];
  indicators: Record<string, { value: number; year: string } | undefined>;
}

export interface CountriesFile {
  generatedAt: string;
  sources: { label: string; url: string }[];
  countries: Record<string, CountryData>;
}

export interface LinkStatusFile {
  checkedAt: string;
  links: Record<string, { ok: boolean; status: number | null; checkedAt: string }>;
}
