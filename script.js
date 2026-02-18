// ===== SMOOTH SCROLL AND ANIMATIONS =====

document.addEventListener('DOMContentLoaded', function () {

    // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections that need animation
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-content, .about-glass-container, .bento-grid, .skills-bento-grid, .holo-grid, .terminal-window, .fiber-social-hub, .research-grid, .activities-grid, .projects-grid, .contact-content'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Staggered animation for about cards
    const aboutGlassContainer = document.querySelector('.about-glass-container');
    const bentoGrid = document.querySelector('.bento-grid');

    if (aboutGlassContainer) {
        observer.observe(aboutGlassContainer);
    }

    if (bentoGrid) {
        const cardObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.bento-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    // Trigger typing animation for about overview when visible
                    const typingEl = document.getElementById('aboutTyping');
                    if (typingEl && !typingEl.dataset.started) {
                        const text = typingEl.getAttribute('data-text') || '';
                        typingEl.dataset.started = 'true';
                        // 3x faster typing
                        typeWriter(typingEl, text, 5);
                    }
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cardObserver.observe(bentoGrid);

        // Initialize cards with opacity 0
        const cards = bentoGrid.querySelectorAll('.bento-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    }

    // ===== SKILL PROGRESS BARS ANIMATION =====
    const skillBars = document.querySelectorAll('.skill-progress-bar');

    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                progressBar.style.width = progress + '%';
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // ===== NAVBAR SCROLL EFFECT =====
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    const navCenter = document.querySelector('.nav-center');
    const navActions = document.querySelector('.nav-actions');
    const navBrand = document.querySelector('.nav-brand');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const heroSectionEl = document.querySelector('.hero-section');
        const detailsSectionEl = document.querySelector('.details-section');
        const heroHeight = heroSectionEl ? heroSectionEl.offsetHeight : 600;

        // Add darker glass effect when scrolled to about/details section
        if (detailsSectionEl && currentScroll > heroHeight * 0.7) {
            navContainer.classList.add('scrolled');
            if (navCenter) navCenter.classList.add('scrolled');
            if (navActions) navActions.classList.add('scrolled');
        } else {
            navContainer.classList.remove('scrolled');
            if (navCenter) navCenter.classList.remove('scrolled');
            if (navActions) navActions.classList.remove('scrolled');
        }

        if (currentScroll > 100) {
            navContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            if (navActions) {
                navActions.style.opacity = '0.95';
            }
        } else {
            navContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            if (navActions) {
                navActions.style.opacity = '1';
            }
        }

        // Hide/show navbar on scroll (subtle effect)
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease';
        } else if (currentScroll < lastScroll) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.transition = 'transform 0.3s ease';
        }

        lastScroll = currentScroll;
    });

    // ===== COLLAPSE "AVAILABLE FOR WORK" AFTER 3s, EXPAND ON HOVER =====
    if (navBrand) {
        setTimeout(() => {
            navBrand.classList.add('collapsed');
        }, 3000);

        // Optional: keep collapsed when hover ends (handled by CSS). No JS needed.
    }

    // ===== SMOOTH NAVIGATION LINKS =====
    // Disabled to let CSS scroll-behavior and scroll-margin-top handle it natively
    /*
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    */

    // ===== PARALLAX EFFECT FOR HERO SECTION =====
    const heroSection = document.querySelector('.hero-section');
    const heroName = document.querySelector('.hero-name');
    const heroDescription = document.querySelector('.hero-description');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            heroName.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroDescription.style.transform = `translateY(${scrolled * parallaxSpeed * 0.7}px)`;

            // Fade out hero content on scroll
            const opacity = 1 - (scrolled / heroHeight) * 0.5;
            heroName.style.opacity = Math.max(opacity, 0.5);
            heroDescription.style.opacity = Math.max(opacity, 0.5);
        }
    });

    // ===== GLASS CARD HOVER EFFECTS =====
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 10;
            const angleY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== BENTO CARD INTERACTIVE EFFECTS =====
    const bentoCards = document.querySelectorAll('.bento-card');

    bentoCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle tilt effect for bento cards
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;

            // Apply tilt only slightly (Apple-style subtlety)
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;

            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success message
                submitButton.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = 'linear-gradient(135deg, #4a90e2, #8b5cf6)';
                    submitButton.disabled = false;
                }, 3000);

                // Show success notification
                showNotification('Message sent successfully!', 'success');
            }, 2000);
        });
    }

    // ===== NOTIFICATION FUNCTION =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #4a90e2, #8b5cf6)'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ===== SKILL CARD INTERACTIVE EFFECTS =====
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('click', function () {
            // Add pulse effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // ===== PROJECT CARD MAGNETIC EFFECT =====
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;

            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'translate(0, 0)';
        });
    });

    // ===== TYPEWRITER EFFECT (Enhanced) =====
    function typeWriter(element, text, baseSpeed = 7, initialDelay = 150, endPause = 600) {
        let index = 0;
        element.textContent = '';

        function nextTick() {
            if (index <= text.length) {
                element.textContent = text.slice(0, index);
                const prevChar = text.charAt(index - 1);
                let delay = baseSpeed + Math.random() * 18; // much faster
                if (/[,.;:!?]/.test(prevChar)) delay += 60; // quick punctuation pause
                if (prevChar === ' ') delay -= 8; // faster over spaces
                index++;
                setTimeout(nextTick, Math.max(15, delay));
            } else {
                // finished typing; slight rest while cursor blinks
                setTimeout(() => { }, endPause);
            }
        }

        setTimeout(nextTick, initialDelay);
    }

    // ===== CURSOR TRACKER FOR INTERACTIVE ELEMENTS =====
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    // Show custom cursor on desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, .glass-card, .bento-card, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            });
        });
    }

    // ===== SCROLL PROGRESS INDICATOR =====
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4a90e2, #8b5cf6);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== LIQUID GLASS EFFECT ON SCROLL =====
    const detailsSection = document.querySelector('.details-section');

    if (detailsSection) {
        window.addEventListener('scroll', () => {
            const rect = detailsSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const scrollProgress = Math.min(
                    Math.max((window.innerHeight - rect.top) / window.innerHeight, 0),
                    1
                );

                // Adjust glass effect intensity based on scroll
                const glassCards = detailsSection.querySelectorAll('.glass-card');
                glassCards.forEach(card => {
                    const opacity = 0.4 + (scrollProgress * 0.2);
                    card.style.background = `rgba(255, 255, 255, ${opacity})`;
                });
            }
        });
    }

    // ===== PARTICLE INTERACTION =====
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(2)';
            this.style.background = 'rgba(255, 255, 255, 1)';
        });
        particle.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.5)';
        });
    });

    // ===== PREVENT FLASH OF UNSTYLED CONTENT =====
    document.body.style.opacity = '1';
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && window.pageYOffset === 0) {
        e.preventDefault();
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    }
});

