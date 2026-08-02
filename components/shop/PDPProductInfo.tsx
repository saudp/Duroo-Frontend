'use client'

// PDPProductInfo — interactive right panel on the PDP
// Handles color/size selection + add-to-bag. Reads product data from props.
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import Mono from '@/components/duroo/Mono'

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'
const SF = 'var(--ff-serif)'

// WooCommerce color name → hex
const COLOR_HEX: Record<string, string> = {
  White:      '#F5F4F0',
  Bone:       '#F5F4F0',
  Black:      '#0A0A0A',
  Ink:        '#0A0A0A',
  'Navy Blue':'#1B2A4A',
  Navy:       '#1B2A4A',
  Maroon:     '#6B1E2A',
  Lavender:   '#B8B0D0',
  Mist:       '#A8B5C4',
  Grey:       '#7C7973',
  Gray:       '#7C7973',
  Stone:      '#7C7973',
  Sand:       '#E6E2D7',
  Beige:      '#E6E2D7',
  Moss:       '#3A4E3B',
  Green:      '#3A4E3B',
  Forest:     '#3A4E3B',
  Cognac:     '#9C7A50',
  Brown:      '#9C7A50',
  Tan:        '#9C7A50',
  Cream:      '#F5F2EC',
}

const LIGHT = new Set(['#F5F4F0', '#F5F2EC', '#E6E2D7', '#B8B0D0'])

interface ProductInfoProps {
  id: number
  name: string
  price: string
  regularPrice: string
  onSale: boolean
  slug: string
  image: string
  colors: string[]
  sizes: string[]
  shortDescription?: string
  description?: string
}

export default function PDPProductInfo({
  id,
  name,
  price,
  regularPrice,
  onSale,
  slug,
  image,
  colors,
  sizes,
  shortDescription,
  description,
}: ProductInfoProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '')
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (sizes.length > 0 && !selectedSize) { alert('Please select a size'); return }
    addItem({ id, name, price, image, slug, quantity: 1, color: selectedColor, size: selectedSize })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const displayPrice = price ? `₹${price}` : 'Price on selection'
  const displayWas = onSale && regularPrice ? `₹${regularPrice}` : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Name + price */}
      <div>
        <Mono size={10} op={0.55} style={{ display: 'block', marginBottom: 12 }}>
          New · The Crossover Edit
        </Mono>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18 }}>
          <h1
            style={{
              fontFamily: HF,
              fontWeight: 500,
              fontSize: 'clamp(26px, 2.8vw, 38px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {name}
          </h1>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span
              style={{
                fontFamily: HF,
                fontWeight: 500,
                fontSize: 'clamp(18px, 1.8vw, 24px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {displayPrice}
            </span>
            {displayWas && (
              <div style={{ fontFamily: BF, fontSize: 12, opacity: 0.45, textDecoration: 'line-through', marginTop: 2 }}>
                {displayWas}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <span style={{ fontFamily: HF, fontSize: 13, letterSpacing: '-0.02em' }}>★★★★★</span>
          <Mono size={10} op={0.65}>4.8 · 1,427 reviews</Mono>
        </div>
      </div>

      {/* Color selection */}
      {colors.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <Mono size={10} op={0.55}>
              Color ·{' '}
              <span style={{ opacity: 1 }}>{selectedColor}</span>
            </Mono>
            <Mono size={10} op={0.55}>{colors.length} colors</Mono>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {colors.map((c) => {
              const hex = COLOR_HEX[c] ?? '#7C7973'
              const active = c === selectedColor
              return (
                <button
                  key={c}
                  title={c}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: hex,
                    border: LIGHT.has(hex) ? '1px solid rgba(12,12,12,0.18)' : 'none',
                    outline: active ? '1px solid var(--c-ink)' : 'none',
                    outlineOffset: 2,
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Size selection */}
      {sizes.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <Mono size={10} op={0.55}>Size</Mono>
            <Mono size={10} op={0.8} style={{ borderBottom: '1px solid currentColor', paddingBottom: 1 }}>
              Size guide
            </Mono>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(sizes.length, 6)}, 1fr)`, gap: 6 }}>
            {sizes.map((s) => {
              const active = s === selectedSize
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '12px 0',
                    fontFamily: MF,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    border: `1px solid ${active ? 'var(--c-ink)' : 'rgba(12,12,12,0.18)'}`,
                    background: active ? 'var(--c-ink)' : 'transparent',
                    color: active ? 'var(--c-paper)' : 'inherit',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Add to bag */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
        <button
          onClick={handleAdd}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '18px 0',
            textAlign: 'center',
            fontFamily: BF,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            background: added ? 'var(--c-ink)' : 'var(--c-yellow)',
            color: added ? 'var(--c-paper)' : 'var(--c-ink)',
            borderRadius: 999,
            transition: 'background 0.25s, color 0.25s',
          }}
        >
          {added ? '✓ Added to bag' : `Add to bag · ${displayPrice}`}
        </button>
      </div>

      {/* Fabric properties row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '20px 0',
          borderTop: '1px solid rgba(12,12,12,0.08)',
          borderBottom: '1px solid rgba(12,12,12,0.08)',
          gap: 10,
        }}
      >
        {[
          { l: '4-way', sub: 'Stretch' },
          { l: 'Wrinkle', sub: 'Free' },
          { l: 'Breath', sub: 'able' },
          { l: 'Quick', sub: 'Drying' },
        ].map((f) => (
          <div key={f.l} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ width: 28, height: 28, margin: '0 auto', borderRadius: 999, border: '1px solid rgba(12,12,12,0.35)' }} />
            <Mono size={9} op={1} style={{ marginTop: 2 }}>{f.l}</Mono>
            <Mono size={9} op={0.6}>{f.sub}</Mono>
          </div>
        ))}
      </div>

      {/* Accordions */}
      <ProductAccordions shortDescription={shortDescription} description={description} />
    </div>
  )
}

function ProductAccordions({ shortDescription, description }: { shortDescription?: string; description?: string }) {
  const [open, setOpen] = useState<string | null>('Description')

  const accordions = [
    {
      h: 'Description',
      body: shortDescription || description ||
        'A four-way stretch poplin developed with our mill. Packs flat, breathes, and keeps its shape through long days.',
    },
    { h: 'Fit', body: '' },
    { h: 'Materials', body: '' },
    { h: 'Care', body: '' },
    { h: 'Shipping & Returns', body: '' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {accordions.map((a) => (
        <div key={a.h} style={{ borderBottom: '1px solid rgba(12,12,12,0.12)' }}>
          <button
            onClick={() => setOpen(open === a.h ? null : a.h)}
            style={{
              all: 'unset',
              width: '100%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              fontFamily: HF,
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '-0.025em',
            }}
          >
            <span>{a.h}</span>
            <span style={{ fontFamily: 'var(--ff-body)', fontWeight: 300, opacity: 0.7 }}>
              {open === a.h ? '−' : '+'}
            </span>
          </button>
          {open === a.h && a.body && (
            <div
              style={{
                fontFamily: 'var(--ff-body)',
                fontSize: 13.5,
                lineHeight: 1.65,
                opacity: 0.75,
                paddingBottom: 18,
                maxWidth: 420,
              }}
              dangerouslySetInnerHTML={{ __html: a.body }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
