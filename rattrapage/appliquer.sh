#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Rattrapage : met le lab dans l'état « application instrumentée, tout est branché ».
#
# À lancer depuis la racine du dépôt (Codespaces, Mac, Linux, Git Bash sous Windows) :
#
#   git fetch origin
#   git checkout origin/formation-2026 -- rattrapage/
#   bash rattrapage/appliquer.sh
#
# Ce que fait le script (il peut être relancé autant de fois que nécessaire) :
#   1. sauvegarde vos fichiers actuels dans rattrapage/sauvegarde-<date>/
#   2. arrête les binaires Prometheus / Grafana éventuellement encore lancés (exercices 1.1 à 1.4)
#   3. active les briques 01 à 06 dans docker-compose.yml
#   4. dépose l'application instrumentée, prometheus.yml (six jobs + alerting),
#      la cible Pushgateway, les recording rules et leurs tests
#   5. démarre la stack, reconstruit shop-api, valide et recharge la configuration
#   6. pousse une première fois le batch dans la Pushgateway
#   7. affiche l'état des cibles : les dix doivent être UP
# ---------------------------------------------------------------------------
set -e
cd "$(dirname "$0")/.."
R=rattrapage

vert()  { printf '\033[32m%s\033[0m\n' "$*"; }
jaune() { printf '\033[33m%s\033[0m\n' "$*"; }
etape() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

[ -f docker-compose.yml ] && [ -d compose ] || { echo "Lancez ce script depuis le dépôt formation-observabilite-lab."; exit 1; }
docker info >/dev/null 2>&1 || { echo "Docker ne répond pas. Sur Codespaces, attendez la fin du démarrage puis relancez."; exit 1; }

etape "1/7 Sauvegarde de vos fichiers"
S="$R/sauvegarde-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$S"
for f in docker-compose.yml apps/shop-api/app.py prometheus/prometheus.yml \
         prometheus/rules/recording.yml prometheus/targets/pushgateway.yml; do
  if [ -f "$f" ]; then mkdir -p "$S/$(dirname "$f")"; cp "$f" "$S/$f"; fi
done
vert "Copie de vos fichiers dans $S"

etape "2/7 Arrêt des binaires des exercices 1.1 à 1.4 (s'il en reste)"
pkill -f 'bin/prometheus/prometheus' 2>/dev/null && jaune "Prometheus (binaire) arrêté" || true
pkill -f 'bin/grafana/bin/grafana' 2>/dev/null && jaune "Grafana (binaire) arrêté" || true
pkill -f 'bin/node_exporter/node_exporter' 2>/dev/null && jaune "Node Exporter (binaire) arrêté" || true
vert "OK"

etape "3/7 Activation des briques 01 à 06 dans docker-compose.yml"
for b in 01-prometheus 02-grafana 03-shop-api 04-node-exporter 05-exporters 06-alerting; do
  sed -i.bak "s|^\( *\)# *- compose/$b.yml|\1- compose/$b.yml|" docker-compose.yml
done
rm -f docker-compose.yml.bak
grep -E '^\s*- compose/' docker-compose.yml

etape "4/7 Dépôt des fichiers du jour 1 terminé"
cp "$R/app.py"             apps/shop-api/app.py
cp "$R/prometheus.yml"     prometheus/prometheus.yml
cp "$R/pushgateway.yml"    prometheus/targets/pushgateway.yml
cp "$R/recording.yml"      prometheus/rules/recording.yml
cp "$R/recording_test.yml" prometheus/tests/recording_test.yml
vert "app.py, prometheus.yml, targets/pushgateway.yml, rules/recording.yml, tests/recording_test.yml"

etape "5/7 Démarrage de la stack (2 à 4 minutes la première fois)"
docker compose up -d --build --remove-orphans
docker compose up -d --build --force-recreate shop-api-1 shop-api-2
printf 'Attente de Prometheus'
for _ in $(seq 1 60); do
  curl -fsS http://localhost:9090/-/ready >/dev/null 2>&1 && break
  printf '.'; sleep 2
done; echo
docker compose exec -T prometheus promtool check config /etc/prometheus/prometheus.yml
curl -fsS -X POST http://localhost:9090/-/reload && vert "Prometheus rechargé"

etape "6/7 Premier passage du batch (Pushgateway)"
docker compose --profile batch run --rm batch-job >/dev/null 2>&1 && vert "Batch poussé" || jaune "Batch non lancé (pas grave)"

etape "7/7 État des cibles"
printf 'Attente du premier scrape'
for _ in $(seq 1 20); do
  n=$(curl -fsS 'http://localhost:9090/api/v1/query?query=count(up==1)' 2>/dev/null | grep -o '"[0-9]*"\]' | tr -dc 0-9)
  [ "${n:-0}" -ge 10 ] && break
  printf '.'; sleep 3
done; echo
curl -fsS 'http://localhost:9090/api/v1/query?query=up' \
  | python3 -c '
import json, sys
r = json.load(sys.stdin)["data"]["result"]
r.sort(key=lambda s: (s["metric"]["job"], s["metric"]["instance"]))
for s in r:
    etat = "UP  " if s["value"][1] == "1" else "DOWN"
    print("  %s  %-14s %s" % (etat, s["metric"]["job"], s["metric"]["instance"]))
print("\n  %d / %d cibles UP" % (sum(s["value"][1] == "1" for s in r), len(r)))' 2>/dev/null \
  || jaune "Impossible de lire l'état des cibles : ouvrez Prometheus → Status → Target health."

echo
vert "Rattrapage terminé. Votre lab est prêt pour la journée."
./lab.sh status | sed -n '/Prometheus /,$p'
