# Performance Optimization Guide

## Current Issues

The site is experiencing slow performance due to **very large image files**:
- Hero background: 2.7MB
- CTA background: 3.4MB  
- Service images: 3.7MB - 6.5MB each
- Total image size: ~27MB+

## Optimizations Applied

### 1. Code-Level Optimizations ✅
- Added `compressHTML: true` in Astro config
- Enabled CSS minification
- Added `loading="lazy"` to all below-the-fold images
- Added `decoding="async"` to all images
- Added `width` and `height` attributes to prevent layout shift
- Added preload hints for critical hero image
- Added DNS prefetch for external resources

### 2. Critical Next Steps (Required for Performance)

**IMPORTANT: You need to compress your images!**

The images are currently 2-6MB each, which is way too large. They should be:
- **Hero/CTA backgrounds**: 200-500KB max
- **Service images**: 100-300KB max
- **Portrait photos**: 50-150KB max

#### Option A: Use Online Tools (Quickest)
1. Go to https://squoosh.app/ or https://tinypng.com/
2. Upload each image
3. Compress to 70-80% quality
4. Download and replace in `public/images/`

#### Option B: Use ImageMagick (Command Line)
```bash
# Install ImageMagick first, then:
cd public/images
for img in *.jpg; do
  magick "$img" -quality 80 -resize 1920x1080> "$img"
done
```

#### Option C: Use Sharp (Node.js script)
Create `optimize-images.js`:
```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = './public/images';
const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

for (const file of files) {
  const inputPath = path.join(imagesDir, file);
  const outputPath = path.join(imagesDir, file);
  
  await sharp(inputPath)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(outputPath);
    
  console.log(`Optimized ${file}`);
}
```

## Expected Performance Improvements

After compressing images:
- **Before**: ~27MB total, 5-10 second load time
- **After**: ~2-3MB total, <2 second load time
- **Lighthouse Score**: Should improve from ~40 to ~90+

## Additional Recommendations

1. **Use WebP format** (better compression than JPEG)
   - Convert images to WebP format
   - Use `<picture>` element with fallback

2. **Implement responsive images**
   - Use `srcset` for different screen sizes
   - Serve smaller images on mobile

3. **Consider CDN**
   - Use a CDN for image delivery
   - Enable image optimization at CDN level

4. **Monitor Performance**
   - Use Chrome DevTools Network tab
   - Check Lighthouse scores
   - Monitor Core Web Vitals

## Quick Win: Compress Images Now

The fastest way to improve performance right now:

1. Visit https://squoosh.app/
2. Upload `hero-bg.jpg` → Set quality to 75% → Download
3. Upload `cta-bg.jpg` → Set quality to 75% → Download  
4. Upload all service images → Set quality to 75% → Download
5. Replace files in `public/images/`
6. Test: `npm run dev`

This alone should reduce load time by 70-80%!



