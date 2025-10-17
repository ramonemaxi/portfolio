// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-links');

if (hamburger && navList) {
  hamburger.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerOffset = 70;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    navList?.classList.remove('open');
  });
});

// Reveal on scroll
const revealItems = document.querySelectorAll('.section-header, .about-content, .skills-grid, .projects-grid, .project-card, .contact-content, .footer-content, .code-animation');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(el => {
  el.classList.add('pre-reveal');
  revealObserver.observe(el);
});

// Projects segmented control
const projectsControls = document.querySelector('.projects-controls');
const projectTabs = document.querySelectorAll('.projects-tab');
const projectsGrid = document.querySelector('[data-projects-grid]');

function setProjectsCategory(category) {
  projectTabs.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === category));
  if (projectsControls) {
    projectsControls.dataset.active = category;
  }
  const cards = projectsGrid?.querySelectorAll('[data-category]') || [];
  let visibleCount = 0;
  cards.forEach(card => {
    const isMatch = card.getAttribute('data-category') === category;
    card.toggleAttribute('hidden', !isMatch);
    card.classList.toggle('reveal-in', isMatch);
    if (isMatch) visibleCount += 1;
  });
  const emptyState = document.querySelector(`[data-empty="${category}"]`);
  if (emptyState instanceof HTMLElement) {
    emptyState.hidden = visibleCount !== 0 ? true : false;
  }
}

projectTabs.forEach(btn => {
  btn.addEventListener('click', () => setProjectsCategory(btn.dataset.filter));
});

// default category
setProjectsCategory('en-curso');


