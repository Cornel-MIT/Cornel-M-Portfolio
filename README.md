# Cornel Masuku - Portfolio (React + Vite)

80s/90s desktop-window aesthetic in a soft champagne palette.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Structure (feature-based)
```
src/
  app/App.jsx            routes
  shared/                reusable UI + layout + design tokens
    components/          Window, ProgressBar, Banner
    layout/              AppShell (title bar, nav, status bar)
    styles/              tokens.css (champagne palette), global.css
  features/
    dashboard/           home page: stats, top skills, latest project, clock
    about/               bio, journey, goals, interests (+ data.js)
    skills/              skill groups and tech stack (+ data.js)
    projects/            project cards and details dialog (+ data.js)
    contact/             mailto form and links
```
Each feature exposes its public API through `index.js`; edit the `data.js`
files to update your content. Replace the placeholder email and links in
`features/about/data.js` and `features/projects/data.js`.
