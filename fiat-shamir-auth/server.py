from flask import Flask, request, jsonify, session
from crypto import FiatShamir
import json, os, random

app = Flask(__name__)
app.secret_key = 'demo-secret'

fs = FiatShamir()

DB_PLAIN = 'data/db_plain.json'
DB_ZKP   = 'data/db_zkp.json'

def load(path):
    if not os.path.exists(path): return {}
    with open(path) as f: return json.load(f)

def save(path, data):
    with open(path, 'w') as f: json.dump(data, f, indent=2)

# ── Auth classique ──────────────────────────────────────────────
@app.route('/register/plain', methods=['POST'])
def register_plain():
    # Lire username + password dans request.json
    # Stocker dans db_plain.json EN CLAIR
    # Retourner confirmation + warning

@app.route('/login/plain', methods=['POST'])
def login_plain():
    # Lire username + password
    # Comparer avec db_plain.json
    # Retourner succès ou échec

# ── Auth ZKP ────────────────────────────────────────────────────
@app.route('/register/zkp', methods=['POST'])
def register_zkp():
    # Lire username + v (= s² mod n, calculé côté client)
    # Stocker v dans db_zkp.json
    # Retourner confirmation

@app.route('/zkp/commit', methods=['POST'])
def zkp_commit():
    # Lire username + x (engagement du client)
    # Générer b = bit aléatoire (défi)
    # Stocker x, b, username en session
    # Retourner b

@app.route('/zkp/verify', methods=['POST'])
def zkp_verify():
    # Lire y (réponse du client)
    # Récupérer x, b, username depuis session
    # Récupérer v depuis db_zkp.json
    # Appeler fs.server_verify(x, y, v, b)
    # Retourner succès ou échec

# ── Attaquant ───────────────────────────────────────────────────
@app.route('/attack/plain')
def attack_plain():
    # Retourner le contenu brut de db_plain.json

@app.route('/attack/zkp')
def attack_zkp():
    # Retourner le contenu brut de db_zkp.json

if __name__ == '__main__':
    app.run(port=5001, debug=True)