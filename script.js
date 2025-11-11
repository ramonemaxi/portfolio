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
// Certificates Carousel & Lightbox
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".certificates-carousel");
    const prevButton = document.querySelector(".carousel-arrow.prev");
    const nextButton = document.querySelector(".carousel-arrow.next");
    const carouselWrapper = document.querySelector(".certificates-carousel-wrapper");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

    if (!carousel || !prevButton || !nextButton || !carouselWrapper || !lightbox || !lightboxImg || !lightboxClose) {
        console.error("Faltan algunos elementos del carrusel o del lightbox.");
        return;
    }

    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.classList.add("active");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("active");
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    const setupCarousel = (certificates) => {
        if (!Array.isArray(certificates) || certificates.length === 0) {
            console.error("No se encontraron certificados o el formato es incorrecto.");
            return;
        }

        certificates.forEach(certFile => {
            const card = document.createElement("div");
            card.className = "certificate-card glass-card hover-lift";

            const img = document.createElement("img");
            img.src = `cerificados/${certFile}`;
            img.alt = certFile.replace(/\.(png|jpg)$/, "").replace(/-/g, " ");

            img.addEventListener("click", () => {
                openLightbox(img.src);
            });
            
            card.appendChild(img);
            carousel.appendChild(card);
        });
    };

    fetch('cerificados/certificates.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(certificates => {
            setupCarousel(certificates);
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo de certificados:', error);
            carousel.innerHTML = '<p style="color: var(--danger);">Error al cargar los certificados.</p>';
        });

    // Carousel scroll functionality
    const scrollAmount = 320; // Width of a card + margin
    let autoScrollInterval;
    let isScrolling = false;

    function smoothScrollTo(element, to, duration) {
        isScrolling = true;
        const start = element.scrollLeft;
        const change = to - start;
        const startTime = performance.now();

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        function animateScroll() {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            element.scrollLeft = easeInOutQuad(elapsed, start, change, duration);

            if (elapsed < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollLeft = to;
                isScrolling = false;
            }
        }
        animateScroll();
    }

    const scrollCarousel = (direction) => {
        if (isScrolling) return;
        const currentScroll = carousel.scrollLeft;
        const targetScroll = currentScroll + direction * scrollAmount;
        smoothScrollTo(carousel, targetScroll, 800); // 800ms duration
    };

    prevButton.addEventListener("click", () => {
        scrollCarousel(-1);
        stopAutoScroll();
        // Optional: restart autoplay after a delay
        setTimeout(startAutoScroll, 5000);
    });

    nextButton.addEventListener("click", () => {
        scrollCarousel(1);
        stopAutoScroll();
        // Optional: restart autoplay after a delay
        setTimeout(startAutoScroll, 5000);
    });

    const startAutoScroll = () => {
        stopAutoScroll(); // Ensure no multiple intervals are running
        autoScrollInterval = setInterval(() => {
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
                // If at the end, scroll to the beginning
                smoothScrollTo(carousel, 0, 1200);
            } else {
                scrollCarousel(1);
            }
        }, 3000);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    carouselWrapper.addEventListener("mouseenter", stopAutoScroll);
    carouselWrapper.addEventListener("mouseleave", startAutoScroll);

    startAutoScroll();
});

