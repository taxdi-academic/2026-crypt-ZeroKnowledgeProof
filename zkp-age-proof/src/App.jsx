import { useState } from 'react'
import UserView from './views/UserView'
import VerifierView from './views/VerifierView'

export default function App() {
  const [activeTab, setActiveTab] = useState('user')

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px',
          }}>ZK</div>
          <span style={{ fontWeight: 600, color: 'var(--white)', fontSize: 15 }}>
            ZeroProof<span style={{ color: 'var(--purple2)', fontWeight: 400 }}> · age</span>
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}>
          {[['user', '👤 User'], ['verifier', '🔍 Verifier']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                padding: '5px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                background: activeTab === id
                  ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                  : 'transparent',
                color: activeTab === id ? '#fff' : 'var(--text)',
                boxShadow: activeTab === id
                  ? '0 1px 4px rgba(124,58,237,0.4)'
                  : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Badge */}
        <div style={{
          fontSize: 11,
          color: 'var(--text)',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '3px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          Groth16 · snarkjs
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        {activeTab === 'user' ? <UserView /> : <VerifierView />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        fontSize: 11,
        color: 'var(--text)',
      }}>
        <span>Zero-Knowledge Proof</span>
        <span style={{ color: 'var(--border2)' }}>·</span>
        <span>No personal data transmitted</span>
        <span style={{ color: 'var(--border2)' }}>·</span>
        <span>Circom 2.0 circuit</span>
      </footer>
    </div>
  )
}
