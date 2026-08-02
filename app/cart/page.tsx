// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const [mounted, setMounted] = useState(false)
    const { items, removeItem, updateQuantity, total, count } = useCartStore()

    useEffect(() => { setMounted(true) }, [])

    // Show a neutral loading state until client has mounted + rehydrated from localStorage
    if (!mounted) {
        return (
            <main className="max-w-2xl mx-auto px-4 py-24 text-center">
                <div className="h-8 w-48 mx-auto bg-gray-800 rounded animate-pulse" />
            </main>
        )
    }

    if (items.length === 0) {
        return (
            <main className="max-w-2xl mx-auto px-4 py-24 text-center">
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    href="/products"
                    className="inline-block bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                    Shop Now
                </Link>
            </main>
        )
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Cart ({count()})</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border border-gray-800 rounded-xl p-4">

                            {/* Image */}
                            {item.image && (
                                <div className="w-24 h-24 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {item.color && <span>Color: {item.color} · </span>}
                                    {item.size && <span>Size: {item.size}</span>}
                                </p>
                                <p className="text-sm font-medium mt-1">₹{item.price}</p>

                                {/* Quantity */}
                                <div className="flex items-center gap-3 mt-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 border border-gray-600 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 border border-gray-600 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right flex-shrink-0">
                                <p className="font-semibold">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="border border-gray-800 rounded-xl p-6 sticky top-24 space-y-4">
                        <h2 className="font-semibold text-lg">Order Summary</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Subtotal</span>
                                <span>₹{total().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Shipping</span>
                                <span className="text-green-400">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-4 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{total().toLocaleString()}</span>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full py-4 bg-white text-black font-semibold rounded-xl text-center hover:bg-gray-100 transition-colors"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            href="/products"
                            className="block w-full py-3 border border-gray-700 rounded-xl text-center text-sm text-gray-400 hover:border-gray-500 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    )
}