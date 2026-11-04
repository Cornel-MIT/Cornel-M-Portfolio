import { useEffect, useRef, useState } from 'react'
import { siGithub } from 'simple-icons'
import { profile, experience, education, certifications, interests } from '../../features/about/data.js'
import { skillGroups } from '../../features/skills/data.js'
import { projects } from '../../features/projects/data.js'
import './one-page.css'

const sections = [
  { id: 'one-page-home', label: 'Home' },
  { id: 'one-page-about', label: 'About' },
  { id: 'one-page-skills', label: 'Skills' },
  { id: 'one-page-projects', label: 'Projects' },
  { id: 'one-page-experience', label: 'Experience' },
  { id: 'one-page-education', label: 'Education' },
  { id: 'one-page-certifications', label: 'Certifications' },
  { id: 'one-page-interests', label: 'Interests' },
  { id: 'one-page-contact', label: 'Contact' },
]

const capabilityDescriptions = {
  'languages-frameworks': 'Languages and frameworks used across full-stack and mobile development.',
  'cloud-devops': 'Cloud platforms, deployment services, and delivery practices from project work and training.',
  databases: 'Relational and NoSQL database technologies used in application development.',
  'tools-apis': 'Development, design, collaboration, and API tools.',
  other: 'Additional platforms and tools.',
}
const capabilities = skillGroups.map((group) => ({
  icon: group.icon,
  title: group.title,
  description: capabilityDescriptions[group.id],
  tools: group.items,
}))

function BrandIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  )
}

