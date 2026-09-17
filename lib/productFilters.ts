// lib/productFilters.ts
// Shared filter/sort/price-bucket definitions for the PLP (app/products/page.tsx),
// its "Load more" client fetch (app/api/products/route.ts), and the sidebar
// links (components/shop/PLPFilters.tsx) — kept in one place so those three
// can't drift into disagreeing about what `?sort=price-asc` means.

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export const SORT_OPTIONS: Record<SortKey, { label: string; orderby?: 'date' | 'price'; order?: 'asc' | 'desc' }> = {
    featured: { label: 'Featured' },
    'price-asc': { label: 'Price: Low to High', orderby: 'price', order: 'asc' },
    'price-desc': { label: 'Price: High to Low', orderby: 'price', order: 'desc' },
    newest: { label: 'Newest', orderby: 'date', order: 'desc' },
}

export type PriceBucketKey = 'under-500' | '500-1500' | '1500-3000' | '3000-plus'

export const PRICE_BUCKETS: Record<PriceBucketKey, { label: string; min?: number; max?: number }> = {
    'under-500': { label: 'Under ₹500', max: 500 },
    '500-1500': { label: '₹500 – ₹1,500', min: 500, max: 1500 },
    '1500-3000': { label: '₹1,500 – ₹3,000', min: 1500, max: 3000 },
    '3000-plus': { label: '₹3,000+', min: 3000 },
}

export type ParsedProductQuery = {
    category?: string
    colors: string[]
    sizes: string[]
    search?: string
    sort: SortKey
    priceKey?: PriceBucketKey
    minPrice?: number
    maxPrice?: number
    page: number
}

function isSortKey(v: string | null): v is SortKey {
    return !!v && v in SORT_OPTIONS
}

function isPriceBucketKey(v: string | null): v is PriceBucketKey {
    return !!v && v in PRICE_BUCKETS
}

// Builds a /products href from the current params plus a set of changes.
// `null` removes a key entirely; an array replaces all values for that key.
// Any change implicitly resets `page` back to 1, unless the caller is
// explicitly the one changing `page`.
export function buildProductsHref(current: URLSearchParams, updates: Record<string, string | string[] | null>): string {
    const next = new URLSearchParams(current)
    for (const [key, val] of Object.entries(updates)) {
        next.delete(key)
        if (val === null) continue
        if (Array.isArray(val)) val.forEach((v) => next.append(key, v))
        else next.set(key, val)
    }
    if (!('page' in updates)) next.delete('page')
    const qs = next.toString()
    return `/products${qs ? `?${qs}` : ''}`
}

// For multi-select facets (color, size): clicking an active value removes it
// from the list, clicking an inactive one adds it — other selected values
// in the same facet are preserved.
export function toggleMultiValueHref(current: URLSearchParams, key: string, value: string): string {
    const existing = current.getAll(key)
    const next = existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value]
    return buildProductsHref(current, { [key]: next.length ? next : null })
}

// For single-select facets (category, price bucket, sort): clicking the
// active value clears the facet; clicking any other value replaces it.
export function toggleSingleValueHref(current: URLSearchParams, key: string, value: string): string {
    const isActive = current.get(key) === value
    return buildProductsHref(current, { [key]: isActive ? null : value })
}

// Reads a URLSearchParams (from either the PLP's searchParams prop, converted,
// or the /api/products route's request URL) into a typed, validated query.
// Unknown/malformed values fall back to safe defaults rather than erroring —
// a bookmarked or hand-edited URL should never crash the page.
export function parseProductQuery(params: URLSearchParams): ParsedProductQuery {
    const sortParam = params.get('sort')
    const sort = isSortKey(sortParam) ? sortParam : 'featured'

    const priceParam = params.get('price')
    const priceKey = isPriceBucketKey(priceParam) ? priceParam : undefined
    const priceRange = priceKey ? PRICE_BUCKETS[priceKey] : undefined

    const pageParam = parseInt(params.get('page') ?? '1', 10)

    return {
        // URL param is `cat`, matching the existing home-page category tile
        // links (/products?cat=slug) — kept as `category` internally since
        // that's the field WooCommerce's own REST API param is named.
        category: params.get('cat') ?? undefined,
        colors: params.getAll('color'),
        sizes: params.getAll('size'),
        search: params.get('search') ?? undefined,
        sort,
        priceKey,
        minPrice: priceRange?.min,
        maxPrice: priceRange?.max,
        page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
    }
}
