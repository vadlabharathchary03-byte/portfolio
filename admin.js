/* ==========================================================================
   Admin Full-Page Interactive Controller
   ========================================================================== */

const STORAGE_KEY_INQUIRIES = 'bharath_portal_submissions';
const STORAGE_KEY_AUTH = 'bharath_portal_auth_user';

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getInquiries() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_INQUIRIES);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to read inquiries from localStorage', e);
        return [];
    }
}

function saveInquiries(list) {
    try {
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
    } catch (e) {
        console.error('Failed to save inquiries to localStorage', e);
    }
}

function addInquiry(inquiry) {
    const list = getInquiries();
    list.unshift(inquiry);
    saveInquiries(list);
    renderDashboard();
}

function deleteInquiry(id) {
    let list = getInquiries();
    list = list.filter(item => item.id !== id);
    saveInquiries(list);
    renderDashboard();
}

function clearAllInquiries() {
    if (confirm('Are you sure you want to clear all inquiries from this browser?')) {
        saveInquiries([]);
        renderDashboard();
    }
}

function getStoredAuth() {
    try {
        return localStorage.getItem(STORAGE_KEY_AUTH) || sessionStorage.getItem(STORAGE_KEY_AUTH);
    } catch (e) {
        return null;
    }
}

function setStoredAuth(username, remember) {
    try {
        if (remember) {
            localStorage.setItem(STORAGE_KEY_AUTH, username);
        } else {
            sessionStorage.setItem(STORAGE_KEY_AUTH, username);
        }
    } catch (e) {}
}

