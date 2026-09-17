// components/shop/OrderDetails.tsx
// The order meta / line items / totals / shipping-address block, shared by
// the order-confirmation page and the guest order-lookup page (/account/orders)
// so the two don't drift into two different renderings of the same WCOrder.
import Image from 'next/image'
import Mono from '@/components/duroo/Mono'
import type { WCOrder } from '@/lib/types'

const BF = 'var(--ff-body)'

export default function OrderDetails({ order }: { order: WCOrder }) {
  const currency = order.currency_symbol || '₹'
  const placedDate = new Date(order.date_created).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
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
      <div>
        <Mono size={9} op={0.55} style={{ display: 'block', marginBottom: 8 }}>Shipping to</Mono>
        <p style={{ fontFamily: BF, fontSize: 14, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
          {order.shipping.first_name} {order.shipping.last_name}<br />
          {order.shipping.address_1}{order.shipping.address_2 ? `, ${order.shipping.address_2}` : ''}<br />
          {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}<br />
          {order.shipping.country}
        </p>
      </div>
    </>
  )
}
