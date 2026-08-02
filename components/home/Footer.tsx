import Link from 'next/link'
import Wordmark from '@/components/duroo/Wordmark'
import Mono from '@/components/duroo/Mono'
import CTA from '@/components/duroo/CTA'

const FSERIF = 'var(--ff-serif)'
const FMONO = 'var(--ff-mono)'
const FBODY = 'var(--ff-body)'

const COLUMNS = [
  {
    head: 'Shop',
    items: [
      { label: 'Mens', href: '/products?gender=mens' },
      { label: 'Womens', href: '/products?gender=womens' },
      { label: 'New Releases', href: '/products?filter=new' },
      { label: 'Best Sellers', href: '/products?filter=best' },
      { label: 'Collections', href: '/collections' },
      { label: 'Gift Card', href: '/gift-card' },
    ],
  },
  {
    head: 'House',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Stockists', href: '/stockists' },
      { label: 'Sustainability', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    head: 'Support',
    items: [
      { label: 'FAQ', href: '#' },
      { label: 'Order Tracking', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Care', href: '#' },
      { label: 'Size Guide', href: '#' },
    ],
  },
  {
    head: 'Contact',
    items: [
      { label: 'Customer Care', href: '#' },
      { label: 'Stores', href: '#' },
      { label: 'Wholesale', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Affiliates', href: '#' },
    ],
  },
] as const

const SOCIALS = ['Instagram', 'TikTok', 'Pinterest', 'YouTube'] as const

export default function Footer() {
  return (
    <footer style={{ background: 'var(--c-night)', color: 'var(--c-bone)' }}>
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 48px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
            gap: 48,
          }}
        >
          {/* Signup column */}
          <div>
            <Mono size={10} op={0.6} style={{ color: 'inherit' }}>
              Get on the list
            </Mono>
            <h3
              style={{
                fontFamily: FSERIF,
                fontStyle: 'italic',
                fontSize: 38,
                margin: '12px 0 22px',
                letterSpacing: '-0.015em',
                fontWeight: 400,
              }}
            >
              Letters, twice a month.
            </h3>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                opacity: 0.75,
                maxWidth: 320,
                marginBottom: 24,
                fontFamily: FBODY,
              }}
            >
              New pieces, atelier notes, occasional thoughts. No promotions.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid var(--c-bone)',
                paddingBottom: 12,
                maxWidth: 360,
              }}
            >
              <span
                style={{
                  flex: 1,
                  opacity: 0.5,
                  fontSize: 13,
                  fontFamily: FBODY,
                }}
              >
                Your email address
              </span>
              <CTA size="sm" style={{ background: 'transparent', color: '#F5F4F0', border: '1px solid rgba(245,244,240,0.3)' }}>
                Subscribe →
              </CTA>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 32,
                opacity: 0.85,
              }}
            >
              {SOCIALS.map((s) => (
                <Mono key={s} size={10} op={1} style={{ color: 'inherit', cursor: 'pointer' }}>
                  {s}
                </Mono>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div
              key={col.head}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <Mono
                size={10}
                op={0.5}
                style={{ color: 'inherit', marginBottom: 4 }}
              >
                {col.head}
              </Mono>
              {col.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    fontSize: 13,
                    opacity: 0.85,
                    fontFamily: FBODY,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: '1px solid rgba(245,244,240,0.18)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Wordmark size={20} letterSpacing="0.32em" />
          <Mono size={10} op={0.55} style={{ color: 'inherit' }}>
            © Duroo Studio · MMXXVI · Lisbon
          </Mono>
          <div style={{ display: 'flex', gap: 22 }}>
            {(['Privacy', 'Terms', 'Accessibility'] as const).map((l) => (
              <Mono key={l} size={10} op={0.55} style={{ color: 'inherit', cursor: 'pointer' }}>
                {l}
              </Mono>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="block md:hidden">
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '48px 22px 28px' }}>
        <Mono size={10} op={0.6} style={{ color: 'inherit' }}>
          Get on the list
        </Mono>
        <h3
          style={{
            fontFamily: FSERIF,
            fontStyle: 'italic',
            fontSize: 40,
            margin: '12px 0 16px',
            letterSpacing: '-0.02em',
            fontWeight: 400,
          }}
        >
          Letters, twice a month.
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid var(--c-bone)',
            paddingBottom: 10,
            opacity: 0.85,
          }}
        >
          <span style={{ flex: 1, opacity: 0.5, fontSize: 13, fontFamily: FBODY }}>
            Your email address
          </span>
          <span
            style={{
              fontFamily: FMONO,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Subscribe →
          </span>
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: 24,
            columnGap: 16,
          }}
        >
          {COLUMNS.map((col) => (
            <div
              key={col.head}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <Mono size={10} op={0.5} style={{ color: 'inherit', marginBottom: 4 }}>
                {col.head}
              </Mono>
              {col.items.slice(0, 3).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    fontSize: 13,
                    opacity: 0.85,
                    fontFamily: FBODY,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            justifyContent: 'space-between',
            opacity: 0.6,
          }}
        >
          <Mono size={9} op={1} style={{ color: 'inherit' }}>
            © Duroo MMXXVI
          </Mono>
          <Mono size={9} op={1} style={{ color: 'inherit' }}>
            IN · ₹
          </Mono>
        </div>
        </div>
      </div>
    </footer>
  )
}
