# Jour 3, version pratique — le guide pas à pas

Ce guide se suit à la lettre, de la veille au soir à 16h00. Pour chaque séquence : l'heure, les
slides du deck **Jour3-Prometheus-Grafana.pptx** (40 slides), ce que je dis (en citations), ce
que je fais (encadrés **Pas à pas**, sur mon Mac et dans les Codespaces), les corrections, les
pièges et les anecdotes.

**L'esprit de la journée.** Le groupe vient de l'infrastructure. On n'écrit pas de code et on
n'écrit pas de PromQL à la main : l'IA écrit la requête **et l'explique**, les stagiaires la
comprennent et la vérifient. Tout le temps gagné va dans ce qu'ils feront lundi : des tableaux
de bord, des alertes dans Teams et par e-mail, et le diagnostic d'une panne. La phrase à dire à
9h00 : **aujourd'hui, vous ne codez pas, vous pilotez.**

**Le cadre.** 9h00–16h00, déjeuner d'une heure, deux pauses d'une demi-heure : cinq heures de
travail effectif, dont environ quatre les mains sur le clavier.

## La journée en un coup d'œil

| Heure | Durée | Séquence | Slides | Modalité |
|---|---|---|---|---|
| 9h00 | 15 min | Démarrer : un Codespace sur la branche `jour3`, `./jour3.sh start` | 1 à 5 | Tous ensemble |
| 9h15 | 25 min | Les bonnes métriques (Google SRE, RED, USE), PromQL avec l'IA, échauffement | 6 à 13 | Exposé, démo, individuel |
| 9h40 | 50 min | TP A — La boutique en quatre signaux dorés (étapes 0 à 2) | 14 à 18 | Individuel |
| 10h30 | 30 min | *Pause* | | |
| 11h00 | 40 min | TP A — métier, finitions, crash test | 17 | Individuel |
| 11h40 | 30 min | TP B — Le serveur en méthode USE, import du 1860 | 19 | Individuel |
| 12h10 | 20 min | Auto-audit des dashboards, modèle de maturité | 20, 21 | Binômes |
| 12h30 | 60 min | *Déjeuner* | | |
| 13h30 | 10 min | Alerter sans épuiser les équipes | 22 à 27 | Exposé |
| 13h40 | 50 min | TP C — Prometheus, Alertmanager, Teams, Slack, e-mail | 28 à 30 | Individuel, démo Teams à la fin |
| 14h30 | 30 min | *Pause* | | |
| 15h00 | 30 min | TP D — Alerting Grafana, Teams en vrai, comparaison | 31 à 33 | Individuel puis tous ensemble |
| 15h30 | 20 min | Bonnes pratiques (2 slides), escape game « la boutique sabotée » | 34 à 38 | Binômes ou seul, jeu |
| 15h50 | 5 min | Thanos en cinq minutes | 39 | Démonstration |
| 15h55 | 5 min | Lundi matin | 40 | Tous ensemble |
| 16h00 | | Fin, ferme | | |

**Ce qui est sacrifié**, et je le dis à 9h00 comme à 15h55 : écrire l'instrumentation, écrire
du PromQL à la main, les recording rules (déjà en place), les droits Grafana, la sauvegarde, le
TP Thanos complet. Tout est dans le dépôt, avec les guides des jours 1 à 3.

**Les points de contrôle.** En retard, je coupe dans cet ordre, sans remords :

1. L'étape 5 du TP A (crash test) : en démonstration.
2. Le TP B passe à 4 panels (CPU et mémoire, utilisation et saturation), plus l'import 1860.
3. La partie 5 du TP C (silence) : démonstration de 2 minutes.
4. Le *mute timing* du TP D : je le montre.
5. Thanos : une phrase et la slide, sans démonstration.

Je ne coupe **jamais** l'escape game ni le moment où les messages arrivent dans Teams : ce sont
les deux souvenirs de la journée.

**Les supports.**

- Le deck **Jour3-Prometheus-Grafana.pptx**, 40 slides, avec le texte à dire dans les notes.
- Le **corrigé stagiaire** (`Guide-stagiaire-Jour-3-corriges.pdf`) : toutes les réponses, à
  donner à la fin de la journée.
- Le **guide stagiaire jour 3** (PDF, et Markdown pour Notion), avec à la fin une synthèse de toute
  la formation, quatre checklists de mise en production, un déroulé type et les ressources.
- La branche **`jour3`** du dépôt : tout est préconfiguré, et la télécommande `./jour3.sh` fait le
  reste (`start`, `teams`, `mystere`, `solution`, `repare`, `thanos`).

---

## La veille au soir (ou à 7h30) — 30 minutes

### Pas à pas — pousser les branches sur GitHub

Le fichier `POUSSER-JOUR3.command` est dans le dossier `…/PROMETHEUS GRAFANA/2026/` sur mon Mac.
Double-clic : il récupère le bundle et pousse les quatre branches (`jour3`, `jour3-formateur`,
`formation-2026`, `formation-2026-formateur`). Si macOS refuse de l'ouvrir : clic droit →
**Ouvrir** → **Ouvrir**. Ou bien, dans Terminal :

```bash
cd "/Users/yparent/Documents/PERSO/YSYCloud/FORMATION/PROMETHEUS GRAFANA/2026/formation-observabilite-lab"
git fetch ../formation-2026-jour3.bundle jour3:jour3 jour3-formateur:jour3-formateur formation-2026:formation-2026 formation-2026-formateur:formation-2026-formateur --update-head-ok --force
git push --force origin jour3 jour3-formateur formation-2026 formation-2026-formateur
```

Vérification sur github.com : le sélecteur de branches affiche `jour3`, qui contient `jour3.sh`
à la racine et le guide `docs/stagiaire/Guide-stagiaire-Jour-3-pratique.pdf`.

### Pas à pas — créer le workflow Teams de la salle (10 min)

C'est ce qui permettra aux stagiaires d'envoyer de vrais messages dans Teams. Je le fais sur
**mon** Teams professionnel (Sparks ou YSY Cloud), pas sur celui d'Apicil : je ne dépends pas de
leur politique de sécurité, et je projette le canal.

**Prérequis.** Un compte Teams **professionnel** (Microsoft 365) : le Teams personnel gratuit n'a
pas les workflows. L'application **Workflows** doit être autorisée dans le tenant (c'est le cas
par défaut). Si elle n'apparaît pas : **Applications** (barre de gauche) → chercher
« Workflows » → **Ajouter**.

**1. Le canal (2 min).**

1. Dans Teams, barre de gauche : **Teams** (ou **Équipes**). Je choisis une équipe dont je suis
   propriétaire, ou **Rejoindre ou créer une équipe → Créer une équipe → À partir de zéro →
   Privée**, nom `Formation Prometheus`.
2. Sur l'équipe : **⋯** → **Ajouter un canal**. Nom `alertes-apicil`, type **Standard**
   (surtout pas *Privé*). **Ajouter**.

**2. Le workflow (3 min).**

