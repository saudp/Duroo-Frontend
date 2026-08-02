import type { CSSProperties, ReactNode } from 'react'

const PADS = { sm: '10px 18px 9px', md: '14px 26px 13px', lg: '18px 34px 17px' } as const
const FS = { sm: 11, md: 12, lg: 13 } as const

export default function CTA({
  children,
  dark = false,
  size = 'md',
  style,
  onClick,
  type = 'button',
  href,
}: {
  children: ReactNode
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: CSSProperties
  onClick?: () => void
  type?: 'button' | 'submit'
  href?: string
}) {
  const s: CSSProperties = {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: PADS[size],
    background: dark ? 'var(--c-ink)' : 'var(--c-yellow)',
    color: dark ? 'var(--c-yellow)' : 'var(--c-ink)',
    fontFamily: 'var(--ff-mono)',
    fontSize: FS[size],
    letterSpacing: 'var(--ls-mono)',
    textTransform: 'uppercase',
    borderRadius: 'var(--r-pill)',
    whiteSpace: 'nowrap',
    border: 'none',
    outline: 'none',
    transition: 'opacity 0.2s ease',
    textDecoration: 'none',
    ...style,
  }

  if (href) {
    return (
      <a href={href} style={s}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} style={s}>
      {children}
    </button>
  )
}
