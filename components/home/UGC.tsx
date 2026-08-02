import Mono from '@/components/duroo/Mono'
import Reveal from '@/components/duroo/Reveal'

const FHEAD = 'var(--ff-head)'

// Placeholder palette for UGC tiles until real user photos are integrated
const TILE_COLORS = [
  '#1A1A18', '#201E1C', '#181A1A', '#1C1C1A',
  '#1A1C18', '#1E1A1C', '#1C1A18', '#1A1E1C',
  '#181C1A', '#201C18', '#1A181C', '#1C201A',
]

export default function UGC() {
  return (
    <section className="pt-14 pb-14 md:pt-[88px] md:pb-[88px]">
      {/* Header */}
      <Reveal>
        <div
          style={{ textAlign: 'center' }}
          className="max-w-[1440px] mx-auto px-[22px] md:px-[48px] mb-[18px]"
        >
          <Mono size={10} op={0.55} style={{ display: 'block', marginBottom: 10 }}>
            Tag us · @duroo · #wornduroo
          </Mono>
          <h2
            style={{
              fontFamily: FHEAD,
              fontWeight: 500,
              fontSize: 'clamp(26px, 3vw, 40px)',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            How it&apos;s being worn.
          </h2>
        </div>
      </Reveal>

      {/* Grid */}
      <div
        style={{ display: 'grid' }}
        className="grid-cols-4 md:grid-cols-6 gap-1 md:gap-[6px] px-1 md:px-[6px]"
      >
        {TILE_COLORS.slice(0, 12).map((bg, i) => (
          <div
            key={i}
            style={{ position: 'relative', background: bg }}
            className={`h-[100px] md:h-[220px]${i >= 8 ? ' hidden md:block' : ''}`}
          >
            {/* ↗ chip */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 18,
                height: 18,
                borderRadius: 4,
                background: 'rgba(10,10,10,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F5F4F0',
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              ↗
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
