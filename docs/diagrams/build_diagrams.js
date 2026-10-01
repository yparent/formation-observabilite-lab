// Schémas "à la main" du deck (style Excalidraw : rough.js + pictogrammes lucide).
// node docs/diagrams/build_diagrams.js  → docs/diagrams/*.png
const fs = require("fs");
const path = require("path");
const os = require("os");

const NM = fs.existsSync("/home/claude/.npm-global/lib/node_modules") ? "/home/claude/.npm-global/lib/node_modules" : require("child_process").execSync("npm root -g").toString().trim();
const ROUGH = fs.readFileSync(path.join(NM, "roughjs", "bundled", "rough.js"), "utf8");
const FONT = fs.readFileSync(path.join(NM, "@fontsource", "patrick-hand", "files", "patrick-hand-latin-400-normal.woff2")).toString("base64");
const ICONS = path.join(NM, "lucide-static", "icons");
const OUT = __dirname;
fs.mkdirSync(OUT, { recursive: true });

// Palette Excalidraw
const P = {
  ink: "#1e1e1e", grey: "#868e96",
  orange: "#ffd8a8", orangeS: "#e8590c",
  blue: "#a5d8ff", blueS: "#1971c2",
  green: "#b2f2bb", greenS: "#2f9e44",
  violet: "#d0bfff", violetS: "#7048e8",
  yellow: "#ffec99", yellowS: "#f08c00",
  red: "#ffc9c9", redS: "#e03131",
  neutral: "#e9ecef", neutralS: "#495057",
  teal: "#96f2d7", tealS: "#0ca678",
};

function icon(name, color = P.ink, size = 40) {
  const p = path.join(ICONS, `${name}.svg`);
  if (!fs.existsSync(p)) throw new Error(`icône inconnue : ${name}`);
  let svg = fs.readFileSync(p, "utf8");
  svg = svg.replace(/<svg[^>]*>/, "").replace("</svg>", "");
  return { body: svg, color, size };
}

// Un schéma = liste d'opérations, exécutées dans le navigateur avec rough.js.
class D {
  constructor(name, w = 1800, h = 720) { this.name = name; this.w = w; this.h = h; this.ops = []; this.seed = 1; }
  node(x, y, w, h, o = {}) { if (typeof o.ico === "string") o.ico = icon(o.ico, o.stroke || P.ink); this.ops.push({ t: "node", x, y, w, h, ...o }); return this; }
  ellipse(x, y, w, h, o = {}) { this.ops.push({ t: "ellipse", x, y, w, h, ...o }); return this; }
  cyl(x, y, w, h, o = {}) { if (typeof o.ico === "string") o.ico = icon(o.ico, o.stroke || P.ink); this.ops.push({ t: "cyl", x, y, w, h, ...o }); return this; }
  arrow(x1, y1, x2, y2, o = {}) { this.ops.push({ t: "arrow", x1, y1, x2, y2, ...o }); return this; }
  line(x1, y1, x2, y2, o = {}) { this.ops.push({ t: "line", x1, y1, x2, y2, ...o }); return this; }
  group(x, y, w, h, o = {}) { this.ops.push({ t: "group", x, y, w, h, ...o }); return this; }
  text(x, y, s, o = {}) { this.ops.push({ t: "text", x, y, s, ...o }); return this; }
  ico(x, y, name, o = {}) { this.ops.push({ t: "icon", x, y, ...icon(name, o.color || P.ink, o.size || 44) }); return this; }
  note(x, y, w, h, s, o = {}) { this.ops.push({ t: "note", x, y, w, h, s, ...o }); return this; }
}

const diagrams = [];

// ---------------------------------------------------------------------------
// 1. Le lab
{
  const d = new D("lab-architecture");
  d.group(40, 60, 560, 620, { label: "Ce qu'on surveille" });
  d.node(80, 120, 200, 110, { label: "traffic", sub: "clients simulés", fill: P.neutral, stroke: P.neutralS, ico: "users" });
  d.node(340, 100, 220, 90, { label: "shop-api-1", fill: P.green, stroke: P.greenS, ico: "shopping-cart" });
  d.node(340, 210, 220, 90, { label: "shop-api-2", fill: P.green, stroke: P.greenS, ico: "shopping-cart" });
  d.arrow(280, 175, 340, 150); d.arrow(280, 175, 340, 250);
  d.node(320, 340, 240, 90, { label: "Redis", sub: "+ redis_exporter", fill: P.red, stroke: P.redS, ico: "database", small: true });
  d.node(320, 450, 240, 90, { label: "Node Exporter", sub: "la machine", fill: P.neutral, stroke: P.neutralS, ico: "server", small: true });
  d.node(320, 560, 240, 90, { label: "Blackbox", sub: "sondes HTTP", fill: P.neutral, stroke: P.neutralS, ico: "radar", small: true });
  d.node(70, 560, 220, 90, { label: "Pushgateway", sub: "le batch pousse", fill: P.neutral, stroke: P.neutralS, ico: "upload", small: true });
  d.node(700, 260, 320, 200, { label: "Prometheus", sub: "scrape · TSDB · règles", fill: P.orange, stroke: P.orangeS, ico: "flame", big: true });
  [145, 255, 385, 495, 605].forEach((y) => d.arrow(700, 340 + (y - 375) * 0.25, 560, y, { color: P.orangeS }));
  d.arrow(700, 400, 280, 605, { color: P.orangeS });
  d.text(860, 500, "pull HTTP /metrics, toutes les 15 s", { size: 26, color: P.orangeS });
  d.node(1180, 90, 300, 130, { label: "Grafana", sub: "dashboards, alerting", fill: P.blue, stroke: P.blueS, ico: "layout-dashboard" });
  d.node(1180, 300, 300, 130, { label: "Alertmanager", sub: "route, groupe, inhibe", fill: P.violet, stroke: P.violetS, ico: "bell-ring" });
  d.node(1180, 510, 300, 130, { label: "Inbox", sub: "joue Teams / Slack", fill: P.yellow, stroke: P.yellowS, ico: "inbox" });
  d.arrow(1180, 160, 1020, 300, { label: "PromQL", color: P.blueS });
  d.arrow(1020, 400, 1180, 365, { label: "alertes", color: P.violetS });
  d.arrow(1330, 430, 1330, 510, { label: "notifications", color: P.yellowS });
  d.arrow(1330, 220, 1330, 300, { color: P.blueS, dashed: true });
  d.node(700, 570, 320, 110, { label: "Thanos", sub: "jour 3, TP 10", fill: P.teal, stroke: P.tealS, ico: "layers", dashed: true, small: true });
  d.arrow(860, 530, 860, 570, { dashed: true, color: P.tealS });
  diagrams.push(d);
}

