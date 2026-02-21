document.addEventListener('DOMContentLoaded', () => {
    // 0. Cursor Glow & Scroll Progress
    const cursorGlow = document.querySelector('.cursor-glow');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        }

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 1. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 2. Mouse Glow Effect for Glass Cards
    const glassCards = document.querySelectorAll('.glass-glow');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 3. Magnetic Buttons (Basic)
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Parallax Effect for Background Circles
    window.addEventListener('mousemove', (e) => {
        const circles = document.querySelectorAll('.circle');
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        circles.forEach(circle => {
            circle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // 5. Typing Effect for Titles
    const typingElements = document.querySelectorAll('.typing-text');
    typingElements.forEach(el => {
        const text = el.getAttribute('data-text');
        if (!text) return;
        let i = 0;
        el.innerHTML = '';
        const type = () => {
            if (i < text.length) {
                el.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        type();
    });

    // 6. Premium Magnetic Hover for Nav Links
    const navLinks = document.querySelectorAll('.nav-links a, .navbar-menu a');
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0,0)';
        });
    });

    // 7. Smooth Mobile Auth Switch (Ensuring no overlap)
    const container = document.getElementById('container');
    if (container) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isRightActive = container.classList.contains('right-panel-active');
                    const signIn = container.querySelector('.sign-in-container');
                    const signUp = container.querySelector('.sign-up-container');

                    if (window.innerWidth <= 768) {
                        if (isRightActive) {
                            if (signIn) signIn.style.display = 'none';
                            if (signUp) signUp.style.display = 'block';
                        } else {
                            if (signIn) signIn.style.display = 'block';
                            if (signUp) signUp.style.display = 'none';
                        }
                    }
                }
            });
        });
        observer.observe(container, { attributes: true });
    }
});

// ==================== PREMIUM NOTIFICATIONS ====================

function showToast(message, type = 'error') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    if (type === 'error') {
        icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else {
        icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// ==================== PASSWORD RESET SYSTEM ====================

function showForgotPasswordModal() {
    let overlay = document.querySelector('.modal-overlay-p');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay-p';
        overlay.innerHTML = `
            <div class="modal-p">
                <h2>Reset Password</h2>
                <p>Enter your registration email to recover your password details.</p>
                <div class="input-group">
                    <input type="email" id="resetEmail" placeholder="Your account email" />
                </div>
                <button class="liquid-btn" id="sendResetBtn" style="width:100%">Show Password</button>
                <button class="liquid-btn modal-close-btn" id="closeResetModal" style="width:100%">Close</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#closeResetModal');
        closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

        const sendBtn = overlay.querySelector('#sendResetBtn');
        sendBtn.addEventListener('click', () => {
            const email = overlay.querySelector('#resetEmail').value;
            if (!email) {
                showToast('Please enter an email address!');
                return;
            }

            const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
            const user = users.find(u => u.email === email);

            if (user) {
                showToast(`Success! Your password is: ${user.password}`, 'success');
                overlay.classList.remove('active');
            } else {
                showToast('Email not found in our database!');
            }
        });
    }
    overlay.classList.add('active');
}
