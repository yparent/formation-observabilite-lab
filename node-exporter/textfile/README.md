# Textfile collector

Tout fichier `*.prom` déposé ici est exposé par le Node Exporter (TP 1, partie 4).

Format : une métrique par ligne, au format d'exposition Prometheus. Fins de ligne LF obligatoires
(pas de CRLF Windows), et un saut de ligne à la fin du fichier.

```
# HELP formation_exercice_done Exercice terminé (1 = oui)
# TYPE formation_exercice_done gauge
formation_exercice_done{stagiaire="prenom"} 1
```