// 2. Les briques, une à la fois
{
  const d = new D("briques", 1800, 720);
  const steps = [
    ["Ex. 1.1", "Prometheus", "binaire", "flame", P.orange, P.orangeS],
    ["Ex. 1.4", "Grafana", "binaire", "layout-dashboard", P.blue, P.blueS],
    ["Ex. 1.7", "01 + 02", "en conteneurs", "container", P.neutral, P.neutralS],
    ["TP 1", "04 Node Exporter", "la machine", "server", P.neutral, P.neutralS],
    ["TP 2", "03 shop-api", "+ 05 exporters", "shopping-cart", P.green, P.greenS],
    ["Ex. 3.0", "06 Alertmanager", "+ Inbox", "bell-ring", P.violet, P.violetS],
    ["TP 10", "07 Thanos", "deux Prometheus", "layers", P.teal, P.tealS],
  ];
  d.line(80, 470, 1720, 470, { color: P.grey, width: 3 });
  steps.forEach((s, i) => {
    const x = 60 + i * 242;
    const y = 190 + (i % 2 === 0 ? 0 : 70);
    d.node(x, y, 230, 170, { label: s[1], sub: s[2], fill: s[4], stroke: s[5], ico: s[3], topIcon: true, compact: true });
    d.ellipse(x + 93, 450, 44, 44, { fill: "#fff", stroke: P.ink, solid: true });
    d.line(x + 115, y + 170, x + 115, 450, { color: P.grey, dashed: true });
    d.text(x + 115, 540, s[0], { size: 34, bold: true });
  });
  d.text(180, 640, "Jour 1", { size: 34, color: P.orangeS }); d.text(1330, 640, "Jour 3", { size: 34, color: P.violetS });
  d.line(60, 610, 1240, 610, { color: P.orangeS, width: 4 }); d.line(1280, 610, 1740, 610, { color: P.violetS, width: 4 });
  d.text(900, 90, "docker-compose.yml = une liste d'include commentés, un fichier par brique dans compose/", { size: 30, color: P.grey });
  d.text(900, 135, "on décommente, ./lab.sh up, on regarde ce que la brique apporte", { size: 30, color: P.grey });
  diagrams.push(d);
}

// 3. Les composants
{
  const d = new D("composants");
  d.node(80, 240, 300, 150, { label: "Cibles", sub: "une page /metrics", fill: P.green, stroke: P.greenS, ico: "file-text" });
  d.node(80, 470, 300, 130, { label: "Service discovery", sub: "K8s, Consul, DNS, fichier", fill: P.neutral, stroke: P.neutralS, ico: "search" });
  d.node(560, 200, 480, 320, { label: "Prometheus", fill: P.orange, stroke: P.orangeS, ico: "flame", big: true, subLines: ["scrape  →  le journaliste", "TSDB    →  les archives", "règles  →  le rédacteur en chef"] });
  d.node(1240, 120, 420, 150, { label: "Grafana", sub: "la maquette : dashboards", fill: P.blue, stroke: P.blueS, ico: "layout-dashboard" });
  d.node(1240, 400, 420, 150, { label: "Alertmanager", sub: "qui prévenir, quand", fill: P.violet, stroke: P.violetS, ico: "bell-ring" });
  d.node(1300, 600, 300, 90, { label: "Teams · Slack · PagerDuty", fill: P.yellow, stroke: P.yellowS, small: true });
  d.arrow(560, 300, 380, 300, { label: "pull HTTP, 15 s", color: P.orangeS });
  d.arrow(380, 530, 560, 440, { label: "qui scraper ?", color: P.neutralS });
  d.arrow(1240, 210, 1040, 300, { label: "PromQL", color: P.blueS });
  d.arrow(1040, 430, 1240, 470, { label: "alertes", color: P.violetS });
  d.arrow(1450, 550, 1450, 600, { color: P.yellowS });
  diagrams.push(d);
}

// 4. Pull contre push
{
  const d = new D("pull-push");
  d.text(450, 80, "Push : le livreur de pizza", { size: 40, bold: true, color: P.redS });
  for (let i = 0; i < 4; i++) d.node(80 + i * 190, 160, 150, 100, { label: `agent ${i + 1}`, fill: P.neutral, stroke: P.neutralS, ico: "truck", small: true });
  d.node(300, 420, 300, 130, { label: "Serveur", sub: "central", fill: P.red, stroke: P.redS, ico: "server" });
  for (let i = 0; i < 4; i++) d.arrow(155 + i * 190, 260, 400 + i * 30, 420, { color: P.redS });
  d.note(80, 590, 780, 90, "Mille serveurs en panne = mille livreurs qui sonnent en même temps.\nLe monitoring tombe quand on en a besoin.");
  d.line(900, 60, 900, 680, { color: P.grey, dashed: true });
  d.text(1350, 80, "Pull : le buffet à volonté", { size: 40, bold: true, color: P.greenS });
  for (let i = 0; i < 3; i++) d.node(980 + i * 190, 160, 150, 100, { label: `cible ${i + 1}`, sub: "/metrics", fill: P.green, stroke: P.greenS, ico: "utensils", small: true });
  d.node(1200, 420, 300, 130, { label: "Prometheus", sub: "se sert à son rythme", fill: P.orange, stroke: P.orangeS, ico: "flame" });
  for (let i = 0; i < 4; i++) d.arrow(1300 + i * 30, 420, 1055 + i * 190, 260, { color: P.orangeS });
  d.node(1550, 160, 150, 100, { label: "cible 4", sub: "muette", fill: P.red, stroke: P.redS, ico: "x", small: true });
  d.text(1625, 300, "up == 0", { size: 30, color: P.redS, bold: true });
  d.note(980, 590, 780, 90, "Une cible qui ne répond pas, c'est une information.\nOn débogue au curl. Le push reste pour les batchs (Pushgateway).");
  diagrams.push(d);
}

