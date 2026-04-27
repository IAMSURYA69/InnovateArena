

(function () {
  'use strict';

  const searchInput = document.getElementById('filterSearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.sub-card');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  let activeCategory = 'all';


  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

 
  searchInput.addEventListener('input', () => {
    applyFilters();
  });


  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      applyFilters();
      searchInput.blur();
    }
  });


  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';
      
      const h3Text = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const bnText = (card.querySelector('.sub-bn')?.textContent || '').toLowerCase();
      const descText = (card.querySelector('p')?.textContent || '').toLowerCase();
      const fullText = `${name} ${h3Text} ${bnText} ${descText} ${category}`;

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !query || fullText.includes(query);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('filter-hidden');
        card.classList.add('filter-visible');
        
        card.style.transitionDelay = `${visibleCount * 0.04}s`;
        visibleCount++;
      } else {
        card.classList.add('filter-hidden');
        card.classList.remove('filter-visible');
        card.style.transitionDelay = '0s';
      }
    });

    
    if (noResults) {
      noResults.classList.toggle('visible', visibleCount === 0);
    }

    
    if (resultCount) {
      resultCount.textContent = visibleCount === cards.length
        ? `Showing all ${visibleCount} items`
        : `Showing ${visibleCount} of ${cards.length} items`;
      resultCount.classList.toggle('filtered', visibleCount !== cards.length);
    }
  }


  cards.forEach(card => card.classList.add('filter-visible'));

})();
