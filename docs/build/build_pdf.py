#!/usr/bin/env python3
"""
Génère les PDF de la formation à partir des Markdown.

  python3 docs/build/build_pdf.py            # tout
  python3 docs/build/build_pdf.py formateur  # guide formateur seulement
  python3 docs/build/build_pdf.py stagiaire  # les trois guides stagiaires

Pipeline : Markdown -> HTML (python-markdown) -> PDF via Chromium headless (Playwright),
en deux passes pour obtenir les numéros de page du sommaire.
"""

import asyncio
import re
import sys
import warnings
from pathlib import Path

import markdown
from playwright.async_api import async_playwright

warnings.filterwarnings("ignore")
from pypdf import PdfReader, PdfWriter  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
BUILD = DOCS / "build"
ASSETS = DOCS / "assets"

MD_EXT = ["tables", "fenced_code", "codehilite", "toc", "attr_list", "sane_lists", "md_in_html"]
MD_CFG = {"codehilite": {"guess_lang": False, "noclasses": False, "css_class": "hl"},
          "toc": {"toc_depth": "1-3", "anchorlink": False, "permalink": False}}

CSS = """
@page { size: A4; margin: 19mm 17mm 20mm 17mm; }
:root { --ink: #1b1f2a; --muted: #5b6270; --accent: #f15a22; --navy: #0f2a4a; --line: #e3e6eb; --code-bg: #f4f5f7; --note-bg: #fff6f1; }
html { font-size: 10.3pt; }
body { font-family: "Inter", "DejaVu Sans", sans-serif; color: var(--ink); line-height: 1.5; margin: 0; }
main h1 { font-size: 23pt; font-weight: 700; color: var(--navy); margin: 0 0 6mm; line-height: 1.15; letter-spacing: -0.01em; break-before: page; }
main h1::after, .toc-page h1::after { content: ""; display: block; width: 28mm; height: 1.4mm; background: var(--accent); margin-top: 3mm; }
h2 { font-size: 15pt; font-weight: 700; color: var(--navy); margin: 8mm 0 3mm; break-after: avoid; line-height: 1.2; }
h3 { font-size: 11.8pt; font-weight: 600; color: var(--ink); margin: 6mm 0 2mm; break-after: avoid; }
h4 { font-size: 10.5pt; font-weight: 600; margin: 4mm 0 1.5mm; break-after: avoid; }
h3.pap { background: var(--navy); color: #fff; padding: 1.6mm 3mm; border-radius: 1.2mm; margin-top: 7mm; }
h3.pap::before { content: "⌨  "; }
p { margin: 0 0 2.6mm; orphans: 3; widows: 3; }
ul, ol { margin: 0 0 3mm; padding-left: 6mm; }
li { margin-bottom: 1mm; }
li > p { margin-bottom: 1mm; }
a { color: var(--navy); text-decoration: none; }
strong { font-weight: 650; }
hr { border: 0; border-top: 1px solid var(--line); margin: 6mm 0; }
code, pre { font-family: "IBM Plex Mono", "DejaVu Sans Mono", monospace; }
code { font-size: 8.6pt; background: var(--code-bg); padding: 0.2mm 1.2mm; border-radius: 1mm; }
pre { background: var(--code-bg); border-left: 1.2mm solid #cfd4dc; padding: 2.5mm 3mm; font-size: 8.2pt; line-height: 1.42; overflow-wrap: anywhere; white-space: pre-wrap; border-radius: 1mm; margin: 2mm 0 3.5mm; break-inside: avoid; }
pre.long { break-inside: auto; }
pre code { background: none; padding: 0; font-size: inherit; }
table { border-collapse: collapse; width: 100%; margin: 2mm 0 4mm; font-size: 9.1pt; }
th, td { border-bottom: 1px solid var(--line); padding: 1.6mm 2mm; vertical-align: top; text-align: left; }
th { background: #eef1f5; font-weight: 650; color: var(--navy); border-bottom: 1.5px solid #c9cfd8; }
thead { display: table-header-group; }
.session td:nth-child(1), .session td:nth-child(3) { white-space: nowrap; }
tr { break-inside: avoid; }
td code { font-size: 8.2pt; }
blockquote { margin: 3mm 0 4mm; padding: 2.5mm 4mm; background: var(--note-bg); border-left: 1.2mm solid var(--accent); border-radius: 1mm; break-inside: avoid; }
blockquote p { margin: 0 0 1.5mm; }
blockquote p:last-child { margin: 0; }
div.answer { margin: 2mm 0 4mm; padding: 2mm 4mm; background: #fbfbfc; border-left: 1.2mm solid #b9c0cc; border-radius: 1mm; break-inside: avoid; break-before: avoid; font-size: 9.5pt; color: var(--muted); }
p:has(+ div.answer), ol:has(+ div.answer), ul:has(+ div.answer), pre:has(+ div.answer) { break-after: avoid; }
blockquote.answer { background: #fbfbfc; border-left-color: #b9c0cc; min-height: 14mm; break-before: avoid; }
p:has(+ blockquote.answer), ol:has(+ blockquote.answer), ul:has(+ blockquote.answer) { break-after: avoid; }
figure { margin: 3mm 0 4mm; break-inside: avoid; }
figure img { max-width: 100%; max-height: 120mm; height: auto; display: block; margin: 0 auto; border: 1px solid var(--line); border-radius: 1.5mm; }
figcaption { font-size: 8.5pt; color: var(--muted); text-align: center; margin-top: 1.2mm; }

/* Pygments (light) */
.hl .k, .hl .kn, .hl .kd { color: #8250df; } .hl .s, .hl .s1, .hl .s2, .hl .sa { color: #0a3069; } .hl .c, .hl .c1, .hl .cm, .hl .ch { color: #6e7781; font-style: italic; }
.hl .nt { color: #116329; } .hl .nv, .hl .na { color: #953800; } .hl .m, .hl .mi, .hl .mf { color: #0550ae; } .hl .nb { color: #0550ae; } .hl .o { color: #cf222e; }

/* Couverture : occupe toute la première page (marges incluses via marges négatives) */
.cover { position: relative; height: 297mm; width: 210mm; padding: 22mm 20mm; box-sizing: border-box; background: linear-gradient(160deg, #0f2a4a 0%, #163d6b 55%, #1b4f86 100%); color: #fff; overflow: hidden; }
.cover .logos { display: flex; align-items: center; justify-content: space-between; }
.cover .logos img { border: 0; margin: 0; background: #fff; border-radius: 2mm; padding: 2mm 4mm; }
.cover .kicker { margin-top: 52mm; font-size: 10.5pt; letter-spacing: 0.18em; text-transform: uppercase; color: #ffb48f; font-weight: 600; }
.cover h1.title { color: #fff; font-size: 33pt; margin: 4mm 0 0; line-height: 1.12; font-weight: 700; }
.cover h1.title::after { content: ""; display: block; background: var(--accent); width: 34mm; height: 1.6mm; margin-top: 4mm; }
.cover .subtitle { font-size: 14.5pt; color: #dbe6f3; margin-top: 5mm; max-width: 150mm; line-height: 1.35; }
.cover .meta { position: absolute; bottom: 20mm; left: 20mm; right: 20mm; font-size: 10pt; color: #dbe6f3; display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.25); padding-top: 4mm; }
.cover .meta strong { color: #fff; font-weight: 600; }

/* Sommaire */
.toc-page { break-after: page; }
.toc-page h1 { font-size: 23pt; font-weight: 700; color: var(--navy); margin: 0 0 6mm; }
.toc-page ul { list-style: none; padding: 0; margin: 0; }
.toc-page > ul > li { margin: 0 0 1.6mm; font-weight: 600; break-inside: avoid; }
.toc-page > ul > li > ul { margin: 1mm 0 3mm 5mm; }
.toc-page > ul > li > ul > li { font-weight: 400; margin: 0 0 0.7mm; }
.toc-page a { display: flex; align-items: baseline; color: var(--ink); }
.toc-page .dots { flex: 1; border-bottom: 1px dotted #c9cfd8; margin: 0 2mm; min-width: 6mm; transform: translateY(-1mm); }
.toc-page .pn { color: var(--muted); font-variant-numeric: tabular-nums; min-width: 6mm; text-align: right; }

.mk { font-size: 1.5pt; color: #ffffff; position: absolute; }
.time { display: inline-block; font-size: 8.5pt; font-weight: 600; color: var(--accent); background: #fff1ea; border-radius: 1mm; padding: 0.4mm 1.6mm; margin-left: 2mm; vertical-align: middle; }
"""

