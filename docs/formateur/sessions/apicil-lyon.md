# Session Apicil (Lyon) — déroulé sur 21 h

Le programme de la formation est découpé pour trois jours de 9h00 à 17h30. Chez Apicil, le
cadre est différent et non négociable : mardi et mercredi 7h30 (9h00–12h30 / 13h30–17h30),
jeudi 6h00 (9h00–12h30 / 13h30–16h00, fin ferme), soit 21 h. Tous les concepts passent mardi et
mercredi, chacun suivi d'exercices courts ; le jeudi est réservé à la fin de la pratique
alerting, puis à un TP final en trois paliers. Ce document est le déroulé de cette session ; le
guide formateur reste la référence pour le contenu de chaque séquence.

## Ce qui change par rapport au déroulé standard

| Standard (3 × 6h45) | Apicil (7h30 / 7h30 / 6h00) |
|---|---|
| Jour 1 complet | Mardi, à l'identique (l'après-midi de 4 h absorbe le TP 2 complet et le bonus 1.8) |
| Jour 2 : PromQL + Grafana (TP 3, 4, 5) + droits | Mercredi matin : PromQL avec des séries réduites (6 exercices au lieu de 10 et 12), TP 3, Grafana. Mercredi après-midi : TP 4, puis tout l'alerting en concepts et un TP 6 réduit |
| Jour 3 : alerting, exploitation, Thanos, war game | Jeudi matin : TP 7 et TP 8 (fin de la pratique alerting). Jeudi 11h–15h30 : TP final |
| TP 5 (dashboard boutique) | Devient le palier 1 du TP final |
| TP 6 parties 3 à 5 (routage complet, inhibition, plages horaires) | Deviennent le palier 2 du TP final |
| TP 8 partie 4 (alerting Grafana en code) + war game | Deviennent le palier 3 du TP final |
| Exercices 2.30–2.33 (droits), TP 9 (sauvegarde), TP 10 (Thanos) | Droits et sauvegarde : exposé seulement. Thanos : étape bonus du TP final (parties 1 et 2 du TP 10), et les guides restent dans le dépôt pour le faire chez soi |
| Évaluation finale (annexe A) | Quiz de 8 questions, 7 minutes, pendant le débrief du jeudi |

