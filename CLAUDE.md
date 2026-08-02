# Handoff: Duroo Home — Performance Lifestyle (Next.js)

## Overview

Duroo is a (fictional) performance-luxury menswear/womenswear brand — think Aimé Leon Dore meets Lululemon. Editorial photography, restrained typography, yellow accent. This handoff covers **the public home page** at desktop (1440) and mobile (390) reference widths.

This is the **only direction** going forward — three other variations were explored and discarded. Use this as the source of truth for the home page **and** the visual system for every other page on the site (PDP, PLP, Cart, About, Journal).

## About the Design Files

The files in `design-files/` are **design references created in HTML + inline JSX (transpiled via Babel in the browser)**. They are prototypes showing intended look and behavior. **They are not production code to copy directly.**

Your job is to **recreate these designs in Next.js** using the project's existing conventions — App Router, TypeScript, Tailwind (or CSS modules / styled-components — match the host repo if there is one). Lift exact values (colors, sizes, spacing, copy) from the JSX but rewrite the components against the real stack.

## Fidelity

**High-fidelity.** Colors, type, spacing, copy, and interactions are all final. Recreate pixel-faithfully:

- Exact hex values, font sizes, weights, letter-spacing, line-heights as written in the JSX
- Exact copy (product names, prices, body text, eyebrows)
- Section order and breakpoints (390 mobile, 1440 desktop reference)
- Image placeholders should become real `next/image` components fed by CMS or a manifest — see "Assets" below

The only thing you'll invent is the data layer + responsive scaling between 390 and 1440.

---

## Confirmed Stack (decisions made — do not change)

| Concern | Decision |
|---|---|
| Framework | **Next.js 14, App Router, TypeScript** — already scaffolded |
| Styling | **Tailwind CSS v4** — NO `tailwind.config.ts`. All tokens live in `globals.css` via `@theme {}`. Do not use `theme.extend`. |
| Fonts | `next/font/google` — declarations in `app/fonts.ts`, applied as CSS variables in `layout.tsx` |
| **Backend / CMS** | **WordPress + WooCommerce at `duroo.in`** — already live. No Sanity/Contentful/Payload. |
| **Data fetching** | All product/category/order data comes from `lib/woocommerce.ts` via the WC REST API. Never fetch WooCommerce directly from components — always go through the lib functions. |
| **Images** | `next/image` with `duroo.in` whitelisted in `next.config.ts` remotePatterns. Product images come from WooCommerce (`product.images[0].src`). |
| State | Zustand with `persist` middleware — already implemented in `store/cart.ts` |
| Animations | Framer Motion — installed, use `whileInView` for section reveals |
| Carousels | Embla Carousel — installed, use for product rails |
| Hosting | **Vercel** — already decided |
| Linting | Match existing repo config |

---

## Design Tokens

These are the canonical values. **Do NOT add to `tailwind.config.ts`** — this project uses Tailwind v4, which has no config file. Add all tokens to `globals.css` inside an `@theme {}` block, plus the `:root` CSS variables below.

### Colors

```ts
// tailwind.config.ts → theme.extend.colors
{
  duroo: {
    yellow: '#EFE94A',  // primary accent, used on CTAs and brand chips
    paper:  '#FAFAF7',  // off-white surface (cards, light theme bg)
    ink:    '#0C0C0C',  // primary text on light
    canvas: '#ECE9E1',  // warm grey body bg
    cream:  '#F5F2EC',  // section bg variant (Press strip, fabric cards)
    night:  '#0A0A0A',  // deep black for hero/footer/dark theme
    bone:   '#F5F4F0',  // text on dark
    stone:  '#7C7973',  // muted product-card color swatch
    sand:   '#E6E2D7',  // light product-card color swatch
    moss:   '#3A4E3B',  // dark product-card color swatch
    cognac: '#9C7A50',  // tan product-card color swatch
  }
}
```

CSS-variable runtime palette (drop into `globals.css`):

