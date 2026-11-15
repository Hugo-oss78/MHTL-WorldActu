import { wp, type HistoryFiche } from './types';

/**
 * Fiches historiques. Les dates et faits retenus sont des faits établis de l'historiographie ;
 * les chiffres sujets à débat sont présentés comme des estimations.
 */
export const HISTORY: HistoryFiche[] = [
  // — Antiquité
  {
    id: 'marathon',
    title: 'La bataille de Marathon',
    dateLabel: '490 av. J.-C.',
    year: -490,
    period: 'antiquite',
    type: 'bataille',
    civilisation: 'Grèce antique / Empire perse',
    countries: ['GRC', 'IRN'],
    contexte:
      "Au début du Ve siècle av. J.-C., l'Empire perse achéménide domine un immense territoire de l'Indus à l'Égée. La révolte des cités grecques d'Ionie (499-493 av. J.-C.), soutenue par Athènes, pousse le roi Darius Ier à lancer une expédition punitive contre la Grèce continentale.",
    personnages: [
      { name: 'Darius Ier', role: 'Roi des Perses' },
      { name: 'Miltiade', role: 'Stratège athénien' },
      { name: 'Datis', role: 'Commandant perse' },
    ],
    deroulement:
      "L'armée perse débarque dans la plaine de Marathon, au nord-est d'Athènes. Les hoplites athéniens, appuyés par les Platéens, attaquent en renforçant leurs ailes ; celles-ci enveloppent le centre perse. Les Perses rembarquent après de lourdes pertes. La légende du messager courant jusqu'à Athènes, popularisée bien plus tard, inspire l'épreuve olympique moderne du marathon (1896).",
    consequences:
      "La victoire préserve l'indépendance d'Athènes et renforce la confiance de la jeune démocratie. Les Perses reviennent en 480 av. J.-C. sous Xerxès (Thermopyles, Salamine) avant d'être repoussés en 479.",
    heritage:
      "Marathon devient dans la mémoire occidentale le symbole d'une liberté défendue contre un empire — une lecture qui simplifie une réalité perse plus tolérante et cosmopolite qu'on ne l'a longtemps dit. L'historien Hérodote est notre principale source.",
    lienActualite: { text: "La relation entre puissances impériales et petites entités indépendantes reste un ressort majeur des conflits, comme la défense de l'Ukraine face à la Russie.", dossierId: 'russie-ukraine' },
    keywords: ['grece', 'perse', 'athenes', 'democratie'],
    sources: [wp('Bataille de Marathon'), wp('Guerres médiques')],
  },
  {
    id: 'cesar-ides-de-mars',
    title: "L'assassinat de Jules César",
    dateLabel: '15 mars 44 av. J.-C.',
    year: -44,
    monthDay: '03-15',
    period: 'antiquite',
    type: 'evenement',
    civilisation: 'Rome antique',
    countries: ['ITA'],
    contexte:
      "La République romaine est déchirée par des guerres civiles depuis plusieurs décennies. Vainqueur de la guerre des Gaules (58-50 av. J.-C.) puis de Pompée, Jules César concentre les pouvoirs et devient dictateur à vie début 44 av. J.-C., ce que de nombreux sénateurs perçoivent comme une menace de royauté.",
    personnages: [
      { name: 'Jules César', role: 'Dictateur romain' },
      { name: 'Brutus et Cassius', role: 'Principaux conjurés' },
      { name: 'Marc Antoine', role: 'Lieutenant de César' },
      { name: 'Octave (futur Auguste)', role: 'Fils adoptif et héritier de César' },
    ],
    deroulement:
      "Aux ides de mars, une soixantaine de sénateurs conjurés poignardent César lors d'une séance du Sénat réunie dans la curie de Pompée. Les conjurés pensent restaurer la République, mais la population et les vétérans restent attachés à César.",
    consequences:
      "L'assassinat relance la guerre civile. Octave et Marc Antoine écrasent les conjurés à Philippes (42 av. J.-C.), puis s'affrontent ; Octave l'emporte à Actium (31 av. J.-C.) et devient Auguste, premier empereur (27 av. J.-C.).",
    heritage:
      "L'épisode illustre comment la violence politique peut produire l'inverse de son but : le meurtre censé sauver la République ouvre la voie à l'Empire. Le terme « césarisme » désigne depuis un pouvoir personnel s'appuyant sur l'armée et le peuple contre les institutions.",
    lienActualite: { text: 'La fragilité des institutions face à la concentration du pouvoir reste un thème central de la vie politique contemporaine.' },
    keywords: ['rome', 'cesar', 'republique', 'empire', 'senat'],
    sources: [wp('Assassinat de Jules César'), wp('Jules César')],
  },
  {
    id: 'chute-rome-476',
    title: "La fin de l'Empire romain d'Occident",
    dateLabel: '476',
    year: 476,
    period: 'antiquite',
    type: 'evenement',
    civilisation: 'Rome antique / royaumes germaniques',
    countries: ['ITA'],
    contexte:
      "Depuis la fin du IVe siècle, l'Empire est divisé entre Occident et Orient (395). L'Occident subit des crises politiques, financières et militaires, ainsi que l'installation de peuples germaniques souvent intégrés à l'armée romaine. Rome est pillée par les Wisigoths en 410 puis par les Vandales en 455.",
    personnages: [
      { name: 'Romulus Augustule', role: "Dernier empereur d'Occident" },
      { name: 'Odoacre', role: 'Chef militaire germanique' },
    ],
    deroulement:
      "En 476, Odoacre dépose le jeune empereur Romulus Augustule et renvoie les insignes impériaux à Constantinople, reconnaissant formellement l'autorité de l'empereur d'Orient. Il gouverne l'Italie comme roi.",
    consequences:
      "L'Occident se fragmente en royaumes (Francs, Wisigoths, Ostrogoths, Vandales…). L'Empire romain d'Orient (byzantin) se maintient jusqu'en 1453.",
    heritage:
      "Les historiens insistent aujourd'hui davantage sur une « transformation » progressive que sur une « chute » brutale : le droit romain, le latin et l'Église assurent de fortes continuités. La date de 476 est surtout symbolique.",
    lienActualite: { text: "La question du « déclin » des puissances est récurrente dans le débat géopolitique (débats sur le déclin de l'Occident, la montée de la Chine).", dossierId: 'etats-unis' },
    keywords: ['rome', 'empire', 'germains', 'byzance'],
    sources: [wp('Chute de l\'Empire romain d\'Occident'), wp('Odoacre')],
  },
  // — Moyen Âge
  {
    id: 'charlemagne-800',
    title: 'Le couronnement de Charlemagne',
    dateLabel: '25 décembre 800',
    year: 800,
    monthDay: '12-25',
    period: 'moyen-age',
    type: 'evenement',
    civilisation: 'Empire carolingien',
    countries: ['FRA', 'DEU', 'ITA'],
    contexte:
      "Roi des Francs depuis 768, Charlemagne a conquis la Lombardie, la Saxe, une partie de l'Espagne du Nord et soumis les Avars. Allié de la papauté, il domine l'essentiel de l'Europe occidentale chrétienne.",
    personnages: [
      { name: 'Charlemagne', role: 'Roi des Francs et des Lombards' },
      { name: 'Léon III', role: 'Pape' },
    ],
    deroulement:
      "Le jour de Noël 800, à Rome, dans la basilique Saint-Pierre, le pape Léon III couronne Charlemagne empereur. C'est la première fois depuis 476 qu'un empereur règne en Occident.",
    consequences:
      "Le couronnement crée une rivalité avec l'empereur byzantin et établit un lien durable entre pouvoir impérial et papauté. L'empire est partagé entre ses petits-fils au traité de Verdun (843), dessinant les futures France et Allemagne.",
    heritage:
      "Charlemagne est revendiqué comme « père de l'Europe » ; le prix Charlemagne d'Aix-la-Chapelle récompense depuis 1950 des contributions à l'unité européenne. La « renaissance carolingienne » a préservé de nombreux textes antiques.",
    lienActualite: { text: "La construction européenne puise une partie de son imaginaire dans l'héritage carolingien.", dossierId: 'union-europeenne' },
    keywords: ['francs', 'empire', 'pape', 'europe'],
    sources: [wp('Charlemagne'), wp('Traité de Verdun')],
  },
  {
    id: 'hastings-1066',
    title: "La bataille d'Hastings",
    dateLabel: '14 octobre 1066',
    year: 1066,
    monthDay: '10-14',
    period: 'moyen-age',
    type: 'bataille',
    civilisation: 'Normands / Anglo-Saxons',
    countries: ['GBR', 'FRA'],
    contexte:
      "À la mort du roi Édouard le Confesseur (janvier 1066), Harold Godwinson est couronné roi d'Angleterre. Guillaume, duc de Normandie, affirme qu'Édouard lui avait promis la couronne. Harold doit d'abord repousser une invasion norvégienne au nord (Stamford Bridge, septembre 1066).",
    personnages: [
      { name: 'Guillaume le Conquérant', role: 'Duc de Normandie' },
      { name: 'Harold Godwinson', role: "Roi d'Angleterre" },
    ],
    deroulement:
      "L'armée anglo-saxonne, à pied, forme un « mur de boucliers » sur une colline. Les Normands, combinant archers, infanterie et cavalerie, finissent par le rompre, notamment grâce à des fuites simulées. Harold est tué.",
    consequences:
      "Guillaume est couronné roi d'Angleterre à Noël 1066. La conquête normande transforme l'aristocratie, la langue (apport massif du français) et l'administration anglaises. Les rois d'Angleterre deviennent aussi des seigneurs en France, source des conflits ultérieurs, dont la guerre de Cent Ans.",
    heritage: "La tapisserie de Bayeux, broderie de près de 70 mètres, raconte l'événement du point de vue normand. 1066 reste la dernière conquête réussie de l'Angleterre par une force extérieure.",
    keywords: ['angleterre', 'normandie', 'conquete'],
    sources: [wp('Bataille d\'Hastings'), wp('Tapisserie de Bayeux')],
  },
  {
    id: 'orleans-1429',
    title: "Jeanne d'Arc et la levée du siège d'Orléans",
    dateLabel: '8 mai 1429',
    year: 1429,
    monthDay: '05-08',
    period: 'moyen-age',
    type: 'bataille',
    civilisation: 'Royaume de France / Angleterre',
    countries: ['FRA', 'GBR'],
    contexte:
      "La guerre de Cent Ans (1337-1453) oppose les Plantagenêts aux Valois pour la couronne de France. Après le traité de Troyes (1420), le roi d'Angleterre est désigné héritier du trône de France ; le dauphin Charles ne contrôle que le sud de la Loire. Orléans est assiégée depuis octobre 1428.",
    personnages: [
      { name: "Jeanne d'Arc", role: 'Jeune paysanne lorraine se disant envoyée par Dieu' },
      { name: 'Charles VII', role: 'Dauphin puis roi de France' },
      { name: 'Jean de Dunois', role: "Commandant de la défense d'Orléans" },
    ],
    deroulement:
      "Arrivée fin avril 1429 avec un convoi de ravitaillement, Jeanne d'Arc galvanise les défenseurs. Les bastilles anglaises tombent les unes après les autres et les Anglais lèvent le siège le 8 mai. La victoire de Patay suit en juin, puis le sacre de Charles VII à Reims le 17 juillet 1429.",
    consequences:
      "Le sacre renforce la légitimité de Charles VII. Capturée en 1430, Jeanne est jugée par un tribunal ecclésiastique pro-anglais et brûlée à Rouen en 1431. La France reconquiert progressivement son territoire ; la guerre se termine en 1453 (Castillon).",
    heritage:
      "Jeanne, réhabilitée en 1456 et canonisée en 1920, est une figure revendiquée par des courants politiques très divers. La guerre de Cent Ans contribue à forger un sentiment national et une armée permanente.",
    keywords: ['guerre de cent ans', 'jeanne', 'orleans', 'angleterre'],
    sources: [wp('Siège d\'Orléans (1428-1429)'), wp('Jeanne d\'Arc'), wp('Guerre de Cent Ans')],
  },
  // — Grandes civilisations et empires
  {
    id: 'gengis-khan',
    title: "Gengis Khan et l'Empire mongol",
    dateLabel: '1206',
    year: 1206,
    period: 'empires',
    type: 'personnalite',
    civilisation: 'Empire mongol',
    countries: ['MNG', 'CHN', 'RUS', 'IRN'],
    contexte:
      "Les steppes d'Asie centrale sont divisées entre des tribus nomades rivales. Temüjin, issu d'une famille aristocratique déchue, unifie progressivement les tribus mongoles et turques par la guerre et les alliances.",
    personnages: [
      { name: 'Gengis Khan (Temüjin)', role: 'Fondateur de l’Empire mongol' },
      { name: 'Ögedeï', role: 'Fils et successeur' },
      { name: 'Kubilaï Khan', role: 'Petit-fils, fondateur de la dynastie Yuan en Chine' },
    ],
    deroulement:
      "En 1206, un grand rassemblement (kurultaï) proclame Temüjin « Gengis Khan ». Ses armées, très mobiles et disciplinées, conquièrent la Chine du Nord, l'Asie centrale (empire khwarezmien) et atteignent le Caucase. Ses successeurs poussent jusqu'en Europe centrale (1241) et prennent Bagdad (1258).",
    consequences:
      "L'Empire mongol devient le plus vaste empire continu de l'histoire. Il cause des destructions massives mais favorise aussi les échanges eurasiatiques (« pax mongolica »), le long desquels circulent marchands — comme Marco Polo — techniques et, plus tard, la peste noire.",
    heritage:
      "La domination mongole sur les principautés russes (« joug tatar ») a marqué durablement l'histoire de la Russie. Gengis Khan est un héros national en Mongolie.",
    lienActualite: { text: "Les routes eurasiatiques sont à nouveau un enjeu stratégique avec les « nouvelles routes de la soie » chinoises.", dossierId: 'chine-puissance' },
    keywords: ['mongols', 'steppe', 'empire', 'asie'],
    sources: [wp('Gengis Khan'), wp('Empire mongol')],
  },
  {
    id: 'constantinople-1453',
    title: 'La prise de Constantinople',
    dateLabel: '29 mai 1453',
    year: 1453,
    monthDay: '05-29',
    period: 'empires',
    type: 'bataille',
    civilisation: 'Empire byzantin / Empire ottoman',
    countries: ['TUR', 'GRC'],
    contexte:
      "L'Empire byzantin, héritier de Rome en Orient, est réduit à Constantinople et à quelques territoires. Les Ottomans contrôlent déjà l'Anatolie et une grande partie des Balkans.",
    personnages: [
      { name: 'Mehmed II', role: 'Sultan ottoman' },
      { name: 'Constantin XI Paléologue', role: 'Dernier empereur byzantin' },
    ],
    deroulement:
      "Après un siège d'environ deux mois, au cours duquel les Ottomans utilisent une artillerie puissante contre les murailles théodosiennes, la ville est prise d'assaut le 29 mai 1453. Constantin XI meurt dans les combats.",
    consequences:
      "Constantinople devient la capitale ottomane (Istanbul). L'Empire ottoman s'impose comme une grande puissance méditerranéenne et européenne. Le départ de lettrés grecs vers l'Italie nourrit la Renaissance.",
    heritage:
      "La date marque traditionnellement la fin du Moyen Âge pour certains historiens. Sainte-Sophie, transformée en mosquée en 1453, devenue musée en 1934, a été reconvertie en mosquée en 2020 — un geste politique et symbolique fort.",
    lienActualite: { text: "La Turquie contemporaine mobilise l'héritage ottoman dans sa politique étrangère (« néo-ottomanisme »)." },
    keywords: ['byzance', 'ottomans', 'istanbul', 'turquie'],
    sources: [wp('Chute de Constantinople'), wp('Mehmed II')],
  },
  {
    id: 'conquete-azteque',
    title: "La conquête de l'Empire aztèque",
    dateLabel: '1519-1521',
    year: 1521,
    period: 'empires',
    type: 'guerre',
    civilisation: 'Aztèques / Empire espagnol',
    countries: ['MEX', 'ESP'],
    contexte:
      "Au début du XVIe siècle, la Triple Alliance dominée par Tenochtitlan (Mexico) contrôle une grande partie du Mexique central et prélève des tributs sur de nombreux peuples soumis. Les Espagnols, installés dans les Caraïbes depuis 1492, explorent le continent.",
    personnages: [
      { name: 'Hernán Cortés', role: 'Conquistador espagnol' },
      { name: 'Moctezuma II', role: 'Souverain aztèque' },
      { name: 'Malintzin (la Malinche)', role: 'Interprète et conseillère de Cortés' },
    ],
    deroulement:
      "Cortés débarque en 1519 avec quelques centaines d'hommes et s'allie à des peuples hostiles aux Aztèques, notamment les Tlaxcaltèques, qui fournissent des dizaines de milliers de combattants. Après la mort de Moctezuma (1520) et une épidémie de variole dévastatrice, Tenochtitlan tombe en août 1521 après un long siège.",
    consequences:
      "La Nouvelle-Espagne devient le cœur de l'empire colonial espagnol. Les populations autochtones s'effondrent dans les décennies suivantes, principalement à cause des épidémies, mais aussi du travail forcé et des violences.",
    heritage:
      "Le récit d'une poignée d'Espagnols triomphant seuls est une simplification : la conquête fut aussi une guerre menée par des alliés autochtones. Le Mexique contemporain revendique un héritage métis complexe.",
    keywords: ['amerique', 'colonisation', 'espagne', 'mexique'],
    sources: [wp('Conquête de l\'Empire aztèque'), wp('Hernán Cortés')],
  },
  {
    id: 'westphalie-1648',
    title: 'Les traités de Westphalie',
    dateLabel: '24 octobre 1648',
    year: 1648,
    monthDay: '10-24',
    period: 'empires',
    type: 'traite',
    civilisation: 'Saint-Empire romain germanique / Europe',
    countries: ['DEU', 'FRA', 'SWE', 'NLD', 'ESP'],
    contexte:
      "La guerre de Trente Ans (1618-1648), née d'un conflit religieux dans le Saint-Empire, devient une guerre européenne entre Habsbourg, Suède, France et princes allemands. Elle ravage l'Allemagne, dont une part importante de la population disparaît selon les estimations des historiens.",
    personnages: [
      { name: 'Mazarin', role: 'Principal ministre de la France' },
      { name: 'Ferdinand III', role: 'Empereur du Saint-Empire' },
      { name: 'Christine de Suède', role: 'Reine de Suède' },
    ],
    deroulement:
      "Après de longues négociations à Münster et Osnabrück, les traités sont signés en 1648. Ils reconnaissent l'indépendance des Provinces-Unies et de la Confédération suisse, renforcent l'autonomie des princes allemands et accordent à la France des territoires en Alsace.",
    consequences:
      "Le Saint-Empire est affaibli ; la France et la Suède deviennent des puissances majeures. L'équilibre européen repose désormais sur des États souverains.",
    heritage:
      "On parle d'« ordre westphalien » pour désigner un système d'États souverains égaux en droit, non soumis à une autorité supérieure. Les historiens rappellent que ce modèle est en partie une reconstruction ultérieure, mais la notion reste centrale en relations internationales.",
    lienActualite: { text: 'Le principe de souveraineté et de non-ingérence, hérité de cette tradition, est au cœur des débats sur les interventions et l’intégrité territoriale.', dossierId: 'onu' },
    keywords: ['souverainete', 'guerre de trente ans', 'traite', 'europe'],
    sources: [wp('Traités de Westphalie'), wp('Guerre de Trente Ans')],
  },
  // — Révolutions
  {
    id: 'independance-americaine',
    title: "La Déclaration d'indépendance des États-Unis",
    dateLabel: '4 juillet 1776',
    year: 1776,
    monthDay: '07-04',
    period: 'revolutions',
    type: 'revolution',
    civilisation: 'Amérique du Nord britannique',
    countries: ['USA', 'GBR', 'FRA'],
    contexte:
      "Après la guerre de Sept Ans (1756-1763), la Grande-Bretagne impose de nouvelles taxes à ses treize colonies d'Amérique. Les colons contestent leur légitimité (« pas de taxation sans représentation ») ; les tensions dégénèrent en guerre en 1775.",
    personnages: [
      { name: 'Thomas Jefferson', role: 'Principal rédacteur de la Déclaration' },
      { name: 'George Washington', role: 'Commandant de l’armée continentale' },
      { name: 'Benjamin Franklin', role: 'Diplomate en France' },
      { name: 'La Fayette', role: 'Officier français volontaire' },
    ],
    deroulement:
      "Le 4 juillet 1776, le Congrès continental adopte la Déclaration d'indépendance, qui affirme des droits inaliénables. La guerre se poursuit ; l'alliance avec la France (1778) est décisive, notamment lors de la victoire de Yorktown (1781). Le traité de Paris (1783) reconnaît l'indépendance.",
    consequences:
      "Naissance d'une république fédérale dotée d'une Constitution (1787). Le coût de la guerre aggrave la crise financière de la monarchie française.",
    heritage:
      "La Déclaration inspire les révolutions atlantiques, mais ses principes coexistent avec l'esclavage et la dépossession des Amérindiens, contradiction au cœur de l'histoire américaine.",
    lienActualite: { text: 'L’alliance franco-américaine, la plus ancienne des États-Unis, reste une référence diplomatique.', dossierId: 'etats-unis' },
    keywords: ['etats unis', 'independance', 'revolution', 'colonies'],
    sources: [wp('Déclaration d\'indépendance des États-Unis'), wp('Guerre d\'indépendance des États-Unis')],
  },
  {
    id: 'bastille-1789',
    title: 'La prise de la Bastille',
    dateLabel: '14 juillet 1789',
    year: 1789,
    monthDay: '07-14',
    period: 'revolutions',
    type: 'revolution',
    civilisation: 'France',
    countries: ['FRA'],
    contexte:
      "La monarchie française est en crise financière. Louis XVI convoque les États généraux en mai 1789 ; les députés du tiers état se proclament Assemblée nationale (17 juin) et jurent de donner une Constitution au pays (serment du Jeu de paume). Le renvoi du ministre Necker et la concentration de troupes autour de Paris inquiètent la population.",
    personnages: [
      { name: 'Louis XVI', role: 'Roi de France' },
      { name: 'Bernard-René de Launay', role: 'Gouverneur de la Bastille' },
      { name: 'Camille Desmoulins', role: 'Journaliste et orateur' },
    ],
    deroulement:
      "Le 14 juillet, après avoir pris des armes aux Invalides, des Parisiens se rendent à la Bastille, forteresse et prison royale, pour y chercher de la poudre. Après des combats, la forteresse capitule ; le gouverneur est tué.",
    consequences:
      "Le roi recule. L'abolition des privilèges (4 août) et la Déclaration des droits de l'homme et du citoyen (26 août 1789) suivent. La monarchie absolue s'effondre ; la République est proclamée en 1792.",
    heritage:
      "Le 14 juillet est la fête nationale française depuis 1880 (en référence aussi à la fête de la Fédération de 1790). La Révolution a diffusé les idées de souveraineté nationale et de droits de l'homme dans le monde.",
    keywords: ['revolution francaise', 'bastille', 'droits de l homme'],
    sources: [wp('Prise de la Bastille'), wp('Révolution française')],
  },
  {
    id: 'revolution-octobre',
    title: "La révolution d'Octobre",
    dateLabel: '7 novembre 1917 (25 octobre du calendrier julien)',
    year: 1917,
    monthDay: '11-07',
    period: 'revolutions',
    type: 'revolution',
    civilisation: 'Russie',
    countries: ['RUS'],
    contexte:
      "Épuisée par la guerre, la Russie connaît en février 1917 une révolution qui renverse le tsar Nicolas II. Le gouvernement provisoire poursuit la guerre et peine à répondre aux revendications (paix, terre, pain). Les bolcheviks gagnent en influence dans les soviets.",
    personnages: [
      { name: 'Lénine', role: 'Chef des bolcheviks' },
      { name: 'Léon Trotski', role: 'Organisateur de l’insurrection' },
      { name: 'Alexandre Kerenski', role: 'Chef du gouvernement provisoire' },
    ],
    deroulement:
      "Dans la nuit du 24 au 25 octobre (calendrier julien), les gardes rouges prennent les points stratégiques de Petrograd puis le palais d'Hiver. Le congrès des soviets proclame le pouvoir des soviets.",
    consequences:
      "Les bolcheviks signent la paix de Brest-Litovsk avec l'Allemagne (1918), dissolvent l'Assemblée constituante et l'emportent dans une guerre civile très meurtrière (1918-1921). L'URSS est créée en 1922.",
    heritage:
      "La révolution donne naissance au premier État communiste et à un modèle qui s'étendra au XXe siècle, avec un très lourd bilan humain (terreur, famines, goulag).",
    lienActualite: { text: "La mémoire de l'URSS et de son effondrement nourrit la politique étrangère de la Russie actuelle.", dossierId: 'russie-ukraine' },
    keywords: ['russie', 'bolcheviks', 'lenine', 'communisme'],
    sources: [wp('Révolution d\'Octobre'), wp('Lénine')],
  },
  // — Guerres napoléoniennes
  {
    id: 'austerlitz-1805',
    title: "La bataille d'Austerlitz",
    dateLabel: '2 décembre 1805',
    year: 1805,
    monthDay: '12-02',
    period: 'napoleon',
    type: 'bataille',
    civilisation: 'Empire français / Autriche / Russie',
    countries: ['FRA', 'AUT', 'RUS', 'CZE'],
    contexte:
      "Napoléon, sacré empereur le 2 décembre 1804, fait face à la troisième coalition (Royaume-Uni, Autriche, Russie). La flotte franco-espagnole vient d'être détruite à Trafalgar (21 octobre 1805), mais la Grande Armée a capturé une armée autrichienne à Ulm.",
    personnages: [
      { name: 'Napoléon Ier', role: 'Empereur des Français' },
      { name: 'Alexandre Ier', role: 'Tsar de Russie' },
      { name: 'François II', role: "Empereur d'Autriche" },
      { name: 'Davout', role: 'Maréchal français' },
    ],
    deroulement:
      "En Moravie (actuelle Tchéquie), Napoléon dégarnit volontairement son aile droite et abandonne le plateau de Pratzen pour inciter les Austro-Russes à l'attaquer. Lorsque ceux-ci s'y engagent, il lance une attaque au centre, s'empare du plateau et coupe l'armée ennemie en deux.",
    consequences:
      "L'Autriche signe la paix de Presbourg ; la troisième coalition est dissoute. Le Saint-Empire romain germanique disparaît en 1806.",
    heritage:
      "Austerlitz est étudiée dans les écoles militaires comme un modèle de manœuvre et de tromperie. La bataille, dite « des Trois Empereurs », a eu lieu le jour anniversaire du sacre.",
    keywords: ['napoleon', 'bataille', 'empire', 'strategie'],
    sources: [wp('Bataille d\'Austerlitz'), wp('Troisième Coalition')],
  },
  {
    id: 'campagne-russie-1812',
    title: 'La campagne de Russie',
    dateLabel: '1812',
    year: 1812,
    period: 'napoleon',
    type: 'guerre',
    civilisation: 'Empire français / Empire russe',
    countries: ['FRA', 'RUS', 'BLR', 'LTU'],
    contexte:
      "Le tsar Alexandre Ier cesse d'appliquer le Blocus continental contre le Royaume-Uni. Napoléon réunit une armée de plusieurs centaines de milliers d'hommes venus de toute l'Europe pour le contraindre.",
    personnages: [
      { name: 'Napoléon Ier', role: 'Empereur des Français' },
      { name: 'Koutouzov', role: 'Commandant en chef russe' },
      { name: 'Alexandre Ier', role: 'Tsar de Russie' },
    ],
    deroulement:
      "La Grande Armée franchit le Niémen en juin 1812. Les Russes reculent en pratiquant la terre brûlée. La bataille de la Moskova (Borodino), le 7 septembre, est extrêmement meurtrière. Napoléon entre dans Moscou, incendiée, mais le tsar refuse de négocier. La retraite en hiver, harcelée par les Cosaques, tourne au désastre (passage de la Bérézina fin novembre).",
    consequences:
      "La Grande Armée est en grande partie détruite. Les puissances européennes se coalisent à nouveau ; Napoléon est vaincu à Leipzig (1813) et abdique en 1814.",
    heritage:
      "La campagne nourrit en Russie le mythe de la « guerre patriotique » et l'idée que la profondeur stratégique et l'hiver protègent le pays — idée réactivée en 1941. « Bérézina » est devenu en français synonyme de désastre.",
    lienActualite: { text: 'La profondeur stratégique reste une composante de la pensée militaire russe.', dossierId: 'russie-ukraine' },
    keywords: ['napoleon', 'russie', 'moscou', 'retraite'],
    sources: [wp('Campagne de Russie'), wp('Bataille de la Moskova')],
  },
  {
    id: 'waterloo-vienne-1815',
    title: 'Waterloo et le congrès de Vienne',
    dateLabel: '1815',
    year: 1815,
    monthDay: '06-18',
    period: 'napoleon',
    type: 'traite',
    civilisation: 'Europe',
    countries: ['FRA', 'GBR', 'AUT', 'RUS', 'DEU', 'BEL'],
    contexte:
      "Après la première abdication de Napoléon (1814), les vainqueurs se réunissent à Vienne pour réorganiser l'Europe. Napoléon s'échappe de l'île d'Elbe et reprend le pouvoir (les « Cent-Jours »).",
    personnages: [
      { name: 'Wellington', role: 'Commandant britannique' },
      { name: 'Blücher', role: 'Commandant prussien' },
      { name: 'Metternich', role: "Chancelier autrichien, hôte du congrès" },
      { name: 'Talleyrand', role: 'Représentant de la France' },
    ],
    deroulement:
      "Le 18 juin 1815, près de Bruxelles, Napoléon est vaincu à Waterloo par l'armée de Wellington et les Prussiens de Blücher. L'acte final du congrès de Vienne est signé quelques jours plus tôt, le 9 juin.",
    consequences:
      "Napoléon est exilé à Sainte-Hélène, où il meurt en 1821. Le « concert européen » des grandes puissances cherche à préserver l'équilibre et à contenir les mouvements révolutionnaires et nationaux.",
    heritage:
      "Le congrès de Vienne est souvent cité comme exemple d'ordre international fondé sur l'équilibre des puissances : il contribue à l'absence de guerre générale en Europe jusqu'en 1914, malgré des conflits limités.",
    lienActualite: { text: "Les débats actuels sur un « nouvel ordre européen de sécurité » se réfèrent parfois au modèle du concert européen." },
    keywords: ['napoleon', 'equilibre des puissances', 'congres', 'europe'],
    sources: [wp('Bataille de Waterloo'), wp('Congrès de Vienne')],
  },
  // — Première Guerre mondiale
  {
    id: 'sarajevo-1914',
    title: "L'attentat de Sarajevo et l'engrenage de 1914",
    dateLabel: '28 juin 1914',
    year: 1914,
    monthDay: '06-28',
    period: 'ww1',
    type: 'evenement',
    civilisation: 'Europe',
    countries: ['BIH', 'SRB', 'AUT', 'DEU', 'RUS', 'FRA', 'GBR'],
    contexte:
      "L'Europe est divisée en deux systèmes d'alliances : la Triple-Alliance (Allemagne, Autriche-Hongrie, Italie) et la Triple-Entente (France, Russie, Royaume-Uni). Les Balkans sont une poudrière, où s'affrontent nationalismes et ambitions austro-hongroises et russes.",
    personnages: [
      { name: 'François-Ferdinand', role: "Héritier du trône d'Autriche-Hongrie" },
      { name: 'Gavrilo Princip', role: 'Nationaliste serbe de Bosnie' },
      { name: 'Guillaume II', role: 'Empereur allemand' },
    ],
    deroulement:
      "Le 28 juin 1914, l'archiduc François-Ferdinand et son épouse sont assassinés à Sarajevo. L'Autriche-Hongrie, soutenue par l'Allemagne, adresse un ultimatum à la Serbie puis lui déclare la guerre le 28 juillet. Les mobilisations s'enchaînent ; l'Allemagne déclare la guerre à la Russie (1er août) puis à la France (3 août) ; l'invasion de la Belgique entraîne l'entrée en guerre du Royaume-Uni (4 août).",
    consequences:
      "La guerre dure quatre ans et fait environ 18 à 20 millions de morts (militaires et civils, selon les estimations). Elle entraîne la chute de quatre empires (allemand, austro-hongrois, russe, ottoman).",
    heritage:
      "La « crise de juillet » est étudiée comme un cas d'école d'escalade : alliances rigides, plans militaires préétablis, erreurs de perception. Les responsabilités du déclenchement font toujours l'objet de débats historiographiques.",
    lienActualite: { text: "Le risque d'escalade par le jeu des alliances est central dans les débats sur l'OTAN et la guerre en Ukraine.", dossierId: 'otan' },
    keywords: ['premiere guerre mondiale', 'alliances', 'balkans', 'escalade'],
    sources: [wp('Attentat de Sarajevo'), wp('Crise de juillet')],
  },
  {
    id: 'verdun-1916',
    title: 'La bataille de Verdun',
    dateLabel: '21 février – 18 décembre 1916',
    year: 1916,
    monthDay: '02-21',
    period: 'ww1',
    type: 'bataille',
    civilisation: 'France / Allemagne',
    countries: ['FRA', 'DEU'],
    contexte:
      "Le front occidental est figé depuis fin 1914 dans une guerre de tranchées. Le commandement allemand (Falkenhayn) lance une offensive sur le saillant de Verdun.",
    personnages: [
      { name: 'Erich von Falkenhayn', role: 'Chef d’état-major allemand' },
      { name: 'Philippe Pétain', role: 'Commandant de la défense de Verdun (1916)' },
      { name: 'Robert Nivelle', role: 'Général, successeur de Pétain à Verdun' },
    ],
    deroulement:
      "Après un bombardement massif, les Allemands progressent puis s'enlisent. L'armée française organise une rotation des unités et un ravitaillement par la « Voie sacrée ». Les forts de Douaumont et de Vaux changent de mains. À la fin de l'année, les Français ont repris l'essentiel du terrain perdu.",
    consequences:
      "Les pertes cumulées (tués, blessés, disparus) sont estimées à plus de 700 000 hommes pour les deux camps. Aucun objectif stratégique décisif n'est atteint.",
    heritage:
      "Verdun est devenue le symbole de la guerre d'usure et de la souffrance des combattants. La poignée de main entre François Mitterrand et Helmut Kohl à Douaumont (1984) symbolise la réconciliation franco-allemande.",
    lienActualite: { text: "La guerre d'usure et de tranchées est revenue sur le front ukrainien.", dossierId: 'russie-ukraine' },
    keywords: ['premiere guerre mondiale', 'verdun', 'usure', 'tranchees'],
    sources: [wp('Bataille de Verdun'), wp('Voie sacrée')],
  },
  {
    id: 'versailles-1919',
    title: 'Le traité de Versailles',
    dateLabel: '28 juin 1919',
    year: 1919,
    monthDay: '06-28',
    period: 'ww1',
    type: 'traite',
    civilisation: 'Europe',
    countries: ['FRA', 'DEU', 'GBR', 'USA'],
    contexte:
      "L'armistice du 11 novembre 1918 met fin aux combats. À la conférence de la paix de Paris, les vainqueurs négocient les traités avec les vaincus ; l'Allemagne n'est pas associée aux négociations.",
    personnages: [
      { name: 'Georges Clemenceau', role: 'Président du Conseil français' },
      { name: 'Woodrow Wilson', role: 'Président des États-Unis' },
      { name: 'David Lloyd George', role: 'Premier ministre britannique' },
    ],
    deroulement:
      "Le traité est signé dans la galerie des Glaces, cinq ans jour pour jour après l'attentat de Sarajevo. L'Allemagne perd l'Alsace-Moselle et ses colonies, voit son armée limitée, la Rhénanie démilitarisée, et l'article 231 lui attribue la responsabilité de la guerre, fondement des réparations.",
    consequences:
      "Le traité crée la Société des Nations, que les États-Unis ne rejoindront pas. Il est vécu en Allemagne comme un « diktat », ce que la propagande nationaliste exploitera.",
    heritage:
      "L'historiographie récente nuance l'idée d'un traité qui aurait « causé » la Seconde Guerre mondiale : les choix politiques des années 1930 (crise, nazisme, politique d'apaisement) furent déterminants. Le débat entre paix punitive et paix de réconciliation reste d'actualité.",
    lienActualite: { text: 'Les conditions d’un règlement de paix durable (garanties, réparations, frontières) sont au cœur des discussions sur l’Ukraine.', dossierId: 'russie-ukraine' },
    keywords: ['traite', 'paix', 'reparations', 'societe des nations'],
    sources: [wp('Traité de Versailles'), wp('Conférence de paix de Paris (1919)')],
  },
  // — Seconde Guerre mondiale
  {
    id: 'munich-1938',
    title: 'Les accords de Munich',
    dateLabel: '30 septembre 1938',
    year: 1938,
    monthDay: '09-30',
    period: 'ww2',
    type: 'traite',
    civilisation: 'Europe',
    countries: ['DEU', 'FRA', 'GBR', 'ITA', 'CZE'],
    contexte:
      "Hitler revendique les Sudètes, région de Tchécoslovaquie peuplée majoritairement d'Allemands. Après l'annexion de l'Autriche (mars 1938), la menace de guerre grandit.",
    personnages: [
      { name: 'Adolf Hitler', role: 'Chancelier du Reich' },
      { name: 'Neville Chamberlain', role: 'Premier ministre britannique' },
      { name: 'Édouard Daladier', role: 'Président du Conseil français' },
      { name: 'Benito Mussolini', role: 'Chef du gouvernement italien' },
    ],
    deroulement:
      "Les quatre dirigeants acceptent, sans consulter la Tchécoslovaquie, la cession des Sudètes à l'Allemagne. Chamberlain affirme à son retour avoir obtenu « la paix pour notre temps ».",
    consequences:
      "En mars 1939, Hitler occupe le reste de la Bohême-Moravie. L'invasion de la Pologne le 1er septembre 1939 déclenche la guerre.",
    heritage:
      "« Munich » est devenu le symbole de l'échec de la politique d'apaisement face à un régime expansionniste, argument souvent invoqué — parfois abusivement — dans les débats sur les concessions territoriales.",
    lienActualite: { text: "La « leçon de Munich » est fréquemment invoquée à propos de la guerre en Ukraine.", dossierId: 'russie-ukraine' },
    keywords: ['apaisement', 'hitler', 'tchecoslovaquie', 'concessions'],
    sources: [wp('Accords de Munich'), wp('Politique d\'apaisement')],
  },
  {
    id: 'stalingrad',
    title: 'La bataille de Stalingrad',
    dateLabel: 'Juillet 1942 – 2 février 1943',
    year: 1943,
    monthDay: '02-02',
    period: 'ww2',
    type: 'bataille',
    civilisation: 'URSS / Allemagne nazie',
    countries: ['RUS', 'DEU'],
    contexte:
      "Après l'échec devant Moscou (1941), l'Allemagne lance en 1942 une offensive vers le Caucase et ses champs pétroliers, et vers Stalingrad, sur la Volga.",
    personnages: [
      { name: 'Friedrich Paulus', role: 'Commandant de la 6e armée allemande' },
      { name: 'Gueorgui Joukov', role: 'Maréchal soviétique' },
      { name: 'Vassili Tchouïkov', role: 'Commandant de la défense de la ville' },
    ],
    deroulement:
      "Les combats urbains sont d'une violence extrême. En novembre 1942, l'opération soviétique Uranus encercle la 6e armée. Malgré les ordres de Hitler, Paulus capitule le 2 février 1943.",
    consequences:
      "Stalingrad marque un tournant de la guerre à l'Est : l'Armée rouge prend durablement l'initiative. Les pertes de la bataille se comptent en centaines de milliers de morts de chaque côté, civils compris.",
    heritage:
      "La victoire occupe une place centrale dans la mémoire soviétique puis russe de la « Grande Guerre patriotique ».",
    lienActualite: { text: 'La mémoire de la Seconde Guerre mondiale est mobilisée par le pouvoir russe pour justifier son action en Ukraine.', dossierId: 'russie-ukraine' },
    keywords: ['seconde guerre mondiale', 'urss', 'front de l est', 'tournant'],
    sources: [wp('Bataille de Stalingrad'), wp('Opération Uranus')],
  },
  {
    id: 'debarquement-1944',
    title: 'Le débarquement de Normandie',
    dateLabel: '6 juin 1944',
    year: 1944,
    monthDay: '06-06',
    period: 'ww2',
    type: 'bataille',
    civilisation: 'Alliés / Allemagne nazie',
    countries: ['FRA', 'USA', 'GBR', 'CAN', 'DEU'],
    contexte:
      "Staline réclame depuis 1942 l'ouverture d'un second front à l'Ouest. Les Alliés préparent pendant des mois l'opération Overlord, en trompant l'Allemagne sur le lieu du débarquement (opération Fortitude).",
    personnages: [
      { name: 'Dwight Eisenhower', role: 'Commandant suprême allié' },
      { name: 'Bernard Montgomery', role: 'Commandant des forces terrestres' },
      { name: 'Erwin Rommel', role: 'Commandant allemand du mur de l’Atlantique' },
      { name: 'Charles de Gaulle', role: 'Chef de la France libre' },
    ],
    deroulement:
      "Le 6 juin 1944, après des parachutages nocturnes, plus de 150 000 soldats débarquent sur cinq plages (Utah, Omaha, Gold, Juno, Sword). Les pertes sont lourdes à Omaha Beach. La bataille de Normandie dure jusqu'à fin août.",
    consequences:
      "Paris est libérée le 25 août 1944. Avec l'avancée soviétique à l'Est, l'Allemagne est prise en tenaille ; elle capitule le 8 mai 1945.",
    heritage:
      "Le « D-Day » est la plus grande opération amphibie de l'histoire et un symbole de l'alliance transatlantique, commémoré chaque année.",
    keywords: ['seconde guerre mondiale', 'liberation', 'allies', 'normandie'],
    sources: [wp('Débarquement de Normandie'), wp('Opération Overlord')],
  },
  {
    id: 'hiroshima-1945',
    title: 'Hiroshima et Nagasaki',
    dateLabel: '6 et 9 août 1945',
    year: 1945,
    monthDay: '08-06',
    period: 'ww2',
    type: 'evenement',
    civilisation: 'Japon / États-Unis',
    countries: ['JPN', 'USA'],
    contexte:
      "En 1945, le Japon refuse la capitulation sans condition malgré les bombardements et le blocus. Les États-Unis disposent depuis juillet de la bombe atomique, mise au point dans le cadre du projet Manhattan.",
    personnages: [
      { name: 'Harry Truman', role: 'Président des États-Unis' },
      { name: 'Hirohito', role: 'Empereur du Japon' },
      { name: 'Robert Oppenheimer', role: 'Directeur scientifique du laboratoire de Los Alamos' },
    ],
    deroulement:
      "Le 6 août 1945, une bombe atomique détruit Hiroshima ; le 9 août, une seconde frappe Nagasaki. Entre-temps, l'URSS déclare la guerre au Japon (8 août). Le Japon annonce sa capitulation le 15 août et la signe le 2 septembre.",
    consequences:
      "Les bombardements tuent plus de 100 000 personnes sur le coup, et bien davantage d'ici la fin de 1945 selon les estimations. L'ère nucléaire commence ; l'URSS teste sa bombe en 1949.",
    heritage:
      "Le rôle exact des bombes dans la capitulation japonaise, par rapport à l'entrée en guerre soviétique, fait débat parmi les historiens. Le « tabou nucléaire » (non-emploi depuis 1945) est un pilier de la sécurité internationale.",
    lienActualite: { text: 'La dissuasion nucléaire et la non-prolifération restent au cœur des tensions avec l’Iran et la Russie.', dossierId: 'iran-golfe-ormuz' },
    keywords: ['nucleaire', 'japon', 'bombe atomique', 'dissuasion'],
    sources: [wp('Bombardements atomiques d\'Hiroshima et Nagasaki'), wp('Projet Manhattan')],
  },
  // — Guerre froide
  {
    id: 'algerie-1954',
    title: "La guerre d'Algérie",
    dateLabel: '1er novembre 1954 – 1962',
    year: 1954,
    monthDay: '11-01',
    period: 'guerre-froide',
    type: 'guerre',
    civilisation: 'France / Algérie',
    countries: ['FRA', 'DZA'],
    contexte:
      "L'Algérie, conquise à partir de 1830, est juridiquement rattachée à la France sous forme de départements. La population musulmane, majoritaire, est privée de l'égalité des droits ; les réformes échouent. Le massacre de Sétif (mai 1945) marque durablement les esprits.",
    personnages: [
      { name: 'Charles de Gaulle', role: 'Président de la République à partir de 1959' },
      { name: 'Ahmed Ben Bella', role: 'Dirigeant du FLN' },
      { name: 'Guy Mollet', role: 'Président du Conseil (1956-1957)' },
    ],
    deroulement:
      "Le 1er novembre 1954, le FLN lance une série d'attentats (« Toussaint rouge »). La France envoie le contingent. La guerre est marquée par des violences contre les civils de part et d'autre, la torture pratiquée par l'armée française et des attentats. La crise de mai 1958 ramène de Gaulle au pouvoir. Les accords d'Évian (18 mars 1962) conduisent à l'indépendance, proclamée le 5 juillet 1962.",
    consequences:
      "Près d'un million de pieds-noirs quittent l'Algérie ; les harkis sont abandonnés ou victimes de représailles. Le conflit a fait plusieurs centaines de milliers de morts (les chiffres font débat). Il a fait chuter la IVe République.",
    heritage:
      "La mémoire de la guerre reste conflictuelle des deux côtés de la Méditerranée et pèse sur les relations franco-algériennes.",
    lienActualite: { text: 'Les relations franco-algériennes, marquées par cette mémoire, connaissent des crises récurrentes.' },
    keywords: ['decolonisation', 'algerie', 'france', 'fln'],
    sources: [wp('Guerre d\'Algérie'), wp('Accords d\'Évian')],
  },
  {
    id: 'cuba-1962',
    title: 'La crise des missiles de Cuba',
    dateLabel: '14 – 28 octobre 1962',
    year: 1962,
    monthDay: '10-14',
    period: 'guerre-froide',
    type: 'evenement',
    civilisation: 'États-Unis / URSS',
    countries: ['USA', 'RUS', 'CUB', 'TUR'],
    contexte:
      "Après la révolution cubaine (1959) et l'échec du débarquement de la baie des Cochons (1961), Cuba se rapproche de l'URSS. Les États-Unis ont déployé des missiles nucléaires en Turquie et en Italie.",
    personnages: [
      { name: 'John F. Kennedy', role: 'Président des États-Unis' },
      { name: 'Nikita Khrouchtchev', role: 'Dirigeant soviétique' },
      { name: 'Fidel Castro', role: 'Dirigeant cubain' },
    ],
    deroulement:
      "Le 14 octobre 1962, un avion espion U-2 photographie des sites de missiles soviétiques à Cuba. Kennedy décrète une « quarantaine » navale. Après treize jours de tension extrême, Khrouchtchev accepte de retirer les missiles contre l'engagement américain de ne pas envahir Cuba et, secrètement, le retrait des missiles américains de Turquie.",
    consequences:
      "Un « téléphone rouge » est installé entre Washington et Moscou (1963), et le traité d'interdiction partielle des essais nucléaires est signé la même année. C'est le début d'une phase de détente.",
    heritage:
      "La crise est considérée comme le moment où le monde a été le plus proche d'une guerre nucléaire ; elle est un cas d'école de gestion de crise et de communication entre adversaires.",
    lienActualite: { text: 'La gestion des risques d’escalade nucléaire reste un enjeu majeur entre la Russie et l’OTAN.', dossierId: 'otan' },
    keywords: ['guerre froide', 'nucleaire', 'crise', 'dissuasion'],
    sources: [wp('Crise des missiles de Cuba'), wp('Téléphone rouge')],
  },
  {
    id: 'mur-berlin-1989',
    title: 'La chute du mur de Berlin',
    dateLabel: '9 novembre 1989',
    year: 1989,
    monthDay: '11-09',
    period: 'guerre-froide',
    type: 'evenement',
    civilisation: 'Allemagne / Europe',
    countries: ['DEU', 'RUS', 'POL', 'HUN'],
    contexte:
      "Construit en 1961 par la RDA pour stopper l'exode vers l'Ouest, le mur symbolise la division de l'Europe. À la fin des années 1980, les réformes de Gorbatchev (perestroïka, glasnost) et le refus de Moscou d'intervenir militairement encouragent les mouvements d'opposition en Europe de l'Est (Solidarność en Pologne). La Hongrie ouvre sa frontière avec l'Autriche en 1989.",
    personnages: [
      { name: 'Mikhaïl Gorbatchev', role: 'Dirigeant soviétique' },
      { name: 'Helmut Kohl', role: "Chancelier de RFA" },
      { name: 'Günter Schabowski', role: 'Porte-parole du régime est-allemand' },
    ],
    deroulement:
      "Le 9 novembre 1989, lors d'une conférence de presse confuse, Günter Schabowski annonce l'ouverture des frontières « immédiatement ». Des milliers de Berlinois de l'Est se pressent aux postes-frontières, qui finissent par ouvrir dans la nuit.",
    consequences:
      "Les régimes communistes d'Europe de l'Est tombent en quelques mois. L'Allemagne est réunifiée le 3 octobre 1990. L'URSS se dissout en décembre 1991.",
    heritage:
      "La chute du mur marque la fin de la guerre froide en Europe. Les débats sur les promesses faites ou non à Moscou concernant l'élargissement de l'OTAN restent vifs.",
    lienActualite: { text: "Le récit russe d'une « trahison » occidentale après 1989 est au cœur de la confrontation actuelle avec l'OTAN.", dossierId: 'otan' },
    keywords: ['guerre froide', 'berlin', 'reunification', 'communisme'],
    sources: [wp('Chute du mur de Berlin'), wp('Mur de Berlin')],
  },
  // — Histoire contemporaine
  {
    id: 'fin-urss-1991',
    title: "La dislocation de l'URSS",
    dateLabel: '26 décembre 1991',
    year: 1991,
    monthDay: '12-26',
    period: 'contemporain',
    type: 'evenement',
    civilisation: 'URSS',
    countries: ['RUS', 'UKR', 'BLR', 'KAZ', 'EST', 'LVA', 'LTU'],
    contexte:
      "L'URSS est affaiblie par la crise économique, la guerre d'Afghanistan et la montée des nationalismes dans les républiques. Le putsch manqué des conservateurs en août 1991 accélère la désintégration.",
    personnages: [
      { name: 'Mikhaïl Gorbatchev', role: "Président de l'URSS" },
      { name: 'Boris Eltsine', role: 'Président de la Russie' },
      { name: 'Leonid Kravtchouk', role: "Président de l'Ukraine" },
    ],
    deroulement:
      "Après le référendum d'indépendance ukrainien du 1er décembre 1991, les dirigeants russe, ukrainien et biélorusse signent les accords de Minsk/Belovej (8 décembre), qui créent la Communauté des États indépendants. Gorbatchev démissionne le 25 décembre ; l'URSS cesse d'exister le 26.",
    consequences:
      "Quinze États indépendants naissent. La Russie hérite du siège soviétique au Conseil de sécurité et de l'arsenal nucléaire. Des millions de Russes se retrouvent hors de Russie.",
    heritage:
      "Le président russe Vladimir Poutine a qualifié en 2005 la fin de l'URSS de « plus grande catastrophe géopolitique » du XXe siècle, formule souvent citée pour éclairer sa politique.",
    lienActualite: { text: "Les conflits en Ukraine, en Géorgie ou dans le Caucase s'inscrivent dans la longue sortie d'empire de l'espace post-soviétique.", dossierId: 'russie-ukraine' },
    keywords: ['urss', 'russie', 'ukraine', 'fin de la guerre froide'],
    sources: [wp('Dislocation de l\'URSS'), wp('Accords de Minsk (1991)')],
  },
  {
    id: '11-septembre-2001',
    title: 'Les attentats du 11 septembre 2001',
    dateLabel: '11 septembre 2001',
    year: 2001,
    monthDay: '09-11',
    period: 'contemporain',
    type: 'evenement',
    civilisation: 'États-Unis',
    countries: ['USA', 'AFG', 'IRQ'],
    contexte:
      "Al-Qaïda, organisation jihadiste dirigée par Oussama ben Laden et installée en Afghanistan sous la protection des talibans, a déjà frappé des intérêts américains (ambassades au Kenya et en Tanzanie en 1998).",
    personnages: [
      { name: 'Oussama ben Laden', role: "Chef d'Al-Qaïda" },
      { name: 'George W. Bush', role: 'Président des États-Unis' },
    ],
    deroulement:
      "Dix-neuf terroristes détournent quatre avions de ligne. Deux percutent les tours du World Trade Center à New York, un le Pentagone ; le quatrième s'écrase en Pennsylvanie après la révolte des passagers. Près de 3 000 personnes sont tuées.",
    consequences:
      "Les États-Unis lancent la « guerre contre le terrorisme » : intervention en Afghanistan (2001), puis guerre d'Irak (2003) sur la base d'accusations d'armes de destruction massive qui se révéleront infondées. L'OTAN invoque pour la première fois l'article 5.",
    heritage:
      "Le 11-Septembre a transformé les politiques de sécurité (renseignement, surveillance, sécurité aérienne) et ouvert deux décennies d'interventions dont le bilan est très débattu ; les talibans reprennent Kaboul en 2021.",
    lienActualite: { text: 'La menace terroriste et la question des interventions extérieures restent au cœur des politiques de sécurité.', dossierId: 'otan' },
    keywords: ['terrorisme', 'al qaida', 'etats unis', 'afghanistan'],
    sources: [wp('Attentats du 11 septembre 2001'), wp('Guerre d\'Afghanistan (2001-2021)')],
  },
  {
    id: 'printemps-arabe',
    title: 'Les printemps arabes',
    dateLabel: 'Décembre 2010 – 2011',
    year: 2011,
    monthDay: '12-17',
    period: 'contemporain',
    type: 'revolution',
    civilisation: 'Monde arabe',
    countries: ['TUN', 'EGY', 'LBY', 'SYR', 'YEM'],
    contexte:
      "Régimes autoritaires installés depuis des décennies, chômage des jeunes, corruption et hausse des prix alimentaires alimentent un profond mécontentement dans le monde arabe.",
    personnages: [
      { name: 'Mohamed Bouazizi', role: "Vendeur ambulant tunisien dont l'immolation déclenche la révolte" },
      { name: 'Zine el-Abidine Ben Ali', role: 'Président tunisien renversé' },
      { name: 'Hosni Moubarak', role: 'Président égyptien renversé' },
      { name: 'Bachar el-Assad', role: 'Président syrien' },
    ],
    deroulement:
      "L'immolation de Mohamed Bouazizi le 17 décembre 2010 à Sidi Bouzid déclenche des manifestations : Ben Ali fuit le 14 janvier 2011, Moubarak démissionne le 11 février. En Libye, l'intervention de l'OTAN contribue à la chute de Kadhafi. En Syrie, la répression débouche sur une guerre civile.",
    consequences:
      "Les trajectoires divergent : transition démocratique fragile en Tunisie (remise en cause depuis 2021), retour d'un pouvoir militaire en Égypte (2013), guerres civiles en Libye, en Syrie et au Yémen, essor de l'État islamique, crise migratoire de 2015.",
    heritage:
      "Les printemps arabes ont montré à la fois l'aspiration démocratique des sociétés et la résilience des appareils autoritaires. Le régime Assad est finalement tombé en décembre 2024.",
    lienActualite: { text: 'Les conséquences de ces bouleversements pèsent encore sur la Libye, la Syrie et le Sahel.', dossierId: 'sahel' },
    keywords: ['revolution', 'monde arabe', 'tunisie', 'syrie', 'egypte'],
    sources: [wp('Printemps arabe'), wp('Révolution tunisienne')],
  },
];

export const HISTORY_BY_ID: Record<string, HistoryFiche> = Object.fromEntries(HISTORY.map((h) => [h.id, h]));
