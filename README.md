# personal-portfolio

A modern, multilingual personal portfolio website built with Next.js, Tailwind CSS, and i18next. Use this as a template to build your own portfolio site.

## Features

- 🎨 Modern, clean design with Tailwind CSS
- 🌐 Full i18n support (English / 中文)
- 📱 Fully responsive
- ⚡ Static export for GitHub Pages
- 🚀 Built with Next.js 14 App Router

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files
npm run export
```

## Deploy to GitHub Pages

1. Create a new repository named `your-username.github.io` on GitHub
2. Push this code to the repository
3. Go to repository Settings → Pages
4. Set source to "GitHub Actions" or "main branch /docs folder"
5. If using static export:
   ```bash
   npm run export
   # The output will be in the `out` folder
   # Push the contents of `out` to gh-pages branch or docs folder
   ```

## Content

The portfolio showcases:
- Hero section with introduction
- About Me with education background
- Internship Experience (4 positions)
- Research Projects (LLM-based momentum strategy, investor sentiment, etc.)
- Skills & Certifications (Programming, Data Tools, Finance, CPA, etc.)
- Contact information

## Customization

- Update personal information in `app/page.tsx`
- Add your resume PDF to the `public` folder
- Modify translations in `i18n.js`
- Adjust colors in `tailwind.config.js`

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- i18next
- Lucide React (icons)

## License

MIT - Feel free to use this template for your own portfolio!
