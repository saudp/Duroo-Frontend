// store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: number
    // Present only for variable products — the specific color/size variant's
    // WooCommerce variation id. Needed so the server can price this line from
    // the variant's own price/stock, and so the WC order decrements the right
    // variant's inventory instead of the parent product's.
    variationId?: number
    name: string
    price: string
    image: string
    slug: string
    quantity: number
    size?: string
    color?: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: number, size?: string, color?: string) => void
    updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void
    clearCart: () => void
    total: () => number
    count: () => number
}

// A cart "line" is uniquely identified by id + size + color, not id alone —
// two variants of the same product (e.g. same hoodie in S and M) share an id.
const isSameLine = (i: CartItem, id: number, size?: string, color?: string) =>
    i.id === id && i.size === size && i.color === color

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => set((state) => {
                const existing = state.items.find(i => isSameLine(i, item.id, item.size, item.color))
                if (existing) {
                    return {
                        items: state.items.map(i =>
                            isSameLine(i, item.id, item.size, item.color)
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        )
                    }
                }
                return { items: [...state.items, { ...item, quantity: 1 }] }
            }),

            removeItem: (id, size, color) => set((state) => ({
                items: state.items.filter(i => !isSameLine(i, id, size, color))
            })),

            updateQuantity: (id, quantity, size, color) => set((state) => ({
                items: quantity < 1
                    ? state.items.filter(i => !isSameLine(i, id, size, color))
                    : state.items.map(i => isSameLine(i, id, size, color) ? { ...i, quantity } : i)
            })),

            clearCart: () => set({ items: [] }),

            total: () => get().items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0),

            count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: 'duroo-cart' } // persists to localStorage
    )
)