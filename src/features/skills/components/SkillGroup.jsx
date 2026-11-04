import {
  siAngular,
  siDotnet,
  siFigma,
  siFirebase,
  siGithub,
  siJavascript,
  siJira,
  siJson,
  siMongodb,
  siPostman,
  siPython,
  siReact,
  siRender,
  siTrello,
  siVercel,
  siTypescript,
} from 'simple-icons'
import ProgressBar from '../../../shared/components/ProgressBar.jsx'
import Window from '../../../shared/components/Window.jsx'
import { skillRatings } from '../data.js'

const skillIcons = {
  Python: { icon: siPython },
  'C#': { text: 'C#', color: '#68217a' },
  '.NET Core': { icon: siDotnet },
  JavaScript: { icon: siJavascript },
  TypeScript: { icon: siTypescript },
  React: { icon: siReact },
  'React Native': { icon: siReact },
  MongoDB: { icon: siMongodb },
  'SQL Server': { text: 'SQL', color: '#a91d22' },
  DynamoDB: { text: 'DDB', color: '#4053d6' },
  MariaDB: { text: 'Maria', color: '#003545' },
  Firebase: { icon: siFirebase },
  Git: { icon: siGithub },
  AWS: { text: 'AWS', color: '#ff9900' },
  Azure: { text: 'Az', color: '#0078d4' },
  Angular: { icon: siAngular },
  'CI/CD': { text: 'CI', color: '#1265ff' },
  Render: { icon: siRender },
  Vercel: { icon: siVercel },
  'Visual Studio': { text: 'VS', color: '#5c2d91' },
  'VS Code': { text: '><', color: '#007acc' },
  Figma: { icon: siFigma },
  Postman: { icon: siPostman },
  Trello: { icon: siTrello },
  Jira: { icon: siJira },
  'Salesforce (Ranger)': { text: 'SF', color: '#00a1e0' },
  'JSON Server': { icon: siJson },
  'REST APIs': { text: 'API', color: '#57dcff' },
}

export function SkillIcon({ name }) {
  const definition = skillIcons[name]
  if (!definition) return null

  if (definition.icon) {
    return (
      <svg className="skills__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={definition.icon.path} fill={`#${definition.icon.hex}`} />
      </svg>
    )
  }

  return <span className="skills__icon skills__icon--text" style={{ color: definition.color }} aria-hidden="true">{definition.text}</span>
}

export default function SkillGroup({ group }) {
  return (
    <Window title={group.title} icon={group.icon} className="skills__window">
      <ul className="skills__list">
        {group.items.map((s) => (
          <li key={s} className="skills__row">
            <span className="skills__label"><SkillIcon name={s} /><span>{s}</span></span>
            <ProgressBar value={skillRatings[s]} label={`${s} proficiency`} />
            <span className="skills__pct">{skillRatings[s]}%</span>
          </li>
        ))}
      </ul>
    </Window>
  )
}