// ===== ADD CSS ANIMATIONS DYNAMICALLY =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== STATS RIBBON COUNT-UP =====
const statValues = document.querySelectorAll('.stat-value[data-target]');
if (statValues.length) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statValues.forEach(el => {
                    if (el.dataset.counted) return;
                    el.dataset.counted = 'true';
                    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                    const duration = 900; // ms
                    const start = performance.now();
                    function tick(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const value = Math.floor(progress * target);
                        el.textContent = value.toString();
                        if (progress < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const ribbon = document.querySelector('.stats-ribbon-inner');
    if (ribbon) statsObserver.observe(ribbon);
}

// ===== BENTO PANEL FOCUS (dim siblings on hover) =====
const bentoPanelGrid = document.querySelector('.skills-bento-grid');
if (bentoPanelGrid) {
    const panels = bentoPanelGrid.querySelectorAll('.bento-panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            bentoPanelGrid.classList.add('panel-hovered');
            panel.classList.add('panel-active');
        });
        panel.addEventListener('mouseleave', () => {
            bentoPanelGrid.classList.remove('panel-hovered');
            panel.classList.remove('panel-active');
        });
    });
}

// ===== HOLOGRAPHIC 3D TILT + GLARE =====
document.querySelectorAll('.holo-card[data-tilt]').forEach(card => {
    const glare = card.querySelector('.holo-glare');
    const maxTilt = 12; // degrees

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotateY = ((x - cx) / cx) * maxTilt;
        const rotateX = ((cy - y) / cy) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Move glare to follow mouse
        if (glare) {
            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.12) 0%, transparent 55%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        if (glare) {
            glare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)';
        }
    });
});

// ===== TERMINAL TYPING ANIMATION =====
const terminalCmd = document.getElementById('terminalCmd');
if (terminalCmd) {
    const cmdText = 'initialize_contact --secure --channel=subspace';
    let typed = false;

    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !typed) {
                typed = true;
                let i = 0;
                const typeInterval = setInterval(() => {
                    terminalCmd.textContent = cmdText.slice(0, i + 1);
                    i++;
                    if (i >= cmdText.length) clearInterval(typeInterval);
                }, 40);
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const terminalSection = document.querySelector('.terminal-window');
    if (terminalSection) terminalObserver.observe(terminalSection);
}

// ===== NEON SUBMIT — OPEN GOOGLE FORM =====
const GOOGLE_FORM_URL = 'https://forms.gle/JH48TGoV8SNzVsKv6';
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        if (!btn || btn.dataset.sending === 'true') return;

        btn.dataset.sending = 'true';
        const textEl = btn.querySelector('.submit-text');
        const spinnerEl = btn.querySelector('.submit-spinner');
        const iconEl = btn.querySelector('i');
        const origText = textEl.textContent;

        textEl.textContent = 'Transmitting...';
        if (spinnerEl) spinnerEl.style.display = 'inline-block';
        if (iconEl) iconEl.style.display = 'none';

        setTimeout(() => {
            // Open the Google Form in a new tab
            window.open(GOOGLE_FORM_URL, '_blank');

            textEl.textContent = 'Redirecting to Form ✓';
            if (spinnerEl) spinnerEl.style.display = 'none';

            setTimeout(() => {
                textEl.textContent = origText;
                if (iconEl) iconEl.style.display = '';
                btn.dataset.sending = 'false';
                contactForm.reset();
            }, 2000);
        }, 1200);
    });
}
