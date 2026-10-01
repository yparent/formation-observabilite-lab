// Contenu du deck « Jour 3, version pratique ». Assemblé par build_deck_jour3.js avec les
// fonctions de build_deck.js (même charte). Notes de présentateur : notes_jour3.js.

// ===========================================================================
// OUVERTURE
// ===========================================================================
{
  const s = pres.addSlide(); slideNo++; s._no = slideNo; s._key = "[titre jour 3]"; REG.push(s);
  s.background = { path: path.join(HERE, "bg-title.jpg") };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0A1A30", transparency: 35 }, line: { color: "0A1A30", transparency: 100 } });
  logoDark(s, 0.6, 0.4, 1.8);
  s.addShape(pres.ShapeType.roundRect, { x: 8.2, y: 0.4, w: 1.3, h: 0.95, fill: { color: C.white }, line: { color: C.white }, rectRadius: 0.06 });
  s.addImage({ path: path.join(ASSETS, "logo-ysycloud.png"), x: 8.32, y: 0.47, w: 1.06, h: 0.8 });
  s.addText("PROMETHEUS & GRAFANA · JOUR 3", { x: 0.6, y: 1.9, w: 8, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: C.peach, charSpacing: 5, isTextBox: true, margin: 0 });
  s.addText("Pratiquer", { x: 0.6, y: 2.3, w: 8.8, h: 1.0, fontFace: FONT, fontSize: 46, bold: true, color: C.white, isTextBox: true, margin: 0 });
  s.addText("Des tableaux de bord qui parlent, des alertes qui servent", { x: 0.6, y: 3.3, w: 8.5, h: 0.5, fontFace: FONT, fontSize: 18, color: C.light, isTextBox: true, margin: 0 });
  s.addText("Yohan Parent · Architecte cloud · Édition octobre 2026", { x: 0.6, y: 4.75, w: 8, h: 0.35, fontFace: FONT, fontSize: 12, color: C.light, isTextBox: true, margin: 0 });
}
statement("Aujourd'hui, vous ne codez pas.\nVous pilotez.", "L'application est instrumentée. PromQL, l'IA l'écrit et l'explique ; vous comprenez et vous vérifiez. Votre travail : des tableaux de bord, des alertes, une enquête.");
table("Le programme du jour", ["Heure", "Séquence", "Ce que vous aurez fait"], [
  ["9h00", "Démarrer : un Codespace, une commande", "Un lab complet qui tourne"],
  ["9h15", "Les bonnes métriques, PromQL avec l'IA", "Quatre requêtes comprises et vérifiées"],
  ["9h40", "TP A — La boutique en signaux dorés", "Un dashboard de service professionnel"],
  ["11h40", "TP B — Le serveur en méthode USE", "Un dashboard machine, relié au premier"],
  ["12h10", "Auto-audit des tableaux de bord", "Une note sur 10, et ce qu'il faut corriger"],
  ["13h40", "TP C — Alertmanager, Teams, Slack, e-mail", "Des alertes routées, groupées, inhibées"],
  ["15h00", "TP D — Alerting Grafana, Teams en vrai", "Une alerte métier, un message dans Teams"],
  ["15h30", "Bonnes pratiques, escape game", "Deux pannes trouvées sans le terminal"],
], { colW: [0.9, 4.1, 4.0], size: 12, rowH: 0.42, note: "Pauses 10h30 et 14h30, déjeuner 12h30. Fin 16h00, ferme." });
code("Démarrer en trois minutes", `1. Ouvrir (connecté à GitHub) :

   https://codespaces.new/yparent/formation-observabilite-lab/tree/jour3

   branche jour3  →  Create codespace

2. Dans le terminal du Codespace :

   ./jour3.sh start

3. Attendre :   10 / 10 cibles UP
                Le lab est prêt. Bonne journée !`, ["Tout est déjà configuré sur la branche jour3", "Onglet PORTS : 3000 Grafana, 9090 Prometheus, 9093 Alertmanager, 8080 Inbox, 8025 Mailpit", "Grafana : admin / formation", "Rejouable : en cas de doute, on relance"], { size: 11 });
