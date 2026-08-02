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
