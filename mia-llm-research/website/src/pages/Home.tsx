import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Curvature Clues
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
        White-box membership inference via loss-landscape geometry · Ao Yu
      </p>

      <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Progress Reports
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link to="/sprint4" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', color: 'inherit', textDecoration: 'none', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '0.2rem' }}>Sprint 4 — White-Box Curvature Signals</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              2026-04-22 → 2026-05-07 · λ<sub>c</sub>, loss landscape, layer probes, spectral analysis
            </div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Apr 22 – May 7</span>
        </Link>
      </div>
    </div>
  )
}
