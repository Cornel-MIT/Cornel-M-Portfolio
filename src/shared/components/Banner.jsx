import './banner.css'

export default function Banner({ title, tagline, mascot = '🖥️', className = '' }) {
  return (
    <div className={`banner sunken ${className}`}>
      <div className="banner__grid" aria-hidden="true" />
      {mascot && <span className="banner__mascot" aria-hidden="true">{mascot}</span>}
      <div className="banner__text">
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>
    </div>
  )
}
