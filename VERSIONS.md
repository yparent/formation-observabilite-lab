# Versions utilisées dans le lab

Figées le 26 septembre 2026. Toutes les images sont épinglées dans `docker-compose.yml`
pour que chaque stagiaire ait exactement le même environnement que le formateur.

| Composant | Version | Image | Notes |
|---|---|---|---|
| Prometheus | 3.15.0 | `prom/prometheus:v3.15.0` | Sortie le 25/09/2026. Branche LTS : 3.13.x |
| Alertmanager | 0.34.1 | `prom/alertmanager:v0.34.1` | Teams via `msteamsv2_configs` (Workflows) |
| Grafana OSS | 13.2.1 | `grafana/grafana:13.2.1` | Grafana 13 sorti le 21/04/2026 (dynamic dashboards en GA) |
| Node Exporter | 1.12.1 | `prom/node-exporter:v1.12.1` | |
| Blackbox Exporter | 0.28.0 | `prom/blackbox-exporter:v0.28.0` | |
| Pushgateway | 1.11.3 | `prom/pushgateway:v1.11.3` | |
| Redis Exporter | 1.92.0 | `oliver006/redis_exporter:v1.92.0` | |
| Redis | 8.x | `redis:8-alpine` | |
| cAdvisor (optionnel) | 0.60.5 | `gcr.io/cadvisor/cadvisor:v0.60.5` | profil `cadvisor` |
| Python | 3.13 | `python:3.13-slim` | `prometheus-client` 0.26.0, Flask 3.1.3 |

## Pour mettre à jour

1. Vérifier les pages de releases : [Prometheus](https://github.com/prometheus/prometheus/releases),
   [Alertmanager](https://github.com/prometheus/alertmanager/releases),
   [Grafana](https://github.com/grafana/grafana/releases),
   [Node Exporter](https://github.com/prometheus/node_exporter/releases).
2. Changer les tags dans `docker-compose.yml`.
3. Relancer `./lab.sh up` et dérouler au moins les TP 1, 4 et 6 pour vérifier que rien n'a bougé
   dans les interfaces (Grafana change souvent son UI entre deux versions majeures).
