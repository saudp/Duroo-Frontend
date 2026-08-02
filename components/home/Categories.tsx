import Image from 'next/image'
import Link from 'next/link'
import Mono from '@/components/duroo/Mono'
import UnderLink from '@/components/duroo/UnderLink'
import Reveal from '@/components/duroo/Reveal'
import type { WCCategory } from '@/lib/types'

const FHEAD = 'var(--ff-head)'
const FMONO = 'var(--ff-mono)'

export default function Categories({ categories }: { categories: WCCategory[] }) {
  // Show up to 4 categories; filter out the "Uncategorized" default WC category
  const cats = categories
    .filter((c) => c.slug !== 'uncategorized')
    .slice(0, 4)

  if (cats.length === 0) return null

  return (
    <section className="py-14 md:py-[88px]">
      <div className="max-w-[1440px] mx-auto px-[22px] md:px-[48px]">
      {/* Header */}
      <Reveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
          className="mb-5 md:mb-7"
        >
          <h2
            style={{
              fontFamily: FHEAD,
              fontWeight: 500,
              fontSize: 'clamp(26px, 3vw, 40px)',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            Shop by Category
          </h2>
          <span className="hidden md:inline">
            <UnderLink>View all →</UnderLink>
          </span>
        </div>
      </Reveal>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {cats.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?cat=${cat.slug}`}
            style={{ position: 'relative', display: 'block', textDecoration: 'none' }}
            className="h-[240px] md:h-[440px]"
          >
            {/* Image */}
            {cat.image?.src ? (
              <Image
                src={cat.image.src}
                alt={cat.image.alt || cat.name}
                fill
                className="cover-image"
                sizes="(max-width: 768px) 50vw, 25vw"
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
                <Mono size={10} op={0.35}>{cat.name}</Mono>
              </div>
            )}

            {/* Gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Label row */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                color: '#F5F4F0',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'var(--c-night)',
                  fontFamily: FMONO,
                  fontSize: 10,
                  letterSpacing: 'var(--ls-mono)',
                  textTransform: 'uppercase',
                }}
              >
                {cat.name}
              </div>
              <Mono size={9} op={0.85} style={{ color: 'inherit' }}>
                {cat.count} {cat.count === 1 ? 'piece' : 'pieces'}
              </Mono>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  )
}
