# Découverte de cibles par fichiers (file_sd)

Déposez ici des fichiers `*.yml` ou `*.json` décrivant des cibles. Prometheus les relit
automatiquement (pas besoin de reload) si un job utilise `file_sd_configs` pointant sur ce dossier.

Format d'un fichier (une liste de groupes de cibles) :

```yaml
- targets: ["service-a:9100", "service-b:9100"]
  labels:
    env: formation
    tier: web
```
