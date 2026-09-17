'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Mono from '@/components/duroo/Mono'
import CTA from '@/components/duroo/CTA'
import UnderLink from '@/components/duroo/UnderLink'

const HHEAD = 'var(--ff-head)'   // Instrument Sans — now shared with the rest of the section-header system
const HSERIF = 'var(--ff-serif)' // Instrument Serif italic — "Collection." only
const HBODY = 'var(--ff-body)'   // Afacad Flux

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

  const slides = images.length > 0 ? images : [null, null, null, null]

  return (
    <section
      style={{ position: 'relative', display: 'flex', background: 'var(--c-ink)' }}
      className="flex-col md:flex-row h-[760px] md:h-[720px]"
    >
      {/* Copy panel */}
      <div
        style={{ color: 'var(--c-bone)' }}
        className="flex flex-col justify-center order-2 md:order-1 md:flex-none md:basis-[42%] px-[22px] pt-[40px] pb-[44px] md:p-0 md:px-[56px]"
      >
        <Mono size={10} op={0.75} style={{ color: 'inherit', marginBottom: 18 }}>
          Introducing SS26
        </Mono>

        <h1
          style={{
            fontFamily: HHEAD,
            fontWeight: 500,
            fontSize: 'clamp(42px, 5.5vw, 64px)',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            margin: 0,
            maxWidth: 460,
          }}
        >
          The Crossover{' '}
          <span
            style={{
              fontFamily: HSERIF,
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
            fontFamily: HBODY,
            opacity: 0.8,
            maxWidth: 420,
            lineHeight: 1.6,
          }}
          className="text-[14px] md:text-[15.5px] mt-[18px] mb-[26px] md:mt-[22px] md:mb-[32px]"
        >
          Breathable performance fabrics, drawn in the language of restraint.
          Move-everywhere essentials for daily wear.
        </p>

        <div className="flex flex-col md:flex-row gap-[14px] items-center md:items-center self-stretch md:self-start">
          <CTA
            size="lg"
            href="/products"
            style={{
              fontFamily: HBODY,
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
            <UnderLink style={{ color: '#F5F4F0', borderColor: 'rgba(245,244,240,0.5)' }}>
              Watch the film (1:32)
            </UnderLink>
          </span>
        </div>

        {/* Slide dots */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          className="mt-[28px] md:mt-[44px]"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              style={{
                width: i === idx ? 22 : 6,
                height: 6,
                background: i === idx ? 'var(--c-bone)' : 'rgba(245,244,240,0.35)',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
          <Mono size={9} op={0.6} style={{ color: 'inherit', marginLeft: 6 }}>
            0{idx + 1} / 0{slides.length}
          </Mono>
        </div>
      </div>

      {/* Image panel — duotone scrim unifies whatever photo lands here */}
      <div
        style={{ position: 'relative', overflow: 'hidden' }}
        className="order-1 md:order-2 flex-1 h-[420px] md:h-auto"
      >
        <div ref={emblaRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            {slides.map((img, i) => (
              <div
                key={i}
                style={{ flex: '0 0 100%', position: 'relative', background: '#141412' }}
              >
                {img ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="cover-image"
                    style={{ filter: 'saturate(0.92) contrast(1.05)' }}
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #141412 0%, #0A0A0A 100%)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Duotone + vignette scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(200deg, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0.05) 35%, rgba(12,12,12,0.05) 65%, rgba(12,12,12,0.6) 100%)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{ position: 'absolute', color: 'var(--c-bone)' }}
          className="left-[20px] bottom-[16px] md:left-[32px] md:bottom-[28px]"
        >
          <Mono size={9} op={0.75} style={{ color: 'inherit' }}>
            FIG. 01 · Lisbon · 04.26
          </Mono>
        </div>
      </div>
    </section>
  )
}
