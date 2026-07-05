import { Link } from 'react-router-dom'
import './Index.css'

const sites = [
  { num: '09', path: '/', title: 'Meridian', subtitle: 'Cartography Studio', bg: '#1a3a4a', accent: '#c17817' },
]

export default function Index() {
  return (
    <div className="index">
      <header className="index-header">
        <h1 className="index-title">Meridian</h1>
        <p className="index-desc">Cartography Studio</p>
      </header>
      <nav className="index-grid" style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/" className="index-card" style={{ '--bg': '#1a3a4a', '--accent': '#c17817', maxWidth: '400px' }}>
          <span className="index-card-num">09</span>
          <span className="index-card-title">Meridian</span>
          <span className="index-card-sub">Cartography Studio</span>
        </Link>
      </nav>
    </div>
  )
}
