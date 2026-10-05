/* =============================================
   FRED MAKORI — PORTFOLIO JAVASCRIPT
   Minimal: navbar scroll state + smooth scroll.
   ============================================= */

// Navbar: add background when page is scrolled
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// Smooth scroll for same-page anchor links only
// (leaves cross-page links like "index.html#skills" to navigate normally)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
