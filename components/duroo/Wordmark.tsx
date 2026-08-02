import type { CSSProperties } from 'react'

export default function Wordmark({
  size = 20,
  letterSpacing = '0.22em',
  weight = 500,
  style,
}: {
  size?: number
  letterSpacing?: string
  weight?: number
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        fontFamily: 'inherit',
        fontWeight: weight,
        fontSize: size,
        letterSpacing,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      Duroo
    </span>
  )
}
