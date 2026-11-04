export default function StatCard({ icon, value, label }) {
  return (
    <div className="stat raised">
      <span className="stat__icon" aria-hidden="true">{icon}</span>
      <strong className="stat__value">{value}</strong>
      <span>{label}</span>
    </div>
  )
}
