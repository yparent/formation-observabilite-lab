# Exercices 1.1 à 1.4 — Installer Prometheus et Grafana à la main

Avant les conteneurs, on regarde les tripes de la bête : un binaire, un fichier de
configuration, un dossier de données. Tout se passe dans ce dossier `install/`.

## 1. Télécharger

Le script prend la version **LTS** de Prometheus (3.13.3), pas la dernière sortie : voir
`VERSIONS.md` pour le pourquoi.

| Système | Commande |
|---|---|
| Linux, Codespaces, macOS | `./install/download.sh` |
| Windows (PowerShell) | `.\install\download.ps1` |

Les archives officielles sont extraites dans `install/bin/` (ignoré par git).
Sur macOS, si le système refuse de lancer un binaire téléchargé par le navigateur,
c'est la quarantaine Gatekeeper : `xattr -dr com.apple.quarantine install/bin`.
Le script ci-dessus passe par `curl`, qui ne pose pas ce marqueur.

## 2. Prometheus

Créez `install/prometheus.yml` (le contenu est dans le guide stagiaire, exercice 1.1), puis :

```bash
cd install/bin/prometheus
./prometheus --config.file=../../prometheus.yml --storage.tsdb.path=../../data     # Linux / macOS
.\prometheus.exe --config.file=..\..\prometheus.yml --storage.tsdb.path=..\..\data  # Windows
```

Interface : http://localhost:9090 (sur Codespaces, onglet *Ports*). Laissez tourner dans ce
terminal, ouvrez-en un second pour la suite.

## 3. Grafana

```bash
cd install/bin/grafana
./bin/grafana server --homepath=$PWD          # Linux / macOS
.\bin\grafana.exe server --homepath=$PWD      # Windows (PowerShell)
```

Le `--homepath` dit à Grafana où sont ses fichiers (`conf/`, `public/`, `data/`) ; sans lui,
il cherche dans `/usr/share/grafana`, le chemin des paquets.

Interface : http://localhost:3000, identifiants `admin` / `admin` (Grafana demande de changer
le mot de passe, vous pouvez passer). Grafana écrit sa base dans `data/` de son dossier.

## 4. Node Exporter (Linux et macOS seulement)

```bash
cd install/bin/node_exporter && ./node_exporter
```

Métriques sur http://localhost:9100/metrics. Sous Windows, l'équivalent s'appelle
`windows_exporter` ; on n'en a pas besoin ici, la suite se fait en conteneur.

## 5. Tout arrêter

`Ctrl+C` dans chaque terminal. Les ports 9090 et 3000 doivent être libres avant de passer
aux conteneurs (exercice 1.7).
