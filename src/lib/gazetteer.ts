import type { RegionId } from './types';
import { normalize } from './text';

export interface Country {
  iso3: string;
  num: string; // code ISO 3166-1 numérique (identifiant de la carte world-atlas)
  name: string; // nom français
  region: RegionId;
  aliases: string[]; // formes normalisées (FR + EN, gentilés, capitales)
}

// ISO3 | numérique | nom FR | région | alias (normalisés, sans accents)
const RAW = `
FRA|250|France|france|france,francais,francaise,francaises,paris,elysee,matignon,macron,french,assemblee nationale,senat francais,rassemblement national,france insoumise,le pen,bardella,melenchon
DEU|276|Allemagne|europe|allemagne,allemand,allemande,allemands,berlin,germany,german,germans,bundestag
GBR|826|Royaume-Uni|europe|royaume uni,britannique,britanniques,londres,downing street,united kingdom,britain,british,london,uk
ITA|380|Italie|europe|italie,italien,italienne,italiens,rome,italy,italian
ESP|724|Espagne|europe|espagne,espagnol,espagnole,espagnols,madrid,spain,spanish
PRT|620|Portugal|europe|portugal,portugais,portugaise,lisbonne,portuguese,lisbon
BEL|56|Belgique|europe|belgique,belge,belges,belgium,belgian
NLD|528|Pays-Bas|europe|pays bas,neerlandais,neerlandaise,netherlands,dutch,amsterdam,la haye,the hague
CHE|756|Suisse|europe|suisse,suisses,berne,geneve,switzerland,swiss,geneva
AUT|40|Autriche|europe|autriche,autrichien,autrichienne,vienne,austria,austrian,vienna
POL|616|Pologne|europe|pologne,polonais,polonaise,varsovie,poland,polish,warsaw
CZE|203|Tchéquie|europe|tchequie,republique tcheque,tcheque,prague,czech,czechia
SVK|703|Slovaquie|europe|slovaquie,slovaque,slovakia,slovak,bratislava
HUN|348|Hongrie|europe|hongrie,hongrois,hongroise,budapest,hungary,hungarian,orban
ROU|642|Roumanie|europe|roumanie,roumain,roumaine,bucarest,romania,romanian,bucharest
BGR|100|Bulgarie|europe|bulgarie,bulgare,sofia,bulgaria,bulgarian
GRC|300|Grèce|europe|grece,grec,grecque,athenes,greece,greek,athens
CYP|196|Chypre|europe|chypre,chypriote,nicosie,cyprus,cypriot
SWE|752|Suède|europe|suede,suedois,suedoise,stockholm,sweden,swedish
FIN|246|Finlande|europe|finlande,finlandais,finlandaise,helsinki,finland,finnish
NOR|578|Norvège|europe|norvege,norvegien,norvegienne,oslo,norway,norwegian
DNK|208|Danemark|europe|danemark,danois,danoise,copenhague,denmark,danish,copenhagen
ISL|352|Islande|europe|islande,islandais,reykjavik,iceland,icelandic
IRL|372|Irlande|europe|irlande,irlandais,irlandaise,dublin,ireland,irish
EST|233|Estonie|europe|estonie,estonien,estonienne,tallinn,estonia,estonian
LVA|428|Lettonie|europe|lettonie,letton,lettone,riga,latvia,latvian
LTU|440|Lituanie|europe|lituanie,lituanien,lituanienne,vilnius,lithuania,lithuanian
UKR|804|Ukraine|europe|ukraine,ukrainien,ukrainienne,ukrainiens,ukrainiennes,kiev,kyiv,kharkiv,odessa,zaporijjia,zaporizhzhia,donbass,donbas,zelensky,zelenskyy,ukrainian,ukrainians
RUS|643|Russie|europe|russie,russe,russes,moscou,kremlin,poutine,russia,russian,russians,moscow,putin
BLR|112|Biélorussie|europe|bielorussie,belarus,bielorusse,minsk,loukachenko,lukashenko,belarusian
MDA|498|Moldavie|europe|moldavie,moldave,chisinau,moldova,moldovan,transnistrie,transnistria
SRB|688|Serbie|europe|serbie,serbe,serbes,belgrade,serbia,serbian
HRV|191|Croatie|europe|croatie,croate,zagreb,croatia,croatian
BIH|70|Bosnie-Herzégovine|europe|bosnie,bosnien,sarajevo,bosnia
XKX|-99|Kosovo|europe|kosovo,kosovar,pristina
ALB|8|Albanie|europe|albanie,albanais,tirana,albania,albanian
MKD|807|Macédoine du Nord|europe|macedoine du nord,north macedonia,skopje
SVN|705|Slovénie|europe|slovenie,slovene,ljubljana,slovenia,slovenian
GEO|268|Géorgie|europe|georgie,georgien,georgienne,tbilissi,tbilisi,georgian
ARM|51|Arménie|europe|armenie,armenien,armenienne,erevan,yerevan,armenia,armenian
AZE|31|Azerbaïdjan|europe|azerbaidjan,azerbaidjanais,bakou,azerbaijan,azerbaijani,baku
TUR|792|Turquie|moyen-orient|turquie,turc,turque,turcs,ankara,istanbul,erdogan,turkey,turkiye,turkish
ISR|376|Israël|moyen-orient|israel,israelien,israelienne,israeliens,tel aviv,jerusalem,netanyahou,netanyahu,tsahal,knesset,israeli,israelis,idf
PSE|275|Palestine|moyen-orient|palestine,palestinien,palestinienne,palestiniens,gaza,cisjordanie,ramallah,hamas,palestinian,palestinians,west bank
LBN|422|Liban|moyen-orient|liban,libanais,libanaise,beyrouth,hezbollah,lebanon,lebanese,beirut
SYR|760|Syrie|moyen-orient|syrie,syrien,syrienne,syriens,damas,syria,syrian,damascus
JOR|400|Jordanie|moyen-orient|jordanie,jordanien,amman,jordan,jordanian
IRQ|368|Irak|moyen-orient|irak,iraq,irakien,irakienne,bagdad,baghdad,iraqi,kurdistan irakien
IRN|364|Iran|moyen-orient|iran,iranien,iranienne,iraniens,teheran,tehran,iranian,iranians,khamenei
SAU|682|Arabie saoudite|moyen-orient|arabie saoudite,saoudien,saoudienne,riyad,riyadh,saudi,saudi arabia
ARE|784|Émirats arabes unis|moyen-orient|emirats arabes unis,emirats,emirati,abou dhabi,abu dhabi,dubai,dubai,uae,united arab emirates
QAT|634|Qatar|moyen-orient|qatar,qatari,qatarien,doha
KWT|414|Koweït|moyen-orient|koweit,kuwait,koweitien,kuwaiti
BHR|48|Bahreïn|moyen-orient|bahrein,bahrain,manama
OMN|512|Oman|moyen-orient|oman,omanais,mascate,muscat,omani
YEM|887|Yémen|moyen-orient|yemen,yemenite,houthis,houthi,sanaa,aden
EGY|818|Égypte|moyen-orient|egypte,egyptien,egyptienne,le caire,egypt,egyptian,cairo,sissi,sisi
USA|840|États-Unis|ameriques|etats unis,americain,americaine,americains,washington,maison blanche,pentagone,trump,united states,u s,usa,american,americans,white house,pentagon,congress,senate,us
CAN|124|Canada|ameriques|canada,canadien,canadienne,ottawa,canadian
MEX|484|Mexique|ameriques|mexique,mexicain,mexicaine,mexico,mexican
CUB|192|Cuba|ameriques|cuba,cubain,cubaine,la havane,havana,cuban
VEN|862|Venezuela|ameriques|venezuela,venezuelien,venezuelienne,caracas,venezuelan,maduro
COL|170|Colombie|ameriques|colombie,colombien,colombienne,bogota,colombia,colombian
BRA|76|Brésil|ameriques|bresil,bresilien,bresilienne,brasilia,brazil,brazilian,lula
ARG|32|Argentine|ameriques|argentine,argentin,argentins,buenos aires,argentina,argentinian
CHL|152|Chili|ameriques|chili,chilien,chilienne,santiago du chili,chile,chilean
PER|604|Pérou|ameriques|perou,peruvien,peruvienne,lima,peru,peruvian
BOL|68|Bolivie|ameriques|bolivie,bolivien,la paz,bolivia,bolivian
ECU|218|Équateur|ameriques|equateur,equatorien,quito,ecuador,ecuadorian
HTI|332|Haïti|ameriques|haiti,haitien,haitienne,port au prince,haitian
NIC|558|Nicaragua|ameriques|nicaragua,nicaraguayen,managua
PAN|591|Panama|ameriques|panama,panameen,canal de panama
GTM|320|Guatemala|ameriques|guatemala,guatemalteque,guatemalan
CHN|156|Chine|asie|chine,chinois,chinoise,chinoises,pekin,beijing,china,chinese,xi jinping,shanghai,hong kong,xinjiang,tibet
TWN|158|Taïwan|asie|taiwan,taiwanais,taiwanaise,taipei,taiwanese
JPN|392|Japon|asie|japon,japonais,japonaise,tokyo,japan,japanese
KOR|410|Corée du Sud|asie|coree du sud,sud coreen,sud coreenne,seoul,south korea,south korean
PRK|408|Corée du Nord|asie|coree du nord,nord coreen,nord coreenne,pyongyang,north korea,north korean,kim jong un
IND|356|Inde|asie|inde,indien,indienne,indiens,new delhi,delhi,india,indian,modi,mumbai,cachemire indien
PAK|586|Pakistan|asie|pakistan,pakistanais,pakistanaise,islamabad,pakistani,karachi,lahore
AFG|4|Afghanistan|asie|afghanistan,afghan,afghane,kaboul,kabul,taliban,talibans
BGD|50|Bangladesh|asie|bangladesh,bangladais,dacca,dhaka,bangladeshi
LKA|144|Sri Lanka|asie|sri lanka,sri lankais,colombo,sri lankan
NPL|524|Népal|asie|nepal,nepalais,katmandou,kathmandu
MMR|104|Birmanie|asie|birmanie,birman,myanmar,rangoun,yangon,naypyidaw
THA|764|Thaïlande|asie|thailande,thailandais,bangkok,thailand,thai
VNM|704|Vietnam|asie|vietnam,viet nam,vietnamien,vietnamienne,hanoi,vietnamese
KHM|116|Cambodge|asie|cambodge,cambodgien,phnom penh,cambodia,cambodian
LAO|418|Laos|asie|laos,laotien,vientiane
MYS|458|Malaisie|asie|malaisie,malaisien,kuala lumpur,malaysia,malaysian
SGP|702|Singapour|asie|singapour,singapourien,singapore
IDN|360|Indonésie|asie|indonesie,indonesien,indonesienne,jakarta,indonesia,indonesian
PHL|608|Philippines|asie|philippines,philippin,philippine,manille,manila,filipino
MNG|496|Mongolie|asie|mongolie,mongol,oulan bator,mongolia
KAZ|398|Kazakhstan|asie|kazakhstan,kazakh,astana
UZB|860|Ouzbékistan|asie|ouzbekistan,ouzbek,tachkent,uzbekistan
KGZ|417|Kirghizistan|asie|kirghizistan,kirghize,bichkek,kyrgyzstan
TJK|762|Tadjikistan|asie|tadjikistan,tadjik,douchanbe,tajikistan
TKM|795|Turkménistan|asie|turkmenistan,turkmene,achgabat
AUS|36|Australie|oceanie|australie,australien,australienne,canberra,sydney,australia,australian
NZL|554|Nouvelle-Zélande|oceanie|nouvelle zelande,neo zelandais,wellington,new zealand
NCL|540|Nouvelle-Calédonie|france|nouvelle caledonie,caledonien,noumea,kanak,new caledonia
MAR|504|Maroc|afrique|maroc,marocain,marocaine,rabat,morocco,moroccan,sahara occidental
DZA|12|Algérie|afrique|algerie,algerien,algerienne,algeriens,alger,algeria,algerian,algiers
TUN|788|Tunisie|afrique|tunisie,tunisien,tunisienne,tunis,tunisia,tunisian
LBY|434|Libye|afrique|libye,libyen,libyenne,tripoli,benghazi,libya,libyan
SDN|729|Soudan|afrique|soudan,soudanais,soudanaise,khartoum,darfour,darfur,sudan,sudanese,el fasher
SSD|728|Soudan du Sud|afrique|soudan du sud,sud soudanais,juba,south sudan
ETH|231|Éthiopie|afrique|ethiopie,ethiopien,ethiopienne,addis abeba,ethiopia,ethiopian,tigre,tigray
ERI|232|Érythrée|afrique|erythree,erythreen,asmara,eritrea,eritrean
SOM|706|Somalie|afrique|somalie,somalien,mogadiscio,somalia,somali,chebab,al shabaab
DJI|262|Djibouti|afrique|djibouti,djiboutien
KEN|404|Kenya|afrique|kenya,kenyan,kenyane,nairobi
UGA|800|Ouganda|afrique|ouganda,ougandais,kampala,uganda,ugandan
RWA|646|Rwanda|afrique|rwanda,rwandais,kigali,rwandan
BDI|108|Burundi|afrique|burundi,burundais,gitega,bujumbura
COD|180|RD Congo|afrique|rdc,rd congo,republique democratique du congo,congolais,kinshasa,goma,kivu,drc,democratic republic of congo,m23
COG|178|Congo|afrique|congo brazzaville,brazzaville,republic of congo
CAF|140|Centrafrique|afrique|centrafrique,centrafricain,centrafricaine,bangui,central african republic
CMR|120|Cameroun|afrique|cameroun,camerounais,yaounde,douala,cameroon
TCD|148|Tchad|afrique|tchad,tchadien,tchadienne,ndjamena,chad,chadian
NER|562|Niger|afrique|niger,nigerien,nigerienne,niamey
NGA|566|Nigeria|afrique|nigeria,nigerian,nigeriane,abuja,lagos
MLI|466|Mali|afrique|mali,malien,malienne,maliens,bamako
BFA|854|Burkina Faso|afrique|burkina faso,burkina,burkinabe,ouagadougou
SEN|686|Sénégal|afrique|senegal,senegalais,senegalaise,dakar,senegalese
CIV|384|Côte d'Ivoire|afrique|cote d ivoire,ivoirien,ivoirienne,abidjan,ivory coast,ivorian
GHA|288|Ghana|afrique|ghana,ghaneen,accra,ghanaian
GIN|324|Guinée|afrique|guinee,guineen,guineenne,conakry,guinea
MRT|478|Mauritanie|afrique|mauritanie,mauritanien,nouakchott,mauritania
BEN|204|Bénin|afrique|benin,beninois,cotonou,porto novo
TGO|768|Togo|afrique|togo,togolais,lome
GAB|266|Gabon|afrique|gabon,gabonais,libreville
AGO|24|Angola|afrique|angola,angolais,luanda
MOZ|508|Mozambique|afrique|mozambique,mozambicain,maputo,cabo delgado
ZAF|710|Afrique du Sud|afrique|afrique du sud,sud africain,sud africaine,pretoria,johannesburg,le cap,south africa,south african,cape town
ZWE|716|Zimbabwe|afrique|zimbabwe,zimbabween,harare
MDG|450|Madagascar|afrique|madagascar,malgache,antananarivo
TZA|834|Tanzanie|afrique|tanzanie,tanzanien,dodoma,dar es salaam,tanzania
`;

