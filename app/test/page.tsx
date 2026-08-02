// app/test/page.tsx
import { getProducts } from '@/lib/woocommerce'

export default async function TestPage() {
    const products = await getProducts()

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>WooCommerce API Test</h1>
            <p>Found {products.length} products</p>
            <pre>{JSON.stringify(products[0], null, 2)}</pre>
        </div>
    )
}