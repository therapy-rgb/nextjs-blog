/**
 * Blocking inline script that applies the correct theme class
 * before first paint, preventing a flash of wrong theme (FOUC).
 * Rendered as the first child of <head> in the root layout.
 *
 * SECURITY: This script's SHA-256 hash is in the CSP (next.config.ts).
 * If you change the script content, regenerate the hash:
 *   node -e "const c=require('crypto');const s='<new script>';console.log(c.createHash('sha256').update(s).digest('base64'))"
 * Then update the sha256- value in next.config.ts script-src.
 */
export default function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('sdm-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d){document.documentElement.classList.add('dark')}document.documentElement.style.colorScheme=d?'dark':'light';var s=localStorage.getItem('sdm-color-scheme');if(s){document.documentElement.setAttribute('data-theme',s)}}catch(e){}})();`

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  )
}
