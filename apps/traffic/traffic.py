"""
Générateur de trafic : simule des clients qui naviguent sur la boutique.

Sans lui, les graphiques resteraient désespérément plats. Le débit se règle
avec la variable d'environnement TRAFFIC_RPS (requêtes par seconde, toutes
instances confondues).
"""

import os
import random
import threading
import time
import urllib.request
import urllib.error

TARGETS = os.environ.get("TARGETS", "http://shop-api-1:5000,http://shop-api-2:5000").split(",")
RPS = float(os.environ.get("TRAFFIC_RPS", "6"))

# (méthode, chemin, poids)
SCENARIO = [
    ("GET", "/api/products", 40),
    ("GET", "/api/products/clavier", 10),
    ("GET", "/api/products/ecran", 8),
    ("GET", "/api/products/casque", 6),
    ("GET", "/api/products/inexistant", 1),
    ("GET", "/api/search?q=cla", 5),
    ("POST", "/api/cart", 12),
    ("GET", "/api/cart", 6),
    ("POST", "/api/checkout", 10),
    ("GET", "/health", 2),
]
WEIGHTS = [w for _, _, w in SCENARIO]


def one_request():
    base = random.choice(TARGETS)
    method, path, _ = random.choices(SCENARIO, weights=WEIGHTS)[0]
    req = urllib.request.Request(base + path, method=method)
    try:
        urllib.request.urlopen(req, timeout=15).read()
    except urllib.error.HTTPError:
        pass  # les 4xx/5xx sont attendus, elles alimentent les métriques d'erreur
    except Exception:  # noqa: BLE001
        pass


def worker():
    while True:
        one_request()


def main():
    print(f"traffic: {RPS} req/s vers {TARGETS}", flush=True)
    interval = 1.0 / RPS if RPS > 0 else 1
    while True:
        threading.Thread(target=one_request, daemon=True).start()
        # légère variation pour que les courbes ne soient pas trop régulières
        time.sleep(interval * random.uniform(0.5, 1.5))


if __name__ == "__main__":
    main()
