import type { CSSProperties, ReactNode } from 'react'

export default function Mono({
  children,
  size = 11,
  op = 0.7,
  tracking = 'var(--ls-mono)',
  style,
  className,
}: {
  children: ReactNode
  size?: number
  op?: number
  tracking?: string
  style?: CSSProperties
  className?: string
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: size,
        letterSpacing: tracking,
        textTransform: 'uppercase',
        opacity: op,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