HEADER = """<div style="font-family: Inter, sans-serif; font-size: 7.5pt; color: #7a7a7a; width: 100%; padding: 0 17mm; display: flex; justify-content: space-between;">
<span>{left}</span><span>{right}</span></div>"""
FOOTER = """<div style="font-family: Inter, sans-serif; font-size: 7.5pt; color: #7a7a7a; width: 100%; padding: 0 17mm; display: flex; justify-content: space-between;">
<span>Yohan Parent · Sparks</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>"""


def fix_markdown(text: str) -> str:
    """python-markdown exige une ligne vide avant une liste : on l'ajoute quand elle manque."""
    lines = text.split("\n")
    out = []
    in_code = False
    for line in lines:
        if line.startswith("```"):
            in_code = not in_code
        if (not in_code and re.match(r"^\s*([-*]|\d+\.)\s", line) and out
                and out[-1].strip() and not re.match(r"^\s*([-*]|\d+\.)\s", out[-1])
                and not out[-1].startswith("```") and not out[-1].startswith("|")
                and not out[-1].startswith(">")):
            out.append("")
        out.append(line)
    return "\n".join(out)


def answer_boxes(text: str) -> str:
    """Un bloc de lignes '>' vides (ou avec un libellé court finissant par ':') devient un cadre à remplir."""
    out, i, lines = [], 0, text.split("\n")
    while i < len(lines):
        if lines[i].startswith(">"):
            j = i
            while j < len(lines) and lines[j].startswith(">"):
                j += 1
            block = [l[1:].strip() for l in lines[i:j]]
            texts = [b for b in block if b]
            if len(texts) <= 1 and (not texts or (texts[0].endswith(":") and len(texts[0]) < 60)):
                n = max(2, len(block))
                label = f"<em>{texts[0]}</em>" if texts else "&nbsp;"
                out.append(f'<div class="answer" style="min-height:{5 + 7 * n}mm">{label}</div>')
                i = j
                continue
        out.append(lines[i])
        i += 1
    return "\n".join(out)


