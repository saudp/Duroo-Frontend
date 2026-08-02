'use client'

// app/checkout/page.tsx — Duroo Checkout
// Two-column: form (left) + order summary (right). WooCommerce order creation preserved.
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import type { CartItem } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'
import Wordmark from '@/components/duroo/Wordmark'
import Mono from '@/components/duroo/Mono'

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.phone || !form.address || !form.pincode) {
      alert('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items, total: total() }),
      })
      const data = await res.json()
      if (data.id) {
        clearCart()
        setPlaced(true)
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch {
      alert('Error placing order. Please try again.')
    }
    setLoading(false)
  }

  if (placed) {
    return (
      <div
        style={{
          background: 'var(--c-paper)',
          color: 'var(--c-ink)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: '48px 22px',
          textAlign: 'center',
        }}
      >
        <Wordmark size={22} />
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: 'var(--c-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            marginTop: 12,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 32, letterSpacing: '-0.025em', margin: 0 }}>
          Order placed
        </h1>
        <p style={{ fontFamily: BF, fontSize: 14, opacity: 0.7, margin: 0, maxWidth: 380 }}>
          Thanks for shopping with Duroo. You&apos;ll receive a confirmation email shortly.
        </p>
        <Link
          href="/products"
          style={{
            fontFamily: BF,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            background: 'var(--c-ink)',
            color: 'var(--c-paper)',
            padding: '16px 32px',
            borderRadius: 999,
            textDecoration: 'none',
            marginTop: 8,
          }}
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          background: 'var(--c-paper)',
          color: 'var(--c-ink)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '48px 22px',
          textAlign: 'center',
        }}
      >
        <Wordmark size={22} />
        <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', margin: '24px 0 0' }}>
          Your bag is empty
        </h1>
        <p style={{ fontFamily: BF, fontSize: 14, opacity: 0.7, margin: 0 }}>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          style={{
            fontFamily: BF,
            fontSize: 14,
            fontWeight: 500,
            background: 'var(--c-yellow)',
            color: 'var(--c-ink)',
            padding: '14px 28px',
            borderRadius: 999,
            textDecoration: 'none',
            marginTop: 8,
          }}
        >
          Shop Now
        </Link>
      </div>
    )
  }

  const subtotal = total()

  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>

      {/* Minimal topbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(18px,1.8vw,24px) clamp(22px,3vw,48px)',
          borderBottom: '1px solid rgba(12,12,12,0.08)',
          background: 'var(--c-paper)',
        }}
      >
        <Mono size={9} op={0.55}>
          Secure checkout · <span style={{ opacity: 1 }}>step 1 of 1</span>
        </Mono>
        <Wordmark size={20} />
        <div
          style={{
            width: 22,
            height: 22,
            border: '1px solid currentColor',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontFamily: HF,
          }}
        >
          {items.reduce((s, i) => s + i.quantity, 0)}
        </div>
      </div>

      {/* Mobile: collapsible summary above form */}
      <div
        className="md:hidden"
        style={{ background: 'var(--c-cream)', borderBottom: '1px solid rgba(12,12,12,0.08)', padding: '20px 22px' }}
      >
        <details>
          <summary
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              listStyle: 'none',
              padding: '4px 0',
            }}
          >
            <Mono size={10} op={1}>
              Show order summary · <span style={{ opacity: 0.6 }}>▾</span>
            </Mono>
            <span style={{ fontFamily: HF, fontWeight: 500, fontSize: 20, letterSpacing: '-0.02em' }}>
              ₹{subtotal.toLocaleString()}
            </span>
          </summary>
          <div style={{ marginTop: 16 }}>
            <OrderSummary items={items} subtotal={subtotal} onSubmit={handleSubmit} loading={loading} mobile />
          </div>
        </details>
      </div>

      {/* Desktop: two-column */}
      <section
        className="hidden md:grid"
        style={{ gridTemplateColumns: '1.25fr 1fr', minHeight: 1200 }}
      >
        {/* Left: form */}
        <div style={{ padding: '48px 80px 64px', maxWidth: 680, marginLeft: 'auto', width: '100%' }}>
          <CheckoutForm form={form} onChange={onChange} onSubmit={handleSubmit} loading={loading} totalAmount={subtotal + 299} />
        </div>
        {/* Right: summary */}
        <div style={{ background: 'var(--c-cream)', padding: '48px 80px 64px', maxWidth: 560, width: '100%' }}>
          <OrderSummary items={items} subtotal={subtotal} onSubmit={handleSubmit} loading={loading} />
        </div>
      </section>

      {/* Mobile: form below summary */}
      <div className="md:hidden" style={{ padding: '24px 22px 64px' }}>
        <CheckoutForm form={form} onChange={onChange} onSubmit={handleSubmit} loading={loading} totalAmount={subtotal + 299} />
      </div>

    </div>
  )
}

// ── Checkout form ────────────────────────────────────────────────────────────

