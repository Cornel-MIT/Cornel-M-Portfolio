import { useEffect, useState } from 'react'

export default function SystemClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="clock sunken">
      <div className="clock__time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div className="clock__status">● Available for new projects</div>
    </div>
  )
}