```css
:root {
  --duroo-yellow: #EFE94A;
  --duroo-paper:  #FAFAF7;
  --duroo-ink:    #0C0C0C;
  --duroo-canvas: #ECE9E1;
}
[data-theme="dark"] {
  --duroo-paper:  #0A0A0A;
  --duroo-ink:    #F5F4F0;
  --duroo-canvas: #181715;
}
```

### Typography

Four primary families + two used only inside the hero/editorial moments. Load with `next/font/google`:

```ts
// app/fonts.ts
import { Instrument_Sans, Instrument_Serif, Geist, Geist_Mono,
         Afacad_Flux, JetBrains_Mono } from 'next/font/google';

export const instrumentSans  = Instrument_Sans({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-head' });
export const instrumentSerif = Instrument_Serif({ subsets: ['latin'], style: ['normal','italic'], weight: '400', variable: '--font-serif' });
export const afacad          = Afacad_Flux({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-body' });
export const jetbrains       = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' });
export const geist           = Geist({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-geist' });
export const geistMono       = Geist_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-geist-mono' });
```

### Type System (canonical — apply across all future pages)

| Role | Family | Weight | Size (D / M) | Tracking |
|---|---|---|---|---|
| Body | Afacad Flux | 400 | 14.5px / 14.5px | 0 |
| **All section headers (h2)** | **Instrument Sans** | **500** | **40px / 26px** | **-0.025em** |
| Sub-headers (h3 card titles) | Instrument Sans | 500 | 22px / 18px | -0.025em |
| Hero h1 ("The Crossover Collection.") | Geist + Instrument Serif italic inline | 400 | 124px / 56px | -0.035em |
| Editorial chip ("Wrinkle FREE.") | Instrument Sans | 500 | 132px / 64px | -0.035em |
| Mission statement | Instrument Sans (with one word in Instrument Serif italic) | 500 | 44px / 32px | -0.025em |
| Overlay headlines (DualShop, Footer signup) | Instrument Serif italic | 400 | 64px / 44px | -0.02em |
| Eyebrows / utility / mono pill buttons | JetBrains Mono UPPERCASE | 400 | 10px | 0.22em |
| Hero CTA (and other "warm" CTAs) | Afacad Flux mixed-case | 500 | 15px | -0.01em |
| Press strip pull-quote | Instrument Serif italic | 400 | 30px / 22px | -0.015em |

Reviewer-signed-off rules (do not regress):

1. **All section headings must be consistent.** Every section h2 uses Instrument Sans 500 / -0.025em / 40px desktop / 26px mobile. Editorial-moment headlines (Hero h1, Wrinkle FREE., DualShop, Mission) can break this for emphasis; structural section headers cannot.
2. **Hero CTA must be Afacad mixed-case, tight.** Not the default mono uppercase pill. Carry this CTA style anywhere a CTA sits on photography or wants to feel less "utility."

### Spacing

Tailwind defaults are fine. Section vertical padding:

- Desktop: `py-[88px]` for rails/categories, `py-[120px]` for the mission moment, `py-[80px]` for footer
- Mobile: `py-[56px]` for rails, `py-[64px]` for mission, `py-[48px]` for footer
- Horizontal: `px-[48px]` desktop, `px-[22px]` mobile — used consistently across all sections

Card gaps: 12–18px desktop, 8–12px mobile. UGC grid: 6px gap, 4px on mobile.

### Border Radius

- 0 (square) on most surfaces — image tiles, hero, fabric moment, dual shop, UGC
- 999px (pill) for buttons, tags, color swatches, eyebrow chips
- 4px micro chips (UGC corner overlay)

### Shadows

None used. Hierarchy comes from typography and gradient overlays.

### Gradient overlays (for legibility on photography)

```css
/* Top + bottom hero gradient */
linear-gradient(180deg, rgba(10,10,10,.45) 0%, rgba(10,10,10,0) 28%, rgba(10,10,10,0) 60%, rgba(10,10,10,.55) 100%)
/* Category / DualShop tile foot */
linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)
```

---

## Home Page — Section Breakdown

**File:** `design-files/variation-04.jsx` (~900 lines, self-contained). Reference it line-by-line as you rebuild.

