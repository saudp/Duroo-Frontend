import Reveal from '@/components/duroo/Reveal'

const FSERIF = 'var(--ff-serif)'
const FGEIST = 'var(--ff-geist)'

const LOGOS = [
  { name: 'MONOCLE', font: FGEIST, weight: 600, ls: '0.32em', size: 14, italic: false },
  { name: 'WALLPAPER*', font: FGEIST, weight: 500, ls: '0.12em', size: 16, italic: false },
  { name: 'WSJ.', font: FSERIF, weight: 400, ls: '0.04em', size: 22, italic: true },
  { name: 'GQ', font: FGEIST, weight: 700, ls: '0.04em', size: 22, italic: false },
  { name: 'Forbes', font: FSERIF, weight: 400, ls: '0.01em', size: 22, italic: false },
] as const

export default function Press() {
  return (
    <section style={{ background: 'var(--c-cream)' }}>
      <div
        className="max-w-[1440px] mx-auto px-[22px] md:px-[48px] py-14 md:py-[88px]"
        style={{ textAlign: 'center' }}
      >
      <Reveal>
        <p
          style={{
            fontFamily: FSERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 2.5vw, 30px)',
            lineHeight: 1.35,
            letterSpacing: '-0.015em',
            maxWidth: 760,
            margin: '0 auto',
          }}
        >
          &ldquo;Built for the boardroom, the boat, and the long flight in between&nbsp;&mdash;
          and looks better the more you wear it.&rdquo;
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7,
          }}
          className="gap-7 md:gap-14 mt-6 md:mt-9"
        >
          {LOGOS.map((l) => (
            <span
              key={l.name}
              style={{
                fontFamily: l.font,
                fontWeight: l.weight,
                letterSpacing: l.ls,
                fontSize: l.size,
                fontStyle: l.italic ? 'italic' : 'normal',
              }}
            >
              {l.name}
            </span>
          ))}
        </div>
      </Reveal>
      </div>
    </section>
  )
}
