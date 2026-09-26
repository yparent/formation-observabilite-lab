# Versions utilisées dans le lab

Figées le 26 septembre 2026. Toutes les images sont épinglées dans les briques `compose/0X-*.yml`,
et les binaires du premier matin dans `install/download.sh` / `install/download.ps1`, pour que
chaque stagiaire ait exactement le même environnement que le formateur.

| Composant | Version | Image | Notes |
|---|---|---|---|
| Prometheus | 3.13.3 (**LTS**) | `quay.io/prometheus/prometheus:v3.13.3` | Branche LTS 3.13, supportée jusqu'au 31/07/2027. Les 3.14.0 (17/08/2026) et 3.15.0 (24/09/2026) existent ; on reste volontairement sur la LTS, voir ci-dessous |
| Alertmanager | 0.34.1 | `quay.io/prometheus/alertmanager:v0.34.1` | Teams via `msteamsv2_configs` (Workflows) |
| Grafana OSS | 13.2.1 | `grafana/grafana:13.2.1` | Grafana 13 sorti le 21/04/2026 (dynamic dashboards en GA) |
| Node Exporter | 1.12.1 | `quay.io/prometheus/node-exporter:v1.12.1` | |
| Blackbox Exporter | 0.28.0 | `quay.io/prometheus/blackbox-exporter:v0.28.0` | |
| Pushgateway | 1.11.3 | `quay.io/prometheus/pushgateway:v1.11.3` | |
| Redis Exporter | 1.92.0 | `quay.io/oliver006/redis_exporter:v1.92.0` | |
| Redis | 8.x | `redis:8-alpine` | |
| cAdvisor (optionnel) | 0.55.1 | `gcr.io/cadvisor/cadvisor:v0.55.1` | brique `08-cadvisor` |
| Thanos | 0.42.4 | `quay.io/thanos/thanos:v0.42.4` | brique `07-thanos` |
| Python | 3.13 | `python:3.13-slim` | `prometheus-client` 0.26.0, Flask 3.1.3 |

Les images de la famille Prometheus sont tirées de `quay.io` (miroir officiel, mêmes binaires
que `docker.io/prom/*`) : Docker Hub limite les pulls anonymes à 10 par heure et par adresse IP
depuis 2025, et une salle de douze Codespaces ou douze postes derrière le même proxy tape dans
cette limite en dix minutes. Restent sur Docker Hub : Grafana, Redis, curl et l'image `python`
des builds ; un `docker login` avec un compte Docker Hub gratuit lève la limite à 100 par heure.

## Pourquoi la LTS

Prometheus sort une version mineure toutes les six semaines, et une mineure cesse de recevoir
des correctifs dès que la suivante sort. Une fois par an environ, une mineure est déclarée LTS :
elle reçoit pendant un an les correctifs de sécurité et de bugs graves (CVSS ≥ 7), avec au moins
un mois de recouvrement avec la LTS suivante. 3.13 est la LTS en cours (1er juillet 2026 →
31 juillet 2027) ; la précédente était la 3.5 (fin de vie le 31 juillet 2026). En production comme
en formation, on suit la LTS et on prend ses patchs ; on ne passe sur une mineure hors LTS que
pour une fonctionnalité dont on a vraiment besoin. C'est ce que dit le module 3 du jour 1.

Grafana n'a pas de LTS nommée : une majeure par an (avril-mai), une mineure tous les deux mois,
des patchs mensuels ; chaque mineure est supportée 9 mois, la dernière mineure d'une majeure
15 mois. Le choix raisonnable est de suivre les mineures avec un ou deux mois de retard, en
lisant le changelog.

## Pour mettre à jour

1. Vérifier les pages de releases : [Prometheus](https://github.com/prometheus/prometheus/releases)
   et sa [politique de LTS](https://prometheus.io/docs/introduction/release-cycle/),
   [Alertmanager](https://github.com/prometheus/alertmanager/releases),
   [Grafana](https://github.com/grafana/grafana/releases),
   [Node Exporter](https://github.com/prometheus/node_exporter/releases),
   [Thanos](https://github.com/thanos-io/thanos/releases).
2. Changer les tags dans `compose/0X-*.yml`, et les versions des binaires (Prometheus, Grafana,
   Node Exporter) dans `install/download.sh` et `install/download.ps1`.
3. Relancer `./lab.sh up` et dérouler au moins les TP 1, 4 et 6 pour vérifier que rien n'a bougé
   dans les interfaces (Grafana change souvent son UI entre deux versions majeures).
