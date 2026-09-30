# Formation Prometheus & Grafana — le lab

Bienvenue. Ce dépôt contient tout l'environnement technique de la formation (3 jours) :
une boutique en ligne instrumentée, Prometheus, Grafana, Alertmanager, une poignée
d'exporters et, pour finir, un Thanos complet. Rien à installer sur la machine à part Docker.

On ne démarre **pas** tout d'un coup. Le premier matin, vous installez Prometheus puis Grafana
à la main, à partir des binaires (dossier `install/`, voir `install/README.md`). Ensuite, la
stack se monte **brique par brique** : `docker-compose.yml` contient une liste d'`include`
commentés, un fichier par brique dans `compose/`, et chaque exercice vous dit laquelle activer.

| Brique | Fichier | Quand |
|---|---|---|
| Prometheus | `compose/01-prometheus.yml` | Jour 1, exercice 1.7 |
| Grafana | `compose/02-grafana.yml` | Jour 1, exercice 1.7 |
| Node Exporter | `compose/04-node-exporter.yml` | Jour 1, TP 1 |
| La boutique (shop-api + trafic) | `compose/03-shop-api.yml` | Jour 1, TP 2 |
| Redis, Blackbox, Pushgateway | `compose/05-exporters.yml` | Jour 1, TP 2 |
| Alertmanager + Inbox | `compose/06-alerting.yml` | Jour 3, exercice 3.0 |
| Thanos (Prometheus B, 2 sidecars, store, query, compact) | `compose/07-thanos.yml` | Jour 3, TP 10 |
| cAdvisor (optionnel) | `compose/08-cadvisor.yml` | si vous voulez |

Trois façons d'obtenir l'environnement, au choix.

## Option A — GitHub Codespaces (rien à installer)

1. Bouton vert **Code** → onglet **Codespaces** → **Create codespace on formation-2026**.
2. Patientez 2 à 3 minutes : Docker, Python et `jq` s'installent tout seuls. Rien ne tourne encore,
   c'est normal.
3. Quand un exercice le demande : onglet **Ports** de VS Code, icône « globe » à côté du port
   (9090 Prometheus, 3000 Grafana...).

> 2 cœurs / 8 Go suffisent pour toute la formation (60 h de quota gratuit par mois, la
> formation en consomme 25). Choisissez 4 cœurs si vous voulez plus de confort au TP 10, en
> sachant que le quota descend alors à 30 h.
>
> Rien ne s'installe sur votre poste : tout, binaires du premier matin compris, se passe dans le
> Codespace. Si `./lab.sh up` échoue avec `toomanyrequests` (limite de Docker Hub), faites
> `docker login` avec un compte Docker Hub gratuit et relancez.

## Option B — Docker sur macOS ou Linux

Prérequis : Docker Desktop (ou OrbStack, Colima, Docker Engine) avec `docker compose` v2.

```bash
git clone -b formation-2026 https://github.com/yparent/formation-observabilite-lab.git
cd formation-observabilite-lab
./install/download.sh          # jour 1, exercice 1.1 (binaires)
./lab.sh up                    # à partir de l'exercice 1.7, une fois une brique activée
```

## Option C — Docker sur Windows

Prérequis : Docker Desktop (backend WSL 2) et PowerShell.

```powershell
git clone -b formation-2026 https://github.com/yparent/formation-observabilite-lab.git
cd formation-observabilite-lab
.\install\download.ps1         # jour 1, exercice 1.1 (binaires)
.\lab.ps1 up                    # à partir de l'exercice 1.7, une fois une brique activée
```

Si PowerShell refuse d'exécuter le script : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
Depuis Git Bash, `./lab.sh` fonctionne aussi.

## Les services (une fois toutes les briques activées)

| Service | URL | Rôle |
|---|---|---|
| Grafana | http://localhost:3000 | Visualisation (login `admin` / `formation`) |
| Prometheus | http://localhost:9090 | Collecte, stockage, PromQL, règles |
| Alertmanager | http://localhost:9093 | Routage des alertes |
| Inbox | http://localhost:8080 | Reçoit les notifications (remplace Teams/Slack pendant le lab) |
| shop-api-1 / -2 | http://localhost:5001 · :5002 | La boutique (2 instances), `/metrics` |
| Node Exporter | http://localhost:9100/metrics | Métriques machine |
| Blackbox Exporter | http://localhost:9115 | Sondes HTTP / TCP / ICMP |
| Pushgateway | http://localhost:9091 | Métriques des batchs |
| Redis Exporter | http://localhost:9121/metrics | Métriques d'un service tiers |
| Thanos Query | http://localhost:10902 | Vue globale sur les deux Prometheus (TP 10) |
| Prometheus B | http://localhost:9092 | Le second Prometheus, « site B » (TP 10) |

Un générateur de trafic (`traffic`) simule des clients en continu pour que les courbes bougent.

## Commandes utiles

```
./lab.sh up | down | reset | status | reload | check | test | logs <service>
./lab.sh chaos latency on      # la boutique devient lente
./lab.sh chaos errors on       # 40 % d'erreurs 500
./lab.sh chaos cpu 300         # brûle du CPU pendant 5 min
./lab.sh chaos reset
./lab.sh traffic 20            # 20 requêtes/s
./lab.sh batch                 # un batch pousse ses métriques dans la Pushgateway
./lab.sh snapshot              # Jour 3 : snapshot TSDB
```

Même chose sous Windows avec `.\lab.ps1`.

## Rattrapage : l'application déjà instrumentée

Pour passer directement à l'exploitation (PromQL, dashboards, alertes) sans écrire
l'instrumentation, une commande met le lab dans l'état « jour 1 terminé » : briques 01 à 06
actives, application instrumentée, six jobs, Alertmanager branché, recording rules en place.
Vos fichiers sont sauvegardés dans `rattrapage/sauvegarde-<date>/`.

```
bash rattrapage/appliquer.sh
```

## Structure du dépôt

```
install/             téléchargement et lancement des binaires (jour 1, matin)
compose/             une brique Docker Compose par composant, activées une à une
apps/shop-api/       l'application fil rouge (Flask + prometheus_client), à compléter (TODO 1 à 5)
apps/traffic/        générateur de trafic
apps/inbox/          boîte de réception des notifications
prometheus/          prometheus.yml, rules/, tests/, targets/ (file_sd)
alertmanager/        alertmanager.yml + templates
blackbox/            modules de sonde
grafana/             provisioning (datasource, dashboards, alerting) + dashboards JSON
node-exporter/       textfile collector
thanos/              configuration du stockage objet et du second Prometheus (TP 10)
scripts/             batch Pushgateway
rattrapage/          l'état « jour 1 terminé » en une commande (appliquer.sh)
docs/                guides stagiaire (un par jour) et générateurs de supports
```

## En cas de souci

- `./lab.sh status` : tout doit être `Up`. Sinon `./lab.sh logs <service>`.
- `Aucune brique activée` : décommentez au moins une ligne `include` dans `docker-compose.yml`.
- Port déjà utilisé : un binaire du matin tourne encore (`Ctrl+C`), ou un autre programme ; sinon
  changez le port côté gauche dans le fichier de la brique concernée (`compose/*.yml`).
- Grafana met 20 à 30 secondes à démarrer la première fois.
- Pour repartir de zéro : `./lab.sh reset` puis `./lab.sh up`.

Versions et politique de mise à jour : voir [VERSIONS.md](VERSIONS.md).