Les guides stagiaires restent les mêmes : le guide « jour 1 » sert le mardi, le « jour 2 » le
mercredi (matin et début d'après-midi), le « jour 3 » couvre la fin du mercredi et le jeudi.
Je le dis dès le mardi matin pour éviter la confusion, et je distribue le sujet du TP final
(dernière section de ce document) le jeudi à 11h00.

Environnement : chez un assureur, le poste de travail est verrouillé et le réseau filtré.
GitHub Codespaces est le mode à privilégier, et il suffit pour **tout** le programme, binaires du
mardi matin compris : rien ne s'installe sur le poste, il faut un navigateur, un compte GitHub et
un réseau qui laisse passer github.com et *.app.github.dev (à valider avec la DSI Apicil avant la
session). Docker Desktop en local n'est un plan B que si les stagiaires sont administrateurs de
leur poste et que le proxy laisse passer les registres d'images ; la checklist du mercredi soir
le vérifie.

---

## Mardi — 7h30 — Voir : architecture et collecte

Horaires 9h00–12h30 et 13h30–17h30. Pauses 10h15 et 15h30.

| Heure | Séquence | Durée | Objectif | Modalité | Support |
|---|---|---|---|---|---|
| 9h00 | Accueil, tour de table, cadrage, questionnaire de positionnement | 20 min | Connaître les pannes vécues et les attentes ; annoncer le cadre horaire et le TP final du jeudi | Échange | Deck (ouverture), annexe A du guide formateur |
| 9h20 | Module 1 — Pourquoi l'observabilité | 25 min | Distinguer monitoring et observabilité, les trois signaux, pull contre push | Exposé | Deck module 1 |
| 9h45 | Module 2 — Architecture de Prometheus, modèle de données, quatre types | 30 min | Savoir lire une page `/metrics` et expliquer les composants | Exposé + démo | Deck module 2, schémas « composants » et « TSDB » |
| 10h15 | Pause | 15 min | | | |
| 10h30 | Module 3 — Installer à la main : exercices 1.1 à 1.4 | 55 min | Lancer Prometheus puis Grafana en binaires, brancher la datasource à la main | Exercices guidés | `install/`, guide stagiaire J1, deck module 3 |
| 11h25 | Module 4 — Configuration : exposé, puis exercices 1.5 et 1.6 | 35 min | Valider, recharger, casser et comprendre `prometheus.yml` | Exposé (15) + exercices (20) | Deck module 4, guide J1 |
| 12h00 | Exercice 1.7 — Des binaires aux conteneurs | 30 min | Activer les briques 01 et 02, comprendre ce que le provisioning fait tout seul | Exercice | `docker-compose.yml`, `compose/`, schéma « binaire → conteneur » |
| 12h30 | Déjeuner | 60 min | | | |
| 13h30 | Module 5 — Les exporters | 25 min | Choisir et configurer un exporter ; Node Exporter, Blackbox, Pushgateway | Exposé + démo | Deck module 5, schéma « relabeling Blackbox » |
| 13h55 | TP 1 — Node Exporter : de la machine à Prometheus | 55 min | Brique 04, job `node`, indicateurs CPU/mémoire/disque, collectors, textfile | TP | Guide J1 TP 1, corrigé guide formateur |
| 14h50 | Module 6 — Instrumenter son application | 25 min | Types, nommage, labels interdits, RED | Exposé | Deck module 6, schéma « RED » |
| 15h15 | TP 2 partie 1 — Brancher l'application | 15 min | Brique 03, job `shop-api`, ce qui existe et ce qui manque | TP | Guide J1 TP 2 |
| 15h30 | Pause | 15 min | | | |
| 15h45 | TP 2 parties 2 à 5 — Instrumentation, Redis, Blackbox, Pushgateway | 85 min | Les cinq TODO de `app.py`, brique 05, relabeling, `honor_labels`, `file_sd` ; bonus cardinalité et exercice 1.8 pour les rapides | TP | Guide J1 TP 2, `apps/shop-api/app.py`, corrigé `solutions/jour-1/` |
| 17h10 | Récap, quiz, état attendu ce soir | 20 min | Cinq briques actives, six jobs UP, cinq TODO faits ; ne pas faire `reset` | Échange | Deck récap J1 |
| 17h30 | Fin | | | | |

Ce que je vérifie avant de laisser partir : `./lab.sh status` chez chacun, six jobs UP dans
Target health, `shop_orders_total` visible sur `/metrics`. Ceux qui ont un trou repartent du
corrigé projeté. Le mercredi matin dépend de cet état.

---

## Mercredi — 7h30 — Comprendre, puis alerter

Horaires 9h00–12h30 et 13h30–17h30. Pauses 10h15 et 15h30.

| Heure | Séquence | Durée | Objectif | Modalité | Support |
|---|---|---|---|---|---|
| 9h00 | Rappel, état des stacks | 10 min | `./lab.sh up`, six jobs UP, une heure d'historique | Échange | — |
| 9h10 | Module 7 — PromQL, les fondations | 35 min | Sélecteurs, types de résultats, opérateurs, agrégations | Exposé + démo | Deck module 7 |
| 9h45 | Série A réduite : 2.1, 2.2, 2.4, 2.6, 2.8, 2.10 | 30 min | Sélectionner, filtrer, agréger, `topk`, comptages imbriqués | Exercices | Guide J2 série A |
| 10h15 | Pause | 15 min | | | |
| 10h30 | Module 8 — PromQL avancé | 35 min | `rate`, `increase`, `histogram_quantile`, jointures, `absent`, recording rules | Exposé + démo | Deck module 8 |
| 11h05 | Série B réduite : 2.11, 2.14, 2.15, 2.17, 2.20, 2.21 | 30 min | Débit, taux d'erreur, p95, CPU, `group_left`, `absent` | Exercices | Guide J2 série B |
| 11h35 | TP 3 — Recording rules et tests unitaires | 25 min | Sept règles dans `recording.yml`, `promtool test rules` | TP | Guide J2 TP 3, corrigé `solutions/jour-2/` |
| 12h00 | Module 9 — Grafana : sous le capot, visualisations, variables, transformations | 30 min | Choisir une visualisation, rendre un dashboard lisible | Exposé + démo | Deck module 9, captures Grafana 13 |
| 12h30 | Déjeuner | 60 min | | | |
| 13h30 | Module 10 — Provisioning, utilisateurs, droits, OSS / Enterprise | 15 min | Tout en fichiers, droits par team et dossier (exposé seul, les exercices 2.30–2.33 restent en autonomie) | Exposé | Deck module 10 |
| 13h45 | TP 4 — Dashboard paramétrable pour un serveur Linux | 55 min | Variable `$instance`, Stat, Gauge, Time series, Bar gauge, Table avec jointure ; l'étape 4 (dispo) est optionnelle | TP | Guide J2 TP 4, image « résultat attendu » |
| 14h40 | Module 11 — Philosophie de l'alerting, anatomie d'une règle | 20 min | Symptômes, pas causes ; `for`, `keep_firing_for`, labels, annotations | Exposé | Deck module 11, schéma « cycle d'une alerte » |
| 15h00 | Modules 12, 13 et 14 — Alertmanager, notifications tierces, alerting Grafana | 30 min | Arbre de routage, regroupement, inhibition, silences ; Teams via Workflows, Slack, PagerDuty, GitHub ; correspondance Alertmanager ↔ Grafana | Exposé + démo | Deck modules 12–14, schéma « arbre de routage », annexe E |
| 15h30 | Pause | 15 min | | | |
| 15h45 | Modules 15 et 16 en flash — Performances, sauvegarde, échelle, Thanos | 15 min | Ce qui coûte, snapshot, options de mise à l'échelle, ce que fait Thanos (l'étape bonus de jeudi) | Exposé | Deck modules 15–16, schémas « échelle » et « Thanos » |
| 16h00 | Exercice 3.0 — Brancher l'Alertmanager | 10 min | Brique 06, bloc `alerting`, Alertmanager discovery | Exercice | Guide J3 exercice 3.0 |
| 16h10 | TP 6 réduit — Deux alertes, casser, router | 70 min | `ShopHighErrorRate` et `ShopCheckoutSlow` (partie 1 réduite), chronométrer pending/firing/notification (partie 2), routes `critical → astreinte-teams` et `team=boutique → boutique-slack` (partie 3 réduite) | TP | Guide J3 TP 6 parties 1 à 3, corrigé `solutions/jour-3/` |
| 17h20 | Récap, annonce du jeudi, distribution de la checklist stagiaire | 10 min | Ce qui doit tourner demain matin ; le sujet du TP final sera donné à 11h00 | Échange | Deck récap, checklist ci-dessous |
| 17h30 | Fin | | | | |

