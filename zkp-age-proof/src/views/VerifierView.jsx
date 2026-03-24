import { useState } from 'react'
import { verifyAgeProof } from '../zkp/verifier'
import ProofStatus from '../components/ProofStatus'

export default function VerifierView() {
  const [input, setInput]   = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  async function handleVerify(e) {
    e.preventDefault()
    setError(null)
    setStatus(null)

    let parsed
    try {
      parsed = JSON.parse(input.trim())
    } catch {
      setError('JSON invalide. Collez la preuve copiée depuis la vue utilisateur.')
      return
    }

    if (!parsed.proof || !parsed.publicSignals) {
      setError('Format incorrect : les champs "proof" et "publicSignals" sont requis.')
      return
    }

    setLoading(true)
    try {
      const result = await verifyAgeProof(parsed.proof, parsed.publicSignals)
      setStatus(result)
    } catch (err) {
      setError('Erreur lors de la vérification : ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setInput('')
    setStatus(null)
    setError(null)
  }

  return (
    <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Terminal de vérification</h1>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
          Collez la preuve JSON fournie par l&apos;utilisateur pour vérifier<br />
          cryptographiquement sa majorité.
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        {/* Terminal header bar */}
        <div style={{
          background: 'var(--surface2)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#f85149','#f0b429','#3fb950'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{
            fontSize: 11, color: 'var(--text)',
            fontFamily: "'JetBrains Mono', monospace",
            marginLeft: 8,
          }}>
            zkp-verifier — Groth16/BN128
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              fontSize: 11, color: 'var(--text)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'block', marginBottom: 8,
            }}>
              Preuve ZKP (JSON)
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={8}
              placeholder={'{\n  "proof": { ... },\n  "publicSignals": [ ... ]\n}'}
              required
              style={{
                width: '100%',
                background: '#0d1117',
                border: '1px solid var(--border2)',
                borderRadius: 8,
                padding: '12px',
                color: '#8b949e',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
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

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: 9,
                border: 'none',
                background: loading || !input.trim()
                  ? 'rgba(124,58,237,0.3)'
                  : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: loading || !input.trim() ? 'rgba(255,255,255,0.4)' : '#fff',
                fontSize: 14, fontWeight: 600,
                fontFamily: 'inherit',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading || !input.trim() ? 'none' : '0 4px 15px rgba(124,58,237,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {loading && (
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
              )}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              {loading ? 'Vérification en cours…' : 'Vérifier la preuve'}
            </button>

            {status !== null && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '11px 16px',
                  borderRadius: 9,
                  border: '1px solid var(--border2)',
                  background: 'var(--surface2)',
                  color: 'var(--text2)',
                  fontSize: 13, fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Effacer
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Result */}
      {status !== null && (
        <div style={{ width: '100%', marginTop: 24 }}>
          <ProofStatus valid={status} />
        </div>
      )}
    </div>
  )
}
