#!/usr/bin/env python3
"""Génère les dashboards corrigés du jour 3 pratique (TP A et TP B) en JSON Grafana.

    python3 solutions/jour-3-pratique/build_dashboards.py

Écrit solutions/jour-3-pratique/dashboards/*.json. Sur la branche jour3-corrige, les mêmes
fichiers sont dans grafana/dashboards/ : Grafana les charge au démarrage (dossier Formation).
"""
import json
from pathlib import Path

DS = {"type": "prometheus", "uid": "prometheus"}
OUT = Path(__file__).parent / "dashboards"
B = 'job="shop-api", instance=~"$instance"'          # filtre boutique
N = 'instance=~"$instance"'                           # filtre machine


class Dash:
    def __init__(self):
        self.panels, self.id, self.y = [], 1, 0

    def row(self, title):
        self.panels.append({"id": self.id, "type": "row", "title": title, "collapsed": False,
                            "gridPos": {"x": 0, "y": self.y, "w": 24, "h": 1}, "panels": []})
        self.id += 1
        self.y += 1

    def panel(self, ptype, title, targets, x, w, h, field=None, options=None, desc=None, overrides=None):
        tg = []
        for i, t in enumerate(targets):
            expr, legend, inst = (t + (None, False))[:3] if isinstance(t, tuple) else (t, None, False)
            q = {"refId": "ABCDEFGH"[i], "datasource": DS, "expr": expr, "editorMode": "code",
                 "range": not inst, "instant": inst}
            if legend:
                q["legendFormat"] = legend
            if ptype == "heatmap":
                q["format"] = "heatmap"
            tg.append(q)
        p = {"id": self.id, "type": ptype, "title": title, "datasource": DS,
             "gridPos": {"x": x, "y": self.y, "w": w, "h": h}, "targets": tg,
             "fieldConfig": {"defaults": field or {}, "overrides": overrides or []},
             "options": options or {}}
        if desc:
            p["description"] = desc
        if ptype == "text":
            p.pop("datasource"); p.pop("targets")
        self.panels.append(p)
        self.id += 1
        return p

    def next_line(self, h):
        self.y += h


def thresholds(*steps):
    """steps : (couleur, valeur) ; la première a la valeur None (base)."""
    return {"mode": "absolute", "steps": [{"color": c, "value": v} for c, v in steps]}


STAT = {"reduceOptions": {"calcs": ["lastNotNull"]}, "colorMode": "background", "graphMode": "area",
        "justifyMode": "center", "textMode": "value"}
LEGEND_TABLE = {"legend": {"displayMode": "table", "placement": "right", "calcs": ["mean", "max"]},
                "tooltip": {"mode": "multi", "sort": "desc"}}


def base(uid, title, desc, panels, variable_query, extra_annotations=()):
    return {
        "uid": uid, "title": title, "description": desc, "tags": ["formation", "jour3"],
        "timezone": "browser", "editable": True, "graphTooltip": 1, "refresh": "10s",
        "schemaVersion": 41, "version": 1, "time": {"from": "now-30m", "to": "now"},
        "templating": {"list": [{
            "name": "instance", "label": "Instance", "type": "query", "datasource": DS,
            "definition": variable_query, "query": {"query": variable_query, "refId": "StandardVariableQuery", "qryType": 1},
            "refresh": 2, "sort": 1, "multi": True, "includeAll": True, "allValue": ".*",
            "current": {"selected": True, "text": ["All"], "value": ["$__all"]}, "options": [], "regex": ""}]},
        "annotations": {"list": [
            {"builtIn": 1, "datasource": {"type": "grafana", "uid": "-- Grafana --"}, "enable": True, "hide": True,
             "iconColor": "rgba(0, 211, 255, 1)", "name": "Annotations & Alerts", "type": "dashboard"},
            *extra_annotations]},
        "links": [{"title": "Formation", "type": "dashboards", "tags": ["formation"], "asDropdown": True,
                   "icon": "external link", "includeVars": False, "keepTime": True, "targetBlank": False}],
        "panels": panels,
    }


