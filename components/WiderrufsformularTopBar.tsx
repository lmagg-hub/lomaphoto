'use client'

import Link from 'next/link'

export default function WiderrufsformularTopBar() {
  return (
    <>
      {/* Print-specific styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .form-box { border-color: #999 !important; }
          .field-line { border-color: #bbb !important; }
        }
        @media screen {
          body { background: #1a1a1a; }
        }
      `}</style>

      <div
        className="no-print"
        style={{
          background: '#0a0a0a',
          borderBottom: '1px solid #252525',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/widerrufsbelehrung"
          style={{
            color: '#808080',
            fontFamily: 'sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Zur Widerrufsbelehrung
        </Link>

        <button
          onClick={() => window.print()}
          style={{
            background: 'none',
            border: '1px solid #c9a96e',
            color: '#c9a96e',
            padding: '8px 20px',
            fontFamily: 'sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Als PDF drucken / speichern
        </button>
      </div>
    </>
  )
}
