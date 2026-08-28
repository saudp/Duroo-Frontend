// lib/razorpay.ts
import crypto from 'crypto'

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

function razorpayAuth() {
    return Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')
}

// Amount must be in paise (smallest currency unit) — Razorpay's API takes ₹1 as `100`.
export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${razorpayAuth()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: Math.round(amountInRupees * 100),
            currency: 'INR',
            receipt,
        }),
    })

    if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.error?.description || 'Failed to create Razorpay order')
    }

    return res.json()
}

// Fetches Razorpay's own record of the payment — the only source that can't be
// forged by the client, unlike the razorpay_order_id/payment_id/signature trio
// which merely prove *a* payment happened, not that it was for the right amount.
export async function fetchRazorpayPayment(paymentId: string): Promise<{
    id: string
    order_id: string
    amount: number
    status: string
}> {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Basic ${razorpayAuth()}` },
    })
    if (!res.ok) {
        throw new Error('Could not verify payment with Razorpay')
    }
    return res.json()
}

const HEX_64 = /^[0-9a-f]{64}$/i

export function verifyRazorpaySignature({
    orderId,
    paymentId,
    signature,
}: {
    orderId: string
    paymentId: string
    signature: string
}) {
    if (!HEX_64.test(signature)) return false

    const expected = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET || '')
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature.toLowerCase(), 'hex'))
}
