// lib/pricing.ts
// Server-side, authoritative cart pricing. Never trust a client-supplied total —
// recompute it from real WooCommerce product prices so the Razorpay charge and
// the WooCommerce order can't be forged by editing localStorage/devtools.
import { getProductById } from './woocommerce'

export type PricedItem = { id: number; quantity: number }

const SHIPPING_COST: Record<string, number> = { standard: 0, express: 299 }

export function shippingCostFor(shippingMethod: string): number {
    return SHIPPING_COST[shippingMethod] ?? 0
}

export async function computeSubtotal(items: PricedItem[]): Promise<number> {
    const uniqueIds = [...new Set(items.map((i) => i.id))]
    const products = await Promise.all(uniqueIds.map((id) => getProductById(id)))
    const priceById = new Map(products.map((p) => [p.id, parseFloat(p.price || '0')]))

    return items.reduce((sum, item) => {
        const price = priceById.get(item.id)
        if (price === undefined || Number.isNaN(price)) {
            throw new Error(`Product ${item.id} could not be priced`)
        }
        return sum + price * item.quantity
    }, 0)
}

// Mirrors the discount rules in app/api/apply-coupon/route.ts. Any coupon that
// isn't currently valid silently contributes zero discount — WooCommerce will
// independently re-validate coupon_lines when the order is actually created,
// so this only needs to match closely enough to price the Razorpay charge.
export async function computeCouponDiscount(code: string, subtotal: number): Promise<number> {
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`,
        { headers: { Authorization: `Basic ${auth}` } }
    )
    if (!res.ok) return 0

    const matches = await res.json()
    const coupon = Array.isArray(matches) ? matches[0] : null
    if (!coupon) return 0

    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) return 0

    const minAmount = parseFloat(coupon.minimum_amount || '0')
    if (minAmount > 0 && subtotal < minAmount) return 0

    const maxAmount = parseFloat(coupon.maximum_amount || '0')
    if (maxAmount > 0 && subtotal > maxAmount) return 0

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return 0

    const amount = parseFloat(coupon.amount || '0')
    if (coupon.discount_type === 'percent') {
        return Math.min(Math.round(subtotal * (amount / 100)), subtotal)
    }
    if (coupon.discount_type === 'fixed_cart') {
        return Math.min(Math.round(amount), subtotal)
    }
    return 0
}

export async function computeOrderTotal({
    items,
    shippingMethod,
    couponCode,
}: {
    items: PricedItem[]
    shippingMethod: string
    couponCode?: string
}): Promise<number> {
    const subtotal = await computeSubtotal(items)
    const shipping = shippingCostFor(shippingMethod)
    const discount = couponCode ? await computeCouponDiscount(couponCode, subtotal) : 0
    return Math.max(subtotal + shipping - discount, 0)
}
