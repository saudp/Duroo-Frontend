'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'
import CartDrawer from './CartDrawer'

export default function Navbar() {
    const count = useCartStore(s => s.count())
    const [mounted, setMounted] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    return (
        <>
            {/* Announcement Bar */}
            <div className="announce-bar">
                <div className="announce-inner">
                    {Array(10).fill(null).map((_, i) => (
                        <span key={i}>
                            FREE SHIPPING OVER ₹999 · &nbsp;
                            <strong>NEW DROP — SEASON 01</strong>
                            &nbsp; · MADE IN INDIA · &nbsp;
                            <strong>USE CODE DUROO10 FOR 10% OFF</strong>
                            &nbsp; · FREE RETURNS · &nbsp;
                        </span>
                    ))}
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Left */}
                    <div className="navbar-left">
                        <Link href="/products" className="navbar-tab">Men</Link>
                        <Link href="/products" className="navbar-tab">Women</Link>
                    </div>

                    {/* Center Logo */}
                    <Link href="/" className="navbar-logo">
                        <Image
                            src="/duroo_logo_black.svg"
                            alt="Duroo"
                            width={120}
                            height={32}
                            priority
                        />
                    </Link>

                    {/* Right */}
                    <div className="navbar-right">
                        <button className="navbar-icon-btn" aria-label="Search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                        </button>
                        <button className="navbar-icon-btn" aria-label="Account">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                        <button className="cart-nav-btn" onClick={() => setCartOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Cart
                            {mounted && count > 0 && (
                                <span className="cart-count">{count}</span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Cart Drawer */}
            {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
        </>
    )
}