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
    card.innerHTML = `
      <div class="unit-card-header" style="background:linear-gradient(135deg,${u.accentColor},${darken(u.accentColor)})">
        <div class="unit-card-label">${u.benchmark} · ${u.benchmarkLabel}</div>
        <div class="unit-card-title">${u.title}</div>
        <div class="unit-card-days">${u.days} Days</div>
      </div>
      <div class="unit-card-body">
        <p class="unit-card-desc">${u.description}</p>
        <div class="unit-card-tags">${u.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="unit-card-cta" onclick="event.stopPropagation();window.location.href='${u.path}'">Open Unit →</div>
      </div>`;
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
