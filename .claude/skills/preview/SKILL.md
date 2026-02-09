---
name: preview
description: Launch dev server and open desktop + mobile browser previews
argument-hint: [optional path, e.g. /la-familia]
---

# Preview Site

Launch the Next.js dev server and open the site in both a desktop and mobile browser viewport.

## Input

$ARGUMENTS is an optional URL path (e.g. `/la-familia`, `/journal`). Defaults to `/` if not provided.

## Project Directory

The project lives at `/Users/marcusberley/Desktop/nextjs-blog`. Always use `--prefix` to target it so this works from any working directory.

## Steps

### 1. Check for running dev server

```bash
lsof -ti:3000 2>/dev/null
```

If port 3000 is already in use, skip starting the dev server.

### 2. Start dev server (if needed)

Start in the background using `--prefix` (do NOT `cd`, it triggers shell hooks that break in background mode):
```bash
npm run dev --prefix /Users/marcusberley/Desktop/nextjs-blog
```

Wait for the server to be ready by polling. **Do not use `grep`** (aliased to `rg` on this machine). Use shell string comparison instead:
```bash
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null)
  if [ "$code" = "200" ] || [ "$code" = "304" ] || [ "$code" = "307" ]; then
    echo "READY"
    break
  fi
  sleep 1
done
```

### 3. Desktop preview (Tab 1)

1. Use Playwright `browser_resize` to set viewport to **1440×900** (standard desktop).
2. Use `browser_navigate` to open `http://localhost:3000<path>`.
3. Take a **full-page screenshot** and save as `la-preview-desktop.png`.

### 4. Mobile preview (Tab 2)

1. Use `browser_tabs` to open a **new tab**.
2. Use `browser_resize` to set viewport to **390×844** (iPhone 15 Pro).
3. Use `browser_navigate` to open the same URL.
4. Take a **full-page screenshot** and save as `la-preview-mobile.png`.

### 5. Show both previews

Display both screenshots to the user so they can see desktop and mobile side by side. Both tabs remain open for interactive browsing.
