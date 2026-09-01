# Portfolio

My personal portfolio website built with React, Vite, and Tailwind CSS.

🌐 **Live Site**: https://ghostalex07.github.io/Portfolio/


## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animations | GSAP + Motion |
| Icons | Phosphor Icons |
| Language | TypeScript |

## 📋 Available Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type check |

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── App.tsx                  # Main app
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles & theme
│   ├── hooks/
│   │   └── useGSAP.ts           # GSAP + ScrollTrigger hook
│   └── components/
│       ├── Navbar.tsx           # Sticky nav with active section
│       ├── Hero.tsx             # Hero + status card
│       ├── About.tsx            # Intro + education
│       ├── Experience.tsx       # Timeline
│       ├── Skills.tsx           # Skill pills
│       ├── Projects.tsx         # Live GitHub repos
│       ├── Certifications.tsx   # Featured + carousel
│       ├── BackToTop.tsx        # Scroll to top
│       └── Footer.tsx
├── public/                      # Static assets (favicon, robots.txt, ai.txt, 404)
├── package.json
└── vite.config.ts
```

## 🔧 Deployment

Automatically deploys to GitHub Pages via GitHub Actions on push to main.

---

*Author: Alejandro Blanco*