function CheckoutForm({
  form,
  onChange,
  onSubmit,
  loading,
  totalAmount,
}: {
  form: FormState
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  loading: boolean
  totalAmount: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Express checkout */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <Mono size={10} op={0.55}>Express checkout</Mono>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { bg: '#5A31F4', fg: '#fff', label: 'shop Pay' },
            { bg: '#FFC439', fg: '#0C0C0C', label: 'PayPal' },
            { bg: '#0C0C0C', fg: '#fff', label: 'G Pay' },
          ].map((b) => (
            <button
              key={b.label}
              style={{
                all: 'unset',
                cursor: 'pointer',
                background: b.bg,
                color: b.fg,
                padding: '13px 0',
                textAlign: 'center',
                fontFamily: HF,
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 999,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: MF,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.55,
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.4 }} />
          <span>Or pay with details</span>
          <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.4 }} />
        </div>
      </div>

      {/* Contact */}
      <FormSection title="Contact" right="Sign in">
        <Field label="Email *" name="email" value={form.email} onChange={onChange} type="email" />
        <CheckRow label="Email me with Duroo news and offers" defaultChecked />
      </FormSection>

      {/* Delivery */}
      <FormSection title="Delivery">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="First name *" name="firstName" value={form.firstName} onChange={onChange} />
          <Field label="Last name"    name="lastName"  value={form.lastName}  onChange={onChange} />
        </div>
        <Field label="Address *"    name="address"  value={form.address}  onChange={onChange} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
          <Field label="City *"    name="city"    value={form.city}    onChange={onChange} />
          <Field label="State"     name="state"   value={form.state}   onChange={onChange} />
          <Field label="Pincode *" name="pincode" value={form.pincode} onChange={onChange} />
        </div>
        <Field label="Phone *" name="phone" value={form.phone} onChange={onChange} type="tel" />
      </FormSection>

      {/* Shipping method */}
      <FormSection title="Shipping method">
        <div style={{ border: '1px solid rgba(12,12,12,0.18)', overflow: 'hidden' }}>
          {[
            { l: 'Standard · 5–7 working days', p: 'Free', active: false },
            { l: 'Express · 2–3 working days', p: '₹299', active: true },
          ].map((s, i) => (
            <label
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderTop: i === 0 ? 'none' : '1px solid rgba(12,12,12,0.08)',
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    border: '1px solid rgba(12,12,12,0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.active && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--c-ink)' }} />}
                </span>
                <span style={{ fontFamily: BF, fontSize: 14 }}>{s.l}</span>
              </span>
              <span style={{ fontFamily: HF, fontWeight: 500, fontSize: 13, letterSpacing: '-0.02em' }}>{s.p}</span>
            </label>
          ))}
        </div>
      </FormSection>

      {/* Payment */}
      <FormSection title="Payment">
        <Mono size={10} op={0.55} style={{ display: 'block', marginBottom: 14 }}>
          All transactions are encrypted end-to-end.
        </Mono>
        <div style={{ border: '1px solid rgba(12,12,12,0.18)' }}>
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: 'var(--c-paper)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: '1px solid rgba(12,12,12,0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--c-ink)' }} />
              </span>
              <span style={{ flex: 1, fontFamily: BF, fontSize: 14, fontWeight: 500 }}>Credit card</span>
              <Mono size={10} op={0.65}>VISA · MC · AMEX</Mono>
            </label>
            <div style={{ padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Field label="Card number" name="_card" value="" onChange={() => {}} placeholder="•••• •••• •••• ••••" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Expiry (MM / YY)" name="_exp" value="" onChange={() => {}} />
                <Field label="CVC" name="_cvc" value="" onChange={() => {}} />
              </div>
              <Field label="Name on card" name="_name" value="" onChange={() => {}} />
              <CheckRow label="Use shipping address as billing address" defaultChecked />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Returns */}
      <div
        style={{
          border: '1px solid rgba(12,12,12,0.18)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            marginTop: 2,
            background: 'var(--c-ink)',
            flex: '0 0 auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--c-paper)',
            fontSize: 10,
          }}
        >
          ✓
        </span>
        <div>
          <div style={{ fontFamily: HF, fontWeight: 500, fontSize: 14, letterSpacing: '-0.025em', marginBottom: 4 }}>
            30-day free returns included
          </div>
          <p style={{ fontFamily: BF, fontSize: 13, lineHeight: 1.55, opacity: 0.7, margin: 0 }}>
            Easy hassle-free returns within 30 days of delivery.
          </p>
        </div>
      </div>

      {/* Pay button */}
      <div>
        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            all: 'unset',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            padding: '20px 0',
            textAlign: 'center',
            background: 'var(--c-yellow)',
            color: 'var(--c-ink)',
            fontFamily: BF,
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: '-0.01em',
            borderRadius: 999,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Placing order…' : `Pay ₹${totalAmount.toLocaleString()} →`}
        </button>
        <Mono size={9} op={0.55} style={{ display: 'block', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          By paying, you agree to Duroo&apos;s Terms of Service and Privacy Policy.
        </Mono>
      </div>

      {/* Footer links */}
      <div
        style={{
          borderTop: '1px solid rgba(12,12,12,0.08)',
          paddingTop: 18,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          fontFamily: MF,
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        {['Refunds', 'Shipping', 'Privacy', 'Terms'].map((l) => (
          <span key={l} style={{ borderBottom: '1px solid currentColor', paddingBottom: 1, cursor: 'pointer' }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )

}

// ── Order summary ────────────────────────────────────────────────────────────

function OrderSummary({
  items,
  subtotal,
  mobile = false,
}: {
  items: CartItem[]
  subtotal: number
  onSubmit: () => void
  loading: boolean
  mobile?: boolean
}) {
  const shipping = 299

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Line items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', width: 68, flex: '0 0 68px' }}>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={68}
                  height={84}
                  style={{ width: 68, height: 84, objectFit: 'cover', display: 'block' }}
                />
              )}
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: 'var(--c-ink)',
                  color: 'var(--c-paper)',
                  fontFamily: HF,
                  fontWeight: 500,
                  fontSize: 11,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.quantity}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BF, fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{item.name}</div>
              <Mono size={9} op={0.6} style={{ display: 'block', marginTop: 4 }}>
                {[item.color, item.size].filter(Boolean).join(' · ')}
              </Mono>
            </div>
            <div style={{ fontFamily: HF, fontWeight: 500, fontSize: 13, letterSpacing: '-0.02em' }}>
              ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Discount code */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
        <div
          style={{
            border: '1px solid rgba(12,12,12,0.18)',
            padding: '14px 16px',
            background: mobile ? 'transparent' : '#FFFFFF',
            fontFamily: BF,
            fontSize: 14,
            color: 'rgba(12,12,12,0.45)',
          }}
        >
          Discount code or gift card
        </div>
        <button
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '14px 24px',
            fontFamily: MF,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            border: '1px solid rgba(12,12,12,0.4)',
          }}
        >
          Apply
        </button>
      </div>

      {/* Totals */}
      <div style={{ borderTop: '1px solid rgba(12,12,12,0.10)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SummaryRow l="Subtotal" v={`₹${subtotal.toLocaleString()}`} />
        <SummaryRow l="Express shipping" v={`₹${shipping.toLocaleString()}`} />
        <SummaryRow l="GST" v="Included" sub />
        <div
          style={{
            marginTop: 8,
            paddingTop: 14,
            borderTop: '1px solid rgba(12,12,12,0.10)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <h4 style={{ fontFamily: HF, fontWeight: 500, fontSize: 22, letterSpacing: '-0.025em', margin: 0 }}>Total</h4>
          <div style={{ textAlign: 'right' }}>
            <Mono size={9} op={0.55}>INR</Mono>
            <div style={{ fontFamily: HF, fontWeight: 500, fontSize: 28, letterSpacing: '-0.03em', lineHeight: 1 }}>
              ₹{(subtotal + shipping).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Reassurance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingTop: 14 }}>
        {[
          { l: 'Free returns', s: '30-day hassle-free returns' },
          { l: 'Secure payment', s: 'End-to-end encrypted checkout' },
        ].map((r) => (
          <div key={r.l}>
            <div style={{ fontFamily: HF, fontWeight: 500, fontSize: 13, letterSpacing: '-0.025em' }}>{r.l}</div>
            <div style={{ fontFamily: BF, fontSize: 11.5, lineHeight: 1.55, opacity: 0.65, marginTop: 4 }}>{r.s}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryRow({ l, v, sub }: { l: string; v: string; sub?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BF, fontSize: 14, opacity: sub ? 0.6 : 1 }}>
      <span>{l}</span>
      <span style={{ fontFamily: HF, fontWeight: 500, fontSize: 13, letterSpacing: '-0.02em' }}>{v}</span>
    </div>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function FormSection({
  title,
  right,
  children,
}: {
  title: string
  right?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <h3 style={{ fontFamily: HF, fontWeight: 500, fontSize: 20, letterSpacing: '-0.025em', margin: 0 }}>{title}</h3>
        {right && (
          <span
            style={{
              fontFamily: MF,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              borderBottom: '1px solid currentColor',
              paddingBottom: 1,
              cursor: 'pointer',
            }}
          >
            {right}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}) {
  const filled = value.length > 0
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid rgba(12,12,12,0.18)',
        padding: filled ? '20px 16px 8px' : '16px 16px',
        marginBottom: 10,
        background: '#FFFFFF',
      }}
    >
      {filled && (
        <span
          style={{
            position: 'absolute',
            top: 6,
            left: 16,
            fontFamily: MF,
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.55,
          }}
        >
          {label.replace(' *', '')}
        </span>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={filled ? '' : label}
        style={{
          all: 'unset',
          display: 'block',
          width: '100%',
          fontFamily: BF,
          fontSize: 14,
          color: filled ? 'var(--c-ink)' : 'rgba(12,12,12,0.45)',
        }}
      />
    </div>
  )
}

function CheckRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 4,
        cursor: 'pointer',
        fontFamily: BF,
        fontSize: 13,
        opacity: 0.85,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          flex: '0 0 auto',
          border: '1px solid rgba(12,12,12,0.5)',
          background: defaultChecked ? 'var(--c-ink)' : 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--c-paper)',
          fontSize: 10,
        }}
      >
        {defaultChecked && '✓'}
      </span>
      <span>{label}</span>
    </label>
  )
}
