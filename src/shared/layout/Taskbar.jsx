import { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from './navItems.js'

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }).format(date)
}

function SystemIcon({ name, level }) {
  const paths = {
    wifi: <><path d="M2 8.8a15 15 0 0 1 20 0" /><path d="M5 12a10.5 10.5 0 0 1 14 0" /><path d="M8.5 15.5a5.25 5.25 0 0 1 7 0" /><path d="M12 19h.01" /></>,
    wifiOff: <><path d="M2 8.8a15 15 0 0 1 20 0" /><path d="M5 12a10.5 10.5 0 0 1 14 0" /><path d="M8.5 15.5a5.25 5.25 0 0 1 7 0" /><path d="m3 3 18 18" /></>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15 9a5 5 0 0 1 0 6" /><path d="M18 6a9 9 0 0 1 0 12" /></>,
    mute: <><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="m16 9 5 6" /><path d="m21 9-5 6" /></>,
    battery: <><rect x="2" y="6" width="19" height="12" rx="2" /><path d="M23 10v4" />{level > 0 && <rect x="5" y="9" width={Math.max(1, 13 * level / 100)} height="6" rx="1" className="system-icon__battery-level" />}</>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M16 3h3a2 2 0 0 1 2 2v3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M21 16v3a2 2 0 0 1-2 2h-3" /></>,
    chevron: <path d="m6 14 6-6 6 6" />,
    music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    play: <path d="m8 5 12 7-12 7V5Z" />,
    desktop: <><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8m-4-4v4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12" /></>,
    pages: <><rect x="5" y="4" width="14" height="16" rx="1.5" /><path d="M8 8h8m-8 4h8m-8 4h5" /></>,
  }

  return (
    <svg className="system-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  )
}

export default function Taskbar({
  onOpenPortfolio,
  onOpenOnePage,
  onOpenSettings,
  windowVisible,
  onePageOpen,
  inert,
  volume,
  onVolumeChange,
  musicEnabled,
  onToggleMusic,
  darkMode,
  onToggleDarkMode,
  isFullscreen,
  onToggleFullscreen,
  onShowDesktop,
}) {
  const [now, setNow] = useState(() => new Date())
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [hiddenIconsOpen, setHiddenIconsOpen] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [lastVolume, setLastVolume] = useState(volume || 42)
  const [batteryInfo, setBatteryInfo] = useState(null)
  const taskbarRef = useRef(null)
  const quickSettingsTriggerRef = useRef(null)
  const hiddenIconsTriggerRef = useRef(null)

  const toggleQuickSettings = (event) => {
    quickSettingsTriggerRef.current = event.currentTarget
    setQuickSettingsOpen((open) => !open)
    setHiddenIconsOpen(false)
    setSearchOpen(false)
  }

  const toggleHiddenIcons = (event) => {
    hiddenIconsTriggerRef.current = event.currentTarget
    setHiddenIconsOpen((open) => !open)
    setQuickSettingsOpen(false)
    setSearchOpen(false)
  }

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!quickSettingsOpen && !hiddenIconsOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!taskbarRef.current?.contains(event.target)) {
        setQuickSettingsOpen(false)
        setHiddenIconsOpen(false)
      }
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      if (hiddenIconsOpen) {
        setHiddenIconsOpen(false)
        hiddenIconsTriggerRef.current?.focus()
        return
      }
      setQuickSettingsOpen(false)
      quickSettingsTriggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [quickSettingsOpen, hiddenIconsOpen])

  useEffect(() => {
    if (!navigator.getBattery) return undefined

    let battery
    let active = true
    const updateBattery = () => {
      if (active && battery) {
        setBatteryInfo({ level: Math.round(battery.level * 100), charging: battery.charging })
      }
    }

    navigator.getBattery().then((deviceBattery) => {
      if (!active) return
      battery = deviceBattery
      updateBattery()
      battery.addEventListener('levelchange', updateBattery)
      battery.addEventListener('chargingchange', updateBattery)
    }).catch(() => {})

    return () => {
      active = false
      battery?.removeEventListener('levelchange', updateBattery)
      battery?.removeEventListener('chargingchange', updateBattery)
    }
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

  const soundEnabled = volume > 0
  const toggleSound = () => {
    if (soundEnabled) {
      setLastVolume(volume)
      onVolumeChange(0)
    } else {
      onVolumeChange(lastVolume || 42)
    }
  }

  return (
    <nav ref={taskbarRef} className="taskbar" aria-label="Desktop taskbar" inert={inert}>
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

      {quickSettingsOpen && (
        <section className="quick-settings" id="quick-settings-panel" aria-label="Quick settings">
          <div className="quick-settings__tiles">
            <button
              className={`quick-settings__tile${wifiEnabled ? ' is-on' : ''}`}
              type="button"
              aria-pressed={wifiEnabled}
              onClick={() => setWifiEnabled((enabled) => !enabled)}
            >
              <span className="quick-settings__icon"><SystemIcon name={wifiEnabled ? 'wifi' : 'wifiOff'} /></span>
              <span>Wi-Fi</span>
              <small>{wifiEnabled ? 'Online' : 'Off'}</small>
            </button>
            <button
              className={`quick-settings__tile${soundEnabled ? ' is-on' : ''}`}
              type="button"
              aria-pressed={soundEnabled}
              onClick={toggleSound}
            >
              <span className="quick-settings__icon"><SystemIcon name={soundEnabled ? 'volume' : 'mute'} /></span>
              <span>Sound</span>
              <small>{soundEnabled ? 'On' : 'Muted'}</small>
            </button>
            <button
              className={`quick-settings__tile${darkMode ? ' is-on' : ''}`}
              type="button"
              aria-pressed={darkMode}
              onClick={onToggleDarkMode}
            >
              <span className="quick-settings__icon"><SystemIcon name={darkMode ? 'sun' : 'moon'} /></span>
              <span>Dark mode</span>
              <small>{darkMode ? 'On' : 'Off'}</small>
            </button>
            <button
              className={`quick-settings__tile${isFullscreen ? ' is-on' : ''}`}
              type="button"
              aria-pressed={isFullscreen}
              onClick={() => { onToggleFullscreen(); setQuickSettingsOpen(false) }}
            >
              <span className="quick-settings__icon"><SystemIcon name="expand" /></span>
              <span>Full screen</span>
              <small>{isFullscreen ? 'On' : 'Off'}</small>
            </button>
            <button
              className={`quick-settings__tile${musicEnabled ? ' is-on' : ''}`}
              type="button"
              aria-pressed={musicEnabled}
              onClick={onToggleMusic}
            >
              <span className="quick-settings__icon"><SystemIcon name={musicEnabled ? 'music' : 'play'} /></span>
              <span>Music</span>
              <small>{musicEnabled ? 'Playing' : 'Paused'}</small>
            </button>
            <button className="quick-settings__tile" type="button" onClick={() => { onShowDesktop(); setQuickSettingsOpen(false) }}>
              <span className="quick-settings__icon"><SystemIcon name="desktop" /></span>
              <span>Show desktop</span>
              <small>Minimize</small>
            </button>
          </div>

          <label className="quick-settings__volume">
            <span className="quick-settings__volume-icon"><SystemIcon name={soundEnabled ? 'volume' : 'mute'} /></span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              aria-label="Volume"
              onChange={(event) => {
                const nextVolume = Number(event.target.value)
                if (nextVolume > 0) setLastVolume(nextVolume)
                onVolumeChange(nextVolume)
              }}
            />
            <output>{volume}</output>
          </label>

          <div className="quick-settings__battery">
            <span className="quick-settings__battery-icon"><SystemIcon name="battery" level={batteryInfo?.level} /></span>
            <span><strong>Battery</strong><small>{batteryInfo ? `${batteryInfo.level}%${batteryInfo.charging ? ' · Charging' : ''}` : 'Status unavailable in browser'}</small></span>
          </div>
        </section>
      )}

      <div className="taskbar__tray" aria-label="System status">
        <div className="taskbar__overflow">
          <button
            className={`taskbar__overflow-toggle${hiddenIconsOpen ? ' is-active' : ''}`}
            type="button"
            title="Show hidden icons"
            aria-label={hiddenIconsOpen ? 'Hide hidden icons' : 'Show hidden icons'}
            aria-expanded={hiddenIconsOpen}
            aria-controls="taskbar-hidden-icons"
            onClick={toggleHiddenIcons}
          >
            <SystemIcon name="chevron" />
          </button>
          {hiddenIconsOpen && (
            <div className="taskbar__overflow-menu" id="taskbar-hidden-icons" role="group" aria-label="Hidden icons">
              <button
                className="taskbar__overflow-item"
                type="button"
                title={musicEnabled ? 'Pause background music' : 'Play background music'}
                aria-label={musicEnabled ? 'Pause background music' : 'Play background music'}
                aria-pressed={musicEnabled}
                onClick={() => { onToggleMusic(); setHiddenIconsOpen(false) }}
              >
                <SystemIcon name={musicEnabled ? 'music' : 'play'} />
              </button>
              <button
                className="taskbar__overflow-item"
                type="button"
                title="Portfolio settings"
                aria-label="Open portfolio settings"
                onClick={() => { onOpenSettings(); setHiddenIconsOpen(false) }}
              >
                <SystemIcon name="settings" />
              </button>
              <button
                className="taskbar__overflow-item"
                type="button"
                title="One-page portfolio"
                aria-label="Open one-page portfolio"
                onClick={() => { onOpenOnePage(); setHiddenIconsOpen(false) }}
              >
                <SystemIcon name="pages" />
              </button>
            </div>
          )}
        </div>
        <button
          className={`taskbar__system-status${quickSettingsOpen ? ' is-active' : ''}`}
          type="button"
          title="Quick settings"
          aria-label={quickSettingsOpen ? 'Close quick settings' : 'Open quick settings'}
          aria-expanded={quickSettingsOpen}
          aria-controls="quick-settings-panel"
          onClick={toggleQuickSettings}
        >
          <SystemIcon name="wifi" />
          <SystemIcon name={soundEnabled ? 'volume' : 'mute'} />
          <SystemIcon name="battery" level={batteryInfo?.level} />
        </button>
        <time className="taskbar__clock" dateTime={now.toISOString()}>
          <span>{formatTime(now)}</span>
          <span>{formatDate(now)}</span>
        </time>
      </div>
    </nav>
  )
}
