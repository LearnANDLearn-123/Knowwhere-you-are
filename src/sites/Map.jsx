import { useState, useEffect, useRef } from 'react'
import './Map.css'

const API = '/api'

export default function Map() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')

  const [commissions, setCommissions] = useState([])
  const [showCommissions, setShowCommissions] = useState(false)
  const [commissionForm, setCommissionForm] = useState({ title: '', map_type: '', scale: '', description: '' })
  const [commissionError, setCommissionError] = useState('')
  const [commissionSuccess, setCommissionSuccess] = useState('')

  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' })
  const [inquiryError, setInquiryError] = useState('')
  const [inquirySuccess, setInquirySuccess] = useState('')

  const modalRef = useRef()

  useEffect(() => {
    if (token) {
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.user) setUser(data.user)
          else { setToken(null); localStorage.removeItem('token') }
        })
    }
  }, [token])

  useEffect(() => {
    if (showAuth) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [showAuth])

  useEffect(() => {
    function handleClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowAuth(false)
      }
    }
    if (showAuth) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showAuth])

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value })
    setAuthError('')
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register'
    const body = authMode === 'login'
      ? { email: authForm.email, password: authForm.password }
      : authForm
    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) return setAuthError(data.error)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      setShowAuth(false)
      setAuthForm({ name: '', email: '', password: '' })
    } catch {
      setAuthError('Connection error')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    setShowCommissions(false)
  }

  const fetchCommissions = async () => {
    const res = await fetch(`${API}/commissions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (res.ok) setCommissions(data.commissions)
  }

  const openCommissions = () => {
    fetchCommissions()
    setShowCommissions(true)
  }

  const handleCommissionChange = (e) => {
    setCommissionForm({ ...commissionForm, [e.target.name]: e.target.value })
    setCommissionError('')
    setCommissionSuccess('')
  }

  const submitCommission = async (e) => {
    e.preventDefault()
    setCommissionError('')
    setCommissionSuccess('')
    try {
      const res = await fetch(`${API}/commissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commissionForm),
      })
      const data = await res.json()
      if (!res.ok) return setCommissionError(data.error)
      setCommissionForm({ title: '', map_type: '', scale: '', description: '' })
      setCommissionSuccess('Commission submitted!')
      fetchCommissions()
    } catch {
      setCommissionError('Connection error')
    }
  }

  const handleInquiryChange = (e) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value })
    setInquiryError('')
    setInquirySuccess('')
  }

  const submitInquiry = async (e) => {
    e.preventDefault()
    setInquiryError('')
    setInquirySuccess('')
    try {
      const res = await fetch(`${API}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      })
      const data = await res.json()
      if (!res.ok) return setInquiryError(data.error)
      setInquiryForm({ name: '', email: '', message: '' })
      setInquirySuccess('Message sent! We\'ll be in touch.')
    } catch {
      setInquiryError('Connection error')
    }
  }

  const topoLines = [
    'M 0 200 Q 50 180 100 190 Q 150 200 200 185 Q 250 170 300 180 Q 350 190 400 175',
    'M 0 220 Q 50 200 100 210 Q 150 220 200 205 Q 250 190 300 200 Q 350 210 400 195',
    'M 0 240 Q 50 225 100 235 Q 150 245 200 230 Q 250 215 300 225 Q 350 235 400 220',
    'M 0 260 Q 50 250 100 260 Q 150 270 200 255 Q 250 240 300 250 Q 350 260 400 245',
    'M 0 280 Q 50 270 100 280 Q 150 290 200 275 Q 250 260 300 270 Q 350 280 400 265',
    'M 100 300 Q 150 315 200 300 Q 250 285 300 295 Q 350 305 400 290',
    'M 150 320 Q 200 335 250 320 Q 300 305 350 315',
    'M 50 340 Q 100 350 150 340 Q 200 330 250 340 Q 300 350 350 335',
    'M 0 100 Q 50 110 100 100 Q 150 90 200 105 Q 250 120 300 110 Q 350 100 400 115',
    'M 0 120 Q 50 130 100 120 Q 150 110 200 125 Q 250 140 300 130 Q 350 120 400 135',
  ]

  if (showCommissions && user) {
    return (
      <div className="map">
        <nav className="map-nav">
          <span className="map-logo" style={{cursor:'pointer'}} onClick={() => setShowCommissions(false)}>MERIDIAN</span>
          <div className="map-nav-links">
            <span style={{color:'rgba(245,230,200,0.6)',fontSize:'0.75rem'}}>{user.name}</span>
            <button className="map-nav-btn" onClick={() => setShowCommissions(false)}>Studio</button>
            <button className="map-nav-btn" onClick={logout}>Sign out</button>
          </div>
        </nav>

        <div className="map-commissions-page">
          <span className="map-eyebrow">My dashboard</span>
          <h2 className="map-section-title">My Commissions</h2>

          <form className="map-commission-form" onSubmit={submitCommission}>
            <h3>Submit a new commission</h3>
            <div className="map-form-grid">
              <input name="title" placeholder="Project title" value={commissionForm.title} onChange={handleCommissionChange} required />
              <select name="map_type" value={commissionForm.map_type} onChange={handleCommissionChange} required>
                <option value="">Select map type</option>
                <option value="Topographic">Topographic</option>
                <option value="Bathymetric">Bathymetric</option>
                <option value="Celestial">Celestial</option>
                <option value="Cadastral">Cadastral</option>
                <option value="Urban">Urban</option>
                <option value="Custom">Custom</option>
              </select>
              <input name="scale" placeholder="Scale (e.g. 1:25,000)" value={commissionForm.scale} onChange={handleCommissionChange} />
              <textarea name="description" placeholder="Describe your project..." value={commissionForm.description} onChange={handleCommissionChange} rows={3} />
            </div>
            {commissionError && <p className="map-form-error">{commissionError}</p>}
            {commissionSuccess && <p className="map-form-success">{commissionSuccess}</p>}
            <button type="submit" className="map-btn">Submit commission</button>
          </form>

          <div className="map-commission-list">
            {commissions.length === 0 ? (
              <p className="map-empty">No commissions yet. Submit your first one above.</p>
            ) : (
              commissions.map(c => (
                <div key={c.id} className="map-commission-card">
                  <div className="map-commission-header">
                    <h3>{c.title}</h3>
                    <span className={`map-status map-status-${c.status}`}>{c.status}</span>
                  </div>
                  <div className="map-commission-meta">
                    <span>{c.map_type}</span>
                    {c.scale && <span>{c.scale}</span>}
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  {c.description && <p>{c.description}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="map-footer">
          <span>Meridian Cartography &mdash; Portland, ME</span>
          <button className="map-back" onClick={() => setShowCommissions(false)}>Back to studio</button>
        </footer>
      </div>
    )
  }

  return (
    <div className="map">
      <nav className="map-nav">
        <span className="map-logo">MERIDIAN</span>
        <div className="map-nav-links">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
          {user ? (
            <>
              <span style={{color:'rgba(245,230,200,0.6)',fontSize:'0.75rem'}}>{user.name}</span>
              <button className="map-nav-btn" onClick={openCommissions}>My Commissions</button>
              <button className="map-nav-btn" onClick={logout}>Sign out</button>
            </>
          ) : (
            <button className="map-nav-btn" onClick={() => setShowAuth(true)}>Sign in</button>
          )}
        </div>
      </nav>

      <section className="map-hero">
        <div className="map-hero-bg">
          <svg viewBox="0 0 400 400" className="map-topo-svg" preserveAspectRatio="xMidYMid slice">
            {topoLines.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="rgba(193,120,23,0.12)" strokeWidth="0.8" className="map-topo-line"/>
            ))}
            {topoLines.map((d, i) => (
              <path key={`offset-${i}`} d={d} fill="none" stroke="rgba(193,120,23,0.06)" strokeWidth="0.5" transform="translate(0, -15)"/>
            ))}
            <circle cx="200" cy="200" r="3" fill="rgba(193,120,23,0.4)"/>
            <text x="200" y="205" textAnchor="middle" fill="rgba(193,120,23,0.15)" fontSize="6" fontFamily="Jost" letterSpacing="2">42° N &bull; 71° W</text>
          </svg>
        </div>
        <div className="map-hero-content">
          <span className="map-eyebrow">Cartography studio &mdash; Since 1854</span>
          <h1 className="map-title">
            <span>Know</span>
            <span>where you are</span>
          </h1>
          <p className="map-desc">
            Custom maps for people who need to understand place — not just see it.
            Topographic, bathymetric, celestial. Hand-drawn, digitally rendered.
          </p>
          {user ? (
            <button className="map-btn" onClick={openCommissions}>Commission a map</button>
          ) : (
            <button className="map-btn" onClick={() => setShowAuth(true)}>Sign in to commission</button>
          )}
        </div>
      </section>

      <section className="map-work" id="work">
        <span className="map-eyebrow">Selected projects</span>
        <h2 className="map-section-title">Maps we have made</h2>
        <div className="map-project-grid">
          {[
            { title: 'White Mountains', type: 'Topographic', scale: '1:25,000', desc: 'Relief shading, contour interval 10m' },
            { title: 'Boston Harbor', type: 'Bathymetric', scale: '1:50,000', desc: 'Depth soundings, channel markers' },
            { title: 'Pacific Star Chart', type: 'Celestial', scale: 'N/A', desc: 'Navigation stars for 45° N latitude' },
            { title: 'Portland Urban', type: 'Cadastral', scale: '1:5,000', desc: 'Parcel boundaries, building footprints' },
          ].map(m => (
            <article key={m.title} className="map-project">
              <div className="map-project-visual">
                <svg viewBox="0 0 120 80">
                  <rect x="5" y="5" width="110" height="70" rx="2" fill="none" stroke="rgba(193,120,23,0.2)" strokeWidth="0.5"/>
                  <path d="M10 60 Q30 40 50 50 Q70 60 90 45 Q105 35 115 40" fill="none" stroke="rgba(193,120,23,0.3)" strokeWidth="0.5"/>
                  <path d="M10 50 Q30 30 50 40 Q70 50 90 35 Q105 25 115 30" fill="none" stroke="rgba(193,120,23,0.2)" strokeWidth="0.5"/>
                  <text x="60" y="45" textAnchor="middle" fill="rgba(245,230,200,0.3)" fontSize="5" fontFamily="Jost">{m.scale}</text>
                </svg>
              </div>
              <h3>{m.title}</h3>
              <span className="map-project-type">{m.type}</span>
              <p>{m.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="map-studio" id="studio">
        <span className="map-eyebrow">Studio</span>
        <h2 className="map-section-title">How we work</h2>
        <div className="map-studio-grid">
          {[
            { step: 'I', title: 'Survey', desc: 'We gather source data — USGS, NOAA, field sketches, satellite imagery.' },
            { step: 'II', title: 'Draft', desc: 'Base features laid out in GIS. Contours generated from elevation data.' },
            { step: 'III', title: 'Design', desc: 'Typography, color, and relief shading applied by a cartographic designer.' },
            { step: 'IV', title: 'Proof', desc: 'Digital and physical proofs. Revisions until the map is right.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="map-studio-step">
              <span className="map-studio-num">{step}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="map-contact" id="contact">
        <span className="map-eyebrow">Contact</span>
        <h2 className="map-section-title">Get in touch</h2>
        <form className="map-inquiry-form" onSubmit={submitInquiry}>
          <div className="map-inquiry-grid">
            <input name="name" placeholder="Your name" value={inquiryForm.name} onChange={handleInquiryChange} required />
            <input name="email" type="email" placeholder="Your email" value={inquiryForm.email} onChange={handleInquiryChange} required />
          </div>
          <textarea name="message" placeholder="Tell us about your project..." value={inquiryForm.message} onChange={handleInquiryChange} rows={4} required />
          {inquiryError && <p className="map-form-error">{inquiryError}</p>}
          {inquirySuccess && <p className="map-form-success">{inquirySuccess}</p>}
          <button type="submit" className="map-btn">Send message</button>
        </form>
      </section>

      <footer className="map-footer">
        <span>Meridian Cartography &mdash; Portland, ME</span>
        <a href="/" className="map-back">Back to index</a>
      </footer>

      {showAuth && (
        <div className="map-modal-overlay">
          <div className="map-modal" ref={modalRef}>
            <button className="map-modal-close" onClick={() => setShowAuth(false)}>&times;</button>
            <h2>{authMode === 'login' ? 'Sign in' : 'Create account'}</h2>
            <form onSubmit={handleAuth}>
              {authMode === 'register' && (
                <input name="name" placeholder="Full name" value={authForm.name} onChange={handleAuthChange} required />
              )}
              <input name="email" type="email" placeholder="Email" value={authForm.email} onChange={handleAuthChange} required />
              <input name="password" type="password" placeholder="Password" value={authForm.password} onChange={handleAuthChange} required minLength={6} />
              {authError && <p className="map-form-error">{authError}</p>}
              <button type="submit" className="map-btn" style={{width:'100%'}}>
                {authMode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
            <p className="map-auth-toggle">
              {authMode === 'login' ? (
                <>No account? <button onClick={() => { setAuthMode('register'); setAuthError('') }}>Register</button></>
              ) : (
                <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError('') }}>Sign in</button></>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
