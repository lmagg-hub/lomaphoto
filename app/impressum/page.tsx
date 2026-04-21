import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false, follow: false },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-dark-200 pt-8 mt-8">
      <p className="text-[10px] tracking-[0.35em] uppercase text-light-dim font-sans mb-4">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 text-sm font-sans">
      <span className="text-light-dim w-48 shrink-0">{label}</span>
      <span className="text-light-muted">{value}</span>
    </div>
  )
}

export default function ImpressumPage() {
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
            Impressum
          </h1>
        </div>

        {/* Angaben gemäß § 5 ECG */}
        <div className="space-y-1.5">
          <p className="font-serif text-2xl font-light text-light mb-2">Lorenz Magg</p>
          <p className="text-light-muted font-sans text-sm">Schumanngasse 68/1-3</p>
          <p className="text-light-muted font-sans text-sm">1170 Wien, Österreich</p>
        </div>

        <Section title="Kontakt">
          <Row label="E-Mail" value="lmagg@gmx.at" />
          <Row label="Telefon" value="+43 699 11338029" />
        </Section>

        <Section title="Unternehmensangaben">
          <Row label="Unternehmensgegenstand" value="Film- und Videoproduktion" />
          <Row label="UID-Nummer" value="ATU63990934" />
          <Row label="Mitglied der" value="Wirtschaftskammer Wien" />
        </Section>

        <Section title="Aufsicht & Berufsrecht">
          <Row label="Berufsrecht" value="Gewerbeordnung (GewO)" />
          <Row label="Aufsichtsbehörde" value="Magistrat der Stadt Wien" />
        </Section>

        <Section title="Haftungsausschluss">
          <p className="text-light-dim font-sans text-sm leading-relaxed">
            Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die
            Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr.
            Als Diensteanbieter sind wir für eigene Inhalte nach den allgemeinen Gesetzen
            verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte
            fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p className="text-light-dim font-sans text-sm leading-relaxed">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website
            unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung,
            Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
            bedürfen der schriftlichen Zustimmung des jeweiligen Autors.
          </p>
        </Section>
      </div>

      <Footer settings={null} />
    </main>
  )
}
