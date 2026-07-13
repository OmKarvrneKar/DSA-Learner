import { useState } from 'react'

const W = 500, H = 280, PAD = { top: 20, right: 20, bottom: 40, left: 55 }
const N_MAX = 16
const CURVES = [
  { label: 'O(1)', color: '#00d4aa', fn: () => 1 },
  { label: 'O(log n)', color: '#7ecfff', fn: n => Math.log2(n) },
  { label: 'O(n)', color: '#ffd700', fn: n => n },
  { label: 'O(n log n)', color: '#ffb347', fn: n => n * Math.log2(n) },
  { label: 'O(n²)', color: '#ff9966', fn: n => n * n },
  { label: 'O(2ⁿ)', color: '#e94560', fn: n => Math.min(Math.pow(2, n), 600) },
]

function toSVG(n, val, maxVal) {
  const x = PAD.left + ((n - 1) / (N_MAX - 1)) * (W - PAD.left - PAD.right)
  const y = PAD.top + (1 - val / maxVal) * (H - PAD.top - PAD.bottom)
  return [x, y]
}

export default function ComplexityGraph() {
  const [hover, setHover] = useState(null)
  const [hidden, setHidden] = useState(new Set())

  const ns = Array.from({ length: N_MAX }, (_, i) => i + 1)
  const maxVal = Math.max(...CURVES.filter(c => !hidden.has(c.label)).flatMap(c => ns.map(n => c.fn(n))), 1)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: H, overflow: 'visible' }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD.top + (1 - t) * (H - PAD.top - PAD.bottom)
          return <line key={t} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 4" />
        })}
        {ns.map(n => {
          const [x] = toSVG(n, 0, 1)
          return <line key={n} x1={x} y1={PAD.top} x2={x} y2={H - PAD.bottom} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 4" />
        })}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="var(--text2)" strokeWidth={1} />
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="var(--text2)" strokeWidth={1} />
        <text x={PAD.left - 8} y={H - PAD.bottom + 4} textAnchor="end" fill="var(--text2)" fontSize={10}>0</text>
        <text x={(W + PAD.left) / 2} y={H - 4} textAnchor="middle" fill="var(--text2)" fontSize={11}>n (input size)</text>
        <text x={14} y={(H + PAD.top) / 2} textAnchor="middle" fill="var(--text2)" fontSize={11} transform={`rotate(-90, 14, ${(H + PAD.top) / 2})`}>Operations</text>

        {/* X-axis labels */}
        {[1, 4, 8, 12, 16].map(n => {
          const [x] = toSVG(n, 0, 1)
          return <text key={n} x={x} y={H - PAD.bottom + 14} textAnchor="middle" fill="var(--text2)" fontSize={10}>{n}</text>
        })}

        {/* Curves */}
        {CURVES.map(curve => {
          if (hidden.has(curve.label)) return null
          const points = ns.map(n => toSVG(n, curve.fn(n), maxVal).join(',')).join(' ')
          return (
            <polyline key={curve.label} points={points} fill="none"
              stroke={curve.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              opacity={hover && hover !== curve.label ? 0.2 : 1}
              style={{ transition: 'opacity 0.2s' }}
            />
          )
        })}

        {/* Hover dots */}
        {hover && (() => {
          const curve = CURVES.find(c => c.label === hover)
          if (!curve) return null
          return ns.map(n => {
            const [x, y] = toSVG(n, curve.fn(n), maxVal)
            return <circle key={n} cx={x} cy={y} r={3} fill={curve.color} />
          })
        })()}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        {CURVES.map(c => (
          <button key={c.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
              borderRadius: 20, border: `1px solid ${hidden.has(c.label) ? 'var(--border)' : c.color}`,
              background: hidden.has(c.label) ? 'transparent' : `${c.color}18`,
              color: hidden.has(c.label) ? 'var(--text2)' : c.color,
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={() => setHover(c.label)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setHidden(h => { const n = new Set(h); n.has(c.label) ? n.delete(c.label) : n.add(c.label); return n })}
          >
            <span style={{ width: 14, height: 3, background: c.color, borderRadius: 2, display: 'inline-block' }} />
            {c.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text2)', textAlign: 'center', marginTop: 6 }}>
        Click a label to show/hide • Hover to highlight
      </p>
    </div>
  )
}