table("Casser la boutique : vos commandes du jour", ["Commande", "Effet"], [
  ["./lab.sh chaos latency on | off", "tout devient 10 fois plus lent"],
  ["./lab.sh chaos errors on | off", "40 % des appels échouent"],
  ["./lab.sh chaos cpu 120", "le CPU s'emballe pendant 2 minutes"],
  ["./lab.sh traffic 30   puis   traffic 6", "30 clients par seconde, puis retour à la normale"],
  ["docker stop shop-api-2   /   docker start shop-api-2", "une instance tombe, puis revient"],
  ["./jour3.sh repare", "tout remettre en ordre"],
], { colW: [4.6, 4.4], size: 13, rowH: 0.45, note: "Un dashboard ou une alerte qu'on n'a jamais vus réagir à une panne, on ne sait pas s'ils marchent." });

// ===========================================================================
// LES BONNES MÉTRIQUES
// ===========================================================================
section("PARTIE 1", "Les bonnes métriques", "Partir d'une méthode, pas des métriques qu'on a.");
diagram("Les quatre signaux dorés (Google SRE)", "signaux-dores", "sre.google/sre-book/monitoring-distributed-systems · brendangregg.com/usemethod.html");
cards("Quatre signaux, quatre questions", [
  { n: 1, h: "Latence", p: "Combien de temps pour répondre ? Le p95, pas la moyenne. Les erreurs à part : une erreur rapide fausse tout." },
  { n: 2, h: "Trafic", p: "Combien de demandes ? Le contexte de tout le reste. Jamais rouge : ni bon ni mauvais." },
  { n: 3, h: "Erreurs", p: "Quelle part échoue ? Explicitement (5xx), implicitement (200 vide), ou par politique (trop lent)." },
  { n: 4, h: "Saturation", p: "À quel point est-on plein ? La ressource la plus contrainte. Le seul signal qui prévient avant la panne." },
], { grid: true, sub: "Google, Site Reliability Engineering, chapitre 6 « Monitoring Distributed Systems »" });
table("Signaux dorés, RED, USE : quelle grille pour quoi", ["Méthode", "Ce qu'on mesure", "Pour quoi", "Source"], [
  ["Signaux dorés", "Latence, trafic, erreurs, saturation", "Un service vu par ses utilisateurs", "Google SRE, ch. 6"],
  ["RED", "Rate, Errors, Duration", "Chaque microservice, chaque API", "Tom Wilkie, grafana.com/blog"],
  ["USE", "Utilisation, Saturation, Erreurs", "Chaque ressource : CPU, mémoire, disque, réseau", "Brendan Gregg, brendangregg.com"],
  ["Aujourd'hui", "TP A : la boutique en signaux dorés", "TP B : le serveur en USE", "Les deux dashboards se lient"],
], { colW: [1.7, 2.6, 2.9, 1.8], size: 12, rowH: 0.55 });
diagram("PromQL : demander, comprendre, vérifier", "ia-promql", "L'IA écrit et explique. Vous comprenez. Vous vérifiez.");
code("Le modèle de demande", `Je travaille avec Prometheus 3 et Grafana 13.
Voici les métriques disponibles (extrait de /metrics) :
<lignes # HELP et # TYPE, et deux ou trois valeurs>
Les séries ont les labels job="shop-api" et instance.
Écris la requête PromQL pour un panel Grafana qui affiche :
<ce que vous voulez, avec l'unité>.
Utilise $__rate_interval et le filtre instance=~"$instance".
Donne d'abord la requête seule, puis explique-la ligne par
ligne, en français simple : ce que fait chaque fonction,
chaque opérateur et chaque label, et quelle unité on obtient.`, ["Le contexte et les vraies métriques : sinon l'IA invente des noms", "« Explique-la » : on doit pouvoir la redire en une phrase", "Faux ? On redonne l'erreur à l'IA", "Jamais de données de production sensibles dans une IA publique"], { size: 10.5 });
twoCol("Comprendre, puis vérifier", { h: "Comprendre", items: ["Lire l'explication, fonction par fonction", "La redire en une phrase à son voisin", "Sinon : « réexplique plus simplement »", "Une requête qu'on ne comprend pas, on ne saura pas la réparer"] },
  { h: "Vérifier, en quatre points", items: ["1. Elle s'exécute dans Explore", "2. L'ordre de grandeur est plausible (6 req/s, pas 60 000)", "3. Un compteur est dans rate() ou increase()", "4. Je casse : la courbe bouge dans le bon sens"] }, { rightColor: C.navy });
