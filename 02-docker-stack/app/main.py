from flask import Flask, Response, request
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time
import random

app = Flask(__name__)

# --- METRICS DEFINITION ---
REQUEST_COUNT = Counter('app_requests_total', 'Total request count', ['method', 'endpoint', 'http_status'])
REQUEST_LATENCY = Histogram('app_request_latency_seconds', 'Request latency', ['endpoint'])

# --- CHAOS STATE (Pour le TP J3) ---
SYSTEM_BROKEN = False

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    request_latency = time.time() - request.start_time
    REQUEST_LATENCY.labels(endpoint=request.path).observe(request_latency)
    REQUEST_COUNT.labels(
        method=request.method, 
        endpoint=request.path, 
        http_status=response.status_code
    ).inc()
    return response

@app.route('/')
def hello():
    global SYSTEM_BROKEN
    if SYSTEM_BROKEN:
        # Simulation de panne : Latence + Erreur aléatoire
        time.sleep(random.uniform(0.5, 2.0))
        if random.random() < 0.8: # 80% de chance d'erreur
            return "Critical Error: Database Connection Failed", 500
    
    time.sleep(random.uniform(0.01, 0.1))
    return "Hello World! Everything is fine."

@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

# --- CHAOS SWITCH ---
@app.route('/toggle-chaos', methods=['POST'])
def toggle_chaos():
    global SYSTEM_BROKEN
    SYSTEM_BROKEN = not SYSTEM_BROKEN
    status = "BROKEN" if SYSTEM_BROKEN else "HEALTHY"
    print(f"!!! SYSTEM STATUS CHANGED TO: {status} !!!")
    return f"System status is now: {status}\n"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)