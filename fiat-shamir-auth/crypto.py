import random

# Paramètres Fiat-Shamir (DEMO uniquement — pas sécurisé en prod)
# En prod : p et q doivent être des nombres premiers de 512+ bits
P = 1000000007   # nombre premier
Q = 998244353    # nombre premier
N = P * Q        # n = p * q ≈ 10^18

# Nombre de rounds (plus k est grand, plus c'est sûr)
K_ROUNDS = 5

class FiatShamir:
    def __init__(self, n=N):
        self.n = n

    def register(self, secret: int) -> int:
        """Enregistrement : calcule v = s² mod n"""
        return pow(secret, 2, self.n)

    def client_commit(self) -> tuple[int, int]:
        """Engagement : r aléatoire, x = r² mod n"""
        r = random.randint(2, self.n - 2)
        x = pow(r, 2, self.n)
        return r, x

    def server_challenge(self) -> int:
        """Défi : bit aléatoire b ∈ {0, 1}"""
        return random.randint(0, 1)

    def client_respond(self, r: int, secret: int, b: int) -> int:
        """Réponse : y = r · s^b mod n"""
        return (r * pow(secret, b, self.n)) % self.n

    def server_verify(self, x: int, y: int, v: int, b: int) -> bool:
        """Vérification : y² ≡ x · v^b (mod n)"""
        lhs = pow(y, 2, self.n)
        rhs = (x * pow(v, b, self.n)) % self.n
        return lhs == rhs
    