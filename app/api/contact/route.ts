import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// In-memory rate limiter: 3 contact submissions per 10 minutes per IP
const rateMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 10 * 60_000 })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
}

setInterval(() => {
  const now = Date.now()
  Array.from(rateMap.entries()).forEach(([key, val]) => {
    if (now > val.resetAt) rateMap.delete(key)
  })
}, 15 * 60_000)

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuche es später.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()

    // Honeypot: bots fill this hidden field, humans don't
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 })
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
    }
    if (name.length > 100 || email.length > 200 || message.length > 2000) {
      return NextResponse.json({ error: 'Eingabe zu lang.' }, { status: 400 })
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'lmagg@gmx.at',
        to: 'lmagg@gmx.at',
        replyTo: email,
        subject: `Neue Kontaktanfrage von ${name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="font-weight: 400; border-bottom: 1px solid #e0e0e0; padding-bottom: 12px;">
              Neue Kontaktanfrage — lomaphoto
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">E-Mail</td><td>${email}</td></tr>
            </table>
            <p style="color: #666; font-size: 13px; margin-top: 4px;">Nachricht:</p>
            <p style="white-space: pre-wrap; background: #f9f9f9; padding: 16px; border-left: 3px solid #c9a96e;">
              ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </p>
          </div>
        `,
      })
    } else {
      console.log('[Contact] New message from:', name, email, message.slice(0, 100))
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Serverfehler. Bitte versuche es später.' }, { status: 500 })
  }
}
