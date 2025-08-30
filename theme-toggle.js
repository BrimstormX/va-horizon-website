(function() {
  const KEY = 'va-theme';         // 'light' | 'dark'
  const root = document.documentElement;

  // 1) Apply saved theme ASAP to avoid flash
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark') root.setAttribute('data-theme','dark');
  } catch (e) { /* ignore private mode */ }

  // 2) Wire the button
  window.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function syncButton() {
      const isDark = root.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Disable dark mode' : 'Enable dark mode');
      btn.querySelector('.icon')?.replaceChildren(document.createTextNode(isDark ? '☀️' : '🌙'));
      btn.querySelector('.label')?.replaceChildren(document.createTextNode(isDark ? 'Light' : 'Dark'));
    }

    btn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
          root.removeAttribute('data-theme');
          try { localStorage.setItem(KEY, 'light'); } catch (e) { /* ignore */ }
        } else {
          root.setAttribute('data-theme','dark');
          try { localStorage.setItem(KEY, 'dark'); } catch (e) { /* ignore */ }
        }
      syncButton();

      // Update meta theme-color for mobile UI bars
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#ffffff' : '#2b2b2b');

      // Update favicon
      const link = document.querySelector('link[rel="icon"]');
      if (link) link.href = isDark ? '/favicon-dark.ico' : '/favicon.ico';
    });

    syncButton();
  });
})();
