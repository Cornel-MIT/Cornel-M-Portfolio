export default function DesktopIcons({ onOpenSettings, onOpenJourney }) {
  return (
    <div className="desktop-icons" role="group" aria-label="Desktop shortcuts">
      <button className="desktop-icon desktop-icon__journey" type="button" onClick={onOpenJourney}>
        <span aria-hidden="true">📁</span>
        <span className="desktop-icon__label">Journey</span>
      </button>
      <a className="desktop-icon desktop-icon__cv" href="/Cornel-Masuku-CV.html" download="Cornel-Masuku-CV.html" aria-label="Download Cornel Masuku's CV">
        <span aria-hidden="true">📄</span>
        <span className="desktop-icon__label">Download CV</span>
      </a>
      <div className="desktop-icon" role="img" aria-label="Recycle Bin, empty" title="Recycle Bin">
        <span className="desktop-icon__trash" aria-hidden="true">
          <span className="desktop-icon__trash-handle" />
          <span className="desktop-icon__trash-lid" />
          <span className="desktop-icon__trash-can"><span>♻</span></span>
        </span>
        <span className="desktop-icon__label">Recycle Bin</span>
      </div>
      <button className="desktop-icon desktop-icon__settings" type="button" onClick={onOpenSettings}>
        <span className="desktop-icon__gear" aria-hidden="true">⚙</span>
        <span className="desktop-icon__label">Settings</span>
      </button>
    </div>
  )
}
