# Pas à pas — mes manipulations, sur le Mac et dans Codespaces

Ce chapitre est mon fil conducteur technique : tout ce que je tape et tout ce que je clique,
dans l'ordre, du dimanche soir au mercredi 17h30. Le reste du guide dit ce que je raconte ; ici,
je me laisse guider. Les commandes sont à copier telles quelles.

Convention : **[Mac]** = terminal ou application sur mon Mac ; **[CS-stagiaire]** = mon Codespace
sur la branche `formation-2026`, celui que je déroule au même rythme que les stagiaires ;
**[CS-démo]** = mon Codespace sur la branche `formation-2026-formateur`, avec toutes les briques
chaudes, que je projette pour les démonstrations et les corrigés.

## 0. La veille — deux Codespaces et le deck

### 0.1 Vérifier que GitHub est à jour [Mac]

1. Ouvrir Safari sur https://github.com/yparent/formation-observabilite-lab/branches : les deux
   branches `formation-2026` et `formation-2026-formateur` doivent avoir un commit d'aujourd'hui ou
   d'hier. Sinon, pousser depuis le dossier `2026/formation-observabilite-lab` (commande dans
   `LISEZ-MOI-avant-mardi.md`).
2. Ouvrir https://github.com/yparent/formation-observabilite-lab/tree/formation-2026 : je dois voir
   `compose/`, `install/`, `thanos/`, `docs/stagiaire/`, et **pas** `solutions/`.

### 0.2 Créer le Codespace démo [Mac, navigateur]

1. Sur la page du dépôt, menu déroulant des branches (en haut à gauche, « main ») → choisir
   `formation-2026-formateur`.
2. Bouton vert **Code** → onglet **Codespaces** → les trois points **···** → **New with options…**
3. Branch : `formation-2026-formateur`. Region : Europe West. Machine type : **4-core** (le
   démo porte les huit briques). **Create codespace**.
4. Attendre 2 à 3 minutes : VS Code s'ouvre dans le navigateur, le terminal affiche
   l'installation de Docker, Python et jq (`postCreateCommand`). Quand le prompt revient :

```bash
./lab.sh up          # doit refuser : "Aucune brique activée"
```

5. Renommer le Codespace pour s'y retrouver : https://github.com/codespaces → à côté du
   Codespace, **···** → **Rename** → `demo-formateur`.

### 0.3 Préparer la stack démo [CS-démo]

Dans le terminal du Codespace (menu **Terminal → New Terminal**, ou Ctrl+ù) :

```bash
# activer les six briques des jours 1 et 3 (pas Thanos, pas cAdvisor)
sed -i 's|^  # - compose/0[1-6]|  - compose/0X|' docker-compose.yml
sed -i 's|0X-prometheus|01-prometheus|; s|0X-grafana|02-grafana|; s|0X-shop|03-shop|; s|0X-node|04-node|; s|0X-exporters|05-exporters|; s|0X-alerting|06-alerting|' docker-compose.yml
grep -n "^  - compose" docker-compose.yml        # six lignes attendues

# les corrigés, pour que tout tourne comme en fin de jour 3
cp solutions/jour-1/prometheus.yml prometheus/prometheus.yml
cp solutions/jour-1/targets/pushgateway.yml prometheus/targets/
cp solutions/jour-1/app.py apps/shop-api/app.py
cp solutions/jour-2/recording.yml prometheus/rules/recording.yml
cp solutions/jour-2/recording_test.yml prometheus/tests/
cp solutions/jour-2/dashboards/*.json grafana/dashboards/
cp solutions/jour-3/alerts.yml prometheus/rules/alerts.yml
cp solutions/jour-3/alertmanager.yml alertmanager/alertmanager.yml
cp solutions/jour-3/grafana-alerting.yml grafana/provisioning/alerting/formation.yml
sed -i 's|^# alerting:|alerting:|; s|^#   alertmanagers:|  alertmanagers:|; s|^#     - static_configs:|    - static_configs:|; s|^#         - targets: \["alertmanager:9093"\]|        - targets: ["alertmanager:9093"]|' prometheus/prometheus.yml

./lab.sh up                                       # première fois : 2 à 4 minutes (build des images)
sleep 40 && ./lab.sh status && ./lab.sh check && ./lab.sh test
```

