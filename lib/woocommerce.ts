// lib/woocommerce.ts

import type { WCCategory, WCOrder, WCProduct } from './types'
import { SORT_OPTIONS, type ParsedProductQuery } from './productFilters'

const WC_URL = process.env.NEXT_PUBLIC_WP_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

// Thrown by wcFetchRaw so callers that care (getOrderById) can tell "this
// specific thing doesn't exist" (404) apart from "WooCommerce is unreachable
// or misconfigured" (everything else) — a generic Error loses the status
// code, which collapses that distinction.
export class WCApiError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message)
        this.name = 'WCApiError'
        this.status = status
    }
}

async function wcFetchRaw(endpoint: string, opts: { cache?: boolean } = {}) {
    const cache = opts.cache ?? true
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/${endpoint}`, {
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        // Product/category data is fine cached for an hour (ISR). Order
        // lookups opt out — a customer landing on their own confirmation
        // page right after paying should never see a stale cached order.
        ...(cache ? { next: { revalidate: 3600 } } : { cache: 'no-store' as const }),
    })

    if (!res.ok) {
        throw new WCApiError(res.status, `WooCommerce API error: ${res.status}`)
    }

    return res
}

async function wcFetch(endpoint: string, opts?: { cache?: boolean }) {
    const res = await wcFetchRaw(endpoint, opts)
    return res.json()
}

// Same as wcFetch, but also surfaces WooCommerce's pagination headers — needed
// by any listing endpoint (products) that has to know the *real* total count
// rather than assuming there's always another page.
async function wcFetchWithMeta(endpoint: string) {
    const res = await wcFetchRaw(endpoint)
    const data = await res.json()
    const total = Number(res.headers.get('X-WP-Total') ?? (Array.isArray(data) ? data.length : 0))
    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1)
    return { data, total, totalPages }
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

// Variable products (type: 'variable') don't carry a real price/stock on the
// parent — each color/size combination is its own "variation" with its own
// price and stock_status. per_page=100 covers any realistic attribute matrix;
// WC's default of 10 would silently truncate anything bigger.
export async function getProductVariations(productId: number) {
    return wcFetch(`products/${productId}/variations?per_page=100`)
}

// ─── Orders ─────────────────────────────────────────────

export async function getOrders() {
    return wcFetch('orders?per_page=20', { cache: false })
}

// Returns null for a genuinely nonexistent order (404) so the caller can
// render a normal "not found" state. Any other failure (WC unreachable, auth
// broken, ...) rethrows — that's a real error, not "this order doesn't
// exist", and callers should show an error state instead of a false negative.
export async function getOrderById(id: number): Promise<WCOrder | null> {
    try {
        return await wcFetch(`orders/${id}`, { cache: false })
    } catch (err) {
        if (err instanceof WCApiError && err.status === 404) return null
        throw err
    }
}

// ─── Categories ─────────────────────────────────────────

export async function getCategories() {
    return wcFetch('products/categories?per_page=20')
}

// ─── PLP filtering ──────────────────────────────────────

export type ProductListResult = {
    products: WCProduct[]
    total: number
    totalPages: number
}

// Color/size come from each product's own `attributes` array (works whether
// duroo.in has them set up as global attribute taxonomies or per-product
// custom attributes — WC's REST `attribute`/`attribute_term` params only
// support the former, and we can't confirm which one is configured, so
// filtering by reading the already-returned attributes is the option that
// works either way).
function matchesAttribute(product: WCProduct, key: 'color' | 'size', wanted: string[]): boolean {
    if (wanted.length === 0) return true
    const names = key === 'color' ? ['color', 'colour'] : ['size']
    const attr = product.attributes?.find((a) => names.includes(a.name.toLowerCase()))
    if (!attr) return false
    return attr.options.some((opt) => wanted.includes(opt))
}

// The PLP's real, filtered/sorted/paginated product list. Category is
// resolved from a slug to the WC category id (the REST `category` param
// wants an id, not a slug). min_price/max_price/orderby/order/search are
// forwarded straight to WooCommerce — those are documented, taxonomy-agnostic
// REST params so they're safe to trust regardless of store configuration.
export async function getFilteredProducts(query: ParsedProductQuery): Promise<ProductListResult> {
    const perPage = 20
    const hasAttributeFilter = query.colors.length > 0 || query.sizes.length > 0

    const params = new URLSearchParams()
    params.set('status', 'publish')
    if (query.search) params.set('search', query.search)
    const sortDef = SORT_OPTIONS[query.sort]
    if (sortDef.orderby) params.set('orderby', sortDef.orderby)
    if (sortDef.order) params.set('order', sortDef.order)
    if (query.minPrice != null) params.set('min_price', String(query.minPrice))
    if (query.maxPrice != null) params.set('max_price', String(query.maxPrice))

    if (query.category) {
        const categories: WCCategory[] = await getCategories()
        const match = categories.find((c) => c.slug === query.category)
        // Unknown category slug → genuinely zero results, not an error. A
        // stale/hand-edited URL shouldn't crash the page.
        if (!match) return { products: [], total: 0, totalPages: 0 }
        params.set('category', String(match.id))
    }

    // Attribute (color/size) filtering happens client-side below on whatever
    // page WooCommerce returns, so when it's active we pull a bigger page
    // from WC and paginate the *filtered* results ourselves instead of
    // trusting WC's total (which wouldn't have applied this filter).
    params.set('per_page', String(hasAttributeFilter ? 100 : perPage))
    params.set('page', String(hasAttributeFilter ? 1 : query.page))

    const { data, total, totalPages } = await wcFetchWithMeta(`products?${params.toString()}`)
    let products: WCProduct[] = data

    if (hasAttributeFilter) {
        products = products.filter(
            (p) => matchesAttribute(p, 'color', query.colors) && matchesAttribute(p, 'size', query.sizes)
        )
        const start = (query.page - 1) * perPage
        return {
            products: products.slice(start, start + perPage),
            total: products.length,
            totalPages: Math.max(1, Math.ceil(products.length / perPage)),
        }
    }

    return { products, total, totalPages }
}