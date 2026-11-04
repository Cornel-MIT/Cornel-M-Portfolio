import Banner from '../../shared/components/Banner.jsx'
import Window from '../../shared/components/Window.jsx'
import SkillGroup, { SkillIcon } from './components/SkillGroup.jsx'
import { skillGroups, allSkills, techStack } from './data.js'
import './skills.css'

export default function SkillsPage() {
  return (
    <div className="page">
      <Banner title="My Skills" tagline="Turning knowledge into powerful solutions…" mascot={null} />
      <div className="skills__layout">
        <div className="grid-2">
          {skillGroups.map((g) => <SkillGroup key={g.id} group={g} />)}
        </div>
        <Window title="Tech stack" icon="🏆" className="skills__window skills__stack-window">
          <ul className="skills__stack">
            {techStack.map((skill) => (
              <li key={skill}>
                <SkillIcon name={skill} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
          <p className="skills__note">⭐ Always learning...<br />Always building!</p>
        </Window>
      </div>
    </div>
  )
}
