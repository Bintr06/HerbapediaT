// Logic dùng chung (Responsive Navbar, Utils, etc.)
document.addEventListener('DOMContentLoaded', () => {
    console.log("HerbaPedia App Initialized.");
    
    // Highlight menu đang được chọn (Active) dựa vào URL hiện tại
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Scroll event for navbar frosted glass effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    injectDropdownMenuHoverStyles();
});

function injectDropdownMenuHoverStyles() {
    if (document.getElementById('navDropdownHoverStyles')) return;
    const style = document.createElement('style');
    style.id = 'navDropdownHoverStyles';
    style.textContent = `
        .nav-links li.relative.group .py-1 > a,
        .nav-links li.relative.group .py-1 > a svg,
        .nav-links li.relative.group .py-1 > a i {
            transition: all 0.2s ease-in-out;
        }
        .nav-links li.relative.group .py-1 > a:hover {
            background-color: #eef1e6 !important;
            color: #1b3b22 !important;
            font-weight: 600 !important;
        }
        .nav-links li.relative.group .py-1 > a:hover svg,
        .nav-links li.relative.group .py-1 > a:hover i {
            color: #1b3b22 !important;
            stroke: #1b3b22 !important;
        }
    `;
    document.head.appendChild(style);
}

function navbarFirstName(fullName) {
    const name = String(fullName || '').trim();
    if (!name || name.includes('@')) return '';
    const parts = name.split(/\s+/);
    return parts[parts.length - 1];
}

function logoutUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('selectedHistoryItem');
    window.location.assign('auth.html');
}

function hasAuthenticatedSession() {
    return localStorage.getItem('isLoggedIn') === 'true' &&
        Boolean(localStorage.getItem('accessToken'));
}

function hasAdminSession() {
    return hasAuthenticatedSession() &&
        (localStorage.getItem('userRole') === 'admin' ||
            localStorage.getItem('isAdmin') === 'true');
}

function addAdminMenuLink() {
    if (!hasAdminSession()) return;
    const accountMenu = document.querySelector('.nav-links > li.relative.group .py-1');
    if (!accountMenu) return;

    const existingAdminLinks = accountMenu.querySelectorAll('[data-admin-link], a[href*="admin.html"]');
    if (existingAdminLinks.length > 1) {
        for (let i = 1; i < existingAdminLinks.length; i++) {
            existingAdminLinks[i].remove();
        }
        return;
    }
    if (existingAdminLinks.length === 1) {
        existingAdminLinks[0].dataset.adminLink = 'true';
        return;
    }

    const link = document.createElement('a');
    link.href = 'admin.html';
    link.dataset.adminLink = 'true';
    link.className = 'flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#eef1e6] hover:text-[#1b3b22] hover:font-semibold transition-colors';
    link.innerHTML = '<i data-feather="shield" class="w-4 h-4"></i> Khu vực Admin';
    accountMenu.appendChild(link);
    if (window.feather) window.feather.replace();
}

function notificationEscape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
}

function notificationTime(value) {
    const date = new Date(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
}

function addNotificationToNavbar() {
    const account = document.querySelector('.nav-links > li.relative.group');
    if (!account || document.querySelector('[data-notification-bell]')) return;
    const notificationItem = document.createElement('li');
    notificationItem.className = 'relative';
    notificationItem.innerHTML = `
            <button type="button" data-notification-bell class="relative p-2 text-gray-600 hover:text-[#0A2F1D]" aria-label="Thông báo">
                <i data-feather="bell" class="w-5 h-5"></i>
                <span data-notification-badge class="hidden absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center"></span>
            </button>
            <div data-notification-panel class="hidden absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div class="px-4 py-3 border-b border-gray-100 font-bold text-[#0A2F1D]">Thông báo</div>
                <div data-notification-list class="max-h-80 overflow-y-auto"></div>
            </div>
    `;
    account.before(notificationItem);
    if (window.feather) window.feather.replace();
    notificationItem.querySelector('[data-notification-bell]')?.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationItem.querySelector('[data-notification-panel]')?.classList.toggle('hidden');
    });
}

