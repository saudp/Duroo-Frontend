'use client'

// LoadMoreProducts — renders the PLP's product grid and owns the one piece of
// PLP state that genuinely needs a client component: appending subsequent
// pages fetched from /api/products without a full page reload. Everything
// else on the PLP (filters, sort, category, view) is server-rendered links.
import { useState } from 'react'
import ProductCard from '@/components/home/ProductCard'
import Mono from '@/components/duroo/Mono'
import type { WCProduct } from '@/lib/types'

export default function LoadMoreProducts({
  initialProducts,
  initialPage,
  totalPages,
  total,
  queryString,
  gridColsClass,
}: {
  initialProducts: WCProduct[]
  initialPage: number
  totalPages: number
  total: number
  /** Current filter/sort query string, without a `page` param. */
  queryString: string
  gridColsClass: string
}) {
  const [products, setProducts] = useState(initialProducts)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasMore = page < totalPages

  const loadMore = async () => {
    setLoading(true)
    setError(null)
    const nextPage = page + 1
    const sep = queryString ? '&' : ''
    try {
      const res = await fetch(`/api/products?${queryString}${sep}page=${nextPage}`)
      if (!res.ok) throw new Error('request failed')
      const data = await res.json()
      setProducts((prev) => [...prev, ...data.products])
      setPage(nextPage)
    } catch {
      setError('Could not load more products. Please try again.')
    }
    setLoading(false)
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Mono size={10} op={0.55}>No pieces match these filters</Mono>
      </div>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-2 ${gridColsClass}`} style={{ gap: '12px', rowGap: '36px' }}>
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 56 }}>
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              all: 'unset',
              cursor: loading ? 'default' : 'pointer',
              padding: '14px 28px',
              fontFamily: 'var(--ff-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              border: '1px solid rgba(12,12,12,0.18)',
              borderRadius: 999,
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Loading…' : 'Load more →'}
          </button>
        )}
        {error && (
          <div style={{ marginTop: 14 }}>
            <Mono size={10} op={1} style={{ color: '#B3261E' }}>{error}</Mono>
          </div>
        )}
        <div style={{ marginTop: 18 }}>
          <Mono size={10} op={0.5}>Showing {products.length} of {total} pieces</Mono>
        </div>
      </div>
    </>
  )
}
