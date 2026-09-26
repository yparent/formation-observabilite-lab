"""
inbox : boîte de réception des notifications d'alerte.

Pendant la formation, on n'a pas toujours un Slack, un Teams ou un PagerDuty
sous la main. Ce petit service joue le rôle du destinataire : il accepte
n'importe quel POST, garde les 300 derniers messages en mémoire et les affiche
dans une page web qui se rafraîchit toute seule.

Chemins utiles :
  /                 la page de consultation
  /webhook          receveur générique (Alertmanager webhook_configs, Grafana webhook)
  /teams            imite un flux Microsoft Teams (Workflows) : reçoit une Adaptive Card
  /slack            imite l'API Slack (incoming webhook)
  /api/messages     les messages au format JSON (pratique pour vérifier en ligne de commande)
  /api/clear        vide la boîte
  /metrics          oui, même la boîte de réception est instrumentée
"""

import json
import time
from collections import deque

from flask import Flask, Response, jsonify, request
from prometheus_client import CONTENT_TYPE_LATEST, Counter, generate_latest

app = Flask(__name__)
MESSAGES = deque(maxlen=300)
RECEIVED = Counter("inbox_messages_received_total", "Notifications reçues", ["channel"])


def store(channel, payload):
    entry = {
        "received_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "channel": channel,
        "path": request.path,
        "payload": payload,
    }
    MESSAGES.appendleft(entry)
    RECEIVED.labels(channel=channel.split("/")[0]).inc()
    print(f"[inbox] {entry['received_at']} {channel} {json.dumps(payload)[:200]}", flush=True)


def read_payload():
    data = request.get_json(silent=True)
    if data is None:
        raw = request.get_data(as_text=True)
        try:
            data = json.loads(raw)
        except Exception:  # noqa: BLE001
            data = {"raw": raw}
    return data


@app.route("/webhook", methods=["POST"])
@app.route("/webhook/<path:sub>", methods=["POST"])
def webhook(sub=""):
    store("webhook" + ("/" + sub if sub else ""), read_payload())
    return jsonify(ok=True)


@app.route("/teams", methods=["POST"])
@app.route("/teams/<path:sub>", methods=["POST"])
def teams(sub=""):
    store("teams", read_payload())
    # Un flux Workflows répond 202 Accepted
    return Response("Accepted", status=202)


@app.route("/slack", methods=["POST"])
@app.route("/slack/<path:sub>", methods=["POST"])
def slack(sub=""):
    store("slack", read_payload())
    return Response("ok", status=200)


@app.route("/metrics")
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


@app.route("/api/messages")
def api_messages():
    return jsonify(list(MESSAGES))


@app.route("/api/clear", methods=["GET", "POST"])
def api_clear():
    MESSAGES.clear()
    return jsonify(ok=True)


def summarize(entry):
    """Extrait un résumé lisible des formats connus (Alertmanager, Grafana, Teams, Slack)."""
    p = entry["payload"]
    lines = []
    if isinstance(p, dict):
        # Alertmanager webhook et Grafana webhook partagent ce format
        if "alerts" in p and isinstance(p["alerts"], list):
            for a in p["alerts"]:
                labels = a.get("labels", {})
                ann = a.get("annotations", {})
                lines.append(
                    f"[{a.get('status','?').upper()}] {labels.get('alertname','?')} "
                    f"severity={labels.get('severity','-')} instance={labels.get('instance','-')} "
                    f"| {ann.get('summary') or ann.get('description') or ''}"
                )
        elif "attachments" in p and isinstance(p["attachments"], list):
            for att in p["attachments"]:
                if att.get("contentType") == "application/vnd.microsoft.card.adaptive":  # Teams (Workflows)
                    blocks = [b.get("text", "") for b in att.get("content", {}).get("body", []) if b.get("type") == "TextBlock"]
                    if blocks:
                        lines.append(blocks[0])
                        if len(blocks) > 1:
                            lines.append(" ".join(blocks[1].split())[:240] + "…")
                else:  # Slack
                    lines.append(f"{att.get('title','')} {att.get('text','')}".strip())
        elif "text" in p:  # Slack simple
            lines.append(str(p["text"]))
    return lines or ["(voir le JSON)"]


PAGE = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Inbox notifications</title>
<meta http-equiv="refresh" content="5">
<style>
 body{font-family:system-ui,sans-serif;margin:2rem;background:#f5f6f8;color:#1c1e21}
 h1{font-size:1.4rem} .msg{background:#fff;border-radius:8px;padding:1rem;margin-bottom:1rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}
 .meta{color:#666;font-size:.85rem} .chan{display:inline-block;padding:.1rem .5rem;border-radius:4px;color:#fff;font-size:.8rem;margin-right:.5rem}
 .webhook{background:#4a6fa5}.teams{background:#6264a7}.slack{background:#611f69}
 .firing{color:#b3261e;font-weight:600}.resolved{color:#1b7f3b;font-weight:600}
 pre{background:#f0f2f5;padding:.6rem;border-radius:6px;overflow:auto;font-size:.8rem;max-height:220px}
 details summary{cursor:pointer;color:#4a6fa5}
 a{color:#4a6fa5}
</style></head><body>
<h1>Boîte de réception des notifications</h1>
<p class="meta">Rafraîchissement automatique toutes les 5 s. {{count}} message(s). <a href="/api/clear">Vider</a> · <a href="/api/messages">JSON</a></p>
{{items}}
</body></html>"""


@app.route("/")
def index():
    items = []
    for e in MESSAGES:
        lines = "".join(
            f"<div class='{ 'firing' if '[FIRING' in l else 'resolved' if '[RESOLVED' in l else ''}'>{l}</div>"
            for l in summarize(e)
        )
        chan_class = e["channel"].split("/")[0]
        items.append(
            f"<div class='msg'><span class='chan {chan_class}'>{e['channel']}</span>"
            f"<span class='meta'>{e['received_at']} · {e['path']}</span>{lines}"
            f"<details><summary>JSON brut</summary><pre>{json.dumps(e['payload'], indent=2, ensure_ascii=False)}</pre></details></div>"
        )
    html = PAGE.replace("{{count}}", str(len(MESSAGES))).replace(
        "{{items}}", "".join(items) or "<p>Aucune notification reçue pour l'instant.</p>"
    )
    return Response(html, mimetype="text/html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