async function loadNavbarNotifications() {
    if (!hasAuthenticatedSession() || !document.querySelector('[data-notification-bell]')) return;
    const apiBase = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'https://herbapedia-production.up.railway.app';
    const response = await fetch(`${apiBase}/community/notifications`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
    });
    if (!response.ok) return;
    const result = await response.json();
    const badge = document.querySelector('[data-notification-badge]');
    const list = document.querySelector('[data-notification-list]');
    badge.textContent = result.unread_count > 99 ? '99+' : result.unread_count;
    badge.classList.toggle('hidden', result.unread_count === 0);
    list.innerHTML = result.items.length
        ? result.items.map((item) => `
            <button type="button" data-notification-id="${item.id}" data-post-id="${item.post_id || ''}" class="flex w-full gap-2 p-3 text-left hover:bg-gray-50 ${item.is_read ? '' : 'bg-green-50'}">
                <img src="${notificationEscape(item.actor?.avatar_url || 'assets/images/logo.png')}" class="w-8 h-8 rounded-full object-cover shrink-0" alt="">
                <span class="text-xs text-gray-700">${notificationEscape(item.actor?.display_name || 'HerbaPedia')} ${notificationEscape(item.message)}
                    <small class="block text-gray-400 mt-1">${notificationTime(item.created_at)}</small>
                </span>
            </button>`).join('')
        : '<p class="p-4 text-center text-sm text-gray-400">Chưa có thông báo.</p>';
}

function initializeNavbarNotifications() {
    if (!hasAuthenticatedSession()) return;
    addNotificationToNavbar();
    if (!document.documentElement.dataset.notificationEventsBound) {
        document.documentElement.dataset.notificationEventsBound = 'true';
        document.addEventListener('click', async (event) => {
            const notification = event.target.closest('[data-notification-id]');
            if (!notification) return;
            const apiBase = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'https://herbapedia-production.up.railway.app';
            await fetch(`${apiBase}/community/notifications/read`, {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
            });
            const postId = notification.dataset.postId;
            if (postId) {
                window.location.assign(`history.html?post=${encodeURIComponent(postId)}`);
            } else {
                await loadNavbarNotifications();
            }
        });
    }
    loadNavbarNotifications().catch((error) => console.warn('Không thể tải thông báo.', error));
}

document.addEventListener('DOMContentLoaded', initializeNavbarNotifications);

function updateLoggedOutNavbar() {
    if (hasAuthenticatedSession()) return;

    // 1. Ẩn menu tài khoản & chuông thông báo trên Desktop
    document.querySelectorAll('.nav-links > li.relative.group').forEach((accountItem) => {
        accountItem.remove();
    });
    document.querySelector('[data-notification-bell]')?.closest('li')?.remove();

    // 2. Ẩn Lịch sử nhận diện cá nhân trên Mobile Menu khi chưa đăng nhập
    document.querySelectorAll('#mobileMenu a[href*="personal-history.html"], [data-mobile-history]').forEach((el) => {
        el.style.display = 'none';
        el.classList.add('hidden');
    });

    // 3. Đặt nút Mobile Menu thành Đăng nhập
    const mobileAuth = document.getElementById('mobileAuthLink');
    if (mobileAuth) {
        mobileAuth.href = 'auth.html';
        mobileAuth.innerHTML = '<i data-feather="log-in" class="w-4 h-4"></i> Đăng nhập / Đăng ký';
        document.getElementById('mobileLogoutBtn')?.remove();
        if (window.feather) window.feather.replace();
    }

    const nav = document.querySelector('.nav-links');
    if (!nav || nav.querySelector('[data-login-link]')) return;
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    if (currentPage === 'auth.html') return;

    const loginItem = document.createElement('li');
    loginItem.dataset.loginLink = 'true';
    loginItem.innerHTML = `
        <a href="auth.html" class="text-[#0A2F1D] font-bold hover:text-[#8CC63F] transition-colors">
            Đăng nhập
        </a>
    `;
    nav.appendChild(loginItem);
}

function protectPrivatePages() {
    const privatePages = new Set([
        'user-profile.html',
        'personal-history.html',
        'profile.html'
    ]);
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    if (currentPage === 'admin.html' && !hasAdminSession()) {
        window.location.replace('auth.html');
        return true;
    }
    if (privatePages.has(currentPage) && !hasAuthenticatedSession()) {
        if (currentPage === 'user-profile.html') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('userId') || params.get('author_id') || params.get('id') || params.get('author')) {
                return false;
            }
        }
        window.location.replace('auth.html');
        return true;
    }
    return false;
}