tp("EXPLORE", "Échauffement : les quatre signaux", "Une requête par signal doré, pour toute la boutique, demandée à l'IA, expliquée, vérifiée. Dans Explore : $__rate_interval devient 5m, et pas de filtre instance. 7 minutes.", [
  { h: "Trafic", p: "Environ 6 req/s. Piège : le compteur brut." },
  { h: "Erreurs", p: "0 sans chaos. Piège : status=\"500\" au lieu de =~\"5..\"." },
  { h: "Latence p95", p: "0,15 à 0,25 s. Piège : la moyenne, ou oublier le le." },
  { h: "Saturation", p: "Quelques % de CPU. Piège : le CPU libre au lieu d'utilisé." },
], "10 minutes. Je circule, je fais lire les explications à voix haute.");

// ===========================================================================
// TABLEAUX DE BORD
// ===========================================================================
section("PARTIE 2", "Des tableaux de bord qui parlent", "Une question, un public, une méthode.");
table("Choisir la visualisation", ["La question", "La visualisation"], [
  ["Ça évolue comment ?", "Time series"], ["Ça vaut combien, là, maintenant ?", "Stat (avec sparkline)"], ["À quel niveau sur une échelle bornée ?", "Gauge"], ["Comparer quelques valeurs", "Bar gauge"], ["Une liste à plusieurs colonnes", "Table"], ["Une répartition (5 parts max)", "Pie chart"], ["Un état dans le temps", "State timeline"], ["Une distribution qui évolue", "Heatmap"],
], { colW: [5, 4], size: 13, rowH: 0.4 });
cards("Ce qui rend un dashboard lisible", [
  { n: 1, h: "Les unités", p: "Jamais un 38491023 brut. bytes → 36,7 MiB, percentunit, reqps, currencyEUR." },
  { n: 2, h: "Seuils et couleurs", p: "Vert / orange / rouge cohérents sur tout le dashboard. Rouge = il faut agir." },
  { n: 3, h: "Value mappings", p: "1 → UP en vert, 0 → DOWN en rouge. Lisible par quelqu'un qui ne connaît pas Prometheus." },
  { n: 4, h: "Légende et ordre", p: "{{route}} plutôt qu'un bloc de labels. En haut : « ça va ? ». En bas : le détail. 10-12 panels." },
], { grid: true });
tp("TP A", "La boutique en quatre signaux dorés", "Le directeur veut un écran unique : en haut, « ça va ? » en cinq secondes ; au milieu, quand, où, combien ; en bas, ce qu'on vend. Pour une instance ou pour toutes.", [
  { h: "Variable", p: "$instance multi-valeur avec All." },
  { h: "« Ça va ? »", p: "Quatre Stat colorés : trafic, erreurs, latence p95, saturation." },
  { h: "Dans le temps", p: "Débit par route, erreurs, p50/p95/p99, heatmap, requêtes en cours." },
  { h: "Métier", p: "Chiffre d'affaires / h, moyens de paiement, stock." },
  { h: "Finitions", p: "Panel Text, annotations Chaos, tag et liens, crash test." },
], "90 minutes en deux temps, autour de la pause. Les requêtes : l'IA, sinon l'annexe de secours.");
image("Un exemple de résultat", path.join(IMG, "..", "..", "stagiaire", "img", "tp5-boutique.png"), "Le vôtre sera organisé en signaux dorés : quatre cases en haut, le détail en dessous, le métier en bas");
tp("TP B", "Le serveur en méthode USE", "Quand le haut du dashboard boutique est rouge, l'infra veut descendre d'un clic vers la machine et regarder chaque ressource : utilisation, saturation, erreurs.", [
  { h: "CPU", p: "Utilisation, charge par cœur, pression (PSI)." },
  { h: "Mémoire", p: "MemAvailable, défauts de page majeurs." },
  { h: "Disque, réseau", p: "Espace, temps d'occupation, erreurs." },
  { h: "Liens, 1860", p: "Relier les deux dashboards, importer Node Exporter Full." },
], "30 minutes. Le piège du panel 2 (« No data ») est le meilleur exercice d'IA de la journée.");
cards("Dashboards : le modèle de maturité", [
  { h: "Faible", p: "Des dashboards partout, copiés, modifiés à la main. Personne ne sait lequel est le bon. On « parcourt » pour trouver l'info." },
  { h: "Moyen", p: "Une méthode (signaux dorés, RED, USE), des variables au lieu des copies, des dossiers, des liens du général vers le détail." },
  { h: "Élevé", p: "Tout est code (JSON, provisioning, Git Sync), relu comme du code. Le même dashboard pour chaque service. On y arrive depuis l'alerte." },
], { sub: "Grafana, Dashboard best practices · grafana.com/docs" });
exercises("Auto-audit : notez votre dashboard sur 10", [
  ["1", "Une question, un public (le titre le dit)"], ["2", "« Ça va ? » en haut, en 5 secondes"], ["3", "Une méthode : signaux dorés, RED, USE"], ["4", "Une unité sur chaque panel"], ["5", "Les couleurs ont le même sens partout"],
  ["6", "Pas plus de 12 panels visibles"], ["7", "Une variable plutôt que des copies"], ["8", "Les incidents annotés"], ["9", "Un lien vers le niveau suivant"], ["10", "Rangé dans un dossier, exportable en code"],
], "8 minutes : le mien, puis celui du voisin. Les plus ratés : 8 et 9.");

