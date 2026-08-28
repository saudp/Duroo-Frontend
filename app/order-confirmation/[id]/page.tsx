// app/order-confirmation/[id]/page.tsx — real, reloadable/shareable order
// confirmation. Replaces checkout's old local `placed` boolean, which showed
// generic "Order placed" copy with no real order number and vanished on
// refresh since it lived only in component state.
import { getOrderById } from '@/lib/woocommerce'
import Wordmark from '@/components/duroo/Wordmark'
import Mono from '@/components/duroo/Mono'
import Link from 'next/link'
import Image from 'next/image'

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const orderId = Number(id)

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return <NotFoundState />
  }

  let order
  try {
    order = await getOrderById(orderId)
  } catch {
    return <ErrorState />
  }

  if (!order) {
    return <NotFoundState />
  }

  const currency = order.currency_symbol || '₹'
  const placedDate = new Date(order.date_created).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(22px,3vw,48px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,56px)' }}>
          <Wordmark size={20} />
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
              margin: '20px auto 0',
            }}
          >
            ✓
          </div>
          <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 'clamp(26px,3vw,36px)', letterSpacing: '-0.025em', margin: '20px 0 8px' }}>
            Order confirmed
          </h1>
          <p style={{ fontFamily: BF, fontSize: 14, opacity: 0.7, margin: 0 }}>
            Thanks for shopping with Duroo, {order.billing.first_name}. A confirmation email is on its way to{' '}
            {order.billing.email}.
          </p>
        </div>

        {/* Order meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            padding: '20px 0',
            borderTop: '1px solid rgba(12,12,12,0.12)',
            borderBottom: '1px solid rgba(12,12,12,0.12)',
            marginBottom: 32,
          }}
        >
          <div>
            <Mono size={9} op={0.55} style={{ display: 'block', marginBottom: 4 }}>Order number</Mono>
            <span style={{ fontFamily: BF, fontSize: 14, fontWeight: 500 }}>#{order.number}</span>
          </div>
          <div>
            <Mono size={9} op={0.55} style={{ display: 'block', marginBottom: 4 }}>Placed</Mono>
            <span style={{ fontFamily: BF, fontSize: 14 }}>{placedDate}</span>
          </div>
          <div>
            <Mono size={9} op={0.55} style={{ display: 'block', marginBottom: 4 }}>Payment</Mono>
            <span style={{ fontFamily: BF, fontSize: 14 }}>{order.payment_method_title || 'Razorpay'}</span>
          </div>
          <div>
            <Mono size={9} op={0.55} style={{ display: 'block', marginBottom: 4 }}>Status</Mono>
            <span style={{ fontFamily: BF, fontSize: 14, textTransform: 'capitalize' }}>{order.status}</span>
          </div>
        </div>

        {/* Line items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {order.line_items.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {item.image?.src && (
                <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0, background: 'var(--c-cream)' }}>
                  <Image src={item.image.src} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: BF, fontSize: 14, fontWeight: 500, margin: 0 }}>{item.name}</p>
                {item.meta_data && item.meta_data.length > 0 && (
                  <p style={{ fontFamily: BF, fontSize: 12, opacity: 0.6, margin: '2px 0 0' }}>
                    {item.meta_data.map((m) => `${m.display_key || m.key}: ${m.display_value || m.value}`).join(' · ')}
                  </p>
                )}
                <p style={{ fontFamily: BF, fontSize: 12, opacity: 0.6, margin: '2px 0 0' }}>Qty {item.quantity}</p>
              </div>
              <span style={{ fontFamily: BF, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
                {currency}{item.total}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '20px 0',
            borderTop: '1px solid rgba(12,12,12,0.12)',
            marginBottom: 32,
            fontFamily: BF,
            fontSize: 13.5,
          }}
        >
          {order.shipping_lines?.[0] && (
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
              <span>{order.shipping_lines[0].method_title}</span>
              <span>{Number(order.shipping_lines[0].total) > 0 ? `${currency}${order.shipping_lines[0].total}` : 'Free'}</span>
            </div>
          )}
          {Number(order.discount_total) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
              <span>Discount</span>
              <span>−{currency}{order.discount_total}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontSize: 16, marginTop: 6 }}>
            <span>Total</span>
            <span>{currency}{order.total}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div style={{ marginBottom: 40 }}>
          <Mono size={9} op={0.55} style={{ display: 'block', marginBottom: 8 }}>Shipping to</Mono>
          <p style={{ fontFamily: BF, fontSize: 14, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
            {order.shipping.first_name} {order.shipping.last_name}<br />
            {order.shipping.address_1}{order.shipping.address_2 ? `, ${order.shipping.address_2}` : ''}<br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}<br />
            {order.shipping.country}
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
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
              display: 'inline-block',
            }}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <CenteredMessage
      heading="We couldn’t find that order"
      body="The order link looks incorrect, or the order may no longer exist. If you just completed a payment, check your email for a confirmation, or contact support with your payment reference."
    />
  )
}

function ErrorState() {
  return (
    <CenteredMessage
      heading="Something went wrong"
      body="We couldn't load your order right now. If you just completed a payment, don't worry — it went through. Please refresh in a moment, or contact support if this keeps happening."
    />
  )
}

function CenteredMessage({ heading, body }: { heading: string; body: string }) {
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
      <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 28, letterSpacing: '-0.025em', margin: 0, maxWidth: 420 }}>
        {heading}
      </h1>
      <p style={{ fontFamily: BF, fontSize: 14, opacity: 0.7, margin: 0, maxWidth: 380 }}>
        {body}
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
