/*=============== LOADING SCREEN ===============*/
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 600);
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

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun';

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](lightTheme);
    themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(lightTheme);
    themeButton.classList.toggle(iconTheme);
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

document.addEventListener("DOMContentLoaded", () => {
    if (typeTextSpan) {
        setTimeout(type, 1000);
    }
});

/*=============== SCROLL REVEAL - ONLY DESKTOP ===============*/
// Only enable on tablets and desktop to prevent mobile overflow
if (window.innerWidth >= 768) {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '30px',
        duration: 1000,
        delay: 100,
        reset: false,
        mobile: false,
        cleanup: true
    });

    sr.reveal(`.home__data`, { origin: 'bottom', distance: '20px' });
    sr.reveal(`.home__handle`, { origin: 'bottom', delay: 200, distance: '20px' });
    sr.reveal(`.about__img-wrapper`, { origin: 'left', distance: '30px' });
    sr.reveal(`.about__data`, { origin: 'right', distance: '30px' });
    sr.reveal(`.timeline__item`, { 
        origin: 'bottom',
        interval: 100,
        distance: '20px'
    });
    sr.reveal(`.skills__content`, { 
        interval: 80,
        distance: '30px',
        origin: 'bottom'
    });
    sr.reveal(`.work__filters`, { origin: 'top', distance: '20px' });
    sr.reveal(`.work__card`, { 
        interval: 80,
        distance: '30px',
        origin: 'bottom'
    });
    sr.reveal(`.certificate__card`, { 
        interval: 80,
        distance: '30px',
        origin: 'bottom'
    });
    sr.reveal(`.contact__content`, { 
        interval: 100,
        origin: 'bottom',
        distance: '20px'
    });
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
/*=============== CONTACT FORM ===============*/
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Estado visual de carga
        contactMessage.textContent = 'Enviando mensaje... ⏳';
        contactMessage.style.color = 'var(--first-color)';
        
        // serviceID - templateID - #form - publicKey
        // Datos obtenidos de tus capturas de pantalla:
        emailjs.sendForm('service_h4np7mc', 'template_mesi807', '#contact-form', '8bj8mBek5nZGjpETZ')
            .then(() => {
                // Éxito: El mensaje se envió correctamente
                contactMessage.textContent = '¡Mensaje enviado con éxito! 🚀';
                contactMessage.style.color = 'var(--first-color)';
                
                // Limpiar los campos del formulario
                contactForm.reset();
                
                // Borrar el mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    contactMessage.textContent = '';
                }, 5000);
            }, (error) => {
                // Error: Imprimir detalle en consola para depuración
                console.error('Error detallado de EmailJS:', error);
                contactMessage.textContent = 'Hubo un error al enviar el mensaje. ❌';
                contactMessage.style.color = 'red';
            });
    });
}

/*=============== SMOOTH SCROLL ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
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

/*=============== ANIMATE NUMBERS ===============*/
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
            const subtitles = document.querySelectorAll('.about__subtitle');
            subtitles.forEach(subtitle => {
                const text = subtitle.textContent;
                if (text.includes('Años')) {
                    animateValue(subtitle, 0, 2, 1500, '+ Años');
                } else if (text.includes('Completados')) {
                    animateValue(subtitle, 0, 10, 1500, '+ Completados');
                }
            });
        }
    });
}, observerOptions);

aboutBoxes.forEach(box => aboutObserver.observe(box));

/*=============== CONSOLE EASTER EGG ===============*/
console.log('%c👨‍💻 ¡Hola Developer!', 'color: #00ff64; font-size: 24px; font-weight: bold;');
console.log('%c¿Interesado en el código? Visita mi GitHub: https://github.com/Alvaro6ix', 'color: #00ff64; font-size: 14px;');

/*=============== PREVENT FLASH ===============*/
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
});

/*=============== DYNAMIC YEAR ===============*/
const currentYear = new Date().getFullYear();
const footerCopy = document.querySelector('.footer__copy');
if (footerCopy && !footerCopy.textContent.includes(currentYear)) {
    footerCopy.innerHTML = footerCopy.innerHTML.replace('2026', currentYear);
}