#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# lab.sh — le couteau suisse de la formation (macOS, Linux, Codespaces, Git Bash)
#
#   ./lab.sh up          démarre toute la stack
#   ./lab.sh down        arrête la stack (les données sont conservées)
#   ./lab.sh reset       arrête ET efface les données (retour à zéro)
#   ./lab.sh status      état des conteneurs + URLs
#   ./lab.sh reload      recharge Prometheus et Alertmanager après une modif de config
#   ./lab.sh check       valide prometheus.yml, les règles et alertmanager.yml
#   ./lab.sh test        lance les tests unitaires des règles (promtool test rules)
#   ./lab.sh logs <svc>  suit les logs d'un service
#   ./lab.sh chaos <latency|errors|leak> <on|off>
#   ./lab.sh chaos cpu [secondes]      brûle du CPU (défaut 300 s)
#   ./lab.sh chaos reset               remet tout en ordre
#   ./lab.sh traffic <rps>             change le débit du générateur de trafic
#   ./lab.sh batch                     lance le batch qui pousse dans la Pushgateway
#   ./lab.sh longterm                  démarre le Prometheus "longue durée" (Jour 3)
#   ./lab.sh snapshot                  crée un snapshot TSDB (Jour 3)
# ---------------------------------------------------------------------------
set -e
cd "$(dirname "$0")"

# Sur Codespaces, les URLs locales sont remplacées par les URLs redirigées.
url() {
  local port=$1
  if [ -n "$CODESPACE_NAME" ]; then
    echo "https://${CODESPACE_NAME}-${port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
  else
    echo "http://localhost:${port}"
  fi
}

urls() {
  cat <<EOF

  Prometheus     $(url 9090)
  Grafana        $(url 3000)   (admin / formation)
  Alertmanager   $(url 9093)
  Inbox notifs   $(url 8080)
  shop-api-1     $(url 5001)   /metrics
  shop-api-2     $(url 5002)   /metrics
  Node Exporter  $(url 9100)   /metrics
  Blackbox       $(url 9115)
  Pushgateway    $(url 9091)
  Redis exporter $(url 9121)   /metrics
EOF
}

case "${1:-help}" in
  up)
    docker compose up -d --build
    echo; echo "Stack démarrée. Comptez ~30 s pour que Grafana soit prêt."; urls ;;
  down)   docker compose --profile "*" down ;;
  reset)  docker compose --profile "*" down -v ;;
  status) docker compose ps; urls ;;
  reload)
    curl -fsS -X POST http://localhost:9090/-/reload && echo "Prometheus rechargé"
    curl -fsS -X POST http://localhost:9093/-/reload && echo "Alertmanager rechargé" ;;
  check)
    docker compose exec prometheus promtool check config /etc/prometheus/prometheus.yml
    docker compose exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml ;;
  test)
    docker compose exec prometheus sh -c 'cd /etc/prometheus/tests && promtool test rules *.yml' ;;
  logs)   shift; docker compose logs -f "$@" ;;
  chaos)
    mode=${2:-status}; state=${3:-on}
    for port in 5001 5002; do
      case "$mode" in
        cpu)    curl -fsS -X POST "http://localhost:${port}/chaos/cpu?seconds=${3:-300}"; echo ;;
        reset)  curl -fsS -X POST "http://localhost:${port}/chaos/reset"; echo ;;
        status) curl -fsS "http://localhost:${port}/chaos/status"; echo ;;
        *)      curl -fsS -X POST "http://localhost:${port}/chaos/${mode}/${state}"; echo ;;
      esac
    done ;;
  traffic)
    TRAFFIC_RPS=${2:-6} docker compose up -d traffic
    echo "Trafic réglé à ${2:-6} req/s" ;;
  batch)    docker compose --profile batch run --rm batch-job ;;
  longterm) docker compose --profile longterm up -d prometheus-longterm; echo "Prometheus longue durée : $(url 9095)" ;;
  snapshot)
    curl -fsS -X POST http://localhost:9090/api/v1/admin/tsdb/snapshot; echo
    echo "Snapshots dans le volume prometheus-data (/prometheus/snapshots)" ;;
  *)
    sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//' ;;
esac
