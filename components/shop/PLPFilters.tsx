// components/shop/PLPFilters.tsx
// Server-rendered filter sidebar — every control is a real <a> built from
// the current URL, so filtering needs zero client JS, works with JS
// disabled, and every combination is a bookmarkable/shareable URL.
import Link from 'next/link'
import Mono from '@/components/duroo/Mono'
import { PRICE_BUCKETS, toggleMultiValueHref, toggleSingleValueHref, type ParsedProductQuery } from '@/lib/productFilters'
import type { WCCategory } from '@/lib/types'

const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'

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

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

// No gender/audience taxonomy is confirmed to exist on duroo.in (same open
// question flagged for the nav's Men/Women links). Rather than invent a
// second, independent taxonomy filter the API can't actually apply, Audience
// writes to the same `category` param as the Category group below — i.e. it's
// a best-effort category-slug guess ('men'/'women'/'unisex'), single-select
// across both groups. If duroo.in doesn't have categories with those slugs,
// selecting one just correctly returns zero results rather than erroring.
const AUDIENCE = ['Men', 'Women', 'Unisex']

function slugify(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-')
}

export default function PLPFilters({
  current,
  categories,
}: {
  current: URLSearchParams
  categories: WCCategory[]
}) {
  const query: Pick<ParsedProductQuery, 'category' | 'colors' | 'sizes' | 'priceKey'> = {
    category: current.get('cat') ?? undefined,
    colors: current.getAll('color'),
    sizes: current.getAll('size'),
    priceKey: (current.get('price') as ParsedProductQuery['priceKey']) ?? undefined,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Audience */}
      <FilterGroup title="Audience">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {AUDIENCE.map((label) => {
            const slug = slugify(label)
            const active = query.category === slug
            return (
              <FilterCheckboxLink key={label} href={toggleSingleValueHref(current, 'cat', slug)} active={active} label={label} />
            )
          })}
        </div>
      </FilterGroup>

      {/* Category — from live WooCommerce categories */}
      {categories.length > 0 && (
        <FilterGroup title="Category">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {categories.map((cat) => (
              <FilterCheckboxLink
                key={cat.id}
                href={toggleSingleValueHref(current, 'cat', cat.slug)}
                active={query.category === cat.slug}
                label={cat.name}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Color — fixed brand swatch palette; matched against each product's own Color attribute */}
      <FilterGroup title="Color">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {COLORS.map((c) => {
            const active = query.colors.includes(c.n)
            return (
              <Link
                key={c.n}
                href={toggleMultiValueHref(current, 'color', c.n)}
                title={c.n}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', color: 'inherit' }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: c.c,
                    display: 'inline-block',
                    border: (c.c === '#F5F4F0' || c.c === '#E6E2D7') ? '1px solid rgba(12,12,12,0.15)' : 'none',
                    outline: active ? '1px solid rgba(12,12,12,0.55)' : 'none',
                    outlineOffset: 2,
                  }}
                />
                <span style={{ fontFamily: MF, fontSize: 8.5, letterSpacing: '0.12em', opacity: active ? 1 : 0.55, textTransform: 'uppercase' }}>
                  {c.n}
                </span>
              </Link>
            )
          })}
        </div>
      </FilterGroup>

      {/* Size */}
      <FilterGroup title="Size">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {SIZES.map((s) => {
            const active = query.sizes.includes(s)
            return (
              <Link
                key={s}
                href={toggleMultiValueHref(current, 'size', s)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 0',
                  fontFamily: MF,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  border: '1px solid rgba(12,12,12,0.18)',
                  background: active ? 'var(--c-ink)' : 'transparent',
                  color: active ? 'var(--c-paper)' : 'inherit',
                  textDecoration: 'none',
                }}
              >
                {s}
              </Link>
            )
          })}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(Object.keys(PRICE_BUCKETS) as (keyof typeof PRICE_BUCKETS)[]).map((key) => {
            const active = query.priceKey === key
            return (
              <FilterCheckboxLink
                key={key}
                href={toggleSingleValueHref(current, 'price', key)}
                active={active}
                label={PRICE_BUCKETS[key].label}
              />
            )
          })}
        </div>
      </FilterGroup>

      <Link
        href="/products"
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
          display: 'block',
        }}
      >
        Clear filters
      </Link>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Mono size={10} op={0.55}>{title}</Mono>
      </div>
      {children}
    </div>
  )
}

function FilterCheckboxLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontFamily: BF, fontSize: 13.5, color: 'inherit' }}
    >
      <span
        style={{
          display: 'inline-flex',
          width: 13,
          height: 13,
          border: '1px solid rgba(12,12,12,0.35)',
          background: active ? 'var(--c-ink)' : 'transparent',
          flexShrink: 0,
        }}
      />
      <span style={{ opacity: 0.85 }}>{label}</span>
    </Link>
  )
}
