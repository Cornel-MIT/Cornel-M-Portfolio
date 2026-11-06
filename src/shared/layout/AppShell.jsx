import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import SettingsDialog, { DEFAULT_PREFERENCES, FALLING_EFFECTS, PALETTES } from './SettingsDialog.jsx'
import { NAV_ITEMS } from './navItems.js'
import DesktopIcons from './DesktopIcons.jsx'
import JourneyWindow from './JourneyWindow.jsx'
import OnePagePortfolio from './OnePagePortfolio.jsx'
import Taskbar from './Taskbar.jsx'
import './shell.css'

const PREFERENCES_KEY = 'sam-portfolio-preferences'
const HINTS_SEEN_KEY = 'sam-portfolio-hints-seen'

function readFirstVisit() {
  try {
    return localStorage.getItem(HINTS_SEEN_KEY) !== 'true'
  } catch {
    return true
  }
}

function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || 'null')
    if (!saved) return { ...DEFAULT_PREFERENCES }

    return {
      palette: saved.appearance === 'dark'
        ? 'dark'
        : PALETTES.some((palette) => palette.id === saved.palette) ? saved.palette : DEFAULT_PREFERENCES.palette,
      fallingEffect: FALLING_EFFECTS.some((effect) => effect.id === saved.fallingEffect) ? saved.fallingEffect : 'none',
      musicEnabled: Boolean(saved.musicEnabled),
      randomizePalettes: Boolean(saved.randomizePalettes),
    }
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

function FallingEffects({ effectId }) {
  const effect = FALLING_EFFECTS.find((item) => item.id === effectId)
  if (!effect || effect.id === 'none') return null

  return (
    <div className="falling-effects" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={`${effect.id}-${index}`}
          style={{
            '--fall-left': `${(index * 37 + 8) % 100}%`,
            '--fall-delay': `${(index % 9) * -1.7}s`,
            '--fall-duration': `${9 + (index % 5) * 2}s`,
          }}
        >
          {effect.symbols[index % effect.symbols.length]}
        </span>
      ))}
    </div>
  )
}

