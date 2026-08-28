// lib/about.ts
//
// Fetches About page content from the custom WP REST route (not the WC
// REST API, so this lives separately from woocommerce.ts). Runs
// server-side from app/about/page.tsx — safe to hit duroo.in directly
// here, same as woocommerce.ts.
//
// `revalidate: 3600` gives ISR: Next serves the cached page instantly and
// re-fetches in the background at most once an hour, so wp-admin edits
// land within ~1 hour without a redeploy.

import type { AboutPageData } from './types'

const WP_URL = process.env.NEXT_PUBLIC_WP_URL

export async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/duroo/v1/about`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`About page fetch failed: ${res.status} ${res.statusText}`)
      return null
    }

    return (await res.json()) as AboutPageData
  } catch (error) {
    console.error('Failed to fetch About page data:', error)
    return null
  }
}
