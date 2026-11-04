import { HashRouter, Routes, Route } from 'react-router-dom'
import AppShell from '../shared/layout/AppShell.jsx'
import { DashboardPage } from '../features/dashboard'
import { AboutPage } from '../features/about'
import { SkillsPage } from '../features/skills'
import { ProjectsPage } from '../features/projects'
import { ContactPage } from '../features/contact'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
