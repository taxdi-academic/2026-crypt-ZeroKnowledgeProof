import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

export default function ProofQRCode({ proof, publicSignals }) {
  const [copied, setCopied] = useState(false)
  const payload = JSON.stringify({ proof, publicSignals })

  function handleCopy() {
    navigator.clipboard.writeText(payload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* QR wrapper */}
      <div style={{
        padding: 16,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
      }}>
        <QRCodeSVG value={payload} size={180} level="M" />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text)', marginBottom: 12 }}>
          Show this QR code to the verifier — no personal data is included.
        </p>

        <button
          onClick={handleCopy}
          style={{
            padding: '7px 16px',
            borderRadius: 7,
            border: '1px solid var(--border2)',
            background: copied ? 'rgba(63, 185, 80, 0.1)' : 'var(--surface2)',
            color: copied ? 'var(--green)' : 'var(--text2)',
            fontSize: 12,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {copied ? '✓ Copied!' : '⎘ Copy proof JSON'}
        </button>
      </div>
    </div>
  )
}
