import { groth16 } from 'snarkjs'

export async function generateAgeProof(birthYear, birthMonth, birthDay) {
  const now = new Date()
  const input = {
    birthYear:    birthYear.toString(),
    birthMonth:   birthMonth.toString(),
    birthDay:     birthDay.toString(),
    currentYear:  now.getFullYear().toString(),
    currentMonth: (now.getMonth() + 1).toString(),
    currentDay:   now.getDate().toString(),
  }

  const { proof, publicSignals } = await groth16.fullProve(
    input,
    '/circuits/AgeCheck.wasm',
    '/circuits/proving_key.zkey'
  )

  return { proof, publicSignals }
}