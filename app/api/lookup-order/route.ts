// app/api/lookup-order/route.ts
// Guest order lookup for /account/orders — no login exists yet (no WP-side
// auth plugin), so this is the "where's my order" answer for launch: an
// order number + the billing email on that order, verified server-side.
import { NextResponse } from 'next/server'
import { getOrderById } from '@/lib/woocommerce'

// Same message whether the order number doesn't exist or the email doesn't
// match it — distinguishing the two would let this endpoint be used to
// enumerate valid order numbers, or to check which email placed a given
// order, by trying combinations and watching which error comes back.
const GENERIC_ERROR = 'We couldn’t find an order matching that order number and email.'

export async function POST(req: Request) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { orderNumber, email } = (body ?? {}) as { orderNumber?: unknown; email?: unknown }

    const orderNumberRaw = typeof orderNumber === 'string' ? orderNumber.trim() : ''
    const emailInput = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const orderId = parseInt(orderNumberRaw.replace(/[^0-9]/g, ''), 10)

    if (!Number.isInteger(orderId) || orderId <= 0 || !emailInput) {
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 404 })
    }

    let order
    try {
        order = await getOrderById(orderId)
    } catch {
        return NextResponse.json({ error: 'Could not look up that order right now. Please try again.' }, { status: 502 })
    }

    if (!order || order.billing.email.trim().toLowerCase() !== emailInput) {
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 404 })
    }

    return NextResponse.json(order)
}
