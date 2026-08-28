// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import Mono from '@/components/duroo/Mono'

const HF = 'var(--ff-head)'
const BF = 'var(--ff-body)'
const MF = 'var(--ff-mono)'
const SF = 'var(--ff-serif)'

export default function CartPage() {
    const [mounted, setMounted] = useState(false)
    const { items, removeItem, updateQuantity, total, count } = useCartStore()

    useEffect(() => { setMounted(true) }, [])

    // Show a neutral loading state until client has mounted + rehydrated from localStorage
    if (!mounted) {
        return (
            <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
                <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(48px,6vw,88px) clamp(22px,3vw,48px)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 0.7, 0.85].map((w, i) => (
                            <div key={i} className="animate-pulse" style={{ height: 48, width: `${w * 100}%`, background: 'rgba(12,12,12,0.06)' }} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div
                style={{
                    background: 'var(--c-paper)',
                    color: 'var(--c-ink)',
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    padding: '80px 22px',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 'clamp(28px,3vw,36px)', letterSpacing: '-0.025em', margin: 0 }}>
                    Your cart is <span style={{ fontFamily: SF, fontStyle: 'italic', fontWeight: 400 }}>empty.</span>
                </h1>
                <p style={{ fontFamily: BF, fontSize: 14, opacity: 0.65, margin: 0, maxWidth: 340 }}>
                    Looks like you haven&apos;t added anything yet.
                </p>
                <Link
                    href="/products"
                    style={{
                        marginTop: 8,
                        fontFamily: BF,
                        fontSize: 15,
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                        background: 'var(--c-yellow)',
                        color: 'var(--c-ink)',
                        padding: '16px 32px',
                        borderRadius: 999,
                        textDecoration: 'none',
                    }}
                >
                    Shop now
                </Link>
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(28px,3.5vw,52px) clamp(22px,3vw,48px) clamp(56px,6vw,88px)' }}>

                <h1 style={{ fontFamily: HF, fontWeight: 500, fontSize: 'clamp(26px,3vw,36px)', letterSpacing: '-0.025em', margin: '0 0 32px' }}>
                    Your cart <span style={{ opacity: 0.5, fontWeight: 400 }}>({count()})</span>
                </h1>

                <div className="md:grid" style={{ gridTemplateColumns: '1fr 380px', gap: 56, alignItems: 'flex-start' }}>

                    {/* Cart items */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {items.map((item) => (
                            <div
                                key={`${item.id}-${item.size}-${item.color}`}
                                style={{
                                    display: 'flex',
                                    gap: 18,
                                    padding: '24px 0',
                                    borderBottom: '1px solid rgba(12,12,12,0.10)',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Image */}
                                {item.image && (
                                    <div style={{ position: 'relative', width: 96, height: 120, flexShrink: 0, background: 'var(--c-cream)' }}>
                                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                                    </div>
                                )}

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                        <span style={{ fontFamily: BF, fontSize: 15, fontWeight: 500 }}>{item.name}</span>
                                        <span style={{ fontFamily: HF, fontWeight: 500, fontSize: 15, letterSpacing: '-0.02em', flexShrink: 0 }}>
                                            ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                    {(item.color || item.size) && (
                                        <Mono size={10} op={0.55}>
                                            {[item.color, item.size].filter(Boolean).join(' · ')}
                                        </Mono>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(12,12,12,0.18)' }}>
                                            <button
                                                aria-label="Decrease quantity"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                                style={{
                                                    all: 'unset', cursor: 'pointer', width: 32, height: 32,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontFamily: MF, fontSize: 14,
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{ fontFamily: MF, fontSize: 12, width: 24, textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                aria-label="Increase quantity"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                                style={{
                                                    all: 'unset', cursor: 'pointer', width: 32, height: 32,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontFamily: MF, fontSize: 14,
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id, item.size, item.color)}
                                            style={{
                                                all: 'unset',
                                                cursor: 'pointer',
                                                fontFamily: MF,
                                                fontSize: 10,
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                opacity: 0.5,
                                                borderBottom: '1px solid currentColor',
                                                paddingBottom: 1,
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: 20 }}>
                            <Link
                                href="/products"
                                style={{
                                    fontFamily: MF,
                                    fontSize: 10,
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    borderBottom: '1px solid currentColor',
                                    paddingBottom: 2,
                                }}
                            >
                                ← Continue shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="mt-6 md:mt-0" style={{ background: 'var(--c-cream)', padding: 'clamp(24px,3vw,32px)' }}>
                        <h2 style={{ fontFamily: HF, fontWeight: 500, fontSize: 20, letterSpacing: '-0.025em', margin: '0 0 20px' }}>
                            Order summary
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: BF, fontSize: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.65 }}>Subtotal</span>
                                <span style={{ fontFamily: HF, fontWeight: 500, fontSize: 13, letterSpacing: '-0.02em' }}>
                                    ₹{total().toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.65 }}>Shipping</span>
                                <Mono size={10} op={0.65}>Calculated at checkout</Mono>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid rgba(12,12,12,0.14)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                            }}
                        >
                            <h4 style={{ fontFamily: HF, fontWeight: 500, fontSize: 18, letterSpacing: '-0.025em', margin: 0 }}>Total</h4>
                            <div style={{ fontFamily: HF, fontWeight: 500, fontSize: 24, letterSpacing: '-0.03em' }}>
                                ₹{total().toLocaleString()}
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                marginTop: 20,
                                fontFamily: BF,
                                fontSize: 15,
                                fontWeight: 500,
                                letterSpacing: '-0.01em',
                                background: 'var(--c-yellow)',
                                color: 'var(--c-ink)',
                                padding: '16px 0',
                                borderRadius: 999,
                                textDecoration: 'none',
                            }}
                        >
                            Proceed to checkout
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
