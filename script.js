/* ==========================================================================
   Vadla Bharath Chary - Portfolio Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header & Scroll Effects ---
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(sec => sectionObserver.observe(sec));

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const subject = document.getElementById('userSubject').value.trim();
            const message = document.getElementById('userMessage').value.trim();

            if (!name || !email || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all required fields (Name, Email, and Message).';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            // Simulate server response
            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`;
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 6000);
            }, 1000);
        });
    }

    // --- CV Modal & Download Preview ---
    const cvBtn = document.getElementById('downloadCvBtn');
    const resumeModal = document.getElementById('resumeModal');
    const closeModal = document.getElementById('closeModal');
    const printCvBtn = document.getElementById('printCvBtn');

    if (cvBtn && resumeModal) {
        cvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModal && resumeModal) {
        closeModal.addEventListener('click', () => {
            resumeModal.classList.remove('open');
            document.body.style.overflow = '';
        });

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    if (printCvBtn) {
        printCvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Keyboard navigation (Escape to close modal)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
            resumeModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // --- Initialize Interactive Background Animation ---
    initBackgroundCanvas();
});

/**
 * Interactive Background Constellation & Particle Animation
 * Features dynamic floating nodes, proximity connections, and mouse parallax interaction
 */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationFrameId = null;
    let mouse = { x: null, y: null, radius: 150 };

    const colorPalette = [
        'rgba(255, 107, 0, ',    // Primary orange
        'rgba(255, 133, 51, ',   // Light orange
        'rgba(0, 210, 255, ',    // Cyan accent
        'rgba(157, 78, 221, ',   // Purple accent
        'rgba(248, 250, 252, '   // Bright star
    ];

    function handleResize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        createParticles();
    }

    class Particle {
        constructor() {
            this.init(true);
        }

        init(isFirst = false) {
            this.x = isFirst ? Math.random() * width : (Math.random() < 0.5 ? 0 : width);
            this.y = isFirst ? Math.random() * height : Math.random() * height;
            this.size = Math.random() * 2.2 + 0.8;
            this.baseAlpha = Math.random() * 0.45 + 0.25;
            this.alpha = this.baseAlpha;
            this.vx = (Math.random() - 0.5) * 0.65;
            this.vy = (Math.random() - 0.5) * 0.65;
            this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            this.pulseSpeed = Math.random() * 0.02 + 0.008;
            this.pulseAngle = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Breathing pulse effect
            this.pulseAngle += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.18;

            // Gentle mouse response (slight magnetic push/drift)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (1 - dist / mouse.radius) * 1.8;
                    this.x -= (dx / dist) * force;
                    this.y -= (dy / dist) * force;
                }
            }

            // Screen edge wrapping
            if (this.x < -15) this.x = width + 15;
            else if (this.x > width + 15) this.x = -15;
            if (this.y < -15) this.y = height + 15;
            else if (this.y > height + 15) this.y = -15;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${Math.max(0, Math.min(1, this.alpha))})`;
            ctx.shadowBlur = this.size > 2 ? 8 : 0;
            ctx.shadowColor = 'rgba(255, 107, 0, 0.4)';
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
    }

    function createParticles() {
        particles = [];
        const isMobile = width < 768;
        const particleCount = isMobile ? 36 : Math.min(80, Math.max(45, Math.floor((width * height) / 16000)));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const isMobile = width < 768;
        const maxDistance = isMobile ? 95 : 130;
        const pLen = particles.length;

        for (let i = 0; i < pLen; i++) {
            for (let j = i + 1; j < pLen; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDistance) {
                    const opacity = (1 - dist / maxDistance) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 107, 0, ${opacity})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        const pLen = particles.length;
        for (let i = 0; i < pLen; i++) {
            particles[i].update();
            particles[i].draw();
        }

        drawConnections();
        animationFrameId = requestAnimationFrame(render);
    }

    // Event Listeners
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(render);
        }
    });

    handleResize();
    render();
}

