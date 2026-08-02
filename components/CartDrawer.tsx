'use client'

import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer({ onClose }: { onClose: () => void }) {
    const { items, removeItem, updateQuantity, total, count } = useCartStore()

    return (
        <>
            <div className="cart-backdrop" onClick={onClose} />
            <div className="cart-drawer">

                {/* Header */}
                <div className="cart-drawer-header">
                    <span className="cart-drawer-title">Your Cart ({count()})</span>
                    <button className="drawer-close-btn" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="cart-drawer-body">
                    {items.length === 0 ? (
                        <div className="drawer-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <p>Your cart is empty</p>
                            <button className="btn btn-black btn-pill btn-sm" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="drawer-item">
                                {item.image && (
                                    <div className="drawer-item-img">
                                        <Image src={item.image} alt={item.name} width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div className="drawer-item-info">
                                    <p className="drawer-item-name">{item.name}</p>
                                    <p className="drawer-item-meta">
                                        {item.color && item.color}{item.color && item.size && ' · '}{item.size && item.size}
                                    </p>
                                    <p className="drawer-item-price">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                    <div className="drawer-qty">
                                        <button className="drawer-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                        <span className="drawer-qty-num">{item.quantity}</span>
                                        <button className="drawer-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        <button className="drawer-remove" onClick={() => removeItem(item.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="drawer-subtotal">
                            <span className="drawer-subtotal-label">Subtotal</span>
                            <span className="drawer-subtotal-amount">₹{total().toLocaleString()}</span>
                        </div>
                        <p className="drawer-shipping-note">Shipping calculated at checkout</p>
                        <Link href="/checkout" className="btn btn-black btn-full btn-lg" onClick={onClose}>
                            Checkout
                        </Link>
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button className="link-subtle" onClick={onClose}>Continue Shopping</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}