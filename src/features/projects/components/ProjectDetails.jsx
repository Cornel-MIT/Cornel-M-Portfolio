import { useEffect } from 'react'
import Window from '../../../shared/components/Window.jsx'

export default function ProjectDetails({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={project.name} onClick={(e) => e.stopPropagation()}>
        <Window title={project.name} icon={project.icon} onClose={onClose}>
          <p><strong>Status:</strong> {project.status}</p>
          <p>{project.details}</p>
          {project.stack.length > 0 && <p><strong>Built with:</strong> {project.stack.join(', ')}</p>}
          {project.images?.length > 0 && (
            <div className="project__screenshots" aria-label={`${project.name} screenshots`}>
              {project.images.map((image) => (
                <figure key={image.src}>
                  <img src={image.src} alt={image.alt} />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
          {project.repoUrl && <a className="btn btn--primary" href={project.repoUrl} target="_blank" rel="noreferrer">View code</a>}
          {project.videoUrl && <a className="btn btn--primary" href={project.videoUrl} target="_blank" rel="noreferrer">Watch demo</a>}
        </Window>
      </div>
    </div>
  )
}