// 5. Les trois signaux
{
  const d = new D("trois-signaux");
  const cols = [
    ["Métriques", "activity", P.orange, P.orangeS, ["des nombres horodatés", "quelques octets par point", "agrégeables, tendances, alertes", "Prometheus"]],
    ["Logs", "scroll-text", P.blue, P.blueS, ["des événements texte", "riches, chers à stocker", "le détail après coup", "Loki"]],
    ["Traces", "footprints", P.violet, P.violetS, ["le parcours d'une requête", "service par service", "indispensables en microservices", "Tempo, OpenTelemetry"]],
  ];
  cols.forEach((c, i) => {
    const x = 100 + i * 560;
    d.node(x, 80, 480, 560, { label: c[0], fill: c[2], stroke: c[3], ico: c[1], big: true, subLines: c[4], topIcon: true });
  });
  d.arrow(580, 360, 660, 360, { color: P.grey, label: "corrélés" }); d.arrow(1140, 360, 1220, 360, { color: P.grey, label: "dans Grafana" });
  d.text(900, 690, "Trois jours sur le premier. Les deux autres : la suite logique.", { size: 30, color: P.grey });
  diagrams.push(d);
}

// 6. La TSDB
{
  const d = new D("tsdb");
  d.node(80, 260, 260, 130, { label: "scrape", sub: "toutes les 15 s", fill: P.green, stroke: P.greenS, ico: "download" });
  d.arrow(340, 325, 460, 325, { color: P.greenS });
  d.group(460, 120, 560, 420, { label: "mémoire" });
  d.node(520, 200, 440, 130, { label: "Head", sub: "les 2 dernières heures", fill: P.orange, stroke: P.orangeS, ico: "cpu" });
  d.node(520, 380, 440, 110, { label: "WAL", sub: "journal sur disque : survit au crash", fill: P.yellow, stroke: P.yellowS, ico: "file-text" });
  d.arrow(740, 330, 740, 380, { color: P.yellowS, dashed: true });
  d.arrow(1020, 265, 1140, 265, { color: P.orangeS }); d.text(1080, 300, "toutes les 2 h", { size: 22, color: P.orangeS });
  d.group(1140, 120, 600, 420, { label: "disque : data/" });
  [0, 1, 2].forEach((i) => d.node(1190 + i * 180, 220, 165, 170, { label: `bloc`, sub: "2 h, figé", fill: P.neutral, stroke: P.neutralS, ico: "package", small: true }));
  d.text(1440, 460, "index + chunks · 1 à 2 octets / échantillon", { size: 26, color: P.grey });
  d.text(1440, 500, "compaction 2 h → 6 h → 18 h… · rétention 15 j", { size: 26, color: P.grey });
  d.node(1240, 590, 400, 100, { label: "snapshot", sub: "liens durs vers les blocs + le head", fill: P.blue, stroke: P.blueS, ico: "copy", small: true });
  d.text(560, 620, "Une requête lit le head puis les blocs.\nGrafana ne voit rien de tout ça.", { size: 28, color: P.grey });
  diagrams.push(d);
}

// 7. Des binaires aux conteneurs
{
  const d = new D("binaire-conteneur");
  d.text(450, 80, "Ce matin : un binaire", { size: 40, bold: true, color: P.orangeS });
  d.node(120, 150, 260, 120, { label: "./prometheus", sub: "install/bin/prometheus/", fill: P.orange, stroke: P.orangeS, ico: "terminal", small: true });
  d.node(120, 320, 260, 110, { label: "prometheus.yml", sub: "install/", fill: P.yellow, stroke: P.yellowS, ico: "file-code", small: true });
  d.node(120, 480, 260, 110, { label: "data/", sub: "wal/, chunks_head/", fill: P.neutral, stroke: P.neutralS, ico: "hard-drive", small: true });
  d.node(520, 150, 260, 120, { label: "./bin/grafana", sub: "--homepath=$PWD", fill: P.blue, stroke: P.blueS, ico: "terminal", small: true });
  d.node(520, 320, 260, 110, { label: "conf/", sub: "defaults.ini", fill: P.yellow, stroke: P.yellowS, ico: "file-code", small: true });
  d.node(520, 480, 260, 110, { label: "data/grafana.db", sub: "SQLite", fill: P.neutral, stroke: P.neutralS, ico: "database", small: true });
  d.text(450, 650, "kill -HUP · localhost:9090 · datasource cliquée à la main", { size: 26, color: P.grey });
  d.arrow(840, 380, 960, 380, { color: P.ink, width: 4, label: "ex. 1.7" });
  d.text(1350, 80, "Cet après-midi : la même chose, en boîte", { size: 40, bold: true, color: P.blueS });
  d.group(1000, 130, 340, 500, { label: "conteneur prometheus" });
  d.node(1040, 200, 260, 110, { label: "prometheus", sub: "v3.13.3 (LTS)", fill: P.orange, stroke: P.orangeS, ico: "container", small: true });
  d.node(1040, 350, 260, 100, { label: "/etc/prometheus", sub: "← prometheus/ (montage)", fill: P.yellow, stroke: P.yellowS, ico: "file-code", small: true });
  d.node(1040, 490, 260, 100, { label: "/prometheus", sub: "← volume nommé", fill: P.neutral, stroke: P.neutralS, ico: "hard-drive", small: true });
  d.group(1400, 130, 340, 500, { label: "conteneur grafana" });
  d.node(1440, 200, 260, 110, { label: "grafana/grafana", sub: "13.2.1", fill: P.blue, stroke: P.blueS, ico: "container", small: true });
  d.node(1440, 350, 260, 100, { label: "provisioning/", sub: "datasource + dashboards", fill: P.yellow, stroke: P.yellowS, ico: "file-code", small: true });
  d.node(1440, 490, 260, 100, { label: "/var/lib/grafana", sub: "← volume nommé", fill: P.neutral, stroke: P.neutralS, ico: "database", small: true });
  d.text(1370, 665, "reload par HTTP · http://prometheus:9090 · datasource provisionnée", { size: 26, color: P.grey });
  diagrams.push(d);
}

