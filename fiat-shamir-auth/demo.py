import sys
import os
import json
import time
import subprocess

from client import Client
from attacker import attack

# ── ANSI colors ────────────────────────────────────────────────
RED    = '\033[91m'
GREEN  = '\033[92m'
YELLOW = '\033[93m'
BLUE   = '\033[94m'
BOLD   = '\033[1m'
RESET  = '\033[0m'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PLAIN = os.path.join(BASE_DIR, 'data', 'db_plain.json')
DB_ZKP   = os.path.join(BASE_DIR, 'data', 'db_zkp.json')


def reset_databases():
    """Reset both databases to empty before the demo."""
    for path in (DB_PLAIN, DB_ZKP):
        with open(path, 'w') as f:
            json.dump({}, f)


def start_server():
    """Start the Flask server in the background."""
    subprocess.Popen(
        [sys.executable, 'server.py'],
        cwd=BASE_DIR
    )
    time.sleep(1.5)  # Wait for Flask to start


def separator(title, color=BLUE):
    print(f"\n{color}{BOLD}{'─'*60}{RESET}")
    print(f"{color}{BOLD}  {title}{RESET}")
    print(f"{color}{BOLD}{'─'*60}{RESET}\n")


def demo():
    reset_databases()
    start_server()

    alice = Client('alice', 'supersecret123')

    # ── SCENARIO 1: Classic authentication ────────────────────
    separator("SCENARIO 1 — Classic authentication (plaintext password)", RED)
    alice.register_plain()
    alice.login_plain()

    # ── SCENARIO 2: ZKP authentication ────────────────────────
    separator("SCENARIO 2 — ZKP authentication (Fiat-Shamir)", GREEN)
    alice.register_zkp()
    alice.login_zkp()

    # ── ATTACK ─────────────────────────────────────────────────
    separator("ATTACK — The attacker steals the database", RED)
    attack()

    print()


if __name__ == '__main__':
    demo()
