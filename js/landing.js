// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== SCROLL REVEAL ====================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('visible'); // handles both classes
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .fade-in').forEach(el => revealObserver.observe(el));

// ==================== SCROLL PROGRESS BAR ====================
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    if (progressBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    }
});

// ==================== NAVBAR SCROLL ====================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 80) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
});

// ==================== CURSOR GLOW ====================
const glow = document.querySelector('.cursor-glow');
if (glow) {
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ==================== ROLE CARD 3D TILT ====================
document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const rx = (y - cy) / 25, ry = (cx - x) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ==================== FEATURE CARD STAGGER ====================
document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.showcase-card').forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 0.1}s`);
});

// ==================== CONSOLE ====================
console.log('%c⬡ DevConnect Platform', 'font-size:20px;font-weight:900;color:#6366f1');
console.log('%cConnecting freelancers with real projects!', 'font-size:13px;color:#a855f7');


