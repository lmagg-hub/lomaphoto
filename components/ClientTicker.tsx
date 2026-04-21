import { writeClient } from '@/sanity/client'
import { clientTickerQuery } from '@/lib/queries'
import type { TickerClient } from '@/types'

// Font-value → CSS font-family string
const FONT_MAP: Record<string, string> = {
  'Roboto':             'var(--font-roboto), sans-serif',
  'Playfair Display':   'var(--font-playfair), serif',
  'Montserrat':         'var(--font-montserrat), sans-serif',
  'Oswald':             'var(--font-oswald), sans-serif',
  'Cormorant Garamond': 'var(--font-cormorant), serif',
  'Open Sans':          'var(--font-open-sans), sans-serif',
  'Arial':              'Arial, sans-serif',
}

// Hardcoded fallback used until Sanity has data
const FALLBACK_CLIENTS: TickerClient[] = [
  { _id: '1', companyName: 'EQUANS',                                         fontStyle: 'Roboto',             order: 1 },
  { _id: '2', companyName: 'SCHÖNHERR',                                      fontStyle: 'Playfair Display',   order: 2 },
  { _id: '3', companyName: 'SIEMENS',                                        fontStyle: 'Arial',              order: 3 },
  { _id: '4', companyName: 'JANSSEN',                                        fontStyle: 'Open Sans',          order: 4 },
  { _id: '5', companyName: 'KOURAGE FILM',                                   fontStyle: 'Montserrat',         order: 5 },
  { _id: '6', companyName: 'WBV WIENER BASKETBALLVERBAND',                   fontStyle: 'Oswald',             order: 6 },
  { _id: '7', companyName: 'KANADISCHE BOTSCHAFT',                           fontStyle: 'Cormorant Garamond', order: 7 },
  { _id: '8', companyName: 'NBBV NIEDERÖSTERREICHISCHER BASKETBALLVERBAND',  fontStyle: 'Oswald',             order: 8 },
]

function TickerRow({ clients }: { clients: TickerClient[] }) {
  return (
    <>
      {clients.map((client) => (
        <span key={client._id} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          <span
            style={{
              fontFamily: FONT_MAP[client.fontStyle] ?? 'sans-serif',
              fontSize: '16px',
              letterSpacing: '3px',
              color: '#ffffff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              padding: '0 32px',
            }}
          >
            {client.companyName}
          </span>
          <span
            style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16px', flexShrink: 0, userSelect: 'none' }}
            aria-hidden="true"
          >
            ·
          </span>
        </span>
      ))}
    </>
  )
}

export default async function ClientTicker() {
  let clients: TickerClient[] = []

  try {
    const fetched = await writeClient.fetch<TickerClient[]>(
      clientTickerQuery,
      {},
      { next: { revalidate: 30 } }
    )
    clients = fetched?.length ? fetched : FALLBACK_CLIENTS
  } catch {
    clients = FALLBACK_CLIENTS
  }

  return (
    <div
      style={{
        background: '#111111',
        height: '107px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
      aria-label="Kunden"
    >
      {/*
        Three identical copies — animation moves by -33.333% (one copy's width).
        translate3d() keeps Z on the GPU so translateX never fights with a
        separate translateZ, eliminating the layer-promotion flicker.
      */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          animation: 'ticker 40s linear infinite',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <TickerRow clients={clients} />
        <TickerRow clients={clients} />
        <TickerRow clients={clients} />
      </div>
    </div>
  )
}
