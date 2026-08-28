// lib/analytics.ts
// Thin wrappers around gtag.js (GA4) and the Meta Pixel, both loaded (or not)
// via <Script> tags in app/layout.tsx. Every call here is a no-op if the env
// vars aren't configured or the scripts haven't loaded yet (ad blockers, a
// slow connection, or simply no credentials set for this environment) —
// analytics must never be able to break the actual shopping flow.
// Plain functions, not a component — only ever called from client components
// (PDPProductInfo, checkout, PurchaseTracking), so no 'use client' needed here.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export type AnalyticsItem = {
  id: number
  name: string
  price: number
  quantity?: number
}

function ga(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

function pixel(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, data)
  }
}

function gaItems(items: AnalyticsItem[]) {
  return items.map((i) => ({
    item_id: String(i.id),
    item_name: i.name,
    price: i.price,
    quantity: i.quantity ?? 1,
  }))
}

export function trackViewItem(item: AnalyticsItem) {
  ga('event', 'view_item', { currency: 'INR', value: item.price, items: gaItems([item]) })
  pixel('ViewContent', {
    content_ids: [String(item.id)],
    content_name: item.name,
    currency: 'INR',
    value: item.price,
  })
}

export function trackAddToCart(item: AnalyticsItem) {
  const quantity = item.quantity ?? 1
  const value = item.price * quantity
  ga('event', 'add_to_cart', { currency: 'INR', value, items: gaItems([item]) })
  pixel('AddToCart', { content_ids: [String(item.id)], content_name: item.name, currency: 'INR', value })
}

export function trackBeginCheckout(items: AnalyticsItem[], value: number) {
  ga('event', 'begin_checkout', { currency: 'INR', value, items: gaItems(items) })
  pixel('InitiateCheckout', {
    content_ids: items.map((i) => String(i.id)),
    currency: 'INR',
    value,
    num_items: items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
  })
}

export function trackPurchase(orderId: string, items: AnalyticsItem[], value: number) {
  ga('event', 'purchase', { transaction_id: orderId, currency: 'INR', value, items: gaItems(items) })
  pixel('Purchase', {
    content_ids: items.map((i) => String(i.id)),
    currency: 'INR',
    value,
    num_items: items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
  })
}
