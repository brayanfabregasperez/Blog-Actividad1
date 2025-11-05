(() => {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function highlight(text, term) {
    if (!term) return text;
    const re = new RegExp(`(${term.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'ig');
    return text.replace(re, '<mark>$1</mark>');
  }

  function applyFilter() {
    const q = $('#search').value.trim().toLowerCase();
    const dest = $('#filter-destination').value;
    const cards = $$('#posts-grid .post-card');

    cards.forEach(card => {
      const title = card.dataset.title || '';
      const destCard = card.dataset.destination || '';
      const matchesQuery = q === '' || title.toLowerCase().includes(q) || card.textContent.toLowerCase().includes(q);
      const matchesDest = dest === '' || destCard === dest;

      if (matchesQuery && matchesDest) {
        card.style.display = '';
        // highlight heading
        const h2 = card.querySelector('h2');
        h2.innerHTML = highlight(card.dataset.title, q);
      } else {
        card.style.display = 'none';
      }
    });
  }

  function init() {
    const search = $('#search');
    const filter = $('#filter-destination');
    if (!search || !filter) return;

    const debounced = debounce(applyFilter, 180);
    search.addEventListener('input', debounced);
    filter.addEventListener('change', applyFilter);
    
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        search.focus();
      }
    });
   
    applyFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

