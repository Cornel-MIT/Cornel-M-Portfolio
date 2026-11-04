import './window.css'

export default function Window({ title, icon, onClose, className = '', children, ...rest }) {
  return (
    <section className={`window ${className}`} {...rest}>
      <header className="window__bar">
        <h2 className="window__title">
          {icon && <span aria-hidden="true">{icon}</span>} {title}
        </h2>
        {onClose && (
          <button className="window__close" onClick={onClose} aria-label={`Close ${title}`}>
            ×
          </button>
        )}
      </header>
      <div className="window__body">{children}</div>
    </section>
  )
}