// ===========================================================================
// ALERTING
// ===========================================================================
section("PARTIE 3", "Des alertes qui servent", "Un symptôme, une action, le bon canal.");
twoCol("Mauvaise alerte, bonne alerte", { h: "Cause", items: ["« CPU > 90 % »", "Peut-être un problème… ou le serveur qui fait son travail", "Réponse quand ça sonne : « je regarde »", "C'est un panel, pas une alerte"] },
  { h: "Symptôme", items: ["« Les clients attendent plus de 3 s »", "« 5 % des paiements échouent »", "Quelqu'un souffre, il faut agir", "Un runbook, un responsable, une sévérité"] },
  { rightColor: C.navy, sub: "« Keep alerting simple, alert on symptoms » — prometheus.io/docs/practices/alerting" });
diagram("Le cycle de vie d'une alerte", "cycle-alerte", "Inactive → Pending (pendant le for) → Firing → l'Alertmanager groupe, attend, envoie");
diagram("Deux chemins vers les mêmes canaux", "notifications", "Prometheus + Alertmanager, ou Grafana : Teams, Slack, e-mail. Jamais la même alerte des deux côtés.");
table("Alertmanager ↔ Grafana : les mêmes concepts", ["Prometheus + Alertmanager", "Grafana"], [
  ["règle dans alerts.yml", "Alert rule (interface ou provisioning)"], ["for", "Pending period"], ["receiver", "Contact point"], ["route", "Notification policy"], ["silence", "Silence"], ["time_intervals", "Mute timing"], ["inhibit_rules", "(pas d'équivalent direct)"],
], { colW: [4.5, 4.5], size: 13, rowH: 0.42 });
diagram("L'arbre de routage", "arbre-routage", "L'alerte entre par la racine et descend ; continue: true = elle continue sa descente (la photocopie)");
tp("TP C", "Prometheus, Alertmanager, Teams, Slack et e-mail", "L'astreinte veut le critique dans Teams. L'équipe boutique veut ses alertes dans Slack et par e-mail. L'infra dans sa boîte. Et personne ne veut « le paiement est lent » quand le site est déjà en erreur.", [
  { h: "Règles", p: "cp jour3/alerting/alerts.yml : lire, symptôme ou cause ?" },
  { h: "Routage", p: "Prédire, puis amtool config routes test." },
  { h: "Casser", p: "chaos errors : Teams, Slack, e-mail, chronométrés." },
  { h: "Inhibition", p: "Le critique fait taire le warning." },
  { h: "Silence", p: "Maintenance de 30 minutes." },
], "50 minutes. Partie 6 en démonstration : le vrai Teams avec ./jour3.sh teams.");
cards("Teams en 2026 : un workflow, une adresse", [
  { n: 1, h: "Dans Teams", p: "Le canal (ou la conversation) → ⋯ → Workflows → modèle « Send webhook alerts to a channel » (Post to a channel when a webhook request is received)." },
  { n: 2, h: "L'adresse", p: "Le workflow donne une URL. C'est un secret : qui l'a peut écrire dans le canal." },
  { n: 3, h: "Grafana", p: "Contact point Microsoft Teams → coller l'URL → Test." },
  { n: 4, h: "Alertmanager", p: "msteamsv2_configs avec webhook_url_file : l'URL dans un fichier, pas dans Git. Au lab : ./jour3.sh teams '<URL>'." },
], { grid: true, sub: "Les connecteurs « Incoming Webhook » d'Office 365 sont remplacés par les workflows" });
twoCol("L'e-mail, sans surprise", { h: "Au lab", items: ["Mailpit : un faux serveur SMTP avec une interface web (port 8025)", "Grafana : contact point Email, GF_SMTP_HOST=mailpit:1025", "Alertmanager : email_configs, smarthost mailpit:1025", "On voit l'e-mail exactement comme le destinataire"] },
  { h: "En production", items: ["Le relais SMTP de l'entreprise (Exchange, Microsoft 365)", "TLS et un compte de service, mot de passe en fichier", "Une liste de diffusion par équipe, pas des adresses nominatives", "L'e-mail pour le non urgent ; Teams ou l'astreinte pour le critique"] }, { rightColor: C.navy });
