import { useState } from 'react'
import { journey } from '../../features/about/data.js'

const milestoneIcons = ['⚑', '▣', '⌘', '✦', '✓']

export default function JourneyWindow({ onClose }) {
  const [step, setStep] = useState(-1)
  const complete = step === journey.length
  const progress = step < 0 ? 0 : complete ? 100 : Math.round(((step + 1) / journey.length) * 100)
  const status = step < 0 ? 'Ready to start' : complete ? 'Journey complete' : `Stop ${step + 1} of ${journey.length}`

  const start = () => setStep(0)
  const goBack = () => setStep((currentStep) => Math.max(-1, currentStep - 1))
  const continueJourney = () => setStep((currentStep) => Math.min(journey.length, currentStep + 1))

  return (
    <div className="journey-backdrop">
      <section className="journey-window" role="dialog" aria-modal="true" aria-labelledby="journey-title">
        <header className="journey-window__topbar">
          <h1 id="journey-title"><span aria-hidden="true">🗂️</span> Cornel's Journey</h1>
          <div className="journey-progress" aria-live="polite">
            <span className="journey-progress__icon" aria-hidden="true">✧</span>
            <span className="journey-progress__status">{status}</span>
            <div className="journey-progress__track" role="progressbar" aria-label="Journey progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <strong>{progress}%</strong>
          </div>
          <button className="journey-window__close" type="button" onClick={onClose} aria-label="Close Journey">×</button>
        </header>

        <div className="journey-window__body">
          <header className="journey-page-heading">
            <div>
              <h2>Journey</h2>
              <p><span>Portfolio</span><span aria-hidden="true">›</span><strong>Journey</strong></p>
            </div>
            <span className="journey-page-heading__tag">A work in progress</span>
          </header>

          <section className="journey-path" aria-labelledby="journey-path-title">
            <h3 id="journey-path-title">Career path</h3>
            <ol className="journey-path__steps">
              <li className={`journey-path__endpoint${step < 0 ? ' is-current' : ' is-reached'}`}>
                <span className="journey-path__node" aria-hidden="true">⚑</span>
                <span className="journey-path__year">Start</span>
                <span className="journey-path__label">Cornel's story</span>
                {step < 0 && <span className="journey-path__current">Ready</span>}
              </li>
              {journey.map((milestone, index) => {
                const reached = step >= index
                const current = step === index
                return (
                  <li key={milestone.year} className={`${reached ? 'is-reached' : ''}${current ? ' is-current' : ''}`}>
                    <span className="journey-path__node" aria-hidden="true">{milestoneIcons[index % milestoneIcons.length]}</span>
                    <span className="journey-path__year">{milestone.year}</span>
                    <span className="journey-path__label">{milestone.text}</span>
                    {current && <span className="journey-path__current">Current stop</span>}
                  </li>
                )
              })}
              <li className={`journey-path__endpoint${complete ? ' is-reached is-current' : ''}`}>
                <span className="journey-path__node" aria-hidden="true">✓</span>
                <span className="journey-path__year">End</span>
                <span className="journey-path__label">More to come</span>
                {complete && <span className="journey-path__current">Complete</span>}
              </li>
            </ol>
          </section>

          <section className="journey-stop" aria-live="polite">
            {step < 0 ? (
              <div className="journey-intro">
                <span className="journey-intro__mark" aria-hidden="true">⌁</span>
                <h3>Walk Cornel's career road</h3>
                <p>Education, pivots, and experience, one stop at a time.</p>
                <button className="journey-play" type="button" onClick={start} aria-label="Play journey">▶</button>
                <span className="journey-intro__hint">Click to begin</span>
              </div>
            ) : complete ? (
              <div className="journey-complete">
                <span className="journey-complete__mark" aria-hidden="true">✓</span>
                <p className="journey-stop__eyebrow">All {journey.length} stops visited</p>
                <h3>Cornel's journey is still unfolding</h3>
                <p>From the first steps in programming to building innovative solutions, the road continues.</p>
                <button className="journey-action journey-action--primary" type="button" onClick={start}>Play again <span aria-hidden="true">↻</span></button>
              </div>
            ) : (
              <div className="journey-detail">
                <div className="journey-detail__copy">
                  <p className="journey-stop__eyebrow">Checkpoint {step + 1} <span>·</span> {journey[step].year}</p>
                  <h3>{journey[step].text}</h3>
                  <p>{journey[step].detail}</p>
                </div>
                <div className="journey-detail__actions">
                  <button className="journey-action" type="button" onClick={goBack}><span aria-hidden="true">‹</span> Back</button>
                  <button className="journey-action journey-action--primary" type="button" onClick={continueJourney}>
                    {step === journey.length - 1 ? 'Finish journey' : 'Continue'} <span aria-hidden="true">›</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
