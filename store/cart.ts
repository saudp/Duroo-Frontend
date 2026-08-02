// store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: number
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
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    total: () => number
    count: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => set((state) => {
                const existing = state.items.find(i => i.id === item.id && i.size === item.size && i.color === item.color)
                if (existing) {
                    return {
                        items: state.items.map(i =>
                            i.id === item.id && i.size === item.size && i.color === item.color
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        )
                    }
                }
                return { items: [...state.items, { ...item, quantity: 1 }] }
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => ({
                items: quantity < 1
                    ? state.items.filter(i => i.id !== id)
                    : state.items.map(i => i.id === id ? { ...i, quantity } : i)
            })),

            clearCart: () => set({ items: [] }),

            total: () => get().items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0),

            count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: 'duroo-cart' } // persists to localStorage
    )
)