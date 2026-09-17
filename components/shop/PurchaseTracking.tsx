'use client'

// PurchaseTracking — fires the `purchase`/`Purchase` conversion event using
// the real order WooCommerce just confirmed. Rendered (invisibly) from the
// order-confirmation Server Component, since gtag/fbq only exist client-side.
//
// Guarded against double-firing on refresh: the confirmation page is a real,
// reloadable URL (that's the whole point of #4), so without a guard hitting
// refresh would report the same purchase twice. sessionStorage is enough —
// once this tab's session has recorded the order id, it won't fire again.
import { useEffect } from 'react'
import { trackPurchase } from '@/lib/analytics'
import type { AnalyticsItem } from '@/lib/analytics'

export default function PurchaseTracking({
  orderId,
  items,
  value,
}: {
  orderId: string
  items: AnalyticsItem[]
  value: number
}) {
  useEffect(() => {
    const key = `duroo_purchase_tracked_${orderId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage unavailable (private browsing, blocked storage) —
      // fire once for this mount rather than not at all.
    }
    trackPurchase(orderId, items, value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  return null
}