def md_to_html(text: str) -> str:
    md = markdown.Markdown(extensions=MD_EXT, extension_configs=MD_CFG)
    return md.convert(answer_boxes(fix_markdown(text)))


def headings(html: str):
    """[(level, id, titre)] pour h1 et h2."""
    items = []
    for level, hid, title in re.findall(r'<h([12]) id="([^"]+)">(.*?)</h\1>', html, flags=re.S):
        mk = re.search(r'<span class="mk">(zq\d+zq)</span>', title)
        title = re.sub(r'<span class="mk">.*?</span>', "", title)
        title = re.sub(r'<span class="time">.*?</span>', "", title)
        title = re.sub(r"<[^>]+>", "", title)
        title = title.replace("&amp;", "&").replace("&#39;", "'").replace("&quot;", '"')
        items.append((level, hid, title.strip(), mk.group(1) if mk else ""))
    return items


def make_toc(items, pages=None) -> str:
    out = ["<ul>"]
    open_sub = False
    for level, hid, title, _mk in items:
        pn = pages.get(hid, "") if pages else ""
        link = f'<a href="#{hid}"><span>{title}</span><span class="dots"></span><span class="pn">{pn}</span></a>'
        if level == "1":
            if open_sub:
                out.append("</ul></li>")
                open_sub = False
            elif len(out) > 1:
                out.append("</li>")
            out.append(f"<li>{link}")
        else:
            if not open_sub:
                out.append("<ul>")
                open_sub = True
            out.append(f"<li>{link}</li>")
    if open_sub:
        out.append("</ul></li>")
    elif len(out) > 1:
        out.append("</li>")
    out.append("</ul>")
    return "\n".join(out)


