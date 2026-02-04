# Commandes pour l'installation manuelle (Linux/Codespaces)

## 1. Installer Prometheus
# Télécharger (Version LTS stable)
wget https://github.com/prometheus/prometheus/releases/download/v2.50.0/prometheus-2.50.0.linux-amd64.tar.gz

# Extraire
tar xvf prometheus-2.50.0.linux-amd64.tar.gz

# Entrer dans le dossier
cd prometheus-2.50.0.linux-amd64/

# Lancer Prometheus
./prometheus --config.file=prometheus.yml

## 2. Installer Grafana
# Retour au dossier racine
cd ..

# Télécharger (Version OSS)
wget https://dl.grafana.com/oss/release/grafana-10.3.3.linux-amd64.tar.gz

# Extraire
tar -zxvf grafana-10.3.3.linux-amd64.tar.gz

# Lancer Grafana
cd grafana-10.3.3
./bin/grafana-server