# ---------------------------------------------------------------------------
# TP A — La boutique en quatre signaux dorés
d = Dash()
d.panel("text", "À propos", [], 0, 24, 3, options={"mode": "markdown", "content":
        "**Boutique en ligne : santé et ventes.** En haut, les quatre signaux dorés (Google SRE) ; au milieu, "
        "les mêmes dans le temps ; en bas, le métier.  \n"
        "Propriétaire : équipe Boutique · Astreinte : canal Teams `alertes-apicil` · "
        "En cas d'alerte : [runbook](https://github.com/yparent/formation-observabilite-lab/blob/formation-2026/docs/runbooks/shop-errors.md)"})
d.next_line(3)
d.row("Est-ce que ça va ?")
d.panel("stat", "Trafic", [(f'sum(rate(http_requests_total{{{B}}}[$__rate_interval]))', "req/s")], 0, 6, 5,
        field={"unit": "reqps", "decimals": 1, "color": {"mode": "fixed", "fixedColor": "blue"}},
        options=dict(STAT, colorMode="background"),
        desc="Signal doré n°2 : combien de demandes. Jamais rouge : ni bon ni mauvais.")
d.panel("stat", "Erreurs", [(f'sum(rate(http_requests_total{{{B}, status=~"5.."}}[$__rate_interval])) / sum(rate(http_requests_total{{{B}}}[$__rate_interval]))', "erreurs")], 6, 6, 5,
        field={"unit": "percentunit", "decimals": 1, "min": 0, "color": {"mode": "thresholds"},
               "thresholds": thresholds(("green", None), ("orange", 0.01), ("red", 0.05))},
        options=STAT, desc="Signal doré n°3 : la part des réponses 5xx.")
d.panel("stat", "Latence p95", [(f'histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{{{B}}}[$__rate_interval])))', "p95")], 12, 6, 5,
        field={"unit": "s", "decimals": 2, "color": {"mode": "thresholds"},
               "thresholds": thresholds(("green", None), ("orange", 0.5), ("red", 1))},
        options=STAT, desc="Signal doré n°1 : 95 % des requêtes sont plus rapides que cette durée.")
d.panel("stat", "Saturation (CPU machine)", [('100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle"}[$__rate_interval])))', "CPU")], 18, 6, 5,
        field={"unit": "percent", "decimals": 0, "min": 0, "max": 100, "color": {"mode": "thresholds"},
               "thresholds": thresholds(("green", None), ("orange", 70), ("red", 90))},
        options=STAT, desc="Signal doré n°4 : à quel point on est plein. Le seul qui prévient.")
d.next_line(5)
d.row("Les signaux dans le temps")
d.panel("timeseries", "Trafic par route", [(f'sum by (route) (rate(http_requests_total{{{B}}}[$__rate_interval]))', "{{route}}")], 0, 12, 8,
        field={"unit": "reqps", "custom": {"stacking": {"mode": "normal"}, "fillOpacity": 30, "lineWidth": 1}},
        options=LEGEND_TABLE)
d.panel("timeseries", "Taux d'erreur (5xx)", [(f'sum(rate(http_requests_total{{{B}, status=~"5.."}}[$__rate_interval])) / sum(rate(http_requests_total{{{B}}}[$__rate_interval]))', "erreurs")], 12, 12, 8,
        field={"unit": "percentunit", "min": 0, "color": {"mode": "fixed", "fixedColor": "red"},
               "custom": {"fillOpacity": 20, "thresholdsStyle": {"mode": "line+area"}},
               "thresholds": thresholds(("transparent", None), ("red", 0.05))},
        options={"legend": {"showLegend": False}, "tooltip": {"mode": "single"}})
d.next_line(8)
lat = lambda q: (f'histogram_quantile({q}, sum by (le) (rate(http_request_duration_seconds_bucket{{{B}}}[$__rate_interval])))', "p" + str(int(float(q) * 100)))
d.panel("timeseries", "Latence p50 / p95 / p99", [lat("0.50"), lat("0.95"), lat("0.99")], 0, 9, 8,
        field={"unit": "s", "custom": {"fillOpacity": 10, "thresholdsStyle": {"mode": "dashed"}},
               "thresholds": thresholds(("transparent", None), ("red", 1))},
        options={"legend": {"displayMode": "list", "placement": "bottom"}, "tooltip": {"mode": "multi"}})
