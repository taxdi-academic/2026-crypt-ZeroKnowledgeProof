import requests
from crypto import FiatShamir, K_ROUNDS

SERVER = 'http://localhost:5001'
fs = FiatShamir()

class Client:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.secret   = int.from_bytes(password.encode(), 'big') % fs.n

    # ── Auth classique ─────────────────────────────────────────
    def register_plain(self):
        # POST /register/plain avec username + password EN CLAIR
        # Logger "envoi du mot de passe sur le réseau : {password}"

    def login_plain(self):
        # POST /login/plain avec username + password EN CLAIR
        # Logger la réponse

    # ── Auth ZKP ───────────────────────────────────────────────
    def register_zkp(self):
        # Calculer v = s² mod n
        # POST /register/zkp avec username + v
        # Logger "v envoyé : {v} — secret gardé localement"

    def login_zkp(self):
        # Répéter K_ROUNDS fois :
        #   1. Générer r, x = r² mod n
        #   2. POST /zkp/commit  →  recevoir b
        #   3. Calculer y = r · s^b mod n
        #   4. POST /zkp/verify avec y  →  recevoir résultat
        # Succès si tous les rounds passent