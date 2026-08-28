'use client'

// app/checkout/page.tsx — Duroo Checkout
// Two-column: form (left) + order summary (right). WooCommerce order creation preserved.
import { useState, useEffect } from 'react'
import Script from 'next/script'
import { useCartStore } from '@/store/cart'
import type { CartItem } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'
import Wordmark from '@/components/duroo/Wordmark'
import Mono from '@/components/duroo/Mono'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

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

type FormErrors = Partial<Record<keyof FormState, string>>
type ShippingMethod = 'standard' | 'express'
type CouponStatus = 'idle' | 'checking' | 'error'

const SHIPPING_COST: Record<ShippingMethod, number> = { standard: 0, express: 299 }

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('express')
  const [emailOptIn, setEmailOptIn] = useState(true)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('idle')
  const [couponError, setCouponError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Clear that field's error as soon as the user edits it
    if (errors[name as keyof FormState]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!form.firstName.trim()) next.firstName = 'Please enter your first name'
    if (!form.email.trim()) {
      next.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address'
    }
    if (!form.phone.trim()) {
      next.phone = 'Please enter your phone number'
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a 10 digit phone number'
    }
    if (!form.address.trim()) next.address = 'Please enter your address'
    if (!form.city.trim()) next.city = 'Please enter your city'
    if (!form.pincode.trim()) {
      next.pincode = 'Please enter your pincode'
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      next.pincode = 'Please enter a 6 digit pincode'
    }
    return next
  }

  const subtotal = total()
  const shippingCost = SHIPPING_COST[shippingMethod]
  const discount = appliedCoupon?.discount ?? 0
  const totalAmount = Math.max(subtotal + shippingCost - discount, 0)

  const applyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return
    setCouponStatus('checking')
    setCouponError(null)
    try {
      const res = await fetch('/api/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        setAppliedCoupon({ code: data.code, discount: data.discount })
        setCouponInput('')
      } else {
        setCouponError(data.error || 'That code isn’t valid.')
      }
    } catch {
      setCouponError('Could not verify that code. Please try again.')
    }
    setCouponStatus('idle')
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
  }

  const finalizeOrder = async (payment: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form,
          items,
          shippingMethod,
          couponCode: appliedCoupon?.code,
          emailOptIn,
          payment,
        }),
      })
      const data = await res.json()
      if (data.id) {
        clearCart()
        setPlaced(true)
      } else {
        setSubmitError(data.error || 'Payment succeeded but we could not record your order. Please contact support.')
      }
    } catch {
      setSubmitError('Payment succeeded but we lost the connection while recording your order. Please contact support.')
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    setSubmitError(null)
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Bring the first invalid field into view instead of a browser popup
      const firstField = Object.keys(validationErrors)[0]
      document.querySelector<HTMLInputElement>(`input[name="${firstField}"]`)?.focus()
      return
    }
    if (!window.Razorpay) {
      setSubmitError('Payment is still loading. Please try again in a moment.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          shippingMethod,
          couponCode: appliedCoupon?.code,
        }),
      })
      const order = await res.json()
      if (!order.id) {
        setSubmitError(order.error || 'Could not start payment. Please try again.')
        setLoading(false)
        return
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Duroo',
        description: 'Order payment',
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#0C0C0C' },
        handler: (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          finalizeOrder(response)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      razorpay.open()
    } catch {
      setSubmitError('Error starting payment. Please check your connection and try again.')
      setLoading(false)
    }
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

  // Zustand's persist middleware rehydrates from localStorage after the initial
  // render, so `items` is briefly [] on refresh. Wait for that before deciding
  // whether the bag is actually empty. We still keep the topbar mounted in every
  // state below (loading / empty / full) so the page doesn't jump between two
  // unrelated full-screen layouts — that jump is what reads as a "flash".
  if (!mounted) {
    return (
      <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
        <Topbar count={0} />
        <div style={{ padding: '48px clamp(22px,3vw,80px)', maxWidth: 1240, margin: '0 auto' }}>
          <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>
            {[1, 0.7, 0.85, 1, 0.6].map((w, i) => (
              <div key={i} style={{ height: 48, width: `${w * 100}%`, background: 'rgba(12,12,12,0.06)' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
        <Topbar count={0} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '96px 22px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', margin: 0 }}>
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
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <Topbar count={items.reduce((s, i) => s + i.quantity, 0)} />

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
              ₹{totalAmount.toLocaleString()}
            </span>
          </summary>
          <div style={{ marginTop: 16 }}>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              shippingLabel={shippingMethod === 'standard' ? 'Standard shipping' : 'Express shipping'}
              couponInput={couponInput}
              onCouponInputChange={setCouponInput}
              appliedCoupon={appliedCoupon}
              couponStatus={couponStatus}
              couponError={couponError}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              mobile
            />
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
          <CheckoutForm
            form={form}
            errors={errors}
            submitError={submitError}
            onChange={onChange}
            onSubmit={handleSubmit}
            loading={loading}
            totalAmount={totalAmount}
            shippingMethod={shippingMethod}
            onShippingMethodChange={setShippingMethod}
            emailOptIn={emailOptIn}
            onEmailOptInChange={setEmailOptIn}
          />
        </div>
        {/* Right: summary */}
        <div style={{ background: 'var(--c-cream)', padding: '48px 80px 64px', maxWidth: 560, width: '100%' }}>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            shippingLabel={shippingMethod === 'standard' ? 'Standard shipping' : 'Express shipping'}
            couponInput={couponInput}
            onCouponInputChange={setCouponInput}
            appliedCoupon={appliedCoupon}
            couponStatus={couponStatus}
            couponError={couponError}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
          />
        </div>
      </section>

      {/* Mobile: form below summary */}
      <div className="md:hidden" style={{ padding: '24px 22px 64px' }}>
        <CheckoutForm
          form={form}
          errors={errors}
          submitError={submitError}
          onChange={onChange}
          onSubmit={handleSubmit}
          loading={loading}
          totalAmount={totalAmount}
          shippingMethod={shippingMethod}
          onShippingMethodChange={setShippingMethod}
          emailOptIn={emailOptIn}
          onEmailOptInChange={setEmailOptIn}
        />
      </div>

    </div>
  )
}

// ── Checkout form ────────────────────────────────────────────────────────────

function CheckoutForm({
  form,
  errors,
  submitError,
  onChange,
  onSubmit,
  loading,
  totalAmount,
  shippingMethod,
  onShippingMethodChange,
  emailOptIn,
  onEmailOptInChange,
}: {
  form: FormState
  errors: FormErrors
  submitError: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  loading: boolean
  totalAmount: number
  shippingMethod: ShippingMethod
  onShippingMethodChange: (method: ShippingMethod) => void
  emailOptIn: boolean
  onEmailOptInChange: (checked: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Contact */}
      <FormSection title="Contact" right="Sign in" rightHref="/account/sign-in">
        <Field label="Email *" name="email" value={form.email} onChange={onChange} type="email" error={errors.email} />
        <Checkbox
          label="Email me with Duroo news and offers"
          checked={emailOptIn}
          onChange={onEmailOptInChange}
        />
      </FormSection>

      {/* Delivery */}
      <FormSection title="Delivery">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="First name *" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
          <Field label="Last name" name="lastName" value={form.lastName} onChange={onChange} />
        </div>
        <Field label="Address *" name="address" value={form.address} onChange={onChange} error={errors.address} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
          <Field label="City *" name="city" value={form.city} onChange={onChange} error={errors.city} />
          <Field label="State" name="state" value={form.state} onChange={onChange} />
          <Field label="Pincode *" name="pincode" value={form.pincode} onChange={onChange} error={errors.pincode} />
        </div>
        <Field label="Phone *" name="phone" value={form.phone} onChange={onChange} type="tel" error={errors.phone} />
      </FormSection>

      {/* Shipping method */}
      <FormSection title="Shipping method">
        <div style={{ border: '1px solid rgba(12,12,12,0.18)', overflow: 'hidden' }}>
          {(
            [
              { method: 'standard' as ShippingMethod, l: 'Standard · 5–7 working days', p: 'Free' },
              { method: 'express' as ShippingMethod, l: 'Express · 2–3 working days', p: '₹299' },
            ]
          ).map((s, i) => (
            <label
              key={s.method}
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
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === s.method}
                  onChange={() => onShippingMethodChange(s.method)}
                  style={{ margin: 0, accentColor: 'var(--c-ink)', width: 16, height: 16 }}
                />
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
          All transactions are secure and encrypted.
        </Mono>
        <div
          style={{
            border: '1px solid rgba(12,12,12,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            background: 'var(--c-paper)',
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              border: '1px solid rgba(12,12,12,0.5)',
              flex: '0 0 auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--c-ink)' }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: BF, fontSize: 14, fontWeight: 500 }}>Cards, UPI &amp; Netbanking</div>
            <div style={{ fontFamily: BF, fontSize: 12, opacity: 0.6, marginTop: 2 }}>
              You&apos;ll be asked to complete payment of ₹{totalAmount.toLocaleString()} via Razorpay.
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
        {submitError && (
          <div
            role="alert"
            style={{
              border: '1px solid #C0392B',
              background: 'rgba(192,57,43,0.06)',
              color: '#C0392B',
              padding: '14px 16px',
              marginBottom: 14,
              fontFamily: BF,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {submitError}
          </div>
        )}
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
          {loading ? 'Processing…' : `Pay now — ₹${totalAmount.toLocaleString()} →`}
        </button>
        <Mono size={9} op={0.55} style={{ display: 'block', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          By placing this order, you agree to Duroo&apos;s{' '}
          <Link href="/terms" style={{ color: 'inherit' }}>Terms of Service</Link> and{' '}
          <Link href="/privacy" style={{ color: 'inherit' }}>Privacy Policy</Link>.
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
        {[
          { l: 'Refunds', href: '/refunds' },
          { l: 'Shipping', href: '/shipping' },
          { l: 'Privacy', href: '/privacy' },
          { l: 'Terms', href: '/terms' },
        ].map((f) => (
          <Link
            key={f.l}
            href={f.href}
            style={{ borderBottom: '1px solid currentColor', paddingBottom: 1, color: 'inherit', textDecoration: 'none' }}
          >
            {f.l}
          </Link>
        ))}
      </div>
    </div>
  )

}

// ── Order summary ────────────────────────────────────────────────────────────

function OrderSummary({
  items,
  subtotal,
  shippingCost,
  shippingLabel,
  couponInput,
  onCouponInputChange,
  appliedCoupon,
  couponStatus,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  mobile = false,
}: {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  shippingLabel: string
  couponInput: string
  onCouponInputChange: (value: string) => void
  appliedCoupon: { code: string; discount: number } | null
  couponStatus: CouponStatus
  couponError: string | null
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  mobile?: boolean
}) {
  const discount = appliedCoupon?.discount ?? 0
  const grandTotal = Math.max(subtotal + shippingCost - discount, 0)

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
      <div>
        {appliedCoupon ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(12,12,12,0.18)',
              padding: '14px 16px',
              background: mobile ? 'transparent' : '#FFFFFF',
            }}
          >
            <span style={{ fontFamily: BF, fontSize: 14 }}>
              <strong style={{ fontWeight: 500 }}>{appliedCoupon.code.toUpperCase()}</strong> applied · −₹{appliedCoupon.discount.toLocaleString()}
            </span>
            <button
              onClick={onRemoveCoupon}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: MF,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                opacity: 0.6,
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
            <input
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value)}
              placeholder="Discount code or gift card"
              style={{
                all: 'unset',
                border: '1px solid rgba(12,12,12,0.18)',
                padding: '14px 16px',
                background: mobile ? 'transparent' : '#FFFFFF',
                fontFamily: BF,
                fontSize: 14,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={onApplyCoupon}
              disabled={couponStatus === 'checking' || !couponInput.trim()}
              style={{
                all: 'unset',
                cursor: couponStatus === 'checking' ? 'not-allowed' : 'pointer',
                padding: '14px 24px',
                fontFamily: MF,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid rgba(12,12,12,0.4)',
                opacity: couponInput.trim() ? 1 : 0.5,
              }}
            >
              {couponStatus === 'checking' ? 'Checking…' : 'Apply'}
            </button>
          </div>
        )}
        {couponError && (
          <div style={{ fontFamily: MF, fontSize: 10, color: '#C0392B', marginTop: 6 }}>
            {couponError}
          </div>
        )}
      </div>

      {/* Totals */}
      <div style={{ borderTop: '1px solid rgba(12,12,12,0.10)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SummaryRow l="Subtotal" v={`₹${subtotal.toLocaleString()}`} />
        <SummaryRow l={shippingLabel} v={shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`} />
        {discount > 0 && <SummaryRow l="Discount" v={`−₹${discount.toLocaleString()}`} />}
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
              ₹{grandTotal.toLocaleString()}
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

function Topbar({ count }: { count: number }) {
  return (
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
        {count}
      </div>
    </div>
  )
}

function FormSection({
  title,
  right,
  rightHref,
  children,
}: {
  title: string
  right?: string
  rightHref?: string
  children: React.ReactNode
}) {
  const rightStyle: React.CSSProperties = {
    fontFamily: MF,
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    borderBottom: '1px solid currentColor',
    paddingBottom: 1,
    color: 'inherit',
    textDecoration: 'none',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <h3 style={{ fontFamily: HF, fontWeight: 500, fontSize: 20, letterSpacing: '-0.025em', margin: 0 }}>{title}</h3>
        {right && (
          rightHref ? (
            <Link href={rightHref} style={rightStyle}>{right}</Link>
          ) : (
            <span style={{ ...rightStyle, cursor: 'pointer' }}>{right}</span>
          )
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
  error,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  error?: string
}) {
  const filled = value.length > 0
  return (
    <div style={{ marginBottom: error ? 4 : 10 }}>
      <div
        style={{
          position: 'relative',
          border: error ? '1px solid #C0392B' : '1px solid rgba(12,12,12,0.18)',
          padding: filled ? '20px 16px 8px' : '16px 16px',
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
      {error && (
        <div
          style={{
            fontFamily: MF,
            fontSize: 10,
            letterSpacing: '0.02em',
            color: '#C0392B',
            marginTop: 4,
            marginBottom: 10,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      style={{
        position: 'relative',
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
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 16, height: 16, margin: 0 }}
      />
      <span
        style={{
          width: 16,
          height: 16,
          flex: '0 0 auto',
          border: '1px solid rgba(12,12,12,0.5)',
          background: checked ? 'var(--c-ink)' : 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--c-paper)',
          fontSize: 10,
        }}
      >
        {checked && '✓'}
      </span>
      <span>{label}</span>
    </label>
  )
}