export const COUNTRIES: Country[] = RAW.trim()
  .split('\n')
  .map((line) => {
    const [iso3, num, name, region, aliases] = line.split('|');
    return {
      iso3,
      num: num.padStart(3, '0'),
      name,
      region: region as RegionId,
      aliases: aliases.split(',').map((a) => normalize(a).trim()),
    };
  });

export const COUNTRY_BY_ISO3: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso3, c]),
);
export const COUNTRY_BY_NUM: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.num, c]),
);

export const REGION_LABELS: Record<RegionId, string> = {
  france: 'France',
  europe: 'Europe',
  'moyen-orient': 'Moyen-Orient',
  ameriques: 'Amériques',
  asie: 'Asie',
  afrique: 'Afrique',
  oceanie: 'Océanie',
  monde: 'Monde',
};

/** Ordre de priorité géographique demandé pour le briefing. */
export const REGION_PRIORITY: Record<RegionId, number> = {
  france: 7,
  europe: 6,
  'moyen-orient': 5,
  ameriques: 4,
  asie: 3,
  afrique: 2.5,
  oceanie: 1.5,
  monde: 1.5,
};

export interface Org {
  id: string;
  name: string;
  aliases: string[];
}

const ORG_RAW = `
onu|ONU|onu,nations unies,united nations,conseil de securite,security council,guterres,un security council
otan|OTAN|otan,nato,alliance atlantique,rutte
ue|Union européenne|union europeenne,commission europeenne,conseil europeen,parlement europeen,bruxelles,european union,european commission,eu,ue,von der leyen,kallas
g7|G7|g7
g20|G20|g20
brics|BRICS|brics
fmi|FMI|fmi,fonds monetaire international,imf,international monetary fund
bm|Banque mondiale|banque mondiale,world bank
omc|OMC|omc,organisation mondiale du commerce,wto,world trade organization
opep|OPEP|opep,opec
aiea|AIEA|aiea,iaea,agence internationale de l energie atomique,atomic energy agency,grossi
cpi|Cour pénale internationale|cour penale internationale,cpi,icc,international criminal court
cij|Cour internationale de justice|cour internationale de justice,cij,icj,international court of justice
bce|BCE|bce,banque centrale europeenne,ecb,european central bank,lagarde
fed|Réserve fédérale|reserve federale,federal reserve,fed
ua|Union africaine|union africaine,african union
cedeao|CEDEAO|cedeao,ecowas
ase|Alliance des États du Sahel|alliance des etats du sahel,aes
asean|ASEAN|asean
oms|OMS|oms,organisation mondiale de la sante,who,world health organization
hamas|Hamas|hamas
hezbollah|Hezbollah|hezbollah,hizbollah
houthis|Houthis|houthis,houthi,ansar allah
ei|État islamique|etat islamique,daech,isis,islamic state
wagner|Wagner / Africa Corps|wagner,africa corps
ocs|OCS|organisation de coopération de shanghai,shanghai cooperation organisation,sco
`;

