// lib/pricing.ts
// Server-side, authoritative cart pricing. Never trust a client-supplied total —
// recompute it from real WooCommerce product prices so the Razorpay charge and
// the WooCommerce order can't be forged by editing localStorage/devtools.
import { getProductById, getProductVariations } from './woocommerce'
import type { WCVariation } from './types'

// id is always the parent product id. variationId, when present, means this
// line is a specific color/size variant — it must be priced from *its own*
// price/stock, never the parent's, or a customer could be charged the wrong
// amount for whichever variant happens to be cheaper/more expensive.
export type PricedItem = { id: number; quantity: number; variationId?: number }

const SHIPPING_COST: Record<string, number> = { standard: 0, express: 299 }

export function shippingCostFor(shippingMethod: string): number {
    return SHIPPING_COST[shippingMethod] ?? 0
}

export async function computeSubtotal(items: PricedItem[]): Promise<number> {
    const uniqueIds = [...new Set(items.map((i) => i.id))]
    const products = await Promise.all(uniqueIds.map((id) => getProductById(id)))
    const productById = new Map(products.map((p) => [p.id, p]))

    // Only fetch variations for products that actually have a variant line
    // item in the cart — most carts won't touch this at all.
    const variantProductIds = [...new Set(items.filter((i) => i.variationId != null).map((i) => i.id))]
    const variationLists: WCVariation[][] = await Promise.all(
        variantProductIds.map((id) => getProductVariations(id))
    )
    const variationById = new Map<number, WCVariation>()
    for (const list of variationLists) {
        for (const v of list) variationById.set(v.id, v)
    }

    return items.reduce((sum, item) => {
        let price: number | undefined
        let stockStatus: string | undefined

        if (item.variationId != null) {
            const variation = variationById.get(item.variationId)
            if (!variation) {
                throw new Error(`Variation ${item.variationId} not found for product ${item.id}`)
            }
            price = parseFloat(variation.price || '0')
            stockStatus = variation.stock_status
        } else {
            const product = productById.get(item.id)
            if (!product) {
                throw new Error(`Product ${item.id} could not be priced`)
            }
            price = parseFloat(product.price || '0')
            stockStatus = product.stock_status
        }

        if (price === undefined || Number.isNaN(price)) {
            throw new Error(`Product ${item.id} could not be priced`)
        }
        if (stockStatus === 'outofstock') {
            throw new Error(`Product ${item.id} is out of stock`)
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
