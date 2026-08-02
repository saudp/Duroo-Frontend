'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'

interface Props {
    product: any
    onCartOpen?: () => void
}

export default function AddToCart({ product, onCartOpen }: Props) {
    const addItem = useCartStore(s => s.addItem)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [added, setAdded] = useState(false)

    const sizes = product.attributes?.find((a: any) => a.name === 'Size')?.options || []
    const colors = product.attributes?.find((a: any) => a.name === 'Color')?.options || []

    const handleAdd = () => {
        if (sizes.length > 0 && !selectedSize) { alert('Please select a size'); return }
        if (colors.length > 0 && !selectedColor) { alert('Please select a color'); return }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price || '0',
            image: product.images?.[0]?.src || '',
            slug: product.slug,
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
        })

        setAdded(true)
        onCartOpen?.()
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div>
            {colors.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <p className="pdp-attr-label">Color</p>
                    <div className="pdp-options">
                        {colors.map((opt: string) => (
                            <button key={opt} className={`pdp-option ${selectedColor === opt ? 'selected' : ''}`} onClick={() => setSelectedColor(opt)}>{opt}</button>
                        ))}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <p className="pdp-attr-label">Size</p>
                    <div className="pdp-options">
                        {sizes.map((opt: string) => (
                            <button key={opt} className={`pdp-option ${selectedSize === opt ? 'selected' : ''}`} onClick={() => setSelectedSize(opt)}>{opt}</button>
                        ))}
                    </div>
                </div>
            )}

            <button
                className={`pdp-add-btn ${added ? 'success' : ''}`}
                onClick={handleAdd}
            >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
        </div>
    )
}