**Tone:** cinematic, photography-led, restrained. Built for someone moving through their day — long flight, run before work, dinner that runs late.

### Section Order (top → bottom)

| # | Component | Purpose | Notes |
|---|---|---|---|
| 1 | `V4Announce` | Top marquee ticker | Black bar, JetBrains Mono 10px, 0.22em tracking, infinite scroll left. Three shipping/return/season messages separated by `◆`. |
| 2 | `V4Nav` | Top navigation | Solid paper bg on light / `#0A0A0A` on dark. 3-col grid: links left, centered wordmark, account/search/bag right. Mobile collapses to hamburger + wordmark + bag count. |
| 3 | `V4Hero` | Cinematic full-bleed | 800px tall desktop / 640px mobile. Full-bleed image slot. Centered: mono eyebrow → H1 ("The Crossover **Collection.**" — "Collection." in Instrument Serif italic) → body → CTA + "Watch the film" underlink. Bottom-right slide dots (4 dots, first = 22×6 pill). Vertical FIG.01 caption left. Prev/next arrow buttons on desktop. |
| 4 | `V4ProductRail` (New Releases) | Horizontal product carousel | Eyebrow "Just landed" → H2 "Shop New Releases" → Men/Women segmented tabs → horizontal scroll of 6 product cards → "Shop all mens →" mono pill button. Desktop shows prev/next arrows in header. |
| 5 | `V4Categories` | 4-up category tiles | Tile per category (Knitwear, Shirting, Trousers, Outerwear). Image + bottom-left black pill name + bottom-right mono piece count. Desktop: 4 cols, 440px tall. Mobile: 2 cols, 240px. |
| 6 | `V4ProductRail` (Best Sellers) | Same component, different data | Eyebrow "Most-worn this season", title "Shop Best Sellers". |
| 7 | `V4Trending` | 3-up collection cards | Image (440px) → H3 title → 13.5px body description (max 380px wide) → black mono pill button "Shop now →". Three collections: Riviera Knit, Sail-In, Crossover. |
| 8 | `V4Press` | Press strip | Cream bg (`#F5F2EC`). Center Instrument Serif italic pull-quote → row of press logos at varied fonts/weights (MONOCLE, WALLPAPER*, WSJ., GQ, Forbes). |
| 9 | `V4FabricMoment` | Full-bleed editorial | 620px tall image with overlay. Centered: mono eyebrow → giant H2 "Wrinkle **FREE.**" (FREE in yellow chip, weight 700) → body → CTA. The yellow chip is `var(--duroo-yellow)` with `padding: 0 14px 4px` inline. |
| 10 | `V4Mission` | Brand statement | Centered, 880px max-width. Mono eyebrow "About Duroo" → Instrument Sans 44px statement (with "intent" in Instrument Serif italic) → "Read more about us →" underlink. |
| 11 | `V4DualShop` | Two big tiles | 620px tall. Left: "Shop Mens" with New Releases + Best Sellers buttons. Right: "Shop Womens" same. Instrument Serif italic 64px overlay headline, bottom gradient. |
| 12 | `V4UGC` | #wornduroo grid | Centered eyebrow + H2 → 6-col grid of 12 user photos (4-col / 8 photos on mobile). Each tile has a 4px-radius black `↗` chip top-right. |
| 13 | `V4Footer` | Split footer | Left: signup pitch ("Letters, twice a month.") Instrument Serif italic 38px → email row with hairline underline + Subscribe CTA → social mono links. Right: 4 columns (Shop / House / Support / Contact). Bottom row: large Duroo wordmark + © line + Privacy/Terms/Accessibility. |

### Interactions