tp("TP D", "L'alerting de Grafana, Teams en vrai", "Le directeur commercial ne lira jamais un YAML. Il veut un e-mail si le chiffre d'affaires s'effondre, et l'astreinte veut voir l'alerte dans Teams. On ne duplique pas les alertes du TP C.", [
  { h: "Contact points", p: "Email (Mailpit) et Microsoft Teams (l'URL de la salle) : Test !" },
  { h: "Politique", p: "Défaut → Teams ; team=commerce → e-mail." },
  { h: "Règle métier", p: "CA / heure sous la moitié : ./lab.sh traffic 1." },
  { h: "Comparer", p: "Le tableau Alertmanager / Grafana, ensemble." },
], "30 minutes. Le moment où les messages des stagiaires arrivent dans le Teams projeté.");
twoCol("Quand utiliser quoi", { h: "Prometheus + Alertmanager", items: ["Alertes techniques, critiques, qui doivent survivre à tout", "Dans Git, relues, testées (promtool, amtool)", "Inhibition, routage fin, haute disponibilité simple"] },
  { h: "Grafana", items: ["Alertes métier, multi-sources (SQL, logs, cloud)", "Pour les équipes qui vivent dans Grafana", "Le lien règle ↔ panel, réglable dans l'interface"] }, { rightColor: C.navy, sub: "Les deux coexistent très bien. Jamais la même alerte des deux côtés." });
table("Le niveau suivant : alerter sur un budget d'erreur", ["Vitesse de consommation", "Fenêtre longue", "Fenêtre courte", "Budget consommé", "Action"], [
  ["14,4 × la normale", "1 h", "5 min", "2 %", "On réveille quelqu'un"],
  ["6 × la normale", "6 h", "30 min", "5 %", "On réveille quelqu'un"],
  ["1 × la normale", "3 jours", "6 h", "10 %", "Un ticket, demain matin"],
], { colW: [2.2, 1.5, 1.5, 1.6, 2.2], size: 13, rowH: 0.5, sub: "Objectif 99,9 % sur 30 jours · Google, The Site Reliability Workbook, ch. 5 « Alerting on SLOs »" });

