'use client'

import Image from 'next/image'
import Link from 'next/link'
import Tag from '@/components/duroo/Tag'
import Mono from '@/components/duroo/Mono'
import type { WCProduct } from '@/lib/types'

const FBODY = 'var(--ff-body)'

// Map WooCommerce color option names → hex for swatches
const COLOR_HEX: Record<string, string> = {
  White: '#F5F4F0',
  Black: '#0A0A0A',
  'Navy Blue': '#1B2A4A',
  Navy: '#1B2A4A',
  Maroon: '#6B1E2A',
  Lavender: '#B8B0D0',
  Grey: '#7C7973',
  Gray: '#7C7973',
  Beige: '#E6E2D7',
  Sand: '#E6E2D7',
  Green: '#3A4E3B',
  Forest: '#3A4E3B',
  Brown: '#9C7A50',
  Tan: '#9C7A50',
  Cognac: '#9C7A50',
  Cream: '#F5F2EC',
}

// Fallback swatch palette matching design tokens
const DEFAULT_SWATCHES = ['#0A0A0A', '#7C7973', '#E6E2D7', '#3A4E3B', '#9C7A50']
const LIGHT_SWATCHES = new Set(['#F5F4F0', '#F5F2EC', '#E6E2D7', '#B8B0D0'])

function getSwatches(product: WCProduct): string[] {
  const colorAttr = product.attributes?.find(
    (a) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour'
  )
  if (colorAttr?.options?.length) {
    return colorAttr.options.slice(0, 5).map((c) => COLOR_HEX[c] ?? '#7C7973')
  }
  return DEFAULT_SWATCHES
}

export default function ProductCard({
  product,
  priority = false,
  width,
}: {
  product: WCProduct
  priority?: boolean
  width?: number
}) {
  const swatches = getSwatches(product)
  const tag = product.on_sale ? 'Sale' : ''
  const price = product.price ? `₹${product.price}` : 'Price on selection'
  const w = width ?? 286

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        flex: '0 0 clamp(220px, 22vw, 286px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          background: 'var(--c-cream)',
          flexShrink: 0,
        }}
        className="h-[290px] md:h-[380px]"
      >
        {product.images?.[0]?.src ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            fill
            className="cover-image"
            priority={priority}
            sizes={`${w}px`}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--c-canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mono size={10} op={0.4}>
              {product.name}
            </Mono>
          </div>
        )}

        {tag && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <Tag kind="ink">{tag}</Tag>
          </div>
        )}

        {/* Wishlist button */}
        <button
          aria-label={`Wishlist ${product.name}`}
          onClick={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0A0A',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ♡
        </button>
      </div>

      {/* Name + price */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 2,
        }}
      >
        <div
          style={{
            fontFamily: FBODY,
            fontSize: 14.5,
            fontWeight: 500,
            letterSpacing: 0,
          }}
        >
          {product.name}
        </div>
        <span
          style={{
            fontFamily: FBODY,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          {price}
        </span>
      </div>

      {/* Swatches */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginTop: 2,
        }}
      >
        {swatches.map((c, i) => (
          <span
            key={i}
            title={c}
            style={{
              width: 11,
              height: 11,
              borderRadius: 'var(--r-pill)',
              background: c,
              flexShrink: 0,
              border: LIGHT_SWATCHES.has(c) ? '1px solid rgba(0,0,0,0.15)' : 'none',
              outline: i === 0 ? '1px solid rgba(0,0,0,0.4)' : 'none',
              outlineOffset: i === 0 ? 1 : 0,
            }}
          />
        ))}
      </div>
    </Link>
  )
}
