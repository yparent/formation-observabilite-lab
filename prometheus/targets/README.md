# Découverte de cibles par fichiers (file_sd)

Déposez ici des fichiers `*.json` ou `*.yml` décrivant des cibles. Prometheus les relit
automatiquement (pas besoin de reload) si un job utilise `file_sd_configs` pointant sur ce dossier.

Exemple `extra.yml` :

```yaml
- targets: ["shop-api-1:5000"]
  labels:
    env: formation
    tier: web
```
