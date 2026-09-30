#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Thanos express : active (ou retire) la brique 07 en une commande.
#
#   bash rattrapage/thanos.sh on    # six conteneurs de plus, Querier sur le port 10902
#   bash rattrapage/thanos.sh off   # retour à la stack du jour, les données sont conservées
#
# Ce que fait "on" :
#   1. active les blocs de 10 minutes dans compose/01-prometheus.yml (obligatoire pour le sidecar)
#   2. décommente compose/07-thanos.yml dans docker-compose.yml
#   3. ajoute la source de données "Thanos" dans Grafana
#   4. démarre le tout
# ---------------------------------------------------------------------------
set -e
cd "$(dirname "$0")/.."
DS=grafana/provisioning/datasources/thanos.yml

case "${1:-on}" in
  on)
    sed -i.bak 's|^\( *\)# *\(- --storage.tsdb.m[a-z]*-block-duration=10m\)|\1\2|' compose/01-prometheus.yml
    sed -i.bak 's|^\( *\)# *- compose/07-thanos.yml|\1- compose/07-thanos.yml|' docker-compose.yml
    rm -f compose/01-prometheus.yml.bak docker-compose.yml.bak
    cp rattrapage/thanos-datasource.yml "$DS"
    docker compose up -d --remove-orphans
    docker compose restart grafana >/dev/null
    echo
    echo "Thanos démarré. Querier : port 10902 (onglet PORTS). Grafana : source de données « Thanos »."
    echo "Premiers blocs dans le bucket d'ici 10 à 20 minutes."
    ;;
  off)
    sed -i.bak 's|^\( *\)\(- --storage.tsdb.m[a-z]*-block-duration=10m\)|\1# \2|' compose/01-prometheus.yml
    sed -i.bak 's|^\( *\)- compose/07-thanos.yml|\1# - compose/07-thanos.yml|' docker-compose.yml
    rm -f compose/01-prometheus.yml.bak docker-compose.yml.bak "$DS"
    docker compose up -d --remove-orphans
    docker compose restart grafana >/dev/null
    echo "Thanos retiré. La stack du jour tourne comme avant."
    ;;
  *) echo "Usage : bash rattrapage/thanos.sh on|off"; exit 1 ;;
esac
docker compose ps --format 'table {{.Name}}\t{{.Status}}'