export const ORGS: Org[] = ORG_RAW.trim()
  .split('\n')
  .map((line) => {
    const [id, name, aliases] = line.split('|');
    return { id, name, aliases: aliases.split(',').map((a) => normalize(a).trim()) };
  });
export const ORG_BY_ID: Record<string, Org> = Object.fromEntries(ORGS.map((o) => [o.id, o]));

// Alias trop ambigus en anglais pour être recherchés hors d'un contexte en majuscules.
const CASE_SENSITIVE_ALIASES = new Set(['us', 'eu', 'who', 'un', 'fed', 'aes', 'sco', 'icc', 'drc']);

interface Matcher {
  alias: string;
  id: string;
  kind: 'country' | 'org';
}

const MATCHERS: Matcher[] = [
  ...COUNTRIES.flatMap((c) => c.aliases.map((a) => ({ alias: a, id: c.iso3, kind: 'country' as const }))),
  ...ORGS.flatMap((o) => o.aliases.map((a) => ({ alias: a, id: o.id, kind: 'org' as const }))),
].sort((a, b) => b.alias.length - a.alias.length);

/**
 * Détecte pays et organisations mentionnés dans un texte.
 * Les alias les plus longs sont testés d'abord, et la portion trouvée est masquée
 * (évite que « Guinée équatoriale » soit aussi compté comme « Guinée »).
 */
