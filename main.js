/*=============== LOADING SCREEN ===============*/
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 800); // Reducido de 1500ms a 800ms
});

/*=============== SCROLL PROGRESS BAR ===============*/
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
});

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader);

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = null;
if (document.querySelector('.work__container')) {
    mixerPortfolio = mixitup('.work__container', {
        selectors: {
            target: '.work__card'
        },
        animation: {
            duration: 300,
            effects: 'fade translateY(20px)',
            easing: 'ease-in-out'
        }
    });
}

/* Link active work */
const linkWork = document.querySelectorAll('.work__item');

function activeWork() {
    linkWork.forEach(l => l.classList.remove('active-work'));
    this.classList.add('active-work');
}

linkWork.forEach(l => l.addEventListener('click', activeWork));

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById('theme-button');
const lightTheme = 'light-theme';
const iconTheme = 'bx-sun';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// We obtain the current theme that the interface has by validating the light-theme class
const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun';

// We validate if the user previously chose a topic
if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](lightTheme);
    themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the light / icon theme
    document.body.classList.toggle(lightTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

/*=============== TYPEWRITER EFFECT ===============*/
const typeTextSpan = document.querySelector(".typewriter-text");
const textArray = ["Full Stack Dev", "IA Enthusiast", "Tech Support", "Problem Solver"];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typeTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typeTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, 1000);
    }
}

// Start typewriter effect
document.addEventListener("DOMContentLoaded", () => {
    if (typeTextSpan) {
        setTimeout(type, 1000);
    }
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
// Solo activar ScrollReveal en tablets y desktop
if (window.innerWidth >= 768) {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '30px',
        duration: 1200,
        delay: 150,
        reset: false,
        mobile: false,
        cleanup: true
    });

    // Home animations
    sr.reveal(`.home__data`, { origin: 'bottom', distance: '20px' });
    sr.reveal(`.home__handle`, { origin: 'bottom', delay: 300, distance: '20px' });

    // About animations
    sr.reveal(`.about__img-wrapper`, { origin: 'left', distance: '30px' });
    sr.reveal(`.about__data`, { origin: 'right', distance: '30px' });

    // Experience animations
    sr.reveal(`.timeline__item`, { 
        origin: 'bottom',
        interval: 100,
        distance: '20px'
    });

    // Skills animations
    sr.reveal(`.skills__content`, { 
        interval: 80,
        distance: '30px',
        origin: 'bottom'
    });

    // Work animations
    sr.reveal(`.work__filters`, { origin: 'top', distance: '20px' });
    sr.reveal(`.work__card`, { 
        interval: 80,
        distance: '30px',
        origin: 'bottom'
    });

    // Certificates animations
    sr.reveal(`.certificate__card`, { 
        interval: 80,
        distance: '30px',
        origin: 'bottom'
    });

    // Contact animations
    sr.reveal(`.contact__content`, { 
        interval: 100,
        origin: 'bottom',
        distance: '20px'
    });
} else {
    // En móviles, mostrar todo sin animaciones
    console.log('ScrollReveal desactivado en móvil para mejor rendimiento');
}

/*=============== SCROLL TO TOP ===============*/
const scrollTop = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 560) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});

scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/*=============== CONTACT FORM ===============*/
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading message
        contactMessage.textContent = 'Enviando mensaje...';
        contactMessage.style.color = 'var(--first-color)';
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Show success message
            contactMessage.textContent = '¡Mensaje enviado con éxito! 🚀';
            contactMessage.style.color = 'var(--first-color)';
            
            // Reset form
            contactForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);
        }, 2000);
    });
}

/*=============== SMOOTH SCROLL FOR NAVIGATION LINKS ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for section links, not for the scroll-top button
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

/*=============== ANIMATE NUMBERS (About Section) ===============*/
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate numbers when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const aboutBoxes = document.querySelectorAll('.about__box');
let hasAnimated = false;

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            // Animate the "2+ Años" and "10+ Completados"
            const subtitles = document.querySelectorAll('.about__subtitle');
            subtitles.forEach(subtitle => {
                const text = subtitle.textContent;
                if (text.includes('Años')) {
                    const numberElement = subtitle;
                    animateValue(numberElement, 0, 2, 1500, '+ Años');
                } else if (text.includes('Completados')) {
                    const numberElement = subtitle;
                    animateValue(numberElement, 0, 10, 1500, '+ Completados');
                }
            });
        }
    });
}, observerOptions);

