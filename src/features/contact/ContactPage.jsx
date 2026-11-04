import { useState } from 'react'
import Banner from '../../shared/components/Banner.jsx'
import Window from '../../shared/components/Window.jsx'
import { profile } from '../about'
import './contact.css'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // No backend: opens the visitor's email app with the message pre-filled.
  const send = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\nReply to: ${form.email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="page">
      <Banner title="Contact" tagline="Got an idea? Let's build it together." mascot="📬" />
      <div className="contact__layout">
        <Window title="New message" icon="✉️">
          <form className="contact__form" onSubmit={send}>
            <label>Your name<input className="sunken" name="name" value={form.name} onChange={update} required /></label>
            <label>Your email<input className="sunken" type="email" name="email" value={form.email} onChange={update} required /></label>
            <label>Message<textarea className="sunken" name="message" rows="5" value={form.message} onChange={update} required /></label>
            <button className="btn btn--primary" type="submit">Send message</button>
          </form>
        </Window>
        <Window title="Find me online" icon="🌐">
          <ul className="contact__links">
            <li><a className="btn" href={`mailto:${profile.email}`}>📧 {profile.email}</a></li>
            <li><a className="btn" href={profile.github} target="_blank" rel="noreferrer">🐙 GitHub</a></li>
            <li><a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">💼 LinkedIn</a></li>
          </ul>
        </Window>
      </div>
    </div>
  )
}
