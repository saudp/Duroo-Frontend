'use client'

import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import Mono from '@/components/duroo/Mono'
import CTA from '@/components/duroo/CTA'
import UnderLink from '@/components/duroo/UnderLink'

const DHEAD = 'var(--ff-head)' // Instrument Sans
const DBODY = 'var(--ff-body)' // Afacad Flux

export default function CartDrawer({ onClose }: { onClose: () => void }) {
    const { items, removeItem, updateQuantity, total, count } = useCartStore()

    return (
        <>
            <div
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(12,12,12,0.4)' }}
                className="cart-fade-in"
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 201,
                    background: 'var(--c-paper)',
                    color: 'var(--c-ink)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
                }}
                className="w-full md:w-[420px] cart-slide-in"
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '22px 24px',
                        borderBottom: '1px solid rgba(12,12,12,0.12)',
                    }}
                >
                    <span
                        style={{
                            fontFamily: DHEAD,
                            fontWeight: 500,
                            fontSize: 18,
                            letterSpacing: '-0.025em',
                        }}
                    >
                        Your Bag ({count()})
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        style={{
                            cursor: 'pointer',
                            fontSize: 22,
                            lineHeight: 1,
                            padding: 4,
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: items.length ? '8px 24px' : 0 }}>
                    {items.length === 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                padding: '48px 24px',
                                textAlign: 'center',
                                gap: 20,
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <p style={{ fontFamily: DBODY, fontSize: 14, opacity: 0.6, margin: 0 }}>Your cart is empty</p>
                            <CTA size="sm" onClick={onClose}>Continue Shopping</CTA>
                        </div>
                    ) : (
                        items.map(item => (
                            <div
                                key={`${item.id}-${item.size}-${item.color}`}
                                style={{
                                    display: 'flex',
                                    gap: 16,
                                    padding: '20px 0',
                                    borderBottom: '1px solid rgba(12,12,12,0.08)',
                                }}
                            >
                                <div style={{ width: 84, height: 104, flexShrink: 0, position: 'relative', background: 'var(--c-cream)' }}>
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="cover-image"
                                            sizes="84px"
                                        />
                                    )}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                        <span style={{ fontFamily: DBODY, fontSize: 15, fontWeight: 500 }}>{item.name}</span>
                                        <span style={{ fontFamily: DBODY, fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap' }}>
                                            ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                    {(item.color || item.size) && (
                                        <Mono size={10} op={0.55}>
                                            {item.color}{item.color && item.size && ' · '}{item.size}
                                        </Mono>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(12,12,12,0.2)', borderRadius: 'var(--r-pill)' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                                style={{ cursor: 'pointer', width: 26, textAlign: 'center', fontSize: 14, background: 'none', border: 'none', color: 'inherit' }}
                                            >
                                                −
                                            </button>
                                            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, width: 20, textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                                style={{ cursor: 'pointer', width: 26, textAlign: 'center', fontSize: 14, background: 'none', border: 'none', color: 'inherit' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id, item.size, item.color)}
                                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}
                                        >
                                            <UnderLink size={9} style={{ opacity: 0.55 }}>Remove</UnderLink>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div
                        style={{
                            padding: '20px 24px 24px',
                            borderTop: '1px solid rgba(12,12,12,0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <Mono size={11} op={0.6}>Subtotal</Mono>
                            <span style={{ fontFamily: DHEAD, fontWeight: 500, fontSize: 20 }}>
                                ₹{total().toLocaleString()}
                            </span>
                        </div>
                        <Mono size={9} op={0.55} style={{ textAlign: 'center' }}>Shipping calculated at checkout</Mono>
                        <Link href="/checkout" onClick={onClose} style={{ textDecoration: 'none' }}>
                            <CTA size="lg" style={{ width: '100%' }}>Checkout →</CTA>
                        </Link>
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'center', color: 'inherit' }}
                        >
                            <UnderLink size={10} style={{ opacity: 0.6 }}>Continue shopping</UnderLink>
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
