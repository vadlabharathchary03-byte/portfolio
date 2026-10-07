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
        contactForm.addEventListener('submit', async (e) => {
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

            try {
                const response = await fetch('https://formsubmit.co/ajax/vadlabharathchary03@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ...Object.fromEntries(new FormData(contactForm).entries()),
                        _subject: subject || `Portfolio message from ${name}`
                    })
                });
                const result = await response.json();

                if (!response.ok || result.success !== 'true' && result.success !== true) {
                    throw new Error(result.message || 'Message delivery failed.');
                }

                formStatus.className = 'form-status success';
                formStatus.textContent = `Thank you, ${name}! Your message has been sent. I'll get back to you soon.`;
                contactForm.reset();
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 6000);
            } catch (error) {
                console.error('[Contact Form]', error);
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Sorry, your message could not be sent. Please email vadlabharathchary03@gmail.com directly.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
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
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let shapes = [];
    let animationFrameId = null;
    let mouse = { x: null, y: null, targetX: 0, targetY: 0, curX: 0, curY: 0 };

    // 4 Vibrant 3D Color Palettes (Blue, Purple, Orange, Green)
    const PALETTES = [
        {
            name: "blue",
            highlight: "#7dd3fc",
            base: "#0ea5e9",
            dark: "#0369a1",
            shadow: "rgba(2, 132, 199, 0.28)",
            glow: "rgba(14, 165, 233, 0.18)"
        },
        {
            name: "purple",
            highlight: "#d8b4fe",
            base: "#a855f7",
            dark: "#6b21a8",
            shadow: "rgba(168, 85, 247, 0.26)",
            glow: "rgba(168, 85, 247, 0.18)"
        },
        {
            name: "orange",
            highlight: "#fdba74",
            base: "#f97316",
            dark: "#c2410c",
            shadow: "rgba(249, 115, 22, 0.28)",
            glow: "rgba(249, 115, 22, 0.18)"
        },
        {
            name: "green",
            highlight: "#6ee7b7",
            base: "#10b981",
            dark: "#047857",
            shadow: "rgba(16, 185, 129, 0.26)",
            glow: "rgba(16, 185, 129, 0.18)"
        }
    ];

    // 3D vector rotation helpers
    function rotateX(v, a) {
        const cos = Math.cos(a), sin = Math.sin(a);
        return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
    }
    function rotateY(v, a) {
        const cos = Math.cos(a), sin = Math.sin(a);
        return [v[0] * cos + v[2] * sin, v[1], -v[0] * sin + v[2] * cos];
    }
    function rotateZ(v, a) {
        const cos = Math.cos(a), sin = Math.sin(a);
        return [v[0] * cos - v[1] * sin, v[0] * sin + v[1] * cos, v[2]];
    }
    function rotate3D(v, rx, ry, rz) {
        return rotateZ(rotateY(rotateX(v, rx), ry), rz);
    }

    class Shape3D {
        constructor() {
            this.init(true);
        }

        init(isFirst = false) {
            const types = ["sphere", "cube", "octahedron", "torus", "capsule"];
            this.type = types[Math.floor(Math.random() * types.length)];
            this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
            
            this.x = isFirst ? Math.random() * width : (Math.random() < 0.5 ? -60 : width + 60);
            this.baseY = Math.random() * height;
            this.y = this.baseY;

            // Size & depth layer
            const isMobile = width < 768;
            this.size = Math.random() * 24 + (isMobile ? 20 : 28);
            this.depth = Math.random() * 0.6 + 0.7; // 0.7 to 1.3 for parallax depth

            // Velocities
            this.vx = (Math.random() - 0.5) * 0.32;
            this.vy = (Math.random() - 0.5) * 0.18;

            // Harmonic float
            this.floatSpeed = Math.random() * 0.0018 + 0.001;
            this.floatAmp = Math.random() * 26 + 14;
            this.floatPhase = Math.random() * Math.PI * 2;

            // 3D Rotation angles & speeds
            this.rx = Math.random() * Math.PI * 2;
            this.ry = Math.random() * Math.PI * 2;
            this.rz = Math.random() * Math.PI * 2;
            this.rsx = (Math.random() - 0.5) * 0.015;
            this.rsy = (Math.random() - 0.5) * 0.018;
            this.rsz = (Math.random() - 0.5) * 0.012;

            // Mouse displacement offset with spring physics
            this.offsetX = 0;
            this.offsetY = 0;
            this.targetOffsetX = 0;
            this.targetOffsetY = 0;
            this.opacity = Math.random() * 0.15 + 0.35;
        }

        update(time) {
            // Constant drifting
            this.x += this.vx;
            this.baseY += this.vy;

            // Sine wave floating
            this.y = this.baseY + Math.sin(time * this.floatSpeed + this.floatPhase) * this.floatAmp;

            // 3D rotations
            this.rx += this.rsx;
            this.ry += this.rsy;
            this.rz += this.rsz;

            // Mouse interaction (repulsion & parallax)
            const curScreenX = this.x + mouse.curX * this.depth * 25 + this.offsetX;
            const curScreenY = this.y + mouse.curY * this.depth * 25 + this.offsetY;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = curScreenX - mouse.x;
                const dy = curScreenY - mouse.y;
                const dist = Math.hypot(dx, dy);
                const interactRadius = 180;

                if (dist < interactRadius && dist > 0) {
                    const force = (1 - dist / interactRadius) * 45;
                    this.targetOffsetX = (dx / dist) * force;
                    this.targetOffsetY = (dy / dist) * force;
                    this.rx += this.rsx * 1.5;
                    this.ry += this.rsy * 1.5;
                } else {
                    this.targetOffsetX = 0;
                    this.targetOffsetY = 0;
                }
            } else {
                this.targetOffsetX = 0;
                this.targetOffsetY = 0;
            }

            // Smooth spring return
            this.offsetX += (this.targetOffsetX - this.offsetX) * 0.08;
            this.offsetY += (this.targetOffsetY - this.offsetY) * 0.08;

            // Screen boundaries wrapping
            const pad = this.size * 2 + 50;
            if (this.x < -pad) this.x = width + pad;
            else if (this.x > width + pad) this.x = -pad;
            if (this.baseY < -pad) this.baseY = height + pad;
            else if (this.baseY > height + pad) this.baseY = -pad;
        }

        draw() {
            const renderX = this.x + mouse.curX * this.depth * 25 + this.offsetX;
            const renderY = this.y + mouse.curY * this.depth * 25 + this.offsetY;
            const s = this.size * this.depth;

            ctx.save();
            ctx.translate(renderX, renderY);
            ctx.globalAlpha = this.opacity;

            // Soft drop shadow
            this.drawDropShadow(s);

            switch (this.type) {
                case "sphere":
                    this.drawSphere(s);
                    break;
                case "cube":
                    this.drawCube(s);
                    break;
                case "octahedron":
                    this.drawOctahedron(s);
                    break;
                case "torus":
                    this.drawTorus(s);
                    break;
                case "capsule":
                    this.drawCapsule(s);
                    break;
            }

            ctx.restore();
        }

        drawDropShadow(s) {
            ctx.save();
            const shadowY = s * 1.35;
            const shadowRadiusX = s * 0.95;
            const shadowRadiusY = s * 0.32;
            const grad = ctx.createRadialGradient(0, shadowY, 0, 0, shadowY, shadowRadiusX);
            grad.addColorStop(0, this.palette.shadow);
            grad.addColorStop(0.5, this.palette.glow);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        drawSphere(s) {
            const lightOffX = -s * 0.32;
            const lightOffY = -s * 0.32;
            const grad = ctx.createRadialGradient(lightOffX, lightOffY, s * 0.08, 0, 0, s);
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.25, this.palette.highlight);
            grad.addColorStop(0.65, this.palette.base);
            grad.addColorStop(1, this.palette.dark);

            ctx.beginPath();
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Specular highlight
            const specGrad = ctx.createRadialGradient(lightOffX, lightOffY, 0, lightOffX, lightOffY, s * 0.35);
            specGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
            specGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.25)");
            specGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(lightOffX, lightOffY, s * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();

            // Orbiting accent ring
            ctx.save();
            ctx.rotate(this.rz);
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 1.45, s * 0.4, Math.PI / 4, 0, Math.PI * 2);
            ctx.strokeStyle = this.palette.highlight;
            ctx.lineWidth = Math.max(1.5, s * 0.08);
            ctx.stroke();
            ctx.restore();
        }

        drawCube(s) {
            const h = s * 0.82;
            const vertices = [
                [-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h],
                [-h, -h,  h], [h, -h,  h], [h, h,  h], [-h, h,  h]
            ];
            const faces = [
                { idx: [0, 1, 2, 3], norm: [0, 0, -1] },
                { idx: [5, 4, 7, 6], norm: [0, 0, 1] },
                { idx: [4, 0, 3, 7], norm: [-1, 0, 0] },
                { idx: [1, 5, 6, 2], norm: [1, 0, 0] },
                { idx: [4, 5, 1, 0], norm: [0, -1, 0] },
                { idx: [3, 2, 6, 7], norm: [0, 1, 0] }
            ];

            const rotatedVerts = vertices.map(v => rotate3D(v, this.rx, this.ry, this.rz));
            const lightDir = [-0.577, -0.577, 0.577];

            const sortedFaces = faces.map(f => {
                const rotNorm = rotate3D(f.norm, this.rx, this.ry, this.rz);
                const avgZ = f.idx.reduce((sum, i) => sum + rotatedVerts[i][2], 0) / 4;
                const dot = rotNorm[0] * lightDir[0] + rotNorm[1] * lightDir[1] + rotNorm[2] * lightDir[2];
                return { ...f, avgZ, dot, visible: rotNorm[2] > -0.05 };
            }).sort((a, b) => a.avgZ - b.avgZ);

            sortedFaces.forEach(f => {
                if (!f.visible) return;
                const pts = f.idx.map(i => rotatedVerts[i]);
                ctx.beginPath();
                ctx.moveTo(pts[0][0], pts[0][1]);
                for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
                ctx.closePath();

                const intensity = Math.max(0, Math.min(1, (f.dot + 1) / 2));
                let color = this.palette.base;
                if (intensity > 0.65) color = this.palette.highlight;
                else if (intensity < 0.35) color = this.palette.dark;

                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        }

        drawOctahedron(s) {
            const h = s * 1.05;
            const vertices = [
                [0, -h, 0], [0, h, 0],
                [-h * 0.75, 0, 0], [h * 0.75, 0, 0],
                [0, 0, -h * 0.75], [0, 0, h * 0.75]
            ];
            const faces = [
                [0, 2, 5], [0, 5, 3], [0, 3, 4], [0, 4, 2],
                [1, 5, 2], [1, 3, 5], [1, 4, 3], [1, 2, 4]
            ];

            const rotatedVerts = vertices.map(v => rotate3D(v, this.rx, this.ry, this.rz));
            const lightDir = [-0.5, -0.6, 0.6];

            const sortedFaces = faces.map(f => {
                const p0 = rotatedVerts[f[0]], p1 = rotatedVerts[f[1]], p2 = rotatedVerts[f[2]];
                const v0 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
                const v1 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
                const norm = [
                    v0[1] * v1[2] - v0[2] * v1[1],
                    v0[2] * v1[0] - v0[0] * v1[2],
                    v0[0] * v1[1] - v0[1] * v1[0]
                ];
                const len = Math.hypot(norm[0], norm[1], norm[2]) || 1;
                const unitNorm = [norm[0] / len, norm[1] / len, norm[2] / len];
                const avgZ = (p0[2] + p1[2] + p2[2]) / 3;
                const dot = unitNorm[0] * lightDir[0] + unitNorm[1] * lightDir[1] + unitNorm[2] * lightDir[2];
                return { f, avgZ, dot, visible: unitNorm[2] > -0.05, p0, p1, p2 };
            }).sort((a, b) => a.avgZ - b.avgZ);

            sortedFaces.forEach(item => {
                if (!item.visible) return;
                ctx.beginPath();
                ctx.moveTo(item.p0[0], item.p0[1]);
                ctx.lineTo(item.p1[0], item.p1[1]);
                ctx.lineTo(item.p2[0], item.p2[1]);
                ctx.closePath();

                const intensity = Math.max(0, Math.min(1, (item.dot + 1) / 2));
                let color = this.palette.base;
                if (intensity > 0.68) color = this.palette.highlight;
                else if (intensity < 0.36) color = this.palette.dark;

                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        }

        drawTorus(s) {
            ctx.save();
            ctx.rotate(this.rz);
            const outerR = s * 0.95;
            const innerR = s * 0.52;
            const grad = ctx.createLinearGradient(-outerR, -outerR, outerR, outerR);
            grad.addColorStop(0, this.palette.highlight);
            grad.addColorStop(0.5, this.palette.base);
            grad.addColorStop(1, this.palette.dark);

            ctx.beginPath();
            ctx.arc(0, 0, outerR, 0, Math.PI * 2, false);
            ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, outerR, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.restore();
        }

        drawCapsule(s) {
            ctx.save();
            ctx.rotate(this.rz);
            const w = s * 0.6;
            const h = s * 1.5;
            const r = w / 2;

            const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
            grad.addColorStop(0, this.palette.dark);
            grad.addColorStop(0.3, this.palette.highlight);
            grad.addColorStop(0.7, this.palette.base);
            grad.addColorStop(1, this.palette.dark);

            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, [r]);
            ctx.fillStyle = grad;
            ctx.fill();

            // Specular sheen stripe
            ctx.beginPath();
            ctx.roundRect(-w * 0.25, -h * 0.4, w * 0.18, h * 0.8, [3]);
            ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
            ctx.fill();

            ctx.restore();
        }
    }

    function createShapes() {
        shapes = [];
        const isMobile = width < 768;
        const count = isMobile ? 10 : Math.min(20, Math.max(14, Math.floor((width * height) / 75000)));
        for (let i = 0; i < count; i++) {
            shapes.push(new Shape3D());
        }
    }

    function handleResize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.scale(dpr, dpr);
        createShapes();
    }

    function render(currentTime) {
        ctx.clearRect(0, 0, width, height);

        // Smooth mouse lerping
        mouse.curX += (mouse.targetX - mouse.curX) * 0.05;
        mouse.curY += (mouse.targetY - mouse.curY) * 0.05;

        // Sort by simulated depth for realistic layering
        shapes.sort((a, b) => a.depth - b.depth);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].update(currentTime);
            shapes[i].draw();
        }

        animationFrameId = requestAnimationFrame(render);
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.targetX = (e.clientX / width - 0.5) * 2;
        mouse.targetY = (e.clientY / height - 0.5) * 2;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
        mouse.targetX = 0;
        mouse.targetY = 0;
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.targetX = (e.touches[0].clientX / width - 0.5) * 2;
            mouse.targetY = (e.touches[0].clientY / height - 0.5) * 2;
        }
    }, { passive: true });

    window.addEventListener("touchend", () => {
        mouse.x = null;
        mouse.y = null;
        mouse.targetX = 0;
        mouse.targetY = 0;
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(render);
        }
    });

    handleResize();
    animationFrameId = requestAnimationFrame(render);
}


