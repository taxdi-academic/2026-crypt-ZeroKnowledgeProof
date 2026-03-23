import subprocess, time, threading, requests
from client import Client
from attacker import attack

# Couleurs ANSI
RED    = '\033[91m'
GREEN  = '\033[92m'
YELLOW = '\033[93m'
BLUE   = '\033[94m'
BOLD   = '\033[1m'
RESET  = '\033[0m'

def start_server():
    """Lance le serveur Flask dans un thread séparé"""
    subprocess.Popen(['python', 'server.py'])
    time.sleep(1.5)  # Attendre que Flask démarre

def separator(title):
    print(f"\n{BOLD}{'─'*60}{RESET}")
    print(f"{BOLD}  {title}{RESET}")
    print(f"{BOLD}{'─'*60}{RESET}\n")

def demo():
    start_server()
    alice = Client('alice', 'monsupermdp123')

    # ── SCÉNARIO 1 : Authentification classique ────────────────
    separator("SCÉNARIO 1 — Authentification classique (mot de passe en clair)")
    alice.register_plain()
    alice.login_plain()

    # ── SCÉNARIO 2 : Authentification ZKP ─────────────────────
    separator("SCÉNARIO 2 — Authentification ZKP (Fiat-Shamir)")
    alice.register_zkp()
    alice.login_zkp()

    # ── ATTAQUE ────────────────────────────────────────────────
    separator("ATTAQUE — L'attaquant vole la base de données")
    attack()

if __name__ == '__main__':
    demo()