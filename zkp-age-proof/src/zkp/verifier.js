import { groth16 } from 'snarkjs'

export async function verifyAgeProof(proof, publicSignals) {
  const response = await fetch('/circuits/verification_key.json')
  const verificationKey = await response.json()
  const isValid = await groth16.verify(verificationKey, publicSignals, proof)
  // publicSignals[0] est la sortie isAdult du circuit (1 = majeur, 0 = mineur)
  return isValid && publicSignals[0] === '1'
}