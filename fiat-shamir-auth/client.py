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
        print(f"[CLIENT → SERVEUR]  POST /register/plain")
        print(f"  username : {self.username}")
        print(f"  password : {self.password}   ← envoi du mot de passe sur le réseau : {self.password}")
        r = requests.post(f'{SERVER}/register/plain', json={
            'username': self.username,
            'password': self.password
        })
        print(f"[SERVEUR]  {r.json()}")

    def login_plain(self):
        print(f"[CLIENT → SERVEUR]  POST /login/plain")
        print(f"  password : {self.password}   ← encore envoyé en clair")
        r = requests.post(f'{SERVER}/login/plain', json={
            'username': self.username,
            'password': self.password
        })
        print(f"[SERVEUR]  {r.json()}")

    # ── Auth ZKP ───────────────────────────────────────────────
    def register_zkp(self):
        v = fs.register(self.secret)
        print(f"[CLIENT → SERVEUR]  POST /register/zkp")
        print(f"  v envoyé : {v} — secret gardé localement")
        r = requests.post(f'{SERVER}/register/zkp', json={
            'username': self.username,
            'v': v
        })
        print(f"[SERVEUR]  {r.json()}")

    def login_zkp(self):
        session = requests.Session()
        for i in range(1, K_ROUNDS + 1):
            # 1. Générer r, x = r² mod n
            r, x = fs.client_commit()

            # 2. POST /zkp/commit → recevoir b
            resp = session.post(f'{SERVER}/zkp/commit', json={
                'username': self.username,
                'x': x
            })
            b = resp.json()['b']
            print(f"[CLIENT → SERVEUR]  Round {i}/{K_ROUNDS}")
            print(f"  engagement x = {x}")
            print(f"  défi       b = {b}")

            # 3. Calculer y = r · s^b mod n
            y = fs.client_respond(r, self.secret, b)
            print(f"  réponse    y = {y}")

            # 4. POST /zkp/verify avec y → recevoir résultat
            resp = session.post(f'{SERVER}/zkp/verify', json={'y': y})
            result = resp.json()
            if result['status'] != 'ok':
                print(f"[SERVEUR]  Round {i} : ÉCHEC ✗")
                print("[CLIENT]  Authentification ZKP échouée")
                return False
            print(f"[SERVEUR]  Round {i} : y² ≡ x·v^b (mod n) → ✓")

        print(f"[SERVEUR]  Connexion réussie ✓ — secret jamais reçu")
        return True
