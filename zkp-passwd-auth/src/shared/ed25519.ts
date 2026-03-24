// src/shared/ed25519.ts
import { webcrypto as crypto } from 'crypto';

const PRIME = 2n ** 255n - 19n;
const ORDER = 2n ** 252n + 27742317777372353535851937790883648493n;
// Arithmétique modulaire
export function mod(a: bigint, n: bigint = PRIME): bigint {
  return ((a % n) + n) % n;
}

function modpow(base: bigint, exp: bigint, m: bigint): bigint {
  let result = 1n;
  base = mod(base, m);
  while (exp > 0n) {
    if (exp % 2n === 1n) result = mod(result * base, m);
    exp >>= 1n;
    base = mod(base * base, m);
  }
  return result;
}

function modinv(a: bigint): bigint {
  return modpow(mod(a), PRIME - 2n, PRIME);
}

// d = -121665 / 121666  mod p  (paramètre standard Ed25519)
const D = mod(-121665n * modpow(121666n, PRIME - 2n, PRIME));

// GY = 4/5 mod p  (coordonnée y du point de base Ed25519)
const GY = mod(4n * modpow(5n, PRIME - 2n, PRIME));

// GX : racine carrée de (GY²-1)/(1+D·GY²) mod p  (p ≡ 5 mod 8)
const _gy2 = mod(GY * GY);
const _x2  = mod(mod(_gy2 - 1n) * modinv(mod(1n + D * _gy2)));
const _xc  = modpow(_x2, (PRIME + 3n) / 8n, PRIME);   // candidat racine carrée
const GX   = mod(_xc * _xc) === _x2
             ? _xc
             : mod(_xc * modpow(2n, (PRIME - 1n) / 4n, PRIME));  // ×√-1 si nécessaire

export type  Point    = [bigint, bigint];
export const G: Point = [GX, GY];

// Addition de points sur la courbe tordue d'Edwards
export function pointAdd(P: Point | null, Q: Point | null): Point | null {
  if (!P) return Q;
  if (!Q) return P;
  const [x1, y1] = P;
  const [x2, y2] = Q;
  const dxy = mod(D * mod(x1 * x2) * mod(y1 * y2));
  const x3  = mod(mod(x1 * y2 + y1 * x2) * modinv(mod(1n + dxy)));
  const y3  = mod(mod(y1 * y2 + x1 * x2) * modinv(mod(1n - dxy)));
  return [x3, y3];
}

// Multiplication scalaire (double-and-add)
export function scalarMul(k: bigint, P: Point): Point {
  k = mod(k, ORDER);
  if (k === 0n) throw new Error('scalarMul: k must be non-zero');
  let R: Point | null = null;
  let Q: Point        = P;
  while (k > 0n) {
    if (k & 1n) R = pointAdd(R, Q);
    const QQ = pointAdd(Q, Q);
    if (QQ === null) throw new Error('scalarMul: unexpected identity point during doubling');
    Q  = QQ;
    k >>= 1n;
  }
  if (R === null) throw new Error('scalarMul: result is identity point');
  return R;
}

// Convertir un mot de passe en scalaire (côté client uniquement)
export function passwordToScalar(password: string): bigint {
  let h = 0n;
  for (let i = 0; i < password.length; i++) {
    h = (h * 1_000_003n + BigInt(password.charCodeAt(i))) % ORDER;
  }
  return h === 0n ? 1n : h;
}

// Vérifie que la loi de groupe est correcte au démarrage
export function selfTest(): void {
  // 1. G est sur la courbe : -GX² + GY² ≡ 1 + D·GX²·GY² (mod p)
  const gx2   = mod(G[0] * G[0]);
  const gy2   = mod(G[1] * G[1]);
  const lhs   = mod(gy2 - gx2);
  const dterm = mod(D * mod(gx2 * gy2));
  const rhs   = mod(1n + dterm);
  if (lhs !== rhs) throw new Error(`selfTest: G n'est pas sur la courbe\n  lhs=${lhs}\n  rhs=${rhs}`);

  // 2. Loi de groupe : 3·G + 5·G = 8·G
  const G3  = scalarMul(3n, G);
  const G5  = scalarMul(5n, G);
  const G8a = pointAdd(G3, G5)!;
  const G8b = scalarMul(8n, G);
  if (G8a[0] !== G8b[0] || G8a[1] !== G8b[1])
    throw new Error(`selfTest: loi de groupe violée\n  3G+5G=${G8a}\n  8G   =${G8b}`);

  console.log('selfTest OK — courbe et loi de groupe vérifiées');
}

// Générer un scalaire aléatoire (nonce r ou défi c)
export function randomScalar(): bigint {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let v = 0n;
  for (const b of bytes) v = (v << 8n) | BigInt(b);
  return mod(v, ORDER - 1n) + 1n;
}