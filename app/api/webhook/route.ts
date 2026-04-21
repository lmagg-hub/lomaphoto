import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const resend = new Resend(process.env.RESEND_API_KEY)

function formatAddress(addr: Stripe.Address | null | undefined): string {
  if (!addr) return 'Keine Adresse angegeben'
  return [addr.line1, addr.line2, `${addr.postal_code} ${addr.city}`, addr.country]
    .filter(Boolean)
    .join(', ')
}

function orderEmailHtml(session: Stripe.Checkout.Session): string {
  const meta = session.metadata ?? {}
  const customer = session.customer_details
  const shipping = session.collected_information?.shipping_details
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2)

  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-weight: 400; font-size: 28px; border-bottom: 1px solid #e0e0e0; padding-bottom: 16px;">
        Neue Bestellung — lomaphoto
      </h1>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px 0; color: #666; width: 160px;">Bestellnummer</td><td style="padding: 8px 0;">${session.id}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Print</td><td style="padding: 8px 0; font-weight: bold;">${meta.productTitle ?? '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Größe</td><td style="padding: 8px 0;">${meta.size ?? '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Material</td><td style="padding: 8px 0;">Aludibond in Schattenfugenrahmen aus Holz</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Betrag</td><td style="padding: 8px 0; font-size: 18px; color: #c9a96e;">€ ${amount}</td></tr>
      </table>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
      <h2 style="font-weight: 400; font-size: 18px; margin-bottom: 12px;">Kundendaten</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #666; width: 160px;">Name</td><td style="padding: 6px 0;">${customer?.name ?? '—'}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">E-Mail</td><td style="padding: 6px 0;">${customer?.email ?? '—'}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Lieferadresse</td><td style="padding: 6px 0;">${formatAddress(shipping?.address)}</td></tr>
      </table>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">
        Stripe Dashboard:
        <a href="https://dashboard.stripe.com/payments/${session.payment_intent}" style="color: #c9a96e;">
          ${session.payment_intent}
        </a>
      </p>
    </div>
  `
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    console.log('[Webhook] Successful payment:', session.id)

    // Send order notification email
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'shop@lomaphoto.at',
          to: 'lorenz@lomaphoto.at',
          subject: `🖼 Neue Bestellung: ${session.metadata?.productTitle ?? 'Print'} — ${session.metadata?.size ?? ''}`,
          html: orderEmailHtml(session),
        })
        console.log('[Webhook] Order email sent')
      } catch (emailErr) {
        console.error('[Webhook] Email error:', emailErr)
        // Don't fail the webhook — Stripe should still get 200
      }
    }
  }

  return NextResponse.json({ received: true })
}
