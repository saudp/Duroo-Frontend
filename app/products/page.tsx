// app/products/page.tsx — Duroo PLP: Men's Bestsellers
import { getProducts } from '@/lib/woocommerce'
import Mono from '@/components/duroo/Mono'
import ProductCard from '@/components/home/ProductCard'
import Announce from '@/components/home/Announce'
import Nav from '@/components/home/Nav'
import Footer from '@/components/home/Footer'
import type { WCProduct } from '@/lib/types'

export const revalidate = 3600

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'
const SF = 'var(--ff-serif)'

const COLORS = [
  { c: '#0A0A0A', n: 'Ink' },
  { c: '#F5F4F0', n: 'Bone' },
  { c: '#E6E2D7', n: 'Sand' },
  { c: '#7C7973', n: 'Stone' },
  { c: '#3A4E3B', n: 'Moss' },
  { c: '#9C7A50', n: 'Cognac' },
  { c: '#A8B5C4', n: 'Mist' },
  { c: '#5A4A3C', n: 'Earth' },
]

const FILTER_GROUPS: Array<{
  head: string
  items?: string[]
  colors?: { c: string; n: string }[]
}> = [
    { head: 'Audience', items: ['Men', 'Women', 'Unisex'] },
    { head: 'Category', items: ['Knitwear', 'Shirting', 'Trousers', 'Outerwear', 'Essentials'] },
    { head: 'Color', colors: COLORS },
    { head: 'Size', items: ['XS', 'S', 'M', 'L', 'XL', '2XL'] },
    { head: 'Price', items: ['Under ₹500', '₹500 – ₹1,500', '₹1,500 – ₹3,000', '₹3,000+'] },
  ]

export default async function ProductsPage() {
  const products: WCProduct[] = await getProducts()

  return (
    <>
    <Announce />
    <Nav />
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
            <button
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 14px',
                fontFamily: MF,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid rgba(12,12,12,0.18)',
                borderRadius: 999,
              }}
            >
              <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span style={{ display: 'inline-block', width: 12, height: 1, background: 'currentColor' }} />
                <span style={{ display: 'inline-block', width: 8, height: 1, background: 'currentColor' }} />
                Filters
              </span>
            </button>
            <Mono size={10} op={0.55}>{products.length} pieces</Mono>
          </div>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 18 }}>
            <Mono size={10} op={0.8}>
              Sort ·{' '}
              <span style={{ borderBottom: '1px solid currentColor', paddingBottom: 1 }}>Featured</span>
            </Mono>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Mono size={10} op={0.55}>View</Mono>
              {[2, 3, 4].map((n) => (
                <span
                  key={n}
                  style={{
                    width: 22,
                    height: 22,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: n === 4 ? 'var(--c-ink)' : 'transparent',
                    color: n === 4 ? 'var(--c-paper)' : 'inherit',
                    fontFamily: MF,
                    fontSize: 10,
                    opacity: n === 4 ? 1 : 0.6,
                    cursor: 'pointer',
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + product grid ── */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(20px,2vw,32px) clamp(22px,3vw,48px) clamp(56px,6vw,88px)' }}>
        <div className="md:grid" style={{ gridTemplateColumns: '220px 1fr', gap: 56, alignItems: 'flex-start' }}>

          {/* Sidebar — desktop only */}
          <aside
            className="hidden md:flex"
            style={{ flexDirection: 'column', gap: 28, position: 'sticky', top: 80 }}
          >
            {FILTER_GROUPS.map((g) => (
              <div key={g.head}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <Mono size={10} op={0.55}>{g.head}</Mono>
                  <span style={{ fontFamily: BF, fontSize: 14, opacity: 0.55 }}>–</span>
                </div>

                {g.head === 'Size' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {g.items?.map((s) => (
                      <span
                        key={s}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '10px 0',
                          fontFamily: MF,
                          fontSize: 11,
                          letterSpacing: '0.18em',
                          border: '1px solid rgba(12,12,12,0.18)',
                          background: s === 'M' ? 'var(--c-ink)' : 'transparent',
                          color: s === 'M' ? 'var(--c-paper)' : 'inherit',
                          cursor: 'pointer',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : g.head === 'Color' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {g.colors?.map((c, i) => (
                      <div
                        key={c.n}
                        title={c.n}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                      >
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            background: c.c,
                            display: 'inline-block',
                            border: (c.c === '#F5F4F0' || c.c === '#E6E2D7') ? '1px solid rgba(12,12,12,0.15)' : 'none',
                            outline: i === 0 ? '1px solid rgba(12,12,12,0.55)' : 'none',
                            outlineOffset: 2,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: MF,
                            fontSize: 8.5,
                            letterSpacing: '0.12em',
                            opacity: 0.55,
                            textTransform: 'uppercase',
                          }}
                        >
                          {c.n}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {g.items?.map((it, i) => (
                      <label
                        key={it}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: BF, fontSize: 13.5 }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            width: 13,
                            height: 13,
                            border: '1px solid rgba(12,12,12,0.35)',
                            background: i === 0 ? 'var(--c-ink)' : 'transparent',
                          }}
                        />
                        <span style={{ opacity: 0.85 }}>{it}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '10px 16px',
                fontFamily: MF,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid rgba(12,12,12,0.35)',
                borderRadius: 999,
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Clear filters
            </button>
          </aside>

          {/* Product grid */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '12px', rowGap: '36px' }}>
              {products.map((p: WCProduct, i: number) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <button
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '14px 28px',
                  fontFamily: MF,
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(12,12,12,0.18)',
                  borderRadius: 999,
                }}
              >
                Load more →
              </button>
              <div style={{ marginTop: 18 }}>
                <Mono size={10} op={0.5}>Showing {products.length} pieces</Mono>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
