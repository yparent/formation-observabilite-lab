# Avant-propos

Ce guide est mon support d'animation. Il contient tout ce que je dis, tout ce que je montre et
tout ce que les stagiaires font pendant les trois jours, avec les corrigés. Il est volontairement
bavard : le jour J, je ne dois jamais avoir à réfléchir à « qu'est-ce qui vient après ? ».

Le fil conducteur des trois jours est une boutique en ligne fictive, `shop-api`, déployée en deux
instances et bombardée par un générateur de trafic. Elle est instrumentée pour de vrai
(`prometheus_client`), elle a des métriques techniques et des métriques métier, et je peux la
casser à la demande (latence, erreurs, CPU, fuite mémoire). Tout ce qu'on apprend s'applique
immédiatement à quelque chose de concret qui tourne sous les yeux des stagiaires.

## Ce que promet le programme, et où on le fait

| Programme officiel | Où | Comment |
|---|---|---|
| Présentation, architecture, cas d'usage | J1 matin | Modules 1 et 2 |
| Rappels d'installation, prise en main de l'environnement | J1 matin | Module 3 + exercices 1.1 à 1.4 |
| Configuration (fichiers, service discovery) | J1 matin | Module 4 + exercices 1.5 à 1.8 |
| Exporters, intégration de services tiers | J1 après-midi | Module 5 + TP 1 (Node Exporter) + TP 2 |
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
| Mise à l'échelle | J3 fin | Module 16 |

## Les trois règles que je me fixe

1. **Jamais plus de 20 minutes sans que les stagiaires touchent au clavier.** Chaque module
   théorique est suivi d'exercices courts. Les gros TP arrivent quand les briques sont posées.
2. **On construit, on ne détruit pas.** Le `prometheus.yml` du vendredi soir est celui du lundi
   matin enrichi étape par étape. Idem pour Grafana et Alertmanager. À la fin, chacun repart avec
   une stack complète qu'il a assemblée lui-même.
3. **Le corrigé n'est jamais donné avant d'avoir cherché.** Les stagiaires ont le guide avec les
   énoncés et quelques indices. Je projette le corrigé après un temps de recherche, jamais avant.

## Timing indicatif

Journées de 9h00 à 17h30, pause déjeuner 12h30-14h00, pauses 15 minutes vers 10h45 et 15h45.
Soit environ 6h45 de travail effectif par jour. Les durées indiquées dans les modules sont des
cibles ; les TP 4, 5 et 6 sont ceux qui débordent le plus souvent, les bonus sont là pour les
rapides.

Si le groupe est en retard, ce qui peut sauter sans casser la suite :
- J1 : exercice 1.8 (relabeling), TP 2 partie 5 (bonus cardinalité)
- J2 : série B exercices 2.19 à 2.22, TP 5 partie 4 (heatmap), exercice 2.33 (service account)
- J3 : TP 6 parties 8 et 9 (silences, mute), TP 9 partie 4 (basic auth)

## Matériel

- Ce guide (PDF) et le deck (PowerPoint), dossier `docs/formateur/`
- Les trois guides stagiaires, un par jour, dossier `docs/stagiaire/` (PDF ou Markdown pour Notion).
  Je ne distribue le guide du jour que le matin même.
- Le dépôt GitHub, branche `formation-2026` : https://github.com/yparent/formation-observabilite-lab
- Les corrigés dans `solutions/` de la branche `formation-2026-formateur` (jamais distribuée)

## L'environnement technique

Tout tourne en conteneurs. Trois modes possibles pour les stagiaires, à valider **avant** la
formation avec le client :

| Mode | Avantages | Points d'attention |
|---|---|---|
| GitHub Codespaces | Rien à installer, identique pour tous | Compte GitHub obligatoire, quota gratuit 120 h-cœur/mois (largement suffisant pour 3 jours en machine 2 cœurs, un peu juste en 4 cœurs), les URLs passent par un proxy |
| Docker Desktop macOS/Linux | Rapide, tout en local | Docker doit être installé et fonctionnel la veille |
| Docker Desktop Windows | Idem | Backend WSL 2 obligatoire, PowerShell pour `lab.ps1`, fins de ligne gérées par `.gitattributes` |

Mon conseil : envoyer un mail une semaine avant avec le lien du dépôt et demander à chacun de
lancer `./lab.sh up` (ou de créer son Codespace) et de m'envoyer une capture de Grafana. Ça évite
de perdre la première heure.

### Ce qui doit tourner à 9h00 le jour 1

- Ma propre stack lancée et chaude depuis au moins 30 minutes (les graphiques ont besoin d'historique).
- Le deck projeté, la fenêtre du navigateur avec un onglet par service.
- Un terminal avec le dépôt ouvert.
- Si Teams est utilisé pour le TP 7 : le flux Workflows créé dans un canal de test, l'URL sous la main.

### Codespaces : les pièges connus

- Les ports sont redirigés vers des URLs `https://<nom>-<port>.app.github.dev`. Dans Grafana, les
  liens « localhost » du dashboard d'accueil ne fonctionnent donc pas : il faut passer par l'onglet
  Ports. Je le dis dès le début.
- La première ouverture d'un port redirigé affiche une page d'avertissement GitHub, c'est normal.
- Un Codespace s'arrête tout seul après 30 minutes d'inactivité. Les données Docker (volumes) sont
  conservées tant que le Codespace n'est pas supprimé : le lendemain, `./lab.sh up` repart avec
  l'historique.
- `postStartCommand` relance la stack à chaque démarrage du Codespace.

### Docker Desktop : les pièges connus

- Node Exporter voit la machine virtuelle Linux de Docker Desktop, pas le Mac ou le PC. Les
  chiffres (CPU, RAM, disques) sont ceux de la VM. Je le dis pendant le TP 1, c'est un bon
  prétexte pour expliquer comment Docker Desktop fonctionne.
- Sur Windows, si `lab.ps1` est bloqué : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- Ports 3000, 5001, 5002, 8080, 9090, 9091, 9093, 9100, 9115, 9121 doivent être libres.
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
