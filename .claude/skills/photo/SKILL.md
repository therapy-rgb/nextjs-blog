---
name: photo
description: Convert high-resolution images to web-optimized format
disable-model-invocation: true
argument-hint: <file-or-folder-path>
---

# Photo Optimization for Web

Convert high-resolution photos to web-appropriate format and size.

## Input

$ARGUMENTS should be a path to a single image file or a folder of images. If no argument is provided, ask the user for the path.

## Steps

### 1. Inspect the source image(s)

For each image, run:
```bash
sips -g all <file> 2>/dev/null | head -20
ls -lh <file>
```
Report to the user: filename, dimensions, file size, color profile, and format.

### 2. Determine destination

Ask the user where the photo(s) will be used:
- **Sanity CMS** (e.g., Notes page, blog posts) — output optimized JPG for upload
- **Static gallery** (e.g., La Familia page in `public/`) — output WebP

### 3. Optimize each image

Apply these transformations using `sips` and (for WebP) `cwebp`:

1. **Convert color profile to sRGB** (required for correct browser rendering):
   ```bash
   sips --matchTo '/System/Library/ColorSync/Profiles/sRGB Profile.icc' ...
   ```

2. **Resize** — constrain the **wider** dimension to 1600px, preserving aspect ratio:
   - Landscape (width >= height): `--resampleWidth 1600`
   - Portrait (height > width): `--resampleHeight 1600`

3. **Save in target format**:
   - For Sanity: save as JPG (`-s format jpeg`) to a `-web.jpg` suffixed file on the Desktop
   - For static: save as intermediate JPG in `/tmp`, then convert to WebP at quality 80:
     ```bash
     cwebp -q 80 /tmp/<name>.jpg -o public/familia-photos/<name>.webp
     ```

### 4. Verify output

Show the user a before/after comparison table:
| | Original | Optimized |
|---|---|---|
| **Size** | X MB | X KB |
| **Dimensions** | WxH | WxH |
| **Color space** | (original) | sRGB |
| **Format** | (original) | JPG or WebP |

Display the optimized image using the Read tool so the user can confirm quality.

### 5. Next steps

Tell the user what to do next based on destination:
- **Sanity**: offer to upload via the Sanity API and add to a specific document
- **Static**: offer to add the filename to the relevant page component (e.g., La Familia photos array)
