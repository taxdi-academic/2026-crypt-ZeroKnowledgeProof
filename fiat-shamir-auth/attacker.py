import requests

SERVER = 'http://localhost:5001'

def attack():
    print("\n" + "="*60)
    print("  SIMULATION ATTAQUE : vol de la base de données")
    print("="*60)

    # 1. Récupérer db_plain
    plain = requests.get(f'{SERVER}/attack/plain').json()
    print("\n[DB CLASSIQUE] Mots de passe récupérés :")
    for user, pwd in plain.items():
        print(f"  → {user} : {pwd}  ← MOT DE PASSE EN CLAIR")

    print("\n[ATTAQUANT] Je peux me connecter en tant que n'importe quel utilisateur.")

    # 2. Récupérer db_zkp
    zkp = requests.get(f'{SERVER}/attack/zkp').json()
    print("\n[DB ZKP] Données récupérées :")
    for user, v in zkp.items():
        print(f"  → {user} : v = {v}")

    print("\n[ATTAQUANT] Ces valeurs ne me servent à rien.")
    print("  Retrouver s depuis v = s² mod n nécessite de factoriser n.")
    print("  Avec des grands nombres : computationnellement impossible.")