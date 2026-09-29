# Avant-propos

Ce guide est mon support d'animation. Il contient tout ce que je dis, tout ce que je montre et
tout ce que les stagiaires font pendant les trois jours, avec les corrigés. Il est volontairement
bavard : le jour J, je ne dois jamais avoir à réfléchir à « qu'est-ce qui vient après ? ».

Le fil conducteur des trois jours est une boutique en ligne fictive, `shop-api`, déployée en deux
instances et bombardée par un générateur de trafic. Elle est instrumentée pour de vrai
(`prometheus_client`), elle a des métriques techniques et des métriques métier, et je peux la
casser à la demande (latence, erreurs, CPU, fuite mémoire). Tout ce qu'on apprend s'applique
immédiatement à quelque chose de concret qui tourne sous les yeux des stagiaires.

Rien n'est installé au départ. Le premier matin, les stagiaires téléchargent les binaires de
Prometheus puis de Grafana et les lancent à la main, pour voir ce qu'il y a dedans. Ensuite, la
stack se monte brique par brique en Docker Compose : `docker-compose.yml` ne contient qu'une
liste d'`include` commentés, un fichier par brique dans `compose/`, et c'est chaque exercice qui
dit laquelle activer. La boutique elle-même est livrée avec des trous (`TODO 1` à `TODO 5` dans
`app.py`) que les stagiaires comblent au TP 2. Le dernier après-midi, ils ajoutent un Thanos
complet au-dessus de deux Prometheus.

| Brique | Fichier | Activée |
|---|---|---|
| Prometheus | `compose/01-prometheus.yml` | J1, exercice 1.7 |
| Grafana (provisioning inclus) | `compose/02-grafana.yml` | J1, exercice 1.7 |
| Node Exporter | `compose/04-node-exporter.yml` | J1, TP 1 |
| Boutique (2 instances + trafic) | `compose/03-shop-api.yml` | J1, TP 2 partie 1 |
| Redis + exporter, Blackbox, Pushgateway | `compose/05-exporters.yml` | J1, TP 2 partie 3 |
| Alertmanager + Inbox | `compose/06-alerting.yml` | J3, exercice 3.0 |
| Thanos (Prometheus B, 2 sidecars, store, query, compact) | `compose/07-thanos.yml` | J3, TP 10 |
| cAdvisor | `compose/08-cadvisor.yml` | optionnel |

