import type { Metadata } from 'next'
import WiderrufsformularTopBar from '@/components/WiderrufsformularTopBar'

export const metadata: Metadata = {
  title: 'Muster-Widerrufsformular — lomaphoto',
  robots: { index: false, follow: false },
}

export default function WiderrufsformularPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', padding: '0' }}>

      <WiderrufsformularTopBar />

      {/* Document */}
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '60px 40px 80px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#666', marginBottom: '8px', fontFamily: 'Arial, sans-serif' }}>
            lomaphoto · Lorenz Magg
          </p>
          <h1 style={{ fontSize: '26px', fontWeight: 'normal', margin: 0, letterSpacing: '0.02em' }}>
            Muster-Widerrufsformular
          </h1>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', fontFamily: 'Arial, sans-serif' }}>
            Gemäß Anlage 1 zu § 4 Abs. 3 FAGG (Österreich) · EU-Richtlinie 2011/83/EU
          </p>
        </div>

        {/* Recipient box */}
        <div
          className="form-box"
          style={{
            border: '1px solid #ccc',
            padding: '20px 24px',
            marginBottom: '32px',
            background: '#f9f9f9',
          }}
        >
          <p style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Arial, sans-serif' }}>
            An (Empfänger)
          </p>
          <p style={{ fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            Lorenz Magg<br />
            Schumanngasse 68/1-3<br />
            1170 Wien<br />
            Österreich<br />
            <span style={{ color: '#333' }}>lmagg@gmx.at</span><br />
            +43 699 11338029
          </p>
        </div>

        {/* Declaration */}
        <p style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '32px' }}>
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
          über den Kauf der folgenden Waren (*):
        </p>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <FieldBlock label="Bezeichnung der Ware / Bestellnummer" lines={2} />
          <FieldBlock label="Bestellt am" lines={1} />
          <FieldBlock label="Erhalten am" lines={1} />
          <FieldBlock label="Name des / der Verbraucher(s)" lines={1} />
          <FieldBlock label="Anschrift des / der Verbraucher(s)" lines={3} />

          <div>
            <FieldLabel>Unterschrift des / der Verbraucher(s)</FieldLabel>
            <p style={{ fontSize: '11px', color: '#888', fontFamily: 'Arial, sans-serif', marginTop: '4px', marginBottom: '8px' }}>
              (nur bei Mitteilung auf Papier)
            </p>
            <FieldLines lines={2} />
          </div>

          <FieldBlock label="Datum" lines={1} />
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '48px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
          <p style={{ fontSize: '11px', color: '#888', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            (*) Unzutreffendes streichen. · Dieses Formular bitte per E-Mail an{' '}
            <strong>lmagg@gmx.at</strong> oder per Post an die obige Adresse senden.
            Bitte bewahren Sie einen Nachweis der Absendung auf.
          </p>
        </div>
      </div>
    </main>
  )
}

// ── Local helpers ─────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '11px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#666',
      fontFamily: 'Arial, sans-serif',
      marginBottom: '8px',
    }}>
      {children}
    </p>
  )
}

function FieldLines({ lines }: { lines: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="field-line"
          style={{ borderBottom: '1px solid #ccc', height: '28px' }}
        />
      ))}
    </div>
  )
}

function FieldBlock({ label, lines }: { label: string; lines: number }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <FieldLines lines={lines} />
    </div>
  )
}
