# Annexes

## Annexe A — Questionnaire d'évaluation (avec corrigé)

Le même questionnaire sert au positionnement du jour 1 (sans corrigé) et à l'évaluation finale.
Une réponse par question, 17 questions, 20 minutes.

1. Prometheus collecte les métriques en mode : (a) push (b) pull (c) les deux à parts égales.
   **b.** Le push existe via la Pushgateway ou le remote write, mais le modèle est le pull.
2. Une série temporelle est identifiée par : (a) son nom (b) son nom et son timestamp (c) son
   nom et l'ensemble de ses labels. **c.**
3. Sur un Counter, la fonction à utiliser pour obtenir un débit est : (a) `avg()` (b) `rate()`
   (c) `sum()`. **b.**
4. `http_requests_total{status=~"5.."}` sélectionne : (a) les codes 5xx (b) les codes commençant
   par 5 (c) tout ce qui contient un 5. **a**, la regex est ancrée.
5. Le fichier à valider avant de recharger Prometheus se vérifie avec : (a) `prometheus --check`
   (b) `promtool check config` (c) `docker compose config`. **b.**
6. Pour un p95 sur un histogramme, `histogram_quantile` a besoin que l'agrégation conserve le
   label : (a) `le` (b) `quantile` (c) `instance`. **a.**
7. Une alerte Prometheus se déclenche quand : (a) la valeur dépasse 1 (b) l'expression renvoie
   au moins une série (c) `for` est écoulé, même sans résultat. **b** (puis `for`).
8. `group_wait` dans Alertmanager sert à : (a) attendre avant la première notification d'un
   groupe (b) espacer les répétitions (c) définir un silence. **a.**
9. En 2026, Alertmanager notifie Microsoft Teams via : (a) le connecteur Office 365
   (b) `msteamsv2_configs` et un flux Workflows (c) un mail. **b.**
10. Dans Grafana, une variable multi-valeur s'utilise dans une requête avec : (a) `=` (b) `=~`
    (c) `!=`. **b.**
11. Pour fusionner deux requêtes en une seule table Grafana, on utilise : (a) une jointure PromQL
    (b) la transformation *Merge* (c) deux panels. **b.**
12. Un dashboard provisionné par fichier : (a) ne peut jamais être édité (b) est rechargé depuis
    le fichier, l'édition UI est optionnelle (c) est stocké uniquement en mémoire. **b.**
13. Le principal facteur de consommation mémoire de Prometheus est : (a) le nombre de cibles (b) le
    nombre de séries actives (c) la rétention. **b.**
14. Pour un historique de 13 mois multi-clusters, on choisit : (a) augmenter la rétention à 400 j
    (b) un stockage longue durée (Thanos, Mimir, VictoriaMetrics) (c) un Prometheus par mois. **b.**
15. Un `up == 0` sur un job blackbox signifie : (a) la cible sondée est down (b) l'exporter blackbox
    ne répond pas (c) la sonde a échoué. **b** ; la sonde, c'est `probe_success`.

16. En production, quelle version de Prometheus installe-t-on ? (a) la dernière sortie (b) la
    LTS en cours, avec ses patchs (c) celle du paquet de la distribution. **b** ; une mineure hors
    LTS n'est plus corrigée dès que la suivante sort.
17. Dans Thanos, le label `replica` sert à : (a) router les alertes (b) identifier deux copies de la
    même donnée pour les dédupliquer (c) nommer le bucket. **b.**

