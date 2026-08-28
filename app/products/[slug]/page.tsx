// app/products/[slug]/page.tsx — Duroo PDP
import { getProductBySlug, getProducts } from '@/lib/woocommerce'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Mono from '@/components/duroo/Mono'
import ProductRail from '@/components/home/ProductRail'
import PDPProductInfo from '@/components/shop/PDPProductInfo'
import type { WCProduct } from '@/lib/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p: WCProduct) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, allProducts]: [WCProduct, WCProduct[]] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ])

  if (!product) return notFound()

  const colors = product.attributes?.find(
    (a) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour'
  )?.options ?? []
  const sizes = product.attributes?.find(
    (a) => a.name.toLowerCase() === 'size'
  )?.options ?? []

  const related = allProducts.filter((p: WCProduct) => p.id !== product.id).slice(0, 6)

  const HF = 'var(--ff-head)'
  const BF = 'var(--ff-body)'
  const MF = 'var(--ff-mono)'
  const SF = 'var(--ff-serif)'

  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: 'clamp(14px,1.5vw,20px) clamp(22px,3vw,48px)',
          borderBottom: '1px solid rgba(12,12,12,0.06)',
          fontFamily: MF,
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <span>Home</span><span>›</span>
        <span>Men</span><span>›</span>
        <span>Knitwear</span><span>›</span>
        <span style={{ opacity: 0.6 }}>{product.name}</span>
      </div>

      {/* ── Hero: gallery + info ── */}
      <section style={{ maxWidth: 1440, margin: '0 auto' }}>

        {/* Desktop: 2-col */}
        <div
          className="hidden md:grid"
          style={{ gridTemplateColumns: '1fr 460px', gap: 48, padding: '32px 48px 80px', alignItems: 'flex-start' }}
        >
          {/* Image gallery — 2-col grid of up to 6 shots */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {product.images.length > 0 ? (
              product.images.slice(0, 6).map((img, i) => (
                <div
                  key={img.src}
                  style={{
                    position: 'relative',
                    height: 620,
                    background: 'var(--c-cream)',
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i < 2}
                  />
                </div>
              ))
            ) : (
              /* Placeholder grid when no images */
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 620,
                    background: 'var(--c-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mono size={10} op={0.3}>No image</Mono>
                </div>
              ))
            )}
          </div>

          {/* Sticky product info */}
          <div style={{ position: 'sticky', top: 32 }}>
            <PDPProductInfo
              id={product.id}
              name={product.name}
              price={product.price}
              regularPrice={product.regular_price}
              onSale={product.on_sale}
              slug={product.slug}
              image={product.images[0]?.src ?? ''}
              colors={colors}
              sizes={sizes}
              shortDescription={(product as any).short_description}
              description={(product as any).description}
            />
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden">
          {/* Horizontal scroll gallery */}
          <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
            {(product.images.length > 0 ? product.images.slice(0, 4) : [null]).map((img, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 100%',
                  scrollSnapAlign: 'start',
                  height: 480,
                  position: 'relative',
                  background: 'var(--c-cream)',
                }}
              >
                {img && (
                  <Image
                    src={img.src}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={i === 0}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: '24px 22px 0' }}>
            <PDPProductInfo
              id={product.id}
              name={product.name}
              price={product.price}
              regularPrice={product.regular_price}
              onSale={product.on_sale}
              slug={product.slug}
              image={product.images[0]?.src ?? ''}
              colors={colors}
              sizes={sizes}
              shortDescription={(product as any).short_description}
              description={(product as any).description}
            />
          </div>
        </div>
      </section>

      {/* ── Fabric moment ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(1fr, 58%, 1.4fr) 1fr',
          background: 'var(--c-cream)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
        className="grid-cols-1 md:grid-cols-[1.4fr_1fr]"
      >
        {/* Image */}
        <div
          style={{ position: 'relative', height: 'clamp(280px, 43vw, 620px)', background: 'var(--c-canvas)' }}
          className="min-h-[280px] md:min-h-[620px]"
        >
          {product.images[1] ? (
            <Image
              src={product.images[1].src}
              alt={product.images[1].alt || product.name}
              fill
              className="object-cover"
              sizes="60vw"
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mono size={10} op={0.3}>Fabric detail</Mono>
            </div>
          )}
        </div>

        {/* Text */}
        <div
          style={{
            padding: 'clamp(40px,5vw,88px) clamp(28px,4.5vw,64px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 18,
          }}
        >
          <Mono size={10} op={0.55}>Fabric</Mono>
          <h2
            style={{
              fontFamily: HF,
              fontWeight: 500,
              fontSize: 'clamp(28px,3.1vw,44px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Drawn in the language of{' '}
            <span style={{ fontFamily: SF, fontStyle: 'italic', fontWeight: 400 }}>restraint.</span>
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '8px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontFamily: BF,
              fontSize: 14,
              lineHeight: 1.55,
              opacity: 0.85,
            }}
          >
            {[
              'Designed to take you from morning meetings to dinner without thinking.',
              'Italian four-way stretch poplin, woven in Biella — moves with you.',
              'Soft-touch hand. Holds shape through long flights and dry-clean cycles.',
            ].map((line, i) => (
              <li key={i} style={{ display: 'flex', gap: 12 }}>
                <Mono size={9} op={0.5} style={{ paddingTop: 3, flexShrink: 0 }}>
                  0{i + 1}
                </Mono>
                {line}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 14 }}>
            <span
              style={{
                fontFamily: MF,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                borderBottom: '1px solid currentColor',
                paddingBottom: 2,
                cursor: 'pointer',
              }}
            >
              Read the fabric story →
            </span>
          </div>
        </div>
      </section>

      {/* ── Recommended ── */}
      {related.length > 0 && (
        <ProductRail
          eyebrow="You may also like"
          title="Recommended for you"
          items={related}
          shopAllHref="/products"
        />
      )}

      {/* ── Reviews ── */}
      <PDPReviews />
    </div>
  )
}

