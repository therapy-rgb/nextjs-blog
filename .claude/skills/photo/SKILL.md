---
name: photo
description: Convert images to web-optimized WebP for this project
argument-hint: <file-path> [destination-path]
---

# Photo Optimization for Web

Convert images to the optimal format and size for this Next.js project.

## Input

`$ARGUMENTS` is a path to an image file, optionally followed by the destination path inside `public/`. If no destination is given, save to `public/images/journal/`.

If no arguments are provided, ask the user for the file path.

## Output Format

This project uses **WebP** for all static images. The existing images in `public/images/journal/` are all WebP at quality 80.

## Steps

### 1. Inspect the source image

```bash
sips -g all <file> 2>/dev/null | head -20
ls -lh <file>
```

Report: filename, dimensions, file size, and format.

### 2. Convert and optimize

Apply these transformations using `sips` and `cwebp`:

1. **Convert color profile to sRGB** (required for correct browser rendering):
   ```bash
   sips --matchTo '/System/Library/ColorSync/Profiles/sRGB Profile.icc' <file> -o /tmp/<name>-srgb.png
   ```

2. **Resize** — constrain the longer dimension to **1200px** max, preserving aspect ratio:
   - Landscape (width >= height): `sips --resampleWidth 1200`
   - Portrait (height > width): `sips --resampleHeight 1200`
   - If both dimensions are already <= 1200, skip resizing.

3. **Convert to WebP** at quality 80:
   ```bash
   cwebp -q 80 /tmp/<name>-srgb.png -o <destination>/<name>.webp
   ```

4. **Clean up** temp files in `/tmp`.

### 3. Verify output

Show a before/after comparison:

| | Original | Optimized |
|---|---|---|
| **Size** | X MB | X KB |
| **Dimensions** | WxH | WxH |
| **Format** | PNG/JPG | WebP |

Display the optimized image using the Read tool so the user can confirm quality.

### 4. Report

Tell the user the output path and file size. If the image was placed in `public/images/journal/`, remind them to add it to the `postImages` map in `src/app/journal/page.tsx` if it should be associated with a journal entry.