export default function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const current = NAV_ITEMS.find((n) => n.to === pathname) ?? NAV_ITEMS[0]
  const [preferences, setPreferences] = useState(readPreferences)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draftPreferences, setDraftPreferences] = useState(preferences)
  const musicRef = useRef(null)
  const previousPaletteRef = useRef(preferences.palette)
  const musicEnabled = settingsOpen ? draftPreferences.musicEnabled : preferences.musicEnabled
  const [volume, setVolume] = useState(42)
  const [windowOpen, setWindowOpen] = useState(true)
  const [windowMinimized, setWindowMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [journeyOpen, setJourneyOpen] = useState(false)
  const [onePageOpen, setOnePageOpen] = useState(false)
  const windowVisible = windowOpen && !windowMinimized
  const [booting, setBooting] = useState(true)
  const [firstVisit, setFirstVisit] = useState(readFirstVisit)
  const [bootReady, setBootReady] = useState(false)
  const [bootMessage] = useState(() => {
    const navigation = window.performance.getEntriesByType('navigation')[0]
    return navigation?.type === 'reload' ? 'Now Rebooting System...' : 'Welcome back Cornel'
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (firstVisit) {
        setBootReady(true)
      } else {
        setBooting(false)
      }
    }, 900)
    return () => window.clearTimeout(timer)
  }, [firstVisit])

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === document.documentElement)
    document.addEventListener('fullscreenchange', syncFullscreen)
    syncFullscreen()
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.palette = settingsOpen ? draftPreferences.palette : preferences.palette
    delete document.documentElement.dataset.appearance
  }, [draftPreferences.palette, preferences.palette, settingsOpen])

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    } catch {
      // Preferences still apply for the current page when storage is unavailable.
    }
  }, [preferences])

  useEffect(() => {
    const audio = new Audio('/audio/vukani-msaki.mp3')
    audio.loop = true
    audio.volume = volume / 100
    musicRef.current = audio

    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      musicRef.current = null
    }
  }, [])

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return

    if (!musicEnabled) {
      audio.pause()
      audio.currentTime = 0
      return
    }

    audio.play().catch(() => {
      if (settingsOpen) {
        setDraftPreferences((currentPreferences) => ({ ...currentPreferences, musicEnabled: false }))
      } else {
        setPreferences((currentPreferences) => ({ ...currentPreferences, musicEnabled: false }))
      }
    })
  }, [musicEnabled, settingsOpen])

  useEffect(() => {
    if (!preferences.musicEnabled || !preferences.randomizePalettes || settingsOpen) return undefined

    const timer = window.setInterval(() => {
      setPreferences((currentPreferences) => {
        const available = PALETTES.filter((palette) => palette.id !== currentPreferences.palette)
        const next = available[Math.floor(Math.random() * available.length)]
        return { ...currentPreferences, palette: next.id }
      })
    }, 5000)
    return () => window.clearInterval(timer)
  }, [preferences.musicEnabled, preferences.randomizePalettes, settingsOpen])

  const openSettings = () => {
    setDraftPreferences({ ...preferences })
    setSettingsOpen(true)
  }

  const saveSettings = () => {
    setPreferences(draftPreferences)
    setSettingsOpen(false)
  }

  const openPortfolio = (to = '/') => {
    setOnePageOpen(false)
    setJourneyOpen(false)
    setWindowOpen(true)
    setWindowMinimized(false)
    setSettingsOpen(false)
    navigate(to)
    window.requestAnimationFrame(() => {
      document.querySelector('.shell__content')?.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const minimizePortfolio = () => {
    setWindowMinimized(true)
    setSettingsOpen(false)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {})
    } else {
      void document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  const toggleDarkMode = () => {
    setPreferences((currentPreferences) => {
      if (currentPreferences.palette === 'dark') {
        return {
          ...currentPreferences,
          palette: previousPaletteRef.current === 'dark' ? DEFAULT_PREFERENCES.palette : previousPaletteRef.current,
        }
      }

      previousPaletteRef.current = currentPreferences.palette
      return { ...currentPreferences, palette: 'dark' }
    })
  }

  const dismissFirstVisitHints = () => {
    try {
      localStorage.setItem(HINTS_SEEN_KEY, 'true')
    } catch {
      // The welcome can still be dismissed when storage is unavailable.
    }
    setFirstVisit(false)
    setBooting(false)
  }

  const closePortfolio = () => {
    setWindowOpen(false)
    setWindowMinimized(false)
    setSettingsOpen(false)
  }

  const openDesktopSettings = () => {
    openPortfolio('/')
    setDraftPreferences({ ...preferences })
    setSettingsOpen(true)
  }

  const openJourney = () => {
    setOnePageOpen(false)
    setSettingsOpen(false)
    setJourneyOpen(true)
  }

  const openOnePage = () => {
    setSettingsOpen(false)
    setJourneyOpen(false)
    setOnePageOpen(true)
  }

  return (
    <>
      <div className="shell" inert={booting ? '' : undefined}>
        <div
          className={`shell__window${windowVisible ? '' : ' shell__window--hidden'}`}
          aria-hidden={!windowVisible}
          inert={windowVisible ? undefined : ''}
        >
          <header className="shell__titlebar">
            <span>🖥️ Cornel's - {current.title}</span>
            <span className="shell__controls">
              <button type="button" title="Minimize window" aria-label="Minimize portfolio window" onClick={minimizePortfolio}>_</button>
              <button
                type="button"
                title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                aria-pressed={isFullscreen}
                disabled={!document.documentElement.requestFullscreen || !document.exitFullscreen}
                onClick={toggleFullscreen}
              >{isFullscreen ? '❐' : '□'}</button>
              <button type="button" title="Close window" aria-label="Close portfolio window" onClick={closePortfolio}>×</button>
            </span>
          </header>
          <div className="shell__menu raised" aria-label="Application menu">
            <span><u>F</u>ile</span>
            <button type="button" className="shell__menu-item" onClick={openSettings} aria-haspopup="dialog">
              <u>E</u>dit
            </button>
            <span><u>V</u>iew</span>
            <span><u>H</u>elp</span>
          </div>

          <div className="shell__main">
            <nav className="shell__nav" aria-label="Main">
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end className="shell__link">
                      <span aria-hidden="true">{item.icon}</span> {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <p className="shell__motto">Dream<br />Code<br />Create</p>
            </nav>
            <main className="shell__content" key={pathname}>
              <Outlet context={{ onOpenJourney: openJourney }} />
            </main>
          </div>

          <footer className="shell__status raised">
            <span>🌐 Cornel Masuku Portfolio - {current.title}</span>
            <span className="shell__loader sunken" aria-hidden="true"><b key={pathname} /></span>
            <span>Let's build something great</span>
          </footer>
        </div>
        {!windowVisible && !journeyOpen && !booting && (
          <DesktopIcons onOpenSettings={openDesktopSettings} onOpenJourney={openJourney} />
        )}
        <FallingEffects effectId={preferences.fallingEffect} />
        {settingsOpen && (
          <SettingsDialog
            preferences={draftPreferences}
            onChange={setDraftPreferences}
            onClose={() => setSettingsOpen(false)}
            onReset={() => setDraftPreferences({ ...DEFAULT_PREFERENCES })}
            onSave={saveSettings}
          />
        )}
      </div>
      {journeyOpen && <JourneyWindow onClose={() => setJourneyOpen(false)} />}
      {onePageOpen && <OnePagePortfolio onClose={() => setOnePageOpen(false)} />}
      <Taskbar
        onOpenPortfolio={openPortfolio}
        onOpenOnePage={openOnePage}
        onOpenSettings={openSettings}
        windowVisible={windowVisible}
        onePageOpen={onePageOpen}
        inert={booting ? '' : undefined}
        volume={volume}
        onVolumeChange={setVolume}
        musicEnabled={musicEnabled}
        onToggleMusic={() => setPreferences((currentPreferences) => ({ ...currentPreferences, musicEnabled: !currentPreferences.musicEnabled }))}
        darkMode={preferences.palette === 'dark'}
        onToggleDarkMode={toggleDarkMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onShowDesktop={minimizePortfolio}
      />
      {booting && (
        <div
          className={`boot-screen${bootReady ? ' boot-screen--hints' : ''}`}
          role={bootReady ? 'dialog' : 'status'}
          aria-live={bootReady ? undefined : 'polite'}
          aria-modal={bootReady ? 'true' : undefined}
          aria-labelledby={bootReady ? 'welcome-title' : undefined}
        >
          {bootReady ? (
            <section className="boot-screen__panel boot-screen__panel--welcome">
              <span className="boot-screen__icon" aria-hidden="true">▣</span>
              <p className="boot-screen__eyebrow">Cornel Masuku Portfolio</p>
              <h1 id="welcome-title">Welcome to my portfolio</h1>
              <p className="boot-screen__status">A few pointers before you explore.</p>
              <div className="welcome-hints">
                <article className="welcome-hint">
                  <span className="welcome-hint__number">01</span>
                  <h2>Get to know me</h2>
                  <p>Visit About Me for my background, experience, and the story behind my work.</p>
                </article>
                <article className="welcome-hint">
                  <span className="welcome-hint__number">02</span>
                  <h2>Find your way around</h2>
                  <p>Use the left-side menu to browse sections, or search for a page from the taskbar.</p>
                </article>
                <article className="welcome-hint">
                  <span className="welcome-hint__number">03</span>
                  <h2>Go full screen</h2>
                  <p>For the best view, select the square in the title bar. Press Esc to exit full screen.</p>
                </article>
              </div>
              <button className="welcome-hints__start" type="button" autoFocus onClick={dismissFirstVisitHints}>
                Explore portfolio <span aria-hidden="true">→</span>
              </button>
            </section>
          ) : (
            <div className="boot-screen__panel">
              <span className="boot-screen__icon" aria-hidden="true">▣</span>
              <p className="boot-screen__eyebrow">Cornel Masuku Portfolio</p>
              <h1>{bootMessage}</h1>
              <p className="boot-screen__status">Preparing your workspace...</p>
              <div className="boot-screen__progress" aria-hidden="true"><span /></div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
