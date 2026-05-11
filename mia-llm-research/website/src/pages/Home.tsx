import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Membership Inference Attacks against LLMs
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
        An exploration of white-box curvature signals — loss landscape geometry, critical sharpness λ<sub>c</sub>,
        spectral analysis, and layer-specific probes — as membership inference attack signals against pretrained LLMs.
      </p>

      <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Progress Reports
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link
          to="/sprint4"
          style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', color: 'inherit', textDecoration: 'none', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '0.2rem' }}>Sprint 4 — White-Box Curvature Signals</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              2026-04-22 → 2026-05-07 · λ<sub>c</sub>, loss landscape, layer probes, spectral analysis
            </div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Apr 22 – May 7</span>
        </Link>

        <Link
          to="/sprint3"
          style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', color: 'inherit', textDecoration: 'none', opacity: 0.5, transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '0.2rem' }}>
              Sprint 3
              <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 400, fontStyle: 'italic', color: 'var(--text-muted)' }}>(TODO — draft)</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Earlier exploration — coming soon
            </div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>—</span>
        </Link>
      </div>

      <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '2.5rem' }}>
        Referenced Papers
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link
          to="/papers"
          style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', color: 'inherit', textDecoration: 'none', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '0.2rem' }}>Papers — Methods We Applied</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Basin-Like Landscape (2505.17646) · Critical Sharpness λ<sub>c</sub> (2601.16979) · Loss Landscape Viz (1712.09913)
            </div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>3 papers</span>
        </Link>
      </div>
    </div>
  )
}
