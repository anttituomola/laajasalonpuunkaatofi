# Image Migration Guide

## Understanding WordPress Image Sizes

WordPress automatically creates multiple sizes of each uploaded image:

- **Original**: `image.jpg` (or `.png`, etc.) - **USE THIS ONE**
- **Thumbnail**: `image-150x150.jpg` - Skip
- **Medium**: `image-300x300.jpg` - Skip
- **Large**: `image-1024x1024.jpg` - Skip
- **Custom sizes**: `image-800x600.jpg` - Skip

## Which Images to Use

✅ **Use the originals** (files without size suffixes like `-150x150`, `-300x300`, etc.)

### How to Identify Originals

**Method 1: File naming pattern**
- Original: `pihapuiden-kaadot.jpg`
- Resized: `pihapuiden-kaadot-300x200.jpg`, `pihapuiden-kaadot-1024x768.jpg`

**Method 2: File size**
- Originals are usually the largest files
- Sort by file size and pick the largest for each image

**Method 3: WordPress Media Library**
- In WordPress admin, check the "Full Size" dimensions
- Download the full-size version

## Required Images for This Site

You only need **8 images** total:

1. `hero-bg.jpg` - Hero section background
2. `pihapuiden-kaadot.jpg` - Garden tree felling
3. `puiden-hoitoleikkaukset.jpg` - Tree pruning
4. `puunkaadot-saaristossa.jpg` - Archipelago tree felling
5. `kantojyrsinta.jpg` - Stump grinding
6. `cta-bg.jpg` - CTA section background
7. `ville-kulmala.jpg` - Portrait photo
8. `logo.png` - Logo (optional)

## Quick Steps

1. **Find originals** in WordPress uploads folder
   - Look for files WITHOUT size suffixes (`-150x150`, `-300x300`, etc.)
   - Or download "Full Size" from WordPress Media Library

2. **Rename if needed** to match the filenames above

3. **Copy to** `public/images/` folder in this project

4. **Optimize (optional)** - Use tools like:
   - [Squoosh](https://squoosh.app/) - Online image optimizer
   - [ImageOptim](https://imageoptim.com/) - Mac app
   - [TinyPNG](https://tinypng.com/) - Online service

## Image Optimization Tips

- **Hero backgrounds**: Can be larger (1920px wide is fine)
- **Service images**: 800-1200px wide is sufficient
- **Portrait photos**: 600-800px wide is enough
- **Format**: Use `.jpg` for photos, `.png` for logos/transparency
- **Compression**: Aim for 80-90% quality to reduce file size

## Example: Finding the Right Image

If you see these files in WordPress uploads:
```
pihapuiden-kaadot.jpg          ← USE THIS (original)
pihapuiden-kaadot-150x150.jpg  ← Skip (thumbnail)
pihapuiden-kaadot-300x200.jpg  ← Skip (medium)
pihapuiden-kaadot-1024x768.jpg ← Skip (large)
```

Copy only `pihapuiden-kaadot.jpg` to `public/images/`

## Troubleshooting

**Can't find originals?**
- Check WordPress Media Library → Click image → Download "Full Size"
- Or look for files with the largest dimensions in the uploads folder

**Images too large?**
- Use an image optimizer before adding to the project
- Modern browsers handle large images well, but smaller = faster loading

**Wrong aspect ratio?**
- The CSS will crop/resize images automatically
- If images look wrong, we can adjust the CSS