export default function OnePagePortfolio({ onClose }) {
  const [closing, setClosing] = useState(false)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0)
  const [projectDirection, setProjectDirection] = useState('next')
  const closeTimer = useRef(null)
  const activeProject = projects[activeProjectIndex]
  const activeScreenshot = activeProject.images?.[activeScreenshotIndex]

  const closeView = () => {
    if (closing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose()
      return
    }
    setClosing(true)
    closeTimer.current = window.setTimeout(onClose, 420)
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeView()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  useEffect(() => {
    const root = document.querySelector('.one-page-view')
    if (!root || !('IntersectionObserver' in window)) {
      root?.querySelectorAll('.one-page-reveal').forEach((section) => section.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting))
    }, { root, threshold: 0.12 })
    const sections = root.querySelectorAll('.one-page-reveal')
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (event, id) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectProject = (index, direction) => {
    setProjectDirection(direction)
    setActiveScreenshotIndex(0)
    setActiveProjectIndex((index + projects.length) % projects.length)
  }

  return (
    <div className={`one-page-view${closing ? ' is-closing' : ''}`}>
      <header className="one-page-header">
        <a className="one-page-brand" href="#one-page-home" onClick={(event) => scrollToSection(event, 'one-page-home')}>
          {profile.name}
        </a>
        <nav className="one-page-nav" aria-label="One-page portfolio sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={(event) => scrollToSection(event, section.id)}>
              {section.label}
            </a>
          ))}
        </nav>
        <button className={`one-page-close${closing ? ' is-spinning' : ''}`} type="button" onClick={closeView} aria-label="Close one-page view" title="Return to desktop">×</button>
      </header>

      <main className="one-page-content">
        <section className="one-page-hero one-page-reveal" id="one-page-home">
          <p className="one-page-eyebrow">&gt; {profile.headline}</p>
          <h1>Portfolio</h1>
          <div className="one-page-identity">
            <div>
              <p className="one-page-label">$ Full name</p>
              <h2>{profile.name}</h2>
              <p className="one-page-intro">{profile.bio[0]}</p>
            </div>
            <div className="one-page-socials" aria-label="Contact links">
              <a href={`mailto:${profile.email}`} aria-label="Email Cornel" title="Email"><span aria-hidden="true">✉</span></a>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><BrandIcon icon={siGithub} /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><span className="one-page-linkedin" aria-hidden="true">in</span></a>
            </div>
          </div>
        </section>

        <section className="one-page-section one-page-about one-page-reveal" id="one-page-about">
          <div className="one-page-section-heading"><span>01 / Profile</span><h2>About</h2></div>
          <div className="one-page-about__grid">
            <div className="one-page-copy">{profile.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <blockquote>“{profile.headline}.”<span>// A working principle</span></blockquote>
          </div>
        </section>

        <section className="one-page-section one-page-reveal" id="one-page-skills">
          <div className="one-page-section-heading"><span>02 / Capabilities</span><h2>Skills</h2></div>
          <div className="one-page-skill-grid">
            {capabilities.map((capability) => (
              <article className="one-page-skill" key={capability.title}>
                <span className="one-page-icon" aria-hidden="true">{capability.icon}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul>{capability.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="one-page-section one-page-reveal" id="one-page-projects">
          <div className="one-page-section-heading"><span>03 / Selected work</span><h2>Projects</h2></div>
          <div className="one-page-project-showcase" aria-live="polite">
            <article className={`one-page-project-slide is-${projectDirection}`} key={activeProject.id}>
              <div className="one-page-project-slide__details">
                <p className="one-page-project__number">PROJECT 0{activeProjectIndex + 1} / 0{projects.length}</p>
                <h3>{activeProject.name}</h3>
                <span className="one-page-project__status" data-status={activeProject.status}>{activeProject.status}</span>
                <p>{activeProject.summary}</p>
                <ul>{activeProject.stack.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="one-page-project-slide__preview">
                {activeScreenshot ? (
                  <div className="one-page-screenshot-viewer">
                    <figure className="one-page-screenshot-main">
                      <img src={activeScreenshot.src} alt={activeScreenshot.alt} />
                      <figcaption>{activeScreenshot.caption}</figcaption>
                    </figure>
                    {activeProject.images.length > 1 && (
                      <div className="one-page-screenshot-thumbnails" role="group" aria-label={`${activeProject.name} screenshots`}>
                        {activeProject.images.map((image, index) => (
                          <button
                            key={image.src}
                            type="button"
                            className={index === activeScreenshotIndex ? 'is-active' : ''}
                            aria-label={`Show ${image.caption} screenshot`}
                            aria-pressed={index === activeScreenshotIndex}
                            onClick={() => setActiveScreenshotIndex(index)}
                          >
                            <img src={image.src} alt="" loading="lazy" />
                            <span>{image.caption}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="one-page-screenshot-empty" aria-label={`${activeProject.name} preview unavailable`}>
                    <span aria-hidden="true">{activeProject.cover}</span>
                    <strong>{activeProject.name}</strong>
                  </div>
                )}
              </div>
            </article>
            <div className="one-page-project-controls">
              <button type="button" className="one-page-project-arrow" onClick={() => selectProject(activeProjectIndex - 1, 'previous')} aria-label="Previous project">←</button>
              <div className="one-page-project-dots" role="tablist" aria-label="Select a project">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    className={index === activeProjectIndex ? 'is-active' : ''}
                    role="tab"
                    aria-label={`Show ${project.name}`}
                    aria-selected={index === activeProjectIndex}
                    onClick={() => selectProject(index, index >= activeProjectIndex ? 'next' : 'previous')}
                  />
                ))}
              </div>
              <button type="button" className="one-page-project-arrow" onClick={() => selectProject(activeProjectIndex + 1, 'next')} aria-label="Next project">→</button>
            </div>
          </div>
        </section>

        <section className="one-page-section one-page-reveal" id="one-page-experience">
          <div className="one-page-section-heading"><span>04 / Work history</span><h2>Experience</h2></div>
          <ol className="one-page-timeline">
            {experience.map((item, index) => (
              <li className="one-page-experience-card" key={`${item.company}-${item.title}`} tabIndex={0}>
                <div className="one-page-experience-card__meta">
                  <span className="one-page-timeline__index">MILESTONE 0{index + 1}</span>
                  <strong>{item.period}</strong>
                  <span className="one-page-experience-card__marker" aria-hidden="true">&lt;/&gt;</span>
                </div>
                <div className="one-page-experience-card__content">
                  <h3>{item.title}</h3>
                  <p>{item.company} · {item.location}</p>
                  <p>{item.description}</p>
                  <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="one-page-section one-page-education one-page-reveal" id="one-page-education">
          <div className="one-page-section-heading"><span>05 / Academic</span><h2>Education</h2></div>
          <div className="one-page-education-grid">
            {education.map((item) => (
              <article className="one-page-education-card" key={item.id}>
                <span className="one-page-icon" aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3>
                <p className="one-page-credential-issuer">{item.institution}</p>
                <p className="one-page-credential-date">{item.period}</p>
                <p className="one-page-credential-location"><span aria-hidden="true">⌖</span> {item.location}</p>
                <p className="one-page-credential-description">{item.description}</p>
                <ul className="one-page-credential-tags">{item.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="one-page-section one-page-reveal" id="one-page-certifications">
          <div className="one-page-section-heading"><span>06 / Recognition</span><h2>Certifications</h2></div>
          <div className="one-page-certification-grid">
            {certifications.map((item) => (
              <article className="one-page-certification-card" key={`${item.title}-${item.issuer}`}>
                <span className="one-page-icon" aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.issuer}</p>
                <time>{item.date}</time>
              </article>
            ))}
          </div>
        </section>

        <section className="one-page-section one-page-reveal" id="one-page-interests">
          <div className="one-page-section-heading"><span>&gt; Interests &amp; passions</span></div>
          <ul className="one-page-interest-list">
            {interests.map((interest) => <li key={interest}>#{interest}</li>)}
          </ul>
        </section>

        <section className="one-page-contact one-page-reveal" id="one-page-contact">
          <p className="one-page-eyebrow">&gt; Let’s build something together</p>
          <blockquote className="one-page-contact__quote">“Great things happen when talented people choose to collaborate — let’s build something worth remembering.”</blockquote>
          <div className="one-page-contact__channels" aria-label="Contact Cornel">
            <a className="one-page-contact__email" href={`mailto:${profile.email}`}><span aria-hidden="true">✉</span> {profile.email}</a>
            <div className="one-page-contact__socials" aria-label="Social profiles">
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><BrandIcon icon={siGithub} /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><span aria-hidden="true">in</span></a>
              <a href={`mailto:${profile.email}`} aria-label="Email Cornel" title="Email"><span aria-hidden="true">✉</span></a>
            </div>
          </div>
          <div className="one-page-contact__lower">
            <span className="one-page-contact__watermark" aria-hidden="true">{profile.name.toUpperCase()}</span>
            <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>Built with care and curiosity</span></footer>
          </div>
        </section>
      </main>
    </div>
  )
}