function clearStoredAuth() {
    try {
        localStorage.removeItem(STORAGE_KEY_AUTH);
        sessionStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {}
}

// Interactive 3D Shapes Background Canvas (Light Theme)
// Featuring 3D Star, Pyramid, Sphere, and Cylinder with physics and mouse parallax
function initAdminCanvas() {
    const canvas = document.getElementById('adminBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let shapes = [];
    let animationFrameId = null;
    let mouse = { x: null, y: null, targetX: 0, targetY: 0, curX: 0, curY: 0 };

    // Rich Light-Theme Palettes (Tailored for high clarity on light backgrounds)
    const PALETTES = [
        {
            name: 'sky',
            highlight: '#7dd3fc',
            base: '#0284c7',
            dark: '#0369a1',
            shadow: 'rgba(2, 132, 199, 0.22)',
            glow: 'rgba(14, 165, 233, 0.16)'
        },
        {
            name: 'violet',
            highlight: '#c4b5fd',
            base: '#7c3aed',
            dark: '#5b21b6',
            shadow: 'rgba(124, 58, 237, 0.20)',
            glow: 'rgba(139, 92, 246, 0.16)'
        },
        {
            name: 'amber',
            highlight: '#fcd34d',
            base: '#ea580c',
            dark: '#c2410c',
            shadow: 'rgba(234, 88, 12, 0.22)',
            glow: 'rgba(249, 115, 22, 0.16)'
        },
        {
            name: 'emerald',
            highlight: '#6ee7b7',
            base: '#059669',
            dark: '#047857',
            shadow: 'rgba(5, 150, 105, 0.20)',
            glow: 'rgba(16, 185, 129, 0.16)'
        },
        {
            name: 'rose',
            highlight: '#fda4af',
            base: '#e11d48',
            dark: '#9f1239',
            shadow: 'rgba(225, 29, 72, 0.20)',
            glow: 'rgba(244, 63, 94, 0.16)'
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
            const types = ['star', 'pyramid', 'sphere', 'cylinder'];
            this.type = types[Math.floor(Math.random() * types.length)];
            this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];

            this.x = isFirst ? Math.random() * width : (Math.random() < 0.5 ? -60 : width + 60);
            this.baseY = Math.random() * height;
            this.y = this.baseY;

            const isMobile = width < 768;
            this.size = Math.random() * 22 + (isMobile ? 18 : 26);
            this.depth = Math.random() * 0.6 + 0.7;

            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.2;

            this.floatSpeed = Math.random() * 0.0018 + 0.001;
            this.floatAmp = Math.random() * 24 + 14;
            this.floatPhase = Math.random() * Math.PI * 2;

            this.rx = Math.random() * Math.PI * 2;
            this.ry = Math.random() * Math.PI * 2;
            this.rz = Math.random() * Math.PI * 2;
            this.rsx = (Math.random() - 0.5) * 0.015;
            this.rsy = (Math.random() - 0.5) * 0.018;
            this.rsz = (Math.random() - 0.5) * 0.012;

            this.offsetX = 0;
            this.offsetY = 0;
            this.targetOffsetX = 0;
            this.targetOffsetY = 0;
            this.opacity = Math.random() * 0.22 + 0.55; // Crisp vibrant visibility in light theme
        }

        update(time) {
            this.x += this.vx;
            this.baseY += this.vy;
            this.y = this.baseY + Math.sin(time * this.floatSpeed + this.floatPhase) * this.floatAmp;

            this.rx += this.rsx;
            this.ry += this.rsy;
            this.rz += this.rsz;

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

            this.offsetX += (this.targetOffsetX - this.offsetX) * 0.08;
            this.offsetY += (this.targetOffsetY - this.offsetY) * 0.08;

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

            this.drawDropShadow(s);

            switch (this.type) {
                case 'star':
                    this.drawStar(s);
                    break;
                case 'pyramid':
                    this.drawPyramid(s);
                    break;
                case 'sphere':
                    this.drawSphere(s);
                    break;
                case 'cylinder':
                    this.drawCylinder(s);
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
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        /* --- 1. 3D SPHERE --- */
        drawSphere(s) {
            const lightOffX = -s * 0.32;
            const lightOffY = -s * 0.32;
            const grad = ctx.createRadialGradient(lightOffX, lightOffY, s * 0.08, 0, 0, s);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.25, this.palette.highlight);
            grad.addColorStop(0.65, this.palette.base);
            grad.addColorStop(1, this.palette.dark);

            ctx.beginPath();
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Specular sheen
            const specGrad = ctx.createRadialGradient(lightOffX, lightOffY, 0, lightOffX, lightOffY, s * 0.35);
            specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            specGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
            specGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(lightOffX, lightOffY, s * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();

            // 3D Rotating Longitude & Latitude rings
            const numRings = 2;
            for (let r = 0; r < numRings; r++) {
                const angleOffset = (r * Math.PI) / numRings;
                ctx.save();
                ctx.rotate(this.rz + angleOffset);
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 1.02, s * Math.abs(Math.sin(this.rx + angleOffset)) * 0.85 + 2, this.ry, 0, Math.PI * 2);
                ctx.strokeStyle = this.palette.highlight;
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.restore();
            }
        }

        /* --- 2. 3D PYRAMID --- */
        drawPyramid(s) {
            const b = s * 0.82;
            const h = s * 0.65;
            const apexY = -s * 0.95;

            const vertices = [
                [-b, h, -b],
                [ b, h, -b],
                [ b, h,  b],
                [-b, h,  b],
                [ 0, apexY, 0]
            ];

            const faces = [
                { idx: [4, 0, 1] },
                { idx: [4, 1, 2] },
                { idx: [4, 2, 3] },
                { idx: [4, 3, 0] },
                { idx: [0, 3, 2, 1] }
            ];

            const rotVerts = vertices.map(v => rotate3D(v, this.rx, this.ry, this.rz));
            const lightDir = [-0.577, -0.577, 0.577];

            const sortedFaces = faces.map(f => {
                const pts = f.idx.map(i => rotVerts[i]);
                const ux = pts[1][0] - pts[0][0], uy = pts[1][1] - pts[0][1], uz = pts[1][2] - pts[0][2];
                const vx = pts[2][0] - pts[0][0], vy = pts[2][1] - pts[0][1], vz = pts[2][2] - pts[0][2];
                const nx = uy * vz - uz * vy;
                const ny = uz * vx - ux * vz;
                const nz = ux * vy - uy * vx;
                const len = Math.hypot(nx, ny, nz) || 1;
                const norm = [nx / len, ny / len, nz / len];

                const avgZ = pts.reduce((sum, p) => sum + p[2], 0) / pts.length;
                const dot = norm[0] * lightDir[0] + norm[1] * lightDir[1] + norm[2] * lightDir[2];
                return { pts, avgZ, dot, visible: norm[2] > -0.1 };
            }).sort((a, b) => a.avgZ - b.avgZ);

            sortedFaces.forEach(f => {
                if (!f.visible) return;
                ctx.beginPath();
                ctx.moveTo(f.pts[0][0], f.pts[0][1]);
                for (let k = 1; k < f.pts.length; k++) ctx.lineTo(f.pts[k][0], f.pts[k][1]);
                ctx.closePath();

                const intensity = Math.max(0, Math.min(1, (f.dot + 1) / 2));
                let color = this.palette.base;
                if (intensity > 0.65) color = this.palette.highlight;
                else if (intensity < 0.35) color = this.palette.dark;

                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        }

        /* --- 3. 3D STAR --- */
        drawStar(s) {
            const points = 5;
            const outerR = s * 1.15;
            const innerR = s * 0.48;
            const depth = s * 0.42;

            const starRing = [];
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const r = i % 2 === 0 ? outerR : innerR;
                starRing.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
            }

            const frontApex = [0, 0, depth];
            const backApex = [0, 0, -depth];

            const allVerts = [...starRing, frontApex, backApex];
            const frontApexIdx = starRing.length;
            const backApexIdx = starRing.length + 1;

            const faces = [];
            for (let i = 0; i < points * 2; i++) {
                const next = (i + 1) % (points * 2);
                faces.push({ idx: [frontApexIdx, i, next] });
                faces.push({ idx: [backApexIdx, next, i] });
            }

            const rotVerts = allVerts.map(v => rotate3D(v, this.rx, this.ry, this.rz));
            const lightDir = [-0.5, -0.6, 0.6];

            const sortedFaces = faces.map(f => {
                const pts = f.idx.map(i => rotVerts[i]);
                const ux = pts[1][0] - pts[0][0], uy = pts[1][1] - pts[0][1], uz = pts[1][2] - pts[0][2];
                const vx = pts[2][0] - pts[0][0], vy = pts[2][1] - pts[0][1], vz = pts[2][2] - pts[0][2];
                const nx = uy * vz - uz * vy;
                const ny = uz * vx - ux * vz;
                const nz = ux * vy - uy * vx;
                const len = Math.hypot(nx, ny, nz) || 1;
                const norm = [nx / len, ny / len, nz / len];

                const avgZ = (pts[0][2] + pts[1][2] + pts[2][2]) / 3;
                const dot = norm[0] * lightDir[0] + norm[1] * lightDir[1] + norm[2] * lightDir[2];
                return { pts, avgZ, dot, visible: norm[2] > -0.05 };
            }).sort((a, b) => a.avgZ - b.avgZ);

            sortedFaces.forEach(f => {
                if (!f.visible) return;
                ctx.beginPath();
                ctx.moveTo(f.pts[0][0], f.pts[0][1]);
                ctx.lineTo(f.pts[1][0], f.pts[1][1]);
                ctx.lineTo(f.pts[2][0], f.pts[2][1]);
                ctx.closePath();

                const intensity = Math.max(0, Math.min(1, (f.dot + 1) / 2));
                let color = this.palette.base;
                if (intensity > 0.68) color = this.palette.highlight;
                else if (intensity < 0.32) color = this.palette.dark;

                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });
        }

        /* --- 4. 3D CYLINDER --- */
        drawCylinder(s) {
            const N = 12;
            const r = s * 0.65;
            const h = s * 0.78;

            const topVerts = [];
            const botVerts = [];
            for (let i = 0; i < N; i++) {
                const angle = (i * 2 * Math.PI) / N;
                const x = r * Math.cos(angle);
                const z = r * Math.sin(angle);
                topVerts.push([x, -h, z]);
                botVerts.push([x,  h, z]);
            }

            const allVerts = [...topVerts, ...botVerts];
            const rotVerts = allVerts.map(v => rotate3D(v, this.rx, this.ry, this.rz));
            const lightDir = [-0.577, -0.577, 0.577];

            const faces = [];
            for (let i = 0; i < N; i++) {
                const next = (i + 1) % N;
                faces.push({
                    idx: [i, next, N + next, N + i],
                    isCap: false
                });
            }
            const topCapIndices = [];
            for (let i = N - 1; i >= 0; i--) topCapIndices.push(i);
            faces.push({ idx: topCapIndices, isCap: true });

            const botCapIndices = [];
            for (let i = 0; i < N; i++) botCapIndices.push(N + i);
            faces.push({ idx: botCapIndices, isCap: true });

            const sortedFaces = faces.map(f => {
                const pts = f.idx.map(idx => rotVerts[idx]);
                const ux = pts[1][0] - pts[0][0], uy = pts[1][1] - pts[0][1], uz = pts[1][2] - pts[0][2];
                const vx = pts[2][0] - pts[0][0], vy = pts[2][1] - pts[0][1], vz = pts[2][2] - pts[0][2];
                const nx = uy * vz - uz * vy;
                const ny = uz * vx - ux * vz;
                const nz = ux * vy - uy * vx;
                const len = Math.hypot(nx, ny, nz) || 1;
                const norm = [nx / len, ny / len, nz / len];

                const avgZ = pts.reduce((sum, p) => sum + p[2], 0) / pts.length;
                const dot = norm[0] * lightDir[0] + norm[1] * lightDir[1] + norm[2] * lightDir[2];
                return { pts, avgZ, dot, visible: norm[2] > -0.05, isCap: f.isCap };
            }).sort((a, b) => a.avgZ - b.avgZ);

            sortedFaces.forEach(f => {
                if (!f.visible) return;
                ctx.beginPath();
                ctx.moveTo(f.pts[0][0], f.pts[0][1]);
                for (let k = 1; k < f.pts.length; k++) ctx.lineTo(f.pts[k][0], f.pts[k][1]);
                ctx.closePath();

                const intensity = Math.max(0, Math.min(1, (f.dot + 1) / 2));
                let color = this.palette.base;
                if (intensity > 0.65) color = this.palette.highlight;
                else if (intensity < 0.35) color = this.palette.dark;

                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });
        }
    }

    function createShapes() {
        shapes = [];
        const isMobile = width < 768;
        const count = isMobile ? 12 : Math.min(22, Math.max(14, Math.floor((width * height) / 75000)));
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
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        createShapes();
    }

    function render(currentTime) {
        ctx.clearRect(0, 0, width, height);

        mouse.curX += (mouse.targetX - mouse.curX) * 0.05;
        mouse.curY += (mouse.targetY - mouse.curY) * 0.05;

        shapes.sort((a, b) => a.depth - b.depth);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].update(currentTime);
            shapes[i].draw();
        }

        animationFrameId = requestAnimationFrame(render);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.targetX = (e.clientX / width - 0.5) * 2;
        mouse.targetY = (e.clientY / height - 0.5) * 2;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        mouse.targetX = 0;
        mouse.targetY = 0;
    });

    handleResize();
    animationFrameId = requestAnimationFrame(render);
}