// 8. Blackbox : le relabeling
{
  const d = new D("blackbox-relabel");
  d.node(80, 280, 320, 150, { label: "Prometheus", sub: "job blackbox-http", fill: P.orange, stroke: P.orangeS, ico: "flame" });
  d.node(1000, 280, 380, 150, { label: "Blackbox Exporter", sub: ":9115", fill: P.neutral, stroke: P.neutralS, ico: "radar" });
  d.node(1520, 280, 240, 150, { label: "shop-api-1", sub: "/health", fill: P.green, stroke: P.greenS, ico: "shopping-cart" });
  d.arrow(400, 355, 1000, 355, { color: P.orangeS, width: 3 });
  d.text(760, 465, "GET /probe?module=http_2xx&target=http://shop-api-1:5000/health", { size: 22, color: P.orangeS, mono: true });
  d.arrow(1380, 340, 1520, 340, { color: P.greenS });
  d.arrow(1520, 380, 1380, 380, { color: P.greenS, dashed: true });
  d.text(1450, 470, "la vraie sonde : 200 OK en 12 ms", { size: 24, color: P.greenS });
  d.group(60, 60, 1680, 190, { label: "relabel_configs, avant le scrape" });
  d.node(100, 110, 500, 110, { label: "1. __address__ → __param_target", sub: "la cible devient un paramètre d'URL", fill: P.yellow, stroke: P.yellowS, small: true });
  d.node(640, 110, 480, 110, { label: "2. __param_target → instance", sub: "pour savoir de qui on parle", fill: P.yellow, stroke: P.yellowS, small: true });
  d.node(1160, 110, 540, 110, { label: "3. __address__ = blackbox-exporter:9115", sub: "c'est lui qu'on scrape vraiment", fill: P.yellow, stroke: P.yellowS, small: true });
  d.note(80, 520, 700, 160, "up{job=\"blackbox-http\"} = 1 : l'exporter répond.\nprobe_success = 0 : la cible, elle, est tombée.\nAvec le Blackbox, up ne veut plus dire ce qu'on croit.");
  d.note(860, 520, 700, 160, "Résultat étiqueté\ninstance=\"http://shop-api-1:5000/health\"\net non instance=\"blackbox-exporter:9115\".");
  diagrams.push(d);
}

// 9. Cycle de vie d'une alerte
{
  const d = new D("cycle-alerte");
  const states = [["inactive", P.neutral, P.neutralS, "circle"], ["pending", P.yellow, P.yellowS, "timer"], ["firing", P.red, P.redS, "siren"]];
  states.forEach((s, i) => d.node(60 + i * 470, 80, 260, 140, { label: s[0], fill: s[1], stroke: s[2], ico: s[3] }));
  d.arrow(320, 150, 530, 150, { color: P.yellowS }); d.text(425, 110, "expr renvoie\ndes séries", { size: 22, color: P.yellowS });
  d.arrow(790, 150, 1000, 150, { color: P.redS }); d.text(895, 110, "for écoulé\n(2 min)", { size: 22, color: P.redS });
  d.arrow(1130, 220, 190, 220, { color: P.greenS, curve: -130 });
  d.text(660, 400, "plus de séries, puis keep_firing_for (3 min) → resolved", { size: 24, color: P.greenS });
  d.node(1460, 80, 280, 140, { label: "Alertmanager", sub: "reçoit toutes les 1 min", fill: P.violet, stroke: P.violetS, ico: "bell-ring", small: true });
  d.arrow(1260, 150, 1460, 150, { color: P.violetS });
  d.group(1000, 430, 760, 250, { label: "puis, côté Alertmanager" });
  d.node(1040, 490, 200, 130, { label: "group_wait", sub: "30 s", fill: P.violet, stroke: P.violetS, small: true, ico: "clock" });
  d.node(1280, 490, 200, 130, { label: "group_interval", sub: "5 min", fill: P.violet, stroke: P.violetS, small: true, ico: "repeat" });
  d.node(1520, 490, 200, 130, { label: "repeat_interval", sub: "4 h", fill: P.violet, stroke: P.violetS, small: true, ico: "history" });
  d.note(80, 430, 840, 250, "Chaque paramètre a un coût en réactivité, et ils s'additionnent :\nfenêtre [5m] + for + group_wait avant la première notification,\nfenêtre + keep_firing_for + group_interval avant le « resolved ».\nAu TP 6, on chronomètre.");
  diagrams.push(d);
}

