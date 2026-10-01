#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# jour3.sh — la télécommande du dernier jour (branche jour3)
#
#   ./jour3.sh start            démarre tout le lab et vérifie que les 10 cibles sont UP
#   ./jour3.sh status           état des conteneurs et adresses
#   ./jour3.sh teams <URL>      envoie les alertes critiques d'Alertmanager vers un vrai canal Teams
#   ./jour3.sh teams off        revient à l'Inbox du lab
#   ./jour3.sh mystere          l'escape game : sabote la boutique en secret (deux incidents)
#   ./jour3.sh solution         révèle le sabotage, puis répare tout
#   ./jour3.sh repare           remet la boutique en ordre (chaos, trafic, conteneurs arrêtés)
#   ./jour3.sh thanos on|off    ajoute ou retire Thanos (six conteneurs, port 10902)
# ---------------------------------------------------------------------------
set -e
cd "$(dirname "$0")"

vert()  { printf '\033[32m%s\033[0m\n' "$*"; }
jaune() { printf '\033[33m%s\033[0m\n' "$*"; }
titre() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

TEAMS_FILE=alertmanager/secrets/teams_url
MYSTERE=.mystere

prom() { curl -fsS "http://localhost:9090/api/v1/query" --data-urlencode "query=$1"; }

cibles() {
  printf 'Attente du premier scrape'
  for _ in $(seq 1 30); do
    n=$(prom 'count(up==1)' 2>/dev/null | grep -o '"[0-9]*"\]' | tr -dc 0-9)
    [ "${n:-0}" -ge 10 ] && break
    printf '.'; sleep 3
  done; echo
  prom 'up' | python3 -c '
import json, sys
r = json.load(sys.stdin)["data"]["result"]
r.sort(key=lambda s: (s["metric"]["job"], s["metric"]["instance"]))
for s in r:
    etat = "UP  " if s["value"][1] == "1" else "DOWN"
    print("  %s  %-14s %s" % (etat, s["metric"]["job"], s["metric"]["instance"]))
print("\n  %d / %d cibles UP" % (sum(s["value"][1] == "1" for s in r), len(r)))' 2>/dev/null \
    || jaune "Ouvrez Prometheus → Status → Target health pour voir l'état des cibles."
}

repare() {
  docker compose start redis shop-api-1 shop-api-2 >/dev/null 2>&1 || true
  docker compose restart shop-api-1 shop-api-2 >/dev/null 2>&1   # arrête aussi un chaos CPU en cours
  TRAFFIC_RPS=6 docker compose up -d traffic >/dev/null 2>&1
  for _ in $(seq 1 30); do   # attendre que les deux instances répondent
    curl -fsS localhost:5001/health >/dev/null 2>&1 && curl -fsS localhost:5002/health >/dev/null 2>&1 && break
    sleep 1
  done
  vert "Boutique remise en ordre : chaos arrêtés, trafic à 6 req/s, tous les conteneurs démarrés."
}

case "${1:-help}" in
  start)
    docker info >/dev/null 2>&1 || { echo "Docker ne répond pas : attendez 30 s que le Codespace finisse de démarrer, puis relancez."; exit 1; }
    mkdir -p alertmanager/secrets
    [ -f "$TEAMS_FILE" ] || echo "http://inbox:8080/teams/astreinte" > "$TEAMS_FILE"
    titre "Démarrage du lab (3 à 5 minutes la première fois)"
    docker compose up -d --build --remove-orphans
    printf 'Attente de Prometheus'
    for _ in $(seq 1 60); do curl -fsS http://localhost:9090/-/ready >/dev/null 2>&1 && break; printf '.'; sleep 2; done; echo
    docker compose --profile batch run --rm batch-job >/dev/null 2>&1 || true
    titre "État des cibles"
    cibles
    titre "Vos adresses (onglet PORTS du Codespace)"
    ./lab.sh status | sed -n '/Prometheus  /,/Redis exporter/p'
    echo; vert "Le lab est prêt. Bonne journée !" ;;

  status) ./lab.sh status ;;

  teams)
    mkdir -p alertmanager/secrets
    if [ "${2:-}" = "off" ] || [ -z "${2:-}" ]; then
      echo "http://inbox:8080/teams/astreinte" > "$TEAMS_FILE"; jaune "Alertes Teams renvoyées vers l'Inbox du lab."
    else
      printf '%s\n' "$2" > "$TEAMS_FILE"; vert "Alertes critiques envoyées vers votre workflow Teams."
    fi
    curl -fsS -X POST http://localhost:9093/-/reload >/dev/null && vert "Alertmanager rechargé." ;;

  mystere)
    repare >/dev/null
    python3 - "$MYSTERE" <<'PY'
