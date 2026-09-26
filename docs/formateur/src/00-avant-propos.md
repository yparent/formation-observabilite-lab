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

Les encadrés « Anecdote » sont mes retours d'expérience. Je les raconte à ma façon, ce ne sont pas
des textes à lire.
