import { useState } from 'react'
import { generateAgeProof } from '../zkp/prover'
import StepIndicator from '../components/StepIndicator'
import IdentityCard from '../components/IdentityCard'
import ProofQRCode from '../components/ProofQRCode'

const STEPS = ['Date de naissance', 'Calcul ZKP', 'Preuve prête']

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--border2)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--white)',
  fontSize: 15,
  fontFamily: 'inherit',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function UserView() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ day: '', month: '', year: '' })
  const [proof, setProof] = useState(null)
  const [publicSignals, setPublicSignals] = useState(null)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setError(null)

    const day   = parseInt(form.day)
    const month = parseInt(form.month)
    const year  = parseInt(form.year)

    if (!day || !month || !year || year < 1900 || year > new Date().getFullYear()) {
      setError('Veuillez entrer une date de naissance valide.')
      return
    }

    setStep(2)
    try {
      const result = await generateAgeProof(year, month, day)
      setProof(result.proof)
      setPublicSignals(result.publicSignals)
      setStep(3)
    } catch (err) {
      setError('Erreur : ' + err.message)
      setStep(1)
    }
  }

  function handleReset() {
    setStep(1)
    setForm({ day: '', month: '', year: '' })
    setProof(null)
    setPublicSignals(null)
    setError(null)
  }

  return (
    <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Générer une preuve d&apos;âge</h1>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
          Prouvez cryptographiquement que vous êtes majeur,<br />
          sans révéler votre date de naissance.
        </p>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {/* Card container */}
      <div style={{
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '28px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>

        {/* Step 1 — Form */}
        {step === 1 && (
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                Date de naissance
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { name: 'day',   placeholder: 'JJ',   max: 31, flex: 1 },
                  { name: 'month', placeholder: 'MM',   max: 12, flex: 1 },
                  { name: 'year',  placeholder: 'AAAA', max: new Date().getFullYear(), flex: 2 },
                ].map(({ name, placeholder, max, flex }) => (
                  <input
                    key={name}
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(name)}
                    onBlur={() => setFocused(null)}
                    min="1"
                    max={max}
                    placeholder={placeholder}
                    required
                    style={{
                      ...inputStyle,
                      flex,
                      borderColor: focused === name ? 'var(--purple2)' : 'var(--border2)',
                      boxShadow: focused === name ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--red-bg)',
                border: '1px solid rgba(248,81,73,0.3)',
                color: 'var(--red)',
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            {/* Info box */}
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--purple-bg)',
              border: '1px solid rgba(124,58,237,0.2)',
              fontSize: 12,
              color: 'rgba(168, 85, 247, 0.9)',
              lineHeight: 1.6,
            }}>
              🔒 Votre date de naissance reste <strong>privée</strong>. Le circuit ZKP ne divulgue que le résultat binaire majeur/mineur.
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                borderRadius: 9,
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => e.target.style.opacity = '0.9'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >
              Générer la preuve ZKP →
            </button>
          </form>
        )}

        {/* Step 2 — Loading */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '20px 0' }}>
            <div style={{
              width: 52, height: 52,
              border: '3px solid var(--border)',
              borderTop: '3px solid var(--purple2)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text2)', fontWeight: 500, marginBottom: 6 }}>
                Calcul de la preuve en cours…
              </p>
              <p style={{ color: 'var(--text)', fontSize: 12 }}>
                Le circuit Groth16 génère une preuve cryptographique.<br />Cela peut prendre quelques secondes.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Result */}
        {step === 3 && proof && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <IdentityCard />
            <ProofQRCode proof={proof} publicSignals={publicSignals} />
            <button
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                fontSize: 12,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              ← Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