d.panel("heatmap", "Distribution des latences", [(f'sum by (le) (rate(http_request_duration_seconds_bucket{{{B}}}[$__rate_interval]))', "{{le}}")], 9, 9, 8,
        options={"calculate": False, "yAxis": {"unit": "s"}, "color": {"scheme": "Oranges", "mode": "scheme", "steps": 32},
                 "cellGap": 1, "legend": {"show": True}, "tooltip": {"mode": "single"}})
d.panel("timeseries", "Requêtes en cours", [(f'sum(http_requests_in_progress{{{B}}})', "en cours")], 18, 6, 8,
        field={"unit": "short", "decimals": 0, "custom": {"fillOpacity": 20}},
        options={"legend": {"showLegend": False}}, desc="Saturation propre à l'application.")
d.next_line(8)
d.row("Métier")
d.panel("stat", "Chiffre d'affaires / heure", [(f'sum(rate(shop_revenue_euros_total{{{B}}}[$__rate_interval])) * 3600', "€/h")], 0, 6, 7,
        field={"unit": "currencyEUR", "decimals": 0, "color": {"mode": "fixed", "fixedColor": "green"}},
        options=dict(STAT, colorMode="value"))
d.panel("piechart", "Moyens de paiement", [(f'sum by (payment_method) (increase(shop_orders_total{{{B}}}[$__range]))', "{{payment_method}}", True)], 6, 8, 7,
        field={"unit": "short", "decimals": 0},
        options={"reduceOptions": {"calcs": ["lastNotNull"]}, "pieType": "donut",
                 "legend": {"displayMode": "table", "placement": "right", "values": ["value", "percent"]}, "displayLabels": []})
d.panel("bargauge", "Stock par produit", [(f'avg by (product) (shop_stock_units{{{B}}})', "{{product}}", True)], 14, 10, 7,
        field={"unit": "short", "decimals": 0, "min": 0, "max": 120,
               "thresholds": thresholds(("red", None), ("orange", 20), ("green", 40))},
        options={"reduceOptions": {"calcs": ["lastNotNull"]}, "orientation": "horizontal", "displayMode": "lcd", "showUnfilled": True})
d.next_line(7)

chaos = {"name": "Chaos", "datasource": DS, "enable": True, "iconColor": "red",
         "expr": 'changes(shop_chaos_mode{instance=~"$instance"}[1m]) > 0', "step": "15s",
         "titleFormat": "Chaos {{mode}}", "textFormat": "Changement du mode {{mode}} sur {{instance}}", "useValueForTime": False}
boutique = base("j3-boutique-signaux-dores", "Boutique - Signaux dorés",
                "Corrigé du TP A (jour 3) : la boutique en quatre signaux dorés.", d.panels,
                'label_values(http_requests_total{job="shop-api"}, instance)', [chaos])

# ---------------------------------------------------------------------------
# TP B — Le serveur en méthode USE
d = Dash()
d.row("CPU")
d.panel("gauge", "CPU · Utilisation", [(f'100 * (1 - avg(rate(node_cpu_seconds_total{{mode="idle", {N}}}[$__rate_interval])))', "CPU")], 0, 6, 7,
        field={"unit": "percent", "min": 0, "max": 100, "thresholds": thresholds(("green", None), ("orange", 70), ("red", 90))},
        options={"reduceOptions": {"calcs": ["lastNotNull"]}, "showThresholdMarkers": True})
d.panel("stat", "CPU · Saturation (charge / cœur)", [(f'node_load1{{{N}}} / on (instance) count by (instance) (node_cpu_seconds_total{{mode="idle", {N}}})', "charge / cœur")], 6, 6, 7,
        field={"unit": "short", "decimals": 2, "color": {"mode": "thresholds"},
               "thresholds": thresholds(("green", None), ("orange", 1), ("red", 2))},
        options=STAT, desc="1 = tous les cœurs occupés ; au-delà, du travail attend.")
