// app/api/create-order/route.ts
import { NextResponse } from 'next/server'
import { verifyRazorpaySignature, fetchRazorpayPayment } from '@/lib/razorpay'
import { computeOrderTotal } from '@/lib/pricing'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9]{10}$/

function validateRequest(form: any, items: any, shippingMethod: any, payment: any) {
    const errors: string[] = []

    if (!form || typeof form !== 'object') {
        errors.push('Missing form data')
        return errors
    }

    if (!form.firstName || typeof form.firstName !== 'string' || !form.firstName.trim()) {
        errors.push('First name is required')
    }
    if (!form.email || !EMAIL_RE.test(form.email)) {
        errors.push('Valid email is required')
    }
    if (!form.phone || !PHONE_RE.test(form.phone)) {
        errors.push('Valid 10-digit phone number is required')
    }
    if (!form.address || typeof form.address !== 'string' || !form.address.trim()) {
        errors.push('Address is required')
    }
    if (!form.city || typeof form.city !== 'string' || !form.city.trim()) {
        errors.push('City is required')
    }
    if (!form.pincode || !/^[0-9]{6}$/.test(form.pincode)) {
        errors.push('Valid 6-digit pincode is required')
    }
    if (shippingMethod !== 'standard' && shippingMethod !== 'express') {
        errors.push('Invalid shipping method')
    }

    if (!payment || typeof payment !== 'object') {
        errors.push('Missing payment confirmation')
    } else {
        if (!payment.razorpay_order_id || typeof payment.razorpay_order_id !== 'string') {
            errors.push('Missing Razorpay order id')
        }
        if (!payment.razorpay_payment_id || typeof payment.razorpay_payment_id !== 'string') {
            errors.push('Missing Razorpay payment id')
        }
        if (!payment.razorpay_signature || typeof payment.razorpay_signature !== 'string') {
            errors.push('Missing Razorpay signature')
        }
    }

    if (!Array.isArray(items) || items.length === 0) {
        errors.push('Cart is empty')
    } else {
        for (const item of items) {
            if (!item.id || typeof item.id !== 'number') {
                errors.push('Invalid product in cart')
                break
            }
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 20) {
                errors.push('Invalid quantity — must be between 1 and 20')
                break
            }
        }
    }

    return errors
}

export async function POST(req: Request) {
    let body: any
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { form, items, shippingMethod, couponCode, emailOptIn, payment } = body

    const validationErrors = validateRequest(form, items, shippingMethod, payment)
    if (validationErrors.length > 0) {
        return NextResponse.json({ error: validationErrors[0], errors: validationErrors }, { status: 400 })
    }

    const signatureValid = verifyRazorpaySignature({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
        signature: payment.razorpay_signature,
    })
    if (!signatureValid) {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // The signature only proves *some* payment happened for that order/payment
    // id pair — it says nothing about whether the amount actually captured
    // matches this specific cart. Fetch Razorpay's own record of the payment
    // (can't be forged by the client) and recompute the expected total from
    // real WooCommerce prices, then require them to match before ever
    // creating the WooCommerce order.
    let razorpayPayment
    try {
        razorpayPayment = await fetchRazorpayPayment(payment.razorpay_payment_id)
    } catch {
        return NextResponse.json({ error: 'Could not verify payment with Razorpay' }, { status: 502 })
    }

    if (razorpayPayment.order_id !== payment.razorpay_order_id || razorpayPayment.status !== 'captured') {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    let expectedTotal: number
    try {
        expectedTotal = await computeOrderTotal({
            items,
            shippingMethod,
            couponCode: typeof couponCode === 'string' ? couponCode : undefined,
        })
    } catch {
        return NextResponse.json({ error: 'Could not price cart' }, { status: 400 })
    }

    if (Math.round(expectedTotal * 100) !== razorpayPayment.amount) {
        return NextResponse.json({ error: 'Paid amount does not match cart total' }, { status: 400 })
    }

    const auth = Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64')

    const lineItems = items.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
        meta_data: [
            ...(item.color ? [{ key: 'Color', value: String(item.color).slice(0, 50) }] : []),
            ...(item.size ? [{ key: 'Size', value: String(item.size).slice(0, 20) }] : []),
        ],
    }))

    const shippingLines = [
        shippingMethod === 'express'
            ? { method_id: 'flat_rate', method_title: 'Express · 2–3 working days', total: '299.00' }
            : { method_id: 'free_shipping', method_title: 'Standard · 5–7 working days', total: '0.00' },
    ]

    const order = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay',
        set_paid: true,
        status: 'processing',
        billing: {
            first_name: form.firstName.trim(),
            last_name: (form.lastName || '').trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address_1: form.address.trim(),
            city: form.city.trim(),
            state: (form.state || '').trim(),
            postcode: form.pincode.trim(),
            country: 'IN',
        },
        shipping: {
            first_name: form.firstName.trim(),
            last_name: (form.lastName || '').trim(),
            address_1: form.address.trim(),
            city: form.city.trim(),
            state: (form.state || '').trim(),
            postcode: form.pincode.trim(),
            country: 'IN',
        },
        line_items: lineItems,
        shipping_lines: shippingLines,
        ...(typeof couponCode === 'string' && couponCode.trim() ? { coupon_lines: [{ code: couponCode.trim() }] } : {}),
        meta_data: [
            { key: 'email_opt_in', value: emailOptIn ? 'yes' : 'no' },
            { key: 'razorpay_order_id', value: payment.razorpay_order_id },
            { key: 'razorpay_payment_id', value: payment.razorpay_payment_id },
        ],
        transaction_id: payment.razorpay_payment_id,
        customer_note: `Order placed via Duroo headless store. Items: ${items.map((i: any) => `${i.name} (${i.color || ''} ${i.size || ''} x${i.quantity})`).join(', ')}`,
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        })

        if (!res.ok) {
            const errBody = await res.json().catch(() => null)
            return NextResponse.json(
                { error: errBody?.message || 'Failed to create order with WooCommerce' },
                { status: 502 }
            )
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
    }
}