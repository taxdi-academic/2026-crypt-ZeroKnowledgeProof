export default function StepIndicator({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
      {steps.map((label, i) => {
        const index = i + 1
        const isDone = index < current
        const isActive = index === current

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {/* Circle */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600,
                border: `2px solid ${isDone ? '#7c3aed' : isActive ? '#a855f7' : 'var(--border2)'}`,
                background: isDone
                  ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                  : isActive
                  ? 'rgba(168, 85, 247, 0.10)'
                  : 'transparent',
                color: isDone ? '#fff' : isActive ? '#a855f7' : 'var(--text)',
                transition: 'all 0.3s',
              }}>
                {isDone ? '✓' : index}
              </div>
              {/* Label */}
              <span style={{
                fontSize: 11,
                whiteSpace: 'nowrap',
                color: isActive ? '#a855f7' : isDone ? 'var(--text2)' : 'var(--text)',
                fontWeight: isActive ? 500 : 400,
              }}>
                {label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div style={{
                height: 2, width: 48,
                margin: '0 4px',
                marginBottom: 20,
                background: isDone
                  ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
                  : 'var(--border)',
                transition: 'background 0.3s',
                borderRadius: 2,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
