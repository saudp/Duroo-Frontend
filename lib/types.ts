export type WCProduct = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  status: 'publish' | 'draft'
  type: 'simple' | 'variable'
  images: { src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
  attributes: {
    name: string
    options: string[]
  }[]
  variations: number[]
}

export type WCCategory = {
  id: number
  name: string
  slug: string
  count: number
  image: { src: string; alt: string } | null
}

// ─── About page (custom WP REST route: /wp-json/duroo/v1/about) ──
// Kept in sync with wp-backend/rest-about-endpoint.php — the PHP file
// is the source of truth for the response shape.

export type WPImage = {
  url: string
  alt: string
  width: number
  height: number
}

export type AboutHero = {
  lines: [string, string, string]
  backgroundImage: WPImage | null
}

export type AboutSection = {
  eyebrow: string
  heading: string
  /** Raw HTML from an ACF WYSIWYG field (toolbar restricted to 'basic' — editorial content, not user input). */
  body: string
  image: WPImage | null
}

export type AboutPhilosophy = {
  eyebrow: string
  intro: string
  backgroundImage: WPImage | null
}

export type AboutCTA = {
  heading: string
  buttonText: string
  buttonLink: string
}

export type AboutPageData = {
  hero: AboutHero
  originStory: AboutSection
  nameStory: AboutSection
  philosophy: AboutPhilosophy
  cta: AboutCTA
}
