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

            // If it's a stagger group, find its children and add delays if not present
            if (entry.target.classList.contains('stagger-reveal')) {
                entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
                    if (!child.style.animationDelay) {
                        child.style.animationDelay = `${i * 0.1}s`;
                    }
                });
            }
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .fade-in, .stagger-reveal').forEach(el => revealObserver.observe(el));

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

// ==================== AURA CARD MOUSE TRACKING ====================
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.aura-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
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


