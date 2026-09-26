#!/bin/sh
# Simule un batch (sauvegarde nocturne) qui ne vit que quelques secondes :
# trop court pour être scrapé, il pousse donc son résultat dans la Pushgateway.
#
# Lancement : docker compose --profile batch run --rm batch-job

set -e
START=$(date +%s)
echo "[batch] début de la sauvegarde..."
sleep $((3 + $(od -An -N1 -tu1 /dev/urandom | tr -d ' ') % 5))
SIZE=$(( 500 + $(od -An -N2 -tu2 /dev/urandom | tr -d ' ') % 1500 ))
END=$(date +%s)
DURATION=$((END - START))
echo "[batch] terminé en ${DURATION}s, ${SIZE} Mo sauvegardés"

cat <<EOF | curl -s --data-binary @- http://pushgateway:9091/metrics/job/backup/instance/nightly
# HELP backup_last_success_timestamp_seconds Horodatage de la dernière sauvegarde réussie
# TYPE backup_last_success_timestamp_seconds gauge
backup_last_success_timestamp_seconds ${END}
# HELP backup_duration_seconds Durée de la dernière sauvegarde
# TYPE backup_duration_seconds gauge
backup_duration_seconds ${DURATION}
# HELP backup_size_megabytes Taille de la dernière sauvegarde
# TYPE backup_size_megabytes gauge
backup_size_megabytes ${SIZE}
EOF
echo "[batch] métriques poussées dans la Pushgateway (http://localhost:9091)"
