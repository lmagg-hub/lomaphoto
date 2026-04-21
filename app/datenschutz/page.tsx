import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  robots: { index: false, follow: false },
}

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
  return (
    <p className="text-light-dim font-sans text-sm leading-relaxed">{children}</p>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 text-sm font-sans">
      <span className="text-light-dim w-56 shrink-0">{label}</span>
      <span className="text-light-muted">{value}</span>
    </div>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold hover:text-light transition-colors duration-200 underline underline-offset-2"
    >
      {children}
    </a>
  )
}

function RightsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm font-sans text-light-dim">
          <span className="text-gold mt-0.5 shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navigation settings={null} />

      <div className="max-w-2xl mx-auto px-6 md:px-10 pt-32 pb-24">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="text-[10px] tracking-widest uppercase text-light-dim hover:text-light font-sans transition-colors duration-300"
        >
          ← Zurück
        </Link>

        {/* Heading */}
        <div className="mt-10 mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans mb-4">
            Rechtliches
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-light tracking-wide">
            Datenschutz&shy;erklärung
          </h1>
        </div>

        {/* 1 — Allgemeines */}
        <div className="space-y-3">
          <P>
            Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten
            auf dieser Website gemäß der Datenschutz-Grundverordnung (DSGVO, EU 2016/679) sowie
            dem österreichischen Datenschutzgesetz (DSG).
          </P>
          <P>
            Verantwortlicher im Sinne der DSGVO ist Lorenz Magg, Schumanngasse 68/1-3,
            1170 Wien, Österreich. Bei Fragen zum Datenschutz:{' '}
            <a
              href="mailto:lmagg@gmx.at"
              className="text-gold hover:text-light transition-colors duration-200 underline underline-offset-2"
            >
              lmagg@gmx.at
            </a>
          </P>
        </div>

        {/* 2 — Hosting */}
        <Section title="Hosting & Technische Infrastruktur">
          <P>
            Diese Website wird über <strong className="text-light-muted">Vercel Inc.</strong> (340
            Pine Street, Floor 5, San Francisco, CA 94104, USA) gehostet. Die Datenübertragung in
            die USA erfolgt auf Grundlage von Standardvertragsklauseln gemäß Art. 46 Abs. 2 lit.
            c DSGVO.
          </P>
          <P>
            Als Content-Management-System wird{' '}
            <strong className="text-light-muted">Sanity.io</strong> (Sanity AS, Strandveien 43,
            1366 Lysaker, Norwegen) eingesetzt, mit Datenspeicherung auf US-amerikanischen
            Servern. Auch hier gelten Standardvertragsklauseln.
          </P>
          <P>
            Beim Aufruf der Website werden automatisch Server-Logs gespeichert. Diese enthalten
            IP-Adresse, verwendeter Browser, Datum und Uhrzeit des Abrufs sowie die aufgerufene
            Seite. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            der Sicherheit und dem Betrieb der Website). Die Logs werden nach spätestens 30 Tagen
            gelöscht.
          </P>
        </Section>

        {/* 3 — Kontaktformular */}
        <Section title="Kontaktformular">
          <P>
            Bei Nutzung des Kontaktformulars werden folgende Daten erhoben und verarbeitet:
          </P>
          <RightsList items={['Name', 'E-Mail-Adresse', 'Nachricht']} />
          <P>
            Die Verarbeitung erfolgt zur Beantwortung der Anfrage auf Grundlage von Art. 6 Abs.
            1 lit. b DSGVO. Die Daten werden nicht an Dritte weitergegeben und nur so lange
            gespeichert, wie es zur Bearbeitung der Anfrage erforderlich ist.
          </P>
        </Section>

        {/* 4 — Google Analytics */}
        <Section title="Google Analytics">
          <P>
            Diese Website verwendet Google Analytics 4 (Mess-ID: G-KMCTWLZ4FK) zur Analyse des
            Nutzerverhaltens. Google Analytics wird nur nach ausdrücklicher Einwilligung geladen —
            es werden keine Cookies gesetzt, bevor der Nutzer zugestimmt hat.
          </P>
          <div className="space-y-1.5">
            <Row label="Anbieter" value="Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland" />
            <Row label="Rechtsgrundlage" value="Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)" />
            <Row label="Datenübertragung" value="USA — Standardvertragsklauseln gemäß Art. 46 DSGVO" />
            <Row label="IP-Anonymisierung" value="Aktiviert" />
          </div>
          <P>
            Die Einwilligung kann jederzeit durch Klick auf „Ablehnen" im Cookie-Banner oder
            durch Löschen der lokalen Einwilligung im Browser widerrufen werden. Darüber hinaus
            kann die Datenerfassung durch Google Analytics über das Browser-Add-on deaktiviert
            werden:{' '}
            <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
              tools.google.com/dlpage/gaoptout
            </ExternalLink>
          </P>
          <P>
            Datenschutzerklärung Google:{' '}
            <ExternalLink href="https://policies.google.com/privacy">
              policies.google.com/privacy
            </ExternalLink>
          </P>
        </Section>

        {/* 5 — Stripe */}
        <Section title="Stripe Zahlungsabwicklung">
          <P>
            Für die Abwicklung von Zahlungen im Shop wird Stripe eingesetzt. Kreditkarten- und
            Zahlungsdaten werden ausschließlich von Stripe verarbeitet und niemals auf unseren
            Servern gespeichert.
          </P>
          <div className="space-y-1.5">
            <Row label="Anbieter" value="Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland" />
            <Row label="Zweck" value="Sichere Zahlungsabwicklung" />
            <Row label="Rechtsgrundlage" value="Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)" />
            <Row label="Sicherheitsstandard" value="PCI-DSS konform" />
          </div>
          <P>
            Datenschutzerklärung Stripe:{' '}
            <ExternalLink href="https://stripe.com/privacy">
              stripe.com/privacy
            </ExternalLink>
          </P>
        </Section>

        {/* 6 — Cookies */}
        <Section title="Cookies">
          <P>
            Diese Website verwendet folgende Arten von Cookies und lokalem Speicher:
          </P>
          <RightsList
            items={[
              'Technisch notwendige Cookies — für den Betrieb der Website erforderlich, kein Consent nötig',
              'Google Analytics Cookies — werden nur nach ausdrücklicher Zustimmung gesetzt',
              'Cookie-Einwilligung — wird im localStorage des Browsers gespeichert (kein Server)',
            ]}
          />
          <P>
            Der Nutzer kann die Cookie-Einwilligung jederzeit widerrufen, indem er den
            lokalen Speicher im Browser löscht (Browsereinstellungen → Datenschutz →
            Website-Daten löschen).
          </P>
        </Section>

        {/* 7 — Betroffenenrechte */}
        <Section title="Betroffenenrechte">
          <P>
            Gemäß DSGVO stehen folgenden Rechte zu:
          </P>
          <RightsList
            items={[
              'Auskunftsrecht über gespeicherte Daten (Art. 15 DSGVO)',
              'Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
              'Recht auf Löschung („Recht auf Vergessenwerden", Art. 17 DSGVO)',
              'Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)',
              'Widerspruchsrecht gegen die Verarbeitung (Art. 21 DSGVO)',
              'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
            ]}
          />
          <P>
            Zur Ausübung dieser Rechte genügt eine formlose E-Mail an{' '}
            <a
              href="mailto:lmagg@gmx.at"
              className="text-gold hover:text-light transition-colors duration-200 underline underline-offset-2"
            >
              lmagg@gmx.at
            </a>
            . Zusätzlich besteht das Recht, eine Beschwerde bei der österreichischen
            Datenschutzbehörde einzureichen:{' '}
            <ExternalLink href="https://www.dsb.gv.at">
              dsb.gv.at
            </ExternalLink>
          </P>
        </Section>

        {/* 8 — Änderungen */}
        <Section title="Änderungen dieser Erklärung">
          <P>
            Diese Datenschutzerklärung kann jederzeit aktualisiert werden, um rechtlichen
            Änderungen oder Anpassungen der Website Rechnung zu tragen. Es empfiehlt sich, diese
            Seite regelmäßig zu prüfen.
          </P>
          <P>Stand: April 2026</P>
        </Section>
      </div>

      <Footer settings={null} />
    </main>
  )
}
