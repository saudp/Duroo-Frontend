// app/products/page.tsx — Duroo PLP: Men's Bestsellers
import { getCategories, getFilteredProducts } from '@/lib/woocommerce'
import { parseProductQuery, buildProductsHref, toggleSingleValueHref, SORT_OPTIONS, type SortKey } from '@/lib/productFilters'
import Mono from '@/components/duroo/Mono'
import PLPFilters from '@/components/shop/PLPFilters'
import LoadMoreProducts from '@/components/shop/LoadMoreProducts'
import Link from 'next/link'
import type { WCCategory } from '@/lib/types'

export const revalidate = 3600

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'
const SF = 'var(--ff-serif)'

const VIEW_COLS_CLASS: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams

  // Rebuild a real URLSearchParams from Next's parsed searchParams object —
  // it's what every filter link, and the shared lib/productFilters parser,
  // is built around.
  const current = new URLSearchParams()
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue
    if (Array.isArray(value)) value.forEach((v) => current.append(key, v))
    else current.set(key, value)
  }

  const query = parseProductQuery(current)
  const view = current.get('view') === '2' || current.get('view') === '3' ? current.get('view')! : '4'
  const gridColsClass = VIEW_COLS_CLASS[view]

  const [{ products, total, totalPages }, categories]: [Awaited<ReturnType<typeof getFilteredProducts>>, WCCategory[]] =
    await Promise.all([getFilteredProducts(query), getCategories()])

  const withoutPage = new URLSearchParams(current)
  withoutPage.delete('page')
  const queryString = withoutPage.toString()

  const hasActiveFilters = !!(query.category || query.colors.length || query.sizes.length || query.priceKey)

  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>

      {/* ── Editorial header ── */}
      <section style={{ borderBottom: '1px solid rgba(12,12,12,0.08)' }}>
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: 'clamp(28px,3.5vw,52px) clamp(22px,3vw,48px) clamp(16px,2vw,28px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Mono size={10} op={0.55}>
                Home <span style={{ padding: '0 8px' }}>›</span>
                Men <span style={{ padding: '0 8px' }}>›</span>
                Bestsellers
              </Mono>
              <h1
                style={{
                  fontFamily: HF,
                  fontWeight: 400,
                  fontSize: 'clamp(52px, 7.8vw, 112px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.035em',
                  margin: 0,
                }}
              >
                Men&apos;s{' '}
                <span style={{ fontFamily: SF, fontStyle: 'italic', letterSpacing: '-0.02em', fontWeight: 400 }}>
                  Bestsellers.
                </span>
              </h1>
              <p
                style={{
                  fontFamily: BF,
                  fontSize: 'clamp(14px, 1vw, 15px)',
                  lineHeight: 1.55,
                  opacity: 0.7,
                  margin: 0,
                  maxWidth: 540,
                }}
              >
                The pieces that move first. Performance fabrics, drawn in the language of restraint — sized to ship today.
              </p>
            </div>
            <Mono size={10} op={0.55} className="hidden md:block" style={{ paddingBottom: 14 }}>
              Updated weekly
            </Mono>
          </div>
        </div>
      </section>

      {/* ── Sticky toolbar ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--c-paper)',
          borderBottom: '1px solid rgba(12,12,12,0.08)',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: 'clamp(10px,1.5vw,20px) clamp(22px,3vw,48px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Mobile filter disclosure — <details> so it needs no client JS */}
            <details className="md:hidden">
              <summary
                style={{
                  listStyle: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  fontFamily: MF,
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  border: `1px solid ${hasActiveFilters ? 'var(--c-ink)' : 'rgba(12,12,12,0.18)'}`,
                  borderRadius: 999,
                  display: 'inline-flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <span style={{ display: 'inline-block', width: 12, height: 1, background: 'currentColor' }} />
                <span style={{ display: 'inline-block', width: 8, height: 1, background: 'currentColor' }} />
                Filters
              </summary>
              <div style={{ padding: '20px 4px', maxWidth: 320 }}>
                <PLPFilters current={current} categories={categories} />
              </div>
            </details>
            <Mono size={10} op={0.55}>{total} pieces</Mono>
          </div>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 18 }}>
            {/* Sort — <details> disclosure of real links */}
            <details style={{ position: 'relative' }}>
              <summary style={{ listStyle: 'none', cursor: 'pointer' }}>
                <Mono size={10} op={0.8}>
                  Sort ·{' '}
                  <span style={{ borderBottom: '1px solid currentColor', paddingBottom: 1 }}>
                    {SORT_OPTIONS[query.sort].label}
                  </span>
                </Mono>
              </summary>
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 8,
                  background: 'var(--c-paper)',
                  border: '1px solid rgba(12,12,12,0.14)',
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minWidth: 180,
                  zIndex: 30,
                }}
              >
                {(Object.keys(SORT_OPTIONS) as SortKey[]).map((key) => (
                  <Link
                    key={key}
                    href={toggleSingleValueHref(current, 'sort', key)}
                    style={{
                      display: 'block',
                      padding: '8px 10px',
                      fontFamily: BF,
                      fontSize: 13,
                      textDecoration: 'none',
                      color: 'inherit',
                      background: query.sort === key ? 'rgba(12,12,12,0.06)' : 'transparent',
                    }}
                  >
                    {SORT_OPTIONS[key].label}
                  </Link>
                ))}
              </div>
            </details>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Mono size={10} op={0.55}>View</Mono>
              {(['2', '3', '4'] as const).map((n) => (
                <Link
                  key={n}
                  href={buildProductsHref(current, { view: n === '4' ? null : n, page: null })}
                  style={{
                    width: 22,
                    height: 22,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: n === view ? 'var(--c-ink)' : 'transparent',
                    color: n === view ? 'var(--c-paper)' : 'inherit',
                    fontFamily: MF,
                    fontSize: 10,
                    opacity: n === view ? 1 : 0.6,
                    textDecoration: 'none',
                  }}
                >
                  {n}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + product grid ── */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(20px,2vw,32px) clamp(22px,3vw,48px) clamp(56px,6vw,88px)' }}>
        <div className="md:grid" style={{ gridTemplateColumns: '220px 1fr', gap: 56, alignItems: 'flex-start' }}>

          {/* Sidebar — desktop only, mobile uses the <details> above */}
          <aside className="hidden md:flex" style={{ flexDirection: 'column', position: 'sticky', top: 80 }}>
            <PLPFilters current={current} categories={categories} />
          </aside>

          {/* Product grid */}
          <div>
            <LoadMoreProducts
              initialProducts={products}
              initialPage={query.page}
              totalPages={totalPages}
              total={total}
              queryString={queryString}
              gridColsClass={gridColsClass}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