Le TP 6 s'arrête après la partie 3 réduite : inhibition, silences et plages horaires sont
gardés pour le palier 2 du TP final. Je le dis clairement pour que personne ne coure.

---

## Jeudi — 6h00 — Finir l'alerting, puis le TP final

Horaires 9h00–12h30 et 13h30–16h00, fin ferme. Pause 9h55.

| Heure | Séquence | Durée | Objectif | Modalité | Support |
|---|---|---|---|---|---|
| 9h00 | Rappel, état des stacks | 10 min | Alertmanager actif, deux alertes en place, Inbox joignable | Échange | — |
| 9h10 | TP 7 — Alerte CPU élevé, notification dans Teams, message personnalisé | 45 min | Fin de la pratique Alertmanager : règle testée, route, template `formation.tmpl`, `amtool template render` | TP | Guide J3 TP 7 |
| 9h55 | Pause | 15 min | | | |
| 10h10 | TP 8 réduit — Alerting Grafana, de l'interface à l'export | 50 min | Contact points, politique, une règle multi-dimensionnelle dans l'interface, export YAML (parties 1 à 3 ; la partie 4 est le palier 3 du TP final) | TP | Guide J3 TP 8 |
| 11h00 | Lancement du TP final — cadre, objectifs, paliers, règles du jeu | 15 min | Chacun sait ce qu'il doit montrer à 15h30, quel que soit son avancement | Exposé | Sujet du TP final (ci-dessous), projeté et distribué par binôme |
| 11h15 | Vérification de l'environnement | 15 min | Chaque stagiaire coche la checklist ; personne ne démarre avec une stack bancale | Exercice | Checklist stagiaire ci-dessous |
| 11h30 | TP final — palier 1 : le dashboard d'astreinte de la boutique | 60 min | Un dashboard provisionné, sous cadenas, qui montre le chaos | TP | Sujet du TP final, guide J2 TP 5 en référence |
| 12h30 | Déjeuner | 60 min | | | |
| 13h30 | TP final — palier 2 : les alertes métier et le routage complet | 60 min | Quatre alertes de plus, testées, inhibition, plage horaire ; une carte Teams dans l'Inbox | TP | Sujet du TP final, guide J3 TP 6 parties 3 à 5 en référence |
| 14h30 | TP final — palier 3 : alerting Grafana en code et diagnostic à l'aveugle | 45 min | Règle Grafana provisionnée, puis diagnostic d'une panne inconnue en cinq minutes | TP | Sujet du TP final, guide J3 TP 8 partie 4 |
| 15h15 | Étape bonus — Thanos en quinze minutes (pour ceux qui ont fini) ; rattrapage pour les autres | 15 min | Brique 07, déduplication dans le Querier | TP | Guide J3 TP 10 parties 1 et 2 |
| 15h30 | Débrief collectif : chaque binôme montre son palier le plus avancé, transposition chez Apicil | 15 min | Ce qui a été construit, ce qui manque, par quoi commencer lundi | Échange | Paperboard |
| 15h45 | Quiz d'acquis (8 questions), questionnaire de satisfaction, clôture | 15 min | Mesurer, remercier, libérer à 16h00 | Exercice individuel | Annexe A, questions 1, 3, 4, 6, 7, 8, 11 et 15 ; questionnaire Sparks |
| 16h00 | Fin ferme | | | | |

