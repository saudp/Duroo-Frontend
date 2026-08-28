import Link from 'next/link'
import Wordmark from './Wordmark'
import Mono from './Mono'

export default function InfoPage({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--c-paper)', color: 'var(--c-ink)', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(18px,1.8vw,24px) clamp(22px,3vw,48px)',
          borderBottom: '1px solid rgba(12,12,12,0.08)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Wordmark size={20} />
        </Link>
        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Mono size={9} op={0.55}>Continue shopping →</Mono>
        </Link>
      </div>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(48px,6vw,88px) clamp(22px,3vw,48px)' }}>
        <h1
          style={{
            fontFamily: 'var(--ff-head)',
            fontWeight: 500,
            fontSize: 'clamp(26px,3vw,40px)',
            letterSpacing: '-0.025em',
            margin: '0 0 24px',
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontFamily: 'var(--ff-body)',
            fontSize: 14.5,
            lineHeight: 1.7,
            opacity: 0.8,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
