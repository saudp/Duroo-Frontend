'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import Wordmark from '@/components/duroo/Wordmark'
import CartDrawer from '@/components/CartDrawer'

const LINKS = ['Men', 'Women', 'Collections', 'Lookbook', 'Journal'] as const
const LINK_HREFS: Record<string, string> = {
  Men: '/products',
  Women: '/products',
  Collections: '#',
  Lookbook: '#',
  Journal: '#',
}

const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'

export default function Nav() {
  const [mounted, setMounted] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const count = useCartStore((s) => s.count())

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      {/* ── Desktop ── */}
      <header
        className="hidden md:block"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--c-paper)',
          borderBottom: '1px solid rgba(12,12,12,0.10)',
          color: 'var(--c-ink)',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '20px 48px',
            gap: 24,
          }}
        >
        <nav style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
          {LINKS.map((l, i) => (
            <Link
              key={l}
              href={LINK_HREFS[l]}
              style={{
                fontFamily: BF,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '-0.005em',
                opacity: i === 0 ? 1 : 0.7,
                borderBottom: i === 0 ? '1px solid currentColor' : 'none',
                paddingBottom: i === 0 ? 2 : 0,
              }}
            >
              {l}
            </Link>
          ))}
        </nav>

        <Link href="/">
          <Wordmark size={26} weight={500} letterSpacing="0.32em" />
        </Link>

        <div
          style={{
            display: 'flex',
            gap: 22,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: BF, fontSize: 14, fontWeight: 500, opacity: 0.7, cursor: 'pointer' }}>
            Search
          </span>
          <Link href="/account" style={{ fontFamily: BF, fontSize: 14, fontWeight: 500, opacity: 0.7 }}>
            Account
          </Link>
          <span style={{ fontFamily: BF, fontSize: 14, fontWeight: 500, opacity: 0.7 }}>
            IN · ₹
          </span>
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: BF,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              color: 'inherit',
            }}
          >
            Bag ({mounted ? count : 0})
          </button>
        </div>
        </div>
      </header>

      {/* ── Mobile ── */}
      <header
        className="flex md:hidden"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          background: 'var(--c-paper)',
          borderBottom: '1px solid rgba(12,12,12,0.10)',
          color: 'var(--c-ink)',
        }}
      >
        <button
          aria-label="Open menu"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 22, height: 1.5, background: 'currentColor', display: 'block' }} />
          <span style={{ width: 22, height: 1.5, background: 'currentColor', display: 'block' }} />
        </button>

        <Link href="/">
          <Wordmark size={20} weight={500} letterSpacing="0.28em" />
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: MF,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          Bag · {mounted ? count : 0}
        </button>
      </header>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  )
}
