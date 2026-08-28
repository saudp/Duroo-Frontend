'use client'

import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Mono from '@/components/duroo/Mono'
import PearlThreadMotif from './PearlThreadMotif'
import type { AboutHero as AboutHeroData } from '@/lib/types'

const FHEAD = 'var(--ff-head)'
const FSERIF = 'var(--ff-serif)'

// The tagline is Duroo's strongest brand asset — it gets a dedicated,
// full-viewport moment rather than being buried mid-paragraph. Lines
// reveal one at a time on load; the payoff line (line 3) is visually
// distinct — serif italic, yellow — so it lands as the "aha" beat rather
// than reading as a third bullet point.
export default function AboutHero({ data }: { data: AboutHeroData }) {
  const shouldReduceMotion = useReducedMotion()
  const [line1, line2, line3] = data.lines

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.25,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  }

  const lineVariant: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden min-h-[640px] md:min-h-[85vh]"
      style={{ background: 'var(--c-night)', color: 'var(--c-bone)' }}
    >
      {data.backgroundImage ? (
        <>
          <Image
            src={data.backgroundImage.url}
            alt={data.backgroundImage.alt || ''}
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.5)' }} />
        </>
      ) : (
        <PearlThreadMotif
          orientation="horizontal"
          className="absolute left-1/2 top-1/2 h-auto w-[140%] -translate-x-1/2 -translate-y-1/2 text-duroo-paper/10"
        />
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-[880px] px-[22px] md:px-12 text-center"
      >
        <Mono size={10} op={0.75} style={{ display: 'block', marginBottom: 24, color: 'var(--c-yellow)' }}>
          Our Story
        </Mono>

        <motion.h1
          variants={lineVariant}
          style={{
            fontFamily: FHEAD,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            lineHeight: 1.1,
          }}
        >
          {line1}
        </motion.h1>
        <motion.h1
          variants={lineVariant}
          style={{
            fontFamily: FHEAD,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            lineHeight: 1.1,
          }}
        >
          {line2}
        </motion.h1>

        <motion.p
          variants={lineVariant}
          style={{
            fontFamily: FSERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '-0.015em',
            fontSize: 'clamp(28px, 4.5vw, 48px)',
            lineHeight: 1.2,
            color: 'var(--c-yellow)',
            marginTop: 24,
          }}
        >
          {line3}
        </motion.p>
      </motion.div>
    </section>
  )
}
