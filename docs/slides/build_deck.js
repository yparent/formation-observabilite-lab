// Génère le deck de la formation : node docs/slides/build_deck.js
const pptxgen = require("pptxgenjs");
const path = require("path");

const IMG = path.join(__dirname, "..", "formateur", "img");
const ASSETS = path.join(__dirname, "..", "assets");
const HERE = __dirname;

const C = { navy: "0F2A4A", navy2: "163D6B", orange: "F15A22", ink: "1B1F2A", muted: "5B6270", line: "E3E6EB", panel: "F4F5F7", white: "FFFFFF", light: "DBE6F3", peach: "FFB48F", green: "1B7F3B", red: "B3261E" };
const FONT = "Calibri";
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.author = "Yohan Parent";
pres.title = "Formation Prometheus & Grafana";

let slideNo = 0;
function base(dark = false) {
  const s = pres.addSlide();
  slideNo++;
  s.background = { color: dark ? C.navy : C.white };
  if (!dark) {
    s.addText("Formation Prometheus & Grafana · Yohan Parent", { x: 0.5, y: 5.25, w: 6, h: 0.3, fontFace: FONT, fontSize: 9, color: "9AA3AE", isTextBox: true, margin: 0 });
    s.addText(String(slideNo), { x: 9.0, y: 5.25, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 9, color: "9AA3AE", align: "right", isTextBox: true, margin: 0 });
  }
  return s;
}
function title(s, t, dark = false, sub) {
  s.addText(t, { x: 0.5, y: 0.35, w: 9, h: 0.7, fontFace: FONT, fontSize: 28, bold: true, color: dark ? C.white : C.navy, isTextBox: true, margin: 0, valign: "middle" });
  if (sub) s.addText(sub, { x: 0.5, y: 1.0, w: 9, h: 0.4, fontFace: FONT, fontSize: 14, color: dark ? C.light : C.muted, italic: true, isTextBox: true, margin: 0 });
}
function notes(s, t) { s.addNotes(t); }

// ---- Types de slides ------------------------------------------------------
function section(label, t, sub, note) {
  const s = base(true);
  s.addText(label, { x: 0.7, y: 1.6, w: 8.6, h: 0.4, fontFace: FONT, fontSize: 13, color: C.peach, bold: true, charSpacing: 4, isTextBox: true, margin: 0 });
  s.addText(t, { x: 0.7, y: 2.05, w: 8.6, h: 1.2, fontFace: FONT, fontSize: 40, bold: true, color: C.white, isTextBox: true, margin: 0, valign: "top" });
  if (sub) s.addText(sub, { x: 0.7, y: 3.3, w: 8.6, h: 0.9, fontFace: FONT, fontSize: 18, color: C.light, isTextBox: true, margin: 0 });
  logoDark(s, 8.2, 4.6, 1.3);
  if (note) notes(s, note);
  return s;
}
function logoDark(s, x, y, w) {
  const h = w * 0.4 + 0.16;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: w + 0.2, h, fill: { color: C.white }, line: { color: C.white }, rectRadius: 0.06 });
  s.addImage({ path: path.join(ASSETS, "logo-sparks.png"), x: x + 0.1, y: y + 0.08, w, h: w * 0.4 });
}
function statement(t, sub, note) {
  const s = base(true);
  s.addText(t, { x: 0.8, y: 1.5, w: 8.4, h: 1.8, fontFace: FONT, fontSize: 34, bold: true, color: C.white, isTextBox: true, margin: 0, valign: "middle" });
  if (sub) s.addText(sub, { x: 0.8, y: 3.4, w: 8.4, h: 1.0, fontFace: FONT, fontSize: 18, color: C.peach, isTextBox: true, margin: 0 });
  if (note) notes(s, note);
  return s;
}
function bullets(t, items, opts = {}) {
  const s = base();
  title(s, t, false, opts.sub);
  const y0 = opts.sub ? 1.55 : 1.3;
  const w = opts.image ? 5.3 : 9;
  const arr = items.map((it, i) => ({ text: it, options: { bullet: { code: "25AA" }, breakLine: i < items.length - 1, paraSpaceAfter: 8 } }));
  s.addText(arr, { x: 0.5, y: y0, w, h: 5.1 - y0, fontFace: FONT, fontSize: opts.size || 16, color: C.ink, isTextBox: true, valign: "top", margin: 0 });
  if (opts.image) s.addImage({ path: opts.image, x: 6.1, y: y0 + 0.05, w: 3.4, h: opts.imageH || 2.2, sizing: { type: "contain", w: 3.4, h: opts.imageH || 2.2 } });
  if (opts.note) notes(s, opts.note);
  return s;
}
function cards(t, items, opts = {}) {
  // items: [{h, p}] — 2 à 4 cartes en ligne, ou 2x2 si 4 et opts.grid
  const s = base();
  title(s, t, false, opts.sub);
  const y0 = opts.sub ? 1.6 : 1.35;
  const n = items.length;
  const grid = opts.grid || n > 4;
  const cols = grid ? 2 : n;
  const rows = grid ? Math.ceil(n / 2) : 1;
  const gap = 0.25;
  const cw = (9 - gap * (cols - 1)) / cols;
  const ch = grid ? (5.1 - y0 - gap * (rows - 1)) / rows : Math.min(5.1 - y0, 2.7);
  items.forEach((it, i) => {
    const cx = 0.5 + (i % cols) * (cw + gap);
    const cy = y0 + Math.floor(i / cols) * (ch + gap);
    s.addShape(pres.ShapeType.roundRect, { x: cx, y: cy, w: cw, h: ch, fill: { color: C.panel }, line: { color: C.panel }, rectRadius: 0.08 });
    if (it.n !== undefined) {
      s.addShape(pres.ShapeType.ellipse, { x: cx + 0.2, y: cy + 0.2, w: 0.4, h: 0.4, fill: { color: C.orange }, line: { color: C.orange } });
      s.addText(String(it.n), { x: cx + 0.2, y: cy + 0.2, w: 0.4, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    }
    s.addText(it.h, { x: cx + (it.n !== undefined ? 0.7 : 0.2), y: cy + 0.18, w: cw - (it.n !== undefined ? 0.9 : 0.4), h: 0.45, fontFace: FONT, fontSize: grid ? 15 : 16, bold: true, color: C.navy, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(it.p, { x: cx + 0.2, y: cy + 0.72, w: cw - 0.4, h: ch - 0.85, fontFace: FONT, fontSize: opts.size || (grid ? 12 : 13), color: C.ink, isTextBox: true, margin: 0, valign: "top" });
  });
  if (opts.note) notes(s, opts.note);
  return s;
}
function twoCol(t, left, right, opts = {}) {
  const s = base();
  title(s, t, false, opts.sub);
  const y0 = opts.sub ? 1.6 : 1.35;
  [[left, 0.5, opts.leftColor || C.panel], [right, 5.15, opts.rightColor || C.panel]].forEach(([col, x, color]) => {
    s.addShape(pres.ShapeType.roundRect, { x, y: y0, w: 4.35, h: 5.1 - y0, fill: { color }, line: { color }, rectRadius: 0.08 });
    s.addText(col.h, { x: x + 0.25, y: y0 + 0.15, w: 3.9, h: 0.45, fontFace: FONT, fontSize: 17, bold: true, color: color === C.panel ? C.navy : C.white, isTextBox: true, margin: 0, valign: "middle" });
    const arr = col.items.map((it, i) => ({ text: it, options: { bullet: { code: "25AA" }, breakLine: i < col.items.length - 1, paraSpaceAfter: 6 } }));
    s.addText(arr, { x: x + 0.25, y: y0 + 0.7, w: 3.9, h: 5.1 - y0 - 0.85, fontFace: FONT, fontSize: opts.size || 13, color: color === C.panel ? C.ink : C.white, isTextBox: true, margin: 0, valign: "top" });
  });
  if (opts.note) notes(s, opts.note);
  return s;
}
function table(t, header, rows, opts = {}) {
  const s = base();
  title(s, t, false, opts.sub);
  const y0 = opts.sub ? 1.6 : 1.35;
  const hdr = header.map((h) => ({ text: h, options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: opts.size || 12 } }));
  const body = rows.map((r) => r.map((c) => ({ text: c, options: { fontSize: opts.size || 12, color: C.ink } })));
  s.addTable([hdr, ...body], { x: 0.5, y: y0, w: 9, colW: opts.colW, fontFace: FONT, border: { type: "solid", color: C.line, pt: 0.75 }, rowH: opts.rowH || 0.32, autoPage: false, margin: 0.05 });
  if (opts.note) notes(s, opts.note);
  return s;
}
function code(t, codeText, explain, opts = {}) {
  const s = base();
  title(s, t, false, opts.sub);
  const y0 = opts.sub ? 1.6 : 1.35;
  const cw = explain ? 6.5 : 9;
  s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: y0, w: cw, h: 5.1 - y0, fill: { color: "1E2633" }, line: { color: "1E2633" }, rectRadius: 0.08 });
  s.addText(codeText, { x: 0.7, y: y0 + 0.15, w: cw - 0.4, h: 5.1 - y0 - 0.3, fontFace: "Courier New", fontSize: Math.min(opts.size || 10, 10), color: "E6EDF3", isTextBox: true, margin: 0, valign: "top" });
  if (explain) {
    const arr = explain.map((it, i) => ({ text: it, options: { bullet: { code: "25AA" }, breakLine: i < explain.length - 1, paraSpaceAfter: 6 } }));
    s.addText(arr, { x: 7.2, y: y0, w: 2.3, h: 5.1 - y0, fontFace: FONT, fontSize: 11.5, color: C.ink, isTextBox: true, margin: 0, valign: "top" });
  }
  if (opts.note) notes(s, opts.note);
  return s;
}
function tp(num, t, mission, parts, note) {
  const s = base(true);
  s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 0.45, w: 1.5, h: 0.5, fill: { color: C.orange }, line: { color: C.orange }, rectRadius: 0.1 });
  s.addText(num, { x: 0.5, y: 0.45, w: 1.5, h: 0.5, fontFace: FONT, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  s.addText(t, { x: 2.2, y: 0.4, w: 7.3, h: 0.6, fontFace: FONT, fontSize: 24, bold: true, color: C.white, isTextBox: true, margin: 0, valign: "middle" });
  s.addText("Mission", { x: 0.5, y: 1.2, w: 2, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.peach, charSpacing: 3, isTextBox: true, margin: 0 });
  s.addText(mission, { x: 0.5, y: 1.5, w: 9, h: 0.95, fontFace: FONT, fontSize: 15, color: C.light, isTextBox: true, margin: 0, valign: "top" });
  const n = parts.length, gap = 0.2, cw = (9 - gap * (n - 1)) / n;
  parts.forEach((p, i) => {
    const x = 0.5 + i * (cw + gap);
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.6, w: cw, h: 2.4, fill: { color: C.navy2 }, line: { color: C.navy2 }, rectRadius: 0.08 });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.2, y: 2.8, w: 0.38, h: 0.38, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(String(i + 1), { x: x + 0.2, y: 2.8, w: 0.38, h: 0.38, fontFace: FONT, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(p.h, { x: x + 0.68, y: 2.78, w: cw - 0.85, h: 0.42, fontFace: FONT, fontSize: n >= 5 ? 11.5 : 13.5, bold: true, color: C.white, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(p.p, { x: x + 0.2, y: 3.3, w: cw - 0.4, h: 1.6, fontFace: FONT, fontSize: n >= 5 ? 10.5 : 11.5, color: C.light, isTextBox: true, margin: 0, valign: "top" });
  });
  s.addText("Énoncé complet dans le guide stagiaire · corrigé projeté après recherche", { x: 0.5, y: 5.15, w: 9, h: 0.3, fontFace: FONT, fontSize: 10, color: "8FA3BD", italic: true, isTextBox: true, margin: 0 });
  if (note) notes(s, note);
  return s;
}
function exercises(t, items, note) {
  // liste numérotée compacte d'exercices (n, texte)
  const s = base();
  title(s, t);
  const half = Math.ceil(items.length / 2);
  [items.slice(0, half), items.slice(half)].forEach((col, ci) => {
    col.forEach((it, i) => {
      const step = half > 5 ? 0.6 : 0.72;
      const y = 1.35 + i * step, x = 0.5 + ci * 4.6;
      s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.05, w: 0.42, h: 0.42, fill: { color: C.orange }, line: { color: C.orange } });
      s.addText(it[0], { x, y: y + 0.05, w: 0.42, h: 0.42, fontFace: FONT, fontSize: 9.5, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true, margin: 0 });
      s.addText(it[1], { x: x + 0.55, y, w: 3.85, h: step - 0.05, fontFace: FONT, fontSize: half > 5 ? 11 : 12, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
    });
  });
  if (note) notes(s, note);
  return s;
}
function image(t, img, caption, note, opts = {}) {
  const s = base();
  title(s, t);
  s.addImage({ path: img, x: 0.5, y: 1.25, w: 9, h: 3.6, sizing: { type: "contain", w: 9, h: 3.6 } });
  if (caption) s.addText(caption, { x: 0.5, y: 4.9, w: 9, h: 0.3, fontFace: FONT, fontSize: 11, color: C.muted, italic: true, align: "center", isTextBox: true, margin: 0 });
  if (note) notes(s, note);
  return s;
}
function arrow(s, x1, y1, x2, y2, color = C.muted) {
  s.addShape(pres.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width: 1.75, endArrowType: "triangle" } });
}
function box(s, x, y, w, h, t, fill, color = C.white, size = 12) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
  s.addText(t, { x, y, w, h, fontFace: FONT, fontSize: size, bold: true, color, align: "center", valign: "middle", isTextBox: true, margin: 0.05 });
}

