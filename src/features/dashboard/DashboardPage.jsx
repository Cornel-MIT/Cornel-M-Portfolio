import { Link } from 'react-router-dom'
import Banner from '../../shared/components/Banner.jsx'
import Window from '../../shared/components/Window.jsx'
import { profile, journey, certifications } from '../about/data.js'
import { allSkills } from '../skills'
import { projects } from '../projects'
import StatCard from './components/StatCard.jsx'
import SystemClock from './components/SystemClock.jsx'
import '../projects/projects.css'
import './dashboard.css'

const START_YEAR = Number(journey[0].year)

export default function DashboardPage() {
  const topSkills = allSkills.slice(0, 5)
  const featured = projects.find((project) => project.id === 'momakit-mobile') ?? projects[0]

  return (
    <div className="page">
      <Banner title={`Welcome, I'm ${profile.name}`} tagline={profile.headline} mascot={null} className="banner--headphones" />

      <div className="dash__stats">
        <StatCard icon="⌨️" value={`${new Date().getFullYear() - START_YEAR}+`} label="Years in tech" />
        <StatCard icon="📁" value={projects.length} label="Projects" />
        <StatCard icon="⚙️" value={allSkills.length} label="Skills tracked" />
        <StatCard icon="🏅" value={certifications.length} label="Certifications" />
      </div>

      <div className="grid-2">
        <Window title="Top skills" icon="🏆">
          <ul className="dash__skills">
            {topSkills.map((skill) => (
              <li key={skill}>
                <span>{skill}</span>
                <span className="dash__skill-tag">Listed</span>
              </li>
            ))}
          </ul>
          <Link className="btn" to="/skills">See all skills</Link>
        </Window>

        <Window title="Latest project" icon={featured.icon}>
          <div className="dash__project">
            <div className={`project__cover sunken${featured.images?.length ? ' project__cover--image' : ''}`} aria-hidden="true">
              {featured.images?.length ? <img src={featured.images[0].src} alt="" /> : featured.cover}
            </div>
            <h3>{featured.name}</h3>
            <p>{featured.summary}</p>
            <Link className="btn btn--primary" to="/projects">Browse projects</Link>
          </div>
        </Window>

        <Window title="Journey so far" icon="⭐">
          <ul className="dash__journey">
            {journey.slice(-3).map((j) => (
              <li key={j.year}><strong>{j.year}</strong> {j.text}</li>
            ))}
          </ul>
          <Link className="btn" to="/about">Read my story</Link>
        </Window>

        <Window title="System status" icon="🕹️">
          <SystemClock />
          <Link className="btn btn--primary dash__cta" to="/contact">Start a conversation</Link>
        </Window>
      </div>
    </div>
  )
}