def postprocess(html: str) -> str:
    html = re.sub(r'<h3([^>]*)>Pas à pas', r'<h3\1 class="pap">Pas à pas', html)
    html = re.sub(r'(<h[1-6]) id="([^"]+)"', r'\1 id="h-\2"', html)
    # marqueur invisible (mais extractible) pour retrouver la page de chaque titre h1/h2
    counter = [0]
    def mark(m):
        counter[0] += 1
        return f'{m.group(1)}<span class="mk">zq{counter[0]}zq</span>'
    html = re.sub(r'(<h[12] id="[^"]+">)', mark, html)
    # Zones de réponse du guide stagiaire : un blockquote sans texte (ou avec un simple libellé
    # "Réponse :" / "Vos requêtes :") devient un cadre à remplir, haut de ~8 mm par ligne ">".
    def answer(m):
        inner = m.group(1)
        paras = [re.sub(r"<[^>]+>", "", x).strip() for x in re.findall(r"<p>(.*?)</p>", inner, flags=re.S)]
        text = " ".join(paras).strip()
        if len(text) > 70 or (text and not text.endswith(":")):
            return m.group(0)
        lines = max(2, inner.count("<br") + inner.count("</p>") + 1)
        label = f"<p><em>{text}</em></p>" if text else ""
        return f'<blockquote class="answer" style="min-height:{6 + 7 * lines}mm">{label}</blockquote>'
    html = re.sub(r"<blockquote>(.*?)</blockquote>", answer, html, flags=re.S)
    html = re.sub(r'<p><img alt="([^"]*)" src="([^"]+)"\s*/?></p>', r'<figure><img alt="\1" src="\2"><figcaption>\1</figcaption></figure>', html)
    html = re.sub(r"(<h[23][^>]*>.*?)\s\((\d+ min(?:[^)]*)?)\)(</h[23]>)", r'\1<span class="time">\2</span>\3', html)
    html = re.sub(r'<pre>(?=(?:[^<]|<(?!/pre>)){1800,})', '<pre class="long">', html)
    return html


def cover_html(title, subtitle, kicker, meta_left, meta_right) -> str:
    return f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>{title}</title><style>{CSS} @page {{ margin: 0 }} body {{ margin: 0 }}</style></head><body>
<section class="cover">
  <div class="logos">
    <img src="file://{ASSETS}/logo-sparks.png" style="height:22mm">
    <img src="file://{ASSETS}/logo-ysycloud.png" style="height:20mm">
  </div>
  <div class="kicker">{kicker}</div>
  <h1 class="title">{title}</h1>
  <div class="subtitle">{subtitle}</div>
  <div class="meta"><div>{meta_left}</div><div>{meta_right}</div></div>
</section></body></html>"""


def page_html(title, body_html, toc_html) -> str:
    return f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>{title}</title><style>{CSS}</style></head><body>
<section class="toc-page"><h1>Sommaire</h1>{toc_html}</section>
<main>{body_html}</main>
</body></html>"""


