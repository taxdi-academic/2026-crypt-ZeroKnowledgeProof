# ZKP Age Proof

A browser-based zero-knowledge proof demonstrator that allows a user to prove they are 18 years old or older without revealing their actual date of birth.

## Overview

This demonstrator implements a **non-interactive zk-SNARK** (Zero-Knowledge Succinct Non-interactive Argument of Knowledge) using the **Groth16** proving system over the **BN128** elliptic curve. All cryptographic operations run entirely in the browser — no backend or server is required.

The prover (user) generates a proof from their birth date. The verifier can check that proof and learn only one bit of information: *"this person is at least 18 years old"*. The actual birth date never leaves the user's browser.

---

## Protocol: Groth16 (zk-SNARK)

### Cryptographic Background

Groth16 is a pairing-based zk-SNARK that works as follows:

1. **Circuit compilation** — the age check logic is expressed as an arithmetic circuit in [Circom](https://docs.circom.io/), then compiled to a Rank-1 Constraint System (R1CS).
2. **Trusted setup** — a structured reference string (SRS) is generated from a Powers of Tau ceremony (`powersOfTau28_hez_final_10.ptau`). This produces two keys:
   - `proving_key.zkey` — used by the prover to generate proofs.
   - `verification_key.json` — used by the verifier to check proofs.
3. **Proof generation** — given private inputs (birth date) and public inputs (current date), snarkjs computes a Groth16 proof `π = (A, B, C)` consisting of three elliptic curve points.
4. **Verification** — the verifier checks the pairing equation `e(A, B) = e(α, β) · e(publicSignals, γ) · e(C, δ)` using the verification key.

### Circuit: `AgeCheck.circom`

```
Private inputs:  birthYear, birthMonth, birthDay
Public inputs:   currentYear, currentMonth, currentDay
Output signal:   isAdult  (1 = age ≥ 18, 0 = underage)
```

The circuit converts both dates to a total number of days and checks whether the difference is at least **6570 days** (≈ 18 × 365 days). It uses the `LessEqThan` comparator template from the circomlib standard library.

### Privacy Guarantee

- The birth date is a **private witness** — it is never included in the proof or public signals.
- The proof reveals only `publicSignals[0]` which is `1` (adult) or `0` (minor).
- The current date is a public input, preventing proof replay across different days.

---

## Architecture

```
zkp-age-proof/
├── circuits/
│   ├── AgeCheck.circom          # Arithmetic circuit (age check logic)
│   └── build/                   # Compiled circuit artifacts
│       ├── AgeCheck.wasm        # WebAssembly witness generator
│       ├── proving_key.zkey     # Groth16 proving key
│       └── verification_key.json
├── public/
│   └── circuits/                # Static assets served by Vite (same artifacts)
│       ├── AgeCheck.wasm
│       ├── proving_key.zkey
│       └── verification_key.json
└── src/
    ├── zkp/
    │   ├── prover.js            # generateAgeProof() — calls snarkjs groth16.fullProve()
    │   └── verifier.js          # verifyAgeProof()  — calls snarkjs groth16.verify()
    ├── views/
    │   ├── UserView.jsx         # Prover UI: birth date input → proof generation → QR code
    │   └── VerifierView.jsx     # Verifier UI: paste JSON proof → verification result
    └── components/
        ├── IdentityCard.jsx     # French ID card visual
        ├── ProofQRCode.jsx      # Encodes the proof as a QR code
        ├── ProofStatus.jsx      # Displays "OF AGE" / "UNDERAGE" result
        └── StepIndicator.jsx   # Progress bar (3 steps: input → generate → QR)
```

### Key Files

| File | Role |
|------|------|
| `src/zkp/prover.js` | Calls `groth16.fullProve(inputs, wasm, zkey)` and returns `{ proof, publicSignals }` |
| `src/zkp/verifier.js` | Fetches `verification_key.json`, calls `groth16.verify(vKey, publicSignals, proof)`, checks `publicSignals[0] === '1'` |
| `circuits/AgeCheck.circom` | Defines the R1CS constraint system for the age check |

---

## User Flow

### Prover (User)

1. Navigate to the **User** view.
2. Enter your date of birth in the form.
3. Click **Generate ZKP Proof** — the browser computes the proof (a few seconds).
4. A QR code is displayed containing the JSON-encoded proof and public signals.
5. Share the QR code (or copy the JSON) with the verifier.

### Verifier

1. Navigate to the **Verifier** view.
2. Paste the JSON proof received from the user.
3. Click **Verify** — the browser checks the proof cryptographically.
4. The result is displayed: **OF AGE** (green) or **UNDERAGE** (red).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
cd zkp-age-proof
npm install
```

### Run in Development Mode

```bash
npm run dev
```

The application starts at `http://localhost:5173` with hot-module replacement enabled.

### Build for Production

```bash
npm run build
```

The optimized output is placed in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.x | UI framework |
| `react-router-dom` | 7.x | Client-side routing (User / Verifier views) |
| `snarkjs` | 0.7.x | Groth16 proof generation and verification |
| `qrcode.react` | 4.x | QR code rendering for the proof payload |
| `tailwindcss` | 4.x | Utility-first CSS styling |
| `vite` | 8.x | Build tool and dev server |

---

## Notes on the Circuit Setup

The circuit artifacts (`AgeCheck.wasm`, `proving_key.zkey`, `verification_key.json`) are **pre-compiled** and committed to the repository. You do not need to recompile unless you modify `AgeCheck.circom`.

To recompile from scratch (requires `circom` and `snarkjs` CLI tools):

```bash
# Compile the circuit
circom circuits/AgeCheck.circom --r1cs --wasm --sym -o circuits/build

# Generate proving and verification keys (requires a ptau file)
snarkjs groth16 setup circuits/build/AgeCheck.r1cs circuits/powersOfTau28_hez_final_10.ptau circuits/build/circuit_0000.zkey
snarkjs zkey beacon circuits/build/circuit_0000.zkey circuits/build/proving_key.zkey ...
snarkjs zkey export verificationkey circuits/build/proving_key.zkey circuits/build/verification_key.json

# Copy artifacts to public/
cp circuits/build/AgeCheck_js/AgeCheck.wasm public/circuits/
cp circuits/build/proving_key.zkey public/circuits/
cp circuits/build/verification_key.json public/circuits/
```
