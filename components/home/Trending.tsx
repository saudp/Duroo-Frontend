import Link from 'next/link'
import Mono from '@/components/duroo/Mono'
import Reveal from '@/components/duroo/Reveal'

const FHEAD = 'var(--ff-head)'
const FMONO = 'var(--ff-mono)'

const COLLECTIONS = [
  {
    slug: 'riviera-knit',
    name: 'Riviera Knit Collection',
    desc: 'Linen-blend pieces for warmer-weather wear without losing weight or feeling thin.',
    bg: '#1A1F1C',
  },
  {
    slug: 'sail-in',
    name: 'Sail-In Collection',
    desc: 'Performance-grade poplins built for movement, packing flat and never wrinkling.',
    bg: '#1C1A1A',
  },
  {
    slug: 'crossover',
    name: 'Crossover Collection',
    desc: 'Drawn for any occasion, from morning runs to long dinners. Move-everywhere essentials.',
    bg: '#17191C',
  },
]

export default function Trending() {
  return (
    <section className="pt-14 pb-14 md:pt-[88px] md:pb-[88px]">
      <div className="max-w-[1440px] mx-auto px-[22px] md:px-[48px]">
      <Reveal>
        <h2
          style={{
            fontFamily: FHEAD,
            fontWeight: 500,
            fontSize: 'clamp(26px, 3vw, 40px)',
            letterSpacing: '-0.025em',
            margin: 0,
          }}
          className="mb-5 md:mb-7"
        >
          Trending Collections
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-[18px]">
        {COLLECTIONS.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Image placeholder */}
              <div
                style={{ background: item.bg, position: 'relative', overflow: 'hidden' }}
                className="h-[320px] md:h-[440px]"
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mono size={10} op={0.3} style={{ color: '#F5F4F0' }}>
                    {item.name}
                  </Mono>
                </div>
              </div>

              <h3
                style={{
                  fontFamily: FHEAD,
                  fontWeight: 500,
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  letterSpacing: '-0.025em',
                  margin: '4px 0 0',
                }}
              >
                {item.name}
              </h3>

              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  opacity: 0.75,
                  margin: 0,
                  maxWidth: 380,
                }}
              >
                {item.desc}
              </p>

              <div style={{ marginTop: 6 }}>
                <Link
                  href={`/collections/${item.slug}`}
                  style={{
                    display: 'inline-block',
                    padding: '11px 22px',
                    fontFamily: FMONO,
                    fontSize: 10,
                    letterSpacing: 'var(--ls-mono)',
                    textTransform: 'uppercase',
                    borderRadius: 'var(--r-pill)',
                    background: 'var(--c-night)',
                    color: 'var(--c-bone)',
                    textDecoration: 'none',
                  }}
                >
                  Shop now →
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  )
}
