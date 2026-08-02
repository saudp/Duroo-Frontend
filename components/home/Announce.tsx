// Server component — CSS-only marquee, no JS needed
export default function Announce() {
  const segment = (offset: number) => (
    <span
      key={offset}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 48, paddingRight: 48 }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}
        >
          <span>Free shipping on orders above ₹2,999</span>
          <span style={{ opacity: 0.45 }}>◆</span>
          <span>SS26 Crossover · Now Live</span>
          <span style={{ opacity: 0.45 }}>◆</span>
          <span>30-day returns, lifetime repair</span>
          <span style={{ opacity: 0.45, padding: '0 14px' }}>◆</span>
        </span>
      ))}
    </span>
  )

  return (
    <div
      aria-hidden="true"
      style={{
        background: 'var(--c-night)',
        color: 'var(--c-bone)',
        padding: '10px 0',
        fontFamily: 'var(--ff-mono)',
        fontSize: 10,
        letterSpacing: 'var(--ls-mono)',
        textTransform: 'uppercase',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        className="duroo-marquee-track"
        style={{
          display: 'inline-flex',
          animation: 'duroo-marquee 60s linear infinite',
        }}
      >
        {segment(0)}
        {segment(1)}
        {segment(2)}
        {segment(3)}
      </div>
    </div>
  )
}
