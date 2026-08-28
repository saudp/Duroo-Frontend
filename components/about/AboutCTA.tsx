import CTA from '@/components/duroo/CTA'
import type { AboutCTA as AboutCTAData } from '@/lib/types'

const FHEAD = 'var(--ff-head)'

export default function AboutCTA({ data }: { data: AboutCTAData }) {
  return (
    <section className="py-14 md:py-[120px] text-center" style={{ background: 'var(--c-ink)', color: 'var(--c-paper)' }}>
      <div className="max-w-[640px] mx-auto px-[22px] md:px-12">
        <h2
          style={{
            fontFamily: FHEAD,
            fontWeight: 500,
            fontSize: 'clamp(26px, 3vw, 40px)',
            letterSpacing: '-0.025em',
            margin: '0 0 32px',
          }}
        >
          {data.heading}
        </h2>
        <CTA href={data.buttonLink} size="lg">
          {data.buttonText}
        </CTA>
      </div>
    </section>
  )
}
