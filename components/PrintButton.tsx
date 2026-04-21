'use client'

export default function PrintButton() {
  return (
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
  )
}
