# Formation Prometheus & Grafana — le lab

Bienvenue. Ce dépôt contient tout l'environnement technique de la formation (3 jours) :
une boutique en ligne instrumentée, Prometheus, Grafana, Alertmanager et une poignée
d'exporters, le tout en conteneurs. Rien à installer sur la machine à part Docker.

Trois façons de le lancer, au choix.

## Option A — GitHub Codespaces (rien à installer)

1. Bouton vert **Code** → onglet **Codespaces** → **Create codespace on formation-2026**.
2. Patientez 2 à 3 minutes : la stack démarre toute seule.
3. Onglet **Ports** de VS Code : cliquez sur l'icône « globe » de Grafana (3000), Prometheus (9090)...

> Choisissez une machine à 4 cœurs / 8 Go si on vous le propose. La stack tient dans 2 cœurs,
> mais les exercices « chaos » du jour 3 sont plus parlants avec un peu de marge.

## Option B — Docker sur macOS ou Linux

Prérequis : Docker Desktop (ou OrbStack, Colima, Docker Engine) avec `docker compose` v2.

```bash
git clone -b formation-2026 https://github.com/yparent/formation-observabilite-lab.git
cd formation-observabilite-lab
./lab.sh up
```

## Option C — Docker sur Windows

Prérequis : Docker Desktop (backend WSL 2) et PowerShell.

```powershell
git clone -b formation-2026 https://github.com/yparent/formation-observabilite-lab.git
cd formation-observabilite-lab
.\lab.ps1 up
```

Si PowerShell refuse d'exécuter le script : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
Depuis Git Bash, `./lab.sh` fonctionne aussi.

## Les services

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
./lab.sh longterm              # Jour 3 : Prometheus longue durée (remote_write)
./lab.sh snapshot              # Jour 3 : snapshot TSDB
```

Même chose sous Windows avec `.\lab.ps1`.

## Structure du dépôt

```
apps/shop-api/       l'application fil rouge (Flask + prometheus_client)
apps/traffic/        générateur de trafic
apps/inbox/          boîte de réception des notifications
prometheus/          prometheus.yml, rules/, tests/, targets/ (file_sd)
alertmanager/        alertmanager.yml + templates
blackbox/            modules de sonde
grafana/             provisioning (datasource, dashboards, alerting) + dashboards JSON
node-exporter/       textfile collector
scripts/             batch Pushgateway
docs/                guides stagiaire (un par jour)
```

## En cas de souci

- `./lab.sh status` : tout doit être `Up`. Sinon `./lab.sh logs <service>`.
- Port déjà utilisé : arrêtez le programme qui l'occupe ou changez le port côté gauche dans `docker-compose.yml`.
- Grafana met 20 à 30 secondes à démarrer la première fois.
- Pour repartir de zéro : `./lab.sh reset` puis `./lab.sh up`.

Versions et politique de mise à jour : voir [VERSIONS.md](VERSIONS.md).
