# Migration Guide: WordPress to Astro

## ✅ Completed Setup

The Astro project structure has been created with:

1. **Project initialization** - Astro with TypeScript (strict mode)
2. **SEO configuration** - Sitemap, robots.txt, meta tags, structured data
3. **Base components** - Header, Footer, Hero, ContactForm, ServiceCard, ContactInfo
4. **All three pages** - Front page, Services page, Contact page
5. **Responsive styling** - Mobile-first CSS approach
6. **Dependencies installed** - Ready to run

## 📋 Next Steps

### 1. Add Images

Download images from your WordPress site and add them to `public/images/`:

**Required images:**
- `hero-bg.jpg` - Hero section background (forest/trees looking up)
- `pihapuiden-kaadot.jpg` - Person felling tree in snow
- `puiden-hoitoleikkaukset.jpg` - Person climbing tree with safety gear
- `puunkaadot-saaristossa.jpg` - Sunset over lake/archipelago
- `kantojyrsinta.jpg` - Tree stumps close-up
- `cta-bg.jpg` - Blurred forest/birch trees
- `ville-kulmala.jpg` - Portrait of Ville Kulmala
- `logo.png` - Company logo (optional, for structured data)

**How to get images from WordPress:**
- Via cPanel File Manager: Navigate to `wp-content/uploads/` and download images
- Via WordPress Admin: Media Library → Download images
- Or use FTP to access the uploads folder

**Important:** WordPress creates multiple sizes of each image. You only need the **originals** (files without size suffixes like `-150x150`, `-300x300`). See `IMAGE_MIGRATION_GUIDE.md` for detailed instructions.

### 2. Test the Site Locally

```bash
npm run dev
```

Visit `http://localhost:4321` and verify:
- All pages load correctly
- Navigation works
- Images display (after adding them)
- Contact form appears
- Responsive design works on mobile

### 3. Customize Content

Review each page and ensure all content matches your WordPress site:
- `src/pages/index.astro` - Front page content
- `src/pages/palvelut.astro` - Services page content
- `src/pages/ota-yhteytta.astro` - Contact page content

### 4. Set Up Contact Form Backend

Currently, the contact form uses a `mailto:` fallback. To implement a proper backend:

**Option A: Serverless Function (Recommended)**
Create `src/pages/api/contact.ts`:
```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  // Send email via your service (SendGrid, Mailgun, etc.)
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
```

**Option B: Third-party Service**
- Use Formspree, Netlify Forms, or similar
- Update form action in `ContactForm.astro`

### 5. Build and Deploy

**Build for production:**
```bash
npm run build
```

The output will be in the `dist/` folder.

**Deployment options:**

1. **Netlify** (Recommended)
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Netlify will auto-deploy on push

2. **Vercel**
   - Connect your Git repository
   - Framework preset: Astro
   - Auto-detects settings

3. **Traditional Hosting**
   - Upload contents of `dist/` folder to your web server
   - Ensure server supports static files

### 6. Domain Configuration

After deployment:
1. Point your domain to the new hosting
2. Update DNS settings if needed
3. Configure SSL certificate (usually automatic on Netlify/Vercel)

### 7. SEO Verification

After going live, verify:
- [ ] Google Search Console - Submit sitemap
- [ ] Test structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify meta tags with [Open Graph Debugger](https://www.opengraph.xyz/)
- [ ] Check mobile-friendliness with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

## 🔍 SEO Features Included

- ✅ Automatic sitemap generation
- ✅ Robots.txt configured
- ✅ Meta tags (title, description, Open Graph, Twitter Cards)
- ✅ Structured data (Schema.org LocalBusiness)
- ✅ Canonical URLs
- ✅ Semantic HTML5
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Alt text placeholders for images
- ✅ Finnish language (`lang="fi"`)

## 📝 Content Extraction Checklist

From your WordPress site, verify you have:

- [x] All page content (already added)
- [ ] All images (need to download)
- [ ] Social media links (Facebook, Instagram URLs)
- [ ] Any additional pages (privacy policy, etc.)

## 🎨 Design Notes

The site uses:
- **Primary color**: `#2d5016` (dark green)
- **Text color**: `#333` (dark grey)
- **Background**: `#fff` (white) and `#f5f5f5` (light grey)
- **Font**: System fonts (system-ui, -apple-system, sans-serif)

Colors match the original WordPress site based on the screenshots.

## 🐛 Troubleshooting

**Images not showing?**
- Ensure images are in `public/images/` folder
- Check image filenames match exactly (case-sensitive)
- Verify image paths in components

**Build errors?**
- Run `npm install` again
- Check TypeScript errors: `npm run build`
- Verify all imports are correct

**Contact form not working?**
- Check browser console for errors
- Verify form action URL
- Test mailto fallback first

## 📞 Support

If you need help:
1. Check Astro docs: https://docs.astro.build
2. Review component files for examples
3. Test locally before deploying