// 10. L'arbre de routage
{
  const d = new D("arbre-routage");
  d.node(700, 60, 400, 120, { label: "route racine", sub: "receiver: inbox-default · group_by alertname, job", fill: P.violet, stroke: P.violetS, ico: "git-branch" });
  d.node(180, 300, 380, 120, { label: "severity = critical", sub: "→ astreinte-teams", fill: P.red, stroke: P.redS, ico: "siren" });
  d.node(710, 300, 380, 120, { label: "team = boutique", sub: "→ boutique-slack", fill: P.green, stroke: P.greenS, ico: "shopping-cart" });
  d.node(1240, 300, 380, 120, { label: "team = infra", sub: "→ infra-inbox · mute le week-end", fill: P.blue, stroke: P.blueS, ico: "server" });
  d.arrow(850, 180, 370, 300, { color: P.violetS, label: "continue: true" });
  d.arrow(900, 180, 900, 300, { color: P.violetS });
  d.arrow(950, 180, 1430, 300, { color: P.violetS });
  d.text(1010, 225, "première route qui matche, sauf continue", { size: 24, color: P.grey });
  d.node(180, 520, 380, 120, { label: "Teams", sub: "msteamsv2_configs (Workflows)", fill: P.neutral, stroke: P.neutralS, ico: "message-square", small: true });
  d.node(710, 520, 380, 120, { label: "Slack", sub: "slack_configs", fill: P.neutral, stroke: P.neutralS, ico: "send", small: true });
  d.node(1240, 520, 380, 120, { label: "Inbox / webhook", sub: "webhook_configs", fill: P.neutral, stroke: P.neutralS, ico: "inbox", small: true });
  [370, 900, 1430].forEach((x) => d.arrow(x, 420, x, 520, { color: P.grey }));
  d.note(60, 60, 540, 150, "Regroupement : 50 instances down = 1 notification.\nInhibition : le serveur est éteint, inutile de dire qu'il est lent.\nSilences et time_intervals : maintenances, nuits, week-ends.");
  d.text(1500, 130, "amtool config routes test severity=critical", { size: 22, color: P.grey, mono: true });
  diagrams.push(d);
}

// 11. Thanos
{
  const d = new D("thanos");
  d.group(60, 80, 520, 300, { label: "Site A" });
  d.node(100, 150, 220, 180, { label: "Prometheus", sub: "replica: prom-1", fill: P.orange, stroke: P.orangeS, ico: "flame" });
  d.node(350, 150, 200, 180, { label: "Sidecar", sub: "lit la TSDB", fill: P.teal, stroke: P.tealS, ico: "layers", small: true });
  d.arrow(350, 240, 320, 240, { color: P.tealS });
  d.group(60, 410, 520, 290, { label: "Site B" });
  d.node(100, 480, 220, 180, { label: "Prometheus B", sub: "replica: prom-2", fill: P.orange, stroke: P.orangeS, ico: "flame" });
  d.node(350, 480, 200, 180, { label: "Sidecar", sub: "lit la TSDB", fill: P.teal, stroke: P.tealS, ico: "layers", small: true });
  d.arrow(350, 570, 320, 570, { color: P.tealS });
  d.node(760, 80, 380, 190, { label: "Querier", sub: "une API Prometheus,\ndéduplication des réplicas", fill: P.teal, stroke: P.tealS, ico: "search", big: true });
  d.arrow(760, 150, 550, 220, { color: P.tealS, label: "gRPC StoreAPI" });
  d.arrow(760, 240, 550, 540, { color: P.tealS });
  d.node(1240, 100, 260, 150, { label: "Grafana", sub: "datasource Thanos", fill: P.blue, stroke: P.blueS, ico: "layout-dashboard", small: true });
  d.arrow(1240, 175, 1140, 175, { color: P.blueS, label: "PromQL" });
  d.cyl(760, 420, 300, 240, { label: "Stockage objet", sub: "S3, GCS, Azure…\nlab : un dossier", fill: P.yellow, stroke: P.yellowS, ico: "cloud" });
  d.arrow(550, 300, 760, 500, { color: P.tealS, label: "blocs terminés" });
  d.arrow(550, 620, 760, 620, { color: P.tealS, dashed: true });
  d.node(1140, 440, 300, 150, { label: "Store Gateway", sub: "sert les blocs du bucket", fill: P.teal, stroke: P.tealS, ico: "hard-drive" });
  d.arrow(1140, 540, 1060, 540, { color: P.tealS });
  d.arrow(1290, 440, 1060, 270, { color: P.tealS });
  d.node(1500, 440, 260, 150, { label: "Compactor", sub: "fusion, rétention,\ndownsampling 5 m / 1 h", fill: P.violet, stroke: P.violetS, ico: "combine", small: true });
  d.arrow(1500, 570, 1060, 620, { color: P.violetS, dashed: true, curve: -60 });
  d.text(1290, 700, "Historique : 13 mois dans le bucket · Vue globale : le Querier · HA : deux Prometheus, un seul résultat", { size: 26, color: P.grey });
  d.note(1240, 290, 520, 100, "external_labels : l'origine de chaque bloc.\nreplica : le label que le Querier ignore.", { size: 24 });
  diagrams.push(d);
}

// 12. Passer à l'échelle : les options
{
  const d = new D("echelle");
  const opts = [
    ["1. Réduire", "cardinalité, drop,\nrecording rules", "filter", P.green, P.greenS],
    ["2. Sharder", "un Prometheus\npar équipe, par cluster", "split", P.yellow, P.yellowS],
    ["3. Fédérer", "un central scrape\n/federate (agrégé)", "network", P.blue, P.blueS],
    ["4. Longue durée", "Thanos, Mimir,\nVictoriaMetrics", "layers", P.teal, P.tealS],
    ["5. Managé", "Grafana Cloud, AMP,\nGMP, Azure", "cloud", P.violet, P.violetS],
  ];
  opts.forEach((o, i) => {
    const x = 70 + i * 345;
    d.node(x, 160, 300, 330, { label: o[0], fill: o[3], stroke: o[4], ico: o[2], big: true, subLines: o[1].split("\n"), topIcon: true });
    if (i < 4) d.arrow(x + 300, 325, x + 345, 325, { color: P.grey });
  });
  d.text(900, 90, "Dans cet ordre. Agrandir avant d'avoir réduit, c'est payer plus cher le même problème.", { size: 30, color: P.grey });
  d.note(300, 560, 1200, 110, "Les signaux : OOM et compactions sans fin → trop de séries. Plus de 30-60 jours → longue durée.\nPlusieurs sites → vue globale. HA « vraie » → deux Prometheus + déduplication.");
  diagrams.push(d);
}

