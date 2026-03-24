import time
import requests
from crypto import FiatShamir, K_ROUNDS

SERVER = 'http://localhost:5001'
fs = FiatShamir()

# ── ANSI colors ────────────────────────────────────────────────
RED    = '\033[91m'
GREEN  = '\033[92m'
YELLOW = '\033[93m'
CYAN   = '\033[96m'
BOLD   = '\033[1m'
DIM    = '\033[2m'
RESET  = '\033[0m'


class Client:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.secret   = int.from_bytes(password.encode(), 'big') % fs.n

    # ── Classic authentication ─────────────────────────────────
    def register_plain(self):
        print(f"{CYAN}[CLIENT → SERVER]{RESET}  POST /register/plain")
        print(f"  username : {BOLD}{self.username}{RESET}")
        print(f"  password : {RED}{BOLD}{self.password}{RESET}  {RED}← sent in plaintext over the network ⚠{RESET}")

        requests.post(f'{SERVER}/register/plain', json={
            'username': self.username,
            'password': self.password
        })
        print(f"{GREEN}[SERVER]{RESET}  Registration OK — {RED}password stored IN PLAINTEXT{RESET} in db_plain.json\n")

    def login_plain(self):
        print(f"{CYAN}[CLIENT → SERVER]{RESET}  POST /login/plain")
        print(f"  password : {RED}{BOLD}{self.password}{RESET}  {RED}← sent in plaintext again{RESET}")

        r = requests.post(f'{SERVER}/login/plain', json={
            'username': self.username,
            'password': self.password
        })
        data = r.json()
        if data['status'] == 'ok':
            print(f"{GREEN}[SERVER]{RESET}  Login successful {GREEN}✓{RESET}\n")
        else:
            print(f"{RED}[SERVER]{RESET}  Login failed ✗\n")

    # ── ZKP authentication ─────────────────────────────────────
    def register_zkp(self):
        v = fs.register(self.secret)
        print(f"{CYAN}[CLIENT]{RESET}  secret s = {DIM}{str(self.secret)[:14]}…{RESET}  {GREEN}(never transmitted){RESET}")
        print(f"{CYAN}[CLIENT]{RESET}  computes v = s² mod n = {BOLD}{v}{RESET}\n")

        print(f"{CYAN}[CLIENT → SERVER]{RESET}  POST /register/zkp")
        print(f"  v = {BOLD}{v}{RESET}  {GREEN}← secret stays local{RESET}")

        requests.post(f'{SERVER}/register/zkp', json={
            'username': self.username,
            'v': v
        })
        print(f"{GREEN}[SERVER]{RESET}  Registration OK — public key v stored in db_zkp.json\n")

    def login_zkp(self):
        session = requests.Session()

        for i in range(1, K_ROUNDS + 1):
            # 1. Commitment: random r, x = r² mod n
            r, x = fs.client_commit()

            # 2. Challenge: send x, receive b
            resp = session.post(f'{SERVER}/zkp/commit', json={
                'username': self.username,
                'x': x
            })
            b = resp.json()['b']

            # 3. Response: y = r · s^b mod n
            y = fs.client_respond(r, self.secret, b)

            print(f"{CYAN}[CLIENT → SERVER]{RESET}  Round {BOLD}{i}/{K_ROUNDS}{RESET}")
            print(f"  commitment  x = {DIM}{x}{RESET}")
            print(f"  challenge   b = {YELLOW}{b}{RESET}")
            print(f"  response    y = {DIM}{y}{RESET}")

            # 4. Server verification
            resp = session.post(f'{SERVER}/zkp/verify', json={'y': y})
            result = resp.json()

            if result['status'] != 'ok':
                print(f"{RED}[SERVER]{RESET}  Round {i}: FAILED ✗")
                print(f"{RED}[CLIENT]{RESET}  ZKP authentication failed\n")
                return False

            print(f"{GREEN}[SERVER]{RESET}  Round {i}: y² ≡ x·v^b (mod n)  {GREEN}→ ✓{RESET}\n")
            time.sleep(0.4)

        print(f"{GREEN}[SERVER]{RESET}  {BOLD}Login successful — secret never received ✓{RESET}")
        return True