async def render(html_path: Path, pdf_path: Path, header_left: str, header_right: str, cover_path: Path, cover_pdf: Path):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--allow-file-access-from-files"])
        pg = await b.new_page()
        await pg.goto(f"file://{cover_path}", wait_until="load")
        await pg.wait_for_timeout(300)
        await pg.emulate_media(media="print")
        await pg.pdf(path=str(cover_pdf), format="A4", print_background=True, prefer_css_page_size=True,
                     margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        await pg.goto(f"file://{html_path}", wait_until="load")
        await pg.wait_for_timeout(600)
        await pg.emulate_media(media="print")
        await pg.pdf(path=str(pdf_path), format="A4", print_background=True, prefer_css_page_size=True,
                     display_header_footer=True, header_template=HEADER.format(left=header_left, right=header_right),
                     footer_template=FOOTER, margin={"top": "19mm", "bottom": "20mm", "left": "17mm", "right": "17mm"})
        await b.close()


def merge(cover_pdf: Path, body_pdf: Path, out: Path):
    w = PdfWriter()
    for src in (cover_pdf, body_pdf):
        for pg in PdfReader(str(src)).pages:
            w.add_page(pg)
    with open(out, "wb") as f:
        w.write(f)


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def page_numbers(pdf_path: Path, items):
    """Retrouve la page de chaque titre en cherchant son texte dans le PDF (après le sommaire)."""
    reader = PdfReader(str(pdf_path))
    texts = [norm(p.extract_text() or "") for p in reader.pages]
    pages = {}
    for level, hid, title, mk in items:
        for i, t in enumerate(texts):
            if mk and mk in t:
                pages[hid] = i + 1
                break
    return pages, len(reader.pages)


def build(doc_name, pdf_path, title, subtitle, kicker, body, meta_left, meta_right, header_left, header_right):
    items = headings(body)
    html_path = BUILD / f"{doc_name}.html"
    cover_path = BUILD / f"{doc_name}-cover.html"
    body_pdf = BUILD / f"{doc_name}-body.pdf"
    cover_pdf = BUILD / f"{doc_name}-cover.pdf"
    cover_path.write_text(cover_html(title, subtitle, kicker, meta_left, meta_right))
    html_path.write_text(page_html(title, body, make_toc(items)))
    asyncio.run(render(html_path, body_pdf, header_left, header_right, cover_path, cover_pdf))
    pages, total = page_numbers(body_pdf, items)
    html_path.write_text(page_html(title, body, make_toc(items, pages)))
    asyncio.run(render(html_path, body_pdf, header_left, header_right, cover_path, cover_pdf))
    merge(cover_pdf, body_pdf, pdf_path)
    total += 1
    missing = [t for _, h, t, _m in items if h not in pages]
    print(f"  {pdf_path.relative_to(ROOT)}  ({total} pages{', titres non localisés : ' + str(len(missing)) if missing else ''})")
    for m in missing[:8]:
        print("     ?", m)


def build_formateur():
    src = DOCS / "formateur" / "src"
    parts = [(src / n).read_text() for n in sorted(p.name for p in src.glob("*.md"))]
    body = postprocess(md_to_html("\n\n".join(parts)))
    body = body.replace('src="../img/', f'src="file://{DOCS / "formateur" / "img"}/')
    body = body.replace('src="../../diagrams/', f'src="file://{DOCS / "diagrams"}/')
    build("guide-formateur", DOCS / "formateur" / "Guide-formateur-Prometheus-Grafana.pdf",
          "Formation Prometheus &amp; Grafana",
          "Guide du formateur — déroulé complet des trois jours, exercices corrigés, démonstrations, anecdotes et points de vigilance",
          "Support formateur · édition septembre 2026", body,
          "<strong>Yohan Parent</strong> · Architecte cloud, formateur", "<strong>3 jours</strong> · 16 modules · 9 TP · 39 exercices",
          "Formation Prometheus & Grafana", "Guide du formateur")


def build_stagiaire(day: int):
    text = (DOCS / "stagiaire" / f"jour-{day}.md").read_text()
    m = re.match(r"# (.*?)\n\n\*\*(.*?)\*\*\n\n(.*?)\n\n(.*)", text, flags=re.S)
    title, subtitle, meta, rest = m.groups()
    body = postprocess(md_to_html("# " + subtitle + "\n\n" + rest))
    body = body.replace('src="img/', f'src="file://{DOCS / "stagiaire" / "img"}/')
    body = body.replace('src="../diagrams/', f'src="file://{DOCS / "diagrams"}/')
    build(f"guide-stagiaire-jour-{day}", DOCS / "stagiaire" / f"Guide-stagiaire-Jour-{day}.pdf",
          f"Guide stagiaire — Jour {day}", subtitle, "Formation Prometheus &amp; Grafana", body,
          "<strong>Formateur</strong> · Yohan Parent", "<strong>Sparks</strong> · édition septembre 2026",
          "Formation Prometheus & Grafana", f"Guide stagiaire · Jour {day}")


def build_session(name: str):
    """Déroulé d'une session client : docs/formateur/sessions/<name>.md → PDF à côté."""
    src = DOCS / "formateur" / "sessions" / f"{name}.md"
    text = src.read_text()
    m = re.match(r"# (.*?)\n\n(.*)", text, flags=re.S)
    title, rest = m.groups()
    body = '<div class="session">' + postprocess(md_to_html("# " + title + "\n\n" + rest)) + "</div>"
    body = body.replace('src="../../diagrams/', f'src="file://{DOCS / "diagrams"}/')
    build(f"session-{name}", DOCS / "formateur" / "sessions" / f"Deroule-{name}.pdf",
          "Formation Prometheus &amp; Grafana", title,
          "Déroulé de session · support formateur", body,
          "<strong>Yohan Parent</strong> · Architecte cloud, formateur", "<strong>Sparks</strong> · édition septembre 2026",
          "Formation Prometheus & Grafana", f"Déroulé · {title.split(' — ')[0]}")


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("all", "formateur"):
        build_formateur()
    if what in ("all", "stagiaire"):
        for d in (1, 2, 3):
            build_stagiaire(d)
    if what in ("all", "sessions"):
        for p in sorted((DOCS / "formateur" / "sessions").glob("*.md")):
            build_session(p.stem)