async function updateNavbarProfile() {
    const avatar = document.querySelector('.nav-links li.relative.group button img');
    const greeting = document.querySelector('.nav-links li.relative.group button span');
    if (!avatar || !greeting) return;

    const token = localStorage.getItem('accessToken');
    const fallbackName = localStorage.getItem('userName') || '';
    let displayName = fallbackName;
    let avatarUrl = avatar.src;

    if (token) {
        try {
            const apiBase = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'https://herbapedia-production.up.railway.app';
            const response = await fetch(`${apiBase}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const profile = await response.json();
                localStorage.setItem('userRole', profile.role || 'user');
                localStorage.setItem('isAdmin', String(profile.role === 'admin'));
                addAdminMenuLink();
                const profileName = String(profile.display_name || '').trim();
                const username = String(profile.username || '').trim();
                if (profileName && !profileName.includes('@') && profileName.toLowerCase() !== username.toLowerCase()) {
                    displayName = profileName;
                    localStorage.setItem('userName', displayName);
                } else {
                    displayName = '';
                    localStorage.removeItem('userName');
                }
                if (profile.avatar_url) avatarUrl = profile.avatar_url;
            }
        } catch (error) {
            console.warn('Không thể tải hồ sơ người dùng cho navbar.', error);
        }
    }

    greeting.textContent = `Hi, ${navbarFirstName(displayName)}`;
    avatar.src = avatarUrl;
    avatar.alt = `Ảnh đại diện của ${displayName}`;

    const blogLink = document.querySelector('.nav-links a[href^="user-profile.html"]');
    if (blogLink) {
        blogLink.href = 'user-profile.html';
    }

    const mobileAuth = document.getElementById('mobileAuthLink');
    if (mobileAuth) {
        if (token) {
            mobileAuth.href = 'profile.html';
            mobileAuth.innerHTML = '<i data-feather="user" class="w-4 h-4"></i> Hồ sơ của tôi';

            // Hiện link Lịch sử nhận diện cá nhân khi đã đăng nhập
            document.querySelectorAll('#mobileMenu a[href*="personal-history.html"], [data-mobile-history]').forEach((el) => {
                el.style.display = 'flex';
                el.classList.remove('hidden');
            });

            // Thêm nút Đăng xuất trên Mobile Drawer
            if (!document.getElementById('mobileLogoutBtn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'mobileLogoutBtn';
                logoutBtn.dataset.action = 'logout';
                logoutBtn.type = 'button';
                logoutBtn.className = 'flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors cursor-pointer';
                logoutBtn.innerHTML = '<i data-feather="log-out" class="w-4 h-4"></i> Đăng xuất';
                mobileAuth.parentElement.appendChild(logoutBtn);
            }
        } else {
            mobileAuth.href = 'auth.html';
            mobileAuth.innerHTML = '<i data-feather="log-in" class="w-4 h-4"></i> Đăng nhập / Đăng ký';

            // Ẩn link Lịch sử nhận diện cá nhân khi chưa đăng nhập
            document.querySelectorAll('#mobileMenu a[href*="personal-history.html"], [data-mobile-history]').forEach((el) => {
                el.style.display = 'none';
                el.classList.add('hidden');
            });
            document.getElementById('mobileLogoutBtn')?.remove();
        }
        if (window.feather) window.feather.replace();
    }
}

document.addEventListener('DOMContentLoaded', updateNavbarProfile);

// Custom Botanical Alert Modal
window.showCustomAlert = function(title, message, type = 'success', redirectUrl = null) {
    const existingModal = document.getElementById('botanicalModal');
    if (existingModal) existingModal.remove();

    const iconStr = type === 'success' 
        ? '<i data-feather="check-circle" class="w-12 h-12 text-green-500 mb-4 mx-auto"></i>' 
        : '<i data-feather="alert-circle" class="w-12 h-12 text-yellow-500 mb-4 mx-auto"></i>';

    const modalHtml = `
    <div id="botanicalModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[#1b3b22]/40 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-[#fdfbf7] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl transform scale-95 transition-transform duration-300 border border-green-900/10 overflow-hidden text-center z-10">
            
            <!-- Botanical Frame Decor -->
            <svg class="absolute top-0 left-0 w-32 h-32 text-[#1b3b22] opacity-[0.06] transform -translate-x-4 -translate-y-4" viewBox="0 0 200 200" fill="currentColor">
              <path d="M10,0 Q10,50 50,90 Q90,130 150,150 Q100,120 70,70 Q40,20 10,0 Z" />
              <path d="M30,70 Q50,110 90,130 Q70,90 30,70 Z" />
              <path d="M70,30 Q110,50 130,90 Q90,70 70,30 Z" />
            </svg>
            <svg class="absolute bottom-0 right-0 w-40 h-40 text-[#1b3b22] opacity-[0.06] transform translate-x-4 translate-y-4 rotate-180" viewBox="0 0 200 200" fill="currentColor">
              <path d="M10,0 Q10,50 50,90 Q90,130 150,150 Q100,120 70,70 Q40,20 10,0 Z" />
              <path d="M30,70 Q50,110 90,130 Q70,90 30,70 Z" />
              <path d="M70,30 Q110,50 130,90 Q90,70 70,30 Z" />
            </svg>
            
            ${iconStr}
            
            <h3 class="font-serif text-2xl font-bold text-[#1b3b22] mb-2 relative z-10">${title}</h3>
            <p class="text-gray-600 text-sm font-light mb-6 relative z-10">${message}</p>
            
            <button id="closeModalBtn" class="relative z-10 w-full px-6 py-3 bg-[#1b3b22] text-white rounded-full font-semibold text-sm hover:bg-[#132a18] shadow-md transition-all hover:-translate-y-0.5">
                ${redirectUrl ? 'Tiếp tục' : 'Đóng'}
            </button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (typeof feather !== 'undefined') feather.replace();

    const modal = document.getElementById('botanicalModal');
    const modalContent = modal.children[1]; // The inner content card
    
    // Animation in
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);

    // Close logic
    const closeBtn = document.getElementById('closeModalBtn');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modal.remove();
            if (redirectUrl) window.location.href = redirectUrl;
        }, 300);
    });
};
// Handle dynamic login state in Navbar
document.addEventListener('DOMContentLoaded', () => {
    if (protectPrivatePages()) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' &&
        Boolean(localStorage.getItem('accessToken'));
    const userName = localStorage.getItem('userName') || '';
    updateLoggedOutNavbar();
    
    // Find the login button
    const loginLinks = document.querySelectorAll('a[href="auth.html"]');
    loginLinks.forEach(link => {
        if(link.innerText.includes('Đăng nhập') || link.innerText.includes('Dang nh?p')) {
            const authLinkLi = link.parentElement;
            if (isLoggedIn && authLinkLi && authLinkLi.tagName === 'LI') {
                authLinkLi.outerHTML = `
                    <li class="relative group">
                        <button class="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-gray-200 text-[#1b3b22] px-4 py-1.5 rounded-full hover:bg-white shadow-sm transition-all cursor-pointer">
                            <img src="assets/images/logo.png" alt="Ảnh đại diện" class="w-6 h-6 rounded-full object-cover">
                            <span class="font-bold text-sm">Hi, ${userName}</span>
                            <i data-feather="chevron-down" class="w-4 h-4 text-gray-500"></i>
                        </button>
                        <div class="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <a href="profile.html" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#eef1e6] hover:text-[#1b3b22] transition-colors">
                                <i data-feather="user" class="w-4 h-4"></i> Hồ sơ cá nhân
                            </a>
                            <a href="personal-history.html" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#eef1e6] hover:text-[#1b3b22] transition-colors">
                                <i data-feather="clock" class="w-4 h-4"></i> Lịch sử cá nhân
                            </a>
                            <div class="h-px bg-gray-200/60 my-1"></div>
                            <a href="#" id="btnLogout" class="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <i data-feather="log-out" class="w-4 h-4"></i> Đăng xuất
                            </a>
                        </div>
                    </li>
                `;
            }
        }
    });

        // Show personal accuracy data if logged in
    const userAccuracyBlock = document.getElementById('userAccuracyBlock');
    if (userAccuracyBlock && isLoggedIn) {
        userAccuracyBlock.classList.remove('hidden');
    }
    if (isLoggedIn && typeof feather !== 'undefined') {
        feather.replace();
    }
    if (isLoggedIn) {
        addAdminMenuLink();
        initializeNavbarNotifications();
    }

    document.addEventListener('click', (event) => {
        const target = event.target.closest('a, button');
        if (!target) return;

        const link = target.closest('a');
        if (link && !hasAuthenticatedSession()) {
            const destination = new URL(link.href, window.location.href);
            const privatePages = new Set([
                'user-profile.html',
                'personal-history.html',
                'profile.html'
            ]);
            if (privatePages.has(destination.pathname.split('/').pop().toLowerCase())) {
                event.preventDefault();
                window.location.assign('auth.html');
                return;
            }
        }

        const isLogout = target.id === 'btnLogout' ||
            target.dataset.action === 'logout' ||
            target.textContent.trim().includes('Đăng xuất');
        if (!isLogout) return;

        event.preventDefault();
        logoutUser();
    });

    // Initialize Donate interactions
    initDonateInteractions();
});

