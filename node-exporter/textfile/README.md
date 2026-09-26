# Textfile collector

Tout fichier `*.prom` déposé ici est exposé par le Node Exporter (TP 1, exercice 1.9).

Format : une métrique par ligne, au format d'exposition Prometheus.

```
# HELP formation_exercice_done Exercice terminé (1 = oui)
# TYPE formation_exercice_done gauge
formation_exercice_done{stagiaire="prenom"} 1
```