import base64, random, subprocess, sys
INCIDENTS = {
    1: ("Latence x10 sur shop-api-1 seulement", "curl -fsS -X POST localhost:5001/chaos/latency/on"),
    2: ("40 % d'erreurs sur shop-api-2 seulement", "curl -fsS -X POST localhost:5002/chaos/errors/on"),
    3: ("Redis arrêté (l'exporter, lui, tourne toujours)", "docker compose stop redis"),
    4: ("Afflux de clients : trafic x5 (ce n'est pas une panne)", "TRAFFIC_RPS=30 docker compose up -d traffic"),
    5: ("CPU saturé pendant 15 minutes", "curl -fsS -X POST 'localhost:5001/chaos/cpu?seconds=900' && curl -fsS -X POST 'localhost:5002/chaos/cpu?seconds=900'"),
    6: ("Instance shop-api-1 arrêtée", "docker compose stop shop-api-1"),
    7: ("Fuite mémoire dans l'application", "curl -fsS -X POST localhost:5001/chaos/leak/on && curl -fsS -X POST localhost:5002/chaos/leak/on"),
}
INCOMPATIBLES = [{1, 6}, {6, 7}, {4, 5}]
while True:
    tirage = set(random.sample(sorted(INCIDENTS), 2))
    if tirage not in INCOMPATIBLES:
        break
for n in sorted(tirage):
    subprocess.run(INCIDENTS[n][1], shell=True, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
texte = "\n".join(f"  Sabotage n°{n} : {INCIDENTS[n][0]}" for n in sorted(tirage))
open(sys.argv[1], "w").write(base64.b64encode(texte.encode()).decode())
PY
    echo
    vert "La boutique a été sabotée. Deux incidents se cachent quelque part."
    echo "Vous avez 12 minutes. Interdit : ce terminal, docker, les logs. Autorisé : Grafana, Prometheus, Alertmanager, l'Inbox, Mailpit."
    echo "Quand le formateur le dira : ./jour3.sh solution" ;;

  solution)
    [ -f "$MYSTERE" ] || { echo "Aucun sabotage en cours. Lancez d'abord ./jour3.sh mystere"; exit 1; }
    titre "La solution"
    base64 -d "$MYSTERE"; echo
    rm -f "$MYSTERE"
    titre "Réparation"
    repare ;;

  repare) repare ;;

  thanos)
    DS=grafana/provisioning/datasources/thanos.yml
    case "${2:-on}" in
      on)
        sed -i.bak 's|^\( *\)# *\(- --storage.tsdb.m[a-z]*-block-duration=10m\)|\1\2|' compose/01-prometheus.yml
        sed -i.bak 's|^\( *\)# *- compose/07-thanos.yml|\1- compose/07-thanos.yml|' docker-compose.yml
        rm -f compose/01-prometheus.yml.bak docker-compose.yml.bak
        cp jour3/thanos-datasource.yml "$DS"
        docker compose up -d --remove-orphans
        docker compose restart grafana >/dev/null
        vert "Thanos démarré : Querier sur le port 10902, source de données « Thanos » dans Grafana." ;;
      off)
        sed -i.bak 's|^\( *\)\(- --storage.tsdb.m[a-z]*-block-duration=10m\)|\1# \2|' compose/01-prometheus.yml
        sed -i.bak 's|^\( *\)- compose/07-thanos.yml|\1# - compose/07-thanos.yml|' docker-compose.yml
        rm -f compose/01-prometheus.yml.bak docker-compose.yml.bak "$DS"
        docker compose up -d --remove-orphans
        docker compose restart grafana >/dev/null
        vert "Thanos retiré." ;;
    esac ;;

  *) sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//' ;;
esac
