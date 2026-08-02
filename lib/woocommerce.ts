// lib/woocommerce.ts

const WC_URL = process.env.NEXT_PUBLIC_WP_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

async function wcFetch(endpoint: string) {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/${endpoint}`, {
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // cache for 1 hour (ISR)
    })

    if (!res.ok) {
        throw new Error(`WooCommerce API error: ${res.status}`)
    }

    return res.json()
}

// ─── Products ───────────────────────────────────────────

export async function getProducts() {
    return wcFetch('products?per_page=20&status=publish')
}

export async function getProductBySlug(slug: string) {
    const products = await wcFetch(`products?slug=${slug}`)
    return products[0] || null
}

export async function getProductById(id: number) {
    return wcFetch(`products/${id}`)
}

// ─── Orders ─────────────────────────────────────────────

export async function getOrders() {
    return wcFetch('orders?per_page=20')
}

export async function getOrderById(id: number) {
    return wcFetch(`orders/${id}`)
}

// ─── Categories ─────────────────────────────────────────

export async function getCategories() {
    return wcFetch('products/categories?per_page=20')
}