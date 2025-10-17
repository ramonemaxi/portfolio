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


// Typing effect for hero section with structured HTML
const codeAnimationContainer = document.querySelector('.code-animation');

if (codeAnimationContainer) {
    const originalContent = codeAnimationContainer.innerHTML;
    codeAnimationContainer.innerHTML = ''; // Clear content initially

    const lines = [
        { text: 'def ', class: 'code-keyword' },
        { text: 'crear_solucion', class: 'code-function' },
        { text: '():', class: 'code-paren' }, // Added colon here
        { text: '\n' }, // Line break for the first line
        { text: 'return ', class: 'code-keyword', indent: true }, // Removed explicit spaces, indentation controlled by CSS
        { text: '"innovación"', class: 'code-string' }
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineElement = null;
    let currentSpanElement = null;

    function typeEffect() {
        if (lineIndex < lines.length) {
            const lineData = lines[lineIndex];

            if (lineData.text === '\n') {
                // Handle line break
                const newLineDiv = document.createElement('div');
                newLineDiv.classList.add('code-line');
                if (lines[lineIndex + 1] && lines[lineIndex + 1].indent) {
                    newLineDiv.classList.add('indent');
                }
                codeAnimationContainer.appendChild(newLineDiv);
                currentLineElement = newLineDiv;
                currentSpanElement = null; // Reset current span
                lineIndex++;
                charIndex = 0;
                setTimeout(typeEffect, 50); // Short delay for new line
                return;
            }

            if (!currentLineElement) {
                currentLineElement = document.createElement('div');
                currentLineElement.classList.add('code-line');
                if (lineData.indent) {
                    currentLineElement.classList.add('indent');
                }
                codeAnimationContainer.appendChild(currentLineElement);
            }

            if (!currentSpanElement || currentSpanElement.className !== lineData.class) {
                currentSpanElement = document.createElement('span');
                if (lineData.class) {
                    currentSpanElement.classList.add(lineData.class);
                }
                currentLineElement.appendChild(currentSpanElement);
            }

            if (charIndex < lineData.text.length) {
                currentSpanElement.textContent += lineData.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeEffect, 70); // Typing speed
            } else {
                lineIndex++;
                charIndex = 0;
                currentSpanElement = null; // Reset current span for the next part of the line
                setTimeout(typeEffect, 50); // Short delay before next part
            }
        } else {
            // Typing complete, optionally reset or loop
            // For now, just stop.
        }
    }

    // Start the typing effect after a short delay
    setTimeout(typeEffect, 1000);
}