import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AGB',
  robots: { index: true, follow: true },
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-dark-200 pt-8 mt-8">
      <p className="text-[10px] tracking-[0.35em] uppercase text-light-dim font-sans mb-1">
        § {num}
      </p>
      <p className="font-serif text-xl font-light text-light mb-4">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-light-dim font-sans text-sm leading-relaxed">{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm font-sans text-light-dim">
      <span className="text-gold mt-0.5 shrink-0">—</span>
      <span>{children}</span>
    </li>
  )
}

export default function AGBPage() {
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
            Rechtliches
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-light tracking-wide">
            Allgemeine Geschäfts&shy;bedingungen
          </h1>
          <p className="text-light-dim font-sans text-sm mt-4">Stand: April 2026</p>
        </div>

        {/* Präambel */}
        <div className="space-y-3">
          <P>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die zwischen
            Lorenz Magg (nachfolgend „Verkäufer") und dem Käufer über den Online-Shop
            lomaphoto.at abgeschlossen werden.
          </P>
          <P>
            <strong className="text-light-muted">Verkäufer:</strong> Lorenz Magg ·
            Schumanngasse 68/1-3 · 1170 Wien · Österreich ·{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>{' '}
            · Tel. +43 699 11338029 · UID: ATU63990934
          </P>
        </div>

        <Section num="1" title="Geltungsbereich">
          <P>
            Diese AGB gelten für alle über den Online-Shop lomaphoto.at getätigten
            Bestellungen. Abweichende Bedingungen des Käufers werden nicht anerkannt, es sei
            denn, der Verkäufer stimmt ihrer Geltung ausdrücklich schriftlich zu.
          </P>
          <P>
            Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein
            Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen
            noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden können.
          </P>
        </Section>

        <Section num="2" title="Vertragsschluss">
          <P>
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes
            Angebot, sondern eine Aufforderung zur Bestellung (invitatio ad offerendum) dar.
          </P>
          <P>
            Durch Anklicken des Buttons „Jetzt kaufen" gibt der Käufer eine verbindliche
            Bestellung der im Warenkorb enthaltenen Waren ab. Die Bestellbestätigung per
            E-Mail stellt noch keine Annahme des Angebots dar, sondern bestätigt lediglich
            den Eingang der Bestellung.
          </P>
          <P>
            Der Kaufvertrag kommt erst zustande, wenn der Verkäufer die Bestellung durch eine
            gesonderte Auftragsbestätigung per E-Mail annimmt oder die Ware versendet.
            Der Verkäufer ist berechtigt, Bestellungen ohne Angabe von Gründen abzulehnen.
          </P>
          <P>
            Da die Kunstdrucke individuell auf Bestellung handgefertigt werden, wird der
            Fertigungsbeginn erst nach Zahlungseingang gestartet. Der Käufer wird über den
            voraussichtlichen Fertigstellungs- und Liefertermin gesondert informiert.
          </P>
        </Section>

        <Section num="3" title="Preise und Zahlungsbedingungen">
          <P>
            Alle Preise verstehen sich in Euro (€) und sind inklusive der gesetzlichen
            österreichischen Umsatzsteuer von 20 %.{' '}
            <strong className="text-light-muted">
              Der Versand innerhalb der Europäischen Union ist kostenlos.
            </strong>{' '}
            Es fallen keine zusätzlichen Versandkosten an.
          </P>
          <P>
            Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Akzeptierte
            Zahlungsmethoden sind Kreditkarte (Visa, Mastercard, American Express), SEPA-
            Lastschrift sowie weitere von Stripe angebotene Verfahren. Kreditkartendaten
            werden niemals auf unseren Servern gespeichert.
          </P>
          <P>
            Der Kaufpreis ist mit Abschluss der Bestellung fällig. Mit der Zahlung wird der
            Fertigungsprozess gestartet.
          </P>
        </Section>

        <Section num="4" title="Lieferung und Versand">
          <P>
            Der Versand erfolgt ausschließlich innerhalb der Europäischen Union. Als
            Versanddienstleister wird die Österreichische Post AG eingesetzt.
          </P>
          <P>
            Da sämtliche Produkte (Kunstdrucke auf Aludibond in Schattenfugenrahmen aus Holz)
            individuell auf Bestellung handgefertigt werden, erfolgt die Lieferung nach
            individueller Absprache. Die voraussichtliche Lieferzeit wird dem Käufer nach
            Bestelleingang per E-Mail mitgeteilt.
          </P>
          <P>
            Alle Sendungen werden versichert und sicher verpackt versandt. Bei erkennbaren
            Transportschäden ist die Ware beim Zusteller zu reklamieren und der Verkäufer
            unverzüglich zu informieren.
          </P>
          <P>
            Der Versand innerhalb der EU ist kostenlos. Weitere Details finden Sie auf der{' '}
            <Link href="/versandkosten" className="text-gold underline underline-offset-2">
              Versandkostenseite
            </Link>
            .
          </P>
        </Section>

        <Section num="5" title="Eigentumsvorbehalt">
          <P>
            Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises
            Eigentum des Verkäufers. Vor Eigentumsübergang ist eine Verpfändung oder
            Sicherungsübereignung nicht zulässig.
          </P>
        </Section>

        <Section num="6" title="Widerrufsrecht">
          <P>
            Es gilt das gesetzliche Widerrufsrecht gemäß FAGG. Details entnehmen Sie bitte
            der gesonderten{' '}
            <Link href="/widerrufsbelehrung" className="text-gold underline underline-offset-2">
              Widerrufsbelehrung
            </Link>
            .
          </P>
          <P>
            Hinweis: Da es sich bei den angebotenen Kunstdrucken um individuell auf
            Kundenspezifikation angefertigte Waren handelt, kann das Widerrufsrecht gemäß
            § 18 Abs. 1 Z 3 FAGG ausgeschlossen sein. Der Käufer wird hierüber im Rahmen
            des Bestellprozesses informiert.
          </P>
        </Section>

        <Section num="7" title="Gewährleistung">
          <P>
            Es gelten die gesetzlichen Gewährleistungsrechte nach österreichischem Recht
            (ABGB). Die Gewährleistungsfrist beträgt zwei Jahre ab Übergabe der Ware.
          </P>
          <P>
            Bei Gewährleistungsansprüchen wenden Sie sich bitte per E-Mail an{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>{' '}
            und beschreiben Sie den Mangel möglichst genau, idealerweise mit Fotos.
          </P>
          <P>
            Offensichtliche Mängel sind binnen 14 Tagen nach Erhalt der Ware zu melden.
            Natürliche Abnutzung, Beschädigungen durch unsachgemäße Behandlung oder
            Lagerung sowie Farbveränderungen durch direkte Sonneneinstrahlung sind von
            der Gewährleistung ausgenommen.
          </P>
        </Section>

        <Section num="8" title="Haftung">
          <P>
            Der Verkäufer haftet unbeschränkt für Schäden, die durch Vorsatz oder grobe
            Fahrlässigkeit verursacht wurden, sowie für Schäden aus der Verletzung des
            Lebens, des Körpers oder der Gesundheit.
          </P>
          <P>
            Bei leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung einer
            wesentlichen Vertragspflicht (Kardinalpflicht). In diesen Fällen ist die
            Haftung auf den vertragstypisch vorhersehbaren Schaden begrenzt.
          </P>
          <P>
            Die vorstehenden Haftungsbeschränkungen gelten nicht für Ansprüche nach dem
            österreichischen Produkthaftungsgesetz (PHG).
          </P>
        </Section>

        <Section num="9" title="Streitbeilegung">
          <P>
            Die Europäische Kommission stellt unter{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-2"
            >
              ec.europa.eu/consumers/odr
            </a>{' '}
            eine Plattform zur Online-Streitbeilegung (OS-Plattform) bereit.
          </P>
          <P>
            Der Verkäufer ist nicht bereit und nicht verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            Bei Streitigkeiten empfehlen wir, uns zunächst direkt unter{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>{' '}
            zu kontaktieren.
          </P>
        </Section>

        <Section num="10" title="Schlussbestimmungen">
          <P>
            Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG).
            Gerichtsstand ist Wien, sofern der Käufer Unternehmer ist oder keinen
            allgemeinen Gerichtsstand in Österreich hat.
          </P>
          <P>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt
            die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen
            Bestimmung tritt eine wirksame Regelung, die dem wirtschaftlichen Zweck am
            nächsten kommt.
          </P>
          <P>
            Der Verkäufer behält sich vor, diese AGB jederzeit zu ändern. Maßgeblich ist die
            zum Zeitpunkt der Bestellung gültige Fassung.
          </P>
        </Section>
      </div>

      <Footer settings={null} />
    </main>
  )
}