// ===========================================================================
// OUVERTURE
// ===========================================================================
{
  const s = pres.addSlide(); slideNo++;
  s.background = { path: path.join(HERE, "bg-title.jpg") };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0A1A30", transparency: 35 }, line: { color: "0A1A30", transparency: 100 } });
  logoDark(s, 0.6, 0.4, 1.8);
  s.addShape(pres.ShapeType.roundRect, { x: 8.2, y: 0.4, w: 1.3, h: 0.95, fill: { color: C.white }, line: { color: C.white }, rectRadius: 0.06 });
  s.addImage({ path: path.join(ASSETS, "logo-ysycloud.png"), x: 8.32, y: 0.47, w: 1.06, h: 0.8 });
  s.addText("FORMATION · 3 JOURS", { x: 0.6, y: 1.9, w: 8, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: C.peach, charSpacing: 5, isTextBox: true, margin: 0 });
  s.addText("Prometheus & Grafana", { x: 0.6, y: 2.3, w: 8.8, h: 1.0, fontFace: FONT, fontSize: 46, bold: true, color: C.white, isTextBox: true, margin: 0 });
  s.addText("De l'écran noir à la vision rayon X : collecter, comprendre, réagir", { x: 0.6, y: 3.3, w: 8.5, h: 0.5, fontFace: FONT, fontSize: 18, color: C.light, isTextBox: true, margin: 0 });
  s.addText("Yohan Parent · Architecte cloud · Édition septembre 2026", { x: 0.6, y: 4.75, w: 8, h: 0.35, fontFace: FONT, fontSize: 12, color: C.light, isTextBox: true, margin: 0 });
  notes(s, "Slide projetée à l'arrivée des stagiaires. Ma stack tourne déjà depuis 30 minutes, Grafana ouvert sur le dashboard Boutique dans un autre onglet.");
}
{
  const s = base();
  title(s, "Votre formateur");
  s.addImage({ path: path.join(HERE, "yohan.jpg"), x: 0.5, y: 1.35, w: 3.4, h: 3.2, sizing: { type: "cover", w: 3.4, h: 3.2 }, rounding: true });
  s.addText("Yohan Parent", { x: 4.3, y: 1.4, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 24, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  const items = ["Architecte cloud, 15 ans d'infrastructure, DevOps, Kubernetes et IA", "Banque, santé (HDS), industrie, SecNumCloud, OIV", "Enseignant au CESI et à l'Université de Lorraine", "Certifié CKS (Kubernetes Security Specialist)", "Et surtout : beaucoup de nuits devant des écrans noirs"];
  s.addText(items.map((it, i) => ({ text: it, options: { bullet: { code: "25AA" }, breakLine: i < items.length - 1, paraSpaceAfter: 8 } })), { x: 4.3, y: 2.0, w: 5.2, h: 2.5, fontFace: FONT, fontSize: 14, color: C.ink, isTextBox: true, margin: 0, valign: "top" });
  s.addText("linkedin.com/in/yohan-parent", { x: 4.3, y: 4.5, w: 5.2, h: 0.3, fontFace: FONT, fontSize: 12, color: C.orange, isTextBox: true, margin: 0 });
  notes(s, "Deux minutes, pas plus. Ce qui compte : la douleur des pannes m'a amené à l'observabilité, pas l'inverse.");
}
cards("Faisons connaissance", [
  { n: 1, h: "Qui êtes-vous ?", p: "Prénom, poste, équipe. Ce que vous surveillez aujourd'hui, et avec quoi (Zabbix, Centreon, Datadog, rien…)." },
  { n: 2, h: "Votre pire panne", p: "Le moment où vous vous êtes senti le plus seul devant un écran noir. On s'en resservira toute la semaine." },
  { n: 3, h: "Vos attentes", p: "Ce que vous voulez savoir faire mercredi soir et qui vous manque aujourd'hui." },
], { note: "Je note les pannes au paperboard. Trois questions de positionnement : pull vs push, série temporelle, bug infra vs applicatif." });
cards("Ce que je vous promets pour mercredi soir", [
  { h: "Voir", p: "Une stack complète que vous aurez assemblée vous-même : machine, application, services tiers, sondes externes." },
  { h: "Comprendre", p: "PromQL comme un réflexe, des tableaux de bord qui répondent à de vraies questions, versionnés dans Git." },
  { h: "Réagir", p: "Diagnostiquer une panne de la boutique en moins de cinq minutes. Et avoir été prévenu par Teams avant le client." },
], { note: "La promesse est concrète et mesurable : le war game de mercredi 17h la vérifie." });
table("Trois jours, un fil rouge", ["", "Matin", "Après-midi"], [
  ["Jour 1 · Voir", "Observabilité, architecture, installation, configuration, service discovery", "Exporters, Node Exporter (TP 1), instrumentation et services tiers (TP 2)"],
  ["Jour 2 · Comprendre", "PromQL de A à Z, 22 exercices, recording rules et tests (TP 3)", "Grafana 13, dashboard serveur Linux (TP 4), dashboard boutique + as code (TP 5), droits"],
  ["Jour 3 · Réagir", "Alertes, Alertmanager (TP 6), Slack / PagerDuty / Teams / GitHub, alerte CPU → Teams (TP 7)", "Alerting Grafana (TP 8), performances, sauvegarde et remote write (TP 9), échelle, war game"],
], { colW: [1.6, 3.7, 3.7], size: 12, rowH: 0.75, note: "9h-17h30, déjeuner 12h30-14h, deux pauses. Jamais plus de 20 minutes sans clavier." });
{
  const s = base();
  title(s, "Le lab : une boutique en ligne qu'on va casser", false, "Tout en conteneurs · Codespaces, macOS, Windows · rien à installer à part Docker");
  box(s, 0.5, 1.75, 1.7, 0.7, "traffic\n(clients simulés)", C.muted, C.white, 11);
  box(s, 2.7, 1.55, 1.9, 0.5, "shop-api-1", C.navy2);
  box(s, 2.7, 2.15, 1.9, 0.5, "shop-api-2", C.navy2);
  box(s, 2.7, 2.9, 1.9, 0.5, "Redis + exporter", "4A6FA5");
  box(s, 2.7, 3.5, 1.9, 0.5, "Node Exporter", "4A6FA5");
  box(s, 2.7, 4.1, 1.9, 0.5, "Blackbox · Pushgateway", "4A6FA5", C.white, 10);
  box(s, 5.3, 2.3, 1.9, 1.0, "Prometheus", C.orange, C.white, 15);
  box(s, 7.7, 1.6, 1.8, 0.8, "Grafana", C.navy, C.white, 14);
  box(s, 7.7, 2.9, 1.8, 0.8, "Alertmanager", C.navy, C.white, 13);
  box(s, 7.7, 4.1, 1.8, 0.6, "Inbox (Teams / Slack)", "6264A7", C.white, 10);
  arrow(s, 2.2, 2.1, 2.7, 2.0); arrow(s, 5.3, 2.8, 4.6, 1.85); arrow(s, 5.3, 2.85, 4.6, 2.4); arrow(s, 5.3, 2.9, 4.6, 3.15); arrow(s, 5.3, 2.95, 4.6, 3.75); arrow(s, 5.3, 3.0, 4.6, 4.35);
  arrow(s, 7.7, 2.0, 7.2, 2.6); arrow(s, 7.2, 3.0, 7.7, 3.2); arrow(s, 8.6, 3.7, 8.6, 4.1);
  s.addText("lab.sh up · status · check · reload · test · chaos · traffic · batch · longterm · snapshot", { x: 0.5, y: 4.85, w: 9, h: 0.3, fontFace: "Courier New", fontSize: 11, color: C.navy, isTextBox: true, margin: 0 });
  notes(s, "Je montre le dashboard Boutique tout vert, puis ./lab.sh chaos errors on. À la pause, il sera rouge : voilà ce qu'on saura construire mercredi.");
}

// ===========================================================================
// JOUR 1
// ===========================================================================
section("JOUR 1", "Voir", "Architecture et collecte : à 17h30, votre Prometheus collecte la machine, l'application et les services tiers.");

// Module 1
section("MODULE 1", "Pourquoi l'observabilité", "Monitoring, observabilité, les trois signaux, pull contre push.");
twoCol("Les deux pilotes", { h: "Pilote A — monitoring", items: ["Un voyant rouge « MOTEUR » s'allume", "Il sait que c'est grave", "Il ne sait pas pourquoi", "Il panique"] },
  { h: "Pilote B — observabilité", items: ["Un écran : pression d'huile −40 %, vibration axe Z", "Il coupe le moteur concerné", "Il compense, il se pose", "Notre métier : fabriquer l'écran"] },
  { leftColor: C.panel, rightColor: C.navy, note: "Définition utilisable : un système est observable quand « pourquoi c'est lent ? » a une réponse en moins de cinq minutes." });
cards("Les trois signaux", [
  { h: "Métriques", p: "Des nombres horodatés. Quelques octets par point, agrégeables, parfaites pour les tendances et les alertes. Notre sujet pendant trois jours." },
  { h: "Logs", p: "Des événements textuels. Riches, mais chers à stocker et à chercher. Loki côté Grafana." },
  { h: "Traces", p: "Le parcours d'une requête à travers les services. Indispensables en microservices. Tempo, OpenTelemetry." },
], { note: "Pourquoi les métriques d'abord : une métrique coûte quelques octets, un log des centaines. Et c'est sur les métriques qu'on alerte." });
statement("Black Friday. Tous les voyants infra au vert.\nChiffre d'affaires de la journée : zéro.", "Un bug JavaScript sur le bouton « Payer ». Personne n'avait de métrique « commandes par minute ».", "Anecdote fondatrice : surveiller la machine ne suffit jamais. C'est pour ça que la boutique expose shop_orders_total et shop_revenue_euros_total.");
twoCol("Pull contre push", { h: "Push — l'ancien monde", items: ["Un agent envoie ses données au serveur", "Le livreur de pizza : mille serveurs en panne = mille livreurs qui sonnent en même temps", "Le monitoring tombe quand on en a besoin"] },
  { h: "Pull — Prometheus", items: ["Prometheus va chercher (scrape) les métriques en HTTP, à intervalle fixe", "Le buffet à volonté : il se sert à son rythme", "Une cible qui ne répond pas, c'est une information : up == 0", "Débogage au curl"] },
  { rightColor: C.navy, note: "Le push garde un cas d'usage : les jobs éphémères, via la Pushgateway (TP 2)." });
cards("Un peu d'histoire, vite", [
  { h: "2012 — SoundCloud", p: "Inspiré de Borgmon (Google). Open source en 2015." },
  { h: "2016 — CNCF", p: "Deuxième projet accueilli après Kubernetes. Gradué en 2018. Le standard de fait." },
  { h: "2024 — Prometheus 3", p: "UTF-8, OTLP natif, remote write 2.0, nouvelle interface. On travaille sur la 3.15 (sept. 2026)." },
  { h: "Grafana", p: "Né en 2014, fork de Kibana 3. N'importe quelle source, ne stocke rien. Version 13 depuis avril 2026, on utilise la 13.2." },
], { grid: true });

// Module 2
section("MODULE 2", "Architecture de Prometheus", "Les composants, le modèle de données, les quatre types de métriques.");
{
  const s = base();
  title(s, "Les composants", false, "Un journaliste qui fait sa tournée toutes les 15 secondes, un rédacteur en chef, une maquette");
  box(s, 0.5, 2.2, 1.7, 0.9, "Cibles\n/metrics", "4A6FA5", C.white, 12);
  box(s, 0.5, 3.4, 1.7, 0.7, "Service\ndiscovery", C.muted, C.white, 11);
  box(s, 3.2, 1.9, 2.6, 1.6, "Prometheus\nscrape · TSDB · règles", C.orange, C.white, 14);
  box(s, 6.9, 1.7, 2.4, 0.8, "Grafana", C.navy, C.white, 14);
  box(s, 6.9, 3.0, 2.4, 0.8, "Alertmanager", C.navy, C.white, 14);
  box(s, 6.9, 4.1, 2.4, 0.6, "Slack · Teams · PagerDuty", C.muted, C.white, 11);
  arrow(s, 3.2, 2.65, 2.2, 2.65); arrow(s, 2.2, 3.75, 3.2, 3.2); arrow(s, 6.9, 2.1, 5.8, 2.4); arrow(s, 5.8, 3.1, 6.9, 3.4); arrow(s, 8.1, 3.8, 8.1, 4.1);
  s.addText("PromQL", { x: 5.9, y: 1.85, w: 0.9, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });
  s.addText("alertes", { x: 5.9, y: 3.25, w: 0.9, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });
  s.addText("pull HTTP\ntoutes les 15 s", { x: 2.25, y: 2.05, w: 0.95, h: 0.5, fontFace: FONT, fontSize: 9, color: C.muted, isTextBox: true, margin: 0 });
  notes(s, "Je dessine au tableau dans cet ordre : cibles, serveur (scraper, stocker, évaluer), Alertmanager, Grafana, découverte de services.");
}
code("Le modèle de données", `http_requests_total{method="GET", route="/api/products", status="200"} 51

  métrique : http_requests_total
  labels   : method, route, status   (les dimensions)
  valeur   : 51                      (+ un timestamp en ms)

Une série = un nom + un jeu de labels.
Un échantillon = une valeur + un timestamp (ms).

Labels réservés : job, instance
Internes : tout ce qui commence par __`, ["Chaque combinaison de valeurs de labels crée une série distincte", "Puissant : on découpe par n'importe quelle dimension", "Dangereux : la cardinalité (module 6)"], { note: "Le concept le plus important de la journée. Je le fais reformuler par un stagiaire." });
table("Les quatre types", ["Type", "Il fait quoi", "Exemples", "Ce qu'on en fait"], [
  ["Counter", "Ne fait que monter", "requêtes, erreurs, commandes", "rate(), increase() — jamais brut"],
  ["Gauge", "Monte et descend", "mémoire, stock, connexions", "valeur brute, *_over_time"],
  ["Histogram", "Compte par tranches (buckets)", "latences, tailles", "histogram_quantile() → p95"],
  ["Summary", "Quantiles côté client", "latences (ancienne école)", "lecture directe, non agrégeable"],
], { colW: [1.4, 2.2, 2.4, 3.0], size: 13, rowH: 0.5, note: "La voiture : 150 000 km au compteur, est-ce que je roule vite ? rate() transforme les km en km/h. Histogram > Summary en 2026 ; native histograms à l'horizon." });
code("Le format d'exposition : du texte, lisible", `# HELP http_requests_total Nombre total de requêtes HTTP reçues
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/products",status="200"} 51.0
http_requests_total{method="POST",route="/api/checkout",status="201"} 17.0

# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{route="/api/checkout",le="0.1"} 12
http_request_duration_seconds_bucket{route="/api/checkout",le="0.25"} 17
http_request_duration_seconds_bucket{route="/api/checkout",le="+Inf"} 17
http_request_duration_seconds_sum{route="/api/checkout"} 1.83
http_request_duration_seconds_count{route="/api/checkout"} 17`, ["HELP, TYPE, puis une ligne par série", "N'importe quel langage peut produire ça avec un printf", "Les buckets sont cumulatifs : le=\"0.25\" compte tout ce qui est sous 250 ms"], { size: 10, note: "Je montre localhost:5001/metrics en vrai, puis Status → Target health." });
cards("La TSDB en deux mots", [
  { h: "Head (mémoire)", p: "Les échantillons arrivent dans un bloc en mémoire, journalisés dans le WAL pour survivre à un crash." },
  { h: "Blocs (disque)", p: "Toutes les deux heures, un bloc immuable. Compression : 1 à 2 octets par échantillon. Rétention par défaut 15 jours." },
  { h: "Grafana", p: "Ne voit jamais les cibles. Il interroge Prometheus en PromQL. « No data » ? On teste la requête dans Prometheus d'abord." },
], { note: "Détail de la TSDB au jour 3." });

// Module 3
section("MODULE 3", "Installation et prise en main", "Comment on installe pour de vrai, et l'environnement du lab.");
table("Cinq façons d'installer Prometheus", ["Méthode", "Quand", "Note"], [
  ["Kubernetes + opérateur", "Le cas majoritaire en production", "kube-prometheus-stack, ServiceMonitor, PrometheusRule"],
  ["Conteneur Docker", "Labs, petits sites, notre cas", "prom/prometheus:v3.15.0 + un YAML monté"],
  ["Binaire", "Pour comprendre", "Un exécutable Go, un YAML, un dossier data/"],
  ["Paquet distribution", "À éviter", "Souvent plusieurs versions de retard"],
  ["Managé", "Quand on ne veut pas opérer", "Grafana Cloud, AMP, GMP, Mimir/Thanos/VictoriaMetrics"],
], { colW: [2.3, 2.8, 3.9], size: 12.5, rowH: 0.5, note: "Même chose pour Grafana : Helm, Docker, dépôts Grafana Labs (à jour), Cloud." });
twoCol("Les fichiers et dossiers qui comptent", { h: "Prometheus", items: ["prometheus.yml : la configuration", "--storage.tsdb.path (data/) : la base", "--storage.tsdb.retention.time (15d)", "--web.enable-lifecycle : reload par HTTP", "Port 9090, pas d'authentification"] },
  { h: "Grafana", items: ["grafana.ini ou variables GF_SECTION_CLE", "/var/lib/grafana : grafana.db (SQLite), plugins", "/etc/grafana/provisioning : datasources, dashboards, alerting en YAML", "Port 3000, compte admin"] },
  { note: "J'ouvre docker-compose.yml et je commente les flags de Prometheus : lifecycle, admin-api, remote-write-receiver, external-url." });
exercises("Exercices 1.1 à 1.4 — prise en main (40 min)", [
  ["1.1", "Démarrer la stack, vérifier les conteneurs, compter les cibles UP"],
  ["1.2", "Lire /metrics : un exemple de chaque type, les buckets, la version"],
  ["1.3", "L'interface : configuration, version, TSDB status, première requête"],
  ["1.4", "Filtrer : par instance, par code d'erreur (regex), par méthode et route"],
], "Je passe dans les rangs. Erreurs classiques : port pris, Docker pas lancé, politique d'exécution PowerShell.");

// Module 4
section("MODULE 4", "Configuration de Prometheus", "Lire et modifier prometheus.yml en sécurité.");
code("Anatomie de prometheus.yml", `global:
  scrape_interval: 15s      # le pouls
  evaluation_interval: 15s  # rythme des règles
  external_labels:
    cluster: formation

rule_files:
  - rules/*.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  - job_name: shop-api
    static_configs:
      - targets: ["shop-api-1:5000", "shop-api-2:5000"]
        labels:
          env: formation`, ["Quatre blocs", "Un job = des cibles de même nature", "job et instance ajoutés automatiquement", "Fenêtre de rate() ≥ 4 × scrape_interval"], { size: 10.5, note: "Trop vite = surcharge, trop lent = pics ratés. 15 s est le standard." });
cards("Valider, recharger, découvrir", [
  { h: "Valider avant", p: "promtool check config prometheus.yml. Le nginx -t de Prometheus. Dans le lab : ./lab.sh check." },
  { h: "Recharger à chaud", p: "curl -X POST /-/reload. Fichier invalide ? L'ancienne config reste, prometheus_config_last_reload_successful passe à 0." },
  { h: "Service discovery", p: "Kubernetes, Consul, DNS, EC2/Azure/GCE, Docker… et file_sd : un fichier que n'importe quel script écrit, relu sans reload." },
  { h: "Relabeling", p: "Le videur à l'entrée : relabel_configs avant le scrape (cibles), metric_relabel_configs après (séries). On jette avant que ça coûte." },
], { grid: true, note: "Démo : je casse l'indentation, ./lab.sh check refuse, je répare, ./lab.sh reload, Status → Configuration." });
exercises("Exercices 1.5 à 1.8 — configuration (40 min)", [
  ["1.5", "Passer shop-api à 5 s de scrape, vérifier, puis remettre 15 s"],
  ["1.6", "Casser la config, recharger sans valider, observer la métrique"],
  ["1.7", "Ajouter l'Inbox par file_sd sans toucher à la liste des jobs"],
  ["1.8", "Bonus : jeter les métriques Go de l'exporter Redis (drop)"],
], "Chemins relatifs au dossier prometheus/ (monté dans /etc/prometheus). Erreur classique : chemin absolu de la machine.");

// Module 5
section("MODULE 5", "Les exporters", "L'adaptateur de prise universel.");
table("Les incontournables", ["Exporter", "Pour quoi", "Port"], [
  ["node_exporter / windows_exporter", "Linux, Windows : CPU, mémoire, disque, réseau", "9100 / 9182"],
  ["blackbox_exporter", "Sondes externes : HTTP, TCP, ICMP, DNS, TLS", "9115"],
  ["cAdvisor, kube-state-metrics", "Conteneurs, objets Kubernetes", "8080"],
  ["postgres, mysqld, redis, mongodb", "Bases de données", "9187, 9104, 9121, 9216"],
  ["snmp_exporter", "Équipements réseau", "9116"],
  ["pushgateway", "Pas un exporter : un relais pour les batchs", "9091"],
], { colW: [3.2, 4.2, 1.6], size: 12.5, rowH: 0.42, note: "Le catalogue officiel en liste des centaines. Avant d'en écrire un, on vérifie. De plus en plus de logiciels exposent nativement." });
twoCol("Node Exporter et le piège Docker", { h: "Node Exporter", items: ["Une soixantaine de collectors, une trentaine actifs", "--collector.x / --no-collector.x", "textfile : des fichiers .prom déposés par n'importe quel script", "La Pushgateway du pauvre, souvent préférable"] },
  { h: "Le piège Docker", items: ["Dans un conteneur nu, il voit le conteneur : 1 CPU, quelques Mo, un overlay", "Monter /proc, /sys, / en lecture seule + --path.*", "Sur Docker Desktop, « l'hôte » est la VM Linux", "En prod Linux : binaire ou paquet sur l'hôte"] },
  { rightColor: C.navy, note: "Je montre localhost:9100/metrics : node_cpu_seconds_total, node_memory_MemAvailable_bytes, node_filesystem_avail_bytes." });
twoCol("Blackbox et Pushgateway", { h: "Blackbox Exporter", items: ["Tous les autres disent « je vais bien » de l'intérieur", "Lui teste de l'extérieur, comme un client : 200 ? certificat ? port ouvert ?", "Prometheus l'appelle sur /probe?module=…&target=…", "Le relabeling devient indispensable (TP 2)"] },
  { h: "Pushgateway", items: ["Pour les jobs trop courts pour être scrapés", "Le batch pousse, la gateway garde, Prometheus scrape", "Pas de TTL : elle n'oublie jamais", "Uniquement pour des batchs, jamais pour des services"] },
  { note: "Démo : localhost:9115/probe?module=http_2xx&target=http://shop-api-1:5000/health → probe_success 1." });
tp("TP 1", "Node Exporter : de la machine à Prometheus", "Vous venez de recevoir un serveur. Avant d'y déployer quoi que ce soit, vous voulez ses signes vitaux dans Prometheus, et pouvoir y ajouter vos propres indicateurs avec un simple script.", [
  { h: "Brancher", p: "Le job node dans prometheus.yml. Valider, recharger, node_uname_info." },
  { h: "Indicateurs", p: "Uptime, mémoire %, disque %, charge, CPU % (la formule à comprendre). Chaos CPU." },
  { h: "Collectors", p: "Activer processes, désactiver arp, dans docker-compose.yml." },
  { h: "Textfile", p: "backup.prom déposé par un script : quand a tourné la dernière sauvegarde ?" },
  { h: "Vue globale", p: "topk, réseau, Explore dans Grafana. Bonus : dashboard 1860." },
], "60 minutes. La formule CPU est la requête la plus recopiée de l'histoire de Prometheus : j'y passe cinq minutes. Anecdote des sauvegardes fantômes.");

// Module 6
section("MODULE 6", "Instrumenter son application", "Whitebox : mettre les sondes à l'intérieur.");
code("Une bibliothèque cliente, quatre objets", `from prometheus_client import Counter, Gauge, Histogram

HTTP_REQUESTS = Counter("http_requests_total", "Requêtes HTTP",
                        ["method", "route", "status"])
HTTP_DURATION = Histogram("http_request_duration_seconds", "Durée",
                          ["route"], buckets=(0.005, 0.01, 0.025, 0.05,
                          0.1, 0.25, 0.5, 1, 2.5, 5, 10))
ORDERS = Counter("shop_orders_total", "Commandes", ["payment_method"])
STOCK  = Gauge("shop_stock_units", "Stock", ["product"])

HTTP_REQUESTS.labels("POST", "/api/checkout", "201").inc()
HTTP_DURATION.labels(route="/api/checkout").observe(0.083)
ORDERS.labels(payment_method="card").inc()
STOCK.labels(product="clavier").set(84)`, ["Go, Java/Micrometer, Python, Ruby, Rust officiels ; .NET, Node.js, PHP par la communauté", "Tout en mémoire dans le processus : d'où le compteur remis à zéro au redémarrage", "La bibliothèque expose /metrics toute seule"], { size: 10, note: "J'ouvre apps/shop-api/app.py : les déclarations, le middleware after_request, la route checkout, le TODO du TP 2." });
cards("Nommer, découper, ne pas se tuer", [
  { h: "Nommage", p: "snake_case, préfixe du domaine (http_, shop_), unité de base en suffixe (_seconds, _bytes), _total pour les counters. Grafana convertit." },
  { h: "RED et USE", p: "Service : Rate, Errors, Duration. Ressource : Utilisation, Saturation, Errors. Les golden signals de Google SRE." },
  { h: "Labels autorisés", p: "method (5 valeurs), status (10), route en pattern (50). Bornés, stables." },
  { h: "Labels interdits", p: "user_id, session_id, request_id, IP, email, URL réelle, terme de recherche. Un million d'utilisateurs = un million de séries." },
], { grid: true, note: "Anecdote du label customer_id : 15 millions de séries, 60 Go de RAM, redémarrages toutes les heures. Les données à forte cardinalité vont dans les logs et les traces." });
tp("TP 2", "Instrumentation et services tiers", "Le directeur commercial veut savoir quelles fiches produit sont les plus consultées. L'infra veut surveiller Redis. Le support veut être prévenu si le site est inaccessible de l'extérieur. Et il y a ce batch nocturne…", [
  { h: "Métier", p: "shop_product_views_total dans le code, rebuild, topk." },
  { h: "Redis", p: "Le job redis, redis_up, commandes par seconde." },
  { h: "Blackbox", p: "Quatre sondes HTTP et les trois règles de relabeling. up ne veut plus dire ce qu'on croit." },
  { h: "Batch", p: "./lab.sh batch, honor_labels: true, ancienneté de la sauvegarde." },
  { h: "Bonus", p: "Cardinalité : les dix métriques les plus lourdes, et 200 routes × 50 instances ?" },
], "60 minutes. À la fin, prometheus.yml compte sept jobs. Le relabeling blackbox se décortique au tableau, règle par règle.");
bullets("Récap du jour 1", ["Pull : résilience, up == 0, débogage au curl", "Un Counter ne se lit jamais brut : rate(), increase()", "Une série = nom + labels ; la cardinalité est le seul vrai danger", "promtool check config avant chaque reload", "Exporter = adaptateur ; blackbox : c'est probe_success qui compte, pas up", "honor_labels: true pour la Pushgateway", "Ce soir : sept jobs UP, pas de ./lab.sh reset"], { note: "Quiz à l'oral, réponses au tableau. Je projette le corrigé de prometheus.yml et chacun compare avec le sien." });

// ===========================================================================
// JOUR 2
// ===========================================================================
section("JOUR 2", "Comprendre", "PromQL comme un réflexe le matin ; deux tableaux de bord complets, versionnés, l'après-midi.");
section("MODULE 7", "PromQL, les fondations", "Sélecteurs, types de résultats, opérateurs, agrégations.");
cards("Quatre types de résultats", [
  { h: "Instant vector", p: "Une valeur par série, à un instant. up, http_requests_total{job=\"shop-api\"}. C'est ce que Grafana dessine." },
  { h: "Range vector", p: "Pour chaque série, toutes les valeurs sur une fenêtre : http_requests_total[5m]. Ne se dessine pas, nourrit rate()." },
  { h: "Scalar", p: "Un nombre. 42, time(), scalar(…)." },
  { h: "String", p: "Rarissime. On l'oublie." },
], { grid: true, note: "PromQL n'est pas SQL : pas de SELECT. On nomme, on filtre, on applique. Ça se lit de l'intérieur vers l'extérieur." });
code("Sélecteurs et décalages", `up{job="shop-api"}                     # égal
http_requests_total{route!="/metrics"}   # différent
http_requests_total{status=~"5.."}      # regex, ancrée : ^5..$
node_network_receive_bytes_total{device!~"lo|veth.*"}  # regex négative

{__name__=~"shop_.*"}                   # le nom est un label

shop_cart_items offset 1h               # il y a une heure
rate(x[5m]) and rate(x[5m] offset 1d)   # aujourd'hui vs hier
http_requests_total @ end()             # figé sur la fin de la plage`, ["Quatre matchers : = != =~ !~", "Regex ancrées : 5.. matche exactement trois caractères", "offset et @ pour voyager dans le temps"], { size: 11 });
code("Opérateurs et agrégations", `node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes
  # appariement sur labels identiques {instance, job}

shop_stock_units < 20          # filtre : ne renvoie que les séries sous 20
shop_stock_units < bool 20     # 0 ou 1 pour toutes les séries

sum by (route) (rate(http_requests_total[5m]))    # une série par route
sum without (instance) (…)                        # jette instance, garde le reste
sum(rate(http_requests_total[5m]))                # un seul nombre

topk(3, shop_stock_units)   count(up)   avg   min   max   quantile(0.9, …)`, ["Une comparaison filtre : c'est la base des alertes (au moins une série renvoyée)", "by : garder ces labels · without : jeter ceux-là", "Le tableau croisé dynamique de PromQL"], { size: 11, note: "Démo dans l'onglet Query, Table puis Graph, et l'onglet Explain de Prometheus 3." });
exercises("Série A — sélection et agrégation (40 min)", [
  ["2.1", "Toutes les cibles, puis celles du job shop-api"], ["2.2", "Les erreurs 4xx/5xx sans /metrics"], ["2.3", "Un range vector : combien de points, pourquoi pas de graphe"], ["2.4", "Mémoire disponible en %"], ["2.5", "Les paniers il y a 10 min, et l'écart"],
  ["2.6", "Total de requêtes par instance : est-ce un débit ?"], ["2.7", "without : garder tout sauf method, status, route"], ["2.8", "topk / bottomk sur le stock (deux instances !)"], ["2.9", "Stock < 60, puis en bool"], ["2.10", "Routes distinctes : deux agrégations imbriquées"],
], "Seuls, dans Prometheus. Je projette le corrigé de deux exercices toutes les cinq minutes. Les rapides : codes HTTP distincts par route.");

section("MODULE 8", "PromQL avancé", "rate et ses cousins, histogrammes, jointures, recording rules, requêtes lentes.");
cards("rate, irate, increase", [
  { h: "rate(x[5m])", p: "Pente moyenne par seconde sur 5 min. Lisse, robuste. LA fonction pour les graphiques et les alertes." },
  { h: "irate(x[5m])", p: "Pente entre les deux derniers points. Réactif, nerveux. Graphiques haute résolution seulement, jamais une alerte." },
  { h: "increase(x[1h])", p: "De combien le compteur a augmenté. rate × durée. Peut donner 5,53 commandes : round() si besoin." },
], { note: "Toutes gèrent les remises à zéro. Fenêtre ≥ 4 × scrape_interval, [5m] en pratique, $__rate_interval dans Grafana. Démo rate vs irate avec ./lab.sh traffic 30." });
code("Le taux d'erreur et le p95", `# Le ratio le plus écrit au monde
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))

# Piège : pas de 5xx jamais vue = numérateur VIDE, pas zéro
sum(rate(http_requests_total{status=~"5.."}[5m])) or vector(0)

# Le p95 : rate sur chaque bucket, sum EN GARDANT le
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# Latence moyenne : vraie, jamais utile pour un SLO
rate(x_sum[5m]) / rate(x_count[5m])`, ["Sans by (le), la fonction ne peut plus rien faire", "Le p95 est borné par la précision des buckets", "Native histograms : un échantillon par série, buckets exponentiels, encore en feature flag"], { size: 10.5 });
code("Dans le temps, entre séries", `max_over_time(shop_cart_items[1h])              # pic d'une gauge
predict_linear(node_filesystem_avail_bytes[6h], 86400) < 0  # plein demain ?
changes(shop_chaos_mode[10m])   deriv(…)   avg_over_time(…)

max_over_time(rate(x[1m])[1h:1m])             # sous-requête : pic de débit

# Jointure avec une info metric : récupérer version
shop_stock_units * on (instance) group_left(version) shop_app_info

label_replace(up, "pod", "$1", "instance", "(.*):5000")
absent(up{job="paiement"})                    # 1 si la série n'existe pas`, ["_over_time : les gauges dans le temps", "Sous-requêtes : puissant, coûteux", "on / ignoring / group_left : quand les labels diffèrent", "absent() : la seule façon d'alerter sur une disparition"], { size: 10.5 });
twoCol("Recording rules et requêtes lentes", { h: "Recording rules", items: ["Une requête coûteuse ou réutilisée partout se pré-calcule toutes les 15 s", "Convention niveau:metrique:operations", "job:http_requests:rate5m", "Dashboards instantanés, alertes simples, agrégé prêt pour le long terme"] },
  { h: "Ce qui rend une requête lente", items: ["Séries touchées × points par série", "Filtrer par job avant d'agréger, éviter les regex larges", "Fenêtres courtes, sous-requêtes avec parcimonie", "prometheus_engine_query_duration_seconds, ?stats=all, Query inspector"] }, { note: "Démo : histogram_quantile avec et sans by (le) ; la jointure en Table pour voir arriver le label version." });
exercises("Série B — taux, quantiles, jointures (40 min)", [
  ["2.11", "Débit par route"], ["2.12", "Commandes sur 1 h, par moyen de paiement"], ["2.13", "Chiffre d'affaires par heure"], ["2.14", "Taux d'erreur % + chaos errors"], ["2.15", "p50 / p95 / p99, puis checkout seul"], ["2.16", "Latence moyenne vs p95"],
  ["2.17", "CPU % par instance, puis par mode"], ["2.18", "Réseau entrant en bits/s"], ["2.19", "Pics sur 1 h (sous-requête)"], ["2.20", "Ajouter le label version (group_left)"], ["2.21", "Le job paiement existe-t-il ? absent()"], ["2.22", "predict_linear : CA dans 1 h, disque plein quand ?"],
], "L'erreur numéro un : oublier by (le) en 2.15. Vérifier que le chaos est remis à off.");
tp("TP 3", "Recording rules et tests unitaires", "Les panneaux débit, erreurs, p95 et CA par heure vont tourner sur un écran mural 24 h/24. On ne veut pas que Prometheus recalcule les histogrammes en permanence.", [
  { h: "Écrire", p: "Sept règles dans recording.yml : débit, erreurs, p95, CA, CPU, mémoire. Ratios 0-1, pas de %." },
  { h: "Tester", p: "promtool test rules : une série 0+10x40, que vaut job:http_requests:rate5m à 5 min ?" },
  { h: "Mesurer", p: "Bonus : Query inspector, brute contre recording rule." },
], "20 minutes, déborde souvent sur 14h. Une règle non testée sonnera un dimanche pour rien.");

section("MODULE 9", "Grafana", "Sous le capot, les quatre concepts, ce qui rend un dashboard lisible.");
cards("Grafana, sous le capot", [
  { h: "Un serveur Go", p: "Une base SQLite (grafana.db) ou PostgreSQL. Il ne stocke que sa configuration : utilisateurs, sources, dashboards en JSON, règles. Pas une seule métrique." },
  { h: "Data source", p: "Une connexion. La nôtre est provisionnée par YAML : personne ne l'a cliquée." },
  { h: "Panel", p: "Une requête + une visualisation + des options. Un panel répond à une question." },
  { h: "Dashboard, folder", p: "Des panels, des variables, des annotations, des liens. Un dashboard répond à un besoin. Le dossier range et donne les droits." },
], { grid: true, note: "Explore avant de construire : on ne fait jamais un panel à l'aveugle." });
image("Grafana 13 : dynamic dashboards", path.join(IMG, "grafana-nouveau-dashboard.png"), "Barre latérale Add : Panel, Add row, Add tab, Variable, Annotation query, Link · Custom grid ou Auto grid", "Ce qui a changé en 13 : nouvelle édition, rows et tabs, éditeur de variables refait, restauration de dashboards supprimés, Git Sync en OSS, plugin image renderer retiré.");
image("L'éditeur de panel", path.join(IMG, "grafana-editeur-panel.png"), "Queries / Transformations en bas · Suggestions / All visualizations puis les options à droite", "Visite guidée en cinq minutes : Connections, Explore, New dashboard, un panel, Save, Exit edit, le cadenas du dashboard provisionné.");
table("Choisir la visualisation", ["La question", "La visualisation"], [
  ["Ça évolue comment ?", "Time series"], ["Ça vaut combien, là, maintenant ?", "Stat (avec sparkline)"], ["À quel niveau sur une échelle bornée ?", "Gauge"], ["Comparer quelques valeurs", "Bar gauge"], ["Une liste à plusieurs colonnes", "Table"], ["Une répartition (5 parts max)", "Pie chart"], ["Un état dans le temps", "State timeline, Status history"], ["Une distribution qui évolue", "Heatmap"],
], { colW: [5, 4], size: 13, rowH: 0.4 });
cards("Ce qui rend un dashboard lisible", [
  { n: 1, h: "Les unités", p: "Jamais un 38491023 brut. bytes → 36,7 MiB, percentunit, reqps, currencyEUR." },
  { n: 2, h: "Seuils et couleurs", p: "Vert / orange / rouge cohérents sur tout le dashboard. Visibles sur Stat, Gauge, Table, Time series." },
  { n: 3, h: "Value mappings", p: "1 → UP en vert, 0 → DOWN en rouge. Lisible par quelqu'un qui ne connaît pas Prometheus." },
  { n: 4, h: "Légende et ordre", p: "{{route}} plutôt qu'un bloc de labels. En haut : « ça va ? ». En bas : le détail. 10-12 panels maximum." },
], { grid: true });
twoCol("Variables, transformations, annotations", { h: "Variables", items: ["Un menu déroulant qui filtre tous les panels", "Query : label_values(node_uname_info, instance)", "Multi-valeur + All → =~ et non =", "Chaînées : $route dépend de $instance", "$__rate_interval, $__range, $__interval"] },
  { h: "Transformations et annotations", items: ["Merge, Organize fields, Sort by, Reduce, Filter, calculs", "Indispensables pour les tables", "Annotation : un trait vertical sur tous les graphiques", "changes(shop_chaos_mode[1m]) > 0, ou POST /api/annotations depuis la CI"] });
tp("TP 4", "Un dashboard paramétrable pour un serveur Linux", "L'équipe d'exploitation veut un écran par serveur : d'un coup d'œil, savoir s'il va bien ; en dessous, le détail. Le même dashboard pour tous les serveurs, avec une liste déroulante.", [
  { h: "Variable", p: "$instance multi-valeur avec All, utilisée dans toutes les requêtes." },
  { h: "Global", p: "Uptime, CPU et mémoire en Gauge avec seuils, charge, cœurs." },
  { h: "CPU, mémoire", p: "Time series empilé par mode (scalar !), mémoire avec override." },
  { h: "Disque, réseau", p: "Bar gauge, Table avec Join by field + Organize + Sort, réseau rx/tx." },
  { h: "Dispo", p: "State timeline avec value mappings, Stat coloré avec or vector(0)." },
], "60 minutes. Le piège de l'étape 2 : diviser par count() sans scalar(). Le dashboard doit finir dans le dossier Formation (le TP 5 y fait un lien).");
image("TP 4 — le résultat attendu", path.join(IMG, "tp4-serveur-linux.png"), "Dix panels, huit types de visualisation, une variable, des rows", "Je projette ce résultat au début du TP et je le laisse visible.");
tp("TP 5", "La boutique, puis dashboards as code", "Le directeur commercial veut le CA, les commandes, les paniers, les stocks. La technique veut débit, erreurs et latence filtrables par instance et par route. Tout le monde veut voir quand on a cassé quelque chose.", [
  { h: "Métier", p: "CA/h en Stat, commandes, paniers, pie chart des paiements, stock en bar gauge LCD." },
  { h: "RED", p: "Débit empilé, taux d'erreur avec seuil, p50/p95/p99, heatmap des latences." },
  { h: "Détail", p: "Table Top routes colorée, bar chart par code HTTP, version déployée." },
  { h: "Annotations", p: "Les bascules chaos annotées, lien vers le TP 4 et vers Prometheus." },
  { h: "As code", p: "Export as code (Classic, JSON) → grafana/dashboards/. Provisionné, cadenas." },
], "60 minutes. Export : Model Classic pour le provisioning fichier, V2 Resource pour Git Sync et la nouvelle API.");
image("TP 5 — le résultat attendu", path.join(IMG, "tp5-boutique.png"), "Métier en haut, RED au milieu, détail en bas, deux bascules chaos annotées");

section("MODULE 10", "Provisioning, utilisateurs, droits", "Tout en fichiers, un modèle de droits propre, OSS ou Enterprise ?");
cards("Le modèle de droits", [
  { h: "Organisation", p: "Cloisonnement total. Une par client chez un hébergeur, sinon une seule. Pas pour séparer des équipes." },
  { h: "Utilisateurs et rôles", p: "Locaux ou OAuth / LDAP / SAML. Admin, Editor, Viewer, None par organisation. Le Server Admin à part." },
  { h: "Teams et dossiers", p: "Les droits vont aux teams, pas aux personnes. View / Edit / Admin par dossier ou dashboard." },
  { h: "Service accounts", p: "Comptes techniques avec token, pour les scripts et la CI. Remplacent les API keys." },
], { grid: true, note: "Bonne pratique : un dossier par équipe, une team par équipe, la team Editor sur son dossier, dashboards provisionnés en lecture seule dans un dossier Officiel." });
table("OSS, Enterprise, Cloud", ["", "OSS (AGPL v3)", "Enterprise / Cloud"], [
  ["Dashboards, alerting, Explore, provisioning, Git Sync", "Oui", "Oui"],
  ["Sources de données", "Toutes les open source", "+ Splunk, Datadog, ServiceNow, Oracle, SAP…"],
  ["Authentification", "OAuth, LDAP, proxy", "+ SAML, SCIM, sync de teams"],
  ["Droits", "Rôles fixes, permissions dossiers", "+ RBAC fin, permissions par source"],
  ["Rapports PDF, white-label, audit, query caching", "Non", "Oui"],
  ["Support, prix", "Communauté, gratuit", "Contrat ; licence par utilisateur actif / à l'usage"],
], { colW: [3.6, 2.4, 3.0], size: 12, rowH: 0.45, note: "Ma réponse honnête : 90 % des entreprises n'ont pas besoin d'Enterprise. On y va pour SAML/SCIM, un connecteur commercial ou les rapports." });
exercises("Exercices 2.30 à 2.33 — droits (20 min)", [
  ["2.30", "Une utilisatrice Viewer : que peut-elle faire ?"],
  ["2.31", "Un dossier Boutique, une team, Edit sur le dossier seulement"],
  ["2.32", "Une organisation : que voit-on dedans ?"],
  ["2.33", "Bonus : service account, token, curl, une annotation par l'API"],
]);
bullets("Récap du jour 2", ["rate() sur un counter, jamais brut ; fenêtre ≥ 4 × scrape", "histogram_quantile a besoin de by (le)", "$__rate_interval partout dans Grafana ; multi-valeur → =~", "Unités, seuils, value mappings : un dashboard lisible par le CEO", "Merge + Organize + Sort : la table", "Un dashboard vit dans Git, provisionné ; uid fixe", "Droits par team et par dossier"], { note: "Ce soir : recording.yml rempli, TP 4 et TP 5 sauvegardés, tp5-boutique.json provisionné." });

// ===========================================================================
// JOUR 3
// ===========================================================================
section("JOUR 3", "Réagir", "Des alertes qui ne réveillent que pour de bonnes raisons, l'exploitation, le passage à l'échelle.");
section("MODULE 11", "Philosophie de l'alerting", "Symptômes, pas causes. Actionnable, ou pas du tout.");
twoCol("Mauvaise alerte, bonne alerte", { h: "Cause", items: ["« CPU > 90 % »", "Peut-être un problème… ou le serveur qui fait son travail", "Réponse quand ça sonne : « je regarde »", "C'est un panel, pas une alerte"] },
  { h: "Symptôme", items: ["« Les clients attendent plus de 3 s »", "« 5 % des paiements échouent »", "Quelqu'un souffre, il faut agir", "Un runbook, un responsable, une sévérité"] },
  { rightColor: C.navy, note: "Google SRE : on alerte sur la douleur du client. Trois niveaux suffisent : critical (on réveille), warning (demain matin), info (ticket)." });
statement("400 notifications par jour.\nLa nuit où la base est tombée, l'alerte est passée avec les autres.", "Après nettoyage : 12 alertes, toutes sur des symptômes, chacune avec un runbook. La fatigue d'alerte tue plus de systèmes que les pannes.");
code("Anatomie d'une règle", `groups:
  - name: shop-api
    rules:
      - alert: ShopHighErrorRate
        expr: |
          sum by (instance) (rate(http_requests_total{status=~"5.."}[5m]))
          / sum by (instance) (rate(http_requests_total[5m])) > 0.05
        for: 2m               # pending → firing
        keep_firing_for: 3m   # anti-clignotement
        labels:
          severity: critical
          team: boutique
        annotations:
          summary: "Taux d'erreur élevé sur {{ $labels.instance }}"
          description: "{{ $value | humanizePercentage }} des requêtes échouent."
          runbook_url: "https://…/shop-errors.md"`, ["Une alerte par série renvoyée : by (instance) → une par instance", "Labels : pour router. Annotations : pour les humains", "Templates Go : $labels, $value, humanize*, printf", "promtool check rules, promtool test rules"], { size: 10 });

section("MODULE 12", "Alertmanager", "Qui prévenir, quand, combien de fois.");
code("L'arbre de routage", `route:                       # la racine reçoit tout
  receiver: inbox-default
  group_by: ["alertname", "job"]
  group_wait: 30s            # avant la 1re notification
  group_interval: 5m         # avant les nouveautés d'un groupe
  repeat_interval: 4h        # si toujours active
  routes:
    - matchers: [severity = critical]
      receiver: astreinte-teams
      continue: true         # évaluer aussi la suite
    - matchers: [team = boutique]
      receiver: boutique-slack

inhibit_rules:
  - source_matchers: [alertname = TargetDown]
    target_matchers: [alertname =~ "ShopHighErrorRate|ShopCheckoutSlow"]
    equal: [instance]`, ["Première route qui matche, sauf continue: true", "Regroupement : 50 instances down = 1 notification", "Inhibition : serveur éteint, inutile de dire qu'il est lent", "Silences et time_intervals : maintenances, week-ends"], { size: 10, note: "Démo : localhost:9093, amtool config routes show, amtool config routes test severity=critical." });
image("Alertmanager en action", path.join(IMG, "alertmanager-alerts.png"), "Groupes par receiver, silences, inhibitions", "Je démarre le module en arrêtant shop-api-2 : pending, firing, notification dans l'Inbox, resolved au redémarrage.");
tp("TP 6", "Alertes Prometheus et routage Alertmanager", "L'équipe boutique veut son canal. L'astreinte veut uniquement le critique, tout de suite. L'infra ne veut rien le week-end sauf le critique. Et personne ne veut « erreurs sur shop-api-2 » quand shop-api-2 est éteint.", [
  { h: "Alertes", p: "ShopHighErrorRate, ShopCheckoutSlow, ShopNoOrders (and), ShopStockLow, BlackboxProbeFailed." },
  { h: "Casser", p: "Chaos errors, chronométrer pending / firing / notification / resolved. Expliquer chaque délai." },
  { h: "Router", p: "Quatre receivers, quatre routes, continue: true, amtool routes test." },
  { h: "Inhiber", p: "TargetDown masque erreurs et latence sur la même instance." },
  { h: "Taire", p: "Un silence par l'UI et amtool, un time_interval nuit-et-weekend." },
], "55 minutes. Piège garanti : un intervalle 20:00 → 08:00 est refusé, il faut le couper à minuit. Même règle dans Grafana.");

section("MODULE 13", "Notifications tierces et ChatOps", "Slack, PagerDuty, Teams via Workflows, GitHub, templates.");
twoCol("Slack et PagerDuty", { h: "Slack", items: ["Incoming webhook (api_url_file) ou application avec token", "channel, title, text templatables", "Le secret dans un fichier, jamais dans le YAML commité"] },
  { h: "PagerDuty", items: ["Events API v2, une integration key par service", "routing_key_file, severity, description", "Escalade, plannings, acquittement côté PagerDuty", "trigger / resolve avec la même clé de déduplication"] });
cards("Microsoft Teams, la méthode 2026", [
  { n: 1, h: "Les connecteurs Office 365 sont morts", p: "Création bloquée depuis 2024, arrêt définitif fin 2025. msteams_configs est déprécié." },
  { n: 2, h: "Workflows (Power Automate)", p: "Dans le canal : … → Workflows → « Post to a channel when a webhook request is received ». Copier l'URL." },
  { n: 3, h: "Alertmanager et Grafana", p: "msteamsv2_configs: webhook_url_file. Contact point Microsoft Teams, champ URL. La carte adaptative est générée." },
  { n: 4, h: "Pièges", p: "Canal privé : Post as User. Rien n'arrive ? Historique du flux dans Power Automate. L'Inbox du lab imite le flux." },
], { grid: true, note: "Pas à pas complet en annexe E du guide. Si j'ai un tenant de démo, je crée le flux en direct." });
twoCol("GitHub et templates", { h: "GitHub (ChatOps)", items: ["Une alerte ouvre une issue, la commente, la ferme", "Webhook → repository_dispatch → workflow Actions", ".github/workflows/alert-to-issue.yml dans le dépôt", "Grafana : contact point Webhook + payload personnalisé + Authorization"] },
  { h: "Templates Alertmanager", items: ["Templates Go, fichiers .tmpl chargés par templates:", "{{ template \"formation.text\" . }}", ".Status, .Alerts, .CommonLabels, .CommonAnnotations", "Un bon message : statut, résumé, sévérité, instance, runbook, dashboard. Pas un dump de labels"] });
tp("TP 7", "Cas pratique : alerte CPU élevé → Teams", "L'équipe infra veut être prévenue dans son canal Teams quand un serveur dépasse 80 % de CPU pendant plus de deux minutes, avec un message lisible : le serveur, la valeur, un lien vers le dashboard.", [
  { h: "La règle", p: "HostHighCpuLoad, rate 2 min, for 2 min, printf. Un test unitaire avec une série idle constante." },
  { h: "Le routage", p: "Route alertname = HostHighCpuLoad → astreinte-teams, avant team = infra. Vraie URL Workflows ou Inbox." },
  { h: "Déclencher", p: "./lab.sh chaos cpu 300. Chronométrer. Ouvrir la carte : que manque-t-il ?" },
  { h: "Personnaliser", p: "formation.title / formation.text, lien dashboard avec var-instance, amtool template render." },
], "45 minutes. Pour tester sans attendre : POST /api/v2/alerts sur Alertmanager.");

section("MODULE 14", "Alerting Grafana", "Les mêmes concepts sous d'autres noms, et quand choisir quoi.");
table("Alertmanager ↔ Grafana", ["Alertmanager", "Grafana", ""], [
  ["receiver", "Contact point", "où envoyer"], ["route", "Notification policy", "qui reçoit quoi"], ["silence", "Silence", "identique"], ["time_interval", "Time interval (mute timing)", "plages horaires"], ["template", "Notification template", "même langage Go"], ["règle (for)", "Alert rule : pending period, keep firing for", "requêtes + Reduce / Math / Threshold"],
], { colW: [2.2, 3.8, 3.0], size: 13, rowH: 0.45, note: "Grafana-managed (évalué par Grafana) vs Data source-managed (écrit dans Mimir/Loki). On reste sur Grafana-managed." });
twoCol("Quand utiliser quoi", { h: "Prometheus + Alertmanager", items: ["Alertes pures métriques, versionnées, testées avec promtool", "Évaluées là où sont les données, pas de dépendance à Grafana", "HA triviale"] },
  { h: "Alerting Grafana", items: ["Multi-sources : un log Loki + une métrique", "Alertes SQL, équipes qui vivent dans Grafana", "Lien direct règle ↔ panel", "Se provisionne aussi en YAML, bouton Export partout"] },
  { rightColor: C.navy, note: "Les deux coexistent très bien. Ce qu'il ne faut pas faire : dupliquer la même alerte des deux côtés." });
image("Une règle Grafana 13", path.join(IMG, "grafana-alert-rule.png"), "Six étapes : nom, requête et condition, dossier et labels, évaluation, notifications, message");
tp("TP 8", "Alerting Grafana, de l'interface au code", "Une règle multi-dimensionnelle dans l'interface, un contact point Teams, une politique, un test, puis tout exporter et provisionner par fichier.", [
  { h: "Contact points", p: "inbox-grafana (Webhook), teams-astreinte (Microsoft Teams). Bouton Test." },
  { h: "Policies", p: "Default → inbox ; severity = critical → Teams, group wait 10 s." },
  { h: "Règle", p: "Taux d'erreur par instance, Instant, WHEN A IS ABOVE 5, pending 2 min, lien dashboard/panel." },
  { h: "As code", p: "Export YAML, formation.yml dans provisioning/alerting, restart, cadenas. Intervalle nuit en deux morceaux." },
], "45 minutes. Un fichier de provisioning invalide empêche Grafana de démarrer : docker compose logs grafana.");

section("MODULE 15", "Performances, limites, bonnes pratiques", "Dimensionner, diagnostiquer, déployer proprement.");
cards("Ce qui coûte", [
  { h: "Les séries actives", p: "La mémoire. 2 à 4 Ko par série dans le head. Un Prometheus tient 1 à 2 millions de séries confortablement." },
  { h: "Les échantillons", p: "CPU et disque. 1 à 2 octets chacun : 1 M de séries à 15 s ≈ 8,5 Go par jour." },
  { h: "Les requêtes", p: "Séries touchées × points. rate() sur un an sans filtre = des milliards de points." },
], { note: "Second tueur après la cardinalité : le churn, des séries qui changent de labels sans arrêt (pods qui redémarrent, label avec timestamp)." });
twoCol("Diagnostiquer et limiter", { h: "Diagnostiquer", items: ["Status → TSDB status : top métriques et labels", "prometheus_tsdb_head_series, samples_appended_total", "process_resident_memory_bytes, scrape_duration_seconds", "prometheus_engine_query_duration_seconds, ?stats=all", "promtool tsdb analyze sur un bloc"] },
  { h: "Limiter la casse", items: ["sample_limit, label_limit par job : le scrape est refusé, up passe à 0", "metric_relabel_configs drop", "--query.max-samples, --query.timeout", "Recording rules pour tout ce qui est affiché en boucle", "Pas d'auto-refresh 5 s sur 24 h"] });
cards("Déployer proprement", [
  { h: "Sécurité", p: "Pas d'auth par défaut. web.config.file (TLS, basic auth bcrypt) ou reverse proxy. Secrets dans des *_file." },
  { h: "Haute disponibilité", p: "Deux Prometheus identiques (external_labels replica), Alertmanager en cluster qui déduplique. Grafana sur PostgreSQL derrière un LB." },
  { h: "Mode agent", p: "--agent : scrape et remote_write, sans stockage ni requêtes. Sites distants, edge. Grafana Alloy fait pareil (et logs, traces, OTLP)." },
  { h: "Conventions", p: "Nommage, labels env / team / service partout, un runbook par alerte, tests de règles en CI, tout provisionné." },
], { grid: true });
exercises("Exercices 3.1 à 3.5 — diagnostic (15 min)", [
  ["3.1", "Séries actives, métrique et label les plus lourds"], ["3.2", "Échantillons par seconde, mémoire de Prometheus"], ["3.3", "Le job le plus cher, le plus lent"],
  ["3.4", "sample_limit: 100 sur redis : que devient up ?"], ["3.5", "?stats=all : brute contre recording rule"],
]);
tp("TP 9", "Sauvegarde, restauration, longue durée, sécurité", "L'audit demande : si le serveur de monitoring brûle, en combien de temps le remettez-vous ? Avez-vous 13 mois d'historique ? Qui peut lire vos métriques ?", [
  { h: "Snapshot", p: "./lab.sh snapshot, catastrophe simulée, restauration, qu'a-t-on perdu ?" },
  { h: "Grafana", p: "grafana.db, export de tous les dashboards par l'API. Ce qui n'y est pas. La vraie réponse : Git." },
  { h: "Remote write", p: "./lab.sh longterm, ne garder que shop_* et les recording rules, retard de la file." },
  { h: "Basic auth", p: "Bonus : web.yml bcrypt, --web.config.file, qu'est-ce qui casse ? Réparer, puis retirer." },
], "45 minutes. Un snapshot = liens durs vers les blocs + le head : instantané. Ne jamais copier data/ à chaud sans snapshot.");

section("MODULE 16", "Mise à l'échelle et écosystème", "Quand un Prometheus ne suffit plus, et où va tout ça.");
{
  const s = base();
  title(s, "Les options, dans l'ordre", false, "Réduire d'abord (cardinalité, drop, agrégation). Ensuite seulement, agrandir.");
  const steps = [["1", "Sharding fonctionnel", "Un Prometheus par équipe, par cluster, par type. Simple, robuste, vues séparées."], ["2", "Fédération", "Un central scrape /federate des régionaux, sur des recording rules agrégées. Vue globale légère."], ["3", "Remote write", "Mimir (le moteur de Grafana Cloud), Thanos (sidecar + stockage objet), VictoriaMetrics (économe). API compatible : Grafana ne voit pas la différence."], ["4", "Managé", "Grafana Cloud, Amazon, Google, Azure Monitor managed Prometheus."]];
  steps.forEach((st, i) => {
    const y = 1.65 + i * 0.85;
    s.addShape(pres.ShapeType.ellipse, { x: 0.5, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: C.orange }, line: { color: C.orange } });
    s.addText(st[0], { x: 0.5, y: y + 0.05, w: 0.5, h: 0.5, fontFace: FONT, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(st[1], { x: 1.2, y, w: 2.4, h: 0.6, fontFace: FONT, fontSize: 15, bold: true, color: C.navy, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(st[2], { x: 3.7, y, w: 5.8, h: 0.7, fontFace: FONT, fontSize: 12.5, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
  });
  notes(s, "Les signaux : OOM et compactions → trop de séries. > 30-60 jours → longue durée. Multi-sites → central. HA vraie → duo ou stockage distribué.");
}
{
  const s = base();
  title(s, "Le schéma cible", false, "Du brut en local, de l'agrégé au loin, une seule interface pour tout lire");
  ["Site A", "Site B", "Cluster K8s"].forEach((n, i) => box(s, 0.5, 1.7 + i * 1.05, 1.9, 0.75, `Prometheus\n${n}`, C.orange, C.white, 11));
  box(s, 4.0, 2.1, 2.4, 1.3, "Mimir · Thanos\nVictoriaMetrics", C.navy, C.white, 13);
  box(s, 4.0, 3.75, 2.4, 0.6, "Stockage objet (S3)", C.muted, C.white, 11);
  box(s, 7.5, 2.3, 2.0, 0.9, "Grafana", C.navy2, C.white, 14);
  [1.7, 2.75, 3.8].forEach((y) => arrow(s, 2.4, y + 0.37, 4.0, 2.75));
  arrow(s, 5.2, 3.4, 5.2, 3.75); arrow(s, 6.4, 2.75, 7.5, 2.75);
  s.addText("remote_write", { x: 2.55, y: 1.55, w: 1.4, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });
  s.addText("PromQL", { x: 6.55, y: 2.4, w: 0.9, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });
  s.addText("Rétention courte (7-15 j) et toutes les séries brutes sur chaque Prometheus · rétention longue (13 mois) et vue globale au centre · les API sont compatibles, Grafana ne voit pas la différence.", { x: 0.5, y: 4.55, w: 9, h: 0.55, fontFace: FONT, fontSize: 12, color: C.ink, isTextBox: true, margin: 0 });
  notes(s, "Le mode agent ou Alloy sur les sites distants remplace un Prometheus complet quand on ne veut rien stocker localement.");
}
cards("Et autour", [
  { h: "OpenTelemetry", p: "Le standard d'instrumentation des trois signaux. Prometheus 3 reçoit l'OTLP nativement, noms avec points et UTF-8. Collector / Alloy pour scraper, recevoir, envoyer." },
  { h: "Loki et Tempo", p: "Les mêmes idées pour les logs et les traces. Grafana les corrèle : d'un pic de latence aux traces (exemplars) aux logs, en trois clics." },
  { h: "Kubernetes", p: "kube-prometheus-stack : opérateur, ServiceMonitor, PrometheusRule, kube-state-metrics, dashboards. Un helm install, et tout ce qu'on a vu s'applique." },
], { note: "La suite logique de cette formation : Loki et Tempo." });
tp("WAR GAME", "Diagnostiquer en moins de cinq minutes", "Vous ne touchez plus à la configuration. Je casse la boutique d'une façon que vous ne connaissez pas, sur une seule instance. Vous avez Grafana, Prometheus, Alertmanager et l'Inbox.", [
  { h: "Quoi ?", p: "Qu'est-ce qui est cassé, exactement ?" },
  { h: "Où ?", p: "Sur quelle instance, quelle route, quelle dépendance ?" },
  { h: "Depuis quand ?", p: "L'heure de début, à la minute." },
  { h: "Qui a sonné ?", p: "Quelle alerte a sonné, laquelle aurait dû ?" },
  { h: "Action", p: "La première action. Par écrit." },
], "15 minutes chrono, par binôme. Puis débrief : qui a trouvé quoi avec quel outil, et ce qui manquait (redis_up, panneau par instance, lien vers les logs).");
{
  const s = base(true);
  s.addText("Lundi matin", { x: 0.7, y: 0.9, w: 8.6, h: 0.7, fontFace: FONT, fontSize: 32, bold: true, color: C.white, isTextBox: true, margin: 0 });
  s.addText("Choisissez un service. Un seul.\nInstrumentez-le en RED. Un dashboard. Deux alertes symptômes. Un runbook.\nPas plus. Le reste viendra.", { x: 0.7, y: 1.7, w: 8.6, h: 1.6, fontFace: FONT, fontSize: 20, color: C.light, isTextBox: true, margin: 0 });
  s.addText("Le dépôt : github.com/yparent/formation-observabilite-lab (branche formation-2026)\nprometheus.io/docs · grafana.com/docs · samber.github.io/awesome-prometheus-alerts · grafana.com/grafana/dashboards", { x: 0.7, y: 3.5, w: 8.6, h: 0.9, fontFace: FONT, fontSize: 12, color: C.peach, isTextBox: true, margin: 0 });
  s.addText("Merci. Questionnaire d'évaluation, puis je reste pour vos questions.", { x: 0.7, y: 4.5, w: 7.2, h: 0.4, fontFace: FONT, fontSize: 14, color: C.white, isTextBox: true, margin: 0 });
  logoDark(s, 8.2, 4.6, 1.3);
  notes(s, "Questionnaire de fin (annexe A), correction à l'oral tout de suite. Rappel du questionnaire de satisfaction Sparks.");
}

const out = path.join(HERE, "Formation-Prometheus-Grafana.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("écrit :", out, "·", slideNo, "slides"));
