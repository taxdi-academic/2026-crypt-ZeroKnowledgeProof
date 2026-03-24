export default function ProofStatus({ valid }) {
  if (valid === null || valid === undefined) return null

  const color    = valid ? '#3fb950' : '#f85149'
  const bg       = valid ? 'rgba(63, 185, 80, 0.08)'  : 'rgba(248, 81, 73, 0.08)'
  const border   = valid ? 'rgba(63, 185, 80, 0.25)'  : 'rgba(248, 81, 73, 0.25)'
  const glow     = valid ? 'rgba(63, 185, 80, 0.15)'  : 'rgba(248, 81, 73, 0.15)'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '32px 40px',
      borderRadius: 16,
      background: bg,
      border: `1px solid ${border}`,
      boxShadow: `0 0 40px ${glow}`,
    }}>
      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: valid ? 'rgba(63, 185, 80, 0.15)' : 'rgba(248, 81, 73, 0.15)',
        border: `2px solid ${color}`,
        fontSize: 28, color,
      }}>
        {valid ? '✓' : '✗'}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 32, fontWeight: 700, color,
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}>
          {valid ? 'MAJEUR' : 'MINEUR'}
        </div>
        <div style={{
          fontSize: 13, color: valid ? 'rgba(63,185,80,0.8)' : 'rgba(248,81,73,0.8)',
        }}>
          {valid
            ? 'Preuve cryptographique valide — accès autorisé'
            : 'Preuve invalide ou personne mineure — accès refusé'}
        </div>
      </div>

      {/* Signature info */}
      <div style={{
        fontSize: 10,
        color: 'var(--text)',
        fontFamily: "'JetBrains Mono', monospace",
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '6px 12px',
        letterSpacing: '0.05em',
      }}>
        Groth16 · BN128 · {valid ? 'VALID' : 'INVALID'}
      </div>
    </div>
  )
}
