import { useOutletContext } from 'react-router-dom'
import Banner from '../../shared/components/Banner.jsx'
import Window from '../../shared/components/Window.jsx'
import { profile, journey, experience, cloudExperience, loves } from './data.js'
import './about.css'

export default function AboutPage() {
  const { onOpenJourney } = useOutletContext()

  return (
    <div className="page">
      <Banner title="About Me" tagline={profile.headline} mascot={null} />

      <div className="grid-2">
        <Window title="Who am I?" icon="ℹ️">
          <div className="about__bio">
            <div className="about__polaroid">
              <img className="about__portrait" src="/images/Programmer02.jpg" alt="A programmer working at a multi-monitor setup" />
            </div>
            <div>
              {profile.bio.map((p) => <p key={p}>{p}</p>)}
              <p className="about__sign">Build. Learn. Grow.</p>
            </div>
          </div>
        </Window>

        <Window title="My journey" icon="⭐">
          <ol className="about__timeline">
            {journey.map((j) => (
              <li key={j.year}>
                <strong>{j.year}</strong> {j.text}
              </li>
            ))}
          </ol>
          <button className="btn btn--primary about__journey-start" type="button" onClick={onOpenJourney}>
            <span aria-hidden="true">▶</span> Start Journey
          </button>
        </Window>

        <Window title="Professional experience" icon="💼">
          <ol className="about__experience">
            {experience.map((role) => (
              <li key={`${role.company}-${role.title}`}>
                <h3>{role.title}</h3>
                <p><strong>{role.company}</strong> · {role.location}</p>
                <p className="about__experience-period">{role.period}</p>
                <p>{role.description}</p>
                <ul>{role.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </li>
            ))}
          </ol>
        </Window>

        <Window title="Cloud experience" icon="☁️">
          <h3>{cloudExperience.title}</h3>
          <p><strong>{cloudExperience.organization}</strong> · {cloudExperience.period}</p>
          <ul className="about__goals">
            {cloudExperience.highlights.map((highlight) => <li key={highlight}>✔ {highlight}</li>)}
          </ul>
        </Window>

        <Window title="Interests & passions" icon="💛">
          <ul className="about__loves">
            {loves.map((l) => (
              <li key={l.text}><span aria-hidden="true">{l.icon}</span> {l.text}</li>
            ))}
          </ul>
        </Window>
      </div>
    </div>
  )
}