Si `./lab.sh up` échoue avec `toomanyrequests` : `docker login` (compte Docker Hub gratuit), puis
relancer.

Vérifier dans le navigateur : onglet **PORTS** (à côté de TERMINAL, en bas) → ligne 9090 → icône
**globe** (Open in Browser). Prometheus s'ouvre dans un nouvel onglet, Status → Target health :
six jobs UP. Même chose pour 3000 (Grafana, `admin` / `formation` : trois dashboards dont
*TP 5 - Boutique en ligne*), 9093, 8080.

Laisser tourner 20 minutes pour avoir de l'historique, puis **arrêter le Codespace** pour ne
pas consommer le quota : https://github.com/codespaces → **···** → **Stop codespace**. Les
volumes Docker sont conservés ; demain matin, `./lab.sh up` repart avec l'historique.

### 0.4 Créer le Codespace stagiaire [Mac, navigateur]

Même manipulation qu'en 0.2 avec la branche `formation-2026`, machine **2-core**, renommé
`stagiaire`. Ne rien lancer dedans : je le déroule en direct avec la salle.

### 0.5 Le deck [Mac]

1. Ouvrir `2026/Formation-Prometheus-Grafana.pptx` dans PowerPoint.
2. **Diaporama → Configurer le diaporama** : vérifier que le mode Présentateur est coché
   (l'écran projeté montre la slide, mon écran montre la slide suivante et **les notes**, qui
   contiennent tout le texte à dire).
3. Tester une fois avec le vidéoprojecteur : Diaporama → **À partir du début**, puis vérifier que
   les notes sont sur mon écran. Si les écrans sont inversés : **Diaporama → Mode Présentateur →
   Permuter l'affichage**.
4. Police des notes trop petite ? Dans le mode Présentateur, les boutons **A+ / A−** sous les notes.

### 0.6 Mes onglets Safari, dans l'ordre