- **Marquee:** Infinite CSS `@keyframes duroo-marquee` translating -50%. Repeat children 4× to mask the seam. 60s linear duration.
- **Product rail:** `overflow-x: auto`, hide scrollbar. Cards `flex: 0 0 286px` desktop / `220px` mobile. Heart-icon button top-right of each card. Color dots with outline ring on the active swatch. Hover: lift the heart button bg to full white.
- **Men/Women toggle:** Segmented pill — active is black with bone text; inactive is transparent with 0.18 border. Both rails (New Releases + Best Sellers) carry the toggle.
- **Section reveal:** `IntersectionObserver` adds `.is-in` class to `.duroo-reveal` elements; CSS transitions opacity 0→1 + `translateY(14px)→0` over 900ms. Use Framer Motion's `whileInView` in Next.
- **Slide dots:** Static in mock — wire to Embla in Next, with active dot = 22px wide / 6px tall pill.
- **Theme toggle:** Honored via `data-theme="dark"` on the artboard root. Light = paper/ink; dark = night/bone. Implement as a top-level Next.js cookie + `<html data-theme>` so SSR is correct.

### Copy (lift verbatim)

Hero: _"The Crossover **Collection.** / Breathable performance fabrics, drawn in the language of restraint. Move-everywhere essentials for daily wear."_

Press pull-quote: _"Built for the boardroom, the boat, and the long flight in between — and looks better the more you wear it."_

Fabric moment: _"A four-way stretch poplin developed with our mill in Biella. Packs flat, breathes, never asks for an iron."_

Mission: _"Duroo is built for those moving through their days with **intent** — the long flight, the run before work, the dinner that runs late. We make clothes that move with all of it."_

Footer signup: _"New pieces, atelier notes, occasional thoughts. No promotions."_

Trending collections: see `V4Trending` `items` array in the JSX.

---

## Data Model — WooCommerce REST API

**The data comes from WooCommerce at `duroo.in`, not a custom CMS.** Use these TypeScript types, which map directly to the WC REST API response shape.

```ts
// lib/types.ts — WooCommerce API response types

type WCProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;           // string, e.g. "999"
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  status: 'publish' | 'draft';
  type: 'simple' | 'variable';
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: {
    name: string;           // e.g. "Color", "Size"
    options: string[];      // e.g. ["White", "Black", "Navy Blue"]
  }[];
  variations: number[];     // IDs of variants (if type === 'variable')
};

type WCCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: { src: string; alt: string } | null;
};
```

### Data Fetching — use lib/woocommerce.ts

```ts
// These functions already exist — import and use them directly:
import { getProducts, getProductBySlug, getCategories } from '@/lib/woocommerce'

// In a Server Component (preferred — no useEffect needed):
const products = await getProducts()
const categories = await getCategories()

// In a Client Component (fallback):
useEffect(() => { getProducts().then(setProducts) }, [])
```

**Mapping WC data to the design's data model:**

| Design mock field | WooCommerce field |
|---|---|
| `product.name` | `product.name` |
| `product.price` | `product.price` (string — parse with `parseFloat`) |
| `product.was` (sale) | `product.regular_price` when `product.on_sale === true` |
| `product.tag` ('New'/'Sale') | `product.on_sale ? 'Sale' : ''` — or derive 'New' from date |
| `product.images[0]` | `product.images[0].src` |
| `product.colors` | `product.attributes.find(a => a.name === 'Color')?.options` |
| `product.href` | `/products/${product.slug}` |
| Category name | `product.categories[0].name` |

### Live Products on duroo.in

| Name | Price | Type | Colors / Sizes |
|---|---|---|---|
| Divine Fleece Hoodie | Variable | variable | Has size/color variants |
| Unisex Terry Oversized Tee | ₹999 | simple | White, Black, Navy Blue, Maroon, Lavender / XS–XXL |
| Platinum Unisex - Black | ₹899 | variable | Has size/color variants |

### Category Tiles — sourced from WC categories

Replace the mock's static `['Knitwear', 'Shirting', 'Trousers', 'Outerwear']` with live data:

