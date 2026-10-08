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

    // --- Admin & Submissions Portal System (100% Front-End) ---
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
            console.error('Failed to parse inquiries from localStorage', e);
            return [];
        }
    }

    function saveInquiries(inquiries) {
        try {
            localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
        } catch (e) {
            console.error('Failed to save inquiries to localStorage', e);
        }
    }

    function addInquiry(inquiry) {
        const list = getInquiries();
        list.unshift(inquiry);
        saveInquiries(list);
        updatePortalBadge();
        renderPortalDashboard();
    }

    function deleteInquiry(id) {
        let list = getInquiries();
        list = list.filter(item => item.id !== id);
        saveInquiries(list);
        updatePortalBadge();
        renderPortalDashboard();
    }

    function clearAllInquiries() {
        if (confirm('Are you sure you want to clear all inquiries from this browser?')) {
            saveInquiries([]);
            updatePortalBadge();
            renderPortalDashboard();
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

    function updatePortalBadge() {
        const inquiries = getInquiries();
        const badge = document.getElementById('portalBadgeCount');
        if (badge) {
            if (inquiries.length > 0) {
                badge.textContent = inquiries.length > 99 ? '99+' : inquiries.length;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Modal Visibility Controls
    const portalModal = document.getElementById('portalModal');
    const closePortalBtn = document.getElementById('closePortalModal');
    const brandLogo = document.getElementById('brandLogo');
    const footerBrandLogo = document.getElementById('footerBrandLogo');

    function openPortal() {
        if (!portalModal) return;
        portalModal.classList.add('open');
        portalModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const currentUser = getStoredAuth();
        if (currentUser) {
            showDashboardView();
        } else {
            showLoginView();
        }
    }

    function closePortal() {
        if (!portalModal) return;
        portalModal.classList.remove('open');
        portalModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (brandLogo) {
        brandLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (footerBrandLogo) {
        footerBrandLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (closePortalBtn) {
        closePortalBtn.addEventListener('click', closePortal);
    }

    if (portalModal) {
        portalModal.addEventListener('click', (e) => {
            if (e.target === portalModal) {
                closePortal();
            }
        });
    }

    // Keyboard navigation (Escape key closes both modals)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (portalModal && portalModal.classList.contains('open')) {
                closePortal();
            }
        }
    });

    // View Switching
    const portalLoginView = document.getElementById('portalLoginView');
    const portalDashboardView = document.getElementById('portalDashboardView');
    const portalLoginForm = document.getElementById('portalLoginForm');
    const portalLoginError = document.getElementById('portalLoginError');
    const portalQuickFillBtn = document.getElementById('portalQuickFillBtn');
    const portalLogoutBtn = document.getElementById('portalLogoutBtn');
    const togglePasswordBtn = document.getElementById('togglePortalPassword');
    const eyeIconOpen = document.getElementById('eyeIconOpen');
    const eyeIconClosed = document.getElementById('eyeIconClosed');
    const portalPasswordInput = document.getElementById('portalPassword');

    function showLoginView() {
        if (portalLoginView) portalLoginView.style.display = 'block';
        if (portalDashboardView) portalDashboardView.style.display = 'none';
        if (portalLoginError) {
            portalLoginError.style.display = 'none';
            portalLoginError.textContent = '';
        }
        setTimeout(() => {
            const u = document.getElementById('portalUsername');
            if (u) u.focus();
        }, 100);
    }

    function showDashboardView() {
        if (portalLoginView) portalLoginView.style.display = 'none';
        if (portalDashboardView) portalDashboardView.style.display = 'block';
        renderPortalDashboard();
    }

    // Toggle Password Visibility
    if (togglePasswordBtn && portalPasswordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = portalPasswordInput.type === 'password';
            portalPasswordInput.type = isPassword ? 'text' : 'password';
            if (eyeIconOpen && eyeIconClosed) {
                eyeIconOpen.style.display = isPassword ? 'none' : 'block';
                eyeIconClosed.style.display = isPassword ? 'block' : 'none';
            }
        });
    }

    // Quick Fill Demo Credentials
    if (portalQuickFillBtn) {
        portalQuickFillBtn.addEventListener('click', () => {
            const u = document.getElementById('portalUsername');
            const p = document.getElementById('portalPassword');
            if (u) u.value = 'admin';
            if (p) p.value = 'admin123';
            if (portalLoginError) portalLoginError.style.display = 'none';
            if (p) p.focus();
        });
    }

    // Login Form Submit
    if (portalLoginForm) {
        portalLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const uInput = document.getElementById('portalUsername');
            const pInput = document.getElementById('portalPassword');
            const remInput = document.getElementById('portalRememberMe');

            const username = (uInput ? uInput.value : '').trim();
            const password = (pInput ? pInput.value : '').trim();
            const remember = remInput ? remInput.checked : true;

            const isValid = (
                (username.toLowerCase() === 'bharath8635' && password === 'Vadla@') ||
                (username.toLowerCase() === 'admin' && (password === 'admin123' || password === 'Vadla@'))
            );

            if (isValid) {
                setStoredAuth(username, remember);
                if (portalLoginError) portalLoginError.style.display = 'none';
                showDashboardView();
            } else {
                if (portalLoginError) {
                    portalLoginError.style.display = 'block';
                    portalLoginError.textContent = 'Invalid username or password. Please check your credentials.';
                }
            }
        });
    }

    // Logout
    if (portalLogoutBtn) {
        portalLogoutBtn.addEventListener('click', () => {
            clearStoredAuth();
            showLoginView();
        });
    }

    // Dashboard Search & Actions
    const portalSearchInput = document.getElementById('portalSearchInput');
    const portalAddDemoBtn = document.getElementById('portalAddDemoBtn');
    const portalExportBtn = document.getElementById('portalExportBtn');
    const portalClearBtn = document.getElementById('portalClearBtn');

    if (portalSearchInput) {
        portalSearchInput.addEventListener('input', () => {
            renderPortalDashboard();
        });
    }

    if (portalAddDemoBtn) {
        portalAddDemoBtn.addEventListener('click', () => {
            addSampleInquiry();
        });
    }

    if (portalExportBtn) {
        portalExportBtn.addEventListener('click', () => {
            exportInquiriesCSV();
        });
    }

    if (portalClearBtn) {
        portalClearBtn.addEventListener('click', clearAllInquiries);
    }

    function addSampleInquiry() {
        const sampleNames = ['Kavya Reddy', 'Rohan Verma', 'Sarah Jenkins', 'Sai Karthik', 'Alex Rivera'];
        const sampleEmails = ['kavya.reddy@gmail.com', 'rohan.v@techcorp.io', 'sarah.j@designdrive.com', 'sai.karthik@startup.in', 'alex@riveramedia.com'];
        const sampleSubjects = ['Front-End Collaboration', 'Website Redesign Project', 'Freelance React Developer', 'UI Consultation', 'Job Opportunity'];
        const sampleMessages = [
            'Hi Bharath, I came across your portfolio and was impressed by your clean design and animations. We are looking for a developer for our modern web portal. Let us know your availability!',
            'Hello Vadla Bharath! We need a front-end specialist to build responsive dashboard components. Would love to collaborate with you.',
            'Hi Bharath! Fantastic portfolio with great attention to detail. Let us connect regarding a full-time / contract opportunity.'
        ];

        const idx = Math.floor(Math.random() * sampleNames.length);
        const mIdx = Math.floor(Math.random() * sampleMessages.length);
        const now = new Date();

        const sample = {
            id: 'inq_' + Date.now(),
            name: sampleNames[idx],
            email: sampleEmails[idx],
            subject: sampleSubjects[idx],
            message: sampleMessages[mIdx],
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

    function exportInquiriesCSV() {
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
        a.download = `bharath_portal_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function renderPortalDashboard() {
        const container = document.getElementById('portalSubmissionsList');
        const metricTotal = document.getElementById('metricTotalCount');
        const metricLatest = document.getElementById('metricLatestTime');
        const searchInput = document.getElementById('portalSearchInput');

        const inquiries = getInquiries();

        if (metricTotal) metricTotal.textContent = inquiries.length;
        if (metricLatest) {
            metricLatest.textContent = inquiries.length > 0 ? (inquiries[0].formattedDate || 'Recent') : '-';
        }

        if (!container) return;

        let filtered = inquiries;
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
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
                    <div class="portal-empty-state">
                        <div class="empty-state-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <div class="empty-state-title">No matching inquiries found</div>
                        <p class="empty-state-desc">No messages matching "${escapeHtml(query)}". Try another search term.</p>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="portal-empty-state">
                        <div class="empty-state-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div class="empty-state-title">No inquiries recorded yet</div>
                        <p class="empty-state-desc">When someone fills out the contact form at the bottom of the page, their details will automatically show up here!</p>
                        <button type="button" class="btn-demo-quickfill" id="emptyStateAddDemoBtn">
                            + Add Sample Inquiry Now
                        </button>
                    </div>
                `;
                const btn = document.getElementById('emptyStateAddDemoBtn');
                if (btn) btn.addEventListener('click', addSampleInquiry);
            }
            return;
        }

        let html = '';
        filtered.forEach(item => {
            const initial = item.name ? item.name.charAt(0).toUpperCase() : '?';
            html += `
                <div class="inquiry-card" id="card_${item.id}">
                    <div class="inquiry-header">
                        <div class="inquiry-author">
                            <div class="inquiry-avatar">${escapeHtml(initial)}</div>
                            <div>
                                <div class="inquiry-name">${escapeHtml(item.name)}</div>
                                <a href="mailto:${encodeURIComponent(item.email)}" class="inquiry-email">
                                    ${escapeHtml(item.email)}
                                </a>
                            </div>
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
                        <button type="button" class="inquiry-btn" data-copy-id="${item.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span class="copy-label">Copy</span>
                        </button>
                        <button type="button" class="inquiry-btn btn-del" data-delete-id="${item.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Attach dynamic action listeners
        container.querySelectorAll('[data-delete-id]').forEach(delBtn => {
            delBtn.addEventListener('click', () => {
                const id = delBtn.getAttribute('data-delete-id');
                deleteInquiry(id);
            });
        });

        container.querySelectorAll('[data-copy-id]').forEach(copyBtn => {
            copyBtn.addEventListener('click', () => {
                const id = copyBtn.getAttribute('data-copy-id');
                const targetItem = inquiries.find(it => it.id === id);
                if (targetItem) {
                    const text = `Name: ${targetItem.name}\nEmail: ${targetItem.email}\nSubject: ${targetItem.subject}\nDate: ${targetItem.formattedDate}\nMessage: ${targetItem.message}`;
                    navigator.clipboard.writeText(text).then(() => {
                        const lbl = copyBtn.querySelector('.copy-label');
                        if (lbl) {
                            const orig = lbl.textContent;
                            lbl.textContent = 'Copied!';
                            setTimeout(() => { lbl.textContent = orig; }, 2000);
                        }
                    });
                }
            });
        });
    }

    // Initialize portal badge count on load
    updatePortalBadge();

    // --- Contact Form Handling (Stores to Front-End Portal Immediately) ---
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
                formStatus.style.display = 'block';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Saving &amp; Sending...</span>';

            // 1. Immediately store into Front-End LocalStorage Portal
            const now = new Date();
            const newInquiry = {
                id: 'inq_' + Date.now(),
                name: name,
                email: email,
                subject: subject || 'Portfolio Inquiry',
                message: message,
                createdAt: now.toISOString(),
                formattedDate: now.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            addInquiry(newInquiry);

            // 2. Display success card with direct Portal Button
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `
                <div class="form-success-inner">
                    <strong style="color: #10b981; font-size: 1rem;">✓ Message Sent &amp; Recorded!</strong>
                    <p style="margin: 4px 0 6px; font-size: 0.9rem; color: #f8fafc;">
                        Thank you, <strong>${escapeHtml(name)}</strong>! Your submission has been saved directly to the Admin Portal.
                    </p>
                    <a href="admin.html" class="btn-view-portal-direct" id="openPortalFromForm" style="text-decoration: none;">
                        <span>Open Admin to View Details</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            `;
            formStatus.style.display = 'block';

            const openPortalBtnDirect = document.getElementById('openPortalFromForm');
            if (openPortalBtnDirect) {
                openPortalBtnDirect.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'admin.html';
                });
            }

            contactForm.reset();

            // 3. Background attempt to forward to formsubmit (silent fallback if offline)
            try {
                fetch('https://formsubmit.co/ajax/vadlabharathchary03@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject || `Portfolio message from ${name}`,
                        message: message,
                        _subject: subject || `Portfolio message from ${name}`
                    })
                }).catch(err => {
                    console.log('Online mail notification queued/offline, data safely stored in portal:', err);
                });
            } catch (err) {
                console.log('Background mail error handled:', err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // --- CV Modal & Direct Download Preview ---
    const cvBtn = document.getElementById('downloadCvBtn');
    const resumeModal = document.getElementById('resumeModal');
    const closeModal = document.getElementById('closeModal');
    const printCvBtn = document.getElementById('printCvBtn');
    const modalDownloadBtn = document.getElementById('modalDownloadBtn');
    const modalBottomDownloadBtn = document.getElementById('modalBottomDownloadBtn');
    const cvTabSummaryBtn = document.getElementById('cvTabSummaryBtn');
    const cvTabPdfBtn = document.getElementById('cvTabPdfBtn');
    const cvTabSummaryContent = document.getElementById('cvTabSummaryContent');
    const cvTabPdfContent = document.getElementById('cvTabPdfContent');

    function triggerDirectDownload() {
        const link = document.createElement('a');
        link.href = 'Vadla_Bharath_Chary_CV.pdf';
        link.download = 'Vadla_Bharath_Chary_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function openCvPreviewTab() {
        window.open('Vadla_Bharath_Chary_CV.pdf', '_blank');
    }

    if (cvBtn) {
        cvBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Direct download CV file immediately to visitor's computer without opening any popup modal
            triggerDirectDownload();
        });
    }

    if (modalDownloadBtn) {
        modalDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerDirectDownload();
        });
    }

    if (modalBottomDownloadBtn) {
        modalBottomDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerDirectDownload();
        });
    }

    // Modal Tabs
    if (cvTabSummaryBtn && cvTabPdfBtn && cvTabSummaryContent && cvTabPdfContent) {
        cvTabSummaryBtn.addEventListener('click', () => {
            cvTabSummaryBtn.classList.add('active');
            cvTabPdfBtn.classList.remove('active');
            cvTabSummaryContent.style.display = 'block';
            cvTabPdfContent.style.display = 'none';
        });

        cvTabPdfBtn.addEventListener('click', () => {
            cvTabPdfBtn.classList.add('active');
            cvTabSummaryBtn.classList.remove('active');
            cvTabSummaryContent.style.display = 'none';
            cvTabPdfContent.style.display = 'block';
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

    
    // --- Hero Photo Click Trigger to Open Admin Portal ---
    const heroPhotoWrapper = document.getElementById('heroPhotoWrapper') || document.querySelector('.hero-image-wrapper');
    const heroPhotoImg = document.getElementById('heroPhotoImg') || document.querySelector('.hero-img');

    function navigateToAdmin(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.location.href = 'admin.html';
    }

    if (heroPhotoWrapper) {
        heroPhotoWrapper.style.cursor = 'pointer';
        heroPhotoWrapper.addEventListener('click', navigateToAdmin);
        heroPhotoWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                navigateToAdmin(e);
            }
        });
    }

    if (heroPhotoImg) {
        heroPhotoImg.style.cursor = 'pointer';
        heroPhotoImg.addEventListener('click', navigateToAdmin);
    }

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
            const types = ["star", "pyramid", "sphere", "cylinder"];
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
                case "star":
                    this.drawStar(s);
                    break;
                case "pyramid":
                    this.drawPyramid(s);
                    break;
                case "sphere":
                    this.drawSphere(s);
                    break;
                case "cylinder":
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
            grad.addColorStop(1, "transparent");
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
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.25, this.palette.highlight);
            grad.addColorStop(0.65, this.palette.base);
            grad.addColorStop(1, this.palette.dark);

            ctx.beginPath();
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Specular sheen
            const specGrad = ctx.createRadialGradient(lightOffX, lightOffY, 0, lightOffX, lightOffY, s * 0.35);
            specGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
            specGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.2)");
            specGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(lightOffX, lightOffY, s * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();

            // 3D Latitude / Longitude wireframe rings rotating in 3D
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
            const b = s * 0.82; // Base half-width
            const h = s * 0.65; // Base Y
            const apexY = -s * 0.95; // Apex pointing up

            const vertices = [
                [-b, h, -b], // 0: back-left
                [ b, h, -b], // 1: back-right
                [ b, h,  b], // 2: front-right
                [-b, h,  b], // 3: front-left
                [ 0, apexY, 0] // 4: apex
            ];

            const faces = [
                // 4 triangular sides meeting at apex
                { idx: [4, 0, 1] },
                { idx: [4, 1, 2] },
                { idx: [4, 2, 3] },
                { idx: [4, 3, 0] },
                // 1 square base
                { idx: [0, 3, 2, 1] }
            ];

            const rotVerts = vertices.map(v => rotate3D(v, this.rx, this.ry, this.rz));
            const lightDir = [-0.577, -0.577, 0.577];

            const sortedFaces = faces.map(f => {
                const pts = f.idx.map(i => rotVerts[i]);
                // Compute normal via cross product (p1 - p0) x (p2 - p0)
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
                ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
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

            // Generate 10 star perimeter vertices in XY plane
            const starRing = [];
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const r = i % 2 === 0 ? outerR : innerR;
                starRing.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
            }

            // 2 Apexes on Z axis: Front (+depth) and Back (-depth)
            const frontApex = [0, 0, depth];
            const backApex = [0, 0, -depth];

            const allVerts = [...starRing, frontApex, backApex];
            const frontApexIdx = starRing.length;
            const backApexIdx = starRing.length + 1;

            const faces = [];
            for (let i = 0; i < points * 2; i++) {
                const next = (i + 1) % (points * 2);
                // Front facet
                faces.push({ idx: [frontApexIdx, i, next] });
                // Back facet
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
                ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });
        }

        /* --- 4. 3D CYLINDER --- */
        drawCylinder(s) {
            const N = 12; // Segment count for smooth circle
            const r = s * 0.65;
            const h = s * 0.78; // Half height

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
            // Side Quad faces
            for (let i = 0; i < N; i++) {
                const next = (i + 1) % N;
                // Quad: top_i -> top_next -> bot_next -> bot_i
                faces.push({
                    idx: [i, next, N + next, N + i],
                    isCap: false
                });
            }
            // Top Cap Polygon
            const topCapIndices = [];
            for (let i = N - 1; i >= 0; i--) topCapIndices.push(i);
            faces.push({ idx: topCapIndices, isCap: true });

            // Bottom Cap Polygon
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
                ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });
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
        if (av) { av.src = u.avatar_url; av.alt = u.name || u.login || 'Vadla Bharath Chary'; }
        const nameEl = document.getElementById('githubName');
        if (nameEl && u.name) { nameEl.textContent = u.name; }
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

