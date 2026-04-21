import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung',
  robots: { index: true, follow: true },
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

export default function WiderrufsbelehrungPage() {
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
            Widerrufs&shy;belehrung
          </h1>
        </div>

        {/* Widerrufsrecht */}
        <div className="space-y-3">
          <P>
            Als Verbraucher steht Ihnen ein gesetzliches Widerrufsrecht zu. Die nachfolgenden
            Informationen entsprechen den Anforderungen gemäß dem österreichischen
            Fern- und Auswärtsgeschäfte-Gesetz (FAGG) sowie der EU-Richtlinie 2011/83/EU.
          </P>
        </div>

        <Section title="Widerrufsrecht">
          <P>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
            zu widerrufen.
          </P>
          <P>
            Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von
            Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz
            genommen haben.
          </P>
          <P>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — Lorenz Magg,
            Schumanngasse 68/1-3, 1170 Wien, Österreich,{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>
            , Tel. +43 699 11338029 — mittels einer eindeutigen Erklärung (z.B. ein mit
            der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag
            zu widerrufen, informieren. Sie können dafür das beigefügte{' '}
            <Link href="/widerrufsformular" className="text-gold underline underline-offset-2">
              Muster-Widerrufsformular
            </Link>{' '}
            verwenden, das jedoch nicht vorgeschrieben ist.
          </P>
          <P>
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
            Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
          </P>
        </Section>

        <Section title="Folgen des Widerrufs">
          <P>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von
            Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der
            zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der
            Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben),
            unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an
            dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
          </P>
          <P>
            Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
            ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
            ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
            Rückzahlung Entgelte berechnet.
          </P>
          <P>
            Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten
            haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt
            haben, je nachdem, welches der frühere Zeitpunkt ist.
          </P>
          <P>
            Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn
            Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten,
            an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die
            Waren vor Ablauf der Frist von vierzehn Tagen absenden.
          </P>
          <P>
            <strong className="text-light-muted">
              Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
            </strong>
          </P>
          <P>
            Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
            Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und
            Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
          </P>
        </Section>

        <Section title="Ausnahme vom Widerrufsrecht">
          <P>
            Das Widerrufsrecht besteht gemäß § 18 Abs. 1 Z 3 FAGG{' '}
            <strong className="text-light-muted">nicht</strong> bei Verträgen zur Lieferung
            von Waren, die nach Kundenspezifikation angefertigt werden oder eindeutig auf die
            persönlichen Bedürfnisse zugeschnitten sind.
          </P>
          <P>
            Da unsere Kunstdrucke (Aludibond in Schattenfugenrahmen) individuell auf
            Bestellung handgefertigt werden und nach Ihrer Bestellung speziell für Sie
            produziert werden, kann das Widerrufsrecht in diesen Fällen{' '}
            <strong className="text-light-muted">ausgeschlossen sein</strong>.
          </P>
          <P>
            Ob das Widerrufsrecht im konkreten Fall ausgeschlossen ist, teilen wir Ihnen
            bei Bestellung gesondert mit. Bei Unklarheiten wenden Sie sich bitte vor der
            Bestellung an{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>
            .
          </P>
        </Section>

        <Section title="Muster-Widerrufsformular">
          <P>
            Das Muster-Widerrufsformular gemäß Anlage 1 zu § 4 Abs. 3 FAGG können Sie
            herunterladen und ausgefüllt per E-Mail an{' '}
            <a href="mailto:lmagg@gmx.at" className="text-gold underline underline-offset-2">
              lmagg@gmx.at
            </a>{' '}
            senden:
          </P>
          <div className="mt-4">
            <Link
              href="/widerrufsformular"
              className="inline-block px-6 py-3 text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-sans"
            >
              Widerrufsformular öffnen
            </Link>
          </div>

          {/* Inline form for reference */}
          <div className="mt-8 border border-dark-300 p-6 space-y-3">
            <p className="text-light-muted font-sans text-xs tracking-widest uppercase mb-4">
              Muster-Widerrufsformular (Vorlage)
            </p>
            <P>
              An: Lorenz Magg, Schumanngasse 68/1-3, 1170 Wien, Österreich
              · lmagg@gmx.at
            </P>
            <P>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
              über den Kauf der folgenden Waren (*):
            </P>
            <P>Bestellt am (*) / erhalten am (*):</P>
            <P>Name des/der Verbraucher(s):</P>
            <P>Anschrift des/der Verbraucher(s):</P>
            <P>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</P>
            <P>Datum:</P>
            <p className="text-light-dim font-sans text-sm leading-relaxed mt-2">
              <em>(*) Unzutreffendes streichen.</em>
            </p>
          </div>
        </Section>
      </div>

      <Footer settings={null} />
    </main>
  )
}
