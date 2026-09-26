# CORRIGÉ TP 2 partie 2 — apps/shop-api/app.py complet
"""
shop-api : l'application "fil rouge" de la formation.

Une petite boutique en ligne (catalogue, panier, paiement) instrumentée avec
prometheus_client. Elle sert de terrain de jeu pour les trois jours :
- Jour 1 : lire /metrics, comprendre les 4 types, ajouter une métrique métier
- Jour 2 : PromQL (rate, histogram_quantile, jointures) et dashboards
- Jour 3 : alertes, chaos, diagnostic

Les endpoints /chaos/* permettent au formateur de casser l'application à la demande.
"""

import os
import random
import threading
import time
import multiprocessing

from flask import Flask, Response, jsonify, request
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    Summary,
    generate_latest,
)

try:
    import redis
except ImportError:  # pragma: no cover
    redis = None

APP_VERSION = "1.4.2"
INSTANCE_NAME = os.environ.get("INSTANCE_NAME", "shop-api")
REDIS_URL = os.environ.get("REDIS_URL", "")

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Métriques techniques (RED : Rate, Errors, Duration)
# ---------------------------------------------------------------------------
HTTP_REQUESTS = Counter(
    "http_requests_total",
    "Nombre total de requêtes HTTP reçues",
    ["method", "route", "status"],
)
HTTP_DURATION = Histogram(
    "http_request_duration_seconds",
    "Durée de traitement des requêtes HTTP",
    ["route"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10),
)
HTTP_IN_PROGRESS = Gauge(
    "http_requests_in_progress",
    "Requêtes HTTP en cours de traitement",
)

# ---------------------------------------------------------------------------
# Métriques métier (ce que le directeur commercial veut voir)
# ---------------------------------------------------------------------------
ORDERS = Counter(
    "shop_orders_total",
    "Commandes validées",
    ["payment_method"],
)
REVENUE = Counter(
    "shop_revenue_euros_total",
    "Chiffre d'affaires cumulé en euros",
)
CART_ITEMS = Gauge(
    "shop_cart_items",
    "Articles actuellement dans les paniers (toutes sessions)",
)
STOCK = Gauge(
    "shop_stock_units",
    "Unités en stock par produit",
    ["product"],
)
PAYMENT_LATENCY = Summary(
    "shop_payment_duration_seconds",
    "Durée d'appel au prestataire de paiement (Summary : quantiles côté client)",
)
APP_INFO = Gauge(
    "shop_app_info",
    "Informations de version (valeur toujours 1, l'info est dans les labels)",
    ["version", "instance_name"],
)
APP_INFO.labels(version=APP_VERSION, instance_name=INSTANCE_NAME).set(1)

PRODUCT_VIEWS = Counter(
    "shop_product_views_total",
    "Consultations de fiche produit",
    ["product"],
)

CHAOS_MODE = Gauge(
    "shop_chaos_mode",
    "1 si le mode chaos indiqué est actif",
    ["mode"],
)

# ---------------------------------------------------------------------------
# État interne
# ---------------------------------------------------------------------------
PRODUCTS = {
    "clavier": 49.0,
    "souris": 25.0,
    "ecran": 219.0,
    "casque": 89.0,
    "webcam": 59.0,
    "dock-usb-c": 129.0,
}
stock = {name: random.randint(40, 120) for name in PRODUCTS}   # l'état "réel" du stock
for name, units in stock.items():
    STOCK.labels(product=name).set(units)

chaos = {"latency": False, "errors": False, "leak": False}
for mode in chaos:
    CHAOS_MODE.labels(mode=mode).set(0)
leak_bucket = []  # utilisé par le mode "leak" pour faire grimper la mémoire

r = None
if REDIS_URL and redis is not None:
    try:
        r = redis.Redis.from_url(REDIS_URL, socket_timeout=0.2)
        r.ping()
    except Exception:  # noqa: BLE001
        r = None


def redis_incr(key):
    if r is None:
        return
    try:
        r.incr(key)
    except Exception:  # noqa: BLE001
        pass


# ---------------------------------------------------------------------------
# Middleware : mesure de chaque requête
# ---------------------------------------------------------------------------
@app.before_request
def _start_timer():
    request._start = time.perf_counter()
    HTTP_IN_PROGRESS.inc()


@app.after_request
def _observe(response):
    HTTP_IN_PROGRESS.dec()
    route = request.url_rule.rule if request.url_rule else "unmatched"
    elapsed = time.perf_counter() - getattr(request, "_start", time.perf_counter())
    HTTP_DURATION.labels(route=route).observe(elapsed)
    HTTP_REQUESTS.labels(
        method=request.method, route=route, status=str(response.status_code)
    ).inc()
    return response


def simulate_work(base_ms, jitter_ms):
    """Simule un temps de traitement. Le mode chaos "latency" multiplie tout par 10."""
    delay = (base_ms + random.uniform(0, jitter_ms)) / 1000
    if chaos["latency"]:
        delay *= 10
    time.sleep(delay)


def maybe_fail(probability):
    """Retourne True si la requête doit échouer. Le mode chaos "errors" force 40 % d'erreurs."""
    if chaos["errors"]:
        return random.random() < 0.40
    return random.random() < probability