Tenue de l'horaire : à 15h30 je coupe, même au milieu d'un palier. C'est prévu : chaque palier
produit un résultat montrable, et le débrief part de ce que chacun a. Le palier 3 et le bonus
sont explicitement « si le temps le permet ».

---

## Le TP final — Mettre la boutique sous surveillance, de bout en bout

**Mise en situation.** La boutique passe en production lundi. L'astreinte veut un écran, des
alertes qui ne réveillent que pour de bonnes raisons, et des notifications lisibles dans Teams.
Tout doit être dans Git : un `git clone` doit suffire à reconstruire la surveillance.

**Règles du jeu.** En binôme. Aucun concept nouveau : tout a été vu mardi et mercredi, les
guides des trois jours restent ouverts. Chaque palier se termine par une démonstration de deux
minutes que je viens voir ; on ne passe au palier suivant qu'après. Le corrigé de chaque palier
existe dans `solutions/` et je le projette à la fin, pas avant.

### Palier 1 — Le dashboard d'astreinte (11h30–12h30)

Résultat visible : un dashboard « Boutique — astreinte » dans le dossier *Formation*,
provisionné par fichier (cadenas), qui montre en direct l'effet de `./lab.sh chaos latency on`.

1. Variables `instance` et `route` (multi-valeur, *All*), chaînées.
2. Row *Métier* : chiffre d'affaires par heure (Stat, `currencyEUR`), commandes par minute,
   stock par produit (Bar gauge LCD, seuil à 15), répartition des moyens de paiement.
3. Row *RED* : débit par route (empilé), taux d'erreur avec seuil rouge à 5 %, p50/p95/p99 à
   partir des recording rules du TP 3.
4. Annotation `changes(shop_chaos_mode[1m]) > 0` et un lien vers le dashboard du TP 4.
5. Export as code (Model Classic, JSON) → `grafana/dashboards/boutique-astreinte.json`, restart,
   cadenas.

Démonstration : chaos latency on, le p95 monte, l'annotation apparaît, le dashboard est bien
sous cadenas. Référence : guide jour 2, TP 5.

### Palier 2 — Les alertes métier et le routage complet (13h30–14h30)