// 13. RED / instrumentation
{
  const d = new D("red");
  d.node(80, 200, 420, 320, { label: "shop-api", sub: "Flask + prometheus_client", fill: P.green, stroke: P.greenS, ico: "shopping-cart", big: true });
  d.node(120, 400, 340, 90, { label: "/metrics", sub: "exposé par la bibliothèque", fill: "#fff", stroke: P.greenS, small: true, solid: true });
  const m = [
    ["Rate", "http_requests_total (Counter)", "combien de requêtes par seconde", "activity", P.orange, P.orangeS],
    ["Errors", "status=~\"5..\" sur le même Counter", "quelle part échoue", "triangle-alert", P.red, P.redS],
    ["Duration", "http_request_duration_seconds (Histogram)", "p95, p99 par route", "timer", P.blue, P.blueS],
    ["Métier", "shop_orders_total, shop_stock_units", "ce que le directeur commercial regarde", "coins", P.yellow, P.yellowS],
  ];
  m.forEach((x, i) => {
    d.node(700, 80 + i * 150, 640, 120, { label: x[0] + " : " + x[1], sub: x[2], fill: x[4], stroke: x[5], ico: x[3], small: true });
    d.arrow(500, 360, 700, 140 + i * 150, { color: P.greenS });
  });
  d.note(1380, 120, 380, 480, "Labels bornés :\nmethod, status, route.\n\nJamais : user_id, email, IP,\nURL brute, terme de recherche.\n\nUn million d'utilisateurs\n= un million de séries.", { size: 25 });
  diagrams.push(d);
}

// 14. Les quatre signaux dorés (service) au-dessus de USE (ressources)
{
  const d = new D("signaux-dores", 1800, 760);
  d.group(40, 50, 1720, 300, { label: "Le service, vu par ses utilisateurs : les quatre signaux dorés (Google SRE)" });
  const g = [
    ["Latence", "le p95, pas la moyenne", "timer", P.blue, P.blueS],
    ["Trafic", "requêtes par seconde", "activity", P.neutral, P.neutralS],
    ["Erreurs", "part des 5xx", "triangle-alert", P.red, P.redS],
    ["Saturation", "à quel point c'est plein", "gauge", P.orange, P.orangeS],
  ];
  g.forEach((x, i) => d.node(80 + i * 420, 120, 380, 190, { label: x[0], sub: x[1], fill: x[3], stroke: x[4], ico: x[2], topIcon: true, compact: true }));
  d.arrow(900, 350, 900, 430, { label: "quand c'est rouge en haut, on descend", color: P.redS });
  d.group(40, 430, 1720, 300, { label: "La machine, ressource par ressource : USE (Brendan Gregg)" });
  const u = [
    ["CPU", "utilisation · charge · pression", "cpu"],
    ["Mémoire", "MemAvailable · défauts de page", "memory-stick"],
    ["Disque", "espace · temps d'occupation", "hard-drive"],
    ["Réseau", "débit · erreurs", "network"],
  ];
  u.forEach((x, i) => d.node(80 + i * 420, 500, 380, 190, { label: x[0], sub: x[1], fill: P.green, stroke: P.greenS, ico: x[2], topIcon: true, compact: true }));
  diagrams.push(d);
}

// 15. Les chemins des notifications
{
  const d = new D("notifications", 1800, 760);
  d.node(60, 90, 320, 150, { label: "Prometheus", sub: "règles dans alerts.yml", fill: P.orange, stroke: P.orangeS, ico: "flame" });
  d.node(520, 90, 340, 150, { label: "Alertmanager", sub: "route · groupe · inhibe", fill: P.violet, stroke: P.violetS, ico: "bell-ring" });
  d.arrow(380, 165, 520, 165, { label: "alertes", color: P.orangeS });
  d.node(60, 480, 320, 150, { label: "Grafana", sub: "règles dans l'interface", fill: P.blue, stroke: P.blueS, ico: "layout-dashboard" });
  d.node(520, 480, 340, 150, { label: "Contact points", sub: "notification policies", fill: P.blue, stroke: P.blueS, ico: "split" });
  d.arrow(380, 555, 520, 555, { color: P.blueS });
  const c = [
    ["Microsoft Teams", "workflow « webhook »", "messages-square", 60, P.violet, P.violetS],
    ["Slack", "incoming webhook", "hash", 290, P.yellow, P.yellowS],
    ["E-mail", "relais SMTP (Mailpit au lab)", "mail", 520, P.green, P.greenS],
  ];
  c.forEach((x) => {
    d.node(1180, x[3], 440, 150, { label: x[0], sub: x[1], fill: x[4], stroke: x[5], ico: x[2] });
    d.arrow(860, 165, 1180, x[3] + 75, { color: P.violetS });
    d.arrow(860, 555, 1180, x[3] + 75, { color: P.blueS, dashed: true });
  });
  d.text(900, 720, "Mêmes canaux, deux chemins. Jamais la même alerte des deux côtés.", { size: 30, color: P.grey });
  diagrams.push(d);
}

