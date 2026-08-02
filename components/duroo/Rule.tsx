import type { CSSProperties } from 'react'

export default function Rule({ color, style }: { color?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        height: 1,
        background: color ?? 'currentColor',
        opacity: 0.18,
        width: '100%',
        ...style,
      }}
    />
  )
}
