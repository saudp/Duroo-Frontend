import Image from 'next/image'
import Mono from '@/components/duroo/Mono'
import Reveal from '@/components/duroo/Reveal'
import RichText from './RichText'
import type { AboutPhilosophy } from '@/lib/types'

const FSERIF = 'var(--ff-serif)'

// The tagline appears twice on this page: once in the Hero (ink background,
// yellow accent line) and again here (inverted — yellow background, ink
// text). Same line, deliberately different treatment, so the second
// appearance reads as a confident restatement rather than a repeat.
export default function PhilosophyMoment({
  data,
  taglinePayoff,
}: {
  data: AboutPhilosophy
  /** Reuses hero.lines[2] so this restatement can never drift out of sync with the Hero — one source of truth in ACF. */
  taglinePayoff: string
}) {
  return (
    <section
      className="relative overflow-hidden py-14 md:py-[120px]"
      style={{ background: 'var(--c-yellow)', color: 'var(--c-ink)' }}
    >
      {data.backgroundImage && (
        <Image src={data.backgroundImage.url} alt="" fill className="object-cover opacity-10" sizes="100vw" />
      )}

      <Reveal className="relative z-10 max-w-[720px] mx-auto px-[22px] md:px-12 text-center">
        <Mono size={10} op={0.7} style={{ display: 'block', marginBottom: 24 }}>
          {data.eyebrow}
        </Mono>

        <RichText
          html={data.intro}
          className="mb-8 text-[15px] md:text-[18px] leading-relaxed opacity-85 [&_p]:mb-4 [&_p:last-child]:mb-0"
        />

        <p
          style={{
            fontFamily: FSERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '-0.015em',
            fontSize: 'clamp(26px, 4vw, 44px)',
            lineHeight: 1.2,
          }}
        >
          {taglinePayoff}
        </p>
      </Reveal>
    </section>
  )
}
