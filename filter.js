// ═══════════════════════════════════════════
//  FILTER & SEARCH ENGINE — Cuisine & Desserts
// ═══════════════════════════════════════════

(function () {
  'use strict';

  const searchInput = document.getElementById('filterSearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.sub-card');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  let activeCategory = 'all';

  // ——— Category Pill Click ———
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  // ——— Search Input ———
  searchInput.addEventListener('input', () => {
    applyFilters();
  });

  // ——— Clear search on Escape ———
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      applyFilters();
      searchInput.blur();
    }
  });

  // ——— Core Filter Logic ———
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';
      // Also search inside card text content (h3, Bengali text, description)
      const h3Text = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const bnText = (card.querySelector('.sub-bn')?.textContent || '').toLowerCase();
      const descText = (card.querySelector('p')?.textContent || '').toLowerCase();
      const fullText = `${name} ${h3Text} ${bnText} ${descText} ${category}`;

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !query || fullText.includes(query);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('filter-hidden');
        card.classList.add('filter-visible');
        // Stagger the entrance slightly
        card.style.transitionDelay = `${visibleCount * 0.04}s`;
        visibleCount++;
      } else {
        card.classList.add('filter-hidden');
        card.classList.remove('filter-visible');
        card.style.transitionDelay = '0s';
      }
    });

    // Update no-results state
    if (noResults) {
      noResults.classList.toggle('visible', visibleCount === 0);
    }

    // Update result count
    if (resultCount) {
      resultCount.textContent = visibleCount === cards.length
        ? `Showing all ${visibleCount} items`
        : `Showing ${visibleCount} of ${cards.length} items`;
      resultCount.classList.toggle('filtered', visibleCount !== cards.length);
    }
  }

  // Initial state — all visible
  cards.forEach(card => card.classList.add('filter-visible'));

})();
