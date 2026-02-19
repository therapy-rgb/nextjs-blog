/**
 * Blocking inline script that applies the correct theme class
 * before first paint, preventing a flash of wrong theme (FOUC).
 * Rendered as the first child of <head> in the root layout.
 */
export default function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('sdm-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d){document.documentElement.classList.add('dark')}document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  )
}
