// Génère le deck du jour 3 pratique : node docs/slides/build_deck_jour3.js
// Reprend la charte et les fonctions de build_deck.js, avec le contenu de deck_jour3_content.js
// et les notes de présentateur de notes_jour3.js.
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "build_deck.js"), "utf8");
const debut = src.indexOf("// ===========================================================================\n// OUVERTURE");
const fin = src.indexOf("// Notes de présentateur");
const outils = src.slice(0, debut)
  .replace('require("./notes.js")', 'require("./notes_jour3.js")')
  .replace('pres.title = "Formation Prometheus & Grafana";', 'pres.title = "Prometheus & Grafana — Jour 3, version pratique";');
const sortie = src.slice(fin).replace("Formation-Prometheus-Grafana.pptx", "Jour3-Prometheus-Grafana.pptx");
const contenu = fs.readFileSync(path.join(__dirname, "deck_jour3_content.js"), "utf8");
const tmp = path.join(__dirname, ".deck_jour3.tmp.js");
fs.writeFileSync(tmp, outils + contenu + "\n" + sortie);
try { require(tmp); } finally { fs.unlinkSync(tmp); }
