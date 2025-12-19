# Laajasalon Puunkaatopalvelu

Astro-based website for Laajasalon Puunkaatopalvelu - a tree felling service in Uusimaa, Finland.

## 🚀 Project Structure

```
/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/          # Add your images here
├── src/
│   ├── components/
│   │   ├── ContactForm.astro
│   │   ├── ContactInfo.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   └── ServiceCard.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro          # Front page
│       ├── palvelut.astro       # Services page
│       └── ota-yhteytta.astro   # Contact page
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📝 Required Images

You'll need to add the following images to `public/images/`:

- `hero-bg.jpg` - Hero section background (forest/trees)
- `pihapuiden-kaadot.jpg` - Garden tree felling service
- `puiden-hoitoleikkaukset.jpg` - Tree pruning service
- `puunkaadot-saaristossa.jpg` - Archipelago tree felling service
- `kantojyrsinta.jpg` - Stump grinding service
- `cta-bg.jpg` - CTA section background
- `ville-kulmala.jpg` - Portrait of Ville Kulmala
- `logo.png` - Company logo (for structured data)

## 🔍 SEO Features

- ✅ Sitemap generation (`@astrojs/sitemap`)
- ✅ Robots.txt
- ✅ Meta tags (Open Graph, Twitter Cards)
- ✅ Structured data (Schema.org LocalBusiness)
- ✅ Canonical URLs
- ✅ Semantic HTML
- ✅ Proper heading hierarchy
- ✅ Alt text for images

## 📧 Contact Form

The contact form currently uses a `mailto:` fallback. To implement a proper backend:

1. Create an API endpoint at `src/pages/api/contact.ts`
2. Update the form action in `ContactForm.astro`
3. Configure your email service (e.g., SendGrid, Mailgun, or a serverless function)

## 🌐 Deployment

The site can be deployed to:
- **Netlify** - Automatic deployments from Git
- **Vercel** - Automatic deployments from Git
- **Cloudflare Pages** - Automatic deployments from Git
- **Traditional hosting** - Upload the `dist/` folder after building

## 📄 License

Private project for Laajasalon Puunkaatopalvelu


