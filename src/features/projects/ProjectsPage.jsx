import { useState } from 'react'
import Banner from '../../shared/components/Banner.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import ProjectDetails from './components/ProjectDetails.jsx'
import { projects } from './data.js'
import './projects.css'

export default function ProjectsPage() {
  const [active, setActive] = useState(null)

  return (
    <div className="page">
      <Banner title="My Projects" tagline="Turning ideas into reality…" mascot={null} />
      <div className="grid-3">
        {projects.map((p) => <ProjectCard key={p.id} project={p} onDetails={setActive} />)}
      </div>
      {active && <ProjectDetails project={active} onClose={() => setActive(null)} />}
    </div>
  )
}
