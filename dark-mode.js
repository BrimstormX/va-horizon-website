(function () {
  const STORAGE_KEY = 'theme';
  const DARK_CLASS = 'dark';
  const body = document.body;

  const style = document.createElement('style');
  style.textContent = `
    body { background-color: var(--bg1); color: #000; transition: background-color 0.3s, color 0.3s; }
    body.dark { --bg1: #0d1117; --bg2: #1f2937; --noise-opacity: 0.05; color: #f5f5f5; }
    body.dark a { color: #9ddcff; }
  `;
  document.head.appendChild(style);

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add(DARK_CLASS);
    } else {
      body.classList.remove(DARK_CLASS);
    }
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    applyTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.style.position = 'fixed';
  btn.style.bottom = '1rem';
  btn.style.right = '1rem';
  btn.style.padding = '0.5rem';
  btn.style.border = '1px solid currentColor';
  btn.style.borderRadius = '9999px';
  btn.style.background = 'none';
  btn.style.cursor = 'pointer';
  btn.textContent = '🌙';

  btn.addEventListener('click', () => {
    const isDark = body.classList.toggle(DARK_CLASS);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  });

  document.body.appendChild(btn);
})();

