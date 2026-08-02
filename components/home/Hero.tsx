'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Mono from '@/components/duroo/Mono'
import CTA from '@/components/duroo/CTA'
import UnderLink from '@/components/duroo/UnderLink'

const GHEAD = 'var(--ff-geist)'
const FSERIF = 'var(--ff-serif)'
const FBODY = 'var(--ff-body)'

export default function Hero({ images }: { images: { src: string; alt: string }[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [idx, setIdx] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setIdx(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const slides = images.length > 0 ? images : [null, null, null, null]

  return (
    <section
      style={{ position: 'relative', background: 'var(--c-night)', overflow: 'hidden' }}
      className="h-[640px] md:h-[800px]"
    >
      {/* Embla viewport */}
      <div ref={emblaRef} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ display: 'flex', height: '100%' }}>
          {slides.map((img, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 100%',
                position: 'relative',
                background: '#141412',
              }}
            >
              {img ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="cover-image"
                  priority={i === 0}
                  sizes="100vw"
                />
              ) : (
                /* Dark editorial placeholder */
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, #141412 0%, #0A0A0A 100%)`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0) 28%, rgba(10,10,10,0) 60%, rgba(10,10,10,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Side rail — desktop only */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'left center',
          color: 'var(--c-bone)',
        }}
      >
        <Mono size={10} op={0.78} style={{ color: 'inherit' }}>
          01 · The Crossover Edit
        </Mono>
      </div>

      {/* Fig caption */}
      <div
        style={{
          position: 'absolute',
          color: 'var(--c-bone)',
        }}
        className="left-[22px] md:left-[48px] bottom-[110px] md:bottom-[32px]"
      >
        <Mono size={9} op={0.7} style={{ color: 'inherit' }}>
          FIG. 01 · Lisbon · 04.26
        </Mono>
      </div>

      {/* Center copy */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'var(--c-bone)',
          pointerEvents: 'none',
        }}
        className="px-[22px] md:px-[48px]"
      >
        <Mono size={10} op={0.85} style={{ color: 'inherit', marginBottom: 18 }}>
          Introducing SS26
        </Mono>

        <h1
          style={{
            fontFamily: GHEAD,
            fontWeight: 400,
            fontSize: 'clamp(56px, 9vw, 124px)',
            lineHeight: 0.95,
            letterSpacing: '-0.035em',
            margin: 0,
            maxWidth: 1100,
          }}
        >
          The Crossover{' '}
          <span
            style={{
              fontFamily: FSERIF,
              fontStyle: 'italic',
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Collection.
          </span>
        </h1>

        <p
          style={{
            fontFamily: FBODY,
            opacity: 0.88,
            maxWidth: 520,
            lineHeight: 1.55,
          }}
          className="text-[14px] md:text-[16px] mt-[18px] mb-[26px] md:mt-[24px] md:mb-[36px]"
        >
          Breathable performance fabrics, drawn in the language of restraint.
          Move-everywhere essentials for daily wear.
        </p>

        <div
          style={{ pointerEvents: 'auto' }}
          className="flex flex-col md:flex-row gap-[14px] items-center"
        >
          <CTA
            size="lg"
            href="/products"
            style={{
              fontFamily: FBODY,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textTransform: 'none',
              padding: '16px 30px 15px',
            }}
          >
            Shop the collection →
          </CTA>
          <span className="hidden md:inline">
            <UnderLink style={{ color: '#F5F4F0', borderColor: '#F5F4F0' }}>
              Watch the film (1:32)
            </UnderLink>
          </span>
        </div>
      </div>

      {/* Slide dots */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--c-bone)',
        }}
        className="bottom-[22px] right-[22px] md:bottom-[32px] md:right-[48px]"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            style={{
              width: i === idx ? 22 : 6,
              height: 6,
              background: i === idx ? 'var(--c-bone)' : 'rgba(245,244,240,0.4)',
              borderRadius: 'var(--r-pill)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
        <Mono size={9} op={0.7} style={{ color: 'inherit', marginLeft: 6 }}>
          0{idx + 1} / 0{slides.length}
        </Mono>
      </div>

      {/* Prev / Next arrows — desktop only */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          left: 48,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--c-bone)',
          fontSize: 28,
          opacity: 0.7,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ‹
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          right: 48,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--c-bone)',
          fontSize: 28,
          opacity: 0.7,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ›
      </button>
    </section>
  )
}
