# Favicon Assets - Instructions

This directory needs favicon files for proper branding and SEO.

## Required Files

Create the following favicon files and place them in the `/public` directory:

### 1. favicon.ico (32x32 or 16x16)
- Standard browser favicon
- ICO format
- Shows in browser tabs and bookmarks

### 2. favicon-16x16.png
- 16x16 pixels
- PNG format
- Small browser icon

### 3. favicon-32x32.png
- 32x32 pixels
- PNG format
- Standard browser icon

### 4. apple-touch-icon.png
- 180x180 pixels
- PNG format
- Used when users add to iOS home screen
- Should have rounded corners (iOS adds the rounding)

### 5. favicon-192x192.png
- 192x192 pixels
- PNG format
- Android icon (Chrome)
- Used for "Add to Home Screen" on Android

### 6. favicon-512x512.png
- 512x512 pixels
- PNG format
- Android icon (high-res)
- Used for splash screens and app icons

### 7. og-image.png (Optional but recommended)
- 1200x630 pixels
- PNG or JPG format
- Used when sharing on Facebook, LinkedIn, Slack
- Should contain: App name, tagline, key visual

### 8. twitter-image.png (Optional but recommended)
- 1200x675 pixels (or use same as og-image)
- PNG or JPG format
- Used when sharing on Twitter/X
- 2:1 aspect ratio preferred

## Design Guidelines

**Brand Colors (from your app):**
- Primary: #8b5cf6 (purple)
- Background: #0a0a0a (dark)
- Use these in your favicon design for consistency

**Icon Design Tips:**
1. Keep it simple - favicons are tiny
2. Use strong contrast for visibility
3. Consider a letter "F" or financial symbol (💰, 📊, 🔒)
4. Make it recognizable at 16x16 pixels
5. Test on both light and dark browser themes

## How to Create

### Option 1: Online Generator (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload a 512x512 PNG of your logo/icon
3. Customize settings for different platforms
4. Download the generated files
5. Replace files in `/public`

### Option 2: Design Tool
1. Design in Figma, Sketch, or Adobe Illustrator
2. Create a 512x512 base design
3. Export at different sizes listed above
4. Use online tools or ImageMagick to create .ico file

### Option 3: Quick Placeholder
If you need a quick placeholder, you can use an emoji or letter:

```bash
# Using ImageMagick (if installed)
convert -size 512x512 xc:#8b5cf6 -gravity center -pointsize 360 -fill white -annotate +0+0 "F" favicon-512x512.png
```

## Current Status

The app is currently referencing these files in `index.html`:
- `/favicon.ico`
- `/favicon-16x16.png`
- `/favicon-32x32.png`
- `/apple-touch-icon.png`
- `/favicon-192x192.png`
- `/favicon-512x512.png`
- `/og-image.png`
- `/twitter-image.png`

**Replace the existing `/public/vite.svg` with proper branded favicons.**

## After Creating Favicons

1. Place all files in `/public` directory
2. Test by running `npm run dev` and checking browser tab
3. Test "Add to Home Screen" on mobile devices
4. Test social media sharing preview with:
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

**Need help?** Search for "favicon generator" or use the RealFaviconGenerator link above.