// ── Static reviews section ──────────────────────────────────────────────────

function PDPReviews() {
  const HF = 'var(--ff-head)'
  const BF = 'var(--ff-body)'
  const MF = 'var(--ff-mono)'

  const dist = [
    { stars: 5, pct: 86, count: 1226 },
    { stars: 4, pct: 9, count: 128 },
    { stars: 3, pct: 3, count: 43 },
    { stars: 2, pct: 1, count: 14 },
    { stars: 1, pct: 1, count: 16 },
  ]
  const reviews = [
    {
      author: 'James G.', verified: true, date: '2 weeks ago', stars: 5,
      title: 'My new go-to polo',
      body: 'Wore it on a long flight and walked off looking ironed. The fabric is genuinely soft — not the slippery technical-feeling stretch I expected.',
      fit: 'True to size', height: '6\'1"', size: 'Large', usual: 'L', body_type: 'Athletic',
    },
    {
      author: 'Alessia C.', verified: true, date: '1 month ago', stars: 5,
      title: 'Cut to perfection',
      body: 'Bought for my husband and he hasn\'t taken it off. The placket length and collar weight are exactly right — feels considered.',
      fit: 'True to size', height: '5\'10"', size: 'Medium', usual: 'M', body_type: 'Regular',
    },
    {
      author: 'Tomás R.', verified: true, date: '1 month ago', stars: 5,
      title: 'Polo elevated',
      body: 'Perfect drape and the colour is true to the photos. Best polo I\'ve owned in five years.',
      fit: 'Runs slightly small', height: '5\'8"', size: 'Medium', usual: 'M', body_type: 'Lean',
    },
  ]

  return (
    <section
      style={{ padding: 'clamp(40px,6vw,88px) clamp(22px,3vw,48px) clamp(40px,4vw,56px)', maxWidth: 1440, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,3vw,40px)' }}>
        <Mono size={10} op={0.55} style={{ display: 'block', marginBottom: 12 }}>
          From the people wearing it
        </Mono>
        <h2
          style={{
            fontFamily: HF,
            fontWeight: 500,
            fontSize: 'clamp(26px, 2.8vw, 40px)',
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          Reviews
        </h2>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-[320px_1fr]"
        style={{
          gap: 'clamp(24px,4.5vw,64px)',
          alignItems: 'flex-start',
          borderTop: '1px solid rgba(12,12,12,0.12)',
          paddingTop: 'clamp(20px,2.5vw,36px)',
        }}
      >
        {/* Score + bars */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: HF, fontWeight: 500, fontSize: 52, letterSpacing: '-0.04em', lineHeight: 1 }}>
                4.8
              </span>
              <span style={{ fontFamily: BF, fontSize: 16 }}>★★★★★</span>
            </div>
            <Mono size={10} op={0.6} style={{ display: 'block', marginTop: 6 }}>Based on 1,427 reviews</Mono>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dist.map((d) => (
              <div
                key={d.stars}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr 36px',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: BF,
                  fontSize: 12,
                }}
              >
                <span>{d.stars}★</span>
                <span style={{ height: 4, background: 'rgba(12,12,12,0.10)', position: 'relative', display: 'block' }}>
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${d.pct}%`,
                      background: 'var(--c-ink)',
                    }}
                  />
                </span>
                <span style={{ opacity: 0.55, textAlign: 'right' }}>{d.count}</span>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 16, borderTop: '1px solid rgba(12,12,12,0.10)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { l: 'Fit', sub: 'True to size', t: 0.5 },
              { l: 'Quality', sub: 'High', t: 0.85 },
              { l: 'Comfort', sub: 'Very comfortable', t: 0.9 },
            ].map((m) => (
              <div key={m.l}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BF, fontSize: 12, marginBottom: 4 }}>
                  <span>{m.l}</span>
                  <span style={{ opacity: 0.6 }}>{m.sub}</span>
                </div>
                <div style={{ position: 'relative', height: 3, background: 'rgba(12,12,12,0.10)' }}>
                  <span style={{ position: 'absolute', top: -3, height: 9, width: 3, background: 'var(--c-ink)', left: `calc(${m.t * 100}% - 1.5px)` }} />
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '14px 22px',
              textAlign: 'center',
              background: 'var(--c-ink)',
              color: 'var(--c-paper)',
              fontFamily: MF,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              borderRadius: 999,
            }}
          >
            Write a review →
          </button>
        </aside>

        {/* Review list */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid rgba(12,12,12,0.10)',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              {['All · 1427', 'Photos · 386', 'Verified · 1402'].map((t, i) => (
                <span
                  key={t}
                  style={{
                    padding: '6px 12px',
                    fontFamily: MF,
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    border: `1px solid ${i === 0 ? 'var(--c-ink)' : 'rgba(12,12,12,0.18)'}`,
                    background: i === 0 ? 'var(--c-ink)' : 'transparent',
                    color: i === 0 ? 'var(--c-paper)' : 'inherit',
                    borderRadius: 999,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <Mono size={10} op={0.8}>
              Sort · <span style={{ borderBottom: '1px solid currentColor', paddingBottom: 1 }}>Most relevant</span>
            </Mono>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {reviews.map((r, i) => (
              <article
                key={i}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr]"
                style={{ gap: 'clamp(12px,2.2vw,32px)', paddingBottom: 24, borderBottom: '1px solid rgba(12,12,12,0.10)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: BF, fontSize: 14, fontWeight: 500 }}>{r.author}</div>
                  {r.verified && <Mono size={9} op={0.6}>✓ Verified buyer</Mono>}
                  <div style={{ marginTop: 8, display: 'grid', gap: 4, fontFamily: BF, fontSize: 12, opacity: 0.75 }}>
                    {[
                      ['Fit', r.fit], ['Height', r.height], ['Size', r.size],
                      ['Usually', r.usual], ['Body type', r.body_type],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.6 }}>{k}</span>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontFamily: BF, fontSize: 13 }}>★★★★★</span>
                    <Mono size={9} op={0.55}>{r.date}</Mono>
                  </div>
                  <h3
                    style={{
                      fontFamily: HF,
                      fontWeight: 500,
                      fontSize: 17,
                      letterSpacing: '-0.025em',
                      margin: '0 0 10px',
                    }}
                  >
                    {r.title}
                  </h3>
                  <p style={{ fontFamily: BF, fontSize: 14, lineHeight: 1.6, margin: 0, opacity: 0.85, maxWidth: 620 }}>
                    {r.body}
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      gap: 14,
                      fontFamily: MF,
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      opacity: 0.65,
                    }}
                  >
                    <span>↑ Helpful · 14</span>
                    <span>↩ Reply</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
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
              Show more reviews →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