Questions ouvertes (à l'oral) : « décrivez l'architecture », « citez trois labels interdits »,
« qu'est-ce qu'une alerte symptôme », « à quoi sert le sidecar Thanos ».

## Annexe B — Aide-mémoire

### Commandes du lab

```
./lab.sh up | down | reset | status | reload | check | test | logs <svc>
./lab.sh chaos latency|errors|leak on|off      ./lab.sh chaos cpu 300      ./lab.sh chaos reset
./lab.sh traffic 20         ./lab.sh batch      ./lab.sh snapshot
./install/download.sh  (ou .\install\download.ps1)                 # binaires du jour 1
docker compose exec thanos-store ls /bucket                          # blocs envoyés par les sidecars (TP 10)
docker compose exec prometheus promtool check config /etc/prometheus/prometheus.yml
docker compose exec prometheus promtool check rules /etc/prometheus/rules/*.yml
docker compose exec prometheus sh -c 'cd /etc/prometheus/tests && promtool test rules *.yml'
docker compose exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
docker compose exec alertmanager amtool config routes show --config.file=/etc/alertmanager/alertmanager.yml
docker compose exec alertmanager amtool config routes test --config.file=/etc/alertmanager/alertmanager.yml \
    severity=critical
docker compose exec alertmanager amtool alert          # l'URL vient de /etc/amtool/config.yml
docker compose exec alertmanager amtool silence add alertname=X -d 1h -c "commentaire"
curl -X POST localhost:9090/-/reload      curl -X POST localhost:9093/-/reload
curl -X POST localhost:9090/api/v1/admin/tsdb/snapshot
```

### PromQL

| Besoin | Requête |
|---|---|
| Cibles down | `up == 0` |
| Débit | `sum by (route) (rate(http_requests_total[5m]))` |
| Taux d'erreur | `sum(rate(x{status=~"5.."}[5m])) / sum(rate(x[5m]))` |
| p95 | `histogram_quantile(0.95, sum by (le) (rate(x_bucket[5m])))` |
| Latence moyenne | `rate(x_sum[5m]) / rate(x_count[5m])` |
| Incréments sur 1 h | `increase(x[1h])` |
| CPU % | `100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])))` |
| Mémoire % | `100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)` |
| Disque % | `100 * (1 - node_filesystem_avail_bytes / node_filesystem_size_bytes)` |
| Disque plein dans 24 h | `predict_linear(node_filesystem_avail_bytes[6h], 86400) < 0` |
| Pic sur 1 h | `max_over_time(x[1h])` |
| Métrique absente | `absent(up{job="x"})` |
| Jointure info | `x * on (instance) group_left(version) app_info` |
| Top cardinalité | `topk(10, count by (__name__) ({__name__=~".+"}))` |
| Valeurs distinctes | `count(count by (label) (x))` |
| Comparer à hier | `rate(x[5m]) offset 1d` |

### Variables Grafana

`$__rate_interval` (fenêtre pour rate), `$__interval`, `$__range`, `$__from`, `$__to`,
`$variable` / `${variable}`, `label_values(metric, label)`, `=~"$var"` en multi-valeur.

### Alertmanager : durées par défaut

`group_wait` 30 s, `group_interval` 5 m, `repeat_interval` 4 h, `resolve_timeout` 5 m.

### Ports

Prometheus 9090 · Alertmanager 9093 · Grafana 3000 · Pushgateway 9091 · Node Exporter 9100 ·
Blackbox 9115 · Redis exporter 9121 · cAdvisor 8080 (8085 dans le lab) · Inbox 8080 (lab) ·
shop-api 5001/5002 (lab) · Thanos Query 10902 · Prometheus B 9092 (lab) · Thanos gRPC 10901 (interne)

### Les briques du lab

`compose/01-prometheus.yml` · `02-grafana.yml` · `03-shop-api.yml` · `04-node-exporter.yml` ·
`05-exporters.yml` · `06-alerting.yml` · `07-thanos.yml` · `08-cadvisor.yml`. On active une brique
en décommentant sa ligne `include` dans `docker-compose.yml`, puis `./lab.sh up`.

### Thanos : qui fait quoi

| Composant | Rôle | Dans le lab |
|---|---|---|
| Sidecar | Lit la TSDB d'un Prometheus, la sert au Querier, envoie les blocs terminés au bucket | `thanos-sidecar-a`, `thanos-sidecar-b` |
| Store Gateway | Sert les blocs du bucket | `thanos-store` |
| Querier | API Prometheus globale, fusion et déduplication (`--query.replica-label`) | `thanos-query`, port 10902 |
| Compactor | Fusionne les blocs, rétention, downsampling 5 m / 1 h ; un seul par bucket | `thanos-compact` |
| Receive | Reçoit du remote write (non utilisé) | — |
| Ruler | Évalue des règles sur le Querier (non utilisé) | — |

## Annexe C — Ressources

- Documentation Prometheus : https://prometheus.io/docs/ (en particulier *Querying → Functions*,
  *Configuration*, *Alerting → Configuration*, *Migration 2.x → 3.x*)
- Documentation Grafana : https://grafana.com/docs/grafana/latest/ (*Dashboards → Build dashboards*,
  *Alerting*, *Administration → Provisioning*)