```ts
const categories = await getCategories()
// Use category.image?.src for tile background
// Use category.name for the pill label
// Use category.count for the piece count
// Link to /products?cat={category.slug}
```
  n: string;           // display number, e.g. '01'
  name: string;        // e.g. 'Knitwear'
  sub: string;         // '14 pieces' — derive from WCCategory.count
  sea: string;         // 'Autumn / Winter 26' — hardcode per season
  href: string;        // /products?cat=[slug]
};
```

> **Do not use `DUROO_PRODUCTS` or `DUROO_COLLECTIONS` from `design-files/shared.jsx` as real data.** Those are mock fixtures. All real data comes from WooCommerce via `lib/woocommerce.ts`.

---

## Image Handling — WooCommerce + next/image

Product images are served directly from `duroo.in`. The domain is already whitelisted in `next.config.ts`.

```ts
// next.config.ts — already configured, do not change
remotePatterns: [{ protocol: 'https', hostname: 'duroo.in' }]
```

Replace every `<Slot id="..." h={...} />` in the mock with:

```tsx
<Image
  src={product.images[0]?.src ?? '/placeholder.jpg'}
  alt={product.images[0]?.alt ?? product.name}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

Always wrap in a parent with `position: relative` and explicit height matching the `h={}` prop in the mock (800 hero / 440 category / 380 trending / 286 product card / 220 UGC).

For sections without product data (Hero bg, DualShop tiles, FabricMoment), use a real photo from the WooCommerce product gallery or a high-quality placeholder until photography is ready. The `placeholder` text in the mock describes the editorial brief for the photographer.

---

## File → Component Mapping (suggested Next.js structure)

```
app/
  layout.tsx              ← <html data-theme>, font variables, providers
  page.tsx                ← home page; imports sections below
  fonts.ts                ← next/font declarations
  globals.css             ← CSS variables, reveal keyframes, marquee keyframes

components/duroo/
  Wordmark.tsx            ← from shared.jsx
  Mono.tsx                ← caption / eyebrow primitive
  Tag.tsx
  CTA.tsx                 ← yellow pill button (size: sm/md/lg)
  UnderLink.tsx
  Rule.tsx
  Marquee.tsx             ← CSS @keyframes scrolling
  Reveal.tsx              ← IntersectionObserver wrapper (or Framer Motion)

components/home/
  Announce.tsx            ← V4Announce
  Nav.tsx                 ← V4Nav (desktop + mobile)
  Hero.tsx                ← V4Hero with Embla
  ProductRail.tsx         ← V4ProductRail + V4Card
  Categories.tsx          ← V4Categories
  Trending.tsx            ← V4Trending
  Press.tsx               ← V4Press
  FabricMoment.tsx        ← V4FabricMoment
  Mission.tsx             ← V4Mission
  DualShop.tsx            ← V4DualShop
  UGC.tsx                 ← V4UGC
  Footer.tsx              ← V4Footer (split signup + columns)

lib/
  woocommerce.ts          ← ALL data fetching — getProducts, getProductBySlug, getCategories, getOrders
  types.ts                ← WCProduct, WCCategory TypeScript types
```

The `Nav`, `Footer`, `Announce`, and all `components/duroo/*` primitives are **site-wide** — they should serve PDP, PLP, Cart, About, Journal, etc. without modification.

---

## State Management

Minimal client state. Almost everything is a Server Component.

| State | Where | Persistence |
|---|---|---|
| Active Men/Women tab on product rails | Client component, URL search param (`?aud=men`) | URL + cookie |
| Bag count | Global, Zustand / cookie | Persists |
| Theme (light/dark) | `<html data-theme>` via cookie | Persists |
| Hero carousel index | Client component, internal state | Ephemeral |
| Newsletter form | Server action | Validated, sends to ESP |

---

## Responsive Behavior

Two reference breakpoints in the mock: **390px (mobile)** and **1440px (desktop)**. The mock toggles whole layouts via `device === 'mobile'`. In Next.js:

- Use Tailwind responsive prefixes (`md:`, `lg:`) — break at **768px** for the desktop layout.
- Section padding scales linearly between the two; use `clamp()` for hero font sizes (`clamp(56px, 9vw, 124px)` for the hero h1).
- Product rail card width: `clamp(220px, 22vw, 286px)`.
- Above 1440px: cap content at 1440px max-width and center, OR let it grow up to 1600px with proportionally bigger type. Confirm with the user.

