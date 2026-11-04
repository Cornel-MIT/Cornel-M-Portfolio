import Window from '../../../shared/components/Window.jsx'

export default function ProjectCard({ project, onDetails }) {
  return (
    <Window title={project.name} icon={project.icon} className="project">
      <span className={`project__status${project.status === 'In progress' ? ' is-in-progress' : ''}`}>{project.status}</span>
      <div className={`project__cover sunken${project.images?.length ? ' project__cover--image' : ''}`} aria-hidden="true">
        {project.images?.length ? <img src={project.images[0].src} alt="" /> : project.cover}
      </div>
      <p>{project.summary}</p>
      <ul className="project__stack">
        {project.stack.map((s) => <li key={s} className="chip">{s}</li>)}
      </ul>
      <div className="project__actions">
        <button className="btn" onClick={() => onDetails(project)}>🔍 View details</button>
        {project.repoUrl && <a className="btn btn--primary" href={project.repoUrl} target="_blank" rel="noreferrer">View code</a>}
        {project.videoUrl && <a className="btn btn--primary" href={project.videoUrl} target="_blank" rel="noreferrer">Watch demo</a>}
      </div>
    </Window>
  )
}
