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

// Background Particle Canvas
function initAdminCanvas() {
    const canvas = document.getElementById('adminBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COUNT = 60;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function Particle() {
        this.reset = function () {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.4 + 0.15;
            this.color = Math.random() > 0.5 ? '14, 165, 233' : '139, 92, 246';
        };
        this.reset();
        this.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        };
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        };
    }

    function init() {
        particles = [];
        for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize();
    init();
    loop();
}

// UI State Management
document.addEventListener('DOMContentLoaded', () => {
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
});
