// ---- NAVBAR: scroll background + active link ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlight only makes sense when the page has its own
    // in-page sections to scroll past (i.e. the homepage).
    if (sections.length) {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
      });

      navLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${current}`;
        link.classList.toggle('active', isCurrent);
      });
    }
  });
}


// ---- MOBILE NAV TOGGLE ----
const navToggle = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');

if (navToggle && navLinksList) {
  navToggle.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
  });

  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinksList.classList.remove('open'));
  });
}


// ---- CIRCUIT CANVAS ANIMATION (hero only) ----
const canvas = document.getElementById('circuitCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function drawCircuit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = 80;
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    const rng = seededRandom(42); // fixed seed keeps the pattern stable across redraws

    ctx.strokeStyle = '#00D4FF';
    ctx.fillStyle = '#00D4FF';
    ctx.lineWidth = 0.8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * gridSize + gridSize / 2;
        const y = r * gridSize + gridSize / 2;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        const horizontal = rng() > 0.5;
        if (horizontal && c < cols - 1) {
          const length = rng() > 0.5 ? gridSize : gridSize * 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + length, y);
          ctx.stroke();
        } else if (!horizontal && r < rows - 1) {
          const length = rng() > 0.5 ? gridSize : gridSize * 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + length);
          ctx.stroke();
        }

        if (rng() > 0.78 && c < cols - 1 && r < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x + gridSize / 2, y);
          ctx.lineTo(x + gridSize / 2, y + gridSize / 2);
          ctx.stroke();
        }
      }
    }
  }

  resizeCanvas();
  drawCircuit();

  let resizeTimer;
  window.addEventListener('resize', () => {
    // Debounced: redrawing the whole grid on every resize event firing
    // (which can be dozens of times a second while dragging) is wasted work.
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      drawCircuit();
    }, 150);
  });
}


// ---- SCROLL REVEAL ----
const fadeEls = document.querySelectorAll(
  '.skill-card, .timeline-item, .project-card, .edu-card, .about-grid, .contact-container'
);

if (fadeEls.length && 'IntersectionObserver' in window) {
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => revealObserver.observe(el));
}


// ---- ANIMATED COUNTERS ----
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

if (statNumbers.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target, parseInt(entry.target.getAttribute('data-target'), 10));
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(el, target) {
  const duration = 1500;
  const start = performance.now();
  const suffix = target >= 10 ? '+' : '';

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