d.panel("timeseries", "CPU · Saturation (pression PSI)", [(f'rate(node_pressure_cpu_waiting_seconds_total{{{N}}}[$__rate_interval])', "attente CPU")], 12, 12, 7,
        field={"unit": "percentunit", "min": 0, "custom": {"fillOpacity": 20}},
        options={"legend": {"showLegend": False}}, desc="Part du temps où des tâches attendent le CPU.")
d.next_line(7)
d.row("Mémoire")
d.panel("gauge", "Mémoire · Utilisation", [(f'100 * (1 - node_memory_MemAvailable_bytes{{{N}}} / node_memory_MemTotal_bytes{{{N}}})', "mémoire")], 0, 6, 7,
        field={"unit": "percent", "min": 0, "max": 100, "thresholds": thresholds(("green", None), ("orange", 80), ("red", 90))},
        options={"reduceOptions": {"calcs": ["lastNotNull"]}, "showThresholdMarkers": True},
        desc="MemAvailable et pas MemFree : le cache disque est rendu à la demande.")
d.panel("timeseries", "Mémoire · Saturation (défauts de page majeurs)", [(f'rate(node_vmstat_pgmajfault{{{N}}}[$__rate_interval])', "défauts / s")], 6, 18, 7,
        field={"unit": "short", "custom": {"fillOpacity": 20}}, options={"legend": {"showLegend": False}})
d.next_line(7)
d.row("Disque et réseau")
d.panel("bargauge", "Disque · Utilisation (espace)", [(f'100 * (1 - node_filesystem_avail_bytes{{fstype!~"tmpfs|overlay|squashfs", {N}}} / node_filesystem_size_bytes{{fstype!~"tmpfs|overlay|squashfs", {N}}})', "{{mountpoint}}", True)], 0, 8, 8,
        field={"unit": "percent", "min": 0, "max": 100, "thresholds": thresholds(("green", None), ("orange", 75), ("red", 90))},
        options={"reduceOptions": {"calcs": ["lastNotNull"]}, "orientation": "horizontal", "displayMode": "gradient", "showUnfilled": True})
d.panel("timeseries", "Disque · Saturation (temps d'occupation)", [(f'rate(node_disk_io_time_seconds_total{{{N}}}[$__rate_interval])', "{{device}}")], 8, 8, 8,
        field={"unit": "percentunit", "min": 0, "custom": {"fillOpacity": 10}}, options={"legend": {"displayMode": "list", "placement": "bottom"}})
d.panel("timeseries", "Réseau · Erreurs", [(f'rate(node_network_receive_errs_total{{device!="lo", {N}}}[$__rate_interval]) + rate(node_network_transmit_errs_total{{device!="lo", {N}}}[$__rate_interval])', "{{device}}")], 16, 8, 8,
        field={"unit": "short", "min": 0, "custom": {"fillOpacity": 10}}, options={"legend": {"displayMode": "list", "placement": "bottom"}})
d.next_line(8)
d.row("Disponibilité")
d.panel("state-timeline", "Cibles Prometheus", [("up", "{{job}} / {{instance}}")], 0, 24, 8,
        field={"custom": {"fillOpacity": 70, "lineWidth": 0},
               "mappings": [{"type": "value", "options": {"0": {"text": "DOWN", "color": "red"}, "1": {"text": "UP", "color": "green"}}}],
               "color": {"mode": "thresholds"}, "thresholds": thresholds(("red", None), ("green", 1))},
        options={"showValue": "never", "mergeValues": True, "rowHeight": 0.8, "legend": {"showLegend": False}})
d.next_line(8)
serveur = base("j3-serveur-use", "Serveur - USE",
               "Corrigé du TP B (jour 3) : la machine en méthode USE (utilisation, saturation, erreurs).", d.panels,
               "label_values(node_uname_info, instance)")

OUT.mkdir(parents=True, exist_ok=True)
for name, dash in (("boutique-signaux-dores.json", boutique), ("serveur-use.json", serveur)):
    (OUT / name).write_text(json.dumps(dash, indent=2, ensure_ascii=False) + "\n")
    print("écrit :", OUT / name)
