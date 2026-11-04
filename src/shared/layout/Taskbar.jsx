import { useEffect, useState } from 'react'
import { NAV_ITEMS } from './navItems.js'

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }).format(date)
}

export default function Taskbar({ onOpenPortfolio, onOpenOnePage, windowVisible, onePageOpen }) {
  const [now, setNow] = useState(() => new Date())
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(timer)
  }, [])

  const results = NAV_ITEMS.filter((item) => {
    const searchable = `${item.label} ${item.title}`.toLowerCase()
    return searchable.includes(query.trim().toLowerCase())
  })

  const openRoute = (to) => {
    onOpenPortfolio(to)
    setQuery('')
    setSearchOpen(false)
  }

  const openPortfolio = () => {
    openRoute('/')
  }

  const openAbout = () => {
    openRoute('/about')
  }

  const submitSearch = (event) => {
    event.preventDefault()
    if (results[0]) openRoute(results[0].to)
  }

  return (
    <nav className="taskbar" aria-label="Desktop taskbar">
      <div className="taskbar__center">
        <button
          className="taskbar__start"
          type="button"
          title="Open About Me"
          aria-label="Open About Me section"
          onClick={openAbout}
        >
          <span aria-hidden="true">⊞</span>
          <span className="taskbar__start-label">Start</span>
        </button>
        <form className="taskbar__search" role="search" onSubmit={submitSearch}>
          <span className="taskbar__search-icon" aria-hidden="true">⌕</span>
          <input
            aria-label="Search portfolio pages"
            aria-controls="taskbar-search-results"
            aria-expanded={searchOpen}
            autoComplete="off"
            placeholder="Search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false) }}
          />
          {searchOpen && (
            <div className="taskbar__results" id="taskbar-search-results" role="listbox" aria-label="Portfolio pages">
              {results.length ? results.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  className="taskbar__result"
                  role="option"
                  aria-selected="false"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => openRoute(item.to)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span><strong>{item.label}</strong><small>{item.title}</small></span>
                </button>
              )) : <p className="taskbar__empty">No matching pages</p>}
            </div>
          )}
        </form>
        <button
          className={`taskbar__app${windowVisible ? ' is-active' : ''}`}
          type="button"
          title={windowVisible ? 'Portfolio is open' : 'Open portfolio'}
          aria-label="Open portfolio"
          aria-pressed={windowVisible}
          onClick={openPortfolio}
        >
          <span aria-hidden="true">🗂️</span>
          <span className="taskbar__app-label">Portfolio</span>
        </button>
        <button
          className={`taskbar__one-page${onePageOpen ? ' is-active' : ''}`}
          type="button"
          title="View one-page portfolio"
          aria-label="Switch to one-page portfolio view"
          aria-pressed={onePageOpen}
          onClick={onOpenOnePage}
        >
          <span aria-hidden="true">▤</span>
          <span className="taskbar__one-page-label">1-Page</span>
        </button>
      </div>

      <div className="taskbar__tray" aria-label="System status">
        <span className="taskbar__status-icon" title="Wi-Fi connected" aria-label="Wi-Fi connected"><span aria-hidden="true">◔</span></span>
        <span className="taskbar__status-icon" title="Volume on" aria-label="Volume on"><span aria-hidden="true">◖))</span></span>
        <span className="taskbar__status-icon" title="Battery" aria-label="Battery status"><span aria-hidden="true">▰</span></span>
        <time className="taskbar__clock" dateTime={now.toISOString()}>
          <span>{formatTime(now)}</span>
          <span>{formatDate(now)}</span>
        </time>
      </div>
    </nav>
  )
}
