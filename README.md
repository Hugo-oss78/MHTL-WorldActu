# ATLAS — actualité, géopolitique, histoire

Application web personnelle (PWA installable sur iPhone) pour suivre l'actualité mondiale avec un **recoupement des sources**, comprendre la géopolitique et construire une culture historique par des fiches, chronologies, cartes et quiz à **répétition espacée**.

Gratuite, sans compte, sans abonnement, sans clé d'API obligatoire.

---

## 1. Architecture

```
GitHub Actions (toutes les 3 h, gratuit)            GitHub Pages (hébergement statique gratuit)
┌────────────────────────────────────────┐          ┌──────────────────────────────────────┐
│ pipeline/run.ts                        │          │ Application React (PWA)              │
│  • lit ~35 flux RSS publics            │  JSON    │  • lit data/latest.json              │
│  • regroupe les articles par événement │ ───────► │  • progression stockée dans le       │
│  • calcule la fiabilité (recoupement)  │          │    navigateur (localStorage)         │
│  • sélectionne le briefing du jour     │          │  • hors ligne : service worker       │
│  • données pays : Wikidata + Banque    │          └──────────────────────────────────────┘
│    mondiale (hebdomadaire)             │
│  • historique → branche « data »       │
└────────────────────────────────────────┘
```

| Choix | Pourquoi |
|---|---|
| React + TypeScript + Vite + Tailwind CSS | Demandé, rapide, typé |
| `vite-plugin-pwa` | Installation sur l'écran d'accueil, fonctionnement hors ligne |
| **GitHub Actions** au lieu de Cloudflare Workers | Aucun compte supplémentaire ; tâches planifiées gratuites ; les données sont des fichiers statiques versionnés (historique des briefings conservé dans Git) |
| **GitHub Pages** | Hébergement statique gratuit, HTTPS |
| Pas de base de données serveur | Progression personnelle dans le navigateur, exportable en JSON |
| Carte : `d3-geo` + `world-atlas` (Natural Earth) | Embarquée, sans service de tuiles ni quota |

**Aucun secret n'est présent dans le navigateur.** Le seul jeton utilisé (`GITHUB_TOKEN`) est fourni automatiquement par GitHub Actions côté serveur.

## 2. Fonctionnalités

