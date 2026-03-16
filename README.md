# 2026-crypt-ZeroKnowledgeProof

## What is Zero Knowledge Proof ?

A Zero-Knowledge Proof (ZKP) is a cryptographic protocol where a prover can convince a verifier that they know a secret (or that a statement is true) without revealing any information about the secret itself.

## Core properties

- **Completeness** : if the statment is true and both parties are honest, the verifier will be convinced.

- **Soundness** : a cheating prover cannot convinced the verifier of a false statement (exept with negligible probability).

- **Zero-knowledge** : the verifier learns nothing beyond the fact that the statement is true.

## Classic example : Sudoku



## Common ZKP systems

| System | Type | Notable use |
|--------|------|-------------|
| **Schnorr protocol** | Interactive | Identity proofs |
| **zk-SNARKs** | Non-interactive | Zcash, Ethereum L2s |
| **zk-STARKs** | Non-interactive | StarkNet, scalable proofs |
| **Bulletproofs** | Non-interactive | Confidential transactions |

## Real-world applications

- **Blockchain privacy** (Zcash, Tornado Cash)

- **Authentication** without password transmission

- **Age/identity verification** without revealing personal data

- **Rollups** (zkEVM) for blockchain scalability

---
---

In this project, we will be implementing two proof-of-concept demonstrations. The first one will emulate an **age/identity verification** and the second one will be the **password-free authentication**.

