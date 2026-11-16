import type { RegionId, SourceKind, ThemeId } from '../src/lib/types';

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  lang: 'fr' | 'en';
  /** Groupe éditorial / propriétaire : deux flux d'un même groupe ne comptent pas comme deux confirmations. */
  group: string;
  kind: SourceKind;
  regionHint?: RegionId;
  themeHint?: ThemeId;
  stateAffiliated?: boolean;
  note?: string;
}

/**
 * Flux RSS/Atom publics. Aucune clé n'est nécessaire. Si un flux disparaît ou change d'adresse,
 * le pipeline le signale dans sources.json et continue avec les autres.
 *
 * Retirés après la première collecte réelle (novembre 2026) : France 24, The Times of Israel et
 * L'Orient-Le Jour (accès refusé aux robots, HTTP 403 — ATLAS ne contourne pas ces protections),
 * OTAN et CSIS (flux supprimés ou abandonnés), Carnegie et DW en français (flux vides).
 *
 * Absents faute de flux public officiel : Reuters (flux RSS supprimés en 2020), Associated Press, AFP.
 * Leurs dépêches sont toutefois repérées lorsqu'elles sont citées par les médias ci-dessous
 * (ex. « avec AFP »), ce qui sert au calcul d'indépendance des sources.
 */
export const FEEDS: FeedSource[] = [
  // — Généralistes francophones
  { id: 'lemonde-int', name: 'Le Monde', url: 'https://www.lemonde.fr/international/rss_full.xml', lang: 'fr', group: 'Le Monde', kind: 'media' },
  { id: 'lemonde-pol', name: 'Le Monde', url: 'https://www.lemonde.fr/politique/rss_full.xml', lang: 'fr', group: 'Le Monde', kind: 'media', regionHint: 'france', themeHint: 'politique' },
  { id: 'lemonde-eco', name: 'Le Monde', url: 'https://www.lemonde.fr/economie/rss_full.xml', lang: 'fr', group: 'Le Monde', kind: 'media', themeHint: 'economie' },
  { id: 'rfi', name: 'RFI', url: 'https://www.rfi.fr/fr/rss', lang: 'fr', group: 'France Médias Monde', kind: 'media' },
  { id: 'rfi-afrique', name: 'RFI Afrique', url: 'https://www.rfi.fr/fr/afrique/rss', lang: 'fr', group: 'France Médias Monde', kind: 'media', regionHint: 'afrique' },
  { id: 'franceinfo-monde', name: 'franceinfo', url: 'https://www.francetvinfo.fr/monde.rss', lang: 'fr', group: 'France Télévisions', kind: 'media' },
  { id: 'franceinfo-pol', name: 'franceinfo', url: 'https://www.francetvinfo.fr/politique.rss', lang: 'fr', group: 'France Télévisions', kind: 'media', regionHint: 'france', themeHint: 'politique' },
  { id: 'lefigaro-int', name: 'Le Figaro', url: 'https://www.lefigaro.fr/rss/figaro_international.xml', lang: 'fr', group: 'Le Figaro', kind: 'media' },
  { id: 'euronews-fr', name: 'Euronews', url: 'https://fr.euronews.com/rss', lang: 'fr', group: 'Euronews', kind: 'media', regionHint: 'europe' },
  { id: 'lgc', name: 'Le Grand Continent', url: 'https://legrandcontinent.eu/fr/feed/', lang: 'fr', group: 'Le Grand Continent', kind: 'analyse' },
  // — Généralistes internationaux
  { id: 'bbc-world', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', lang: 'en', group: 'BBC', kind: 'media' },
  { id: 'bbc-business', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', lang: 'en', group: 'BBC', kind: 'media', themeHint: 'economie' },
  { id: 'guardian-world', name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', lang: 'en', group: 'Guardian Media Group', kind: 'media' },
  { id: 'dw-en', name: 'Deutsche Welle', url: 'https://rss.dw.com/rdf/rss-en-world', lang: 'en', group: 'Deutsche Welle', kind: 'media' },
  { id: 'aljazeera', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', lang: 'en', group: 'Al Jazeera', kind: 'media', stateAffiliated: true, note: 'Financé par l’État du Qatar' },
  { id: 'nyt-world', name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', lang: 'en', group: 'New York Times', kind: 'media' },
  { id: 'npr-world', name: 'NPR', url: 'https://feeds.npr.org/1004/rss.xml', lang: 'en', group: 'NPR', kind: 'media' },
  // — Régionaux
  { id: 'jpost', name: 'The Jerusalem Post', url: 'https://www.jpost.com/rss/rssfeedsfrontpage.aspx', lang: 'en', group: 'Jerusalem Post', kind: 'media', regionHint: 'moyen-orient' },
  { id: 'dailysabah', name: 'Daily Sabah', url: 'https://www.dailysabah.com/rssFeed/world', lang: 'en', group: 'Turkuvaz', kind: 'media', regionHint: 'moyen-orient', note: 'Ligne proche du gouvernement turc' },
  { id: 'tehrantimes', name: 'Tehran Times', url: 'https://www.tehrantimes.com/rss', lang: 'en', group: 'Tehran Times', kind: 'media', regionHint: 'moyen-orient', stateAffiliated: true, note: 'Média officiel iranien : à lire comme la position de Téhéran' },
  { id: 'scmp', name: 'South China Morning Post', url: 'https://www.scmp.com/rss/91/feed', lang: 'en', group: 'SCMP (Alibaba)', kind: 'media', regionHint: 'asie' },
  { id: 'japantimes', name: 'The Japan Times', url: 'https://www.japantimes.co.jp/feed/', lang: 'en', group: 'Japan Times', kind: 'media', regionHint: 'asie' },
  { id: 'thehindu', name: 'The Hindu', url: 'https://www.thehindu.com/news/international/feeder/default.rss', lang: 'en', group: 'The Hindu', kind: 'media', regionHint: 'asie' },
  { id: 'jeuneafrique', name: 'Jeune Afrique', url: 'https://www.jeuneafrique.com/feed/', lang: 'fr', group: 'Jeune Afrique', kind: 'media', regionHint: 'afrique' },
  // — Institutionnelles (sources primaires)
  { id: 'onu-info', name: 'ONU Info', url: 'https://news.un.org/feed/subscribe/fr/news/all/rss.xml', lang: 'fr', group: 'ONU', kind: 'institution' },
  // — Défense
  { id: 'opex360', name: 'Zone Militaire (opex360)', url: 'https://www.opex360.com/feed/', lang: 'fr', group: 'Zone Militaire', kind: 'defense', themeHint: 'defense' },
  { id: 'defensenews', name: 'Defense News', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml', lang: 'en', group: 'Defense News', kind: 'defense', themeHint: 'defense' },
  { id: 'breakingdefense', name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/', lang: 'en', group: 'Breaking Defense', kind: 'defense', themeHint: 'defense' },
  // — Analyse (think tanks)
  { id: 'iris', name: 'IRIS', url: 'https://www.iris-france.org/feed/', lang: 'fr', group: 'IRIS', kind: 'analyse' },
  { id: 'theconversation-fr', name: 'The Conversation France', url: 'https://theconversation.com/fr/articles.atom', lang: 'fr', group: 'The Conversation', kind: 'analyse' },
];

/** Agences de presse détectables dans les textes. */
export const WIRES: { name: string; re: RegExp }[] = [
  { name: 'AFP', re: /\bAFP\b|Agence France-Presse/ },
  { name: 'Reuters', re: /\bReuters\b/ },
  { name: 'AP', re: /\(AP\)|\bAssociated Press\b|\bAP\b —/ },
];