Résultat visible : une carte Teams dans l'Inbox avec le nom de l'alerte, la valeur, l'instance
et un lien vers le runbook ; et une alerte qui ne part **pas** quand l'instance est éteinte.

1. Dans `rules/alerts.yml`, ajoutez `ShopNoOrders` (aucune commande depuis 10 min alors qu'il
   y a du trafic), `ShopStockLow` (info, équipe logistique), `BlackboxProbeFailed`,
   `BackupTooOld` (dernière sauvegarde de plus de 24 h, sur la métrique poussée par le batch).
   `promtool check rules`, puis un test unitaire pour `ShopNoOrders`.
2. Dans `alertmanager.yml` : receiver `infra-inbox`, route `team = infra` avec
   `mute_time_intervals` nuit et week-end (deux intervalles, coupés à minuit), inhibition
   `TargetDown` → erreurs et latence sur la même instance.
3. `amtool config routes test` pour quatre combinaisons de labels, puis
   `./lab.sh chaos errors on`, chronomètre, carte Teams dans l'Inbox.
4. `docker compose stop shop-api-2` : `ShopHighErrorRate` sur cette instance doit être inhibée.
   Redémarrez-la.

Démonstration : l'Inbox avec la carte, la page *Alerts* d'Alertmanager avec l'inhibition
visible. Référence : guide jour 3, TP 6 parties 3 à 5.

### Palier 3 — Alerting Grafana en code, puis diagnostic à l'aveugle (14h30–15h15)

Résultat visible : la règle Grafana du TP 8 et son contact point provisionnés par fichier,
sous cadenas, avec un lien vers le panel du dashboard du palier 1 ; puis une fiche de
diagnostic remplie en cinq minutes sur une panne que vous ne connaissez pas.

1. Export YAML de la règle et du contact point → `grafana/provisioning/alerting/formation.yml`,
   intervalle nuit en deux morceaux, `docker compose restart grafana`, cadenas.
2. Sur la règle, ajoutez `__dashboardUid__` et `__panelId__` vers le panel *Taux d'erreur* du
   palier 1.
3. À mon signal, je casse la boutique d'une façon que vous ne connaissez pas, sur une seule
   instance. Sans toucher à la configuration, par écrit : quoi, où, depuis quand, quelle alerte
   a sonné, laquelle aurait dû, première action.

Démonstration : la fiche de diagnostic, et l'alerte Grafana qui pointe sur le bon panel.
Référence : guide jour 3, TP 8 partie 4 et war game.

### Bonus — Thanos en quinze minutes

Pour ceux qui ont validé les trois paliers : brique `compose/07-thanos.yml` et les deux flags de
`compose/01-prometheus.yml`, `./lab.sh up`, puis sur http://localhost:10902 : la page *Stores*,
`up{job="shop-api"}` avec et sans déduplication, où est passé le label `replica`. Référence :
guide jour 3, TP 10 parties 1 et 2. Les parties 3 et 4 se font chez soi.

### Ce que je casse pour le palier 3

Une seule instance, jamais les deux (le script casse les deux) :

```
curl -X POST http://localhost:5002/chaos/latency/on          # shop-api-2 seulement
curl -X POST "http://localhost:5001/chaos/cpu?seconds=240"   # CPU depuis shop-api-1
docker compose stop redis-exporter                            # un exporter qui disparaît
```

Je varie d'un binôme à l'autre si les postes sont en Codespaces (chacun a sa stack) : je donne
la commande à exécuter à l'un des deux, l'autre diagnostique.

---

## Checklist du mercredi soir (formateur)

À dérouler après 17h30, avant de quitter la salle ; tout ce qui est rouge se règle le soir
même ou se contourne le lendemain à 9h00.

**Accès et comptes**
- [ ] Chaque stagiaire a un compte GitHub et a créé son Codespace (ou : Docker Desktop
      fonctionne sur son poste, avec les droits administrateur).
- [ ] Depuis le réseau Apicil : github.com, *.app.github.dev, grafana.com (import du dashboard
      1860, optionnel), prometheus.io (sonde Blackbox, optionnel) sont joignables. Sinon, les
      étapes concernées sont marquées « ignorer ».
