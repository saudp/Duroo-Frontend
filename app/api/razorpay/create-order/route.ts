// app/api/razorpay/create-order/route.ts
import { NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { computeOrderTotal, type PricedItem } from '@/lib/pricing'

function validateItems(items: unknown): items is PricedItem[] {
    if (!Array.isArray(items) || items.length === 0) return false
    return items.every(
        (item) =>
            item &&
            typeof item.id === 'number' &&
            typeof item.quantity === 'number' &&
            item.quantity >= 1 &&
            item.quantity <= 20
    )
}

export async function POST(req: Request) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { items, shippingMethod, couponCode } = body as {
        items?: unknown
        shippingMethod?: unknown
        couponCode?: unknown
    }

    if (!validateItems(items)) {
        return NextResponse.json({ error: 'Invalid or empty cart' }, { status: 400 })
    }
    if (shippingMethod !== 'standard' && shippingMethod !== 'express') {
        return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 })
    }

    try {
        // The charge amount is always derived from real WooCommerce prices —
        // never from a number the client sends — so editing the cart in
        // localStorage/devtools can't under-charge a payment.
        const amount = await computeOrderTotal({
            items,
            shippingMethod,
            couponCode: typeof couponCode === 'string' ? couponCode : undefined,
        })

        if (amount <= 0) {
            return NextResponse.json({ error: 'Nothing to pay' }, { status: 400 })
        }

        const order = await createRazorpayOrder(amount, `duroo_${Date.now()}`)
        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not initiate payment'
        return NextResponse.json({ error: message }, { status: 502 })
    }
}
