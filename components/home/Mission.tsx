import Link from 'next/link'
import Mono from '@/components/duroo/Mono'
import Reveal from '@/components/duroo/Reveal'

const FHEAD = 'var(--ff-head)'
const FSERIF = 'var(--ff-serif)'

export default function Mission() {
  return (
    <section>
      <div
        className="max-w-[1440px] mx-auto px-[22px] md:px-[48px] py-16 md:py-[120px]"
        style={{ textAlign: 'center' }}
      >
      <Reveal>
        <Mono
          size={10}
          op={0.55}
          style={{ display: 'block', marginBottom: 24 }}
        >
          About Duroo
        </Mono>

        <h2
          style={{
            fontFamily: FHEAD,
            fontWeight: 500,
            fontSize: 'clamp(32px, 3.5vw, 44px)',
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
            margin: '0 auto',
            maxWidth: 880,
          }}
        >
          Duroo is built for those moving through their days with{' '}
          <span
            style={{
              fontStyle: 'italic',
              fontFamily: FSERIF,
              fontWeight: 400,
            }}
          >
            intent
          </span>{' '}
          — the long flight, the run before work, the dinner that runs late. We
          make clothes that move with all of it.
        </h2>

        <div className="mt-7 md:mt-10">
          <Link
            href="/about"
            style={{
              fontFamily: 'var(--font-mono), ui-monospace, monospace',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              borderBottom: '1px solid currentColor',
              paddingBottom: 2,
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Read more about us →
          </Link>
        </div>
      </Reveal>
      </div>
    </section>
  )
}