- **Accueil — briefing quotidien** : l'essentiel (jusqu'à 10 sujets, vue « En bref » avec drapeaux et sources ou vue détaillée, bouton « Partager le briefing »), décryptage géopolitique du jour (choisi selon l'actualité), histoire du jour (anniversaire ou rotation des 9 périodes), concept à connaître (avec articles du jour liés), quiz de 5 questions, « Ce jour-là » (Wikipédia).
- **Actualité** : fil par région (France, Europe, Moyen-Orient, Amériques, Asie, Afrique, Défense et sécurité, Économie mondiale), filtres par période (24 h / 48 h / 7 jours) et thématique, recherche, carte interactive.
- **Chaque sujet** : titre, résumé, date et heure, lieux, acteurs, thématiques, « pourquoi c'est important », « conséquences possibles » (signalées comme analyse), **indicateur de fiabilité**, nature de chaque titre (fait, déclaration, accusation, hypothèse), toutes les sources avec liens, liens vérifiés.
- **Géopolitique** : 19 dossiers en 8 parties (situation, histoire, acteurs, intérêts, alliances, rapports de force, scénarios, conséquences pour l'Europe et la France) + chronologie + actualité liée ; ~130 fiches pays (régime, dirigeants, population, économie, forces armées, alliances) **datées et sourcées** (Wikidata, Banque mondiale / SIPRI / IISS).
- **Histoire** : 28 fiches de l'Antiquité à nos jours, filtres (époque, civilisation, pays, type), chronologie interactive, passerelles vers l'actualité.
- **Culture générale** : 33 fiches (dirigeants, philosophes, stratèges, économistes, doctrines, institutions, religions, inventions) et 30 concepts.
- **Progression** : niveau (Débutant → Expert) calculé **uniquement sur les résultats aux quiz**, tableau de bord, thématiques maîtrisées / à approfondir, révisions espacées (Leitner : 1, 3, 7, 14, 30 jours), quiz hebdomadaire, favoris, articles lus, fiches étudiées, sujets à revoir, historique.
- **Comprendre davantage** : recherche dans la bibliothèque ATLAS (sans IA) ; IA facultative à connecter soi-même.
- **Données** : export / import JSON, suppression complète. Mode clair / sombre, taille du texte.

## 3. Fiabilité de l'information — ce que fait réellement ATLAS

1. Regroupement des articles d'un même événement (similarité des titres, entités : pays, organisations, dirigeants, nombres ; aussi entre français et anglais).
2. **Origines indépendantes** : deux médias d'un même groupe (France 24 / RFI) = 1 origine ; plusieurs médias citant la même agence (« avec AFP ») = 1 origine ; textes quasi identiques = même dépêche.
3. Niveaux : *Confirmé* (≥ 3 origines), *Corroboré partiellement* (2), *Non confirmé* (1), *Informations contradictoires* (bilans chiffrés divergents), *Analyse ou hypothèse* (think tanks).
4. Nature de chaque titre détectée à sa formulation (conditionnel, « accuse », « selon »…).
5. Les médias affiliés à un État (Al Jazeera, Tehran Times…) et les sources institutionnelles (ONU, OTAN) sont signalés.

**Limites** : c'est un recoupement *statistique*, pas une vérification du fond ; les regroupements peuvent parfois se tromper. Reuters, AP et AFP n'ont pas de flux publics gratuits (leurs dépêches sont détectées quand elles sont citées). Sans IA, les résumés sont les extraits fournis par les médias et les articles anglais restent en anglais. Les dossiers et fiches ont été rédigés à partir de connaissances arrêtées mi-2026 et l'indiquent.

## 4. Installation locale

Prérequis : Node.js 20 ou plus.

```bash
npm install
npm run pipeline      # récupère les vraies données dans public/data (accès Internet requis)
npm run dev           # http://localhost:5173
npm test              # tests unitaires
npm run build         # version de production dans dist/
```

## 5. Déploiement gratuit (GitHub Pages)

1. Fusionnez ce code dans la branche **`main`** (les tâches planifiées ne s'exécutent que depuis la branche par défaut).
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : « GitHub Actions »**.
3. Onglet **Actions** → « ATLAS — actualisation et déploiement » → **Run workflow** pour la première actualisation.
4. L'application est publiée à `https://<utilisateur>.github.io/<dépôt>/`.
5. Sur iPhone : ouvrez l'adresse dans **Safari** → bouton Partager → **« Sur l'écran d'accueil »**.

Ensuite, tout est automatique : actualisation toutes les 3 heures, historique conservé sur la branche `data`, données pays et vérification des liens éditoriaux chaque semaine.

**Actualisation manuelle** : le bouton « Actualiser » de l'application recharge les dernières données publiées. Pour forcer une nouvelle collecte, utilisez « Run workflow » dans l'onglet Actions (le déclencher depuis le navigateur exigerait d'y placer un jeton secret, ce qui est exclu).

### Alternative : Cloudflare Pages

Si votre dépôt est privé avec un compte GitHub gratuit (GitHub Pages n'est alors pas disponible), connectez le dépôt à **Cloudflare Pages** (offre gratuite, sans carte bancaire à ma connaissance — à vérifier) avec la branche `data` comme source de données, ou adaptez la dernière étape du workflow avec `wrangler pages deploy dist`. Cela nécessite un jeton Cloudflare stocké dans les *Secrets* GitHub (jamais dans le code).

## 6. Services utilisés et limites des offres gratuites

| Service | Usage | Limites (à vérifier, elles évoluent) |
|---|---|---|
| GitHub Actions | Pipeline toutes les 3 h | Illimité pour un dépôt public ; ~2 000 min/mois pour un dépôt privé gratuit (ATLAS utilise environ 1 à 3 min par passage). Les tâches planifiées peuvent être retardées aux heures chargées, et GitHub les désactive après 60 jours sans activité du dépôt (les enregistrements de données devraient compter comme activité, je n'en suis pas certain : un clic sur « Enable workflow » suffit sinon). |
| GitHub Pages | Hébergement | Site public ; dépôt public requis sur l'offre gratuite ; ~1 Go, bande passante « souple » de 100 Go/mois. |
| Flux RSS des médias | Actualité | Usage personnel, titres + extraits + lien (pas de reprise d'articles complets). |
| Wikidata, Banque mondiale, Wikipédia | Fiches pays, « Ce jour-là » | Gratuits, sans clé. |
| GitHub Models (facultatif) | Résumés IA du briefing | Quotas gratuits limités ; désactivé par défaut. |

## 7. IA facultative

- **Résumés IA du briefing** (côté serveur) : dans *Settings → Secrets and variables → Actions → Variables*, créez `ATLAS_AI = github-models` (et éventuellement `ATLAS_AI_MODEL`). L'IA ne reçoit que les extraits des sources et ses textes sont signalés comme générés. *Non testé en conditions réelles lors du développement* : en cas d'erreur, le briefing fonctionne normalement sans IA.
- **« Comprendre davantage » avec IA** : *Progression → Réglages* ; tout fournisseur compatible OpenAI (OpenRouter, Groq, Mistral, Ollama local…). La clé reste sur votre appareil et n'est jamais exportée.

## 8. Modifier l'application

| Pour… | Fichier |
|---|---|
| Ajouter / retirer une source RSS | `pipeline/sources.ts` |
| Ajuster le regroupement ou la fiabilité | `pipeline/cluster.ts` (seuils `SAME_LANG_THRESHOLD`, `CROSS_LANG_THRESHOLD`) |
| Mots-clés des thématiques | `src/lib/classify.ts` |
| Pays et alias reconnus | `src/lib/gazetteer.ts` |
| Dossiers géopolitiques | `src/content/dossiers.ts` |
| Fiches historiques | `src/content/history.ts` |
| Concepts / culture générale | `src/content/concepts.ts`, `src/content/culture.ts` |
| Questions de quiz | `src/content/quiz.ts` (+ génération automatique depuis les fiches) |
| Fréquence d'actualisation | `.github/workflows/atlas.yml` (`cron`) |
| Couleurs et typographie | `src/index.css` |

Après une modification de contenu, `npm test` vérifie la cohérence (questions, dossiers, périodes). L'état des sources est visible dans l'application (*Accueil → État des sources*) : retirez les flux qui échouent durablement.

Test hors ligne du pipeline avec des flux d'essai (jamais déployés) :

```bash
node tests/fixtures/build.mjs
ATLAS_FIXTURES_DIR=tests/fixtures/feeds ATLAS_DATA_DIR=/tmp/atlas-test npx tsx pipeline/run.ts
```
