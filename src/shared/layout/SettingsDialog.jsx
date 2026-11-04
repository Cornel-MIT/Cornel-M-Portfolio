import { useEffect, useRef } from 'react'
import './settings.css'

export const DEFAULT_PREFERENCES = {
  palette: 'classic',
  fallingEffect: 'none',
  musicEnabled: false,
  randomizePalettes: false,
}

export const PALETTES = [
  { id: 'classic', label: 'Classic', detail: 'Champagne & bronze', swatches: ['#8d6e4c', '#e8c4bd'] },
  { id: 'rose', label: 'Rose', detail: 'Soft pink & berry', swatches: ['#bf477e', '#efb3cf'] },
  { id: 'forest', label: 'Forest', detail: 'Deep green & moss', swatches: ['#21804b', '#a9d8b8'] },
  { id: 'sunset', label: 'Sunset', detail: 'Warm amber & coral', swatches: ['#d45e2a', '#f0b4a1'] },
  { id: 'aurora', label: 'Aurora', detail: 'Violet & mint', swatches: ['#7250b2', '#bde0cf'] },
  { id: 'ocean', label: 'Ocean', detail: 'Deep teal & sky', swatches: ['#087c9d', '#9fd5e4'] },
  { id: 'world-cup', label: 'World Cup', detail: 'Pitch green & gold', swatches: ['#087b50', '#e9d28d'] },
  { id: 'dark', label: 'Dark', detail: 'Midnight blue & neon cyan', swatches: ['#08131d', '#00d5ff'] },
]

export const FALLING_EFFECTS = [
  { id: 'none', label: 'None', detail: 'No falling animation', symbols: [''] },
  { id: 'snow', label: 'Snow', detail: 'Gentle snowflakes', symbols: ['❄', '❅', '❆'] },
  { id: 'flowers', label: 'Flowers', detail: 'Blossoms and petals', symbols: ['✿', '❀', '🌼'] },
  { id: 'dev-icons', label: 'Dev icons', detail: 'Little software symbols', symbols: ['{ }', '</>', '⌘', '⚙'] },
  { id: 'world-cup', label: 'World Cup', detail: 'Football and stars', symbols: ['⚽', '★', '✦'] },
]

export default function SettingsDialog({ preferences, onChange, onClose, onReset, onSave }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  const update = (key, value) => onChange({ ...preferences, [key]: value })
  const selectedPalette = PALETTES.find((palette) => palette.id === preferences.palette) ?? PALETTES[0]

  return (
    <dialog
      ref={dialogRef}
      className="settings-dialog"
      aria-labelledby="settings-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose() }}
    >
      <header className="settings__header">
        <h2 id="settings-title"><span aria-hidden="true">⚙</span> Portfolio settings</h2>
        <button className="settings__close" type="button" onClick={onClose} aria-label="Close settings">×</button>
      </header>

      <div className="settings__body">
        <section className="settings__section" aria-labelledby="settings-palette-title">
          <h3 id="settings-palette-title"><span aria-hidden="true">◉</span> Color theme</h3>
          <p className="settings__hint">Choose a palette for the whole portfolio.</p>
          <div className="settings__palette-grid">
            {PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                className={`settings__palette${preferences.palette === palette.id ? ' is-selected' : ''}`}
                aria-pressed={preferences.palette === palette.id}
                onClick={() => update('palette', palette.id)}
              >
                <span className="settings__swatches" aria-hidden="true">
                  {palette.swatches.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
                </span>
                <strong>{palette.label}</strong>
                <small>{palette.detail}</small>
              </button>
            ))}
          </div>
          <div className="settings__preview" aria-live="polite">
            <div className="settings__preview-label">Live preview <strong>{selectedPalette.label}</strong></div>
            <div className="settings__preview-window">
              <div className="settings__preview-titlebar"><span>Cornel Masuku - Portfolio</span><span>_ □ ×</span></div>
              <div className="settings__preview-content">
                <strong>A theme that feels like yours</strong>
                <span>Color, type, and surface preview</span>
                <i>Selected theme</i>
              </div>
            </div>
          </div>
        </section>

        <div className="settings__middle">
          <section className="settings__section" aria-labelledby="settings-music-title">
            <h3 id="settings-music-title"><span aria-hidden="true">♫</span> Background music</h3>
            <p className="settings__hint">Play Vukani by Msaki in the background.</p>
            <div className="settings__music raised">
              <span className="settings__play-icon" aria-hidden="true">{preferences.musicEnabled ? '♫' : '▶'}</span>
              <span className="settings__music-label"><strong>Vukani</strong><small>Msaki</small></span>
              <button className="settings__text-action" type="button" onClick={() => update('musicEnabled', !preferences.musicEnabled)}>
                {preferences.musicEnabled ? 'Pause' : 'Play'}
              </button>
            </div>
            <label className={`settings__shuffle${preferences.musicEnabled ? '' : ' is-disabled'}`}>
              <input
                type="checkbox"
                checked={preferences.randomizePalettes}
                disabled={!preferences.musicEnabled}
                onChange={(event) => update('randomizePalettes', event.target.checked)}
              />
              <span><strong>Shuffle palettes</strong><small>Change colors every 5 seconds while music plays</small></span>
            </label>
          </section>
        </div>

        <section className="settings__section" aria-labelledby="settings-effects-title">
          <h3 id="settings-effects-title"><span aria-hidden="true">✦</span> Falling animation</h3>
          <p className="settings__hint">One effect at a time. Animations turn off when reduced motion is enabled.</p>
          <div className="settings__effects">
            {FALLING_EFFECTS.map((effect) => (
              <button
                key={effect.id}
                type="button"
                className={`settings__effect${preferences.fallingEffect === effect.id ? ' is-selected' : ''}`}
                aria-pressed={preferences.fallingEffect === effect.id}
                onClick={() => update('fallingEffect', effect.id)}
              >
                <span className="settings__effect-icon" aria-hidden="true">{effect.symbols[0] || '∅'}</span>
                <span><strong>{effect.label}</strong><small>{effect.detail}</small></span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="settings__footer">
        <button className="settings__reset" type="button" onClick={onReset}>Reset</button>
        <button className="settings__save" type="button" onClick={onSave}><span aria-hidden="true">▣</span> Save preferences</button>
      </footer>
    </dialog>
  )
}