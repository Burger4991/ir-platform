document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('units');
  const searchInput = document.getElementById('unit-search');
  let activeCategory = 'all';
  let searchQuery = '';

  renderGrid();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderGrid();
    });
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase();
    renderGrid();
  });

  function renderGrid() {
    const live = window.UNITS_REGISTRY.filter(u => u.status === 'live' && matches(u));
    grid.innerHTML = '';

    if (live.length === 0 && (activeCategory !== 'all' || searchQuery)) {
      grid.innerHTML = '<div class="empty-state">No units match this filter yet.</div>';
      return;
    }

    live.forEach(u => grid.appendChild(buildCard(u)));
    // Always show 3 placeholder cards after live units
    for (let i = 0; i < 3; i++) {
      grid.appendChild(buildPlaceholder());
    }
  }

  function matches(u) {
    if (activeCategory !== 'all' && u.benchmarkCategory !== activeCategory) return false;
    if (searchQuery && !u.title.toLowerCase().includes(searchQuery) && !u.description.toLowerCase().includes(searchQuery)) return false;
    return true;
  }

  function buildCard(u) {
    const card = document.createElement('div');
    card.className = 'unit-card';

    const header = document.createElement('div');
    header.className = 'unit-card-header';
    header.style.background = `linear-gradient(135deg,${u.accentColor},${darken(u.accentColor)})`;

    const label = document.createElement('div');
    label.className = 'unit-card-label';
    label.textContent = `${u.benchmark} · ${u.benchmarkLabel}`;

    const title = document.createElement('div');
    title.className = 'unit-card-title';
    title.textContent = u.title;

    const days = document.createElement('div');
    days.className = 'unit-card-days';
    days.textContent = `${u.days} Days`;

    header.appendChild(label);
    header.appendChild(title);
    header.appendChild(days);

    const body = document.createElement('div');
    body.className = 'unit-card-body';

    const desc = document.createElement('p');
    desc.className = 'unit-card-desc';
    desc.textContent = u.description;

    const tags = document.createElement('div');
    tags.className = 'unit-card-tags';
    u.tags.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tags.appendChild(tag);
    });

    const cta = document.createElement('div');
    cta.className = 'unit-card-cta';
    cta.textContent = 'Open Unit →';
    cta.addEventListener('click', e => { e.stopPropagation(); window.location.href = u.path; });

    body.appendChild(desc);
    body.appendChild(tags);
    body.appendChild(cta);
    card.appendChild(header);
    card.appendChild(body);
    card.addEventListener('click', () => window.location.href = u.path);
    return card;
  }

  function buildPlaceholder() {
    const el = document.createElement('div');
    el.className = 'unit-card placeholder';
    el.innerHTML = `<div class="placeholder-icon">+</div><div class="placeholder-label">Next Unit</div><div class="placeholder-sub">Coming soon</div>`;
    return el;
  }

  function darken(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)})`;
  }
});
