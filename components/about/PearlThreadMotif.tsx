// A single strand connecting a handful of pearls.
//
// This is the one recurring visual signature for this page — it's not
// decoration for its own sake, it's the literal image behind two pieces of
// the brand story: "Durafsha" (bearer of pearls) and the tagline's closing
// line, "one thread that connects them." Every place a real photo isn't
// available yet, this motif stands in instead of a generic placeholder box.

export default function PearlThreadMotif({
  className = '',
  orientation = 'horizontal',
}: {
  className?: string
  /** "horizontal" for wide layouts, "vertical" for tall image-slot fallbacks */
  orientation?: 'horizontal' | 'vertical'
}) {
  const isVertical = orientation === 'vertical'

  return (
    <svg
      viewBox={isVertical ? '0 0 200 600' : '0 0 600 200'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {isVertical ? (
        <>
          <line x1="100" y1="20" x2="100" y2="580" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
          {[60, 160, 260, 340, 420, 520].map((cy, i) => (
            <circle key={cy} cx="100" cy={cy} r={i % 2 === 0 ? 7 : 4} fill="currentColor" fillOpacity={i % 2 === 0 ? 0.9 : 0.5} />
          ))}
        </>
      ) : (
        <>
          <line x1="20" y1="100" x2="580" y2="100" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
          {[60, 160, 260, 340, 420, 540].map((cx, i) => (
            <circle key={cx} cx={cx} cy="100" r={i % 2 === 0 ? 7 : 4} fill="currentColor" fillOpacity={i % 2 === 0 ? 0.9 : 0.5} />
          ))}
        </>
      )}
    </svg>
  )
}
