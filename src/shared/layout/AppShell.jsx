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
const welcomeHints = [
  {
    number: '01',
    title: 'Get to know me',
    description: 'Visit About Me for my background, experience, and the story behind my work.',
    image: '/images/Gemini_Generated_Image_hms2r9hms2r9hms2.jpg',
  },
  {
    number: '02',
    title: 'Find your way around',
    description: 'Use the left-side menu to browse sections, or search for a page from the taskbar.',
    image: '/images/Gemini_Generated_Image_vcpd3lvcpd3lvcpd.jpg',
  },
  {
    number: '03',
    title: 'Go full screen',
    description: 'For the best view, select the square in the title bar. Press Esc to exit full screen.',
    image: '/images/Gemini_Generated_Image_rimm8hrimm8hrimm.jpg',
  },
]

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
  const [activeHintIndex, setActiveHintIndex] = useState(0)
  const hintCardRefs = useRef([])
  const previousHintIndex = useRef(activeHintIndex)
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
    if (previousHintIndex.current !== activeHintIndex) {
      hintCardRefs.current[activeHintIndex]?.focus()
      previousHintIndex.current = activeHintIndex
    }
  }, [activeHintIndex])

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

  const chooseWelcomeMode = (fullscreen) => {
    if (fullscreen && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen().catch(() => {})
    } else if (!fullscreen && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {})
    }
    minimizePortfolio()
    dismissFirstVisitHints()
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
              <h1 id="welcome-title">Welcome to my portfolio</h1>
              <p className="boot-screen__status">A few pointers before you explore.</p>
              <div className="welcome-hints" role="group" aria-label="Portfolio tips">
                {welcomeHints.map((hint, index) => {
                  const distance = index - activeHintIndex
                  const isActive = distance === 0
                  const isLastHint = index === welcomeHints.length - 1
                  const advanceHint = () => setActiveHintIndex((currentIndex) => Math.min(currentIndex + 1, welcomeHints.length - 1))

                  return (
                    <article
                      key={hint.number}
                      ref={(element) => { hintCardRefs.current[index] = element }}
                      className={`welcome-hint${hint.image ? ' welcome-hint--profile' : ''}${isActive ? ' is-active' : distance > 0 ? ' is-upcoming' : ' is-past'}`}
                      style={{ '--stack-depth': Math.max(1, distance) }}
                      role="button"
                      tabIndex={isActive ? 0 : -1}
                      autoFocus={index === 0}
                      aria-hidden={!isActive}
                      aria-disabled={isActive && isLastHint}
                      aria-label={`${hint.number}. ${hint.title}. ${hint.description}${index < 2 ? ' Tap to Continue.' : ''}`}
                      onClick={isLastHint && isActive ? undefined : advanceHint}
                      onKeyDown={(event) => {
                        if (!isLastHint && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault()
                          advanceHint()
                        }
                      }}
                    >
                      {hint.image && (
                        <img
                          className="welcome-hint__portrait"
                          src={hint.image}
                          alt=""
                          aria-hidden="true"
                        />
                      )}
                      <span className="welcome-hint__number">{hint.number}</span>
                      <h2>{hint.title}</h2>
                      <p>{hint.description}</p>
                      {index < 2 && <span className="welcome-hint__continue">Tap to Continue <span aria-hidden="true">→</span></span>}
                    </article>
                  )
                })}
              </div>
              {activeHintIndex === welcomeHints.length - 1 && (
                <div className="welcome-hints__actions">
                  <button
                    className="welcome-hints__mode welcome-hints__mode--fullscreen"
                    type="button"
                    disabled={!document.documentElement.requestFullscreen}
                    onClick={() => chooseWelcomeMode(true)}
                  >
                    <span aria-hidden="true">□</span> View in full screen
                  </button>
                  <button
                    className="welcome-hints__mode welcome-hints__mode--normal"
                    type="button"
                    onClick={() => chooseWelcomeMode(false)}
                  >
                    <span aria-hidden="true">▣</span> View in normal mode
                  </button>
                </div>
              )}
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
