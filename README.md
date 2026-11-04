# Building a Windows Desktop Experience

An 80s/90s-inspired vibe with modern features that keep the experience fresh.

A personal portfolio for Cornel Masuku, a full-stack developer and AWS Certified Cloud Practitioner based in Johannesburg, South Africa. It presents his background, technical skills, professional experience, education, certifications, and selected application projects.

The interface is inspired by 80s and 90s desktop computers. Visitors can explore the portfolio through its windowed desktop experience or switch to a single-page view. The project gallery includes screenshots and details for Aktive60, WeLinkUp, Career Buddy, and N2te. The desktop also includes a downloadable CV, and the settings allow visitors to change the color theme and other appearance options.

## Features
- Dashboard with portfolio overview and featured WeLinkUp project
- About section with professional experience, cloud training, education, and interests
- Skills section with skill ratings and grouped technology stack
- Project cards with status, descriptions, screenshots, and available demo links
- Contact page with social links and an email-based message form
- Responsive desktop-style interface, theme palettes, and single-page portfolio mode
- Downloadable CV at `public/Cornel-Masuku-CV.html`

## Built With
React, React Router, Vite, and CSS.

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
  shared/                reusable UI, layout, and design tokens
    components/          Window, ProgressBar, Banner
    layout/              desktop shell, taskbar, settings, one-page view
    styles/              theme tokens and global styles
  features/
    dashboard/           overview, featured project, and system clock
    about/               profile, experience, education, and interests
    skills/              skill groups and tech stack
    projects/            project cards, status, and screenshot galleries
    contact/             contact form and social links
```

## Updating Content
Edit `src/features/about/data.js` for profile, experience, education, and certification details; `src/features/skills/data.js` for skills; and `src/features/projects/data.js` for project descriptions, statuses, screenshots, and demo links. Place image assets in `public/images/` and reference them with paths beginning `/images/`.
