# Mohammad Faiz — Portfolio

Personal portfolio website showcasing cloud engineering expertise, open-source projects, and professional experience.

## Tech Stack

- **HTML5** — Semantic markup with SEO best practices
- **CSS3** — Custom design system with CSS variables, glassmorphism, and responsive breakpoints
- **Vanilla JavaScript** — Zero dependencies, GitHub API integration, scroll-driven animations

## Features

- Liquid glass design system with ambient background effects
- Real-time GitHub profile and repository data via public API
- Production-grade responsive design (360px to 4K)
- Accessibility support (`prefers-reduced-motion`, `prefers-contrast: high`)
- XSS-safe HTML rendering for external API data

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Mohammad-Faiz-Cloud-Engineer/Portfolio.git
cd Portfolio

# Serve locally (Python 3)
python3 -m http.server 8080

# Or use any static file server
npx serve .
```

Open `http://localhost:8080` in your browser.

## Project Structure

```
portfolio/
├── index.html          # Main HTML document
├── css/
│   └── style.css       # Complete design system and styles
├── js/
│   └── main.js         # Animations, GitHub API, interactions
├── .gitignore          # Repository hygiene rules
└── README.md           # This file
```

## Environment

No environment variables or API keys are required. The GitHub API is accessed via unauthenticated public endpoints (60 requests/hour rate limit).

## Deployment

This is a static site. Deploy to any static hosting provider:

- **GitHub Pages** — Push to `main` branch, enable Pages in repository settings
- **Vercel** — `vercel --prod`
- **Netlify** — Drag and drop the project folder

## License

Copyright 2026 Mohammad Faiz. All rights reserved.
