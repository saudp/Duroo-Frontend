import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/woocommerce'
import type { WCProduct, WCCategory } from '@/lib/types'
import Hero from '@/components/home/Hero'
import ProductRail from '@/components/home/ProductRail'
import Categories from '@/components/home/Categories'
import Trending from '@/components/home/Trending'
import Press from '@/components/home/Press'
import FabricMoment from '@/components/home/FabricMoment'
import Mission from '@/components/home/Mission'
import DualShop from '@/components/home/DualShop'
import UGC from '@/components/home/UGC'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Duroo · Performance Lifestyle',
  description:
    'Breathable performance fabrics, drawn in the language of restraint. Move-everywhere essentials for daily wear.',
}

export default async function HomePage() {
  let products: WCProduct[] = []
  let categories: WCCategory[] = []

  try {
    ;[products, categories] = await Promise.all([getProducts(), getCategories()])
  } catch {
    // WC unreachable in build/preview — render with empty arrays
  }

  const heroImages = products
    .filter((p) => p.images?.[0]?.src)
    .slice(0, 4)
    .map((p) => ({ src: p.images[0].src, alt: p.images[0].alt || p.name }))

  const newReleases = products.slice(0, 6)
  const bestSellers = [...products].reverse().slice(0, 6)

  return (
    <main>
      {/* 1. Hero */}
      <Hero images={heroImages} />

      {/* 2. New Releases rail */}
      <ProductRail
        eyebrow="Just landed"
        title="Shop New Releases"
        items={newReleases}
        shopAllHref="/products?filter=new"
      />

      {/* 3. Category tiles */}
      <Categories categories={categories} />

      {/* 4. Best Sellers rail */}
      <ProductRail
        eyebrow="Most-worn this season"
        title="Shop Best Sellers"
        items={bestSellers}
        shopAllHref="/products?filter=best"
      />

      {/* 5. Trending collections */}
      <Trending />

      {/* 6. Press strip */}
      <Press />

      {/* 7. Fabric moment */}
      <FabricMoment />

      {/* 8. Mission */}
      <Mission />

      {/* 9. Dual shop */}
      <DualShop />

      {/* 10. UGC grid */}
      <UGC />
    </main>
  )
}
