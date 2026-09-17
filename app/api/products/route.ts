// app/api/products/route.ts
// Backs the PLP's "Load more" button: same filters as the page itself
// (via the shared lib/productFilters parser), one page further.
import { NextResponse } from 'next/server'
import { getFilteredProducts } from '@/lib/woocommerce'
import { parseProductQuery } from '@/lib/productFilters'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = parseProductQuery(searchParams)

    try {
        const result = await getFilteredProducts(query)
        return NextResponse.json(result)
    } catch {
        return NextResponse.json({ error: 'Could not load products' }, { status: 502 })
    }
}
