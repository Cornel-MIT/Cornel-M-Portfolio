import './progress.css'

export default function ProgressBar({ value, label }) {
  return (
    <div
      className="progress sunken"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="progress__fill" style={{ width: `${value}%` }} />
    </div>
  )
}