- [ ] Le dépôt est à jour sur la branche `formation-2026` ; les stagiaires ont fait
      `git pull` (ou le Codespace a été recréé) si j'ai poussé un correctif dans la journée.
- [ ] La branche `formation-2026-formateur` (corrigés) n'est pas accessible aux stagiaires.

**Quotas et ressources**
- [ ] Codespaces : quota restant suffisant pour une journée (120 h-cœur/mois en gratuit ; une
      machine 4 cœurs consomme 4 h-cœur par heure). Un Codespace arrêté ne consomme pas.
- [ ] Machine 4 cœurs / 8 Go pour ceux qui feront le bonus Thanos ; 2 cœurs suffisent sinon.
- [ ] Espace disque du Codespace : `df -h /` sous 80 %.
- [ ] Docker Desktop (plan B) : 8 Go alloués, ports 3000, 5001, 5002, 8080, 9090, 9091, 9092,
      9093, 9100, 9115, 9121, 10902 libres.

**État de chaque stack (à faire faire par chacun avant de partir, je passe derrière)**
- [ ] Six briques actives (01 à 06), `./lab.sh status` tout `Up`.
- [ ] `./lab.sh check` et `./lab.sh test` passent.
- [ ] Target health : six jobs UP ; Alertmanager discovery : une cible.
- [ ] `recording.yml` du TP 3 en place (les paliers 1 et 2 en dépendent).
- [ ] Dashboard TP 4 sauvegardé dans le dossier *Formation* (le palier 1 y fait un lien).
- [ ] `alerts.yml` contient `ShopHighErrorRate` et `ShopCheckoutSlow` ; `alertmanager.yml`
      a les receivers `astreinte-teams` et `boutique-slack`.
- [ ] Inbox joignable sur le port 8080 et une notification déjà reçue dans la journée.
- [ ] Chaos remis à zéro : `./lab.sh chaos reset`.
- [ ] Personne n'a fait `./lab.sh reset` : on veut l'historique pour les dashboards.

**Outils et salle**
- [ ] Ma stack de démonstration avec les six briques, chaude, et une seconde copie prête avec
      les corrigés des trois paliers (pour projeter à 15h30).
- [ ] Images tirées et construites chez moi (`docker compose pull`, `docker compose build`),
      y compris la brique 07 pour le bonus.
- [ ] Flux Teams Workflows réel créé dans un canal de test, URL sous la main (sinon l'Inbox
      suffit, je le dis à 11h00).
- [ ] Sujet du TP final imprimé (une feuille par binôme) et checklist stagiaire (une par
      personne).
- [ ] Quiz d'acquis (8 questions de l'annexe A) et questionnaire de satisfaction Sparks
      imprimés ou lien prêt.
- [ ] Vidéoprojecteur, paperboard, minuteur visible pour le TP final.

## Checklist stagiaire (jeudi 11h15, avant le palier 1)

Cochez tout avant de commencer. Une case vide = on la règle avec le formateur avant midi.

- [ ] `./lab.sh status` : douze conteneurs `Up`, aucun `Restarting`.
- [ ] `./lab.sh check` : `SUCCESS` pour Prometheus et Alertmanager.
- [ ] `./lab.sh test` : les tests de règles passent.
- [ ] Prometheus → Status → Target health : six jobs, tous UP.
- [ ] Prometheus → Status → Alertmanager discovery : `alertmanager:9093` actif.
- [ ] Prometheus → Alerts : `ShopHighErrorRate` et `ShopCheckoutSlow` présentes (inactives).
- [ ] Grafana : connexion `admin` / `formation`, dossier *Formation* avec le dashboard du TP 4,
      datasource Prometheus sous cadenas.
- [ ] Grafana → Alerting → Contact points : `inbox-grafana` et `teams-astreinte`, bouton *Test* OK.
- [ ] Inbox (port 8080) : au moins une notification reçue.
- [ ] `job:http_requests:rate5m` renvoie des séries dans Prometheus (recording rules du TP 3).
- [ ] `./lab.sh chaos reset` fait ; la boutique répond en moins de 100 ms.
- [ ] Un terminal, un éditeur, les trois guides ouverts.
