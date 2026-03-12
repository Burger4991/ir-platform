(function() {
  const saved = localStorage.getItem('ir-theme') || 'edtech';
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === saved);
      btn.setAttribute('aria-pressed', btn.dataset.theme === saved ? 'true' : 'false');
      btn.addEventListener('click', () => {
        const t = btn.dataset.theme;
        applyTheme(t);
        localStorage.setItem('ir-theme', t);
        document.querySelectorAll('.theme-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.theme === t);
          b.setAttribute('aria-pressed', b.dataset.theme === t ? 'true' : 'false');
        });
      });
    });
  });

  function applyTheme(t) {
    document.body.className = document.body.className.replace(/\btheme-\w+\b/g, '').trim();
    document.body.classList.add('theme-' + t);
  }
})();
