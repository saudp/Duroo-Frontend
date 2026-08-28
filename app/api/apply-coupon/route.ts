// app/api/apply-coupon/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ valid: false, error: 'Invalid request body' }, { status: 400 })
  }

  const code = typeof body?.code === 'string' ? body.code.trim() : ''
  const subtotal = typeof body?.subtotal === 'number' ? body.subtotal : 0

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Enter a code' }, { status: 400 })
  }

  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString('base64')

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`,
      { headers: { Authorization: `Basic ${auth}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ valid: false, error: 'Could not verify code. Please try again.' }, { status: 502 })
    }

    const matches = await res.json()
    const coupon = Array.isArray(matches) ? matches[0] : null

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'That code doesn’t exist.' })
    }

    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return NextResponse.json({ valid: false, error: 'That code has expired.' })
    }

    const minAmount = parseFloat(coupon.minimum_amount || '0')
    if (minAmount > 0 && subtotal < minAmount) {
      return NextResponse.json({ valid: false, error: `Minimum order of ₹${minAmount.toLocaleString()} required.` })
    }

    const maxAmount = parseFloat(coupon.maximum_amount || '0')
    if (maxAmount > 0 && subtotal > maxAmount) {
      return NextResponse.json({ valid: false, error: `Only valid on orders up to ₹${maxAmount.toLocaleString()}.` })
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, error: 'That code has reached its usage limit.' })
    }

    const amount = parseFloat(coupon.amount || '0')
    let discount = 0
    if (coupon.discount_type === 'percent') {
      discount = subtotal * (amount / 100)
    } else if (coupon.discount_type === 'fixed_cart') {
      discount = amount
    } else {
      return NextResponse.json({ valid: false, error: 'This code only applies to specific products.' })
    }

    discount = Math.min(Math.round(discount), subtotal)

    return NextResponse.json({ valid: true, code: coupon.code, discount })
  } catch {
    return NextResponse.json({ valid: false, error: 'Could not verify code. Please try again.' }, { status: 500 })
  }
}
