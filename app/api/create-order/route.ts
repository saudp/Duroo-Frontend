// app/api/create-order/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { form, items } = await req.json()

    const auth = Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64')

    const lineItems = items.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
        // Add size + color as meta data
        meta_data: [
            ...(item.color ? [{ key: 'Color', value: item.color }] : []),
            ...(item.size ? [{ key: 'Size', value: item.size }] : []),
        ],
    }))

    const order = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: false,
        status: 'pending',
        billing: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address_1: form.address,
            city: form.city,
            state: form.state,
            postcode: form.pincode,
            country: 'IN',
        },
        shipping: {
            first_name: form.firstName,
            last_name: form.lastName,
            address_1: form.address,
            city: form.city,
            state: form.state,
            postcode: form.pincode,
            country: 'IN',
        },
        line_items: lineItems,
        // Customer note
        customer_note: `Order placed via Duroo headless store. Items: ${items.map((i: any) => `${i.name} (${i.color || ''} ${i.size || ''} x${i.quantity})`).join(', ')}`,
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })

    const data = await res.json()
    return NextResponse.json(data)
}