3. Je survole le canal `alertes-apicil` dans la liste : **⋯** (Plus d'options) → **Workflows**.
   (Autre chemin : ouvrir le canal, **⋯** en haut à droite → **Workflows**.)
4. Une fenêtre liste des modèles. Dans la recherche, je tape **webhook** et je choisis
   **« Send webhook alerts to a channel »** (si Teams est en français, le libellé peut être
   traduit : la recherche « webhook » le trouve ; Power Automate l'appelle « Post to a channel
   when a webhook request is received »).
5. Teams peut demander de **se connecter** pour autoriser la connexion à Teams : j'accepte avec
   mon compte (il doit être membre de l'équipe). Puis **Suivant** si le bouton apparaît.
6. Je vérifie **Équipe** = `Formation Prometheus` et **Canal** = `alertes-apicil`.
   **Enregistrer** (ou **Ajouter un workflow**, selon la version).
7. L'écran final affiche **« Copier le lien du webhook »** (*Copy webhook link*). Je clique : la
   longue adresse (`https://…`, plusieurs centaines de caractères) est dans le presse-papiers. Je
   la colle dans un fichier texte sur mon bureau, `url-teams.txt`.
   Si j'ai fermé la fenêtre trop vite : Teams → **Applications** → **Workflows** → mon workflow
   → la première étape (« Lorsqu'une requête webhook Teams est reçue ») affiche l'adresse.

**3. Le test (2 min).** Dans Terminal sur mon Mac, en remplaçant `COLLER-ICI-L-ADRESSE` (en
gardant les guillemets) :

```bash
curl -H "Content-Type: application/json" -d '{"type":"message","attachments":[{"contentType":"application/vnd.microsoft.card.adaptive","content":{"type":"AdaptiveCard","version":"1.4","body":[{"type":"TextBlock","text":"Test de la formation : ça marche !"}]}}]}' "COLLER-ICI-L-ADRESSE"
```

8. Le terminal ne répond rien (ou `202`) : c'est normal. Dans le canal, en 5 à 30 secondes, un
   message « Test de la formation : ça marche ! » apparaît, envoyé par **Workflows** (ou à mon
   nom, selon le réglage du modèle).
9. Rien après une minute : Teams → **Applications** → **Workflows** → mon workflow →
   **Historique des exécutions**. Une exécution en échec dit pourquoi (souvent : connexion non
   autorisée ; je la réautorise).

**4. La partager pendant la formation.** Au TP C (démonstration) puis au TP D (tous), je colle
l'adresse dans le **chat de la session** (pas sur une slide, pas en photo : elle est trop longue
pour être recopiée). Les stagiaires la collent :

- dans Grafana : contact point **Microsoft Teams** → champ **URL** ;
- dans leur terminal, pour l'Alertmanager : `./jour3.sh teams 'ADRESSE'` (entre apostrophes : elle
  contient des `&`).

**5. Ce soir.** Je **supprime le workflow** : Teams → **Applications** → **Workflows** → mon
workflow → **⋯** → **Supprimer**. Cette adresse permet à n'importe qui d'écrire dans le canal :
je le dis aux stagiaires, c'est une bonne pratique en soi.

**Plan B** si les workflows sont bloqués : les stagiaires gardent l'adresse de l'Inbox
(`http://inbox:8080/teams/grafana`), qui simule Teams. On perd l'effet « waouh », pas la
compétence. Autre plan B : l'adresse e-mail du canal (canal → ⋯ → **Obtenir l'adresse e-mail**),
utilisée dans un contact point **Email** de Grafana… mais le lab n'a pas de vrai serveur SMTP :
c'est pour la démonstration en production, pas pour aujourd'hui.

### Pas à pas — préparer mon Codespace de démonstration (10 min)

1. github.com → le dépôt → **Code** → **Codespaces** → **⋯** à côté de **Create codespace on…**
   → **New with options** : branche **`jour3-formateur`**, machine **4-core** si possible.
   **Create codespace**.
2. Dans le terminal : `./jour3.sh start`. J'attends `10 / 10 cibles UP`.
3. Les deux dashboards corrigés des jours précédents, comme exemples à montrer :

```bash
cp solutions/jour-2/dashboards/*.json grafana/dashboards/
```

4. Je copie l'alerting du TP C pour être prêt à le montrer :

```bash
cp jour3/alerting/alerts.yml prometheus/rules/alerts.yml
cp jour3/alerting/alertmanager.yml alertmanager/alertmanager.yml
./lab.sh check && ./lab.sh reload
```

5. Je teste le vrai Teams depuis le Codespace : `./jour3.sh teams 'ADRESSE'`, puis
   `./lab.sh chaos errors on`. Deux minutes plus tard, une carte « ShopHighErrorRate » arrive dans
   le canal. `./lab.sh chaos errors off`, puis `./jour3.sh teams off`.

### Pas à pas — tester comme un stagiaire (5 min)

Dans une fenêtre de navigation privée, avec mon compte GitHub : j'ouvre
**https://codespaces.new/yparent/formation-observabilite-lab/tree/jour3**, je vérifie que la branche
affichée est `jour3`, **Create codespace**, puis `./jour3.sh start`. Si j'obtiens `10 / 10 cibles
UP`, la journée est sécurisée. Je supprime ce Codespace ensuite.

### Pas à pas — le message à poster à 9h00

Je le prépare dans le chat de la session :

```text
Bonjour à tous ! Pour démarrer :
1) Ouvrez ce lien (connecté à GitHub) et cliquez sur Create codespace :
   https://codespaces.new/yparent/formation-observabilite-lab/tree/jour3