// UI State Management
function initAdminApp() {
    initAdminCanvas();

    const loginLayout = document.getElementById('adminLoginLayout');
    const dashboardLayout = document.getElementById('adminDashboardLayout');

    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginErrorAlert');
    const quickFillBtn = document.getElementById('loginQuickFillBtn');
    const togglePassBtn = document.getElementById('toggleLoginPass');
    const passInput = document.getElementById('adminPassword');
    const eyeShow = document.getElementById('eyeShow');
    const eyeHide = document.getElementById('eyeHide');

    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    const addSampleBtn = document.getElementById('sidebarAddSampleBtn');
    const exportCsvBtn = document.getElementById('sidebarExportCsvBtn');
    const clearAllBtn = document.getElementById('sidebarClearAllBtn');
    const refreshBtn = document.getElementById('dashRefreshBtn');
    const searchInput = document.getElementById('dashSearchInput');

    function checkAuthState() {
        const user = getStoredAuth();
        if (user) {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        if (loginLayout) loginLayout.style.display = 'flex';
        if (dashboardLayout) dashboardLayout.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        setTimeout(() => {
            const u = document.getElementById('adminUsername');
            if (u) u.focus();
        }, 100);
    }

    function showDashboard() {
        if (loginLayout) loginLayout.style.display = 'none';
        if (dashboardLayout) dashboardLayout.style.display = 'flex';
        renderDashboard();
    }

    // Toggle Password Visibility
    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            if (eyeShow && eyeHide) {
                eyeShow.style.display = isPass ? 'none' : 'block';
                eyeHide.style.display = isPass ? 'block' : 'none';
            }
        });
    }

    // Quick Fill Demo
    if (quickFillBtn) {
        quickFillBtn.addEventListener('click', () => {
            const u = document.getElementById('adminUsername');
            const p = document.getElementById('adminPassword');
            if (u) u.value = 'admin';
            if (p) p.value = 'admin123';
            if (loginError) loginError.style.display = 'none';
            if (p) p.focus();
        });
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = (document.getElementById('adminUsername')?.value || '').trim();
            const p = (document.getElementById('adminPassword')?.value || '').trim();
            const rem = document.getElementById('adminRemember')?.checked ?? true;

            const isValid = (
                (u.toLowerCase() === 'bharath8635' && p === 'Vadla@') ||
                (u.toLowerCase() === 'admin' && (p === 'admin123' || p === 'Vadla@'))
            );

            if (isValid) {
                setStoredAuth(u, rem);
                if (loginError) loginError.style.display = 'none';
                showDashboard();
            } else {
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.textContent = 'Invalid username or password. Please check your credentials.';
                }
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearStoredAuth();
            showLogin();
        });
    }

    // Sidebar Action: Add Sample Test
    if (addSampleBtn) {
        addSampleBtn.addEventListener('click', addSampleInquiry);
    }

    // Sidebar Action: Export CSV
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportCSV);
    }

    // Sidebar Action: Clear All
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllInquiries);
    }

    // Top Action: Refresh
    if (refreshBtn) {
        refreshBtn.addEventListener('click', renderDashboard);
    }

    // Search Filter
    if (searchInput) {
        searchInput.addEventListener('input', renderDashboard);
    }

    // Add Sample Inquiry Helper
    function addSampleInquiry() {
        const names = ['Kavya Reddy', 'Rohan Verma', 'Sarah Jenkins', 'Sai Karthik', 'Alex Rivera'];
        const emails = ['kavya.reddy@gmail.com', 'rohan.v@techcorp.io', 'sarah.j@designdrive.com', 'sai.karthik@startup.in', 'alex@riveramedia.com'];
        const subjects = ['Front-End Collaboration', 'Website Redesign Project', 'Freelance React Developer', 'UI Consultation', 'Job Opportunity'];
        const messages = [
            'Hi Bharath, I came across your portfolio and was impressed by your clean design and animations. We are looking for a developer for our modern web portal. Let us know your availability!',
            'Hello Vadla Bharath! We need a front-end specialist to build responsive dashboard components. Would love to collaborate with you on our upcoming project.',
            'Hi Bharath! Fantastic portfolio with great attention to detail. Let us connect regarding a full-time or contract opportunity.'
        ];

        const idx = Math.floor(Math.random() * names.length);
        const mIdx = Math.floor(Math.random() * messages.length);
        const now = new Date();

        const sample = {
            id: 'inq_' + Date.now(),
            name: names[idx],
            email: emails[idx],
            subject: subjects[idx],
            message: messages[mIdx],
            createdAt: now.toISOString(),
            formattedDate: now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        addInquiry(sample);
    }

    // Export CSV Helper
    function exportCSV() {
        const inquiries = getInquiries();
        if (inquiries.length === 0) {
            alert('No inquiries found to export.');
            return;
        }

        const headers = ['ID', 'Date', 'Name', 'Email', 'Subject', 'Message'];
        const rows = inquiries.map(item => [
            `"${item.id}"`,
            `"${item.formattedDate || item.createdAt}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${(item.email || '').replace(/"/g, '""')}"`,
            `"${(item.subject || '').replace(/"/g, '""')}"`,
            `"${(item.message || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Render Dashboard UI
    function renderDashboard() {
        const container = document.getElementById('dashInquiriesContainer');
        const totalCountEl = document.getElementById('dashTotalCount');
        const latestTimeEl = document.getElementById('dashLatestTime');
        const sidebarBadge = document.getElementById('sidebarBadgeCount');
        const searchInput = document.getElementById('dashSearchInput');

        const inquiries = getInquiries();

        if (totalCountEl) totalCountEl.textContent = inquiries.length;
        if (sidebarBadge) sidebarBadge.textContent = inquiries.length;
        if (latestTimeEl) {
            latestTimeEl.textContent = inquiries.length > 0 ? (inquiries[0].formattedDate || 'Recent') : '-';
        }

        if (!container) return;

        let filtered = inquiries;
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        if (query) {
            filtered = inquiries.filter(item => {
                return (
                    (item.name && item.name.toLowerCase().includes(query)) ||
                    (item.email && item.email.toLowerCase().includes(query)) ||
                    (item.subject && item.subject.toLowerCase().includes(query)) ||
                    (item.message && item.message.toLowerCase().includes(query))
                );
            });
        }

        if (filtered.length === 0) {
            if (query) {
                container.innerHTML = `
                    <div class="empty-state-card">
                        <div class="empty-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <h3 class="empty-title">No matching inquiries found</h3>
                        <p class="empty-desc">No inquiries matching "${escapeHtml(query)}". Try another search keyword.</p>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="empty-state-card">
                        <div class="empty-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <h3 class="empty-title">No inquiries recorded yet</h3>
                        <p class="empty-desc">Submissions from the portfolio contact form will automatically appear here in real-time.</p>
                        <button type="button" class="btn-empty-sample" id="emptyAddSampleBtn">
                            + Add Sample Inquiry Now
                        </button>
                    </div>
                `;
                const emptyBtn = document.getElementById('emptyAddSampleBtn');
                if (emptyBtn) emptyBtn.addEventListener('click', addSampleInquiry);
            }
            return;
        }

        let html = '';
        filtered.forEach(item => {
            html += `
                <div class="inquiry-card" id="inq_${item.id}">
                    <div class="inquiry-header">
                        <div class="inquiry-author-info">
                            <div class="inquiry-name">${escapeHtml(item.name)}</div>
                            <a href="mailto:${encodeURIComponent(item.email)}" class="inquiry-email">
                                ${escapeHtml(item.email)}
                            </a>
                        </div>
                        <span class="inquiry-date">${escapeHtml(item.formattedDate || 'Recorded')}</span>
                    </div>

                    ${item.subject ? `<div class="inquiry-subject">${escapeHtml(item.subject)}</div>` : ''}

                    <div class="inquiry-message">${escapeHtml(item.message)}</div>

                    <div class="inquiry-actions">
                        <a href="mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent('Re: ' + (item.subject || 'Portfolio Inquiry'))}" class="inquiry-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>Reply</span>
                        </a>
                        <button type="button" class="inquiry-btn" data-copy="${item.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span class="btn-copy-label">Copy Details</span>
                        </button>
                        <button type="button" class="inquiry-btn btn-del" data-del="${item.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Attach action handlers
        container.querySelectorAll('[data-del]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-del');
                deleteInquiry(id);
            });
        });

        container.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-copy');
                const item = inquiries.find(it => it.id === id);
                if (item) {
                    const str = `Name: ${item.name}\nEmail: ${item.email}\nSubject: ${item.subject}\nDate: ${item.formattedDate}\nMessage: ${item.message}`;
                    navigator.clipboard.writeText(str).then(() => {
                        const lbl = btn.querySelector('.btn-copy-label');
                        if (lbl) {
                            const prev = lbl.textContent;
                            lbl.textContent = 'Copied!';
                            setTimeout(() => { lbl.textContent = prev; }, 2000);
                        }
                    });
                }
            });
        });
    }

    // Initial load
    checkAuthState();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
    initAdminApp();
}