---

## Accessibility

- All buttons have `aria-label` if icon-only (prev/next arrows, heart, hamburger).
- Color contrast: text on yellow chip is `#0C0C0C` (passes AAA). Text on photography uses gradient overlay + 0.88 opacity bone — keep that overlay or it can fail AA on bright frames.
- Image alt text: required for all `next/image`. Pull from CMS.
- `prefers-reduced-motion`: gate the marquee and reveal animations.
- Heading order: H1 in hero, H2 per section, H3 for card titles. No skipped levels.

---

## SEO

- `app/page.tsx` exports a `metadata` block with title `Duroo · Performance Lifestyle`, description from the Mission section.
- Each product/collection card links to its own route — implement `/products/[slug]` and `/collections/[slug]` as next steps (out of scope for this handoff).
- Open Graph image: a hero crop.

---

## Future Pages (Same System)

These pages aren't designed yet — they're listed so you can scaffold routes and reuse the primitives. Each will get its own handoff but should consume `components/duroo/*` unchanged:

- `/products/[slug]` — PDP
- `/men` / `/women` / `/collections/[slug]` — PLP
- `/cart` — Cart drawer + page
- `/journal` + `/journal/[slug]` — Editorial articles
- `/about` — Brand story
- `/account/*` — Auth, orders, addresses

---

## Files in This Handoff

```
design-files/
  Duroo Home.html          ← Entry point, mounts React via Babel-in-browser
  shared.jsx               ← Wordmark, Mono, Tag, CTA, UnderLink, Rule, Marquee,
                             NavBar, Newsletter, Footer, Slot, product data
  variation-04.jsx         ← The home page — single direction
  app.jsx                  ← Mounts the home page in a DesignCanvas
  design-canvas.jsx        ← Pan/zoom canvas (handoff context only — don't port)
  tweaks-panel.jsx         ← Design-time controls (don't port)
  image-slot.js            ← Drag-drop image placeholder (don't port — use next/image)
```

To preview the mock locally:

```
cd design-files
python3 -m http.server 8000
# open http://localhost:8000/Duroo%20Home.html
```

You'll see desktop + mobile artboards side-by-side. Use mouse wheel + drag to navigate. Click any artboard label to open it fullscreen.

> Note: the file is named `variation-04.jsx` for historical reasons — it's now the only direction. Feel free to rename to `home.jsx` once you're in your Next.js codebase.

---

## Confirmed Answers — No Need to Ask

These were listed as open questions in the original handoff. All are decided:

| Question | Answer |
|---|---|
| CMS choice? | **WooCommerce** — already live at duroo.in. No other CMS. |
| E-commerce backend? | **WooCommerce** via REST API. Orders via `app/api/create-order/route.ts`. |
| Hosting? | **Vercel** |
| Real product photography ready? | Not yet — use product images from WooCommerce API for now. |
| Above 1440px behavior? | Cap at 1440px max-width, center. |
| Internationalization? | Single locale — India (₹ INR). Ignore EUR references in the mock. |
| Light/dark theme? | Light only for now. Dark mode infrastructure can be added later. |

## Critical Technical Notes

- **Tailwind v4** — no `tailwind.config.ts`. All config in `globals.css` via `@theme {}`
- **Next.js 15+** — `params` is a Promise. Always `const { slug } = await params`
- **Zustand hydration** — always guard cart count/items with a `mounted` state before rendering to avoid SSR mismatch
- **CORS** — Claude Code's environment cannot reach `duroo.in` directly. Do not test API calls from the terminal. All WC calls must run in the browser or through `/api/` routes
- **Currency** — all prices are ₹ INR. The mock shows EUR — ignore it. Format as `₹${product.price}`
- **`params` await pattern:**
  ```ts
  // app/products/[slug]/page.tsx
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProductBySlug(slug)
  }
  ```

---

*Generated from `Duroo Home.html` design prototype. Signed off through inline review by Saud (headings consistency + hero CTA font family).*