// ===========================================================================
// BONNES PRATIQUES, JEU, ÉCHELLE
// ===========================================================================
section("PARTIE 4", "Bonnes pratiques, jeu, et après", "Ce qu'on vérifie avant la production. Puis on joue.");
cards("Configurer Prometheus proprement", [
  { h: "Des intervalles sages", p: "15 à 60 s pour le scrape. scrape_timeout inférieur à l'intervalle." },
  { h: "Des labels qui identifient", p: "external_labels cluster et replica ; env, team, service sur les cibles. Jamais d'identifiant unique en label." },
  { h: "Des garde-fous", p: "sample_limit sur les exporters tiers, metric_relabel_configs pour jeter l'inutile." },
  { h: "Valider avant de recharger", p: "promtool check config, check rules, test rules en CI." },
  { h: "Une rétention raisonnable", p: "15 à 30 jours en local. Au-delà : Thanos, Mimir, VictoriaMetrics." },
  { h: "Des versions figées", p: "La LTS, en version exacte, jamais latest." },
], { grid: true, sub: "prometheus.io/docs/practices" });
twoCol("Sécuriser Prometheus et Grafana", { h: "Prometheus", items: ["Aucune authentification par défaut : jamais exposé tel quel", "web.config.file (TLS, bcrypt) ou reverse proxy SSO", "API admin seulement si nécessaire", "Secrets en *_file, jamais dans le YAML", "TLS vérifié vers les cibles"] },
  { h: "Grafana", items: ["Mot de passe admin changé au premier démarrage", "Pas d'accès anonyme, jamais en Admin", "SSO, équipes, droits par dossier", "Service accounts à jetons limités", "Sources de données provisionnées"] }, { rightColor: C.navy, sub: "prometheus.io/docs/operating/security · grafana.com/docs : Configure security" });
tp("ESCAPE GAME", "La boutique sabotée", "Cette nuit, quelqu'un a saboté la boutique. Deux incidents se cachent. Vous êtes l'astreinte : trouvez-les avec vos outils, et seulement eux.", [
  { h: "./jour3.sh mystere", p: "Puis on ferme le terminal. 12 minutes." },
  { h: "Enquêter", p: "Dashboards, Explore, alertes, Inbox, Mailpit, l'IA. Pas de docker, pas de logs." },
  { h: "Le rapport", p: "Quoi, où, quel signal, quel outil, quelle alerte." },
  { h: "La vérité", p: "./jour3.sh solution, puis les questions éclair." },
], "20 minutes. En binôme ou seul. 3 points par incident localisé, bonus pour l'incident sans alerte.");
table("Le barème de l'escape game", ["Ce que vous trouvez", "Points"], [
  ["Un incident, avec sa localisation (quelle instance, quel service)", "3 par incident"],
  ["Le bon signal doré ou la bonne ressource USE", "1 par incident"],
  ["L'outil ou le panel qui l'a montré", "1 par incident"],
  ["L'alerte qui a sonné et son canal (ou : aucune)", "1 par incident"],
  ["Un incident qui n'a déclenché aucune alerte, et l'alerte qui manquait", "2 de bonus"],
  ["Les questions éclair, à la fin", "1 par bonne réponse"],
], { colW: [6.8, 2.2], size: 13, rowH: 0.48, note: "Score sur 20. Le binôme gagnant choisit la musique de la pause suivante… ou est applaudi." });
diagram("Thanos en cinq minutes", "thanos", "Vue globale, déduplication, historique long sur stockage objet · ./jour3.sh thanos on, port 10902");
{
  const s = base(true); s._key = "Lundi matin jour 3";
  s.addText("Lundi matin", { x: 0.7, y: 0.9, w: 8.6, h: 0.7, fontFace: FONT, fontSize: 32, bold: true, color: C.white, isTextBox: true, margin: 0 });
  s.addText("Choisissez un service. Un seul.\nSes quatre signaux dorés en haut d'un dashboard. Une alerte sur un symptôme,\navec un responsable, un runbook, et le bon canal Teams. Le reste viendra.", { x: 0.7, y: 1.7, w: 8.6, h: 1.6, fontFace: FONT, fontSize: 19, color: C.light, isTextBox: true, margin: 0 });
  s.addText("Dans votre guide : la synthèse de la formation, les checklists de mise en production, les ressources.\ngithub.com/yparent/formation-observabilite-lab · sre.google · prometheus.io/docs/practices · grafana.com/docs", { x: 0.7, y: 3.5, w: 8.6, h: 0.9, fontFace: FONT, fontSize: 12, color: C.peach, isTextBox: true, margin: 0 });
  s.addText("Merci à tous.", { x: 0.7, y: 4.5, w: 7.2, h: 0.4, fontFace: FONT, fontSize: 16, color: C.white, isTextBox: true, margin: 0 });
  logoDark(s, 8.2, 4.6, 1.3);
}
