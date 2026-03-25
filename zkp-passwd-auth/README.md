# ZKP Password-Free Authentication

A full-stack demonstrator of password-free authentication using an interactive zero-knowledge proof based on the **Schnorr protocol** over the **Ed25519** elliptic curve.

## Overview

Instead of transmitting a password, the client proves *knowledge* of the password through a 3-round cryptographic challenge-response protocol. The server never stores or sees the password — only a public key derived from it. Even a network eavesdropper cannot recover the password from the intercepted messages.

---

## Protocol: Schnorr Identification over Ed25519

### Cryptographic Background

The Schnorr protocol is an **interactive proof of knowledge** of a discrete logarithm. Given:

- A generator point `G` on the Ed25519 curve.
- A secret scalar `x` (derived from the password).
- A public key `P = x · G` (stored on the server).

The prover convinces the verifier that it knows `x` without revealing it.

### Ed25519 Curve Parameters

The protocol runs on the **Twisted Edwards** curve used by Ed25519:

```
Equation:  -x² + y² = 1 + d·x²·y²
Prime:     p = 2²⁵⁵ - 19
Order:     l = 2²⁵² + 27742317777372353535851937790883648493
Generator: G = (Gx, Gy)  (standard Ed25519 base point)
```

All scalar arithmetic is done modulo `l`. Point operations use the standard Twisted Edwards addition law.

### 3-Round Protocol

```
Client (Prover)                              Server (Verifier)
─────────────────────────────────────────────────────────────
Registration:
  x  = hash(password) mod l
  P  = x · G
  ────────── POST /register { username, P } ──────────────>
                                              stores { username → P }

Login:
  r  = random scalar
  R  = r · G
  ────────── POST /challenge { username, R } ─────────────>
                                              c = random scalar
                                              stores { username → (R, c) }
                                              expires in 30 seconds
             <──────────────────────────── { c } ──────────
  s  = (r + c · x) mod l
  ────────── POST /verify { username, s } ────────────────>
                                              checks: s·G == R + c·P
                                              deletes challenge (anti-replay)
             <──────────────────────── { token: JWT } ─────
```

### Why the Verification Holds

The verifier checks `s·G == R + c·P`:

```
s·G = (r + c·x)·G
    = r·G + c·(x·G)
    = R   + c·P      ✓
```

An attacker who does not know `x` cannot compute a valid `s` for an arbitrary challenge `c` without solving the discrete logarithm problem on Ed25519.

### Security Properties

| Property | Mechanism |
|----------|-----------|
| Password never transmitted | Only `P = x·G` and `s = r + c·x` are sent |
| Eavesdropping safe | `s` and `R` reveal nothing about `x` without knowing `r` |
| Replay prevention | Challenge `c` is single-use and deleted immediately after verification |
| Brute-force resistance | Challenges expire after **30 seconds** |
| Forward secrecy | Ephemeral nonce `r` is discarded after each login |

---

## Architecture

```
zkp-passwd-auth/
├── src/
│   ├── shared/
│   │   └── ed25519.ts       # Ed25519 curve arithmetic (shared by server and client)
│   ├── server/
│   │   ├── index.ts         # Express server entry point (port 3000)
│   │   ├── db.ts            # In-memory user and challenge stores
│   │   └── routes/
│   │       └── auth.ts      # POST /register, /challenge, /verify endpoints
│   └── client/
│       └── index.html       # Self-contained browser client (no framework)
├── .env                     # JWT_SECRET and PORT
├── package.json
└── tsconfig.json
```

### Key Files

| File | Role |
|------|------|
| `src/shared/ed25519.ts` | Implements `pointAdd`, `scalarMul`, `passwordToScalar`, `randomScalar` |
| `src/server/routes/auth.ts` | Implements the 3 API endpoints and Schnorr verification logic |
| `src/server/db.ts` | In-memory `Map` stores for users (`username → P`) and challenges (`username → {R, c, expiry}`) |
| `src/client/index.html` | Browser UI with embedded Ed25519 implementation, step-by-step logging, and network monitor |

### API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/register` | `{ username, P: [x, y] }` | `{ ok: true }` |
| `POST` | `/challenge` | `{ username, R: [x, y] }` | `{ c: "<hex>" }` |
| `POST` | `/verify` | `{ username, s: "<hex>" }` | `{ token: "<JWT>" }` |

Points (`P`, `R`) are serialized as `[BigInt, BigInt]` arrays. Scalars (`c`, `s`) are serialized as hexadecimal strings.

---

## User Interface

The browser client (`src/client/index.html`) provides a visual demonstration split into three panels:

- **Client panel** — username/password form with **Register** and **Login** buttons. Shows a real-time log of all cryptographic operations (nonce generation, scalar multiplication, proof computation).
- **Server panel** — shows the server-side log (challenge generation, verification computation).
- **Network monitor** — displays each HTTP message exchanged between client and server in chronological order, with the full JSON payload.

This makes the internal protocol steps visible and educational.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
cd zkp-passwd-auth
npm install
```

### Environment Variables

The `.env` file at the root of the directory contains:

```env
JWT_SECRET=<your_secret_key>
PORT=3000
```

A default `.env` is already present. Change `JWT_SECRET` before deploying to any non-local environment.

### Run in Development Mode

```bash
npm run dev
```

The server starts with auto-reload (nodemon) at `http://localhost:3000`. Open that URL in your browser to access the interactive client.

### Run in Production Mode

```bash
npm start
```

---

## Demo Walkthrough

1. Open `http://localhost:3000` in your browser.
2. **Register** — enter a username and password, then click **Register**.
   - The client derives `x = hash(password) mod l` and computes `P = x · G`.
   - Only `P` is sent to the server.
3. **Login** — enter the same credentials and click **Login**.
   - The client generates an ephemeral nonce `r` and sends `R = r · G`.
   - The server responds with a random challenge `c`.
   - The client computes `s = (r + c · x) mod l` and sends it.
   - The server verifies `s·G == R + c·P` and returns a JWT on success.
4. Watch the **Network monitor** panel to see every message exchanged.
5. Watch the **Client** and **Server** logs to see each cryptographic step.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 5.x | HTTP server and routing |
| `cors` | 2.x | Cross-origin resource sharing |
| `jsonwebtoken` | 9.x | JWT generation after successful authentication |
| `dotenv` | 17.x | Load environment variables from `.env` |
| `tsx` | 4.x | Run TypeScript directly without a build step |
| `nodemon` | 3.x | Auto-restart server on file changes |
| `typescript` | 6.x | Type checking |

---

## Limitations

- **In-memory storage only** — all users and challenges are lost when the server restarts. There is no persistent database.
- **No HTTPS** — the demonstrator runs over plain HTTP on localhost. In production, always use TLS.
- **Single server instance** — the challenge store is not distributed; this does not scale horizontally without a shared cache (e.g., Redis).
