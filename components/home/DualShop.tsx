import Link from 'next/link'

const FSERIF = 'var(--ff-serif)'
const FMONO = 'var(--ff-mono)'

const TILES = [
  { label: 'Shop Mens', href: '/products?gender=mens', bg: '#131311' },
  { label: 'Shop Womens', href: '/products?gender=womens', bg: '#141313' },
] as const

export default function DualShop() {
  return (
    <section className="py-14 md:py-[88px]">
      <div className="max-w-[1440px] mx-auto px-[22px] md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TILES.map((tile) => (
            <div
              key={tile.label}
              style={{ position: 'relative', overflow: 'hidden', background: tile.bg }}
              className="h-[440px] md:h-[620px]"
            >
              {/* Gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'absolute',
                  color: 'var(--c-bone)',
                }}
                className="bottom-[26px] left-[22px] right-[22px] md:bottom-10 md:left-9 md:right-9"
              >
                <h3
                  style={{
                    fontFamily: FSERIF,
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 'clamp(44px, 5vw, 64px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {tile.label}
                </h3>

                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <Link
                    href={`${tile.href}&filter=new`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      fontFamily: FMONO,
                      fontSize: 10,
                      letterSpacing: 'var(--ls-mono)',
                      textTransform: 'uppercase',
                      borderRadius: 'var(--r-pill)',
                      background: 'var(--c-bone)',
                      color: 'var(--c-night)',
                      textDecoration: 'none',
                    }}
                  >
                    New Releases
                  </Link>
                  <Link
                    href={`${tile.href}&filter=best`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      fontFamily: FMONO,
                      fontSize: 10,
                      letterSpacing: 'var(--ls-mono)',
                      textTransform: 'uppercase',
                      borderRadius: 'var(--r-pill)',
                      background: 'transparent',
                      color: 'var(--c-bone)',
                      border: '1px solid var(--c-bone)',
                      textDecoration: 'none',
                    }}
                  >
                    Best Sellers
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