// 16. PromQL avec l'IA : demander, comprendre, vérifier
{
  const d = new D("ia-promql", 1800, 720);
  d.node(60, 80, 360, 420, { label: "1. Demander", fill: P.blue, stroke: P.blueS, ico: "message-square", big: true, subLines: ["le contexte", "les # HELP / # TYPE", "ce qu'on veut voir", "« explique-la »"], topIcon: true });
  d.node(520, 80, 360, 420, { label: "2. Comprendre", fill: P.violet, stroke: P.violetS, ico: "bot", big: true, subLines: ["lire l'explication", "chaque fonction", "chaque label", "la reformuler"], topIcon: true });
  d.node(980, 80, 360, 420, { label: "3. Vérifier", fill: P.green, stroke: P.greenS, ico: "check-check", big: true, subLines: ["ça s'exécute", "ordre de grandeur", "rate sur un compteur", "je casse, ça bouge"], topIcon: true });
  d.node(1440, 200, 300, 180, { label: "Le panel", sub: "unité · seuils · légende", fill: P.orange, stroke: P.orangeS, ico: "layout-dashboard" });
  d.arrow(420, 290, 520, 290, { color: P.blueS }); d.arrow(880, 290, 980, 290, { color: P.violetS }); d.arrow(1340, 290, 1440, 290, { color: P.greenS });
  d.arrow(1160, 500, 1160, 580, { color: P.redS, dashed: true }); d.line(1160, 580, 240, 580, { color: P.redS, dashed: true }); d.arrow(240, 580, 240, 500, { color: P.redS, dashed: true }); d.text(700, 615, "faux ? on redonne l'erreur à l'IA, et on recommence", { size: 28, color: P.redS });
  d.text(900, 680, "Jamais de données de production sensibles dans une IA publique.", { size: 30, color: P.redS });
  diagrams.push(d);
}

