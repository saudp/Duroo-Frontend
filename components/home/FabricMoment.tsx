import CTA from '@/components/duroo/CTA'
import Mono from '@/components/duroo/Mono'

const FHEAD = 'var(--ff-head)'

export default function FabricMoment() {
  return (
    <section
      style={{ position: 'relative', background: 'var(--c-night)', overflow: 'hidden' }}
      className="h-[420px] md:h-[620px]"
    >
      {/* Editorial placeholder — replace with next/image when photography is ready */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #141410 0%, #0A0A09 50%, #0C0C0A 100%)',
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#F5F4F0',
          background: 'linear-gradient(180deg, rgba(10,10,10,0.15), rgba(10,10,10,0.4))',
        }}
        className="px-[22px] md:px-[48px]"
      >
        <div>
          <Mono
            size={10}
            op={0.7}
            style={{ color: 'inherit', display: 'block', marginBottom: 14 }}
          >
            The fabric · Crossover Stretch
          </Mono>

          <h2
            style={{
              fontFamily: FHEAD,
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              margin: 0,
              fontSize: 'clamp(64px, 10vw, 132px)',
            }}
          >
            Wrinkle{' '}
            <span
              style={{
                fontWeight: 700,
                background: 'var(--duroo-yellow)',
                color: '#0A0A0A',
                padding: '0 14px 4px',
              }}
            >
              FREE.
            </span>
          </h2>

          <p
            style={{
              opacity: 0.88,
              maxWidth: 540,
              marginInline: 'auto',
              lineHeight: 1.55,
            }}
            className="text-[13px] md:text-[15px] mt-4 md:mt-[22px] px-[22px] md:px-0"
          >
            A four-way stretch poplin developed with our mill in Biella. Packs
            flat, breathes, never asks for an iron.
          </p>

          <div className="mt-[22px] md:mt-7">
            <CTA size="lg" href="/collections/crossover">
              Explore the fabric →
            </CTA>
          </div>
        </div>
      </div>
    </section>
  )
}
