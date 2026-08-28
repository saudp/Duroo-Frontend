'use client'

// app/account/orders/page.tsx — guest order lookup. No login system exists
// yet (no WP-side auth plugin), so this covers the actual "where's my
// order" need without any new auth infrastructure: order number + the
// billing email on that order, verified server-side by /api/lookup-order.
import { useState } from 'react'
import Link from 'next/link'
import Wordmark from '@/components/duroo/Wordmark'
import Mono from '@/components/duroo/Mono'
import OrderDetails from '@/components/shop/OrderDetails'
import type { WCOrder } from '@/lib/types'

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'

export default function AccountOrdersPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<WCOrder | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both your order number and email.')
      return
    }
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/lookup-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not find that order.')
        setStatus('error')
        return
      }
      setOrder(data)
      setStatus('idle')
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setOrder(null)
    setOrderNumber('')
    setEmail('')
    setError(null)
    setStatus('idle')
  }

  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(18px,1.8vw,24px) clamp(22px,3vw,48px)',
          borderBottom: '1px solid rgba(12,12,12,0.08)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Wordmark size={20} />
        </Link>
        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Mono size={9} op={0.55}>Continue shopping →</Mono>
        </Link>
      </div>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: 'clamp(48px,6vw,88px) clamp(22px,3vw,48px)' }}>
        <h1
          style={{
            fontFamily: HF,
            fontWeight: 500,
            fontSize: 'clamp(26px,3vw,36px)',
            letterSpacing: '-0.025em',
            margin: '0 0 12px',
          }}
        >
          Find your order
        </h1>
        <p style={{ fontFamily: BF, fontSize: 14.5, lineHeight: 1.65, opacity: 0.75, margin: '0 0 32px', maxWidth: 460 }}>
          Account sign-in isn&apos;t live yet — enter your order number and the email you checked out with, and
          we&apos;ll pull it up.
        </p>

        {order ? (
          <>
            <OrderDetails order={order} />
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                onClick={reset}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: 2,
                }}
              >
                Look up another order
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <FormField
              label="Order number"
              value={orderNumber}
              onChange={setOrderNumber}
              placeholder="e.g. 1042"
            />
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                all: 'unset',
                cursor: status === 'loading' ? 'default' : 'pointer',
                padding: '16px 0',
                textAlign: 'center',
                fontFamily: BF,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                background: 'var(--c-yellow)',
                color: 'var(--c-ink)',
                borderRadius: 999,
                opacity: status === 'loading' ? 0.6 : 1,
                marginTop: 4,
              }}
            >
              {status === 'loading' ? 'Looking up…' : 'Find my order'}
            </button>
            {error && (
              <Mono size={10} op={1} style={{ color: '#B3261E', textAlign: 'center' }}>
                {error}
              </Mono>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Mono size={9} op={0.55}>{label}</Mono>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          all: 'unset',
          border: '1px solid rgba(12,12,12,0.18)',
          padding: '14px 16px',
          fontFamily: BF,
          fontSize: 14,
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </label>
  )
}
