import random

# Fiat-Shamir parameters (DEMO only — not secure in production)
# In production: p and q must be 512+ bit prime numbers
P = 1000000007   # prime number
Q = 998244353    # prime number
N = P * Q        # n = p * q ≈ 10^18

# Number of rounds (higher k = stronger security)
K_ROUNDS = 5

class FiatShamir:
    def __init__(self, n=N):
        self.n = n

    def register(self, secret: int) -> int:
        """Registration: computes v = s² mod n"""
        return pow(secret, 2, self.n)

    def client_commit(self) -> tuple[int, int]:
        """Commitment: random r, x = r² mod n"""
        r = random.randint(2, self.n - 2)
        x = pow(r, 2, self.n)
        return r, x

    def server_challenge(self) -> int:
        """Challenge: random bit b ∈ {0, 1}"""
        return random.randint(0, 1)

    def client_respond(self, r: int, secret: int, b: int) -> int:
        """Response: y = r · s^b mod n"""
        return (r * pow(secret, b, self.n)) % self.n

    def server_verify(self, x: int, y: int, v: int, b: int) -> bool:
        """Verification: y² ≡ x · v^b (mod n)"""
        lhs = pow(y, 2, self.n)
        rhs = (x * pow(v, b, self.n)) % self.n
        return lhs == rhs
