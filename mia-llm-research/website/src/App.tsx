import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Sprint3 from './pages/Sprint3'
import Sprint4 from './pages/Sprint4'
import Sprint5 from './pages/Sprint5'
import Papers from './pages/Papers'
import './App.css'

function UrlNormalizer() {
  // HashRouter keeps the previous pathname when navigating via <Link>, so the
  // address bar shows e.g. "/sprint4#/sprint5" instead of "/#/sprint5". This
  // rewrites the pathname back to the vite base URL on every route change
  // while preserving the hash (no reload — history.replaceState only).
  const location = useLocation()
  useEffect(() => {
    const base = import.meta.env.BASE_URL  // "/" in dev, "/MIA-Research-Workspace/" in prod
    if (window.location.pathname !== base) {
      const hash = window.location.hash || `#${location.pathname}${location.search}`
      history.replaceState(null, '', `${base}${hash}`)
    }
  }, [location.pathname, location.search, location.hash])
  return null
}

function HashAnchorHandler() {
  const location = useLocation()
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest('a') as HTMLAnchorElement | null
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || !href.startsWith('#') || href.length < 2) return
      if (href.startsWith('#/')) return
      const id = href.slice(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const base = `#${location.pathname}${location.search}`
      history.replaceState(null, '', `${base}#${id}`)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [location.pathname, location.search])
  return null
}

function Nav() {
  return (
    <nav className="site-nav">
      <Link to="/" className="site-title">Curvature Clues</Link>
      <span className="nav-sep">·</span>
      <Link to="/sprint3" className="nav-todo">Sprint 3</Link>
      <span className="nav-sep">·</span>
      <Link to="/sprint4">Sprint 4</Link>
      <span className="nav-sep">·</span>
      <Link to="/sprint5">Sprint 5</Link>
      <span className="nav-sep">·</span>
      <Link to="/papers">Papers</Link>
      <span className="nav-right">
        <a href="https://github.com/Athsus/Membership-Inference-Attack-Ao" target="_blank" rel="noreferrer">GitHub ↗</a>
      </span>
    </nav>
  )
}

export default function App() {
  return (
    <div className="app">
      <UrlNormalizer />
      <HashAnchorHandler />
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sprint3" element={<Sprint3 />} />
          <Route path="/sprint4" element={<Sprint4 />} />
          <Route path="/sprint5" element={<Sprint5 />} />
          <Route path="/papers" element={<Papers />} />
        </Routes>
      </main>
    </div>
  )
}