- Alertmanager : https://prometheus.io/docs/alerting/latest/configuration/
- Catalogue d'exporters : https://prometheus.io/docs/instrumenting/exporters/
- Conventions de nommage : https://prometheus.io/docs/practices/naming/
- Bonnes pratiques d'alerting : https://prometheus.io/docs/practices/alerting/
- Règles d'alerte prêtes à l'emploi : https://samber.github.io/awesome-prometheus-alerts/
- Dashboards communautaires : https://grafana.com/grafana/dashboards/ (Node Exporter Full : 1860)
- Teams via Workflows (Grafana) : https://grafana.com/docs/grafana/latest/alerting/configure-notifications/manage-contact-points/integrations/configure-teams/
- Google SRE Book, chapitre *Monitoring Distributed Systems* : https://sre.google/sre-book/monitoring-distributed-systems/
- kube-prometheus-stack : https://github.com/prometheus-community/helm-charts
- Thanos : https://thanos.io/tip/thanos/getting-started.md/ (et le *Quick tutorial* interactif sur Killercoda)
- Mimir, VictoriaMetrics : grafana.com/oss/mimir, victoriametrics.com
- Le blog de Stéphane Robert (observabilité, en français) : https://blog.stephane-robert.info/docs/outils/observabilite/
- Le dépôt de la formation : https://github.com/yparent/formation-observabilite-lab (branche `formation-2026`)

## Annexe D — Dépannage pendant la formation

| Symptôme | Cause probable | Remède |
|---|---|---|
| `./lab.sh up` échoue sur un port | Port déjà utilisé | `lsof -i :3000` / `netstat -ano` ; arrêter ou changer le port gauche dans compose |
| Grafana « database is locked » ou lent | SQLite sur un volume partagé lent (Windows) | Patienter ; ou `./lab.sh reset` |
| Cible `DOWN` avec `connection refused` | Conteneur pas démarré ou mauvais port | `./lab.sh status`, `./lab.sh logs <svc>` |
| Reload refusé | YAML invalide | `./lab.sh check`, lire le message (ligne, colonne) |
| Reload sans effet | Oubli du reload, ou fichier édité au mauvais endroit | vérifier **Status → Configuration** |
| `promtool` introuvable | Lancé sur la machine au lieu du conteneur | `docker compose exec prometheus promtool ...` |
| Chaîne `$` mangée dans compose | Interpolation | doubler : `$$` |
| Panel Grafana vide sans « No data » | Option invalide (ex. `legend.displayMode: hidden`) | passer par l'UI, ou `showLegend: false` |
| `histogram_quantile` renvoie NaN | `le` perdu dans l'agrégation | `sum by (le)` |
| Variable Grafana sans valeur | mauvaise requête `label_values` ou `=` au lieu de `=~` | tester dans Explore |
| Alerte jamais `firing` | `for` trop long, ou expression vide (division par vide) | tester l'expression dans Prometheus, `or vector(0)` |
| Notification Teams absente | flux Workflows en erreur | Power Automate → historique d'exécution |
| Grafana redémarre en boucle | fichier de provisioning invalide | `docker compose logs grafana`, corriger, `restart` |
| Codespace lent | machine 2 cœurs | `./lab.sh traffic 3`, éviter cAdvisor ; au TP 10, arrêter `prometheus-b` après la partie 2 si besoin |
| `Aucune brique activée` | tous les `include` sont commentés | décommenter la brique demandée par l'exercice |
| `./lab.sh up` : `toomanyrequests` | limite de pulls anonymes de Docker Hub (10/h par IP) | `docker login` avec un compte Docker Hub gratuit, relancer ; les images Prometheus viennent déjà de quay.io |
| `port is already allocated` au 1.7 | un binaire du matin tourne encore | `Ctrl+C` dans son terminal, ou `lsof -i :9090` |
| Binaire Prometheus : `permission denied` (macOS) | quarantaine Gatekeeper | `xattr -dr com.apple.quarantine install/bin` |
| Grafana binaire : `Could not find config defaults` | lancé sans `--homepath` | `./bin/grafana server --homepath=$PWD` depuis son dossier |
| Thanos : sidecar A en boucle `Compaction needs to be disabled (storage.tsdb.min-block-duration = storage.tsdb.max-block-duration)` | flags block-duration oubliés dans `compose/01-prometheus.yml` | les décommenter, `./lab.sh up` |
| Thanos : `/bucket` reste vide | moins de 15 min écoulées (le premier bloc vient du Prometheus principal) | attendre, montrer le mien |
| Thanos : sidecar `no external labels configured on Prometheus server` | Prometheus sans `external_labels` | vérifier `prometheus.yml` (le dépôt les a) |
| Node Exporter : chiffres bizarres | Docker Desktop (VM) | expliquer, c'est normal |
| Build de l'app impossible (pas de réseau) | proxy d'entreprise | pré-construire l'image la veille, `docker save` / `docker load` |

