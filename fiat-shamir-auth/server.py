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
    data = request.json
    username, password = data['username'], data['password']
    db = load(DB_PLAIN)
    db[username] = password
    save(DB_PLAIN, db)
    return jsonify({'status': 'ok', 'warning': 'mot de passe stocké EN CLAIR'})

@app.route('/login/plain', methods=['POST'])
def login_plain():
    data = request.json
    username, password = data['username'], data['password']
    db = load(DB_PLAIN)
    if db.get(username) == password:
        return jsonify({'status': 'ok', 'message': 'authentification réussie'})
    return jsonify({'status': 'fail', 'message': 'identifiants incorrects'}), 401

# ── Auth ZKP ────────────────────────────────────────────────────
@app.route('/register/zkp', methods=['POST'])
def register_zkp():
    data = request.json
    username, v = data['username'], data['v']
    db = load(DB_ZKP)
    db[username] = v
    save(DB_ZKP, db)
    return jsonify({'status': 'ok', 'message': 'clé publique v enregistrée'})

@app.route('/zkp/commit', methods=['POST'])
def zkp_commit():
    data = request.json
    username, x = data['username'], data['x']
    b = fs.server_challenge()
    session['zkp_username'] = username
    session['zkp_x'] = x
    session['zkp_b'] = b
    return jsonify({'b': b})

@app.route('/zkp/verify', methods=['POST'])
def zkp_verify():
    data = request.json
    y = data['y']
    username = session.get('zkp_username')
    x = session.get('zkp_x')
    b = session.get('zkp_b')
    if username is None or x is None or b is None:
        return jsonify({'status': 'fail', 'message': 'session invalide'}), 400
    db = load(DB_ZKP)
    v = db.get(username)
    if v is None:
        return jsonify({'status': 'fail', 'message': 'utilisateur inconnu'}), 404
    if fs.server_verify(x, y, v, b):
        return jsonify({'status': 'ok'})
    return jsonify({'status': 'fail'}), 401

# ── Attaquant ───────────────────────────────────────────────────
@app.route('/attack/plain')
def attack_plain():
    return jsonify(load(DB_PLAIN))

@app.route('/attack/zkp')
def attack_zkp():
    return jsonify(load(DB_ZKP))

if __name__ == '__main__':
    app.run(port=5001, debug=True)
