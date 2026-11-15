import { site, wp, type Dossier } from './types';

/**
 * Dossiers géopolitiques permanents.
 * Rédigés à partir de connaissances générales arrêtées mi-2026 : ils décrivent les structures
 * (histoire, acteurs, intérêts, rapports de force). L'état présent d'une situation se lit dans
 * les actualités liées, mises à jour automatiquement. Les scénarios sont des analyses, pas des faits.
 */
const AS_OF = 'Connaissances arrêtées mi-2026 — la situation a pu évoluer depuis.';

export const DOSSIERS: Dossier[] = [
  {
    id: 'russie-ukraine',
    title: 'La guerre en Ukraine',
    category: 'conflit',
    asOf: AS_OF,
    summary:
      "Depuis l'invasion à grande échelle lancée par la Russie le 24 février 2022, la guerre en Ukraine est le conflit interétatique le plus important en Europe depuis 1945. Elle oppose une Ukraine soutenue militairement et financièrement par les pays occidentaux à une Russie qui revendique l'annexion de plusieurs régions ukrainiennes.",
    whyItMatters:
      "Ce conflit engage directement la sécurité européenne, l'avenir de l'OTAN et de l'Union européenne, les marchés de l'énergie et des céréales, et le principe d'intangibilité des frontières.",
    countries: ['UKR', 'RUS', 'BLR', 'USA'],
    orgs: ['otan', 'ue'],
    keywords: ['ukraine', 'kiev', 'kyiv', 'donbass', 'donbas', 'crimee', 'crimea', 'zelensky', 'poutine', 'putin', 'kremlin', 'zaporijjia', 'kharkiv'],
    sections: {
      situation:
        "La guerre s'est transformée en conflit d'usure : front long de plus de mille kilomètres, usage massif de drones, frappes à longue distance contre les infrastructures énergétiques et industrielles. Les discussions sur un cessez-le-feu ou un règlement négocié dépendent fortement de la position des États-Unis et des garanties de sécurité offertes à l'Ukraine. Consultez les actualités liées pour l'état actuel du front et des négociations.",
      histoire:
        "L'Ukraine et la Russie partagent une histoire longue et imbriquée (Rus' de Kiev, Empire russe, URSS). L'Ukraine devient indépendante en 1991. En 1994, le mémorandum de Budapest prévoit le transfert à la Russie de l'arsenal nucléaire soviétique stationné en Ukraine en échange d'assurances de sécurité. Après la révolution de Maïdan (2013-2014), la Russie annexe la Crimée et soutient des séparatistes armés dans le Donbass ; les accords de Minsk (2014-2015) ne règlent pas le conflit. L'invasion de 2022 en est l'escalade.",
      acteurs:
        "Ukraine (gouvernement de Kiev, forces armées) ; Russie (Kremlin, forces armées, sociétés militaires privées) ; Biélorussie (territoire utilisé en 2022) ; États-Unis et pays européens (aide militaire, sanctions) ; OTAN et UE en tant qu'organisations ; Iran et Corée du Nord, accusés par les Occidentaux de fournir drones, munitions ou soldats à la Russie ; Chine, partenaire économique majeur de Moscou ; Turquie, médiatrice ponctuelle (accord céréalier de 2022).",
      interets:
        "Russie : empêcher l'ancrage occidental de l'Ukraine, contrôler des territoires (corridor terrestre vers la Crimée), restaurer une sphère d'influence. Ukraine : préserver sa souveraineté et son intégrité territoriale, obtenir des garanties de sécurité et l'intégration européenne. Occidentaux : éviter un précédent de conquête par la force, contenir la Russie, sans entrer en guerre directe avec une puissance nucléaire.",
      alliances:
        "L'Ukraine est soutenue par une coalition de pays occidentaux (groupe de contact pour la défense de l'Ukraine) et a obtenu le statut de candidate à l'UE en 2022. La Finlande (2023) et la Suède (2024) ont rejoint l'OTAN en réaction à la guerre. La Russie s'appuie sur la Biélorussie et sur des partenariats avec l'Iran, la Corée du Nord et, économiquement, la Chine et l'Inde.",
      rapports:
        "La Russie dispose d'une supériorité démographique, industrielle (munitions) et nucléaire ; l'Ukraine compense par l'innovation (drones, frappes maritimes en mer Noire) et l'aide occidentale, dont elle reste dépendante. L'économie russe est soumise à de lourdes sanctions mais s'est réorientée vers l'Asie.",
      scenarios: [
        "Gel du conflit le long de la ligne de front, avec cessez-le-feu fragile et sans règlement politique (analyse).",
        "Accord négocié incluant des concessions territoriales de fait et des garanties de sécurité occidentales (analyse).",
        "Poursuite d'une guerre d'usure prolongée, dépendante du niveau de soutien américain et européen (analyse).",
      ],
      europeFrance:
        "La guerre a provoqué un réarmement européen, une hausse des budgets de défense, la fin de la dépendance au gaz russe et un débat sur l'autonomie stratégique. La France participe à l'aide militaire (canons Caesar, missiles SCALP notamment), à la présence avancée de l'OTAN en Roumanie et aux réflexions sur des garanties de sécurité pour l'Ukraine.",
    },
    timeline: [
      { year: 1991, label: "Indépendance de l'Ukraine" },
      { year: 1994, label: 'Mémorandum de Budapest' },
      { year: 2014, label: 'Maïdan, annexion de la Crimée, guerre du Donbass' },
      { year: 2015, label: 'Accords de Minsk II' },
      { year: 2022, label: 'Invasion russe à grande échelle (24 février)' },
      { year: 2023, label: "Adhésion de la Finlande à l'OTAN" },
      { year: 2024, label: "Adhésion de la Suède à l'OTAN" },
    ],
    sources: [wp('Invasion de l\'Ukraine par la Russie'), wp('Mémorandum de Budapest'), wp('Accords de Minsk'), site('OTAN — relations avec l’Ukraine', 'https://www.nato.int'), site('IFRI', 'https://www.ifri.org')],
    quiz: [
      {
        question: "En quelle année la Russie a-t-elle annexé la Crimée ?",
        options: ['2008', '2014', '2018', '2022'],
        answer: 1,
        explanation: "L'annexion a eu lieu en mars 2014, après la révolution de Maïdan, à l'issue d'un référendum non reconnu par la communauté internationale.",
        extra: "L'Assemblée générale de l'ONU a adopté en mars 2014 une résolution affirmant l'intégrité territoriale de l'Ukraine.",
      },
      {
        question: 'Que prévoyait le mémorandum de Budapest (1994) ?',
        options: [
          "L'adhésion de l'Ukraine à l'OTAN",
          "Le transfert de l'arsenal nucléaire stationné en Ukraine contre des assurances de sécurité",
          'Le partage de la flotte de la mer Noire',
          'La création de la CEI',
        ],
        answer: 1,
        explanation: "L'Ukraine a renoncé aux armes nucléaires soviétiques présentes sur son sol en échange d'assurances de sécurité de la Russie, des États-Unis et du Royaume-Uni.",
        extra: 'Ce texte est souvent invoqué dans les débats sur la non-prolifération : il illustre la valeur limitée de simples « assurances ».',
      },
    ],
  },
  {
    id: 'israel-palestine',
    title: 'Le conflit israélo-palestinien',
    category: 'conflit',
    asOf: AS_OF,
    summary:
      "Conflit centenaire portant sur la terre, la souveraineté, la sécurité, les réfugiés et Jérusalem, entre Israël et les Palestiniens. L'attaque du Hamas du 7 octobre 2023 et la guerre à Gaza qui a suivi en ont ouvert la phase la plus meurtrière.",
    whyItMatters:
      "Ce conflit structure une grande partie des équilibres du Moyen-Orient (Iran, Liban, Yémen, monarchies du Golfe), mobilise le droit international (CIJ, CPI) et a des répercussions politiques fortes en Europe.",
    countries: ['ISR', 'PSE', 'LBN', 'EGY', 'JOR', 'IRN', 'USA'],
    orgs: ['hamas', 'hezbollah', 'onu', 'cij', 'cpi'],
    keywords: ['gaza', 'cisjordanie', 'west bank', 'hamas', 'israel', 'palestinien', 'palestinian', 'netanyahou', 'netanyahu', 'colonies', 'settlers', 'jerusalem', 'rafah'],
    sections: {
      situation:
        "Après la guerre déclenchée en octobre 2023, la bande de Gaza est dévastée et la question de sa gouvernance, de sa reconstruction et de sa sécurité reste ouverte. La colonisation et les violences en Cisjordanie se poursuivent. Plusieurs États occidentaux, dont la France en 2025, ont reconnu l'État de Palestine. Consultez les actualités liées pour la situation présente (trêves, négociations, situation humanitaire).",
      histoire:
        "À la fin du XIXe siècle naît le sionisme politique. Après la Première Guerre mondiale, la Palestine passe sous mandat britannique (la déclaration Balfour de 1917 soutient un « foyer national juif »). En 1947, l'ONU vote un plan de partage ; Israël proclame son indépendance en 1948, suivie d'une guerre avec les États arabes et de l'exode de centaines de milliers de Palestiniens (la Nakba). En 1967, Israël occupe la Cisjordanie, Gaza, Jérusalem-Est, le Golan et le Sinaï. Les accords d'Oslo (1993) créent l'Autorité palestinienne, mais le processus de paix échoue. Le Hamas prend le contrôle de Gaza en 2007.",
      acteurs:
        "Israël (gouvernement, armée — Tsahal) ; Autorité palestinienne (Cisjordanie, dominée par le Fatah) ; Hamas (Gaza) et Jihad islamique ; Hezbollah libanais, Houthis du Yémen et milices irakiennes, soutenus par l'Iran ; États-Unis, principal allié d'Israël ; Égypte, Qatar et Jordanie, médiateurs ; ONU et ses agences (dont l'UNRWA).",
      interets:
        "Israël : sécurité de sa population, neutralisation des groupes armés, contrôle sécuritaire des territoires ; une partie de la coalition au pouvoir soutient l'expansion des colonies. Palestiniens : fin de l'occupation, État souverain, droits des réfugiés, Jérusalem-Est comme capitale. Iran : affaiblir Israël et les États-Unis via « l'axe de la résistance ». Monarchies du Golfe : stabilité régionale, normalisation conditionnelle (accords d'Abraham de 2020).",
      alliances:
        "Israël s'appuie sur les États-Unis (aide militaire de long terme) et a normalisé ses relations avec l'Égypte (1979), la Jordanie (1994), puis les Émirats, Bahreïn, le Maroc et le Soudan (2020). Le Hamas bénéficie du soutien iranien et de relais politiques au Qatar et en Turquie.",
      rapports:
        "Israël dispose d'une supériorité militaire écrasante, d'un arsenal nucléaire non déclaré et d'un appui américain. Les Palestiniens sont divisés politiquement (Fatah / Hamas) et territorialement. Le rapport de force diplomatique évolue : procédures devant la CIJ et la CPI, reconnaissances de l'État de Palestine.",
      scenarios: [
        "Statu quo armé : gestion du conflit sans solution politique, avec cycles de violence (analyse).",
        "Relance d'un processus diplomatique régional liant normalisation israélo-saoudienne et horizon d'État palestinien (analyse).",
        "Extension régionale du conflit impliquant l'Iran et ses alliés (analyse).",
      ],
      europeFrance:
        "L'UE est le premier bailleur d'aide aux Palestiniens et un partenaire commercial majeur d'Israël. La France défend la solution à deux États et a reconnu l'État de Palestine en septembre 2025. Le conflit a aussi des effets sur la sécurité intérieure et le débat public en Europe.",
    },
    timeline: [
      { year: 1917, label: 'Déclaration Balfour' },
      { year: 1947, label: "Plan de partage de l'ONU" },
      { year: 1948, label: "Indépendance d'Israël, première guerre israélo-arabe, Nakba" },
      { year: 1967, label: 'Guerre des Six Jours' },
      { year: 1993, label: "Accords d'Oslo" },
      { year: 2007, label: 'Le Hamas prend le contrôle de Gaza' },
      { year: 2020, label: "Accords d'Abraham" },
      { year: 2023, label: 'Attaque du 7 octobre et guerre à Gaza' },
    ],
    sources: [wp('Conflit israélo-palestinien'), wp('Accords d\'Oslo'), wp('Plan de partage de la Palestine'), site('ONU — la question de Palestine', 'https://www.un.org/unispal/fr/'), site('Cour internationale de justice', 'https://www.icj-cij.org')],
    quiz: [
      {
        question: "Quels accords ont créé l'Autorité palestinienne ?",
        options: ['Accords de Camp David (1978)', "Accords d'Oslo (1993)", "Accords d'Abraham (2020)", 'Accords de Taëf (1989)'],
        answer: 1,
        explanation: "Les accords d'Oslo, signés en 1993 entre Israël et l'OLP, ont établi une reconnaissance mutuelle et créé l'Autorité palestinienne.",
        extra: "Les accords de Taëf concernent la fin de la guerre civile libanaise ; ceux de Camp David, la paix israélo-égyptienne.",
      },
      {
        question: 'Quelle guerre a conduit Israël à occuper la Cisjordanie et Gaza ?',
        options: ['La guerre de 1948', 'La crise de Suez (1956)', 'La guerre des Six Jours (1967)', 'La guerre du Kippour (1973)'],
        answer: 2,
        explanation: "En juin 1967, Israël prend la Cisjordanie et Jérusalem-Est (à la Jordanie), Gaza et le Sinaï (à l'Égypte) et le Golan (à la Syrie).",
        extra: "La résolution 242 du Conseil de sécurité (1967) pose le principe « la paix contre les territoires ».",
      },
    ],
  },
  {
    id: 'iran-golfe-ormuz',
    title: "L'Iran, le Golfe et le détroit d'Ormuz",
    category: 'tension',
    asOf: AS_OF,
    summary:
      "La République islamique d'Iran est engagée dans une confrontation durable avec Israël, les États-Unis et, par intermittence, les monarchies du Golfe. Son programme nucléaire et sa capacité à menacer le détroit d'Ormuz, point de passage d'une part majeure du pétrole et du GNL mondiaux, en font un enjeu de sécurité globale.",
    whyItMatters:
      "Une perturbation du détroit d'Ormuz affecterait immédiatement les prix de l'énergie dans le monde, y compris en Europe. Le dossier nucléaire iranien touche au régime mondial de non-prolifération.",
    countries: ['IRN', 'SAU', 'ARE', 'QAT', 'BHR', 'OMN', 'ISR', 'USA', 'IRQ', 'YEM'],
    orgs: ['aiea', 'houthis', 'hezbollah', 'opep'],
    keywords: ['iran', 'ormuz', 'hormuz', 'golfe', 'gulf', 'nucleaire iranien', 'uranium', 'enrichissement', 'enrichment', 'gardiens de la revolution', 'irgc', 'houthis', 'mer rouge', 'red sea', 'bahrein', 'bahrain'],
    sections: {
      situation:
        "La tension entre l'Iran d'une part, Israël et les États-Unis d'autre part, a connu des épisodes d'affrontement direct (échanges de frappes en 2024, frappes israéliennes et américaines contre des sites nucléaires iraniens en juin 2025). Les inspections de l'AIEA et l'avenir du programme nucléaire restent au cœur des négociations. Consultez les actualités liées : la situation peut évoluer très vite.",
      histoire:
        "En 1953, un coup d'État soutenu par les services américains et britanniques renverse le Premier ministre Mossadegh, qui avait nationalisé le pétrole. La révolution islamique de 1979 instaure un régime théocratique hostile aux États-Unis ; la prise d'otages de l'ambassade américaine rompt les relations. La guerre Iran-Irak (1980-1988) fait des centaines de milliers de morts. En 2015, l'accord sur le nucléaire (JCPoA) limite l'enrichissement en échange d'une levée des sanctions ; les États-Unis s'en retirent en 2018.",
      acteurs:
        "Iran (Guide suprême, président, Gardiens de la révolution) ; Israël ; États-Unis (Ve Flotte basée à Bahreïn) ; Arabie saoudite et Émirats arabes unis ; Qatar (champ gazier partagé avec l'Iran) ; Oman (médiateur traditionnel) ; « axe de la résistance » : Hezbollah, Houthis, milices irakiennes ; AIEA ; Chine, premier acheteur de pétrole iranien.",
      interets:
        "Iran : survie du régime, dissuasion, influence régionale, levée des sanctions. Israël : empêcher un Iran doté de l'arme nucléaire. États-Unis : non-prolifération, liberté de navigation, sécurité des alliés. Pays du Golfe : sécurité de leurs exportations et de leurs infrastructures, stabilité.",
      alliances:
        "L'Iran entretient des partenariats avec la Russie (coopération militaire) et la Chine (accords économiques), sans alliance formelle de défense. Les monarchies du Golfe sont liées aux États-Unis par des accords de défense et des bases ; l'Arabie saoudite et l'Iran ont rétabli leurs relations diplomatiques en 2023 sous médiation chinoise.",
      rapports:
        "L'Iran compense une infériorité aérienne par des missiles balistiques, des drones et un réseau de groupes alliés. Sa capacité à menacer le trafic maritime (mines, vedettes rapides, missiles antinavires) lui donne un levier asymétrique. Son économie est affaiblie par les sanctions et l'inflation.",
      scenarios: [
        "Retour à un accord nucléaire encadrant l'enrichissement contre un allègement des sanctions (analyse).",
        "Escalade militaire ponctuelle avec perturbations temporaires du trafic dans le Golfe (analyse).",
        "Instabilité interne en Iran modifiant sa politique étrangère (analyse).",
      ],
      europeFrance:
        "La France, le Royaume-Uni et l'Allemagne (« E3 ») ont négocié le JCPoA et restent impliqués dans le dossier nucléaire. La France dispose d'une base militaire à Abou Dhabi et participe à des missions de sécurité maritime. L'Europe est exposée aux prix du pétrole et du GNL transitant par Ormuz.",
    },
    timeline: [
      { year: 1953, label: 'Renversement de Mossadegh' },
      { year: 1979, label: 'Révolution islamique' },
      { year: 1980, label: 'Début de la guerre Iran-Irak (jusqu’en 1988)' },
      { year: 2015, label: 'Accord sur le nucléaire (JCPoA)' },
      { year: 2018, label: 'Retrait américain du JCPoA' },
      { year: 2023, label: 'Rétablissement des relations Iran-Arabie saoudite' },
      { year: 2025, label: 'Frappes contre des sites nucléaires iraniens (juin)' },
    ],
    sources: [wp('Détroit d\'Ormuz'), wp('Accord de Vienne sur le nucléaire iranien'), wp('Révolution iranienne'), site('AIEA', 'https://www.iaea.org'), site('Agence internationale de l’énergie', 'https://www.iea.org')],
    quiz: [
      {
        question: "Quel pays se trouve sur la rive sud du détroit d'Ormuz, face à l'Iran ?",
        options: ['Le Yémen', 'Oman (péninsule de Musandam)', 'Le Koweït', 'Le Qatar'],
        answer: 1,
        explanation: "La péninsule de Musandam, exclave d'Oman, borde le détroit au sud ; les Émirats arabes unis sont également riverains de ses abords.",
        extra: "Oman joue traditionnellement un rôle de médiateur discret entre l'Iran et les Occidentaux.",
      },
      {
        question: 'En quelle année les États-Unis se sont-ils retirés de l’accord sur le nucléaire iranien (JCPoA) ?',
        options: ['2015', '2016', '2018', '2021'],
        answer: 2,
        explanation: "L'administration américaine s'est retirée de l'accord en mai 2018 et a rétabli des sanctions.",
        extra: "L'Iran a ensuite progressivement dépassé les limites d'enrichissement fixées par l'accord.",
      },
    ],
  },
  {
    id: 'chine-taiwan',
    title: 'Taïwan et le détroit',
    category: 'tension',
    asOf: AS_OF,
    summary:
      "Taïwan est une démocratie de 23 millions d'habitants que la République populaire de Chine considère comme une province à « réunifier », au besoin par la force. Les États-Unis, sans reconnaître officiellement Taïwan, l'arment et entretiennent une « ambiguïté stratégique » sur une éventuelle intervention.",
    whyItMatters:
      "Taïwan produit l'essentiel des semi-conducteurs les plus avancés du monde. Un conflit dans le détroit perturberait l'économie mondiale et opposerait potentiellement les deux premières puissances.",
    countries: ['TWN', 'CHN', 'USA', 'JPN', 'PHL'],
    orgs: [],
    keywords: ['taiwan', 'taipei', 'detroit de taiwan', 'taiwan strait', 'tsmc', 'semi conducteurs', 'semiconductors', 'reunification', 'pla', 'apl'],
    sections: {
      situation:
        "Pékin multiplie les manœuvres militaires autour de l'île et les incursions aériennes, tandis que Taïwan renforce sa défense. Les échanges économiques à travers le détroit restent importants. Consultez les actualités liées pour l'état des tensions.",
      histoire:
        "Taïwan passe sous domination japonaise de 1895 à 1945. En 1949, vaincu par les communistes, le gouvernement nationaliste (Kuomintang) de Tchang Kaï-chek s'y replie : la « République de Chine » subsiste à Taïwan. En 1971, la résolution 2758 de l'ONU attribue le siège chinois à la République populaire. Les États-Unis reconnaissent Pékin en 1979 mais adoptent le Taiwan Relations Act. L'île se démocratise à partir de la fin des années 1980.",
      acteurs:
        "République populaire de Chine (Parti communiste, Armée populaire de libération) ; Taïwan (gouvernement élu, partis DPP et Kuomintang aux visions opposées des relations avec Pékin) ; États-Unis ; Japon (proximité géographique, bases américaines à Okinawa) ; Philippines ; TSMC, entreprise clé des semi-conducteurs.",
      interets:
        "Chine : unité nationale (enjeu de légitimité du Parti), accès au Pacifique au-delà de la « première chaîne d'îles ». Taïwan : préserver son autonomie et sa démocratie. États-Unis : crédibilité de leurs engagements en Asie, maintien de l'équilibre régional, accès aux semi-conducteurs.",
      alliances:
        "Taïwan n'est reconnue que par une douzaine d'États. Les États-Unis sont liés au Japon, à la Corée du Sud, aux Philippines et à l'Australie (accords bilatéraux, AUKUS, Quad). La Chine n'a pas d'alliance militaire équivalente mais un partenariat étroit avec la Russie.",
      rapports:
        "L'Armée populaire de libération dispose désormais de la première marine du monde en nombre de navires. Une invasion amphibie resterait cependant une opération extrêmement complexe. Taïwan mise sur une stratégie « du porc-épic » (défense asymétrique).",
      scenarios: [
        'Maintien du statu quo sous pression croissante (zone grise, coercition économique) (analyse).',
        "Blocus ou quarantaine de l'île sans invasion (analyse).",
        'Crise militaire ouverte impliquant les États-Unis et leurs alliés (analyse).',
      ],
      europeFrance:
        "L'Europe dépend des puces taïwanaises et du commerce maritime asiatique. La France, présente dans l'Indo-Pacifique (Nouvelle-Calédonie, Polynésie, La Réunion), défend la liberté de navigation tout en maintenant la politique d'une seule Chine.",
    },
    timeline: [
      { year: 1895, label: 'Taïwan cédée au Japon' },
      { year: 1949, label: 'Repli du Kuomintang à Taïwan' },
      { year: 1971, label: 'Résolution 2758 de l’ONU' },
      { year: 1979, label: 'Reconnaissance de Pékin par Washington ; Taiwan Relations Act' },
      { year: 1996, label: 'Première élection présidentielle directe à Taïwan' },
    ],
    sources: [wp('Statut de Taïwan'), wp('Résolution 2758 de l\'Assemblée générale des Nations unies'), wp('Taiwan Relations Act'), site('CSIS', 'https://www.csis.org')],
    quiz: [
      {
        question: "En quelle année le gouvernement nationaliste chinois s'est-il replié à Taïwan ?",
        options: ['1911', '1937', '1949', '1971'],
        answer: 2,
        explanation: 'En 1949, après la victoire des communistes de Mao, Tchang Kaï-chek et le Kuomintang se replient à Taïwan.',
        extra: 'La République populaire de Chine est proclamée le 1er octobre 1949 à Pékin.',
      },
    ],
  },
  {
    id: 'mer-de-chine',
    title: 'La mer de Chine méridionale',
    category: 'tension',
    asOf: AS_OF,
    summary:
      "Espace maritime stratégique revendiqué en quasi-totalité par la Chine (« ligne en neuf traits »), contesté par le Vietnam, les Philippines, la Malaisie, Brunei et Taïwan. La Chine y a construit des îles artificielles militarisées.",
    whyItMatters:
      "Une part considérable du commerce maritime mondial y transite. Le différend teste l'application du droit de la mer face à la puissance.",
    countries: ['CHN', 'PHL', 'VNM', 'MYS', 'IDN', 'TWN', 'USA'],
    orgs: ['asean'],
    keywords: ['mer de chine', 'south china sea', 'spratleys', 'spratly', 'paracels', 'scarborough', 'second thomas', 'garde cotes', 'coast guard'],
    sections: {
      situation:
        "Les incidents entre garde-côtes chinois et philippins se sont multipliés, notamment autour du banc de Scarborough et du Second Thomas Shoal. Consultez les actualités liées.",
      histoire:
        "Les revendications chinoises s'appuient sur une carte de 1947 (ligne en onze puis neuf traits). Les îles Paracels sont prises au Sud-Vietnam en 1974 ; des affrontements sino-vietnamiens ont lieu aux Spratleys en 1988. En 2016, un tribunal arbitral constitué sous l'égide de la Convention des Nations unies sur le droit de la mer, saisi par les Philippines, juge les revendications historiques chinoises sans fondement juridique ; Pékin rejette la décision.",
      acteurs:
        "Chine (marine, garde-côtes, milice maritime) ; Philippines ; Vietnam ; Malaisie ; Brunei ; Indonésie (zone des Natuna) ; États-Unis (opérations de liberté de navigation) ; ASEAN.",
      interets:
        "Contrôle des routes maritimes, ressources halieutiques et hydrocarbures, profondeur stratégique pour les sous-marins chinois. Pour les riverains : souveraineté et accès aux ressources de leur zone économique exclusive.",
      alliances:
        "Les Philippines sont alliées des États-Unis (traité de défense mutuelle de 1951) et ont élargi l'accès américain à leurs bases. L'ASEAN est divisée et négocie depuis longtemps un code de conduite avec la Chine.",
      rapports: "Supériorité navale chinoise écrasante face aux riverains ; contrepoids américain et coopérations avec le Japon et l'Australie.",
      scenarios: [
        'Poursuite de la stratégie chinoise de « zone grise » sans conflit ouvert (analyse).',
        "Incident grave entre la Chine et les Philippines déclenchant le jeu des alliances (analyse).",
      ],
      europeFrance:
        "La France et plusieurs pays européens y envoient des navires pour affirmer la liberté de navigation conformément au droit de la mer.",
    },
    timeline: [
      { year: 1974, label: 'Bataille des Paracels' },
      { year: 1982, label: 'Convention des Nations unies sur le droit de la mer' },
      { year: 1988, label: 'Affrontement sino-vietnamien aux Spratleys' },
      { year: 2016, label: 'Sentence arbitrale en faveur des Philippines' },
    ],
    sources: [wp('Conflits territoriaux en mer de Chine méridionale'), wp('Convention des Nations unies sur le droit de la mer'), site('CSIS — Asia Maritime Transparency Initiative', 'https://amti.csis.org')],
    quiz: [
      {
        question: 'Quel pays a saisi le tribunal arbitral qui a rendu sa sentence en 2016 sur la mer de Chine méridionale ?',
        options: ['Le Vietnam', 'Les Philippines', 'La Malaisie', 'Le Japon'],
        answer: 1,
        explanation: 'Les Philippines ont engagé la procédure en 2013 ; la sentence de juillet 2016 leur a largement donné raison.',
        extra: 'La Chine n’a pas participé à la procédure et ne reconnaît pas la décision.',
      },
    ],
  },
  {
    id: 'sahel',
    title: 'Le Sahel',
    category: 'conflit',
    asOf: AS_OF,
    summary:
      "La bande sahélienne (Mali, Burkina Faso, Niger notamment) est confrontée depuis 2012 à des insurrections jihadistes, à des conflits intercommunautaires et à une série de coups d'État militaires. Les juntes au pouvoir ont rompu avec la France et se sont rapprochées de la Russie.",
    whyItMatters:
      "Le Sahel concentre une partie importante des victimes du terrorisme dans le monde. Son évolution affecte la sécurité de l'Afrique de l'Ouest côtière, les migrations et la place de la France en Afrique.",
    countries: ['MLI', 'BFA', 'NER', 'TCD', 'MRT', 'DZA', 'NGA'],
    orgs: ['ase', 'cedeao', 'wagner', 'ei'],
    keywords: ['sahel', 'mali', 'burkina', 'niger', 'barkhane', 'jnim', 'junte', 'junta', 'bamako', 'ouagadougou', 'niamey', 'africa corps', 'wagner'],
    sections: {
      situation:
        "Les groupes affiliés à Al-Qaïda (JNIM) et à l'État islamique restent très actifs. Les juntes du Mali, du Burkina Faso et du Niger ont formé l'Alliance des États du Sahel et quitté la CEDEAO. Consultez les actualités liées.",
      histoire:
        "En 2012, une rébellion touarègue et des groupes jihadistes prennent le nord du Mali. La France intervient en janvier 2013 (opération Serval), relayée en 2014 par l'opération régionale Barkhane. Malgré des succès tactiques, la violence s'étend au centre du Mali, au Burkina Faso et au Niger. Les coups d'État se succèdent (Mali 2020 et 2021, Burkina Faso 2022, Niger 2023). Les forces françaises quittent le Mali en 2022, le Burkina Faso et le Niger en 2023.",
      acteurs:
        "Juntes militaires (Mali, Burkina Faso, Niger) ; JNIM (Al-Qaïda) ; État islamique au Sahel ; groupes armés touaregs ; Russie (Wagner puis Africa Corps) ; CEDEAO ; Algérie ; France (désormais sans présence militaire dans ces trois pays).",
      interets:
        "Juntes : légitimité, souveraineté affichée, survie politique. Jihadistes : contrôle territorial et des populations. Russie : influence, accès aux ressources (or). Voisins côtiers (Bénin, Togo, Ghana, Côte d'Ivoire) : contenir la contagion.",
      alliances:
        "L'Alliance des États du Sahel (2023-2024) réunit Mali, Burkina Faso et Niger. Les juntes coopèrent militairement avec la Russie et se rapprochent de la Turquie (drones). Les relations avec la CEDEAO sont rompues ou tendues.",
      rapports:
        "Les armées nationales, soutenues par des partenaires russes, peinent à reprendre le contrôle de vastes zones rurales. Les exactions contre les civils, attribuées à tous les camps, nourrissent le recrutement jihadiste.",
      scenarios: [
        'Enlisement durable avec contrôle jihadiste de zones rurales (analyse).',
        "Extension des violences vers les pays côtiers du golfe de Guinée (analyse).",
        "Négociations locales entre États et groupes armés (analyse).",
      ],
      europeFrance:
        "La fin des opérations françaises au Sahel marque la fin d'un modèle d'intervention. La France a réorganisé sa présence militaire en Afrique et l'UE a suspendu ou réduit ses missions de formation. Les enjeux migratoires et terroristes restent suivis de près en Europe.",
    },
    timeline: [
      { year: 2012, label: 'Prise du nord du Mali par des groupes armés' },
      { year: 2013, label: 'Opération Serval' },
      { year: 2014, label: 'Opération Barkhane' },
      { year: 2020, label: 'Coup d’État au Mali' },
      { year: 2022, label: 'Départ des forces françaises du Mali' },
      { year: 2023, label: 'Coup d’État au Niger ; création de l’Alliance des États du Sahel' },
    ],
    sources: [wp('Guerre du Mali'), wp('Opération Barkhane'), wp('Alliance des États du Sahel'), site('ACLED', 'https://acleddata.com'), site('International Crisis Group', 'https://www.crisisgroup.org/fr')],
    quiz: [
      {
        question: "Comment s'appelait l'opération militaire française lancée au Mali en janvier 2013 ?",
        options: ['Sangaris', 'Serval', 'Licorne', 'Chammal'],
        answer: 1,
        explanation: "Serval a stoppé l'offensive jihadiste vers le sud du Mali ; elle a été remplacée par Barkhane en 2014.",
        extra: 'Sangaris concernait la Centrafrique, Licorne la Côte d’Ivoire et Chammal la lutte contre l’État islamique en Irak et en Syrie.',
      },
    ],
  },
  {
    id: 'otan',
    title: "L'OTAN",
    category: 'alliance',
    asOf: AS_OF,
    summary:
      "L'Organisation du traité de l'Atlantique Nord, fondée en 1949, est une alliance de défense collective. Son article 5 prévoit qu'une attaque armée contre l'un de ses membres est considérée comme une attaque contre tous. Elle compte 32 membres depuis l'adhésion de la Suède en 2024.",
    whyItMatters:
      "L'OTAN est le pilier de la sécurité de la plupart des pays européens, dont la France. Sa crédibilité dépend de l'engagement américain et des efforts de défense européens.",
    countries: ['USA', 'GBR', 'FRA', 'DEU', 'POL', 'TUR', 'FIN', 'SWE'],
    orgs: ['otan'],
    keywords: ['otan', 'nato', 'article 5', 'alliance atlantique', 'rutte', 'flanc est', 'eastern flank'],
    sections: {
      situation:
        "Depuis 2022, l'Alliance a renforcé sa présence sur son flanc oriental. Au sommet de La Haye (2025), les alliés se sont engagés sur un objectif de dépenses de défense et de sécurité de 5 % du PIB à l'horizon 2035 (dont 3,5 % de défense « cœur »). Le partage du fardeau avec les États-Unis reste un sujet de tension.",
      histoire:
        "Le traité de Washington est signé le 4 avril 1949 par 12 pays face à la menace soviétique. Le pacte de Varsovie est créé en 1955. La France quitte le commandement intégré en 1966 sous de Gaulle et le réintègre en 2009. Après la guerre froide, l'OTAN s'élargit à l'Europe centrale et orientale (1999, 2004…). L'article 5 a été invoqué une seule fois, après les attentats du 11 septembre 2001.",
      acteurs:
        "32 États membres ; Conseil de l'Atlantique Nord ; Secrétaire général ; commandement militaire (SACEUR, traditionnellement américain) ; partenaires (Ukraine, Japon, Australie…).",
      interets:
        "Dissuasion et défense collective face à la Russie ; gestion de crises ; lutte contre le terrorisme. Pour les États-Unis : stabilité européenne et répartition des charges. Pour les Européens : garantie de sécurité américaine, y compris nucléaire.",
      alliances:
        "L'OTAN coopère étroitement avec l'Union européenne (la plupart des membres de l'UE sont membres de l'OTAN). Ses adversaires désignés dans le concept stratégique de 2022 sont la Russie (« menace la plus importante et directe ») et les groupes terroristes ; la Chine y est décrite comme un « défi ».",
      rapports:
        "Les États-Unis représentent l'essentiel des capacités militaires de l'Alliance. Trois membres possèdent l'arme nucléaire : États-Unis, Royaume-Uni et France (la dissuasion française reste indépendante du commandement de l'OTAN).",
      scenarios: [
        "Européanisation progressive de l'OTAN, avec une part croissante de l'effort assumée par les Européens (analyse).",
        "Affaiblissement de la crédibilité de l'article 5 en cas de désengagement américain (analyse).",
      ],
      europeFrance:
        "La France est membre fondateur, puissance nucléaire et l'un des principaux contributeurs militaires de l'Alliance ; elle défend en parallèle une « autonomie stratégique » européenne.",
    },
    timeline: [
      { year: 1949, label: 'Traité de Washington' },
      { year: 1955, label: "Adhésion de la RFA ; création du pacte de Varsovie" },
      { year: 1966, label: 'La France quitte le commandement intégré' },
      { year: 1999, label: 'Adhésion de la Pologne, de la Hongrie et de la Tchéquie' },
      { year: 2001, label: "Première invocation de l'article 5" },
      { year: 2009, label: 'Retour de la France dans le commandement intégré' },
      { year: 2024, label: 'Adhésion de la Suède : 32 membres' },
    ],
    sources: [site('OTAN — site officiel', 'https://www.nato.int'), wp('Organisation du traité de l\'Atlantique nord'), wp('Traité de l\'Atlantique nord')],
    quiz: [
      {
        question: "Combien de fois l'article 5 du traité de l'Atlantique Nord a-t-il été invoqué ?",
        options: ['Jamais', 'Une fois', 'Trois fois', 'Cinq fois'],
        answer: 1,
        explanation: "Il a été invoqué une seule fois, après les attentats du 11 septembre 2001 contre les États-Unis.",
        extra: "L'article 4 (consultations) a, lui, été invoqué à plusieurs reprises, notamment en 2022.",
      },
      {
        question: "En quelle année la France a-t-elle quitté le commandement militaire intégré de l'OTAN ?",
        options: ['1949', '1958', '1966', '1991'],
        answer: 2,
        explanation: 'Le général de Gaulle retire la France du commandement intégré en 1966, sans quitter l’Alliance.',
        extra: 'Elle y est revenue en 2009, sous la présidence de Nicolas Sarkozy.',
      },
    ],
  },
  {
    id: 'union-europeenne',
    title: "L'Union européenne",
    category: 'organisation',
    asOf: AS_OF,
    summary:
      "Union politique et économique de 27 États membres, l'UE est une puissance commerciale et normative de premier plan, dont les compétences en défense et en politique étrangère restent limitées et largement intergouvernementales.",
    whyItMatters:
      "Une grande partie des règles qui s'appliquent en France est décidée au niveau européen (marché unique, commerce, concurrence, climat, numérique). L'UE est aussi un acteur central face à la guerre en Ukraine.",
    countries: ['FRA', 'DEU', 'ITA', 'ESP', 'POL', 'NLD', 'BEL'],
    orgs: ['ue', 'bce'],
    keywords: ['union europeenne', 'european union', 'commission europeenne', 'bruxelles', 'brussels', 'parlement europeen', 'conseil europeen', 'elargissement', 'enlargement', 'zone euro'],
    sections: {
      situation:
        "L'UE cherche à renforcer son industrie de défense, à réduire ses dépendances stratégiques (énergie, matières premières, technologies) et à gérer sa relation commerciale avec les États-Unis et la Chine. L'élargissement (Ukraine, Moldavie, Balkans occidentaux) est redevenu une priorité géopolitique.",
      histoire:
        "Après la Seconde Guerre mondiale, la déclaration Schuman (9 mai 1950) lance la Communauté européenne du charbon et de l'acier (1951). Le traité de Rome crée la CEE en 1957. Le traité de Maastricht (1992) fonde l'Union européenne et prévoit l'euro, mis en circulation en 2002. Le grand élargissement de 2004 intègre dix pays, surtout d'Europe centrale. Le Royaume-Uni quitte l'UE en 2020 (Brexit).",
      acteurs:
        "Commission européenne (initiative législative, exécution, commerce) ; Conseil européen (chefs d'État et de gouvernement) ; Conseil de l'UE (ministres) ; Parlement européen (élu au suffrage universel) ; Cour de justice ; Banque centrale européenne.",
      interets:
        "Prospérité via le marché unique, sécurité, défense des normes (climat, données, concurrence), influence internationale. Les intérêts nationaux divergent souvent (énergie, rapport à la Russie et à la Chine, budget).",
      alliances:
        "23 des 27 membres de l'UE appartiennent aussi à l'OTAN. L'UE conclut des accords commerciaux avec de nombreux partenaires et entretient des partenariats stratégiques.",
      rapports:
        "Puissance économique comparable aux États-Unis en taille de marché, mais fragmentée militairement et dépendante de l'extérieur pour l'énergie et certaines technologies.",
      scenarios: [
        "Approfondissement de l'intégration en matière de défense et d'industrie (analyse).",
        'Blocages internes liés aux divisions politiques entre États membres (analyse).',
      ],
      europeFrance:
        "La France est membre fondateur et porte de longue date l'idée de « souveraineté européenne » et d'autonomie stratégique.",
    },
    timeline: [
      { year: 1950, label: 'Déclaration Schuman' },
      { year: 1957, label: 'Traité de Rome' },
      { year: 1992, label: 'Traité de Maastricht' },
      { year: 2002, label: "Mise en circulation de l'euro" },
      { year: 2004, label: 'Élargissement à 10 nouveaux membres' },
      { year: 2009, label: 'Entrée en vigueur du traité de Lisbonne' },
      { year: 2020, label: 'Sortie du Royaume-Uni' },
    ],
    sources: [site('Union européenne — site officiel', 'https://european-union.europa.eu'), wp('Union européenne'), wp('Traité de Maastricht'), site('Toute l’Europe', 'https://www.touteleurope.eu')],
    quiz: [
      {
        question: "Quel traité a créé l'Union européenne ?",
        options: ['Traité de Rome (1957)', 'Traité de Maastricht (1992)', "Traité d'Amsterdam (1997)", 'Traité de Lisbonne (2007)'],
        answer: 1,
        explanation: "Le traité de Maastricht, signé en 1992 et entré en vigueur en 1993, institue l'Union européenne.",
        extra: 'Le traité de Rome de 1957 avait créé la Communauté économique européenne.',
      },
    ],
  },
  {
    id: 'onu',
    title: "L'ONU et le Conseil de sécurité",
    category: 'organisation',
    asOf: AS_OF,
    summary:
      "Fondée en 1945, l'Organisation des Nations unies compte 193 États membres. Son Conseil de sécurité, chargé du maintien de la paix, comprend 15 membres dont 5 permanents disposant d'un droit de veto : Chine, États-Unis, France, Royaume-Uni, Russie.",
    whyItMatters:
      "L'ONU est le cadre du droit international (Charte, interdiction du recours à la force), mais le veto paralyse souvent le Conseil lors des crises majeures.",
    countries: ['USA', 'CHN', 'RUS', 'FRA', 'GBR'],
    orgs: ['onu', 'cij', 'oms'],
    keywords: ['onu', 'nations unies', 'united nations', 'conseil de securite', 'security council', 'veto', 'guterres', 'casques bleus', 'peacekeepers', 'assemblee generale'],
    sections: {
      situation:
        "Le Conseil de sécurité est profondément divisé sur l'Ukraine et le Moyen-Orient. Les opérations de maintien de la paix sont réduites et l'organisation fait face à des difficultés budgétaires. La réforme du Conseil (élargissement) est discutée depuis des décennies.",
      histoire:
        "La Charte des Nations unies est signée à San Francisco le 26 juin 1945 et entre en vigueur le 24 octobre 1945. L'ONU succède à la Société des Nations, qui avait échoué à empêcher la Seconde Guerre mondiale. La République populaire de Chine remplace la République de Chine au Conseil en 1971 ; la Russie succède à l'URSS en 1991.",
      acteurs:
        "Assemblée générale ; Conseil de sécurité ; Secrétariat et Secrétaire général ; Cour internationale de justice (La Haye) ; agences spécialisées (OMS, UNESCO, FAO…) ; programmes et fonds (HCR, PAM, UNICEF).",
      interets:
        "Les membres permanents utilisent le veto pour protéger leurs intérêts et ceux de leurs alliés. Les pays du Sud réclament une meilleure représentation.",
      alliances: "Le Conseil reflète les rapports de force de 1945 ; les blocs se reconstituent au gré des crises (Occidentaux d'un côté, Russie et Chine souvent de l'autre).",
      rapports: "Les résolutions du Conseil prises au titre du chapitre VII de la Charte sont contraignantes ; celles de l'Assemblée générale ne le sont pas.",
      scenarios: [
        'Paralysie persistante du Conseil de sécurité (analyse).',
        'Réforme limitant ou encadrant le veto (initiative franco-mexicaine en cas d’atrocités de masse) (analyse).',
      ],
      europeFrance:
        "La France est membre permanent du Conseil de sécurité, ce qui lui confère une influence diplomatique supérieure à son poids démographique ; elle soutient un encadrement du veto en cas d'atrocités de masse.",
    },
    timeline: [
      { year: 1945, label: 'Charte de San Francisco' },
      { year: 1948, label: 'Déclaration universelle des droits de l’homme' },
      { year: 1971, label: 'La RPC obtient le siège chinois' },
      { year: 1991, label: "La Russie succède à l'URSS" },
    ],
    sources: [site('ONU — site officiel (français)', 'https://www.un.org/fr'), wp('Conseil de sécurité des Nations unies'), wp('Charte des Nations unies')],
    quiz: [
      {
        question: 'Lequel de ces pays n’est PAS membre permanent du Conseil de sécurité ?',
        options: ['La France', 'La Chine', "L'Allemagne", 'Le Royaume-Uni'],
        answer: 2,
        explanation: "Les cinq membres permanents sont la Chine, les États-Unis, la France, le Royaume-Uni et la Russie.",
        extra: "L'Allemagne, le Japon, l'Inde et le Brésil (« G4 ») réclament un siège permanent.",
      },
    ],
  },
  {
    id: 'etats-unis',
    title: 'Les États-Unis, superpuissance en débat',
    category: 'puissance',
    asOf: AS_OF,
    summary:
      "Première puissance militaire et économique, les États-Unis disposent d'un réseau d'alliances mondial et du dollar comme monnaie de réserve. Leur politique étrangère oscille entre engagement international et repli sur les intérêts nationaux.",
    whyItMatters:
      "Les choix de Washington (tarifs douaniers, soutien à l'Ukraine, engagement dans l'OTAN, rivalité avec la Chine) ont des effets directs sur l'Europe et la France.",
    countries: ['USA', 'CHN', 'CAN', 'MEX'],
    orgs: ['otan', 'fed', 'onu'],
    keywords: ['etats unis', 'united states', 'washington', 'maison blanche', 'white house', 'trump', 'congres', 'congress', 'pentagone', 'pentagon', 'dollar', 'tarifs', 'tariffs'],
    sections: {
      situation:
        "La politique commerciale (droits de douane), la redéfinition des alliances et la rivalité avec la Chine structurent l'action américaine. Consultez les actualités liées pour les décisions récentes.",
      histoire:
        "Indépendants en 1776, les États-Unis s'affirment comme puissance mondiale au XXe siècle (entrée dans les deux guerres mondiales). Après 1945, ils fondent l'ordre international libéral (ONU, Bretton Woods, OTAN, plan Marshall) et affrontent l'URSS pendant la guerre froide. Unique superpuissance après 1991, ils s'engagent en Afghanistan (2001-2021) et en Irak (2003-2011).",
      acteurs: "Président et Maison-Blanche ; Congrès (déclaration de guerre, budget, traités au Sénat) ; Cour suprême ; Pentagone ; Réserve fédérale ; États fédérés ; grandes entreprises technologiques.",
      interets: "Préserver leur primauté face à la Chine, sécuriser les chaînes d'approvisionnement, protéger leur industrie, maintenir la liberté de navigation et la prééminence du dollar.",
      alliances: "OTAN ; alliances bilatérales avec le Japon, la Corée du Sud, les Philippines, l'Australie ; AUKUS ; Quad (avec l'Inde, le Japon et l'Australie) ; accord commercial avec le Canada et le Mexique.",
      rapports: "Premier budget militaire du monde ; puissance technologique et financière ; mais polarisation politique intérieure et dette publique élevée.",
      scenarios: [
        'Recentrage sur l’Indo-Pacifique et pression accrue sur les Européens pour assumer leur défense (analyse).',
        'Guerre commerciale durable avec effets sur la croissance mondiale (analyse).',
      ],
      europeFrance:
        "L'Europe dépend largement de la garantie de sécurité américaine et de son marché. Les tensions commerciales et les doutes sur l'engagement américain nourrissent le débat sur l'autonomie stratégique européenne défendue par la France.",
    },
    timeline: [
      { year: 1776, label: "Déclaration d'indépendance" },
      { year: 1917, label: 'Entrée dans la Première Guerre mondiale' },
      { year: 1941, label: 'Pearl Harbor : entrée dans la Seconde Guerre mondiale' },
      { year: 1947, label: 'Doctrine Truman et plan Marshall' },
      { year: 2001, label: 'Attentats du 11 septembre' },
      { year: 2021, label: "Retrait d'Afghanistan" },
    ],
    sources: [wp('Politique étrangère des États-Unis'), site('Council on Foreign Relations', 'https://www.cfr.org'), site('RAND Corporation', 'https://www.rand.org')],
    quiz: [
      {
        question: 'Quel plan américain a financé la reconstruction de l’Europe occidentale après 1947 ?',
        options: ['Le plan Dawes', 'Le plan Marshall', 'Le plan Young', 'Le New Deal'],
        answer: 1,
        explanation: "Le plan Marshall (European Recovery Program), annoncé en 1947, a apporté une aide massive à l'Europe occidentale.",
        extra: "Les plans Dawes et Young (années 1920) concernaient les réparations allemandes ; le New Deal était une politique intérieure.",
      },
    ],
  },
  {
    id: 'chine-puissance',
    title: 'La Chine, puissance montante',
    category: 'puissance',
    asOf: AS_OF,
    summary:
      "Deuxième économie mondiale, premier exportateur et principale puissance manufacturière, la République populaire de Chine, dirigée par le Parti communiste, cherche à remodeler l'ordre international et à devenir la première puissance d'ici le milieu du siècle.",
    whyItMatters:
      "La Chine est un partenaire commercial incontournable et un rival systémique pour l'Europe : dépendances industrielles, terres rares, véhicules électriques, technologies.",
    countries: ['CHN', 'USA', 'TWN', 'RUS', 'IND'],
    orgs: ['brics', 'ocs'],
    keywords: ['chine', 'china', 'pekin', 'beijing', 'xi jinping', 'parti communiste', 'routes de la soie', 'belt and road', 'terres rares', 'rare earths'],
    sections: {
      situation:
        "La Chine fait face à un ralentissement économique, à une crise immobilière et à un vieillissement démographique, tout en investissant massivement dans les technologies de pointe et la modernisation militaire. Consultez les actualités liées.",
      histoire:
        "Après le « siècle d'humiliation » (guerres de l'opium, traités inégaux), la République populaire est proclamée en 1949. Après les drames du Grand Bond en avant et de la Révolution culturelle, Deng Xiaoping lance en 1978 les réformes et l'ouverture. La Chine adhère à l'OMC en 2001. Depuis 2012, Xi Jinping concentre les pouvoirs.",
      acteurs: 'Parti communiste chinois et son secrétaire général ; Armée populaire de libération ; grandes entreprises publiques et privées ; partenaires du Sud global.',
      interets: 'Stabilité du régime, croissance, sécurisation des approvisionnements, « réunification » avec Taïwan, influence mondiale (nouvelles routes de la soie).',
      alliances: 'Pas d’alliance militaire formelle (hors traité avec la Corée du Nord) ; partenariat « sans limites » proclamé avec la Russie en 2022 ; BRICS ; Organisation de coopération de Shanghai.',
      rapports: "Puissance industrielle de premier rang, contrôle d'une grande partie du raffinage des métaux critiques ; marine militaire en forte croissance ; arsenal nucléaire en expansion.",
      scenarios: ['Rivalité durable avec les États-Unis organisée en blocs technologiques (analyse).', 'Ralentissement économique contraignant ses ambitions (analyse).'],
      europeFrance:
        "L'UE qualifie la Chine à la fois de partenaire, de concurrent économique et de rival systémique. Elle cherche à « réduire les risques » (de-risking) sans rompre les échanges.",
    },
    timeline: [
      { year: 1839, label: 'Première guerre de l’opium' },
      { year: 1949, label: 'Proclamation de la République populaire' },
      { year: 1978, label: 'Réformes de Deng Xiaoping' },
      { year: 2001, label: "Adhésion à l'OMC" },
      { year: 2013, label: 'Lancement des nouvelles routes de la soie' },
    ],
    sources: [wp('République populaire de Chine'), wp('Nouvelles routes de la soie'), site('Asia Centre / IFRI Asie', 'https://www.ifri.org')],
    quiz: [
      {
        question: "Qui a lancé la politique de « réforme et d'ouverture » en Chine en 1978 ?",
        options: ['Mao Zedong', 'Deng Xiaoping', 'Jiang Zemin', 'Zhou Enlai'],
        answer: 1,
        explanation: "Deng Xiaoping, au pouvoir de fait à partir de 1978, a engagé la libéralisation économique.",
        extra: 'Les zones économiques spéciales, comme Shenzhen, ont été créées dans ce cadre à partir de 1980.',
      },
    ],
  },
  {
    id: 'routes-maritimes',
    title: 'Routes commerciales et détroits stratégiques',
    category: 'route',
    asOf: AS_OF,
    summary:
      "Environ 80 % du commerce mondial en volume transite par la mer (ordre de grandeur couramment cité par la CNUCED). Quelques passages étroits — Ormuz, Bab el-Mandeb, Suez, Malacca, Panama, Bosphore — concentrent une part décisive de ces flux.",
    whyItMatters:
      "Toute perturbation d'un détroit (guerre, attaques, sécheresse, accident) se répercute sur les prix, les délais de livraison et l'inflation en Europe.",
    countries: ['EGY', 'YEM', 'IRN', 'PAN', 'SGP', 'MYS', 'IDN', 'TUR'],
    orgs: ['houthis', 'omc'],
    keywords: ['canal de suez', 'suez canal', 'bab el mandeb', 'mer rouge', 'red sea', 'malacca', 'canal de panama', 'panama canal', 'ormuz', 'hormuz', 'fret', 'shipping', 'porte conteneurs', 'container ship'],
    sections: {
      situation:
        "Les attaques des Houthis contre des navires en mer Rouge à partir de fin 2023 ont détourné une partie du trafic par le cap de Bonne-Espérance. Le canal de Panama a connu des restrictions liées à la sécheresse. Consultez les actualités liées.",
      histoire:
        "Le canal de Suez, ouvert en 1869, réduit de moitié la route Europe-Asie ; sa nationalisation par Nasser en 1956 provoque la crise de Suez. Le canal de Panama ouvre en 1914 et est rétrocédé au Panama en 1999. La convention de Montreux (1936) règle le passage des détroits turcs.",
      acteurs: 'États riverains, grandes compagnies maritimes, marines militaires (missions de sécurité maritime), assureurs, groupes armés (Houthis, pirates somaliens).',
      interets: 'Liberté de navigation, droits de passage, revenus des canaux, contrôle stratégique.',
      alliances: "Missions de sécurité maritime internationales (dont l'opération européenne Aspides en mer Rouge, lancée en 2024).",
      rapports: 'Les marines occidentales assurent une part importante de la sécurité maritime ; la Chine développe un réseau de ports et une base militaire à Djibouti.',
      scenarios: ['Fragmentation durable des routes maritimes en fonction des crises (analyse).', 'Développement des routes arctiques avec le réchauffement (analyse).'],
      europeFrance:
        "La France, deuxième espace maritime mondial grâce à ses outre-mer, dispose d'une base à Djibouti et participe aux missions de sécurité maritime en mer Rouge et dans l'océan Indien.",
    },
    timeline: [
      { year: 1869, label: 'Ouverture du canal de Suez' },
      { year: 1914, label: 'Ouverture du canal de Panama' },
      { year: 1936, label: 'Convention de Montreux' },
      { year: 1956, label: 'Crise de Suez' },
      { year: 1999, label: 'Rétrocession du canal de Panama' },
      { year: 2023, label: 'Début des attaques des Houthis en mer Rouge' },
    ],
    sources: [wp('Canal de Suez'), wp('Détroit de Malacca'), wp('Convention de Montreux'), site('CNUCED', 'https://unctad.org/fr')],
    quiz: [
      {
        question: 'Quel détroit relie la mer Rouge au golfe d’Aden ?',
        options: ['Ormuz', 'Bab el-Mandeb', 'Malacca', 'Gibraltar'],
        answer: 1,
        explanation: "Le détroit de Bab el-Mandeb sépare le Yémen de Djibouti et de l'Érythrée.",
        extra: '« Bab el-Mandeb » signifie en arabe « la porte des lamentations ».',
      },
    ],
  },
  {
    id: 'energie-europe',
    title: 'La sécurité énergétique européenne',
    category: 'energie',
    asOf: AS_OF,
    summary:
      "Longtemps dépendante du gaz russe, l'Europe a profondément réorganisé ses approvisionnements après 2022 : gaz naturel liquéfié (GNL) américain et qatari, gaz norvégien, sobriété, renouvelables et nucléaire.",
    whyItMatters: "Les prix de l'énergie conditionnent le pouvoir d'achat, la compétitivité industrielle et la marge de manœuvre diplomatique de l'Europe.",
    countries: ['RUS', 'NOR', 'USA', 'QAT', 'DEU', 'FRA'],
    orgs: ['ue', 'opep'],
    keywords: ['gaz', 'gas', 'gnl', 'lng', 'petrole', 'oil', 'nord stream', 'energie', 'energy', 'electricite', 'nucleaire civil', 'opep', 'opec'],
    sections: {
      situation: "L'UE a décidé d'éliminer progressivement les importations de gaz russe. La question des prix, de la dépendance au GNL et de l'investissement dans la production décarbonée reste centrale.",
      histoire:
        "Les chocs pétroliers de 1973 et 1979 conduisent la France à lancer un vaste programme électronucléaire (plan Messmer, 1974). L'Allemagne, elle, développe sa dépendance au gaz russe (gazoducs Nord Stream). En 2022, l'invasion de l'Ukraine et le sabotage des gazoducs Nord Stream provoquent une crise des prix.",
      acteurs: 'UE et États membres ; fournisseurs (Norvège, États-Unis, Qatar, Algérie, Azerbaïdjan) ; OPEP+ ; énergéticiens ; Agence internationale de l’énergie.',
      interets: 'Sécurité d’approvisionnement, prix abordables, décarbonation.',
      alliances: 'Partenariats énergétiques avec les États-Unis et les pays producteurs ; marché intérieur de l’énergie.',
      rapports: "L'Europe importe la majorité de ses hydrocarbures ; la France dispose d'un parc nucléaire qui lui assure une électricité largement décarbonée.",
      scenarios: ['Accélération de l’électrification et des renouvelables (analyse).', 'Nouvelle crise des prix en cas de tension sur le GNL ou au Moyen-Orient (analyse).'],
      europeFrance: 'Le nucléaire donne à la France un atout en matière de souveraineté électrique, mais le pays dépend des importations de pétrole et de gaz.',
    },
    timeline: [
      { year: 1973, label: 'Premier choc pétrolier' },
      { year: 1974, label: 'Plan Messmer (programme nucléaire français)' },
      { year: 2011, label: 'Mise en service de Nord Stream 1' },
      { year: 2022, label: 'Crise énergétique et sabotage de Nord Stream' },
    ],
    sources: [site('Agence internationale de l’énergie', 'https://www.iea.org'), wp('Choc pétrolier de 1973'), wp('Nord Stream')],
    quiz: [
      {
        question: 'Quel événement a déclenché le premier choc pétrolier de 1973 ?',
        options: ['La révolution iranienne', 'La guerre du Kippour et l’embargo de pays arabes producteurs', 'La guerre du Golfe', 'La nationalisation du canal de Suez'],
        answer: 1,
        explanation: "Pendant la guerre du Kippour (octobre 1973), des pays arabes producteurs décrètent un embargo et réduisent leur production : les prix quadruplent.",
        extra: 'Le second choc pétrolier (1979) est lié à la révolution iranienne.',
      },
    ],
  },
  {
    id: 'metaux-critiques',
    title: 'Métaux critiques et terres rares',
    category: 'ressource',
    asOf: AS_OF,
    summary:
      "Lithium, cobalt, nickel, cuivre, gallium, terres rares : ces matériaux sont indispensables aux batteries, à l'électronique, aux éoliennes et aux armements. La Chine domine une grande partie de leur raffinage.",
    whyItMatters: "Ces dépendances créent un levier de pression géopolitique ; la Chine a déjà restreint l'exportation de certains métaux.",
    countries: ['CHN', 'COD', 'AUS', 'CHL', 'IDN', 'USA'],
    orgs: [],
    keywords: ['terres rares', 'rare earths', 'lithium', 'cobalt', 'gallium', 'metaux critiques', 'critical minerals', 'minerais', 'minerals'],
    sections: {
      situation: "Les États-Unis et l'UE cherchent à diversifier leurs approvisionnements (règlement européen sur les matières premières critiques, accords miniers). Consultez les actualités liées.",
      histoire: "La Chine s'est imposée depuis les années 1990 dans l'extraction puis le raffinage des terres rares. En 2010, un différend avec le Japon s'accompagne de restrictions d'exportation, prise de conscience de cette vulnérabilité.",
      acteurs: 'Chine, RD Congo (cobalt), Australie, Chili (lithium, cuivre), Indonésie (nickel), entreprises minières et de raffinage.',
      interets: 'Contrôle des chaînes de valeur des technologies de la transition énergétique et de la défense.',
      alliances: 'Partenariats « minerais » entre pays consommateurs et producteurs ; initiatives occidentales de sécurisation.',
      rapports: "Les ressources sont réparties dans le monde, mais la capacité de raffinage est très concentrée en Chine.",
      scenarios: ['Course aux minerais et nationalisme des ressources (analyse).', 'Développement du recyclage et de technologies alternatives (analyse).'],
      europeFrance: "L'UE a adopté en 2024 un règlement sur les matières premières critiques ; la France explore ses ressources (lithium dans l'Allier) et soutient le raffinage.",
    },
    timeline: [
      { year: 2010, label: 'Restrictions chinoises sur les terres rares envers le Japon' },
      { year: 2024, label: 'Règlement européen sur les matières premières critiques' },
    ],
    sources: [wp('Terres rares'), wp('Minerai critique'), site('Agence internationale de l’énergie', 'https://www.iea.org')],
    quiz: [
      {
        question: 'Quel pays produit la majorité du cobalt mondial ?',
        options: ['La Chine', 'La RD Congo', "L'Australie", 'Le Chili'],
        answer: 1,
        explanation: "La République démocratique du Congo fournit la majorité du cobalt extrait dans le monde ; une grande partie est ensuite raffinée en Chine.",
        extra: "L'exploitation artisanale du cobalt soulève d'importantes questions de droits humains.",
      },
    ],
  },
  {
    id: 'soudan',
    title: 'La guerre au Soudan',
    category: 'conflit',
    asOf: AS_OF,
    summary:
      "Depuis avril 2023, l'armée soudanaise et les Forces de soutien rapide (FSR, paramilitaires) s'affrontent pour le contrôle du pays, provoquant l'une des pires crises humanitaires et de déplacement au monde selon l'ONU.",
    whyItMatters: "Le conflit déstabilise la Corne de l'Afrique et le Sahel, implique plusieurs puissances régionales et nourrit des déplacements massifs de population.",
    countries: ['SDN', 'TCD', 'EGY', 'ARE', 'SSD'],
    orgs: ['onu', 'ua'],
    keywords: ['soudan', 'sudan', 'darfour', 'darfur', 'khartoum', 'fsr', 'rsf', 'forces de soutien rapide', 'rapid support forces', 'el fasher'],
    sections: {
      situation: "Les combats et les exactions, en particulier au Darfour, se poursuivent. Consultez les actualités liées pour la situation présente.",
      histoire:
        "Après l'indépendance (1956), le Soudan connaît des guerres civiles et la sécession du Soudan du Sud (2011). Au Darfour, à partir de 2003, les milices janjawids — dont sont issues les FSR — commettent des massacres. Omar el-Béchir est renversé en 2019 ; la transition est interrompue par un coup d'État militaire en 2021, avant la rupture entre l'armée et les FSR en 2023.",
      acteurs: 'Forces armées soudanaises ; Forces de soutien rapide ; groupes armés locaux ; puissances régionales accusées de soutenir l’un ou l’autre camp ; ONU et agences humanitaires.',
      interets: 'Contrôle du pouvoir et des ressources (or, terres agricoles, accès à la mer Rouge).',
      alliances: "L'armée est soutenue notamment par l'Égypte ; les Émirats arabes unis sont accusés par plusieurs rapports de soutenir les FSR, ce qu'ils démentent.",
      rapports: 'Aucun camp ne semble en mesure de l’emporter rapidement ; fragmentation territoriale de fait.',
      scenarios: ['Partition de fait entre zones contrôlées par chaque camp (analyse).', 'Cessez-le-feu sous médiation internationale (analyse).'],
      europeFrance: "L'Europe est concernée par la crise humanitaire, les flux migratoires et la stabilité de la mer Rouge. La France a organisé en 2024 une conférence humanitaire sur le Soudan.",
    },
    timeline: [
      { year: 1956, label: 'Indépendance' },
      { year: 2003, label: 'Début de la guerre du Darfour' },
      { year: 2011, label: 'Indépendance du Soudan du Sud' },
      { year: 2019, label: "Chute d'Omar el-Béchir" },
      { year: 2023, label: 'Début de la guerre entre l’armée et les FSR' },
    ],
    sources: [wp('Guerre civile soudanaise de 2023'), site('ONU Info', 'https://news.un.org/fr/'), site('International Crisis Group', 'https://www.crisisgroup.org/fr')],
    quiz: [
      {
        question: 'En quelle année le Soudan du Sud est-il devenu indépendant ?',
        options: ['1956', '1989', '2005', '2011'],
        answer: 3,
        explanation: "Le Soudan du Sud a proclamé son indépendance le 9 juillet 2011, après un référendum prévu par l'accord de paix de 2005.",
        extra: 'C’est le plus jeune État membre de l’ONU.',
      },
    ],
  },
  {
    id: 'inde-pakistan',
    title: 'Inde-Pakistan et le Cachemire',
    category: 'tension',
    asOf: AS_OF,
    summary:
      "Depuis la partition de 1947, l'Inde et le Pakistan, deux puissances nucléaires, se disputent le Cachemire. Ils se sont affrontés lors de plusieurs guerres et crises, la dernière confrontation militaire ouverte datant de mai 2025.",
    whyItMatters: 'Il s’agit de l’une des rares rivalités entre deux puissances nucléaires voisines ; l’Inde est par ailleurs un partenaire stratégique majeur de la France.',
    countries: ['IND', 'PAK', 'CHN'],
    orgs: [],
    keywords: ['cachemire', 'kashmir', 'inde', 'india', 'pakistan', 'islamabad', 'new delhi', 'ligne de controle', 'line of control'],
    sections: {
      situation: 'Après la crise de 2025, la relation reste très tendue. Consultez les actualités liées.',
      histoire:
        "La partition de l'Inde britannique en 1947 s'accompagne de violences massives et de millions de déplacés. Le Cachemire, à majorité musulmane mais dirigé par un maharadja hindou, rejoint l'Inde, provoquant la première guerre indo-pakistanaise. D'autres conflits suivent (1965, 1971 — qui aboutit à l'indépendance du Bangladesh —, Kargil en 1999). Les deux pays effectuent des essais nucléaires en 1998. En 2019, l'Inde révoque l'autonomie constitutionnelle du Jammu-et-Cachemire.",
      acteurs: 'Gouvernements indien et pakistanais ; armée pakistanaise (acteur politique central) ; groupes armés opérant au Cachemire ; Chine (alliée du Pakistan, contrôlant une partie du Cachemire : Aksai Chin).',
      interets: 'Souveraineté territoriale, identité nationale, sécurité, contrôle des ressources en eau (traité de l’Indus de 1960).',
      alliances: 'Le Pakistan est très proche de la Chine ; l’Inde pratique le multi-alignement (partenariats avec les États-Unis, la France, la Russie).',
      rapports: "L'Inde dispose d'une supériorité économique et conventionnelle ; le Pakistan s'appuie sur sa dissuasion nucléaire.",
      scenarios: ['Crises récurrentes contenues par la dissuasion (analyse).', 'Escalade incontrôlée après un attentat majeur (analyse).'],
      europeFrance: "La France est un partenaire stratégique de l'Inde (Rafale, sous-marins, nucléaire civil, espace).",
    },
    timeline: [
      { year: 1947, label: 'Partition et première guerre du Cachemire' },
      { year: 1960, label: "Traité des eaux de l'Indus" },
      { year: 1971, label: 'Guerre et indépendance du Bangladesh' },
      { year: 1998, label: 'Essais nucléaires indiens et pakistanais' },
      { year: 1999, label: 'Guerre de Kargil' },
      { year: 2019, label: "Révocation de l'autonomie du Jammu-et-Cachemire" },
    ],
    sources: [wp('Conflit du Cachemire'), wp('Partition des Indes'), wp('Traité de l\'Indus')],
    quiz: [
      {
        question: "Quelle guerre indo-pakistanaise a abouti à l'indépendance du Bangladesh ?",
        options: ['1947', '1965', '1971', '1999'],
        answer: 2,
        explanation: "En 1971, l'intervention indienne au Pakistan oriental conduit à la création du Bangladesh.",
        extra: 'Le Pakistan était jusqu’alors divisé en deux ailes séparées par le territoire indien.',
      },
    ],
  },
  {
    id: 'arctique',
    title: "L'Arctique",
    category: 'ressource',
    asOf: AS_OF,
    summary:
      "Le réchauffement de l'Arctique, plusieurs fois plus rapide que la moyenne mondiale, ouvre de nouvelles routes maritimes et l'accès à des ressources, tout en renforçant sa militarisation.",
    whyItMatters: "L'Arctique devient une zone de rivalité entre la Russie, les pays nordiques membres de l'OTAN, les États-Unis (Alaska, Groenland) et la Chine.",
    countries: ['RUS', 'USA', 'CAN', 'NOR', 'DNK', 'ISL', 'FIN', 'SWE'],
    orgs: ['otan'],
    keywords: ['arctique', 'arctic', 'groenland', 'greenland', 'route maritime du nord', 'northern sea route', 'svalbard', 'banquise'],
    sections: {
      situation: 'Le Groenland (territoire autonome du Danemark) suscite un intérêt stratégique américain affiché. Consultez les actualités liées.',
      histoire: "Pendant la guerre froide, l'Arctique est une zone de patrouille des sous-marins nucléaires. Le Conseil de l'Arctique est créé en 1996. La Russie y concentre une partie de sa flotte du Nord (Mourmansk).",
      acteurs: "Les huit États arctiques (Russie, États-Unis, Canada, Danemark/Groenland, Norvège, Islande, Suède, Finlande) ; peuples autochtones ; Chine (« État proche de l'Arctique » autoproclamé).",
      interets: 'Ressources (hydrocarbures, minerais), routes maritimes, dissuasion nucléaire, souveraineté.',
      alliances: "Avec l'adhésion de la Finlande et de la Suède, sept des huit États arctiques sont membres de l'OTAN.",
      rapports: 'La Russie possède la plus longue façade arctique et la plus grande flotte de brise-glaces.',
      scenarios: ['Militarisation accrue et rivalité sino-russo-occidentale (analyse).', 'Coopération limitée sur le climat et la recherche (analyse).'],
      europeFrance: 'La France participe à des exercices dans le Grand Nord et dispose du statut d’observateur au Conseil de l’Arctique.',
    },
    timeline: [
      { year: 1920, label: 'Traité du Svalbard' },
      { year: 1996, label: "Création du Conseil de l'Arctique" },
      { year: 2023, label: "La Finlande rejoint l'OTAN" },
    ],
    sources: [wp('Arctique'), wp('Conseil de l\'Arctique'), wp('Groenland')],
    quiz: [
      {
        question: 'Le Groenland est un territoire autonome rattaché à quel pays ?',
        options: ['La Norvège', 'Le Danemark', "L'Islande", 'Le Canada'],
        answer: 1,
        explanation: 'Le Groenland fait partie du Royaume de Danemark et dispose d’une large autonomie.',
        extra: "Le Groenland a quitté la Communauté économique européenne en 1985, tout en restant lié au Danemark.",
      },
    ],
  },
  {
    id: 'rdc-grands-lacs',
    title: "L'est de la RD Congo et les Grands Lacs",
    category: 'conflit',
    asOf: AS_OF,
    summary:
      "L'est de la République démocratique du Congo (Nord et Sud-Kivu, Ituri) est en proie à des conflits armés depuis les années 1990, impliquant des dizaines de groupes armés, dont le M23 que l'ONU et plusieurs États disent soutenu par le Rwanda, ce que Kigali conteste.",
    whyItMatters: "Ces conflits ont causé des millions de morts et de déplacés depuis les années 1990 et touchent des régions riches en minerais stratégiques (coltan, cobalt, or).",
    countries: ['COD', 'RWA', 'UGA', 'BDI'],
    orgs: ['onu', 'ua'],
    keywords: ['rdc', 'drc', 'congo', 'kivu', 'goma', 'bukavu', 'm23', 'rwanda', 'coltan', 'ituri'],
    sections: {
      situation: 'Le M23 a pris Goma et Bukavu début 2025 ; des accords de paix ont été négociés sous médiation américaine et qatarie. Consultez les actualités liées.',
      histoire:
        "Après le génocide des Tutsi au Rwanda (1994), des responsables du génocide se réfugient dans l'est du Zaïre. Les guerres du Congo (1996-1997 et 1998-2003) impliquent plusieurs armées africaines. Malgré la présence d'une importante mission de l'ONU, les groupes armés prolifèrent. Le M23 apparaît en 2012, est défait en 2013, puis resurgit en 2021.",
      acteurs: 'Gouvernement congolais ; M23/AFC ; armée rwandaise ; milices locales ; Ouganda ; Burundi ; mission de l’ONU (MONUSCO).',
      interets: 'Sécurité frontalière, contrôle des minerais, influence régionale.',
      alliances: 'Kinshasa coopère avec le Burundi et a eu recours à des sociétés militaires privées ; le Rwanda est accusé de soutenir le M23.',
      rapports: "Armée congolaise affaiblie ; M23 bien équipé ; État congolais peu présent dans l'est.",
      scenarios: ['Application partielle des accords de paix (analyse).', 'Reprise des combats et extension régionale (analyse).'],
      europeFrance: "L'UE a signé en 2024 un partenariat sur les matières premières avec le Rwanda, critiqué par Kinshasa. La France entretient des relations avec les deux pays.",
    },
    timeline: [
      { year: 1994, label: 'Génocide des Tutsi au Rwanda' },
      { year: 1996, label: 'Première guerre du Congo' },
      { year: 1998, label: 'Deuxième guerre du Congo (jusqu’en 2003)' },
      { year: 2012, label: 'Apparition du M23' },
      { year: 2025, label: 'Prise de Goma par le M23' },
    ],
    sources: [wp('Conflit du Kivu'), wp('Deuxième guerre du Congo'), site('ONU Info', 'https://news.un.org/fr/')],
    quiz: [
      {
        question: "Quel minerai, essentiel à l'électronique, est notamment extrait dans l'est de la RDC ?",
        options: ['Le coltan', 'La bauxite', "L'uranium", 'Le phosphate'],
        answer: 0,
        explanation: "Le coltan, dont on extrait le tantale utilisé dans les condensateurs, est extrait dans les Kivus.",
        extra: 'Le commerce des « minerais de conflit » fait l’objet de réglementations (loi Dodd-Frank aux États-Unis, règlement européen).',
      },
    ],
  },
  {
    id: 'france-puissance',
    title: 'La France, puissance moyenne d’influence mondiale',
    category: 'puissance',
    asOf: AS_OF,
    summary:
      "Membre permanent du Conseil de sécurité, puissance nucléaire, présente sur tous les océans grâce à ses outre-mer, la France cherche à peser au-delà de son poids démographique et économique, notamment à travers l'Europe.",
    whyItMatters: 'Comprendre les atouts et les limites de la puissance française éclaire la plupart des décisions de politique étrangère et de défense du pays.',
    countries: ['FRA'],
    orgs: ['ue', 'otan', 'onu'],
    keywords: ['france', 'elysee', 'macron', 'quai d orsay', 'ministere des armees', 'loi de programmation militaire', 'dissuasion', 'outre mer', 'francophonie'],
    sections: {
      situation: "La France fait face à des contraintes budgétaires, à une réorganisation de sa présence en Afrique et à la nécessité de renforcer ses armées (loi de programmation militaire 2024-2030). Consultez les actualités liées.",
      histoire:
        "Grande puissance coloniale jusqu'au milieu du XXe siècle, la France se reconstruit après 1945, se dote de l'arme nucléaire (premier essai en 1960) sous de Gaulle, qui fonde la Ve République (1958) et une politique d'indépendance nationale. Elle est l'un des moteurs de la construction européenne.",
      acteurs: "Président de la République (chef des armées, domaine « réservé » de la politique étrangère) ; ministère de l'Europe et des Affaires étrangères ; ministère des Armées ; Parlement.",
      interets: 'Sécurité du territoire et des outre-mer, autonomie stratégique, influence européenne, stabilité du voisinage (Méditerranée, Afrique), francophonie.',
      alliances: 'UE, OTAN, partenariats stratégiques (Inde, Émirats, Grèce…), traité d’Aix-la-Chapelle avec l’Allemagne (2019).',
      rapports: "Seule puissance nucléaire de l'UE depuis le Brexit ; armée complète mais de taille réduite (« armée bonsaï ») ; deuxième domaine maritime mondial.",
      scenarios: ['Européanisation de la dissuasion dans le débat stratégique (analyse).', 'Réduction de l’influence en Afrique compensée par l’Indo-Pacifique (analyse).'],
      europeFrance: 'La France défend une Europe plus souveraine en matière de défense, d’industrie et de technologies.',
    },
    timeline: [
      { year: 1958, label: 'Ve République' },
      { year: 1960, label: 'Premier essai nucléaire (Gerboise bleue)' },
      { year: 1963, label: 'Traité de l’Élysée avec la RFA' },
      { year: 1966, label: 'Sortie du commandement intégré de l’OTAN' },
      { year: 2009, label: 'Retour dans le commandement intégré' },
    ],
    sources: [site('Ministère de l’Europe et des Affaires étrangères', 'https://www.diplomatie.gouv.fr'), site('Ministère des Armées', 'https://www.defense.gouv.fr'), wp('Force de dissuasion nucléaire française')],
    quiz: [
      {
        question: 'En quelle année la France a-t-elle réalisé son premier essai nucléaire ?',
        options: ['1945', '1952', '1960', '1968'],
        answer: 2,
        explanation: "L'essai « Gerboise bleue » a eu lieu le 13 février 1960 dans le Sahara algérien, près de Reggane.",
        extra: "La France a conduit ensuite des essais en Polynésie jusqu'en 1996.",
      },
    ],
  },
];

export const DOSSIER_BY_ID: Record<string, Dossier> = Object.fromEntries(DOSSIERS.map((d) => [d.id, d]));

export const DOSSIER_CATEGORY_LABELS: Record<Dossier['category'], string> = {
  puissance: 'Grandes puissances',
  organisation: 'Organisations internationales',
  alliance: 'Alliances militaires',
  conflit: 'Conflits en cours',
  tension: 'Tensions territoriales',
  ressource: 'Ressources stratégiques',
  route: 'Routes commerciales',
  energie: 'Enjeux énergétiques',
};