2) Dans le terminal du Codespace :  ./jour3.sh start
3) Attendez "10 / 10 cibles UP".
Le guide du jour : docs/stagiaire/Guide-stagiaire-Jour-3-pratique.pdf (dans le Codespace,
ou sur GitHub, branche jour3). Gardez un onglet ouvert sur l'IA de votre choix.
```

---

## 8h30 — Vérification

- Codespace de démo : `./jour3.sh status`. Grafana ouvert.
- Teams ouvert sur le canal `Formation Apicil - alertes`, prêt à être projeté.
- Le deck en mode Présentateur, slide 1.
- Onglets, dans l'ordre : le deck, Grafana, Prometheus, Alertmanager, Inbox, Mailpit (tous de mon
  Codespace de démo), une IA, Teams, le dépôt GitHub.
- Au tableau : le lien `codespaces.new/…/tree/jour3` et `./jour3.sh start`, en gros. À côté, un
  tableau vide à deux colonnes « Alertmanager | Grafana », pour 15h25.

---

## 9h00 — Démarrer (15 min) · slides 1 à 5

### Slide 1 — accueil

> « Bonjour à tous. Dernier jour. Hier, on s'est arrêté au moment d'écrire du code dans
> l'application. Aujourd'hui, on change de rythme : on ne code plus, on pratique. Ce soir, vous
> aurez construit deux tableaux de bord selon les méthodes de Google, envoyé des alertes dans
> Teams, dans Slack et par e-mail, et mené une enquête sur une boutique sabotée. »

### Slide 2 — « Aujourd'hui, vous ne codez pas. Vous pilotez. »

> « Vous êtes des gens d'infrastructure. Lundi, ce n'est pas vous qui instrumenterez les
> applications : ce sont vos développeurs. Et PromQL, une IA l'écrit très bien. Mais une IA se
> trompe avec beaucoup d'assurance. Donc la compétence d'aujourd'hui, ce n'est pas d'écrire du
> PromQL : c'est de le demander, de le **comprendre**, et de le vérifier. À chaque fois, vous
> demanderez à l'IA d'expliquer sa requête, ligne par ligne. »

Trois secondes de silence. La phrase donne le ton.

### Slide 3 — le programme

Je lis la colonne de droite : « ce que vous aurez fait ». « Ce soir, on vérifiera ensemble. »
Pauses 10h30 et 14h30, déjeuner 12h30, fin 16h00.

### Slide 4 — démarrer, en même temps qu'eux

J'envoie le message préparé dans le chat.

### Pas à pas — le démarrage, projeté

1. Dans mon navigateur : le lien `codespaces.new/yparent/formation-observabilite-lab/tree/jour3`.
   Je montre la page : le dépôt, la **branche `jour3`**, la machine 2 cœurs. **Create codespace**.
2. Pendant les deux minutes de création : « Le Codespace, c'est un ordinateur dans le cloud de
   GitHub, avec tout notre lab. Rien n'est installé sur votre poste. »
3. Le terminal apparaît en bas. Je tape `./jour3.sh start`. Je commente :
   - « Il démarre treize conteneurs : Prometheus, Grafana, l'application en deux exemplaires, le
     générateur de trafic, les exporters, l'Alertmanager, l'Inbox qui joue Teams et Slack, et
     Mailpit, un faux serveur de messagerie. »
   - « À la fin, il vérifie lui-même que Prometheus voit ses dix cibles. »
4. `10 / 10 cibles UP` : je fais lever la main de ceux qui l'ont.
5. Onglet **PORTS** (à côté de *Terminal*) : je montre l'icône **globe** sur la ligne 3000.
   Grafana s'ouvre : `admin` / `formation`.

**Ceux qui n'ont pas 10/10** :

| Symptôme | Cause probable | Remède |
|---|---|---|
| Le Codespace s'ouvre sur `main` ou `formation-2026` | mauvais lien, ou branche changée | refaire avec le lien exact ; ou en bas à gauche de VS Code, cliquer sur la branche et choisir `jour3` |
| `Docker ne répond pas` | le Codespace finit de démarrer | attendre 30 s, relancer `./jour3.sh start` |
| `toomanyrequests` | limite de Docker Hub (Redis, Grafana) | `docker login` avec un compte Docker Hub gratuit, relancer |
| 8 ou 9 cibles sur 10 | un conteneur encore en démarrage | relancer `./jour3.sh start` : il est rejouable |
| `./jour3.sh: Permission denied` | droit d'exécution perdu | `bash jour3.sh start` |
| Le port 3000 ne s'ouvre pas | le navigateur bloque les fenêtres | onglet PORTS → clic droit → *Open in Browser* |
| Plus de quota Codespaces (60 h/mois gratuites) | compte très utilisé | un binôme avec le voisin |

### Slide 5 — les commandes pour casser

> « Ces commandes vont servir toute la journée. Un tableau de bord ou une alerte qu'on n'a jamais
> vus réagir à une panne, on ne sait pas s'ils marchent. Les pompiers font des exercices
> d'incendie ; nous, on fait du chaos. Et quand vous êtes perdus : `./jour3.sh repare`. »

---

## 9h15 — Les bonnes métriques et PromQL avec l'IA (25 min) · slides 6 à 13

### Slide 6 — section

> « Première question : qu'est-ce qu'on met dans un tableau de bord ? La mauvaise réponse :
> "toutes les métriques qu'on a". La bonne : on part d'une méthode. Et la plus connue vient de
> Google. »

### Slides 7 et 8 — les quatre signaux dorés (5 min)

> « En 2016, Google publie gratuitement le livre qui décrit comment ses équipes d'exploitation
> travaillent : *Site Reliability Engineering*, sur sre.google. Le chapitre 6, *Monitoring
> Distributed Systems*, dit en substance : si vous ne pouvez mesurer que quatre choses sur un
> service utilisé par des gens, mesurez la latence, le trafic, les erreurs et la saturation. »

Source, à montrer si quelqu'un veut la lire : https://sre.google/sre-book/monitoring-distributed-systems/

Je détaille avec **la voiture** : la vitesse (le trafic), le voyant moteur (les erreurs), le temps
de trajet (la latence), la jauge d'essence (la saturation). « Quatre informations, et on conduit.
Le reste, c'est pour le garagiste. »

Les deux subtilités, à dire :

- « La latence des erreurs à part. Une erreur 500 renvoyée en 2 millisecondes fait baisser la
  latence moyenne : on croit que ça va mieux, alors que ça va plus mal. »
- « La saturation est le seul signal qui prévient. Les trois autres constatent. »

Le schéma du bas (slide 7) introduit déjà USE : « Quand c'est rouge en haut, on descend voir la
machine. »

### Slide 9 — signaux dorés, RED, USE (3 min)

> « RED, c'est la version microservices de Tom Wilkie : les trois premiers signaux, sans la
> saturation, si simple qu'on peut exiger le même dashboard pour les 200 services de l'entreprise.
> USE, c'est l'autre côté : pas le service, la ressource. Brendan Gregg, l'ingénieur performance
> de Sun puis de Netflix : pour chaque ressource, l'utilisation, la saturation, les erreurs. »

Au tableau, deux étages : en haut « le service » (signaux dorés), en bas « la machine » (USE), et
une flèche de haut en bas. « Ce matin, TP A, l'étage du haut. TP B, l'étage du bas. Un lien entre
les deux. On alerte sur le haut, on diagnostique avec le bas. »

Sources : https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/ et
https://www.brendangregg.com/usemethod.html

### Slides 10 à 12 — demander, comprendre, vérifier (4 min)

> « Trois étapes. **Demander**, avec le contexte et les vraies métriques, sinon l'IA invente des
> noms plausibles qui n'existent pas. **Comprendre** : l'IA doit expliquer sa requête, ligne par
> ligne, et vous devez pouvoir la redire en une phrase à votre voisin. **Vérifier** : quatre
> contrôles, dont le plus important, je casse et je regarde la courbe bouger. »

Sur la slide 11, je souligne les deux dernières lignes du modèle : « Je demande la requête,
**puis l'explication**. Ce n'est pas de la politesse, c'est l'objectif. Une requête qu'on ne
comprend pas, on ne saura pas la réparer le jour où elle sera fausse. »

La règle de sécurité, lentement : « Chez un assureur, on ne colle jamais de données de production
dans une IA publique : noms de clients, adresses internes, mots de passe. Ici, la boutique est
fictive. Lundi, demandez à votre RSSI quel outil d'IA est autorisé. »

### Pas à pas — la démonstration en direct (5 min)

1. J'ouvre `…5001/metrics` dans mon Codespace de démo, *Ctrl+F* `# TYPE http_requests_total`, je
   copie les deux lignes `# HELP` et `# TYPE` et trois lignes de valeurs.
2. Dans l'onglet IA, je colle le modèle de leur guide et je remplace la dernière ligne entre
   chevrons par « le taux d'erreur 5xx en pourcentage, pour toute la boutique ».