1. Le deck n'est pas dans Safari, il est dans PowerPoint (Cmd+Tab pour basculer).
2. Onglet 1 : Codespace `stagiaire` (VS Code).
3. Onglet 2 : Codespace `demo-formateur` (VS Code).
4. Onglets 3 à 6 : Prometheus, Grafana, Alertmanager, Inbox du démo (ouverts depuis l'onglet PORTS).
5. Onglet 7 : le guide formateur en PDF, chapitre du jour.

Les URLs des Codespaces ressemblent à `https://<nom>-<hash>-9090.app.github.dev` : je ne les
retape jamais, je passe par l'onglet PORTS. Elles demandent une connexion GitHub à la première
ouverture, c'est normal.

### 0.7 Ce que je vérifie à 8h30 le mardi

```bash
# [CS-démo] : relancer la stack, elle a l'historique d'hier
./lab.sh up && sleep 40 && ./lab.sh status
./lab.sh chaos reset
```

Les quatre onglets du démo répondent. Le dashboard *TP 5 - Boutique en ligne* est vert. Le deck
est ouvert sur la slide 1. Le Codespace `stagiaire` est démarré mais vide.

---

## 1. Jour 1 — ce que je tape, heure par heure

### 9h00 — Accueil [Mac]

Deck slides 1 à 9 (titre → « Une brique à la fois »). Pendant le tour de table, je note au
paperboard. Slide « Le lab » : Cmd+Tab vers Safari, onglet Grafana démo, dashboard *TP 5*, tout
vert. Puis dans le terminal du démo :

```bash
./lab.sh chaos errors on     # [CS-démo] ; à la pause de 10h15 le dashboard sera rouge
```

### 10h30 — Module 3, exercices 1.1 à 1.4 [CS-stagiaire]

Je projette le Codespace `stagiaire` et j'avance avec eux. Slide 25 (« Exercices 1.1 à 1.4 »)
reste affichée sur le deck ; je bascule sur Safari.

**1.1.** Dans le terminal :

```bash
./install/download.sh
ls install/bin/prometheus/                 # prometheus, promtool, LICENSE, NOTICE
```

Créer le fichier : dans l'explorateur VS Code (icône en haut à gauche), clic droit sur le dossier
`install` → **New File…** → `prometheus.yml` → coller :

```yaml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]
```

Cmd+S. Puis :

```bash
cd install/bin/prometheus
./prometheus --config.file=../../prometheus.yml --storage.tsdb.path=../../data
```

Le terminal affiche les logs et reste occupé : c'est voulu. Onglet **PORTS** : la ligne 9090
apparaît toute seule (« Auto Forwarded »). Globe → Prometheus s'ouvre. Status → Target health :
une cible UP. Montrer `install/data/` dans l'explorateur : `wal/`, `chunks_head/`.

**1.2.** Dans l'onglet Prometheus, remplacer la fin de l'URL par `/metrics`. Cmd+F sur `# TYPE`.

**1.3.** Menu **Status** → Configuration, Runtime & build information, TSDB status. Onglet
**Query** : `up`, bouton **Execute**, puis onglet **Graph**. Puis
`prometheus_http_requests_total{handler="/api/v1/query"}` et `{code=~"4..|5.."}`. Onglet
**Explain** avec `rate(prometheus_http_requests_total[5m])`.

**1.4.** Nouveau terminal : **Terminal → New Terminal** (le premier reste occupé par Prometheus).

```bash
cd install/bin/grafana
./bin/grafana server --homepath=$PWD
```

PORTS → 3000 → globe. `admin` / `admin`, écran de changement de mot de passe : **Skip**. Menu
de gauche **Connections → Data sources → Add new data source → Prometheus**. Champ **Prometheus
server URL** : `http://localhost:9090` (oui, localhost : Grafana et Prometheus tournent sur la
même machine). Tout en bas, **Save & test** → « Successfully queried the Prometheus API ».
Menu **Explore** : `up`, puis `rate(prometheus_http_requests_total[5m])`, bouton **Run query**,
plage **Last 15 minutes**. Bouton **Builder** pour la même requête en cliquant.

### 11h25 — Module 4, exercices 1.5 et 1.6 [CS-stagiaire]

**1.5.** Éditer `install/prometheus.yml` : ajouter `scrape_interval: 5s` sous `job_name:
prometheus` (même indentation que `job_name`). Cmd+S. Troisième terminal :

```bash
cd install/bin/prometheus && ./promtool check config ../../prometheus.yml
kill -HUP $(pgrep -x prometheus)
```

Dans le terminal de Prometheus (le premier) : ligne `Completed loading of configuration file`.
Target health : colonne *Last scrape* sous 5 s. Requête
`prometheus_target_interval_length_seconds{quantile="0.99"}`. Remettre 15 s (supprimer la ligne),
check, HUP.

**1.6.** Ajouter un `:` en trop dans le YAML, Cmd+S, HUP sans valider. Terminal de Prometheus :
`Error reloading config`. Requête `prometheus_config_last_reload_successful` : 0. Réparer, HUP :
1. Puis dans le terminal de Prometheus : Ctrl+C, relancer avec le fichier cassé : il refuse et
rend la main. Réparer, relancer, laisser tourner.

### 12h00 — Exercice 1.7 [CS-stagiaire]

1. Terminal de Prometheus : Ctrl+C. Terminal de Grafana : Ctrl+C. PORTS : les lignes 9090 et 3000
   disparaissent.
2. Ouvrir `compose/01-prometheus.yml` dans l'éditeur (explorateur → `compose`), le lire avec eux.
3. Ouvrir `docker-compose.yml`, supprimer le `# ` devant `- compose/01-prometheus.yml` et
   `- compose/02-grafana.yml`. Cmd+S.

```bash
./lab.sh up                # première fois : une minute (pull des images)
./lab.sh status            # prometheus et grafana Up
```

4. PORTS → 9090 → globe : Status → Configuration : un seul job. 3000 → globe : `admin` /
   `formation`. Connections → Data sources : *Prometheus* avec un cadenas ; ouvrir
   `grafana/provisioning/datasources/prometheus.yml` dans l'éditeur, montrer l'URL
   `http://prometheus:9090`. Dashboards → *00 - Bienvenue dans le lab*.
5. `./lab.sh check` puis `./lab.sh reload`, et j'ouvre `lab.sh` dans l'éditeur pour montrer les
   deux commandes.

### 13h30 — Module 5, démos [CS-démo]

Onglet Prometheus du démo : `localhost:9100/metrics` n'est pas accessible directement depuis le
navigateur (port non redirigé) ; je le montre par le terminal :

```bash
docker compose exec prometheus wget -qO- http://node-exporter:9100/metrics | grep -E "^node_(cpu_seconds_total|memory_MemAvailable|filesystem_avail)" | head
docker compose exec prometheus wget -qO- 'http://blackbox-exporter:9115/probe?module=http_2xx&target=http://shop-api-1:5000/health' | grep -E "^probe_(success|duration)"
```

### 13h55 — TP 1 [CS-stagiaire]

**Partie 1.** `docker-compose.yml` : décommenter `- compose/04-node-exporter.yml`, Cmd+S,
`./lab.sh up`. Ouvrir `prometheus/prometheus.yml` (dossier `prometheus`, pas `install`), ajouter à
la fin :

```yaml
  - job_name: node
    static_configs:
      - targets: ["node-exporter:9100"]
```

```bash
./lab.sh check && ./lab.sh reload
```

Target health : `node` UP. Requête `node_uname_info`.

**Partie 2.** Les cinq requêtes, dans l'onglet Query, en Graph :
`time() - node_boot_time_seconds`,
`100 * node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes`,
`100 * (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})`,
`node_load1` et `count(node_cpu_seconds_total{mode="idle"})`,
`100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])))`. Puis `./lab.sh chaos cpu 120`
et la courbe CPU en Graph, plage 15 min.

**Partie 3.** Éditer `compose/04-node-exporter.yml`, ajouter `- --collector.processes` et
`- --no-collector.arp` dans la liste `command:`. Cmd+S.

```bash
docker compose up -d node-exporter
```

Requêtes `node_processes_state`, puis `node_arp_entries` (disparaît après quelques minutes).

**Partie 4.**

```bash
echo "backup_last_run_timestamp_seconds $(date +%s)" > node-exporter/textfile/backup.prom
echo "backup_files_total 1234" >> node-exporter/textfile/backup.prom
```

Requête `time() - backup_last_run_timestamp_seconds`.

**Partie 5.** `topk(1, 100 * (1 - node_filesystem_avail_bytes / node_filesystem_size_bytes))`,
`rate(node_network_receive_bytes_total{device!="lo"}[5m])`. Grafana → Explore, la requête CPU,
Last 30 minutes. Bonus : Dashboards → **New → Import** → champ « Find and import dashboards » :
`1860` → **Load** → source Prometheus → **Import**.

### 14h50 — Module 6, démo [CS-stagiaire]

Ouvrir `apps/shop-api/app.py` dans l'éditeur, Cmd+F sur `TODO` pour montrer les cinq, sans les faire.

### 15h15 et 15h45 — TP 2 [CS-stagiaire]

**Partie 1.** `docker-compose.yml` : décommenter `- compose/03-shop-api.yml`, `./lab.sh up`
(build de l'image : une minute). PORTS → 5001 → globe : la page d'accueil ; ajouter `/metrics`.
Dans `prometheus/prometheus.yml` :

```yaml
  - job_name: shop-api
    static_configs:
      - targets: ["shop-api-1:5000", "shop-api-2:5000"]
        labels:
          env: formation
          team: boutique
```

`./lab.sh check && ./lab.sh reload`. Requête `sum by (route) (rate(http_requests_total[1m]))`.

**Partie 2.** Les cinq TODO dans `apps/shop-api/app.py`. Si je dois débloquer la salle : ouvrir
`solutions/jour-1/app.py` dans le **démo** (jamais dans le stagiaire) et projeter la partie
concernée. Puis :

```bash
docker compose up -d --build shop-api-1 shop-api-2
```

Vérifier sur `/metrics` que `shop_orders_total` apparaît, puis
`histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` et
`topk(1, sum by (product) (shop_product_views_total))`.

**Partie 3.** Décommenter `- compose/05-exporters.yml`, `./lab.sh up`. Job :

```yaml
  - job_name: redis
    static_configs:
      - targets: ["redis-exporter:9121"]
```

Check, reload. `redis_up`, `topk(3, rate(redis_commands_total[5m]))`.

**Partie 4.** Le job blackbox complet (corrigé dans le chapitre Jour 1, TP 2 partie 4). Check,
reload. `probe_success`. Puis :

```bash
docker compose stop shop-api-2      # up reste 1, probe_success passe à 0
docker compose start shop-api-2
```

**Partie 5.**

```bash
./lab.sh batch
```

PORTS → 9091 → globe : les métriques poussées. Job :

```yaml
  - job_name: pushgateway
    honor_labels: true
    file_sd_configs:
      - files: ["targets/*.yml"]
        refresh_interval: 30s
```

Nouveau fichier `prometheus/targets/pushgateway.yml` :

```yaml
- targets: ["pushgateway:9091"]
  labels:
    tier: outils
```

Check, reload une fois. `time() - backup_last_success_timestamp_seconds`. Changer `tier: batch`
dans le fichier, Cmd+S, attendre 30 s, Target health : le label a changé sans reload.

### 17h10 — Récap [Mac + CS-démo]

Deck slide « Récap du jour 1 ». Puis dans le démo, ouvrir `solutions/jour-1/prometheus.yml` et
`solutions/jour-1/app.py` dans l'éditeur, projeter, laisser comparer. Avant de partir, dans le
stagiaire : `./lab.sh status` : douze conteneurs `Up`. Ne pas faire `reset`.

Le soir : arrêter les deux Codespaces (https://github.com/codespaces → ··· → Stop).

---

## 2. Jour 2 — ce que je tape

### 9h00 — Rappel [CS-stagiaire]

```bash
./lab.sh up && sleep 30 && ./lab.sh status
```

Target health : six jobs UP. PORTS → 5001 → `/metrics` : `shop_orders_total` présent.

### 9h10 à 12h00 — PromQL [CS-stagiaire]

Toutes les démos dans l'onglet Prometheus, Query. Pour les séries A et B, je projette le
corrigé (chapitre Jour 2) deux exercices à la fois, en tapant la requête moi-même dans Prometheus.

Démo rate contre irate : `./lab.sh traffic 30`, puis `rate(http_requests_total[1m])` et
`irate(http_requests_total[1m])` en Graph, plage 15 min. Remettre `./lab.sh traffic 10`.

Exercice 2.14 : `./lab.sh chaos errors on`, cinq minutes, puis **off**. Vérifier à 12h30 que
personne n'a laissé le chaos actif : `./lab.sh chaos status`.

### 11h35 — TP 3 [CS-stagiaire]

Créer `prometheus/rules/recording.yml` (le fichier existe, vide de règles) avec les sept règles.
Créer `prometheus/tests/recording_test.yml`.

```bash
docker compose exec prometheus promtool check rules /etc/prometheus/rules/recording.yml
./lab.sh reload
./lab.sh test
```

Requête `job:http_requests:rate5m` : des séries.

### 12h00 — Module 9, visite guidée de Grafana [CS-démo]

Onglet Grafana du démo. Menu : Connections → Data sources. Explore. Dashboards → **New →
New dashboard** : la barre latérale **Add** (Panel, Add row, Add tab, Variable, Annotation
query, Link), le choix Custom grid / Auto grid. **Add → Panel** : la requête en bas, Suggestions
à droite, All visualizations, les options. **Save dashboard** en haut à droite, titre `Démo`,
dossier *Formation*. Puis **Exit edit**. Ouvrir *TP 5 - Boutique en ligne* : le cadenas
(provisionné).

### 13h45 — TP 4 [CS-stagiaire]

Grafana → Dashboards → New → New dashboard. **Settings** (icône engrenage) → **Variables →
New variable** : Name `instance`, Type Query, Data source Prometheus, Query
`label_values(node_uname_info, instance)`, cocher **Multi-value** et **Include All option**,
**Run query**, **Back to dashboard**. Puis les panels, étape par étape (chapitre Jour 2, TP 4) ;
dans chaque requête, `instance=~"$instance"`. Save → titre `TP 4 - Serveur Linux`, dossier
*Formation*. Le résultat attendu est la slide « TP 4 — le résultat attendu », que je laisse
projetée.

### 15h50 — TP 5 [CS-stagiaire]

Même mécanique, chapitre Jour 2, TP 5. Étape 4, annotation : Settings → **Annotations → New
annotation query**, Data source Prometheus, Query `changes(shop_chaos_mode[1m]) > 0`. Étape 5 :
**Export** (en haut à droite) → **Export as code** → Advanced options → Model **Classic**, Format
JSON → **Download file**. Le fichier arrive dans les téléchargements du Mac ; dans VS Code,
glisser-déposer le fichier sur le dossier `grafana/dashboards` de l'explorateur (ou créer
`tp5-boutique.json` et coller le contenu). Puis :

```bash
docker compose restart grafana
```

Dashboards : *TP 5* avec un cadenas.

### 16h50 — Module 10 [CS-démo]

Administration → Users and access → Users, Teams, Service accounts. Dashboards → dossier
*Formation* → **Folder actions → Manage permissions**. Les exercices 2.30 à 2.33 se font dans
le stagiaire, en autonomie.

---

## 3. Jour 3 — ce que je tape

### 9h00 — Rappel et exercice 3.0 [CS-stagiaire]

```bash
./lab.sh up && sleep 30 && ./lab.sh status
```

`docker-compose.yml` : décommenter `- compose/06-alerting.yml`, `./lab.sh up`. PORTS → 9093 et
8080 → globe. `prometheus/prometheus.yml` : retirer les `# ` devant les quatre lignes du bloc
`alerting`. `./lab.sh check && ./lab.sh reload`. Prometheus → Status → **Alertmanager discovery** :
une cible.

### 9h10 — Module 11, démo [CS-démo]

```bash
docker compose stop shop-api-2
```

Prometheus → **Alerts** : `TargetDown` pending, puis firing après une minute. Alertmanager
(9093) : l'alerte. Inbox (8080) : la notification. Puis `docker compose start shop-api-2` :
resolved deux minutes plus tard.

### 9h40 — Module 12, démo [CS-démo]

```bash
docker compose exec alertmanager amtool config routes show --config.file=/etc/alertmanager/alertmanager.yml
docker compose exec alertmanager amtool config routes test --config.file=/etc/alertmanager/alertmanager.yml severity=critical team=boutique
docker compose exec alertmanager amtool alert
```

### 10h05 — TP 6 [CS-stagiaire]

Partie 1 : éditer `prometheus/rules/alerts.yml`, les cinq alertes (corrigé : `solutions/jour-3/alerts.yml`
dans le démo).

```bash
docker compose exec prometheus promtool check rules /etc/prometheus/rules/alerts.yml
./lab.sh test && ./lab.sh reload
```

Partie 2 : `./lab.sh chaos errors on`, chronomètre, Prometheus → Alerts, Inbox. `./lab.sh chaos
errors off`. Partie 3 : `alertmanager/alertmanager.yml`,

```bash
docker compose exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
curl -X POST localhost:9093/-/reload
docker compose exec alertmanager amtool config routes test --config.file=/etc/alertmanager/alertmanager.yml severity=critical team=boutique
```

Partie 5, silence par amtool :

```bash
docker compose exec alertmanager amtool silence add alertname=ShopStockLow -d 1h -c "réassort en cours"
docker compose exec alertmanager amtool silence query
```

### 11h45 — TP 7 [CS-stagiaire]

Règle dans `alerts.yml`, route dans `alertmanager.yml`, puis :

```bash
./lab.sh chaos cpu 300
```

Test sans attendre :

```bash
curl -X POST localhost:9093/api/v2/alerts -H 'Content-Type: application/json' -d '[{"labels":{"alertname":"HostHighCpuLoad","severity":"warning","team":"infra","instance":"node-exporter:9100"},"annotations":{"summary":"CPU à 92 % sur node-exporter:9100"}}]'
```

Partie 4, rendu du template :

```bash
docker compose exec alertmanager amtool template render --template.glob='/etc/alertmanager/templates/*.tmpl' --template.text='{{ template "formation.text" . }}'
```

### 14h00 — Module 14 et TP 8 [CS-stagiaire]

Grafana → **Alerting → Contact points → Create contact point** : Name `inbox-grafana`,
Integration **Webhook**, URL `http://inbox:8080/webhook/grafana`, **Test** → Send test
notification, **Save contact point**. Second : `teams-astreinte`, Integration **Microsoft
Teams**, URL `http://inbox:8080/teams/grafana` (ou la vraie URL Workflows).

**Alerting → Notification policies** : sur *Default policy*, **···** → Edit → Contact point
`inbox-grafana`, Update. Puis **New child policy** : Label `severity`, Operator `=`, Value
`critical`, Contact point `teams-astreinte`, Override group timings → Group wait `10s`, Save.

**Alerting → Alert rules → New alert rule** : les six étapes du chapitre Jour 3, TP 8.
Partie 4 : sur la règle, **···** → **Export** → format YAML → copier dans
`grafana/provisioning/alerting/formation.yml` (fichier à créer), même chose pour les contact
points (**Contact points → ··· → Export**). Puis `docker compose restart grafana`. Si Grafana ne
redémarre pas : `docker compose logs grafana | tail -20`, le fichier YAML est en cause.

### 15h10 — Module 15, exercices [CS-stagiaire]

Prometheus → Status → TSDB status. Exercice 3.4 : `sample_limit: 100` sous `job_name: redis`,
check, reload, `up{job="redis"}` : 0. Retirer, reload.

### 15h35 — TP 9 [CS-stagiaire]

```bash
./lab.sh snapshot
docker compose exec prometheus ls /prometheus/snapshots/
```

Restauration : les quatre commandes du chapitre Jour 3, TP 9 partie 1 (copier-coller, en
remplaçant `SNAP=`). Partie 2 :

```bash
docker compose cp grafana:/var/lib/grafana/grafana.db ./grafana-backup.db
mkdir -p backup && for uid in $(curl -s -u admin:formation 'http://localhost:3000/api/search?type=dash-db' | jq -r '.[].uid'); do curl -s -u admin:formation "http://localhost:3000/api/dashboards/uid/$uid" | jq .dashboard > "backup/$uid.json"; done
ls backup/
```

Partie 3 : créer `prometheus/web.yml` (corrigé `solutions/jour-3/web.yml`), ajouter
`- --web.config.file=/etc/prometheus/web.yml` dans `compose/01-prometheus.yml`,
`docker compose up -d prometheus`. Prometheus demande un mot de passe. Grafana → Data sources →
Prometheus : Authentication **Basic authentication**, `admin` / `formation`, Save & test.
**Retirer** le flag à la fin : `docker compose up -d prometheus`.

### 16h25 — TP 10 [CS-stagiaire]

`compose/01-prometheus.yml` : retirer le `# ` devant les deux lignes
`--storage.tsdb.min-block-duration=10m` et `max-block-duration=10m`. `docker-compose.yml` :
décommenter `- compose/07-thanos.yml`.

```bash
./lab.sh up && sleep 30 && ./lab.sh status     # dix-huit conteneurs Up ; noter l'heure
docker compose logs thanos-sidecar-a | tail -5  # pas d'erreur "Compaction needs to be disabled"
```

PORTS → 10902 → globe : le Querier. Menu **Stores**. Query : `up{job="shop-api"}` ; décocher
**Use Deduplication** en haut de la page, ré-exécuter. `count by (replica) (up)`.

```bash
docker compose stop prometheus-b     # le Querier répond toujours
docker compose start prometheus-b
```

Grafana → Connections → Data sources → **Add new data source** → Prometheus : Name `Thanos`,
URL `http://thanos-query:10902`, section **Performance → Prometheus type : Thanos**, Save & test.
Dashboard *TP 5* → Settings → changer la source par défaut, ou une variable Data source.

Quinze minutes après le lancement :

```bash
docker compose exec thanos-store ls -la /bucket
docker compose exec thanos-store sh -c 'cat /bucket/*/meta.json | head -40'
docker compose exec thanos-sidecar-a wget -qO- localhost:10902/metrics | grep thanos_shipper_uploads
docker compose logs thanos-compact | tail -20
```

Ranger : recommenter la brique 07 et les deux flags, `./lab.sh up`, `./lab.sh status` : douze
conteneurs.

### 17h15 — War game [CS-démo, puis stagiaires]

Je casse dans **mon** démo si on partage la stack, ou je donne la commande à un membre de chaque
binôme s'ils ont chacun leur Codespace :

```bash
curl -X POST http://localhost:5002/chaos/latency/on          # shop-api-2 seulement
curl -X POST "http://localhost:5001/chaos/cpu?seconds=240"   # CPU depuis shop-api-1
docker compose stop redis-exporter                            # un exporter qui disparaît
```

Remise en état après le débrief : `./lab.sh chaos reset && docker compose start redis-exporter`.

---

## 4. Quand ça coince

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
