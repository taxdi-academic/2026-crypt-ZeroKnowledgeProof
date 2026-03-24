export default function IdentityCard() {
  return (
    <div style={{
      width: 340,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
      background: '#1a2235',
      fontFamily: 'inherit',
      position: 'relative',
    }}>
      {/* Decorative background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255,255,255,0.015) 10px,
          rgba(255,255,255,0.015) 11px
        )`,
        pointerEvents: 'none',
      }} />

      {/* Top band — French flag style */}
      <div style={{
        display: 'flex',
        height: 6,
      }}>
        <div style={{ flex: 1, background: '#002395' }} />
        <div style={{ flex: 1, background: '#fff' }} />
        <div style={{ flex: 1, background: '#ED2939' }} />
      </div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #002395 0%, #003cbf 100%)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            République Française
          </div>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Carte Nationale d&apos;Identité
          </div>
        </div>
        <div style={{ fontSize: 22 }}>🇫🇷</div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', display: 'flex', gap: 14 }}>
        {/* Photo */}
        <div style={{
          width: 72, height: 90, flexShrink: 0,
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#0d1117',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <span style={{ fontSize: 32, filter: 'blur(3px)', userSelect: 'none' }}>👤</span>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,15,25,0.4)',
            backdropFilter: 'blur(2px)',
          }} />
        </div>

        {/* Fields */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BlurredField label="NOM" />
          <BlurredField label="PRÉNOMS" width={100} />
          <BlurredField label="NÉ(E) LE" width={90} />

          {/* Majority — visible */}
          <div style={{ marginTop: 2 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: 3 }}>
              MAJORITÉ
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(63, 185, 80, 0.15)',
              border: '1px solid rgba(63, 185, 80, 0.4)',
              fontSize: 11, fontWeight: 600, color: '#3fb950',
            }}>
              <span>✓</span> Vérifiée par ZKP
            </div>
          </div>
        </div>
      </div>

      {/* MRZ-style band */}
      <div style={{
        background: '#0d1117',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.12em',
        lineHeight: 1.8,
        filter: 'blur(1px)',
        userSelect: 'none',
      }}>
        <div>IDFRA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
        <div>0000000000FRA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
      </div>

      {/* ZKP note */}
      <div style={{
        padding: '6px 16px 10px',
        fontSize: 9,
        color: 'rgba(168, 85, 247, 0.6)',
        textAlign: 'center',
        letterSpacing: '0.05em',
      }}>
        🔒 Données personnelles protégées · Preuve à divulgation nulle de connaissance
      </div>
    </div>
  )
}

function BlurredField({ label, width = 80 }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        height: 10, width,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.12)',
        filter: 'blur(3px)',
      }} />
    </div>
  )
}
