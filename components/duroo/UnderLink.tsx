import type { CSSProperties, ReactNode } from 'react'

export default function UnderLink({
  children,
  size = 11,
  style,
}: {
  children: ReactNode
  size?: number
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: size,
        letterSpacing: 'var(--ls-mono)',
        textTransform: 'uppercase',
        borderBottom: '1px solid currentColor',
        paddingBottom: 2,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