export function detectEntities(raw: string): { countries: string[]; orgs: string[] } {
  let text = normalize(raw);
  // Acronymes ambigus : seulement s'ils apparaissent en majuscules dans le texte original.
  const upperTokens = new Set((raw.match(/\b[A-Z][A-Z.]{1,5}\b/g) ?? []).map((t) => t.replace(/\./g, '').toLowerCase()));
  const countries = new Set<string>();
  const orgs = new Set<string>();
  for (const m of MATCHERS) {
    if (CASE_SENSITIVE_ALIASES.has(m.alias) && !upperTokens.has(m.alias)) continue;
    const needle = ` ${m.alias} `;
    if (text.includes(needle)) {
      (m.kind === 'country' ? countries : orgs).add(m.id);
      text = text.split(needle).join(' '.repeat(needle.length));
    }
  }
  return { countries: [...countries], orgs: [...orgs] };
}

// Dirigeants et personnalités : une mention de personne indique un acteur, pas forcément un lieu.
const PERSON_ALIASES = new Set(
  'macron,le pen,bardella,melenchon,trump,poutine,putin,zelensky,zelenskyy,netanyahou,netanyahu,erdogan,orban,khamenei,xi jinping,modi,maduro,lula,sissi,sisi,kim jong un,loukachenko,lukashenko'.split(','),
);
const DEMONYM = /(ais|aise|aises|ien|ienne|iens|iennes|ain|aine|ains|aines|ese|ish|ian|ians|ois|oise|oises|ique|iques|een|eens|eenne|ais|i|is|ese|an|ans|ane|anes|e|es)$/;
const NAME_EXCEPTIONS = new Set('bahrain,britain,spain,iran,oman,japan,taiwan,sudan,jordan,afghanistan,pakistan,kazakhstan,ouzbekistan,kirghizistan,tadjikistan,turkmenistan,yemen,chine,china,inde,france,russie,ukraine,syrie,libye,tunisie,algerie,turquie,grece,suisse,belgique,norvege,suede,finlande,estonie,lettonie,lituanie,pologne,hongrie,roumanie,bulgarie,serbie,croatie,slovaquie,slovenie,albanie,georgie,armenie,moldavie,bielorussie,irlande,islande,italie,espagne,allemagne,autriche,tchequie,mongolie,malaisie,indonesie,birmanie,thailande,coree du sud,coree du nord,egypte,jordanie,somalie,ethiopie,erythree,ouganda,tanzanie,zambie,mauritanie,guinee,libye,arabie saoudite,australie,bolivie,colombie,argentine,cisjordanie,gaza,mali,haiti,cuba,chili,perou,nicaragua,panama,guatemala,venezuela,bresil,mexique,canada,kenya,rwanda,burundi,tchad,niger,nigeria,ghana,senegal,benin,togo,gabon,angola,mozambique,zimbabwe,madagascar,liban,qatar,koweit,bahrein,irak,iraq,israel,palestine,dubai,gulf,kiev,kyiv,moscou,moscow,paris,londres,berlin,rome,madrid,pekin,beijing,tokyo,seoul,washington,teheran,tehran,ankara,istanbul,damas,beyrouth,beirut,riyad,doha,kaboul,kabul,bamako,niamey,dakar,abidjan,kinshasa,goma,nairobi,alger,tunis,rabat,tripoli,khartoum,bangui,juba,cambodge,cambodia,laos,vietnam,nepal,sri lanka,bangladesh,philippines,singapour,singapore'.split(','));

function aliasWeight(alias: string): number {
  if (PERSON_ALIASES.has(alias)) return 0.5;
  if (!alias.includes(' ') && DEMONYM.test(alias) && !NAME_EXCEPTIONS.has(alias) && !COUNTRIES.some((c) => normalize(c.name).trim() === alias)) return 0.5;
  return 1;
}

/** Poids de chaque pays mentionné : 1 pour un nom de pays, de ville ou de région, 0,5 pour un adjectif ou une personnalité. */
export function countryWeights(raw: string): Map<string, number> {
  let text = normalize(raw);
  const out = new Map<string, number>();
  for (const m of MATCHERS) {
    if (m.kind !== 'country' || CASE_SENSITIVE_ALIASES.has(m.alias)) continue;
    const needle = ` ${m.alias} `;
    if (text.includes(needle)) {
      out.set(m.id, Math.max(out.get(m.id) ?? 0, aliasWeight(m.alias)));
      text = text.split(needle).join(' '.repeat(needle.length));
    }
  }
  return out;
}
