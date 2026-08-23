// Shared across every page: a floating back-to-top button, and
// (on the homepage only) small recipe-count badges next to each collection.

(function(){
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  // Homepage only: tag each collection heading with how many recipes it has.
  document.querySelectorAll('.collection').forEach(col => {
    const count = col.querySelectorAll('.recipe-card:not(.placeholder)').length;
    const h2 = col.querySelector('.collection-head h2');
    if (h2 && count) {
      const span = document.createElement('span');
      span.className = 'count-badge';
      span.textContent = count;
      h2.appendChild(span);
    }
  });
})();
