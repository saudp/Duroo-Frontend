import Link from 'next/link'
import InfoPage from '@/components/duroo/InfoPage'

export default function SignInPage() {
  return (
    <InfoPage title="Sign in">
      <p>Account sign-in isn&apos;t live yet — for now, you can check out as a guest and we&apos;ll email your order confirmation and tracking details.</p>
      <p>
        Looking for an order you already placed?{' '}
        <Link href="/account/orders" style={{ textDecoration: 'underline' }}>
          Find it here
        </Link>{' '}
        with your order number and email.
      </p>
      <p>Account creation, saved addresses, and full order history are coming soon.</p>
    </InfoPage>
  )
}
