// Construit des flux RSS/Atom/RDF de TEST (données d'essai, jamais déployées).
// Les titres BBC proviennent d'un relevé réel du flux BBC World du 15/11/2026 ; les autres sont des
// variantes rédigées pour tester le regroupement multilingue et le calcul de fiabilité.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'feeds');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rss = (items) => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>t</title>${items
  .map(([t, d, date, u]) => `<item><title><![CDATA[${t}]]></title><description><![CDATA[${d}]]></description><link>${esc(u)}</link><pubDate>${new Date(date).toUTCString()}</pubDate></item>`)
  .join('')}</channel></rss>`;
const atom = (items) => `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>t</title>${items
  .map(([t, d, date, u]) => `<entry><title>${esc(t)}</title><link rel="alternate" href="${esc(u)}"/><published>${date}</published><summary>${esc(d)}</summary></entry>`)
  .join('')}</feed>`;
const rdf = (items) => `<?xml version="1.0"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">${items
  .map(([t, d, date, u]) => `<item><title>${esc(t)}</title><link>${esc(u)}</link><description>${esc(d)}</description><dc:date>${date}</dc:date></item>`)
  .join('')}</rdf:RDF>`;

const F = {
  'bbc-world': rss([
    ['Iran targets US military base in Bahrain with drone attack', 'It marks the second attack on the country in three days and comes as the US and Iran remain locked in a stand-off over the Strait of Hormuz.', '2026-11-15T13:42:58Z', 'https://www.bbc.co.uk/news/articles/cqn4e2py48kwo'],
    ['Three men sentenced to death in Jordan over fatal church mass shooting', 'The attack on funeral at a Greek Orthodox church killed nine and injured 34 others last month.', '2026-11-15T11:06:32Z', 'https://www.bbc.co.uk/news/articles/c3rrg9xgqlwpo'],
    ['Israel kills Hamas commander in strike on Gaza camp, officials say', 'Both Hamas and IDF officials confirm the death of Samir Abu Younis, commander of the Rafah Brigade.', '2026-11-15T08:17:41Z', 'https://www.bbc.co.uk/news/articles/cqrkg4r6mg7xo'],
    ['US has floated Ukraine ceding Donbas for Nato membership, Zelensky says', 'The US has not confirmed the Ukrainian president\'s comments - a US official told the BBC "many ideas continue to be discussed".', '2026-11-14T22:37:25Z', 'https://www.bbc.co.uk/news/articles/cwvg2l312ylqo'],
    ['Trump, Putin and Xi plan historic joint meeting in China next week, White House says', 'Trump will discuss the "reduction of nuclear weapons" during the unprecedented talks, a spokeswoman says.', '2026-11-14T15:53:55Z', 'https://www.bbc.co.uk/news/articles/ckz74jzpy18do'],
    ['Italy fines Meta €805m over accessing users\' photos', 'The social media giant is accused of not informing 20 million users it had access to their photos.', '2026-11-14T18:28:06Z', 'https://www.bbc.co.uk/news/articles/cwn83gxemk35o'],
    ['Judo champion shakes up French presidential race with surprise candidacy', 'Teddy Riner is one of the most popular figures in modern-day France, and one in five voters say they could support him.', '2026-11-15T00:06:51Z', 'https://www.bbc.co.uk/news/articles/c6dj1e8wyykmo'],
    ['Jojo the gorilla has spent his life alone. Can he finally find a companion?', 'Jojo was poached as an infant and grew up in captivity.', '2026-11-14T00:03:56Z', 'https://www.bbc.co.uk/news/articles/cwm2mn272nqlo'],
  ]),
  'guardian-world': rss([
    ['Iran launches drone attack on US base in Bahrain amid Hormuz standoff', 'Second attack in three days on US forces in the Gulf, Pentagon says.', '2026-11-15T14:10:00Z', 'https://www.theguardian.com/world/test-iran-bahrain'],
    ['Zelensky says US floated Donbas concession in exchange for Nato membership', 'Ukrainian president makes claim as peace efforts continue; Washington has not confirmed.', '2026-11-15T07:00:00Z', 'https://www.theguardian.com/world/test-zelensky-donbas'],
    ['Trump, Putin and Xi to meet in China next week', 'The White House says the three leaders will discuss nuclear weapons reduction.', '2026-11-14T17:00:00Z', 'https://www.theguardian.com/world/test-trump-putin-xi'],
  ]),
  'aljazeera': rss([
    ['Israeli strike on Gaza camp kills Hamas commander', 'Hamas confirmed the death of the Rafah Brigade commander in the Israeli strike.', '2026-11-15T09:30:00Z', 'https://www.aljazeera.com/news/test-gaza-commander'],
    ['Iran drone attack targets US base in Bahrain', 'Iran’s Revolutionary Guard claimed the drone attack, the second in three days.', '2026-11-15T15:00:00Z', 'https://www.aljazeera.com/news/test-iran-bahrain'],
  ]),
  'lemonde-int': rss([
    ['L’Iran vise une base militaire américaine à Bahreïn par une attaque de drones', 'Deuxième attaque en trois jours, sur fond de bras de fer autour du détroit d’Ormuz entre Washington et Téhéran.', '2026-11-15T14:30:00Z', 'https://www.lemonde.fr/international/test-iran-bahrein'],
    ['Donbass contre adhésion à l’OTAN : Zelensky affirme que Washington a avancé l’idée', 'Les États-Unis n’ont pas confirmé les propos du président ukrainien, selon l’AFP.', '2026-11-15T08:00:00Z', 'https://www.lemonde.fr/international/test-zelensky-donbass'],
  ]),
  'lemonde-pol': rss([
    ['Présidentielle : la candidature surprise de Teddy Riner bouscule la campagne', 'Un électeur sur cinq dit pouvoir voter pour le judoka, selon un sondage.', '2026-11-15T06:00:00Z', 'https://www.lemonde.fr/politique/test-riner'],
    ['Budget 2027 : le Sénat adopte la première partie du projet de loi de finances', 'Les sénateurs ont voté la partie recettes du texte budgétaire du gouvernement.', '2026-11-15T10:00:00Z', 'https://www.lemonde.fr/politique/test-budget'],
  ]),
  'france24-fr': rss([
    ['Gaza : un commandant du Hamas tué dans une frappe israélienne sur un camp', 'Le Hamas et l’armée israélienne ont confirmé la mort du commandant de la brigade de Rafah (avec AFP).', '2026-11-15T09:00:00Z', 'https://www.france24.com/fr/test-gaza-commandant'],
    ['Trump, Poutine et Xi Jinping se réuniront en Chine la semaine prochaine', 'La Maison Blanche annonce un sommet inédit consacré notamment à la réduction des armes nucléaires (AFP).', '2026-11-14T18:00:00Z', 'https://www.france24.com/fr/test-sommet-chine'],
  ]),
  'rfi': rss([
    ['Sommet Trump-Poutine-Xi en Chine : une réunion historique annoncée', 'Selon l’AFP, la Maison Blanche a confirmé la tenue de la rencontre la semaine prochaine.', '2026-11-14T19:00:00Z', 'https://www.rfi.fr/fr/test-sommet'],
  ]),
  'franceinfo-pol': rss([
    ['Présidentielle : Teddy Riner candidat, la classe politique réagit', 'La candidature du champion olympique de judo suscite des réactions dans tous les partis.', '2026-11-15T09:00:00Z', 'https://www.francetvinfo.fr/politique/test-riner'],
  ]),
  'onu-info': rss([
    ['Gaza : l’ONU appelle à la protection des civils après de nouvelles frappes', 'Le Secrétaire général rappelle les obligations du droit international humanitaire.', '2026-11-15T12:00:00Z', 'https://news.un.org/fr/test-gaza'],
  ]),
  'theconversation-fr': atom([
    ['Pourquoi le détroit d’Ormuz reste le talon d’Achille de l’économie mondiale', 'Analyse des enjeux énergétiques et militaires du détroit.', '2026-11-15T05:00:00Z', 'https://theconversation.com/test-ormuz'],
  ]),
  'dw-en': rdf([
    ['Germany boosts defense spending in new budget plan', 'Berlin plans a significant increase in military spending, the defense ministry said.', '2026-11-15T11:00:00Z', 'https://www.dw.com/en/test-germany-defense'],
  ]),
};
for (const [id, xml] of Object.entries(F)) writeFileSync(join(dir, `${id}.xml`), xml);
console.log('Flux de test écrits :', Object.keys(F).length);
