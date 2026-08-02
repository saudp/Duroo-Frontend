'use client'

import { useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link'
import Mono from '@/components/duroo/Mono'
import ProductCard from './ProductCard'
import type { WCProduct } from '@/lib/types'

const FHEAD = 'var(--ff-head)'
const FMONO = 'var(--ff-mono)'

export default function ProductRail({
  eyebrow,
  title,
  items,
  shopAllHref = '/products',
}: {
  eyebrow?: string
  title: string
  items: WCProduct[]
  shopAllHref?: string
}) {
  const [activeTab, setActiveTab] = useState<'Men' | 'Women'>('Men')
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
  })

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="pt-14 pb-14 md:pt-[88px] md:pb-[88px]">
      <div className="max-w-[1440px] mx-auto">
      {/* Section header */}
      <div className="px-[22px] md:px-[48px] mb-5 md:mb-7">
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            {eyebrow && (
              <Mono
                size={10}
                op={0.55}
                style={{ display: 'block', marginBottom: 10 }}
              >
                {eyebrow}
              </Mono>
            )}
            <h2
              style={{
                fontFamily: FHEAD,
                fontWeight: 500,
                fontSize: 'clamp(28px, 3vw, 40px)',
                letterSpacing: '-0.025em',
                lineHeight: 1,
                margin: 0,
              }}
            >
              {title}
            </h2>

            {/* Men / Women toggle */}
            <div style={{ display: 'flex', gap: 4, marginTop: 18 }}>
              {(['Men', 'Women'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    padding: '8px 18px',
                    fontFamily: FMONO,
                    fontSize: 10,
                    letterSpacing: 'var(--ls-mono)',
                    textTransform: 'uppercase',
                    borderRadius: 'var(--r-pill)',
                    background: t === activeTab ? 'var(--c-night)' : 'transparent',
                    color: t === activeTab ? 'var(--c-bone)' : 'inherit',
                    border:
                      t === activeTab
                        ? '1px solid var(--c-night)'
                        : '1px solid rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Prev / Next arrows — desktop only */}
          <div className="hidden md:flex" style={{ gap: 8, alignItems: 'center' }}>
            <button
              aria-label="Previous"
              onClick={prev}
              style={{
                width: 38,
                height: 38,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 999,
                background: 'none',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              style={{
                width: 38,
                height: 38,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 999,
                background: 'none',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Embla carousel */}
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div
          className="px-[22px] md:px-[48px]"
          style={{
            display: 'flex',
            gap: 'clamp(12px, 1.5vw, 18px)',
          }}
        >
          {items.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              priority={i < 3}
              width={undefined}
            />
          ))}
        </div>
      </div>

      {/* Shop all button */}
      <div className="px-[22px] md:px-[48px] mt-5 md:mt-6">
        <Link
          href={shopAllHref}
          style={{
            display: 'inline-block',
            padding: '12px 22px',
            fontFamily: FMONO,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            borderRadius: 999,
            background: 'var(--c-night)',
            color: 'var(--c-bone)',
            textDecoration: 'none',
          }}
        >
          Shop all {activeTab.toLowerCase()} →
        </Link>
      </div>
      </div>
    </section>
  )
}
