import Image from 'next/image'
import Mono from '@/components/duroo/Mono'
import Reveal from '@/components/duroo/Reveal'
import PearlThreadMotif from './PearlThreadMotif'
import RichText from './RichText'
import type { AboutSection as AboutSectionData } from '@/lib/types'

const FHEAD = 'var(--ff-head)'

// Shared layout for the two narrative sections (Origin Story, The Name).
// Keeping this generic — rather than two near-identical components — means
// the visual rhythm (spacing, reveal timing, fallback treatment) stays
// consistent by construction instead of by discipline.
export default function StorySection({
  data,
  imageSide = 'right',
}: {
  data: AboutSectionData
  /** Which side the image (or fallback motif) sits on at desktop widths */
  imageSide?: 'left' | 'right'
}) {
  const imageFirst = imageSide === 'left'

  return (
    <section className="py-14 md:py-[120px]" style={{ background: 'var(--c-paper)' }}>
      <div className="max-w-[1200px] mx-auto px-[22px] md:px-[48px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal
          className={`relative aspect-[4/5] w-full overflow-hidden ${imageFirst ? 'md:order-1' : 'md:order-2'}`}
        >
          {data.image ? (
            <Image
              src={data.image.url}
              alt={data.image.alt || data.heading}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: 'rgba(12,12,12,0.05)' }}
            >
              <PearlThreadMotif orientation="vertical" className="h-3/4 w-auto text-duroo-ink/15" />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className={imageFirst ? 'md:order-2' : 'md:order-1'}>
          <Mono size={10} op={0.55} style={{ display: 'block', marginBottom: 16 }}>
            {data.eyebrow}
          </Mono>
          <h2
            style={{
              fontFamily: FHEAD,
              fontWeight: 500,
              fontSize: 'clamp(26px, 3vw, 40px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: '0 0 20px',
            }}
          >
            {data.heading}
          </h2>
          <RichText html={data.body} className="text-[14.5px] leading-relaxed opacity-80 [&_p]:mb-4 [&_p:last-child]:mb-0" />
        </Reveal>
      </div>
    </section>
  )
}
