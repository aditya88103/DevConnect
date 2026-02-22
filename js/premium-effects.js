/**
 * DevConnect Premium UI Effects Engine
 * Handles special animations like cursor tracking, aura cards, and scroll reveals
 */

document.addEventListener('DOMContentLoaded', () => {
    initPremiumEffects();
});

function initPremiumEffects() {
    // 1. Cursor Glow Tracking
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // 2. Aura Card Mouse Tracking (Gradient movement)
    document.addEventListener('mousemove', (e) => {
        const auraCards = document.querySelectorAll('.aura-card');
        auraCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // 3. Scroll Reveal & Stagger Animation
    const premiumObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a stagger container, trigger the children
                if (entry.target.classList.contains('stagger-reveal')) {
                    const children = entry.target.querySelectorAll(':scope > *');
                    children.forEach((child, i) => {
                        child.style.animation = `staggerFadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards`;
                        child.style.animationDelay = `${i * 0.12}s`;
                    });
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .fade-in, .stagger-reveal').forEach(el => {
        premiumObserver.observe(el);
    });

    // 4. Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    // 5. Parallax Orbs
    window.addEventListener('scroll', () => {
        const orbs = document.querySelectorAll('.orb');
        const scrolled = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.15;
            orb.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
    });

    // 6. Magnetic Elements (Tactile pull)
    document.addEventListener('mousemove', (e) => {
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);

            if (distance < 80) {
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            } else {
                el.style.transform = `translate(0, 0)`;
            }
        });
    });

    // 7. Page Loader Removal
    window.addEventListener('load', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                // Trigger entry animations
                document.querySelectorAll('.reveal, .stagger-reveal').forEach(el => {
                    premiumObserver.observe(el);
                });
            }, 800);
        }
    });
}