/* ==========================================================================
   GitHub Live Activity Feed
   Uses GitHub's free public API — zero backend, zero token needed.
   The laziest senior dev approach: let them do the work.
   ========================================================================== */

(function initGitHubFeed() {
    const GH_USER = 'vadlabharathchary03-byte';
    const API_BASE = 'https://api.github.com';

    /* ---- Language colour map (GitHub official colours) ---- */
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26',
        CSS: '#563d7c', Python: '#3572A5', Java: '#b07219',
        'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
        PHP: '#4F5D95', Ruby: '#701516', Go: '#00ADD8',
        Rust: '#dea584', Shell: '#89e051', Vue: '#41b883',
        SCSS: '#c6538c', Dart: '#00B4AB', default: '#ff6b00'
    };

    /* ---- SVG icon helpers ---- */
    const icons = {
        repo:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
        star:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
        fork:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
        push:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path></svg>`,
        create: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
        pr:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`,
        issues: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
        watch:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    };

    /* ---- Relative time ---- */
    function timeAgo(dateStr) {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60)    return 'just now';
        if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /* ---- Event descriptor ---- */
    function describeEvent(ev) {
        const repo = ev.repo.name.split('/')[1] || ev.repo.name;
        switch (ev.type) {
            case 'PushEvent': {
                const n = ev.payload.commits ? ev.payload.commits.length : 1;
                return { icon: icons.push, text: `Pushed <strong>${n} commit${n > 1 ? 's' : ''}</strong> to <strong>${repo}</strong>` };
            }
            case 'CreateEvent':
                return { icon: icons.create, text: `Created ${ev.payload.ref_type} <strong>${ev.payload.ref || repo}</strong>` };
            case 'ForkEvent':
                return { icon: icons.fork, text: `Forked <strong>${repo}</strong>` };
            case 'WatchEvent':
                return { icon: icons.watch, text: `Starred <strong>${repo}</strong>` };
            case 'PullRequestEvent':
                return { icon: icons.pr, text: `${ev.payload.action === 'opened' ? 'Opened' : 'Updated'} PR in <strong>${repo}</strong>` };
            case 'IssuesEvent':
                return { icon: icons.issues, text: `${ev.payload.action} issue in <strong>${repo}</strong>` };
            default:
                return { icon: icons.repo, text: `Activity on <strong>${repo}</strong>` };
        }
    }

    /* ---- Render repos ---- */
    function renderRepos(repos) {
        const el = document.getElementById('githubReposList');
        if (!el) return;
        const top = repos
            .filter(r => !r.fork)
            .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
            .slice(0, 6);

        if (!top.length) {
            el.innerHTML = `<div class="gh-empty-state">${icons.repo}<br>No public repos yet.</div>`;
            return;
        }

        el.innerHTML = top.map((r, i) => {
            const color = LANG_COLORS[r.language] || LANG_COLORS.default;
            return `
            <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="gh-repo-card"
               style="opacity:0;animation:fadeSlideIn 0.4s ease ${i * 80}ms forwards;">
                <div class="gh-repo-name">
                    ${icons.repo} ${r.name}
                    ${r.archived ? '<span class="gh-repo-tag">Archived</span>' : ''}
                </div>
                ${r.description
                    ? `<p class="gh-repo-desc">${r.description}</p>`
                    : `<p class="gh-repo-desc" style="opacity:.4;font-style:italic;">No description.</p>`}
                <div class="gh-repo-meta">
                    ${r.language ? `<span class="gh-repo-meta-item"><span class="gh-lang-dot" style="background:${color};box-shadow:0 0 6px ${color}66;"></span>${r.language}</span>` : ''}
                    <span class="gh-repo-meta-item">${icons.star} ${r.stargazers_count}</span>
                    <span class="gh-repo-meta-item">${icons.fork} ${r.forks_count}</span>
                    <span class="gh-repo-meta-item" style="margin-left:auto;color:var(--text-light);">Updated ${timeAgo(r.updated_at)}</span>
                </div>
            </a>`;
        }).join('');
    }

    /* ---- Render activity ---- */
    function renderActivity(events) {
        const el = document.getElementById('githubActivityFeed');
        if (!el) return;
        const filtered = events
            .filter(ev => ['PushEvent','CreateEvent','ForkEvent','WatchEvent','PullRequestEvent','IssuesEvent'].includes(ev.type))
            .slice(0, 7);

        if (!filtered.length) {
            el.innerHTML = `<div class="gh-empty-state">${icons.push}<br>No recent public activity.</div>`;
            return;
        }

        el.innerHTML = filtered.map((ev, i) => {
            const { icon, text } = describeEvent(ev);
            return `
            <div class="gh-event-item" style="animation-delay:${i * 60}ms;">
                <div class="gh-event-icon">${icon}</div>
                <div class="gh-event-body">
                    <div class="gh-event-desc">${text}</div>
                    <div class="gh-event-time">${timeAgo(ev.created_at)}</div>
                </div>
            </div>`;
        }).join('');
    }

    /* ---- Count-up animation ---- */
    function animateCount(el, target) {
        const dur = 1200, start = performance.now();
        (function step(now) {
            const t = Math.min((now - start) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
            if (t < 1) requestAnimationFrame(step);
        })(start);
    }

    /* ---- Render profile bar ---- */
    function renderProfile(u) {
        const av = document.getElementById('githubAvatar');
        if (av) { av.src = u.avatar_url; av.alt = u.login; }
        const map = { ghRepos: u.public_repos, ghFollowers: u.followers, ghFollowing: u.following, ghGists: u.public_gists };
        Object.entries(map).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) animateCount(el, val);
        });
        const link = document.getElementById('ghProfileLink');
        if (link && u.html_url) link.href = u.html_url;
    }

    /* ---- Fetch wrapper ---- */
    async function ghFetch(path) {
        const res = await fetch(API_BASE + path, { headers: { Accept: 'application/vnd.github.v3+json' } });
        if (!res.ok) throw new Error('GitHub ' + res.status + ': ' + path);
        return res.json();
    }

    /* ---- Main load ---- */
    async function loadGitHubData() {
        try {
            const [user, repos, events] = await Promise.all([
                ghFetch('/users/' + GH_USER),
                ghFetch('/users/' + GH_USER + '/repos?per_page=100&sort=updated'),
                ghFetch('/users/' + GH_USER + '/events/public?per_page=30')
            ]);
            renderProfile(user);
            renderRepos(repos);
            renderActivity(events);
        } catch (err) {
            console.warn('[GitHub Feed]', err.message);
            // Graceful degradation — show avatar from GitHub CDN, friendly message
            const av = document.getElementById('githubAvatar');
            if (av) av.src = 'https://github.com/' + GH_USER + '.png?size=128';
            const fallback = `<div class="gh-empty-state">${icons.issues}<br>Rate limit hit. <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;">View on GitHub →</a></div>`;
            const r = document.getElementById('githubReposList');
            const a = document.getElementById('githubActivityFeed');
            if (r) r.innerHTML = fallback;
            if (a) a.innerHTML = fallback;
        }
    }

    /* ---- Lazy-load: only trigger when section enters viewport ---- */
    const section = document.getElementById('github');
    if (!section) return;
    const obs = new IntersectionObserver((entries, o) => {
        if (entries[0].isIntersecting) { o.disconnect(); loadGitHubData(); }
    }, { threshold: 0.1 });
    obs.observe(section);
})();