aboutBoxes.forEach(box => aboutObserver.observe(box));

/*=============== KEYBOARD NAVIGATION ACCESSIBILITY ===============*/
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            themeButton.click();
        }
    }
    
    // Press 'H' to scroll to top
    if (e.key === 'h' || e.key === 'H') {
        if (!e.target.matches('input, textarea')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
});

/*=============== ADD LOADING STATE TO BUTTONS ===============*/
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Skip for navigation buttons
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
            return;
        }
        
        // Add loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Cargando...';
        this.style.pointerEvents = 'none';
        
        // Remove loading state after 2 seconds (adjust based on your needs)
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});

/*=============== PARALLAX EFFECT FOR HOME IMAGE ===============*/
if (window.innerWidth >= 992) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const homeImg = document.querySelector('.home__img-wrapper');
        
        if (homeImg && scrolled < window.innerHeight) {
            homeImg.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

/*=============== WORK CARDS TILT EFFECT ===============*/
const workCards = document.querySelectorAll('.work__card');

// Only enable tilt on desktop
if (window.innerWidth >= 992) {
    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/*=============== CERTIFICATE CARDS HOVER EFFECT ===============*/
const certificateCards = document.querySelectorAll('.certificate__card');

certificateCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

/*=============== CONSOLE EASTER EGG ===============*/
console.log('%c👨‍💻 ¡Hola Developer!', 'color: #00ff64; font-size: 24px; font-weight: bold;');
console.log('%c¿Interesado en el código? Visita mi GitHub: https://github.com/Alvaro6ix', 'color: #00ff64; font-size: 14px;');
console.log('%c💼 ¿Buscas un desarrollador? Contáctame: alvaro.aldama@example.com', 'color: #00ff64; font-size: 14px;');

/*=============== PERFORMANCE OPTIMIZATION ===============*/
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/*=============== PREVENT FLASH OF UNSTYLED CONTENT ===============*/
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
});

/*=============== ANALYTICS (Optional) ===============*/
// Track button clicks
document.querySelectorAll('.button, .work__button, .certificate__button, .contact__button').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        console.log('Button clicked:', buttonText);
        // Here you can add Google Analytics or other tracking
        // gtag('event', 'click', { 'button_name': buttonText });
    });
});

/*=============== COPY EMAIL TO CLIPBOARD ===============*/
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const email = this.getAttribute('href').replace('mailto:', '');
        
        // Copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            // Show temporary message
            const originalText = this.textContent;
            this.textContent = '✓ Copiado';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    });
});

/*=============== DETECT MOBILE DEVICE ===============*/
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Disable hover effects on mobile
    document.body.classList.add('mobile-device');
    
    // Disable tilt effect on mobile
    workCards.forEach(card => {
        card.style.transform = '';
    });
}

/*=============== NETWORK STATUS INDICATOR ===============*/
window.addEventListener('online', () => {
    console.log('🟢 Conexión restaurada');
});

window.addEventListener('offline', () => {
    console.log('🔴 Sin conexión a internet');
    // You can show a notification here
});

/*=============== REDUCE MOTION FOR ACCESSIBILITY ===============*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('*').forEach(element => {
        element.style.animationDuration = '0.01ms !important';
        element.style.transitionDuration = '0.01ms !important';
    });
}

/*=============== DYNAMIC YEAR IN FOOTER ===============*/
const currentYear = new Date().getFullYear();
const footerCopy = document.querySelector('.footer__copy');
if (footerCopy && !footerCopy.textContent.includes(currentYear)) {
    footerCopy.innerHTML = footerCopy.innerHTML.replace('2026', currentYear);
}