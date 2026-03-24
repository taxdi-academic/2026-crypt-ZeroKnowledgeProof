// src/server/routes/auth.ts
import { Router }                                  from 'express';
import jwt                                         from 'jsonwebtoken';
import { G, mod, scalarMul, pointAdd, randomScalar } from '../../shared/ed25519.js';
import { users, challenges }                       from '../db.js';

const router = Router();

// ── POST /register ───────────────────────────────────────────────────────────
// Reçoit  : { username: string, P: [string, string] }
// Stocke  : P uniquement — jamais le mot de passe
router.post('/register', (req, res) => {
  const { username, P } = req.body as { username: string; P: [string, string] };
  if (!username || !P)     return res.status(400).json({ error: 'Champs manquants' });
  if (users.has(username)) return res.status(409).json({ error: 'Utilisateur existant' });

  // Reconvertir les strings en bigint (JSON ne supporte pas BigInt)
  users.set(username, { P: [BigInt(P[0]), BigInt(P[1])] });
  res.json({ ok: true });
});

// ── POST /challenge ──────────────────────────────────────────────────────────
// Reçoit  : { username: string, R: [string, string] }
// Renvoie : { c: string }
router.post('/challenge', (req, res) => {
  const { username, R } = req.body as { username: string; R: [string, string] };
  if (!users.has(username)) return res.status(404).json({ error: 'Utilisateur inconnu' });

  const c = randomScalar();
  challenges.set(username, {
    R: [BigInt(R[0]), BigInt(R[1])],
    c,
    expiresAt: Date.now() + 30_000,   // expire dans 30 secondes
  });
  res.json({ c: c.toString() });      // BigInt → string pour JSON
});

// ── POST /verify ─────────────────────────────────────────────────────────────
// Reçoit  : { username: string, s: string }
// Vérifie : s·G == R + c·P
// Renvoie : { token: string }
router.post('/verify', (req, res) => {
  const { username, s: sStr } = req.body as { username: string; s: string };
  const s = BigInt(sStr);

  const user      = users.get(username);
  const challenge = challenges.get(username);

  if (!user || !challenge) return res.status(400).json({ error: 'Challenge introuvable' });
  if (Date.now() > challenge.expiresAt) {
    challenges.delete(username);
    return res.status(401).json({ error: 'Challenge expiré' });
  }

  // Anti-replay : supprimer AVANT la vérification
  challenges.delete(username);

  const { R, c } = challenge;

  // Vérification : s·G == R + c·P
  const LHS = scalarMul(s, G);
  const RHS = pointAdd(R, scalarMul(c, user.P));

  const sh = (v: bigint) => v.toString().slice(0, 20);
  console.debug('[verify] s      =', sh(s));
  console.debug('[verify] c      =', sh(c));
  console.debug('[verify] R      =', sh(R[0]), sh(R[1]));
  console.debug('[verify] P      =', sh(user.P[0]), sh(user.P[1]));
  console.debug('[verify] LHS(sG)=', sh(LHS[0]), sh(LHS[1]));
  console.debug('[verify] RHS    =', RHS ? sh(RHS[0]) + ' ' + sh(RHS[1]) : 'null');
  console.debug('[verify] match  :', RHS && LHS[0] === RHS[0] && LHS[1] === RHS[1]);

  if (!RHS || LHS[0] !== RHS[0] || LHS[1] !== RHS[1]) {
    return res.status(401).json({ error: 'Preuve invalide' });
  }

  const jwtSecret = process.env['JWT_SECRET'];
  if (!jwtSecret) return res.status(500).json({ error: 'JWT_SECRET non configuré' });
  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
  res.json({ token });
});

export { router };