def chaos_gate():
    """En mode chaos "errors", 40 % des appels API échouent (la base de données est "tombée")."""
    if chaos["errors"] and random.random() < 0.40:
        time.sleep(random.uniform(0.05, 0.3))
        return jsonify(error="connexion à la base de données perdue"), 500
    return None


# ---------------------------------------------------------------------------
# Routes métier
# ---------------------------------------------------------------------------
@app.route("/")
def home():
    return jsonify(
        service="shop-api",
        instance=INSTANCE_NAME,
        version=APP_VERSION,
        endpoints=["/api/products", "/api/products/<name>", "/api/cart", "/api/checkout", "/metrics", "/chaos/status"],
    )


@app.route("/health")
def health():
    return jsonify(status="ok", instance=INSTANCE_NAME)


@app.route("/api/products")
def products():
    simulate_work(5, 20)
    failed = chaos_gate()
    if failed:
        return failed
    redis_incr("shop:catalog_views")
    return jsonify(products=PRODUCTS)


@app.route("/api/products/<product>")
def product_detail(product):
    simulate_work(8, 30)
    failed = chaos_gate()
    if failed:
        return failed
    if product not in PRODUCTS:
        return jsonify(error="produit inconnu"), 404
    PRODUCT_VIEWS.labels(product=product).inc()
    redis_incr(f"shop:views:{product}")
    return jsonify(product=product, price=PRODUCTS[product], stock=stock[product])


@app.route("/api/cart", methods=["GET", "POST"])
def cart():
    simulate_work(15, 40)
    failed = chaos_gate()
    if failed:
        return failed
    if request.method == "POST":
        qty = random.randint(1, 3)
        CART_ITEMS.inc(qty)
        redis_incr("shop:cart_adds")
        return jsonify(added=qty), 201
    return jsonify(items=CART_ITEMS._value.get())


@app.route("/api/checkout", methods=["POST"])
def checkout():
    simulate_work(80, 120)
    failed = chaos_gate()
    if failed:
        return failed
    if maybe_fail(0.02):
        return jsonify(error="paiement refusé par la banque"), 502

    product = random.choice(list(PRODUCTS))
    method = random.choices(["card", "paypal", "transfer"], weights=[70, 25, 5])[0]
    with PAYMENT_LATENCY.time():
        simulate_work(40, 60)

    ORDERS.labels(payment_method=method).inc()
    REVENUE.inc(PRODUCTS[product])
    stock[product] -= 1
    STOCK.labels(product=product).set(stock[product])
    current = CART_ITEMS._value.get()
    if current > 0:
        CART_ITEMS.dec(min(current, random.randint(1, 3)))
    redis_incr("shop:orders")
    return jsonify(order="ok", product=product, payment_method=method), 201


@app.route("/api/search")
def search():
    # Piège pédagogique : ne JAMAIS mettre le terme recherché dans un label.
    # Chaque valeur différente créerait une nouvelle série (explosion de cardinalité).
    simulate_work(20, 50)
    q = request.args.get("q", "")
    found = [p for p in PRODUCTS if q.lower() in p]
    return jsonify(query=q, results=found)


# ---------------------------------------------------------------------------
# Chaos : le formateur casse l'application à la demande
# ---------------------------------------------------------------------------
def _burn_cpu(seconds):
    end = time.time() + seconds
    while time.time() < end:
        _ = sum(i * i for i in range(10_000))


@app.route("/chaos/status")
def chaos_status():
    return jsonify(chaos)


@app.route("/chaos/<mode>/<state>", methods=["GET", "POST"])
def chaos_toggle(mode, state):
    if mode not in chaos:
        return jsonify(error=f"mode inconnu, choix possibles : {list(chaos)}"), 400
    chaos[mode] = state == "on"
    CHAOS_MODE.labels(mode=mode).set(1 if chaos[mode] else 0)
    if mode == "leak" and not chaos[mode]:
        leak_bucket.clear()
    return jsonify(mode=mode, active=chaos[mode])


@app.route("/chaos/cpu", methods=["GET", "POST"])
def chaos_cpu():
    seconds = int(request.args.get("seconds", 60))
    workers = int(request.args.get("workers", max(1, multiprocessing.cpu_count())))
    for _ in range(workers):
        multiprocessing.Process(target=_burn_cpu, args=(seconds,), daemon=True).start()
    return jsonify(burning=True, seconds=seconds, workers=workers)


@app.route("/chaos/reset", methods=["GET", "POST"])
def chaos_reset():
    for mode in chaos:
        chaos[mode] = False
        CHAOS_MODE.labels(mode=mode).set(0)
    leak_bucket.clear()
    return jsonify(chaos)


def background_tasks():
    """Réassort du stock et fuite mémoire simulée."""
    while True:
        time.sleep(30)
        for name in PRODUCTS:
            if stock[name] < 20:
                stock[name] += random.randint(30, 60)
                STOCK.labels(product=name).set(stock[name])
        if chaos["leak"]:
            leak_bucket.append(bytearray(5 * 1024 * 1024))  # +5 Mo toutes les 30 s


# ---------------------------------------------------------------------------
# Exposition Prometheus
# ---------------------------------------------------------------------------
@app.route("/metrics")
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":
    threading.Thread(target=background_tasks, daemon=True).start()
    app.run(host="0.0.0.0", port=5000, threaded=True)