![L'ordre des briques sur les trois jours](../../diagrams/briques.png)

![La stack complète, telle qu'elle est à la fin du jour 3](../../diagrams/lab-architecture.png)

## Ce que promet le programme, et où on le fait

| Programme officiel | Où | Comment |
|---|---|---|
| Présentation, architecture, cas d'usage | J1 matin | Modules 1 et 2 |
| Rappels d'installation, prise en main de l'environnement | J1 matin | Module 3 (installation à la main) + exercices 1.1 à 1.4 |
| Configuration (fichiers, service discovery) | J1 | Module 4 + exercices 1.5 à 1.8 (1.7 : passage aux conteneurs) |
| Exporters, intégration de services tiers | J1 après-midi | Module 5 + TP 1 (Node Exporter) + Module 6 + TP 2 (instrumentation, Redis, Blackbox, Pushgateway) |
| Cas pratique Node Exporter | J1 après-midi | TP 1 |
| PromQL de base | J2 matin | Module 7 + série A |
| PromQL avancé, recording rules, optimisation | J2 matin | Module 8 + série B + TP 3 |
| Grafana : source de données, panels, variables, transformations, annotations, liens | J2 après-midi | Module 9 + TP 4 + TP 5 |
| Provisioning, dashboards as code | J2 après-midi | Module 10 + TP 5 (fin) |
| Utilisateurs, droits, orgs, teams, dossiers ; OSS vs Enterprise | J2 fin | Module 10 + exercices 2.30 à 2.33 |
| Cas pratique dashboard serveur Linux paramétrable | J2 après-midi | TP 4 |
| Alertes Prometheus, Alertmanager | J3 matin | Modules 11 et 12 + TP 6 |
| Intégrations tierces (Alertmanager, PagerDuty, Slack) | J3 matin | Module 13 |
| Teams via Workflows, GitHub | J3 matin | Module 13 + TP 7 |
| Cas pratique alerte CPU → Teams | J3 matin | TP 7 |
| Alerting Grafana (unified alerting, contact points, policies) | J3 après-midi | Module 14 + TP 8 |
| Performances, limites, bonnes pratiques | J3 après-midi | Module 15 |
| Sauvegarde, restauration | J3 après-midi | TP 9 |
| Mise à l'échelle | J3 fin | Module 16 + TP 10 (Thanos) |

## Les règles que je me fixe

1. **Jamais plus de 20 minutes sans que les stagiaires touchent au clavier.** Chaque module
   théorique est suivi d'exercices courts. Les gros TP arrivent quand les briques sont posées.
2. **On construit, on ne détruit pas.** Le `prometheus.yml` du dernier jour est celui du premier
   matin (un seul job) enrichi étape par étape. Idem pour Grafana, Alertmanager et l'application.
   À la fin, chacun repart avec une stack complète qu'il a assemblée lui-même, brique par brique.
3. **Le corrigé n'est jamais donné avant d'avoir cherché.** Les stagiaires ont le guide avec les
   énoncés et quelques indices. Je projette le corrigé après un temps de recherche, jamais avant.

## Timing indicatif

Journées de 9h00 à 17h30, pause déjeuner 12h30-14h00, pauses 15 minutes vers 10h45 et 15h45.
Soit environ 6h45 de travail effectif par jour. Les durées indiquées dans les modules sont des
cibles ; les TP 4, 5 et 6 sont ceux qui débordent le plus souvent, les bonus sont là pour les
rapides.

Si le groupe est en retard, ce qui peut sauter sans casser la suite :
- J1 : exercice 1.8 (relabeling), TP 2 partie 6 (bonus cardinalité)
- J2 : série B exercices 2.19 à 2.22, TP 5 partie 4 (heatmap), exercice 2.33 (service account)
- J3 : TP 6 partie 5 (silences, plages horaires), TP 9 partie 3 (basic auth), TP 10 partie 4 si
  les blocs ne sont pas encore arrivés (je montre le mien)

## Matériel

- Ce guide (PDF), dossier `docs/formateur/`, et le deck (PowerPoint), dossier `docs/slides/`
- Les trois guides stagiaires, un par jour, dossier `docs/stagiaire/` (PDF ou Markdown pour Notion).
  Je ne distribue le guide du jour que le matin même.
- Le dépôt GitHub, branche `formation-2026` : https://github.com/yparent/formation-observabilite-lab
  (dont `install/` pour les binaires du premier matin, `compose/` pour les briques)
- Les corrigés (`solutions/`), ce guide et le deck sont sur la branche `formation-2026-formateur`,
  que je ne distribue pas. La branche `formation-2026` des stagiaires n'en contient aucun.

## L'environnement technique

Le premier matin tourne sur des binaires (téléchargés par `install/download.sh` ou
`install/download.ps1`, environ 200 Mo), tout le reste en conteneurs. Plusieurs modes possibles pour
les stagiaires, à valider **avant** la formation avec le client :

| Mode | Avantages | Points d'attention |
|---|---|---|
| GitHub Codespaces | Rien à installer, identique pour tous ; **tout le programme** (binaires du matin, les huit briques, Thanos, TP 9 compris) y a été déroulé | Compte GitHub obligatoire, quota gratuit 120 h-cœur/mois : 60 h en 2 cœurs (le minimum proposé par le `devcontainer.json`), 30 h en 4 cœurs, pour 3 × 7 h de formation ; les URLs passent par un proxy. 2 cœurs / 8 Go suffisent pour tout, 4 cœurs rendent le TP 10 (18 conteneurs) plus confortable |
| Docker Desktop macOS/Linux | Rapide, tout en local | Docker doit être installé et fonctionnel la veille |
| Docker Desktop Windows | Idem | Backend WSL 2 obligatoire, PowerShell pour `lab.ps1`, fins de ligne gérées par `.gitattributes` |

Mon conseil : envoyer un mail une semaine avant avec le lien du dépôt et demander à chacun de
lancer `docker compose version` (ou de créer son Codespace) et de m'envoyer une capture. Ça évite
de perdre la première heure. Je ne leur demande pas de lancer la stack : c'est le travail du jour 1.

### Ce qui doit tourner à 9h00 le jour 1

- Mon propre dépôt avec les binaires téléchargés (pour montrer), et une seconde copie du dépôt
  avec toutes les briques du jour 1 activées et chaudes depuis 30 minutes (pour les démonstrations
  qui ont besoin d'historique, à partir du module 5). Les deux ne tournent pas en même temps :
  mêmes ports.
- Le deck projeté, la fenêtre du navigateur avec un onglet par service.
- Un terminal avec le dépôt ouvert.
- Si Teams est utilisé pour le TP 7 : le flux Workflows créé dans un canal de test, l'URL sous la main.

### Codespaces : les pièges connus

- Si les stagiaires ne peuvent rien installer sur leur poste (poste verrouillé, pas de Docker),
  Codespaces suffit pour l'intégralité de la formation : les binaires de l'exercice 1.1 sont
  ceux de Linux amd64, les huit briques tournent en Docker-in-Docker, et rien ne dépend d'un
  outil local. Seul besoin : un navigateur, un compte GitHub, et un réseau qui laisse passer
  github.com et *.app.github.dev.
- Docker Hub limite les pulls anonymes à 10 par heure et par IP : les images de la famille
  Prometheus viennent de quay.io pour cette raison, mais Grafana, Redis, curl et `python`
  restent sur Docker Hub. Si plusieurs Codespaces sortent par la même IP et que `./lab.sh up`
  échoue sur `toomanyrequests`, un `docker login` avec un compte Docker Hub gratuit règle le
  problème ; je le prévois dans le mail de préparation.

- Les ports sont redirigés vers des URLs `https://<nom>-<port>.app.github.dev`. Dans Grafana, les
  liens « localhost » du dashboard d'accueil ne fonctionnent donc pas : il faut passer par l'onglet
  Ports. Je le dis dès le début.
- La première ouverture d'un port redirigé affiche une page d'avertissement GitHub, c'est normal.
- Un Codespace s'arrête tout seul après 30 minutes d'inactivité. Les données Docker (volumes) sont
  conservées tant que le Codespace n'est pas supprimé : le lendemain, `./lab.sh up` repart avec
  l'historique.
- Rien ne se lance au démarrage du Codespace : les stagiaires font `./lab.sh up` chaque matin,
  les briques activées la veille sont toujours décommentées.

### Docker Desktop : les pièges connus

- Node Exporter voit la machine virtuelle Linux de Docker Desktop, pas le Mac ou le PC. Les
  chiffres (CPU, RAM, disques) sont ceux de la VM. Je le dis pendant le TP 1, c'est un bon
  prétexte pour expliquer comment Docker Desktop fonctionne.
- Sur Windows, si `lab.ps1` est bloqué : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- Ports 3000, 5001, 5002, 8080, 9090, 9091, 9092, 9093, 9100, 9115, 9121, 10902 doivent être libres.
- Le piège du jour 1 : un binaire du matin qui tourne encore quand on lance les conteneurs
  (`port is already allocated`). `Ctrl+C` dans le terminal du binaire.
- Sur Mac, `./lab.sh chaos cpu` fait chauffer la VM, pas la machine. C'est suffisant pour l'alerte.

## Comment lire ce guide

Chaque module a la même structure :

- **Objectif** et **durée**
- **Ce que je dis** : le fil du discours, avec les analogies et les anecdotes
- **Ce que je montre** : les démonstrations en direct, commande par commande
- **Exercices** ou **TP** : l'énoncé tel qu'il figure dans le guide stagiaire, puis le corrigé
  détaillé, les erreurs classiques et ce que je vérifie chez les stagiaires
- **Points de vigilance** : ce qui coince en général
- **Pas à pas** (encadrés bleu marine) : les manipulations exactes, commande par commande et clic
  par clic, sur mon Mac ou dans mes Codespaces, au moment où elles se font

Les encadrés « Anecdote » sont mes retours d'expérience. Je les raconte à ma façon, ce ne sont pas
des textes à lire.


## La veille et le matin : mes manipulations

Convention pour tout le guide : **[Mac]** = mon Mac ; **[CS-stagiaire]** = mon Codespace sur la branche `formation-2026`, que je déroule au même rythme que la salle ; **[CS-démo]** = mon Codespace sur `formation-2026-formateur`, toutes briques chaudes, pour les démonstrations et les corrigés. Les blocs « Pas à pas » qui jalonnent les trois journées sont à suivre à la lettre.

### 0.1 Vérifier que GitHub est à jour [Mac]

1. Ouvrir Safari sur https://github.com/yparent/formation-observabilite-lab/branches : les deux
   branches `formation-2026` et `formation-2026-formateur` doivent avoir un commit d'aujourd'hui ou
   d'hier. Sinon, pousser depuis le dossier `2026/formation-observabilite-lab` (commande dans
   `LISEZ-MOI-avant-mardi.md`).
2. Ouvrir https://github.com/yparent/formation-observabilite-lab/tree/formation-2026 : je dois voir
   `compose/`, `install/`, `thanos/`, `docs/stagiaire/`, et **pas** `solutions/`.

### 0.2 Créer le Codespace démo [Mac, navigateur]

1. Sur la page du dépôt, menu déroulant des branches (en haut à gauche, « main ») → choisir
   `formation-2026-formateur`.
2. Bouton vert **Code** → onglet **Codespaces** → les trois points **···** → **New with options…**
3. Branch : `formation-2026-formateur`. Region : Europe West. Machine type : **4-core** (le
   démo porte les huit briques). **Create codespace**.
4. Attendre 2 à 3 minutes : VS Code s'ouvre dans le navigateur, le terminal affiche
   l'installation de Docker, Python et jq (`postCreateCommand`). Quand le prompt revient :

```bash
./lab.sh up          # doit refuser : "Aucune brique activée"
```

5. Renommer le Codespace pour s'y retrouver : https://github.com/codespaces → à côté du
   Codespace, **···** → **Rename** → `demo-formateur`.

### 0.3 Préparer la stack démo [CS-démo]

Dans le terminal du Codespace (menu **Terminal → New Terminal**, ou Ctrl+ù) :

```bash
# activer les six briques des jours 1 et 3 (pas Thanos, pas cAdvisor)
sed -i 's|^  # - compose/0[1-6]|  - compose/0X|' docker-compose.yml
sed -i 's|0X-prometheus|01-prometheus|; s|0X-grafana|02-grafana|; s|0X-shop|03-shop|; s|0X-node|04-node|; s|0X-exporters|05-exporters|; s|0X-alerting|06-alerting|' docker-compose.yml
grep -n "^  - compose" docker-compose.yml        # six lignes attendues

# les corrigés, pour que tout tourne comme en fin de jour 3
cp solutions/jour-1/prometheus.yml prometheus/prometheus.yml
cp solutions/jour-1/targets/pushgateway.yml prometheus/targets/
cp solutions/jour-1/app.py apps/shop-api/app.py
cp solutions/jour-2/recording.yml prometheus/rules/recording.yml
cp solutions/jour-2/recording_test.yml prometheus/tests/
cp solutions/jour-2/dashboards/*.json grafana/dashboards/
cp solutions/jour-3/alerts.yml prometheus/rules/alerts.yml
cp solutions/jour-3/alertmanager.yml alertmanager/alertmanager.yml
cp solutions/jour-3/grafana-alerting.yml grafana/provisioning/alerting/formation.yml
sed -i 's|^# alerting:|alerting:|; s|^#   alertmanagers:|  alertmanagers:|; s|^#     - static_configs:|    - static_configs:|; s|^#         - targets: \["alertmanager:9093"\]|        - targets: ["alertmanager:9093"]|' prometheus/prometheus.yml

./lab.sh up                                       # première fois : 2 à 4 minutes (build des images)
sleep 40 && ./lab.sh status && ./lab.sh check && ./lab.sh test
```

Si `./lab.sh up` échoue avec `toomanyrequests` : `docker login` (compte Docker Hub gratuit), puis
relancer.

Vérifier dans le navigateur : onglet **PORTS** (à côté de TERMINAL, en bas) → ligne 9090 → icône
**globe** (Open in Browser). Prometheus s'ouvre dans un nouvel onglet, Status → Target health :
six jobs UP. Même chose pour 3000 (Grafana, `admin` / `formation` : trois dashboards dont
*TP 5 - Boutique en ligne*), 9093, 8080.

Laisser tourner 20 minutes pour avoir de l'historique, puis **arrêter le Codespace** pour ne
pas consommer le quota : https://github.com/codespaces → **···** → **Stop codespace**. Les
volumes Docker sont conservés ; demain matin, `./lab.sh up` repart avec l'historique.

### 0.4 Créer le Codespace stagiaire [Mac, navigateur]

Même manipulation qu'en 0.2 avec la branche `formation-2026`, machine **2-core**, renommé
`stagiaire`. Ne rien lancer dedans : je le déroule en direct avec la salle.

### 0.5 Le deck [Mac]

1. Ouvrir `2026/Formation-Prometheus-Grafana.pptx` dans PowerPoint.
2. **Diaporama → Configurer le diaporama** : vérifier que le mode Présentateur est coché
   (l'écran projeté montre la slide, mon écran montre la slide suivante et **les notes**, qui
   contiennent tout le texte à dire).
3. Tester une fois avec le vidéoprojecteur : Diaporama → **À partir du début**, puis vérifier que
   les notes sont sur mon écran. Si les écrans sont inversés : **Diaporama → Mode Présentateur →
   Permuter l'affichage**.
4. Police des notes trop petite ? Dans le mode Présentateur, les boutons **A+ / A−** sous les notes.

### 0.6 Mes onglets Safari, dans l'ordre

1. Le deck n'est pas dans Safari, il est dans PowerPoint (Cmd+Tab pour basculer).
2. Onglet 1 : Codespace `stagiaire` (VS Code).
3. Onglet 2 : Codespace `demo-formateur` (VS Code).
4. Onglets 3 à 6 : Prometheus, Grafana, Alertmanager, Inbox du démo (ouverts depuis l'onglet PORTS).
5. Onglet 7 : le guide formateur en PDF, chapitre du jour.

Les URLs des Codespaces ressemblent à `https://<nom>-<hash>-9090.app.github.dev` : je ne les
retape jamais, je passe par l'onglet PORTS. Elles demandent une connexion GitHub à la première
ouverture, c'est normal.

### 0.7 Ce que je vérifie à 8h30 le mardi

```bash
# [CS-démo] : relancer la stack, elle a l'historique d'hier
./lab.sh up && sleep 40 && ./lab.sh status
./lab.sh chaos reset
```

Les quatre onglets du démo répondent. Le dashboard *TP 5 - Boutique en ligne* est vert. Le deck
est ouvert sur la slide 1. Le Codespace `stagiaire` est démarré mais vide.

---