// ---------------------------------------------------------------------------
// Rendu HTML → PNG
function html(d) {
  return `<!doctype html><html><head><meta charset="utf-8">
<style>
@font-face{font-family:"Hand";src:url(data:font/woff2;base64,${FONT}) format("woff2");}
html,body{margin:0;background:#fff;width:${d.w}px;height:${d.h}px;overflow:hidden}
svg{display:block}
text{font-family:"Hand",sans-serif;fill:${P.ink}}
.mono{font-family:"Courier New",monospace}
</style></head><body>
<svg id="c" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}" xmlns="http://www.w3.org/2000/svg"></svg>
<script>${ROUGH}</script>
<script>
const ops = ${JSON.stringify(d.ops)};
const svg = document.getElementById("c");
const rc = rough.svg(svg);
let seed = 7;
const NS = "http://www.w3.org/2000/svg";
function el(n, a, txt) { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (txt !== undefined) e.textContent = txt; return e; }
function T(x, y, s, o = {}) {
  const t = el("text", { x, y, "font-size": o.size || 28, "text-anchor": o.anchor || "middle", "dominant-baseline": "middle", fill: o.color || "${P.ink}", "font-weight": o.bold ? "bold" : "normal", class: o.mono ? "mono" : "" });
  const lines = String(s).split("\\n");
  if (lines.length === 1) { t.textContent = s; svg.appendChild(t); return t; }
  const lh = (o.size || 28) * 1.15;
  lines.forEach((l, i) => { const sp = el("tspan", { x, dy: i === 0 ? -((lines.length - 1) * lh) / 2 : lh }, l); t.appendChild(sp); });
  svg.appendChild(t); return t;
}
function bg(x, y, w, h) { svg.appendChild(el("rect", { x, y, width: w, height: h, fill: "#fff", opacity: 0.92 })); }
function rr(x, y, w, h, o) {
  const opts = { seed: seed++, roughness: 1.1, bowing: 1, stroke: o.stroke || "${P.ink}", strokeWidth: o.width || 2.5, fill: o.fill, fillStyle: o.solid ? "solid" : "hachure", hachureGap: 7, fillWeight: 1.4, hachureAngle: -41 };
  if (o.dashed) opts.strokeLineDash = [12, 10];
  return rc.rectangle(x, y, w, h, opts);
}
function icon(x, y, ic) {
  const g = el("g", { transform: "translate(" + x + "," + y + ") scale(" + ic.size / 24 + ")", fill: "none", stroke: ic.color, "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" });
  g.innerHTML = ic.body; svg.appendChild(g);
}
function arrowHead(x, y, angle, color) {
  const L = 22, a = 0.45;
  const p1 = [x - L * Math.cos(angle - a), y - L * Math.sin(angle - a)], p2 = [x - L * Math.cos(angle + a), y - L * Math.sin(angle + a)];
  svg.appendChild(rc.linearPath([p1, [x, y], p2], { seed: seed++, stroke: color, strokeWidth: 2.5, roughness: 0.8 }));
}
for (const o of ops) {
  if (o.t === "group") {
    svg.appendChild(rr(o.x, o.y, o.w, o.h, { stroke: "${P.grey}", dashed: true, width: 2 }));
    if (o.label) { bg(o.x + 14, o.y - 18, o.label.length * 13 + 20, 36); T(o.x + 24, o.y, o.label, { size: 26, anchor: "start", color: "${P.grey}" }); }
  } else if (o.t === "node" || o.t === "cyl") {
    if (o.t === "cyl") {
      const e = 26;
      svg.appendChild(rc.ellipse(o.x + o.w / 2, o.y + e, o.w, e * 2, { seed: seed++, stroke: o.stroke, strokeWidth: 2.5, fill: o.fill, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.4 }));
      svg.appendChild(rc.rectangle(o.x, o.y + e, o.w, o.h - 2 * e, { seed: seed++, stroke: "transparent", fill: o.fill, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.4 }));
      svg.appendChild(rc.line(o.x, o.y + e, o.x, o.y + o.h - e, { seed: seed++, stroke: o.stroke, strokeWidth: 2.5 }));
      svg.appendChild(rc.line(o.x + o.w, o.y + e, o.x + o.w, o.y + o.h - e, { seed: seed++, stroke: o.stroke, strokeWidth: 2.5 }));
      svg.appendChild(rc.arc(o.x + o.w / 2, o.y + o.h - e, o.w, e * 2, 0, Math.PI, false, { seed: seed++, stroke: o.stroke, strokeWidth: 2.5 }));
    } else svg.appendChild(rr(o.x, o.y, o.w, o.h, o));
    const cx = o.x + o.w / 2;
    const size = o.big ? 40 : o.small ? 27 : 32;
    let ty = o.y + o.h / 2 - (o.sub || o.subLines ? 14 : 0);
    if (o.ico && o.topIcon && o.compact) {
      icon(cx - 26, o.y + 22, { ...o.ico, size: 52 });
      T(cx, o.y + 108, o.label, { size: 30, bold: true });
      if (o.sub) T(cx, o.y + 142, o.sub, { size: 24 });
      continue;
    }
    if (o.ico && o.topIcon) {
      icon(cx - 40, o.y + 40, { ...o.ico, size: 80 });
      T(cx, o.y + 170, o.label, { size: 40, bold: true });
      (o.subLines || []).forEach((l, i) => T(cx, o.y + 240 + i * 46, l, { size: 30 }));
      continue;
    }
    if (o.ico && !o.topIcon) {
      const isz = o.big ? 64 : o.small ? 34 : 44;
      icon(o.x + 18, o.y + (o.subLines ? 22 : o.h / 2 - isz / 2), { ...o.ico, size: isz });
      const tx = o.x + 18 + isz + (o.w - 18 - isz) / 2;
      if (o.subLines) {
        T(tx, o.y + 50, o.label, { size, bold: true });
        o.subLines.forEach((l, i) => T(tx, o.y + 110 + i * 48, l, { size: 28, anchor: "middle" }));
      } else {
        // texte centré dans l'espace restant à droite du picto
        const pad = o.sub ? 16 : 0;
        bgText(tx, o.y + o.h / 2 - pad, o.label, { size, bold: true, mono: o.mono });
        if (o.sub) T(tx, o.y + o.h / 2 + 22, o.sub, { size: o.small ? 22 : 24 });
      }
    } else {
      if (o.subLines) { T(cx, o.y + 50, o.label, { size, bold: true }); o.subLines.forEach((l, i) => T(cx, o.y + 110 + i * 48, l, { size: 28 })); }
      else { T(cx, ty, o.label, { size, bold: true, mono: o.mono }); if (o.sub) T(cx, o.y + o.h / 2 + 22, o.sub, { size: o.small ? 22 : 24 }); }
    }
  } else if (o.t === "ellipse") {
    svg.appendChild(rc.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w, o.h, { seed: seed++, stroke: o.stroke, strokeWidth: 2.5, fill: o.fill, fillStyle: o.solid ? "solid" : "hachure" }));
  } else if (o.t === "line" || o.t === "arrow") {
    const color = o.color || "${P.ink}";
    const opts = { seed: seed++, stroke: color, strokeWidth: o.width || 2.5, roughness: 1 };
    if (o.dashed) opts.strokeLineDash = [12, 10];
    let mx = (o.x1 + o.x2) / 2, my = (o.y1 + o.y2) / 2, angle = Math.atan2(o.y2 - o.y1, o.x2 - o.x1);
    if (o.curve) {
      const c = o.curve; const nx = -(o.y2 - o.y1), ny = (o.x2 - o.x1); const n = Math.hypot(nx, ny);
      const cx = mx + nx / n * c, cy = my + ny / n * c;
      svg.appendChild(rc.curve([[o.x1, o.y1], [cx, cy], [o.x2, o.y2]], opts));
      mx = (mx + cx) / 2; my = (my + cy) / 2; angle = Math.atan2(o.y2 - cy, o.x2 - cx);
    } else svg.appendChild(rc.line(o.x1, o.y1, o.x2, o.y2, opts));
    if (o.t === "arrow") arrowHead(o.x2, o.y2, angle, color);
    if (o.label) { bgText(mx, my - 4, o.label, { size: 24, color }); }
  } else if (o.t === "text") {
    T(o.x, o.y, o.s, o);
  } else if (o.t === "icon") {
    icon(o.x, o.y, o);
  } else if (o.t === "note") {
    // post-it
    svg.appendChild(rc.rectangle(o.x, o.y, o.w, o.h, { seed: seed++, stroke: "${P.yellowS}", strokeWidth: 2, fill: "#fff9db", fillStyle: "solid", roughness: 1.2 }));
    T(o.x + o.w / 2, o.y + o.h / 2, o.s, { size: o.size || 26, color: "#5c4a00" });
  }
}
function bgText(x, y, s, o) {
  const t = T(x, y, s, o);
  const b = t.getBBox();
  const r = el("rect", { x: b.x - 6, y: b.y - 2, width: b.width + 12, height: b.height + 4, fill: "#fff", opacity: 0.9 });
  svg.insertBefore(r, t);
}
document.title = "ok";
</script></body></html>`;
}

(async () => {
  const { chromium } = require(path.join(NM, "playwright"));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 720 }, deviceScaleFactor: 2 });
  for (const d of diagrams) {
    const f = path.join(OUT, `${d.name}.html`);
    fs.writeFileSync(f, html(d));
    await page.setViewportSize({ width: d.w, height: d.h });
    await page.goto("file://" + f);
    await page.waitForFunction(() => document.title === "ok" && document.fonts.status === "loaded");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${d.name}.png`), clip: { x: 0, y: 0, width: d.w, height: d.h } });
    fs.unlinkSync(f);
    console.log("schéma :", d.name);
  }
  await browser.close();
  // Allègement des PNG (2400 px de large, 256 couleurs) : Pillow
  require("child_process").execFileSync("python3", ["-c", `
from PIL import Image; import glob
for f in glob.glob(${JSON.stringify(path.join(OUT, "*.png"))}):
    im = Image.open(f).convert("RGB"); im = im.resize((2400, im.height * 2400 // im.width), Image.LANCZOS)
    im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(f, optimize=True)
`], { stdio: "inherit" });
})();