// ==========================================
// Donate / Ủng hộ dự án global handlers
// ==========================================
function showDonateToast(message, isError = false) {
    let toast = document.getElementById('globalDonateToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalDonateToast';
        document.body.appendChild(toast);
    }
    toast.className = `fixed bottom-6 right-6 z-[140] px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2 ${
        isError ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-[#0A2F1D] text-white shadow-green-900/20'
    }`;
    toast.innerHTML = isError
        ? `<svg class="w-4 h-4 text-red-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${message}</span>`
        : `<svg class="w-4 h-4 text-[#8CC63F] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>${message}</span>`;

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('translate-y-8', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

async function copyDonateText(text, successMessage) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        showDonateToast(successMessage || 'Đã sao chép!');
        return true;
    } catch (err) {
        console.error('Copy error:', err);
        showDonateToast('Không thể sao chép tự động. Vui lòng sao chép thủ công.', true);
        return false;
    }
}

function ensureDonateQrModal() {
    let modal = document.getElementById('donateQrZoomModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'donateQrZoomModal';
    modal.className = 'fixed inset-0 z-[140] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300';
    modal.innerHTML = `
        <div id="donateQrBackdrop" class="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity cursor-pointer"></div>
        <div class="relative max-w-xs sm:max-w-sm w-full bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center transform scale-95 transition-all duration-300 z-10">
            <div class="w-full flex items-center justify-between pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#8CC63F]"></span>
                    <span class="text-xs font-bold text-gray-800 uppercase tracking-wide">VietQR MB Bank - Donate</span>
                </div>
                <button type="button" id="btnCloseDonateQrZoom" class="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="mt-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 w-full flex justify-center">
                <img src="assets/images/donate-qr.jpg" onerror="this.src='images/donate-qr.jpg'" alt="VietQR Donate" class="w-56 h-56 rounded-xl object-contain shadow-xs bg-white p-2">
            </div>
            <div class="mt-3 w-full p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                    <div class="font-bold text-forest-900">TRAN MANH QUYNH</div>
                    <div class="font-mono text-emerald-800 font-semibold text-[11px]">525220082006 (MB Bank)</div>
                </div>
                <button type="button" id="btnModalCopyStkAction" class="px-2.5 py-1 rounded-lg bg-forest-900 hover:bg-[#8CC63F] text-white text-xs font-bold transition flex items-center gap-1">
                    <span>Sao chép</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100');
        const box = modal.querySelector('.transform');
        if (box) {
            box.classList.add('scale-95');
            box.classList.remove('scale-100');
        }
    };

    modal.querySelector('#donateQrBackdrop').addEventListener('click', closeModal);
    modal.querySelector('#btnCloseDonateQrZoom').addEventListener('click', closeModal);
    modal.querySelector('#btnModalCopyStkAction').addEventListener('click', () => {
        copyDonateText('525220082006', 'Đã sao chép STK: 525220082006 (MB Bank)');
    });

    return modal;
}

function openDonateQrModal() {
    const modal = ensureDonateQrModal();
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    const box = modal.querySelector('.transform');
    if (box) {
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
    }
}

function initDonateInteractions() {
    document.addEventListener('click', (e) => {
        // Copy STK
        const btnCopy = e.target.closest('#btnCopyStk, #btnCopyStkFooter');
        if (btnCopy) {
            e.preventDefault();
            copyDonateText('525220082006', 'Đã sao chép STK: 525220082006 (MB Bank)');
            const originalContent = btnCopy.innerHTML;
            btnCopy.innerHTML = '<span>Đã chép!</span>';
            setTimeout(() => { btnCopy.innerHTML = originalContent; }, 1800);
            return;
        }

        // Zoom QR
        const btnZoom = e.target.closest('#btnZoomQr, #btnZoomQrFooter, #footerQrImg');
        if (btnZoom) {
            e.preventDefault();
            openDonateQrModal();
            return;
        }
    });
}