3. Je **lis l'explication à voix haute**, en m'arrêtant sur chaque fonction : `rate` (la vitesse
   du compteur), `sum` (on additionne les instances et les routes), `status=~"5.."` (la regex des
   codes 500 à 599), la division (la part des erreurs), `* 100` (en pourcentage).
4. Je reformule en une phrase : « Elle calcule, pour toute la boutique, la part des requêtes en
   erreur sur les dernières minutes. » « Voilà le test de compréhension. »
5. Grafana → **Explore** → Prometheus → mode **Code**. Je colle la requête (`$__rate_interval`
   devient `5m` : c'est une variable de dashboard).
6. Les quatre vérifications, à voix haute : ça s'exécute ; l'ordre de grandeur (0, la boutique
   est saine) ; le compteur est dans un `rate` ; puis `./lab.sh chaos errors on`, j'attends une
   minute, la courbe monte. « Maintenant, elle est vérifiée. » `./lab.sh chaos errors off`.

Si l'IA se trompe pendant la démonstration, **tant mieux** : je lui redonne le résultat, elle se
corrige, et c'est la meilleure démonstration du « faux ? on redonne l'erreur ». Les erreurs
classiques : un nom inventé (`http_server_requests_seconds_count`, le nom Spring Boot), la moyenne
à la place du p95, un `sum` avant le `rate`, `status="500"` au lieu de `=~"5.."`.

### Slide 13 — l'échauffement (7 min)

> « À vous : une requête par signal doré, pour toute la boutique, dans Explore. L'IA l'écrit et
> l'explique, vous la vérifiez, et vous écrivez avec **vos** mots ce qu'elle fait. Sept minutes. »

Je circule. À la fin, je fais lire deux explications à voix haute.

| Signal | Ordre de grandeur | Erreurs d'IA fréquentes |
|---|---|---|
| Trafic | 6 à 7 req/s | le compteur brut sans `rate` (des milliers, qui montent) |
| Erreurs | 0 sans chaos | `status="500"` ; pas de division (un débit, pas un taux) |
| Latence p95 | 0,15 à 0,25 s | la moyenne `_sum / _count` ; `sum by (route)` sans `le` : « No data » |
| Saturation | quelques % de CPU | sans `rate` ; oubli du `1 -` (donne le CPU **libre**) |

---

## 9h40 — TP A : la boutique en quatre signaux dorés (50 min + 40 min) · slides 14 à 18

### Slides 14 à 16 (3 min)

Slide 15 (choisir la visualisation) : « Votre antisèche pour la journée, je la laisse au tableau. »
Slide 16 (lisible) : « Un dashboard sans unité, c'est une réunion où quelqu'un dit "on est à
0,4" et où personne n'ose demander 0,4 quoi. »

### Slide 17 — le TP

> « Votre dashboard a trois étages, comme un immeuble. Au rez-de-chaussée, en haut de l'écran, la
> réponse à "ça va ?" : quatre cases de couleur, une par signal doré. Au premier, les mêmes
> signaux dans le temps, pour l'équipe technique. Au deuxième, le métier, pour le directeur
> commercial. Chaque panel a sa question en français dans votre guide : vous la posez à l'IA,
> elle explique, vous vérifiez, vous réglez l'affichage. Bloqués plus de cinq minutes sur une
> requête : l'annexe de secours. Personne ne reste bloqué sur du PromQL aujourd'hui : le sujet,
> c'est Grafana. »

Slide 18 : l'exemple de résultat, que je laisse projeté. Mieux : j'ouvre « TP 5 - Boutique en
ligne » dans mon Grafana de démo.

### Pas à pas — la variable (je la montre, 3 min)

1. **Dashboards → New → New dashboard**, mode édition : **Add → Variable** (ou **Settings →
   Variables → New variable**).
2. *Variable type* : Query. *Name* : `instance`. *Label* : `Instance`.
3. *Query* : `label_values(http_requests_total{job="shop-api"}, instance)`.
4. **Multi-value** et **Include All option** ; *Custom all value* : `.*`.
5. *Preview of values* : `shop-api-1:5000`, `shop-api-2:5000`. **Back to dashboard**.

> « Dans chaque requête, `instance=~"$instance"`. Le `=~` parce que "All" devient `.*`, une regex.
> C'est dans le modèle de demande : l'IA le fera. »

### Pas à pas — le premier Stat, de bout en bout (je le montre, 4 min)

1. **Add → Visualization**, source *Prometheus*, mode **Code**, la requête du trafic (vérifiée).
2. En haut à droite, visualisation **Stat**.
3. Options, champ de recherche : `unit` → *requests/sec (rps)*.
4. `color mode` → **Background** ; `graph mode` → **Area**.
5. *Standard options* → *Color scheme* : **Single color**, bleu. « Le trafic n'est ni bon ni mauvais : il
   ne doit jamais être rouge. Le rouge, c'est "il faut agir". »
6. Titre `Trafic`, **Back to dashboard**, je le réduis à un quart de largeur. **Ctrl+S**.

### Pendant le TP : les pièges, dans l'ordre où ils arrivent

| Piège | Symptôme | Ce que je dis |
|---|---|---|
| Unité oubliée | 0.012 au lieu de 1,2 % | « Percent (0.0-1.0) pour un ratio, Percent (0-100) si la requête multiplie par 100. » |
| Seuils à l'envers | tout est rouge | ils se lisent de bas en haut : *Base* vert, orange à 0.01, rouge à 0.05 |
| Latence « No data » | `sum by (route)` sans `le` | « Le `le`, c'est l'escalier des buckets : sans lui, plus d'escalier. » |
| Heatmap grise | *Format : Heatmap* oublié | sous la requête : *Options → Format → Heatmap*, puis *Calculate from data : No* |
| Donut d'une seule part | pas de `by (payment_method)` | et la légende `{{payment_method}}` |
| Stock : 12 barres | pas d'`avg by (product)` | les deux instances ont chacune leur stock |
| Rien n'est sauvegardé | tout perdu au rechargement | « Ctrl+S toutes les dix minutes. » |

**La question de l'étape 1 : le signal qui a réagi le plus lentement.** Les erreurs et la latence :
elles sont calculées avec `rate()` sur une fenêtre (`$__rate_interval`, au moins une minute, plus
les 15 secondes de scrape), qui lisse et retarde la montée. Le CPU réagit au scrape suivant. Une
fenêtre courte réagit vite mais clignote ; une fenêtre longue est stable mais lente : c'est un
compromis, le même qu'avec le `for` des alertes cet après-midi.

**La question de l'étape 3 : pourquoi `rate` pour un montant ?** `shop_revenue_euros_total` est
un compteur : tout ce qui a été vendu depuis le démarrage, remis à zéro à chaque redémarrage.
`rate` × 3600 donne la **vitesse** en euros par heure. Le compteur kilométrique contre le compteur
de vitesse.

À 10h25 : « Là où vous en êtes, sauvegardez. Après la pause : le métier et les finitions. »

---

## 10h30 — Pause (30 min)

---

## 11h00 — TP A, suite : les finitions (je les montre, 5 min)

1. **Le panel Text** : *Add → Visualization → Text*, mode Markdown, trois lignes (voir le bloc
   ci-dessous). Je dis : « Le premier lecteur de ce dashboard, c'est quelqu'un d'astreinte,
   réveillé à 3 h, qui ne l'a jamais vu. Trois lignes lui disent où il est et qui appeler. »
2. **L'annotation Chaos** : *Add → Annotation query*. Je lance `./lab.sh chaos errors on` : un
   trait rouge vertical sur toutes les courbes. « En post-mortem, la première question est
   toujours : qu'est-ce qui a changé à ce moment-là ? »
3. **Le lien** : *Settings* → *Tags* `formation` sur chaque dashboard, puis *Settings* → *Links* →
   *Add dashboard link*, type *Dashboards*, *With tags* `formation`, *As dropdown*, *Include
   current time range*. « Quand le haut est rouge, un clic
   pour descendre d'un étage, sur la même période. »

Le texte du panel Text :

```text
**Boutique en ligne : santé et ventes.**
Propriétaire : équipe Boutique · Astreinte : canal Teams #boutique-astreinte
En cas d'alerte : [runbook](https://github.com/yparent/formation-observabilite-lab)
```

> **Anecdote — le dashboard du directeur.** On m'avait demandé « un dashboard pour le
> directeur ». J'en ai livré un de 40 panels, magnifique. Il a regardé, et il a demandé : « Donc,
> ça va ou pas ? » Depuis, la première rangée de chaque dashboard répond à cette question, en
> quatre chiffres colorés.

**Le crash test (étape 5)** : `./lab.sh traffic 30`. La réponse attendue à « est-ce une panne ? » :
**non**. Le trafic, la saturation et le chiffre d'affaires montent, les erreurs et la latence
restent vertes. « C'est le Black Friday qui se passe bien. Si le trafic avait une case rouge, on
aurait réveillé quelqu'un pour une bonne nouvelle. »

**Le joker**, pour celui qui est perdu (sur la branche `jour3`, les corrigés sont dans la branche
formateur) :

```bash
git fetch origin
git checkout origin/jour3-formateur -- solutions/jour-2/dashboards/
cp solutions/jour-2/dashboards/*.json grafana/dashboards/
```

Dix secondes plus tard, deux dashboards complets sont dans son dossier *Formation*.

---

## 11h40 — TP B : le serveur en méthode USE (30 min) · slide 19

> « Même exercice pour la machine. Pour chaque ressource, trois questions : est-elle occupée ?
> Est-ce que du travail attend ? Y a-t-il des erreurs ? La méthode de Brendan Gregg vous empêche
> d'oublier une ressource. »

**La saturation CPU (panel 2) et le piège de l'IA.** La charge compte les processus qui veulent le
CPU : 2 sur une machine à 2 cœurs, c'est plein ; 4, la moitié attend. D'où « charge divisée par
le nombre de cœurs ». L'IA propose presque toujours
`node_load1 / count(node_cpu_seconds_total{mode="idle"})`, qui renvoie « No data » : à gauche une
série avec les labels `instance` et `job`, à droite un `count` sans aucun label ; PromQL apparie
par labels identiques, rien ne correspond. La correction :
`/ on (instance) count by (instance) (...)`.

> « C'est le meilleur exercice de la journée : donnez le résultat à l'IA, demandez-lui
> d'expliquer. Travailler avec une IA, c'est une conversation, pas un distributeur. »

**La pression (PSI, panel 3).** Le noyau Linux mesure directement le temps pendant lequel des
tâches **attendent** le CPU : la saturation à l'état pur. « Si vous ne retenez qu'une métrique de
saturation pour Linux, c'est celle-là. »

**`MemAvailable` et pas `MemFree`** : Linux utilise la mémoire libre comme cache disque et la
rend à la demande. `MemFree` est toujours bas et fait peur pour rien.

> **Anecdote — le serveur à 98 % de mémoire.** Des années de tickets « mémoire critique » sur un
> serveur de base de données, parce que la supervision regardait `MemFree`. Le jour où on est
> passé à `MemAvailable`, les alertes ont disparu, et personne ne les a regrettées.

**La chaîne complète**, vers 12h00 : `./lab.sh chaos cpu 120`. La case Saturation de la boutique
passe à l'orange, un clic sur le lien, le dashboard serveur montre le CPU, la charge, la pression.
« Un diagnostic en deux clics. »

**L'import du 1860** : **Dashboards → New → Import**, `1860`, *Load*, source Prometheus,
*Import*. « Le dashboard le plus téléchargé de grafana.com. Parfait pour une enquête de deux
heures. À 3 h du matin, vous ouvrez le vôtre. »

---

## 12h10 — Auto-audit et maturité (20 min) · slides 20 et 21

Slide 20, le modèle de maturité de Grafana (2 min) : « Faible, moyen, élevé. Chez vous ? »
Réponse habituelle : faible, avec un sourire. « Lundi, vous pouvez passer à moyen en une semaine. »

Slide 21 :

> « Dix critères, tirés de la documentation de Grafana et du chapitre 6 de Google SRE. Notez votre
> dashboard Boutique, honnêtement. Puis échangez d'ordinateur avec votre voisin et notez le sien.
> Huit minutes. »

Débrief (5 min) : « Qui a 8 ou plus ? » Les deux critères les plus ratés : 8 (annotations) et 9
(lien vers le niveau suivant). « Ce sont les deux qui font gagner le plus de temps pendant un
incident. » Le reste du temps : ils corrigent leur dashboard.

Source : https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/

---

## 12h30 — Déjeuner

« Laissez vos Codespaces ouverts. S'ils se mettent en veille, ils redémarrent avec la stack au
retour : 30 secondes. »

**Pour moi, à 13h25** : dans mon Codespace de démo, `./jour3.sh thanos on`, pour que Thanos ait
des données à 15h50.

---

## 13h30 — Alerter sans épuiser les équipes (10 min) · slides 22 à 27

- **Slide 23 — Mauvaise alerte, bonne alerte.** « Google SRE, et la documentation de Prometheus
  le dit en une phrase : *keep alerting simple, alert on symptoms*. On alerte sur ce que les
  utilisateurs sentent. Et une alerte qui réveille quelqu'un doit être urgente et actionnable :
  si la réponse à "qu'est-ce que je fais ?" est "je regarde", c'est un panel. »
  Source : https://prometheus.io/docs/practices/alerting/
- **Slide 24 — Le cycle de vie.** Inactive, Pending, Firing. « Le `for`, c'est l'anti-faux
  positif : le détecteur de fumée qui sonnerait au premier grille-pain, tout le monde finirait par
  enlever la pile. »
- **Slide 25 — Deux chemins.** « Mêmes canaux, deux chemins. Jamais la même alerte des deux
  côtés. »
- **Slide 26 — Les concepts.** « Retenez ce tableau : vous allez le vivre dans les deux TP. »
- **Slide 27 — L'arbre de routage.** « Un aiguillage de gare. Le `continue`, c'est la
  photocopie. »

> **Anecdote — les 400 notifications par jour.** Une équipe recevait 400 notifications par jour.
> Plus personne ne les lisait ; la nuit où la base est tombée, l'alerte était la 237e de la
> journée. Après nettoyage : 12 alertes, toutes sur des symptômes, chacune avec un runbook.

---

## 13h40 — TP C : Prometheus, Alertmanager, Teams, Slack, e-mail (50 min) · slides 28 à 30

Les fichiers sont **fournis** dans `jour3/alerting/`. Personne n'écrit 80 lignes de YAML.

### Partie 1 — Les règles (10 min)

Je projette `jour3/alerting/alerts.yml` et je lis `ShopHighErrorRate` à voix haute :

> « Une règle, c'est quatre choses. Une requête qui renvoie quelque chose quand ça va mal : le
> tamis, tout ce qui dépasse 5 % passe. Un `for` : ça doit durer une minute. Des labels :
> `severity` et `team`, c'est l'adresse sur l'enveloppe, l'Alertmanager ne lit que ça. Des
> annotations : le texte de la lettre, avec le lien vers le runbook. Si une expression vous
> échappe, collez-la dans l'IA et demandez l'explication. »

**Correction des questions :**

1. Symptômes : `ShopHighErrorRate`, `ShopCheckoutSlow`, `BlackboxProbeFailed`, et `TargetDown`
   (l'absence de mesure). Cause : `HostHighCpuLoad`, et c'est pour ça qu'elle est en `warning`.
2. `for` : l'anti-faux positif, le passage *Pending → Firing*. `team` : sert au routage.
3. Réveillent (critical, donc l'astreinte Teams) : `ShopHighErrorRate`, `TargetDown`,
   `BlackboxProbeFailed`. Ne doit jamais réveiller : `HostHighCpuLoad` (une cause, en warning).

### Partie 2 — L'arbre de routage (10 min)

Je dessine l'arbre **au tableau** à partir de `amtool config routes` :

```text
racine → inbox-default
 ├── severity=critical → astreinte-teams   (continue: true)
 ├── team=boutique     → boutique  (Slack + e-mail)
 └── team=infra        → infra-inbox
```

**Correction des prédictions :**

| Labels | Receivers |
|---|---|
| `severity=critical team=boutique` | `astreinte-teams`, `boutique` |
| `severity=warning team=boutique` | `boutique` |
| `severity=warning team=infra` | `infra-inbox` |
| `severity=critical` (sans team) | `astreinte-teams` |
| `severity=info team=logistique` | `inbox-default` (aucune branche : la racine) |

Sans `continue: true`, la première ligne ne donne plus que `astreinte-teams` : l'équipe boutique ne
sait pas que son site est en panne. « L'erreur de routage la plus fréquente en production. On
teste son routage **avant** la panne : `amtool config routes test`. »

**Un receiver, deux canaux.** Je montre le receiver `boutique` : un bloc `slack_configs` et un
bloc `email_configs`. « Une équipe, deux canaux. »

### Partie 3 — Casser et suivre les messages (10 min)

`./lab.sh chaos errors on`. Chronologie attendue : *Pending* en 15 à 30 s ; *Firing* une minute
après ; notifications 10 s plus tard (`group_wait`).

- **Inbox** (8080) : une carte **Teams** (astreinte) et un message **Slack** (boutique), à cause
  du `continue`. Les deux instances dans le **même** message : `group_by: [alertname, job]`.
- **Mailpit** (8025) : un e-mail `[FIRING:2] ShopHighErrorRate` à `equipe-boutique@boutique.local`.
  Je l'ouvre projeté : le résumé, les labels, le lien vers l'Alertmanager. « Exactement ce que
  recevrait l'équipe. »
- Le *resolved* arrive jusqu'à une minute après la fin du chaos (`group_interval: 1m` ; souvent
  5 minutes en production).

### Partie 4 — L'inhibition (10 min)

> « Le site est en erreur, l'astreinte est réveillée. A-t-elle besoin, en plus, de "le paiement
> est lent" ? Non : c'est du bruit. L'inhibition, c'est "si A sonne, fais taire B". »

Ils ajoutent le bloc de six lignes, `check`, `reload`, puis `chaos errors on` ; quand
`ShopHighErrorRate` est *Firing* (environ 1 min 30), `chaos latency on`. Deux minutes plus tard,
`amtool alert query --inhibited` montre `ShopCheckoutSlow` (*suppressed*), et rien n'est arrivé
pour elle dans l'Inbox ni dans Mailpit. Si on lance les deux chaos en même temps, la lenteur
peut notifier avant que l'erreur ne soit *Firing* : l'inhibition ne joue que si la source est
déjà active.

### Partie 5 — Le silence (5 min)

Démonstration dans l'Alertmanager (9093) : **New Silence**, matcher `team="boutique"`, 30 minutes,
commentaire « Maintenance base de données ». « L'inhibition est une règle permanente ; le silence
est ponctuel, posé par un humain, avec son nom et une raison. »

### Partie 6 — Le vrai Teams (démonstration, 5 min) · slide 29

> « Point important pour vous, qui utilisez Teams. Pendant des années, on créait un "connecteur
> Incoming Webhook". Microsoft l'a remplacé par les **workflows**. Dans Teams : le canal, les
> trois points, Workflows, le modèle "Send webhook alerts to a channel". Teams donne une adresse,
> et cette adresse est un **secret** : qui l'a peut écrire dans le canal. »

### Pas à pas — le vrai Teams, projeté

1. Dans mon Codespace de démo : `./jour3.sh teams 'ADRESSE-DU-WORKFLOW'` (avec les apostrophes :
   l'adresse contient des `&`).
2. Je montre le fichier : `cat alertmanager/secrets/teams_url`. « L'adresse est dans un fichier à
   part, que Git ignore. Le YAML dit seulement `webhook_url_file`. »
3. `./lab.sh chaos errors on`. Je bascule sur Teams, projeté. Une à deux minutes plus tard : la
   carte « ShopHighErrorRate » arrive dans le canal. Effet garanti.
4. `./lab.sh chaos errors off`, puis `./jour3.sh teams off`.

Je donne l'adresse dans le chat de la session : « Ceux qui veulent peuvent faire pareil depuis
leur Codespace. Et cet après-midi, vous l'utiliserez tous depuis Grafana. »

**Slide 30 — l'e-mail** (2 min) : « Au lab, Mailpit. En production, le relais SMTP de
l'entreprise, avec TLS et un compte de service. L'e-mail pour le non urgent ; le critique dans
Teams ou l'outil d'astreinte : personne ne lit ses e-mails à 3 h du matin. Des listes de
diffusion par équipe, jamais des adresses nominatives. »

À 14h28 : « `./jour3.sh repare`, et pause. »

---

## 14h30 — Pause (30 min)

---

## 15h00 — TP D : l'alerting de Grafana, Teams en vrai (30 min) · slides 31 à 33

> « Le directeur commercial ne lira jamais un fichier YAML, et il veut changer son seuil lui-même.
> On lui fait son alerte dans Grafana, par e-mail. Et l'astreinte la verra dans Teams. On ne
> refait **pas** les alertes techniques du TP C : la même alerte des deux côtés, c'est deux
> notifications, deux vérités, et un jour l'une des deux est fausse. »

### Pas à pas — le premier contact point, projeté (2 min)

**Alerting → Notification configuration → Contact points → + Create contact point**, nom
`equipe-commerce`, intégration **Email**, adresse `commerce@boutique.local`, **Test** : l'e-mail
arrive dans Mailpit. **Save**.

### Le moment Teams (3 min)

> « Maintenant, chacun crée un contact point **Microsoft Teams**, nommé `teams-salle`, avec
> l'adresse que je viens de mettre dans le chat. Et vous cliquez sur **Test**. Regardez l'écran. »

Je projette Teams. Les messages de test arrivent les uns après les autres. Je laisse vivre.

### Pendant le TP : les pièges

| Piège | Ce que je dis |
|---|---|
| Le test Teams échoue | l'adresse est incomplète (copier-coller tronqué) : la recopier depuis le chat |
| La règle reste en *Normal* | le seuil : *IS BELOW* la moitié de la valeur actuelle (environ 180 000 €/h au lab), puis `./lab.sh traffic 1` |
| *Preview* montre des courbes | requête en *Range* : passer en **Instant** |
| L'e-mail ne part pas, l'alerte va dans Teams | le label `team=commerce` manque sur la règle, ou le matcher de la politique est mal saisi |
| Rien après *Firing* | évaluation toutes les minutes, *Pending period* 1 min, *Group wait* 10 s : 2 à 3 minutes en tout |

Le déclenchement : `./lab.sh traffic 1`. Le chiffre d'affaires tombe d'environ 180 000 €/h à
moins de 40 000 en deux à trois minutes, la règle passe *Pending* puis *Firing*, l'e-mail arrive dans Mailpit.
`./lab.sh traffic 6`.

### Le tableau comparatif, tous ensemble (7 min)

Je remplis au tableau, **avec leurs réponses** :

| | Prometheus + Alertmanager | Grafana |
|---|---|---|
| Où vit la configuration ? | des fichiers YAML | la base de Grafana (ou des fichiers de provisioning) |
| Versionner, relire | Git, merge request, naturellement | export, provisioning, Git Sync : possible, moins naturel |
| Tester avant de déployer | `promtool test rules`, `amtool config routes test` | *Preview*, *Test* sur le contact point |
| Qui modifie ? | ceux qui touchent au YAML | quiconque a les droits sur le dossier |
| Plusieurs sources (SQL, logs) | non, métriques Prometheus seulement | oui |
| Si Grafana tombe | les alertes continuent | plus d'alertes |
| Inhibition | oui | pas d'équivalent direct |
| Pour quoi chez moi ? | les alertes techniques, critiques, sur les métriques | les alertes métier, sur SQL ou logs, réglables par les équipes |

Slide 32, la conclusion : « Les alertes techniques, critiques, qui doivent survivre à tout :
Prometheus et Alertmanager, dans Git, testées. Les alertes métier, multi-sources : Grafana. »

Slide 33, le budget d'erreur, en une minute (texte dans les notes) : « Le niveau suivant. »
Source : https://sre.google/workbook/alerting-on-slos/

---

## 15h30 — Bonnes pratiques et escape game (20 min) · slides 34 à 38

### Slides 35 et 36 — les bonnes pratiques (3 min)

Je les passe vite : « Six règles de configuration, cinq règles de sécurité par outil. Vous les
retrouvez en **checklists à cocher** à la fin de votre guide, avec un déroulé type de mise en
production. C'est ce que vous emporterez. »

Sources : https://prometheus.io/docs/operating/security/ et
https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/

### Slides 37 et 38 — l'escape game (17 min)

> « Cette nuit, quelqu'un a saboté la boutique. Deux incidents se cachent. Vous êtes l'astreinte.
> Tapez `./jour3.sh mystere`, puis fermez le terminal. Interdit : le terminal, docker, les logs.
> Autorisé : vos dashboards, Explore, les alertes, l'Inbox, Mailpit, et l'IA. Douze minutes.
> Remplissez le rapport d'enquête. »

Chaque Codespace tire **deux** sabotages au hasard parmi **sept** : les voisins n'ont pas les
mêmes. Je chronomètre au tableau. À 12 minutes : « Stop. `./jour3.sh solution`. » Chacun voit sa
solution, la boutique est réparée, ils comptent leurs points.

### Les solutions des sept sabotages

| N° | Sabotage | Où ça se voit | Alerte et canal | Le piège |
|---|---|---|---|---|
| 1 | Latence ×10 sur `shop-api-1` seulement | case Latence orange, heatmap ; variable `instance` sur `shop-api-1` | `ShopCheckoutSlow` (warning) → Slack + e-mail | la moyenne des deux instances dilue : filtrer par instance |
| 2 | 40 % d'erreurs sur `shop-api-2` seulement | case Erreurs, environ 15-20 % au global, 30-40 % sur `shop-api-2` | `ShopHighErrorRate` sur `shop-api-2` → Teams + Slack + e-mail | une seule instance : le `by (instance)` de la règle la désigne |
| 3 | Redis arrêté | Explore : `redis_up` = 0 | **aucune** | `up{job="redis"}` reste à 1 : c'est l'exporter qui répond. L'alerte qui manque : `redis_up == 0` |
| 4 | Trafic ×5 | cases Trafic et Saturation, chiffre d'affaires en hausse | éventuellement `HostHighCpuLoad` → infra | ce n'est **pas** une panne : la bonne réponse est « beaucoup de clients » |
| 5 | CPU saturé pendant 15 min | case Saturation rouge, dashboard USE (CPU, charge, pression) | `HostHighCpuLoad` (warning) → infra-inbox | la boutique reste rapide : une saturation n'est pas encore une panne |
| 6 | `shop-api-1` arrêtée | State timeline, `up` = 0 ; `probe_success` = 0 ; le trafic mesuré et le chiffre d'affaires **divisés par deux** | `TargetDown` (label `team=boutique` hérité de la cible) → Teams + Slack + e-mail ; `BlackboxProbeFailed` → Teams | il n'y a pas de répartiteur : le générateur de trafic tire une instance au hasard, la moitié des requêtes échoue sans être comptée |
| 7 | Fuite mémoire | Explore : `process_resident_memory_bytes{job="shop-api"}` qui grimpe | **aucune** | aucun dashboard ne le montre. L'alerte qui manque : une `predict_linear` sur la mémoire du processus |

**Attention à l'inhibition du TP C.** Elle reste active pendant le jeu. Si le tirage donne 1 et 2
ensemble, `ShopHighErrorRate` (critical) fait taire `ShopCheckoutSlow` (warning) : rien
n'arrive pour la lenteur dans l'Inbox ni dans Mailpit, mais l'alerte est visible dans
l'Alertmanager, filtre *Inhibited*. C'est une bonne réponse : « elle a sonné, mais elle était
inhibée ».

**Le bonus de 2 points** va à ceux qui trouvent le 3 ou le 7 et disent quelle alerte aurait dû
exister. « C'est exactement le travail d'une revue post-incident : qu'est-ce qui nous a manqué ? »

### Les questions éclair (réponses)

Je pose les questions à voix haute ; premier qui lève la main, 1 point.

1. **Le type de `http_requests_total`** : un compteur. On ne le regarde jamais brut : il ne fait
   que monter depuis le démarrage, et repart à zéro au redémarrage ; on lit sa vitesse, `rate`.
2. **Pourquoi le p95** : la moyenne ne décrit personne (95 clients à 50 ms et 5 à 10 s donnent
   550 ms) ; le p95 est une promesse qu'on peut faire à 95 % des clients.
3. **Le `for`** : la condition doit tenir cette durée avant de notifier ; c'est l'anti-faux
   positif.
4. **`continue: true`** : l'alerte continue de descendre l'arbre après une branche qui
   correspond ; plusieurs receivers la reçoivent.
5. **Inhibition ou silence** : l'inhibition est une règle permanente de la configuration ; le
   silence est une décision humaine, ponctuelle, avec un auteur et une durée.
6. **L'adresse Teams dans un fichier** : c'est un secret (qui l'a peut écrire dans le canal), et
   le YAML part dans Git.
7. **`MemAvailable`** : Linux utilise la mémoire libre comme cache ; `MemFree` est toujours bas
   et fait peur pour rien.
8. **SQL** : Grafana (multi-sources). **Survivre à une panne de Grafana** : Prometheus et
   Alertmanager.

Le binôme gagnant : applaudissements.

---

## 15h50 — Thanos en cinq minutes · slide 39

Sur mon Codespace de démo, où Thanos tourne depuis 13h25.

> « Un Prometheus garde quelques semaines, sur un seul serveur. Trois besoins arrivent un jour :
> un an d'historique ; une vue globale sur plusieurs Prometheus ; deux Prometheus jumeaux pour la
> haute disponibilité, sans tout voir en double. Thanos répond aux trois, sans toucher aux
> Prometheus : on leur colle un **sidecar**. »

### Pas à pas — la démonstration

1. Port **10902**, **Stores** : deux sidecars (`replica=prom-1`, `replica=prom-2`) et le Store
   Gateway.
2. `up{job="shop-api"}` : **2** séries. Je décoche **Use Deduplication** : **4**. « Le Querier
   sait que `replica` distingue les jumeaux, il garde une seule copie. »
3. `docker compose exec thanos-store ls /bucket` : un dossier par bloc de 10 minutes. « En
   production : un bucket S3 ou OVH Object Storage, quelques euros par mois pour des années. »
4. Grafana → Explore → source **Thanos** : la même requête. « Vos dashboards pointent sur Thanos
   sans rien changer d'autre. »

> « Les alternatives : Mimir, VictoriaMetrics. Même API : Grafana ne voit pas la différence. À
> essayer chez vous : `./jour3.sh thanos on`. »

---

## 15h55 — Lundi matin · slide 40

> « Lundi matin, ne faites pas tout. Choisissez **un** service. Un seul. Ses quatre signaux dorés
> en haut d'un dashboard. **Une** alerte sur un symptôme, avec un responsable, un runbook, et le
> bon canal Teams. Dans un mois, vous aurez dix services, parce que vos collègues viendront vous
> demander le même. »

> « À la fin de votre guide : une synthèse de toute la formation, quatre checklists de mise en
> production, un déroulé type, et toutes les ressources : les sources de Google, les bonnes
> pratiques officielles, des petits outils comme PromLens qui explique une requête visuellement.
> Gardez-le. »

Tour de table éclair : un service chacun, à voix haute.

> « Mardi matin, vous ne saviez pas ce qu'était une série temporelle. Aujourd'hui, vous avez
> construit deux tableaux de bord selon les méthodes de Google, envoyé des alertes dans Teams et
> par e-mail, et retrouvé deux pannes sans toucher au terminal. Merci à tous. »

Juste avant de conclure, je montre où sont les corrigés : `docs/stagiaire/Guide-stagiaire-Jour-3-corriges.pdf`
dans leur Codespace (ou sur GitHub, branche `jour3`), et je le dépose dans le chat de la session.

16h00 : fin. **Ce soir** : je supprime le workflow Teams.

---

## Annexe A — La télécommande `jour3.sh`

| Commande | Ce qu'elle fait |
|---|---|
| `./jour3.sh start` | démarre les treize conteneurs, pousse le batch, vérifie les dix cibles, affiche les adresses |
| `./jour3.sh status` | état des conteneurs et adresses |
| `./jour3.sh teams 'URL'` | écrit l'adresse du workflow dans `alertmanager/secrets/teams_url` et recharge l'Alertmanager |
| `./jour3.sh teams off` | revient à l'Inbox du lab |
| `./jour3.sh mystere` | répare, puis applique deux sabotages au hasard parmi sept ; la solution est stockée encodée dans `.mystere` |
| `./jour3.sh solution` | affiche la solution, puis répare |
| `./jour3.sh repare` | redémarre `redis`, `shop-api-1`, `shop-api-2` (ce qui coupe aussi un chaos CPU), trafic à 6 req/s |
| `./jour3.sh thanos on` / `off` | active ou retire la brique Thanos, ses flags et la source de données Grafana |

## Annexe B — Ce que contient la branche `jour3`

| Élément | État |
|---|---|
| `docker-compose.yml` | briques 01 à 06 et 09 (Mailpit) actives ; 07 (Thanos) et 08 (cAdvisor) commentées |
| `apps/shop-api/app.py` | les cinq TODO du TP 2 faits |
| `prometheus/prometheus.yml` | six jobs, recording rules, Alertmanager branché |
| `prometheus/rules/recording.yml` et `tests/` | les règles et les tests du TP 3 |
| `alertmanager/alertmanager.yml` | la configuration de départ (une route vers l'Inbox) ; le TP C la remplace |
| `jour3/alerting/` | les règles et l'Alertmanager du TP C (Teams, Slack, e-mail) |
| Grafana | SMTP vers Mailpit (`GF_SMTP_*`), source Prometheus provisionnée |
| `docs/stagiaire/` | les guides, dont `Guide-stagiaire-Jour-3-pratique.pdf` et `jour-3-pratique.md` |

La branche `jour3-formateur` contient en plus les corrigés (`solutions/`), le deck et ce guide.

## Annexe C — Dépannage express

| Symptôme | Remède |
|---|---|
| Une cible reste DOWN | `./jour3.sh start` à nouveau ; sinon `docker compose ps` et `docker compose logs <service>` |
| Grafana ne montre aucune donnée | Explore → `up` : si vide, Prometheus ne tourne pas (`./jour3.sh start`) |
| Aucune notification dans l'Inbox | `./lab.sh check` (erreur de YAML ?), puis `./lab.sh reload` ; Prometheus → Status → Alertmanager discovery |
| L'e-mail n'arrive pas dans Mailpit | `docker compose ps mailpit` ; dans Grafana, *Test* sur le contact point |
| Le message n'arrive pas dans Teams | l'adresse est tronquée ; tester avec le `curl` de la veille ; plan B : l'Inbox |
| `./jour3.sh solution` dit « aucun sabotage » | `solution` a déjà été lancé (il efface la solution après l'avoir affichée) : rien à faire, ou `./jour3.sh repare` |
| Le Codespace est très lent | 2 cœurs, c'est juste avec Thanos : `./jour3.sh thanos off` |
