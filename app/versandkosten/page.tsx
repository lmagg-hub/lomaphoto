import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Versandkosten',
  robots: { index: true, follow: true },
}

const SHIPPING_RATES = [
  { country: 'Österreich',         flag: '🇦🇹', note: '' },
  { country: 'Deutschland',        flag: '🇩🇪', note: '' },
  { country: 'Frankreich',         flag: '🇫🇷', note: '' },
  { country: 'Italien',            flag: '🇮🇹', note: '' },
  { country: 'Niederlande',        flag: '🇳🇱', note: '' },
  { country: 'Belgien',            flag: '🇧🇪', note: '' },
  { country: 'Luxemburg',          flag: '🇱🇺', note: '' },
  { country: 'Übriges EU-Ausland', flag: '🇪🇺', note: 'Alle EU-Mitgliedstaaten' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-dark-200 pt-8 mt-8">
      <p className="text-[10px] tracking-[0.35em] uppercase text-light-dim font-sans mb-4">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-light-dim font-sans text-sm leading-relaxed">{children}</p>
}

export default function VersandkostenPage() {
  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navigation settings={null} />

      <div className="max-w-2xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <Link
          href="/shop"
          className="text-[10px] tracking-widest uppercase text-light-dim hover:text-light font-sans transition-colors duration-300"
        >
          ← Zurück zum Shop
        </Link>

        <div className="mt-10 mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans mb-4">
            Shop
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-light tracking-wide">
            Versand&shy;kosten
          </h1>
        </div>

        {/* Free shipping banner */}
        <div className="border border-gold/30 bg-gold/5 px-6 py-5 mb-2 space-y-1">
          <p className="font-serif text-2xl font-light text-gold">Kostenloser Versand</p>
          <p className="text-light-muted font-sans text-sm leading-relaxed">
            Wir versenden alle Bestellungen kostenfrei innerhalb der Europäischen Union.
          </p>
        </div>

        {/* Rates table */}
        <Section title="Versand innerhalb der EU">
          <div className="border border-dark-300 overflow-hidden">
            {SHIPPING_RATES.map((row, i) => (
              <div
                key={row.country}
                className={`flex items-start justify-between px-5 py-4 gap-4 font-sans text-sm ${
                  i < SHIPPING_RATES.length - 1 ? 'border-b border-dark-200' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base shrink-0">{row.flag}</span>
                  <div>
                    <span className="text-light-muted">{row.country}</span>
                    {row.note && (
                      <p className="text-light-dim text-xs mt-0.5">{row.note}</p>
                    )}
                  </div>
                </div>
                <span className="text-gold font-light shrink-0">Kostenlos</span>
              </div>
            ))}
          </div>
          <P>Versicherter Versand via Österreichische Post AG — in alle EU-Mitgliedstaaten kostenlos.</P>
        </Section>

        <Section title="Lieferzeit">
          <P>
            Da sämtliche Kunstdrucke (Aludibond in handgefertigten Schattenfugenrahmen aus
            Holz) individuell auf Bestellung gefertigt werden, gibt es keine feste
            Standardlieferzeit.
          </P>
          <P>
            Nach Eingang Ihrer Bestellung und Zahlungsbestätigung erhalten Sie eine
            persönliche E-Mail mit dem voraussichtlichen Fertigstellungs- und Liefertermin.
            In der Regel beträgt die Produktionszeit{' '}
            <strong className="text-light-muted">2–4 Wochen</strong>, abhängig von
            Auftragslage und gewählter Größe.
          </P>
          <P>
            Bei zeitkritischen Aufträgen (z.B. Geschenke) empfehlen wir, vorab per E-Mail
            an{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>{' '}
            Kontakt aufzunehmen.
          </P>
        </Section>

        <Section title="Verpackung & Versicherung">
          <P>
            Jeder Druck wird in stabiler Schutzkiste oder Kartonage mit Schaumstoffpolsterung
            verpackt, um Transportschäden zu vermeiden. Alle Sendungen werden mit einem
            Versicherungsschutz durch die Österreichische Post versandt.
          </P>
          <P>
            Bei sichtbaren Transportschäden bitten wir Sie, die Ware beim Zusteller zu
            reklamieren und uns umgehend unter{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>{' '}
            mit Fotos zu informieren.
          </P>
        </Section>

        <Section title="Lieferung außerhalb der EU">
          <P>
            Aktuell versenden wir ausschließlich innerhalb der Europäischen Union.
            Für Anfragen aus der Schweiz, UK oder anderen Nicht-EU-Ländern wenden Sie
            sich bitte direkt an{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>
            .
          </P>
        </Section>

        <div className="border-t border-dark-200 pt-8 mt-8">
          <P>
            Weitere rechtliche Informationen:{' '}
            <Link href="/agb" className="text-gold underline underline-offset-2">AGB</Link>
            {' · '}
            <Link href="/widerrufsbelehrung" className="text-gold underline underline-offset-2">
              Widerrufsbelehrung
            </Link>
          </P>
        </div>
      </div>

      <Footer settings={null} />
    </main>
  )
}
