#!/usr/bin/env bash
# Exercice 1.1 — télécharge et extrait Prometheus et Grafana (binaires) dans install/bin/
# Fonctionne sur Linux (Codespaces), macOS Intel et Apple Silicon.
# Windows : utiliser install/download.ps1
set -e
cd "$(dirname "$0")"
PROM_VERSION=3.13.3
GRAFANA_VERSION=13.2.1
NODE_EXPORTER_VERSION=1.12.1

case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)   OS=linux;  ARCH=amd64 ;;
  Linux-aarch64)  OS=linux;  ARCH=arm64 ;;
  Darwin-arm64)   OS=darwin; ARCH=arm64 ;;
  Darwin-x86_64)  OS=darwin; ARCH=amd64 ;;
  *) echo "Système non reconnu : $(uname -s) $(uname -m)"; exit 1 ;;
esac

mkdir -p bin && cd bin
rm -rf prometheus grafana node_exporter   # relancer le script remplace les binaires
echo "== Prometheus $PROM_VERSION ($OS/$ARCH)"
curl -fsSL -o prometheus.tar.gz "https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.${OS}-${ARCH}.tar.gz"
tar xzf prometheus.tar.gz && rm prometheus.tar.gz && mv "prometheus-${PROM_VERSION}.${OS}-${ARCH}" prometheus

echo "== Grafana $GRAFANA_VERSION ($OS/$ARCH)"
curl -fsSL -o grafana.tar.gz "https://dl.grafana.com/oss/release/grafana-${GRAFANA_VERSION}.${OS}-${ARCH}.tar.gz"
tar xzf grafana.tar.gz && rm grafana.tar.gz && mv "grafana-${GRAFANA_VERSION}" grafana

echo "== Node Exporter $NODE_EXPORTER_VERSION ($OS/$ARCH)"
curl -fsSL -o node_exporter.tar.gz "https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/node_exporter-${NODE_EXPORTER_VERSION}.${OS}-${ARCH}.tar.gz"
tar xzf node_exporter.tar.gz && rm node_exporter.tar.gz && mv "node_exporter-${NODE_EXPORTER_VERSION}.${OS}-${ARCH}" node_exporter

cat <<MSG

Terminé. Les binaires sont dans install/bin/ :
  prometheus/prometheus      grafana/bin/grafana      node_exporter/node_exporter

Suite : voir install/README.md (ou le guide stagiaire, exercice 1.1).
MSG
