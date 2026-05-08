import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Sprint4 from './pages/Sprint4'
import './App.css'

function Nav() {
  return (
    <nav className="site-nav">
      <Link to="/" className="site-title">Curvature Clues</Link>
      <span className="nav-sep">·</span>
      <Link to="/sprint4">Sprint 4</Link>
      <span className="nav-right">
        <a href="https://github.com/Athsus/Membership-Inference-Attack-Ao" target="_blank" rel="noreferrer">GitHub ↗</a>
      </span>
    </nav>
  )
}

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sprint4" element={<Sprint4 />} />
        </Routes>
      </main>
    </div>
  )
}
