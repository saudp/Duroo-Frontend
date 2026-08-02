import type { CSSProperties, ReactNode } from 'react'

const PALETTES = {
  neutral: { bg: 'transparent', fg: 'currentColor', border: '1px solid currentColor' },
  yellow: { bg: 'var(--c-yellow)', fg: 'var(--c-ink)', border: '1px solid transparent' },
  ink: { bg: 'var(--c-ink)', fg: 'var(--c-paper)', border: '1px solid transparent' },
} as const

export default function Tag({
  kind = 'neutral',
  children,
  style,
}: {
  kind?: 'neutral' | 'yellow' | 'ink'
  children: ReactNode
  style?: CSSProperties
}) {
  const p = PALETTES[kind]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px 3px',
        background: p.bg,
        color: p.fg,
        border: p.border,
        fontFamily: 'var(--ff-mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        borderRadius: 'var(--r-pill)',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
