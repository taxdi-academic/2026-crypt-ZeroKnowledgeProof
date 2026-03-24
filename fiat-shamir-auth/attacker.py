import requests

SERVER = 'http://localhost:5001'

# ── ANSI colors ────────────────────────────────────────────────
RED    = '\033[91m'
GREEN  = '\033[92m'
YELLOW = '\033[93m'
BOLD   = '\033[1m'
RESET  = '\033[0m'


def attack():
    print(f"\n{RED}{'='*60}{RESET}")
    print(f"{RED}{BOLD}  ATTACK SIMULATION: database theft{RESET}")
    print(f"{RED}{'='*60}{RESET}")

    # 1. Classic database
    plain = requests.get(f'{SERVER}/attack/plain').json()
    print(f"\n{RED}[CLASSIC DB]{RESET} Recovered passwords:")
    for user, pwd in plain.items():
        print(f"  {YELLOW}→{RESET} {user} : {RED}{BOLD}{pwd}{RESET}  {RED}← PASSWORD IN PLAINTEXT ⚠{RESET}")

    print(f"\n{RED}[ATTACKER]{RESET}  I can log in as any user.")

    # 2. ZKP database
    zkp = requests.get(f'{SERVER}/attack/zkp').json()
    print(f"\n{GREEN}[ZKP DB]{RESET} Recovered data:")
    for user, v in zkp.items():
        print(f"  {YELLOW}→{RESET} {user} : v = {v}")

    print(f"\n{GREEN}[ATTACKER]{RESET}  These values are useless to me.")
    print(f"  Recovering s from v = s² mod n requires factoring n.")
    print(f"  With large numbers: {GREEN}computationally infeasible.{RESET}")