## Annexe E — Créer le flux Teams Workflows (pas à pas)

1. Dans Teams, ouvrir le canal cible, cliquer sur **···** à côté de son nom → **Workflows**.
2. Chercher « **webhook** » et choisir « **Post to a channel when a webhook request is received** »
   (en français : « Publier dans un canal lorsqu'une demande de webhook est reçue »).
3. Nommer le flux (`Alertes Prometheus`), **Suivant**. Vérifier l'équipe et le canal, **Ajouter un
   flux de travail**.
4. Copier l'URL affichée (`https://prod-xx.westeurope.logic.azure.com:443/workflows/...`). Elle ne
   sera plus affichée : la stocker dans un gestionnaire de secrets.
5. Canal privé : ouvrir le flux dans Power Automate, étape « Send each adaptive card » → action
   « Post your own adaptive card as the Flow bot to a channel » → *Post as* : **User**. Enregistrer.
6. Tester : `curl -X POST '<URL>' -H 'Content-Type: application/json' -d @carte.json` avec une carte
   adaptative minimale :

```json
{"type":"message","attachments":[{"contentType":"application/vnd.microsoft.card.adaptive","content":{
 "$schema":"http://adaptivecards.io/schemas/adaptive-card.json","type":"AdaptiveCard","version":"1.4",
 "body":[{"type":"TextBlock","text":"Test depuis la formation","weight":"Bolder"}]}}]}
```

7. Dans Alertmanager : `msteamsv2_configs: [{webhook_url_file: /etc/alertmanager/secrets/teams.url}]`.
   Dans Grafana : contact point *Microsoft Teams*, champ *URL*.

Limites : pas de mise en forme personnalisée de la carte depuis Grafana (titre et message
seulement) ; les flux Workflows sont soumis aux limites Power Automate du tenant (nombre d'appels
par jour selon la licence) ; un flux appartient à un utilisateur, prévoir un compte de service.

## Annexe F — Quand ça coince en salle (Codespaces, Mac)

| Symptôme | Ce que je fais |
|---|---|
| Le Codespace ne s'ouvre pas, page grise | Recharger l'onglet (Cmd+R). Sinon https://github.com/codespaces → ··· → **Open in browser**. En dernier recours ··· → **Rebuild container** (5 min, les volumes Docker survivent) |
| Le terminal dit `Cannot connect to the Docker daemon` | Attendre 30 s après l'ouverture du Codespace ; sinon `sudo service docker start` |
| `./lab.sh up` : `toomanyrequests` | `docker login` avec un compte Docker Hub gratuit, relancer |
| `./lab.sh up` : `port is already allocated` | Un binaire du matin tourne encore : Ctrl+C dans son terminal, ou `pkill -x prometheus ; pkill -x grafana` |
| Un port n'apparaît pas dans PORTS | Onglet PORTS → **Forward a Port** → taper le numéro |
| L'URL d'un port affiche une page GitHub « You don't have access » | Mauvais compte GitHub dans le navigateur, ou visibilité du port : PORTS → clic droit → Port Visibility → Private |
| Grafana affiche « Invalid language tag » ou une page blanche | Navigateur en français avec un réglage exotique ; rafraîchir, ou Safari → Réglages → Langue |
| Le Codespace s'est arrêté pendant la pause | Recharger l'onglet, attendre 30 s, `./lab.sh up` : tout repart avec l'historique |
| Un stagiaire a tout cassé | `git stash` puis `git pull` dans son Codespace remet les fichiers du dépôt ; les volumes restent. `./lab.sh reset` seulement en dernier recours |
| Le quota Codespaces d'un stagiaire est épuisé | Il travaille en binôme sur le Codespace du voisin (chacun sa fenêtre, même URL partagée via PORTS → Port Visibility → Public) |
| PowerPoint : les notes ne s'affichent pas sur mon écran | Diaporama → Mode Présentateur ; si un seul écran est détecté, Diaporama → Configurer le diaporama → « Présenté par un présentateur » et **Permuter l'affichage** |
