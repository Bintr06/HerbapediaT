const BLOG_API_URL = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'https://herbapedia-production.up.railway.app';

let currentUser = null;
let targetUserId = null;
let isOwner = false;
let blogPosts = [];
let deletePostIdTarget = null;
let selectedBlogCreateFiles = [];

function blogToken() {
    return localStorage.getItem('accessToken');
}

function blogHeaders(extra = {}) {
    const token = blogToken();
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra
    };
}

function blogEscape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[c]));
}

function blogTime(dateString) {
    if (!dateString) return '';
    let s = String(dateString).trim();
    if (!s.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(s)) {
        s = s.replace(' ', 'T') + 'Z';
    }
    const date = new Date(s);
    const validDate = isNaN(date.getTime()) ? new Date(dateString) : date;
    const seconds = Math.floor((Date.now() - validDate.getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return validDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showBlogToast(message, isError = false) {
    let toast = document.getElementById('blogToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'blogToast';
        toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 transform translate-y-8 opacity-0 flex items-center gap-2';
        document.body.appendChild(toast);
    }
    toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2 ${
        isError ? 'bg-red-600 text-white' : 'bg-[#0A2F1D] text-white'
    }`;
    toast.innerHTML = isError
        ? `<i data-feather="alert-circle" class="w-4 h-4"></i> <span>${blogEscape(message)}</span>`
        : `<i data-feather="check-circle" class="w-4 h-4 text-yellow-300"></i> <span>${blogEscape(message)}</span>`;
    if (window.feather) window.feather.replace();

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('translate-y-8', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
}

function getAvatarUrl(user) {
    if (!user) return 'assets/images/logo.png';
    if (user.avatar_url) return user.avatar_url;
    const name = encodeURIComponent(user.display_name || user.username || 'User');
    return `https://ui-avatars.com/api/?name=${name}&background=0A2F1D&color=fff`;
}

// Lightbox gallery state
let currentBlogLightboxGallery = [];
let currentBlogLightboxIndex = 0;

function openLightbox(galleryOrSrc, startIndex = 0) {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;

    if (Array.isArray(galleryOrSrc)) {
        currentBlogLightboxGallery = galleryOrSrc;
        currentBlogLightboxIndex = Math.max(0, Math.min(startIndex, galleryOrSrc.length - 1));
    } else if (typeof galleryOrSrc === 'string' && galleryOrSrc) {
        currentBlogLightboxGallery = [galleryOrSrc];
        currentBlogLightboxIndex = 0;
    } else {
        return;
    }

    updateBlogLightboxUI();
    modal.classList.remove('opacity-0', 'pointer-events-none');
    img.classList.remove('scale-95');
    document.body.classList.add('overflow-hidden');
}

function updateBlogLightboxUI() {
    const img = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');
    const btnPrev = document.getElementById('btnLightboxPrev');
    const btnNext = document.getElementById('btnLightboxNext');

    if (img && currentBlogLightboxGallery[currentBlogLightboxIndex]) {
        img.src = currentBlogLightboxGallery[currentBlogLightboxIndex];
    }
    if (counter) {
        if (currentBlogLightboxGallery.length > 1) {
            counter.textContent = `${currentBlogLightboxIndex + 1} / ${currentBlogLightboxGallery.length}`;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
    if (btnPrev && btnNext) {
        if (currentBlogLightboxGallery.length > 1) {
            btnPrev.classList.remove('hidden');
            btnNext.classList.remove('hidden');
        } else {
            btnPrev.classList.add('hidden');
            btnNext.classList.add('hidden');
        }
    }
    if (window.feather) feather.replace();
}

function prevBlogLightbox() {
    if (currentBlogLightboxGallery.length <= 1) return;
    currentBlogLightboxIndex = (currentBlogLightboxIndex - 1 + currentBlogLightboxGallery.length) % currentBlogLightboxGallery.length;
    updateBlogLightboxUI();
}

function nextBlogLightbox() {
    if (currentBlogLightboxGallery.length <= 1) return;
    currentBlogLightboxIndex = (currentBlogLightboxIndex + 1) % currentBlogLightboxGallery.length;
    updateBlogLightboxUI();
}

function closeLightbox() {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    img.classList.add('scale-95');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => { if (img) img.src = ''; }, 200);
    currentBlogLightboxGallery = [];
    currentBlogLightboxIndex = 0;
}

// Khởi tạo trang Blog cá nhân
document.addEventListener('DOMContentLoaded', async () => {
    setupLightboxEvents();
    setupModalEvents();
    setupCommentInteractions();

    const urlParams = new URLSearchParams(window.location.search);
    const paramUserId = urlParams.get('userId') || urlParams.get('author_id') || urlParams.get('id');

    // Lấy thông tin người dùng đang đăng nhập nếu có
    if (blogToken()) {
        try {
            const meRes = await fetch(`${BLOG_API_URL}/auth/me`, { headers: blogHeaders() });
            if (meRes.ok) {
                currentUser = await meRes.json();
                const navbarAvatar = document.getElementById('navbarAvatar');
                const navGreeting = document.getElementById('navGreeting');
                if (navbarAvatar && currentUser.avatar_url) navbarAvatar.src = currentUser.avatar_url;
                if (navGreeting && (currentUser.display_name || currentUser.username)) {
                    navGreeting.textContent = (currentUser.display_name || currentUser.username).split(' ').slice(-1)[0];
                }
            } else if (meRes.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('isLoggedIn');
            }
        } catch (e) {
            console.warn('Không thể lấy thông tin người dùng hiện tại:', e);
        }
    }

    // Nếu không có userId truyền vào và chưa đăng nhập -> chuyển sang auth.html
    if (!paramUserId && !currentUser) {
        window.location.replace('auth.html');
        return;
    }

    targetUserId = paramUserId ? parseInt(paramUserId, 10) : currentUser.id;
    await loadUserProfileAndPosts();
});

async function loadUserProfileAndPosts() {
    const container = document.getElementById('blogPostsContainer');
    if (container) {
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 animate-pulse">
                <i data-feather="loader" class="w-8 h-8 mx-auto mb-3 animate-spin text-[#8CC63F]"></i>
                <p class="text-sm">Đang tải bài viết blog...</p>
            </div>
        `;
        if (window.feather) window.feather.replace();
    }

    try {
        // Tải profile của người dùng
        const profileUrl = (!targetUserId || (currentUser && targetUserId === currentUser.id))
            ? `${BLOG_API_URL}/community/users/me/profile`
            : `${BLOG_API_URL}/community/users/${targetUserId}/profile`;

        const profileRes = await fetch(profileUrl, { headers: blogHeaders() });
        if (!profileRes.ok) {
            throw new Error('Không thể tải thông tin tác giả blog.');
        }
        const profile = await profileRes.json();
        targetUserId = profile.id;
        isOwner = profile.is_owner || (currentUser && currentUser.id === profile.id);

        renderProfileHeader(profile);

        // Tải danh sách bài viết
        const postsRes = await fetch(`${BLOG_API_URL}/community/posts?user_id=${targetUserId}`, {
            headers: blogHeaders()
        });
        if (!postsRes.ok) {
            throw new Error('Không thể tải danh sách bài viết.');
        }
        blogPosts = await postsRes.json();
        renderBlogFeed(blogPosts);

    } catch (error) {
        console.error('Lỗi khi tải Blog cá nhân:', error);
        if (container) {
            container.innerHTML = `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">
                    <i data-feather="alert-triangle" class="w-8 h-8 mx-auto mb-3"></i>
                    <p class="font-bold mb-1">${blogEscape(error.message)}</p>
                    <a href="history.html" class="inline-block mt-3 text-sm text-[#0A2F1D] underline hover:text-[#8CC63F]">Quay lại Cộng đồng</a>
                </div>
            `;
            if (window.feather) window.feather.replace();
        }
    }
}

function sanitizePublicName(name) {
    if (!name) return 'Thành viên HerbaPedia';
    const s = String(name).trim();
    if (s.includes('@')) {
        return s.split('@')[0];
    }
    return s;
}

function renderProfileHeader(profile) {
    const avatarImg = document.getElementById('profileAvatar');
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    const emailRow = document.getElementById('profileEmailRow');
    const roleBadgeEl = document.getElementById('profileRoleBadge');
    const postCountEl = document.getElementById('profilePostCount');
    const likeCountEl = document.getElementById('profileLikeCount');
    const joinDateEl = document.getElementById('profileJoinDate');
    const ownerActionsEl = document.getElementById('profileOwnerActions');
    const quickCreatorEl = document.getElementById('blogQuickCreator');
    const tabPostCountEl = document.getElementById('tabPostCount');

    const safeName = sanitizePublicName(profile.display_name || profile.username);

    if (avatarImg) {
        avatarImg.src = getAvatarUrl(profile);
        avatarImg.alt = safeName;
    }
    if (nameEl) {
        nameEl.textContent = safeName;
    }

    // Ẩn hoàn toàn email/gmail đối với người dùng khác. Chỉ hiển thị khi chính chủ tài khoản xem hồ sơ của mình
    if (emailRow) {
        if (isOwner && profile.email) {
            emailRow.classList.remove('hidden');
            emailRow.classList.add('flex');
            if (emailEl) emailEl.textContent = profile.email;
        } else {
            emailRow.classList.add('hidden');
            emailRow.classList.remove('flex');
            if (emailEl) emailEl.textContent = '';
        }
    }

    if (roleBadgeEl) {
        roleBadgeEl.className = 'inline-flex items-center gap-1.5 bg-[#F7F9F5] text-[#0A2F1D] px-3.5 py-1 rounded-full text-xs font-bold border border-[#E8F2DB]';
        roleBadgeEl.innerHTML = '<i data-feather="check-circle" class="w-3.5 h-3.5 text-[#8CC63F]"></i> Thành viên HerbaPedia';
    }
    if (postCountEl) postCountEl.textContent = profile.post_count ?? 0;
    if (likeCountEl) likeCountEl.textContent = profile.total_likes ?? 0;
    if (tabPostCountEl) tabPostCountEl.textContent = profile.post_count ?? 0;

    if (joinDateEl) {
        joinDateEl.textContent = profile.created_at
            ? new Date(profile.created_at).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
            : '--';
    }

    document.title = `Blog của ${safeName} - HerbaPedia`;

    // Hiển thị nút hành động nếu là chủ blog
    if (ownerActionsEl) {
        if (isOwner) {
            ownerActionsEl.classList.remove('hidden');
        } else {
            ownerActionsEl.classList.add('hidden');
        }
    }

    // Hiển thị khung đăng bài nhanh nếu là chủ blog
    if (quickCreatorEl) {
        if (isOwner) {
            quickCreatorEl.classList.remove('hidden');
            const creatorAvatar = document.getElementById('blogCreatorAvatar');
            if (creatorAvatar) creatorAvatar.src = getAvatarUrl(currentUser || profile);
        } else {
            quickCreatorEl.classList.add('hidden');
        }
    }

    if (window.feather) window.feather.replace();
}

function renderBlogFeed(posts) {
    const container = document.getElementById('blogPostsContainer');
    if (!container) return;

    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                <div class="w-20 h-20 rounded-full bg-[#eef1e6] flex items-center justify-center text-[#1b3b22] mb-4">
                    <i data-feather="book-open" class="w-10 h-10"></i>
                </div>
                <h3 class="font-serif text-2xl font-bold text-[#0A2F1D] mb-2">Chưa có bài viết nào</h3>
                <p class="text-gray-500 max-w-md mb-6 text-sm leading-relaxed">
                    ${isOwner
                        ? 'Bạn chưa đăng bài viết nào trên blog cá nhân. Hãy chia sẻ công thức thuốc hoặc kinh nghiệm đầu tiên ngay bây giờ!'
                        : 'Tác giả này hiện chưa có bài viết nào trên blog.'}
                </p>
                ${isOwner ? `
                    <button id="btnEmptyCreatePost" class="bg-[#0A2F1D] hover:bg-[#1b3b22] text-white px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5">
                        <i data-feather="plus" class="w-4 h-4"></i> Viết bài đầu tiên
                    </button>
                ` : ''}
            </div>
        `;
        document.getElementById('btnEmptyCreatePost')?.addEventListener('click', openCreateModal);
        if (window.feather) window.feather.replace();
        return;
    }

    container.innerHTML = posts.map(post => renderSinglePostCard(post)).join('');
    if (window.feather) window.feather.replace();
    attachPostCardEventListeners(container);
}

function renderBlogGallery(post) {
    const images = Array.isArray(post.images) && post.images.length > 0
        ? post.images
        : (post.image_url ? [post.image_url] : []);

    if (images.length === 0) return '';

    const safeTitle = blogEscape(post.title || '');
    const galleryJson = encodeURIComponent(JSON.stringify(images));

    if (images.length === 1) {
        return `
            <div class="rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 max-h-[460px] cursor-pointer group relative post-gallery-container" data-gallery="${galleryJson}">
                <img src="${blogEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-300" loading="lazy">
            </div>`;
    }

    if (images.length === 2) {
        return `
            <div class="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 h-64 sm:h-80 post-gallery-container" data-gallery="${galleryJson}">
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${blogEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${blogEscape(images[1])}" alt="${safeTitle}" data-gallery-index="1" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
            </div>`;
    }

    if (images.length === 3) {
        return `
            <div class="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 h-72 sm:h-96 post-gallery-container" data-gallery="${galleryJson}">
                <div class="col-span-2 relative overflow-hidden cursor-pointer group h-full">
                    <img src="${blogEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="col-span-1 flex flex-col gap-2 h-full">
                    <div class="relative overflow-hidden cursor-pointer group flex-1">
                        <img src="${blogEscape(images[1])}" alt="${safeTitle}" data-gallery-index="1" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    </div>
                    <div class="relative overflow-hidden cursor-pointer group flex-1">
                        <img src="${blogEscape(images[2])}" alt="${safeTitle}" data-gallery-index="2" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    </div>
                </div>
            </div>`;
    }

    const remainingCount = images.length - 4;
    return `
        <div class="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 h-80 sm:h-96 post-gallery-container" data-gallery="${galleryJson}">
            <div class="relative overflow-hidden cursor-pointer group h-full">
                <img src="${blogEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 h-full">
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${blogEscape(images[1])}" alt="${safeTitle}" data-gallery-index="1" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${blogEscape(images[2])}" alt="${safeTitle}" data-gallery-index="2" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="col-span-full relative overflow-hidden cursor-pointer group h-full">
                    <img src="${blogEscape(images[3])}" alt="${safeTitle}" data-gallery-index="3" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    ${remainingCount > 0 ? `
                        <div class="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center text-white text-xl sm:text-2xl font-bold group-hover:bg-black/65 transition-colors">
                            +${remainingCount}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
}

function renderSinglePostCard(post) {
    const author = post.author || {};
    const avatarUrl = getAvatarUrl(author);
    const isPostOwner = isOwner || post.can_delete || (currentUser && currentUser.id === author.id);

    return `
        <article class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 transition-all hover:shadow-md" data-post-id="${post.id}">
            <!-- Header bài viết -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <img src="${blogEscape(avatarUrl)}" alt="${blogEscape(author.display_name)}" class="w-11 h-11 rounded-full object-cover border border-gray-100 shrink-0">
                    <div>
                        <div class="flex items-center gap-2">
                            <h4 class="font-bold text-[#0A2F1D] text-sm md:text-base">${blogEscape(author.display_name)}</h4>
                        </div>
                        <span class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <i data-feather="clock" class="w-3 h-3"></i> ${blogTime(post.created_at)}
                            ${post.post_type === 'remedy' ? '• <span class="text-[#8CC63F] font-semibold">Bài thuốc</span>' : ''}
                        </span>
                    </div>
                </div>

                ${isPostOwner ? `
                    <div class="relative group">
                        <button type="button" class="post-action-btn text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors" title="Tùy chọn bài viết">
                            <i data-feather="more-horizontal" class="w-5 h-5"></i>
                        </button>
                        <div class="post-dropdown-menu hidden absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                            <button type="button" data-edit-post="${post.id}" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#eef1e6] hover:text-[#1b3b22] flex items-center gap-2 transition-colors">
                                <i data-feather="edit-2" class="w-4 h-4"></i> Sửa bài
                            </button>
                            <button type="button" data-delete-post="${post.id}" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                                <i data-feather="trash-2" class="w-4 h-4"></i> Xóa bài
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Tiêu đề & Nội dung -->
            <h3 class="font-serif text-xl md:text-2xl font-bold mb-3 text-[#0A2F1D] hover:text-forest-900 transition-colors">
                ${blogEscape(post.title)}
            </h3>
            <p class="text-gray-700 text-sm md:text-base mb-4 leading-relaxed whitespace-pre-line">
                ${blogEscape(post.content)}
            </p>

            <!-- Ảnh bài viết -->
            ${renderBlogGallery(post)}

            <!-- Thống kê tương tác -->
            <div class="flex items-center gap-4 py-2 border-b border-gray-100 text-gray-500 text-xs md:text-sm">
                <span data-like-count-display="${post.id}" class="flex items-center gap-1 font-medium">
                    <i data-feather="heart" class="w-3.5 h-3.5 text-red-400"></i> ${post.like_count ?? 0} lượt thích
                </span>
                <span data-comment-count-display="${post.id}" class="flex items-center gap-1 font-medium cursor-pointer hover:underline">
                    <i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-400"></i> ${post.comment_count ?? 0} bình luận
                </span>
            </div>

            <!-- Nút tương tác -->
            <div class="flex items-center gap-2 pt-2 text-sm font-semibold">
                <button type="button" data-like-button="${post.id}" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    post.liked ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }">
                    <i data-feather="heart" class="w-4 h-4 ${post.liked ? 'fill-red-600' : ''}"></i>
                    <span>${post.liked ? 'Đã thích' : 'Thích'}</span>
                </button>
                <button type="button" data-comment-toggle="${post.id}" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
                    <i data-feather="message-square" class="w-4 h-4"></i>
                    <span>Bình luận</span>
                </button>
            </div>

            <!-- Khu vực Bình luận (Collapsible) -->
            <div data-comments-section="${post.id}" class="hidden mt-4 pt-4 border-t border-gray-100">
                <div data-comments-list="${post.id}" class="space-y-3 mb-4">
                    <p class="text-xs text-gray-400 italic">Đang tải bình luận...</p>
                </div>

                <!-- Form gửi bình luận -->
                ${blogToken() ? `
                    <div class="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                        <img src="${blogEscape(getAvatarUrl(currentUser))}" class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-sm">
                        <div class="flex-1 flex items-center gap-2 bg-[#F0F2F5] hover:bg-[#E4E6EB]/60 focus-within:bg-[#F0F2F5] focus-within:ring-2 focus-within:ring-[#8CC63F]/30 rounded-[20px] px-3.5 py-1.5 transition-all">
                            <input type="text" data-comment-input="${post.id}" placeholder="Viết bình luận công khai..." class="w-full bg-transparent border-0 outline-none text-[14px] text-gray-900 placeholder-gray-500 py-1">
                            <button type="button" data-comment-submit="${post.id}" class="text-[#0A2F1D] hover:text-[#8CC63F] p-1 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0" disabled title="Gửi (Enter)">
                                <i data-feather="send" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="text-center py-2 text-xs text-gray-500 bg-gray-50 rounded-xl">
                        <a href="auth.html" class="text-[#0A2F1D] font-bold hover:underline">Đăng nhập</a> để tham gia bình luận.
                    </div>
                `}
            </div>
        </article>
    `;
}

function attachPostCardEventListeners(container) {
    // Dropdown 3 chấm
    container.querySelectorAll('.post-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = btn.nextElementSibling;
            document.querySelectorAll('.post-dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });
            menu?.classList.toggle('hidden');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.post-dropdown-menu').forEach(m => m.classList.add('hidden'));
    });

    // Lightbox ảnh
    container.querySelectorAll('.post-lightbox-trigger').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const galleryContainer = img.closest('.post-gallery-container');
            const galleryRaw = galleryContainer?.dataset.gallery;
            const index = parseInt(img.dataset.galleryIndex || '0', 10);
            if (galleryRaw) {
                try {
                    const gallery = JSON.parse(decodeURIComponent(galleryRaw));
                    openLightbox(gallery, index);
                    return;
                } catch (err) {
                    console.warn('Parse gallery JSON failed:', err);
                }
            }
            openLightbox(img.src, 0);
        });
    });

    // Nút Sửa bài viết
    container.querySelectorAll('[data-edit-post]').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = parseInt(btn.dataset.editPost, 10);
            const post = blogPosts.find(p => p.id === postId);
            if (post) openEditModal(post);
        });
    });

    // Nút Xóa bài viết
    container.querySelectorAll('[data-delete-post]').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = parseInt(btn.dataset.deletePost, 10);
            openDeleteModal(postId);
        });
    });

    // Nút Like
    container.querySelectorAll('[data-like-button]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const postId = parseInt(btn.dataset.likeButton, 10);
            await toggleLikePost(postId, btn);
        });
    });

    // Nút Mở/Đóng Bình luận
    container.querySelectorAll('[data-comment-toggle], [data-comment-count-display]').forEach(el => {
        el.addEventListener('click', async () => {
            const postId = parseInt(el.dataset.commentToggle || el.dataset.commentCountDisplay, 10);
            await toggleCommentsSection(postId);
        });
    });

    // Nhập và gửi bình luận
    container.querySelectorAll('[data-comment-input]').forEach(input => {
        const postId = parseInt(input.dataset.commentInput, 10);
        const submitBtn = container.querySelector(`[data-comment-submit="${postId}"]`);
        
        input.addEventListener('input', () => {
            if (submitBtn) submitBtn.disabled = !input.value.trim();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && input.value.trim()) {
                e.preventDefault();
                submitComment(postId, input, null, submitBtn);
            }
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => submitComment(postId, input, null, submitBtn));
        }
    });
}

// Like bài viết
async function toggleLikePost(postId, button) {
    if (!blogToken()) {
        window.location.href = 'auth.html';
        return;
    }
    button.disabled = true;
    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${postId}/like`, {
            method: 'POST',
            headers: blogHeaders()
        });
        if (!res.ok) throw new Error('Không thể thích bài viết.');
        const data = await res.json();
        
        // Cập nhật post trong mảng blogPosts
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            post.liked = data.liked;
            post.like_count = data.like_count;
        }

        // Cập nhật giao diện nút
        const span = button.querySelector('span');
        const icon = button.querySelector('i');
        if (data.liked) {
            button.className = 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-red-600 bg-red-50 font-bold';
            if (span) span.textContent = 'Đã thích';
            if (icon) {
                icon.classList.add('fill-red-600');
            }
        } else {
            button.className = 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all';
            if (span) span.textContent = 'Thích';
            if (icon) {
                icon.classList.remove('fill-red-600');
            }
        }

        // Cập nhật số hiển thị
        const countDisplay = document.querySelector(`[data-like-count-display="${postId}"]`);
        if (countDisplay) {
            countDisplay.innerHTML = `<i data-feather="heart" class="w-3.5 h-3.5 text-red-400"></i> ${data.like_count} lượt thích`;
            if (window.feather) window.feather.replace();
        }
    } catch (e) {
        showBlogToast(e.message, true);
    } finally {
        button.disabled = false;
    }
}

// Mở/Đóng danh sách bình luận
async function toggleCommentsSection(postId) {
    const section = document.querySelector(`[data-comments-section="${postId}"]`);
    if (!section) return;

    const isHidden = section.classList.contains('hidden');
    if (isHidden) {
        section.classList.remove('hidden');
        await loadComments(postId);
    } else {
        section.classList.add('hidden');
    }
}

async function loadComments(postId, autoExpandParentId = null) {
    const list = document.querySelector(`[data-comments-list="${postId}"]`);
    if (!list) return;

    const section = document.querySelector(`[data-comments-section="${postId}"]`);
    const expandedIds = new Set();
    section?.querySelectorAll('[data-replies-container]:not(.hidden)').forEach(el => {
        expandedIds.add(el.dataset.repliesContainer);
    });
    if (autoExpandParentId) {
        expandedIds.add(String(autoExpandParentId));
    }

    list.innerHTML = '<p class="text-center text-xs text-gray-400 py-2">Đang tải bình luận...</p>';
    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${postId}/comments`, {
            headers: blogHeaders()
        });
        if (!res.ok) throw new Error('Không thể tải bình luận.');
        const comments = await res.json();

        const commentsByParent = new Map();
        comments.forEach((comment) => {
            const parentId = comment.parent_comment_id || null;
            if (!commentsByParent.has(parentId)) commentsByParent.set(parentId, []);
            commentsByParent.get(parentId).push(comment);
        });

        function renderCommentTree(parentId = null, depth = 0) {
            return (commentsByParent.get(parentId) || []).map((comment) => {
                const children = commentsByParent.get(comment.id) || [];
                const hasChildren = children.length > 0;
                const isExpanded = expandedIds.has(String(comment.id));

                return `
                <div class="flex items-start gap-2.5 ${depth ? 'ml-10 mt-2' : 'mt-2.5'}" data-comment-id="${comment.id}" data-post-id="${postId}">
                    ${comment.author?.id ? `
                        <a href="user-profile.html?userId=${comment.author.id}" class="shrink-0 hover:opacity-85 transition-opacity" title="Xem blog của ${blogEscape(comment.author.display_name)}">
                            <img src="${blogEscape(getAvatarUrl(comment.author))}" alt="" class="${depth ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover mt-0.5 shadow-sm">
                        </a>
                    ` : `
                        <img src="${blogEscape(getAvatarUrl(comment.author))}" alt="" class="${depth ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover mt-0.5 shadow-sm shrink-0">
                    `}
                    <div class="min-w-0 flex-1">
                        <div class="inline-block bg-[#F0F2F5] rounded-[18px] px-3.5 py-2 max-w-full">
                            ${comment.author?.id ? `
                                <a href="user-profile.html?userId=${comment.author.id}" class="block text-[13px] font-bold text-gray-900 hover:underline leading-tight" title="Xem blog của ${blogEscape(comment.author.display_name)}">
                                    ${blogEscape(comment.author.display_name)}
                                </a>
                            ` : `
                                <strong class="block text-[13px] font-bold text-gray-900 leading-tight">${blogEscape(comment.author.display_name)}</strong>
                            `}
                            <p class="text-[14px] text-gray-800 leading-relaxed whitespace-pre-line break-words mt-0.5">${blogEscape(comment.content)}</p>
                        </div>
                        <div class="flex items-center gap-3 ml-3 mt-0.5 text-[12px] font-semibold text-gray-500">
                            <span class="text-gray-400 font-normal">${blogTime(comment.created_at)}</span>
                            <button type="button" data-reply-comment="${comment.id}" data-post-id="${postId}" class="hover:underline text-gray-600 hover:text-[#0A2F1D]">Trả lời</button>
                            ${comment.can_delete ? `
                                <button type="button" data-delete-comment="${comment.id}" data-post-id="${postId}" class="hover:underline text-gray-400 hover:text-red-500 transition-colors">Xóa</button>
                            ` : ''}
                        </div>

                        ${hasChildren ? `
                            <button type="button" data-toggle-replies="${comment.id}" data-post-id="${postId}" data-replies-count="${children.length}" class="flex items-center gap-1.5 ml-3 mt-1.5 text-[12px] font-bold text-gray-600 hover:text-[#0A2F1D] hover:underline transition-colors">
                                <i data-feather="corner-down-right" class="w-3.5 h-3.5 text-gray-500"></i>
                                <span data-toggle-replies-text>${isExpanded ? 'Ẩn câu trả lời' : `Xem ${children.length} câu trả lời`}</span>
                            </button>
                            <div data-replies-container="${comment.id}" class="${isExpanded ? '' : 'hidden'} space-y-2 mt-1">
                                ${renderCommentTree(comment.id, depth + 1)}
                            </div>
                        ` : ''}
                    </div>
                </div>`;
            }).join('');
        }

        list.innerHTML = comments.length
            ? renderCommentTree()
            : '<p class="text-center text-sm text-gray-400 py-2">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến.</p>';

        const post = blogPosts.find(p => p.id === postId);
        if (post) post.comment_count = comments.length;
        const countDisplay = document.querySelector(`[data-comment-count-display="${postId}"]`);
        if (countDisplay) {
            countDisplay.innerHTML = `<i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-400"></i> ${comments.length} bình luận`;
        }
        if (window.feather) window.feather.replace();

        const input = document.querySelector(`[data-comment-input="${postId}"]`);
        input?.focus();

    } catch (e) {
        list.innerHTML = `<p class="text-xs text-red-500 py-1">${blogEscape(e.message)}</p>`;
    }
}

async function submitComment(postId, input, parentCommentId = null, submitButton = null) {
    if (!blogToken()) {
        window.location.href = 'auth.html';
        return;
    }
    const content = input.value.trim();
    if (!content) return;
    input.disabled = true;
    if (submitButton) submitButton.disabled = true;

    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${postId}/comments`, {
            method: 'POST',
            headers: blogHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ content, parent_comment_id: parentCommentId })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Không thể gửi bình luận.');
        }

        input.value = '';
        input.dispatchEvent(new Event('input'));
        await loadComments(postId, parentCommentId);
    } catch (e) {
        showBlogToast(e.message, true);
    } finally {
        input.disabled = false;
        if (submitButton) submitButton.disabled = false;
    }
}

async function deleteComment(commentId, postId) {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
        const res = await fetch(`${BLOG_API_URL}/community/comments/${commentId}`, {
            method: 'DELETE',
            headers: blogHeaders()
        });
        if (!res.ok) throw new Error('Không thể xóa bình luận.');
        showBlogToast('Đã xóa bình luận.');
        await loadComments(postId);
    } catch (e) {
        showBlogToast(e.message, true);
    }
}

function setupCommentInteractions() {
    document.addEventListener('click', async (e) => {
        // Nút Trả lời
        const replyBtn = e.target.closest('[data-reply-comment]');
        if (replyBtn) {
            if (!blogToken()) {
                window.location.href = 'auth.html';
                return;
            }
            const postId = parseInt(replyBtn.dataset.postId, 10);
            const commentId = parseInt(replyBtn.dataset.replyComment, 10);
            const section = document.querySelector(`[data-comments-section="${postId}"]`);
            section?.querySelector('[data-reply-composer]')?.remove();

            const commentRow = replyBtn.closest('[data-comment-id]');
            if (!commentRow) return;

            const composer = document.createElement('div');
            composer.dataset.replyComposer = 'true';
            composer.dataset.parentCommentId = commentId;
            composer.dataset.postId = postId;
            composer.className = 'ml-10 mt-2 flex items-center gap-2';
            composer.innerHTML = `
                <img src="${blogEscape(getAvatarUrl(currentUser))}" alt="" class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 shadow-sm">
                <div class="flex-1 flex items-center gap-2 bg-[#F0F2F5] hover:bg-[#E4E6EB]/60 focus-within:bg-[#F0F2F5] focus-within:ring-2 focus-within:ring-[#8CC63F]/30 rounded-[20px] px-3.5 py-1.5 transition-all">
                    <input data-reply-input class="w-full bg-transparent border-0 outline-none text-xs md:text-sm text-gray-900 placeholder-gray-500 py-0.5" maxlength="2000" placeholder="Trả lời bình luận...">
                    <button data-submit-reply type="button" class="text-[#0A2F1D] hover:text-[#8CC63F] p-1 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0" disabled title="Gửi (Enter)">
                        <i data-feather="send" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
                <button data-cancel-reply type="button" class="text-xs text-gray-400 hover:text-gray-600 font-semibold px-1 transition-colors">Hủy</button>
            `;
            commentRow.after(composer);
            if (window.feather) window.feather.replace();
            composer.querySelector('[data-reply-input]')?.focus();
            return;
        }

        // Nút Hủy Trả lời
        const cancelReplyBtn = e.target.closest('[data-cancel-reply]');
        if (cancelReplyBtn) {
            cancelReplyBtn.closest('[data-reply-composer]')?.remove();
            return;
        }

        // Nút Gửi Trả lời
        const submitReplyBtn = e.target.closest('[data-submit-reply]');
        if (submitReplyBtn) {
            const composer = submitReplyBtn.closest('[data-reply-composer]');
            if (composer) {
                const postId = parseInt(composer.dataset.postId, 10);
                const parentId = parseInt(composer.dataset.parentCommentId, 10);
                const replyInput = composer.querySelector('[data-reply-input]');
                await submitComment(postId, replyInput, parentId, submitReplyBtn);
                composer.remove();
            }
            return;
        }

        // Nút Xóa bình luận
        const deleteCommentBtn = e.target.closest('[data-delete-comment]');
        if (deleteCommentBtn) {
            const commentId = parseInt(deleteCommentBtn.dataset.deleteComment, 10);
            const postId = parseInt(deleteCommentBtn.dataset.postId, 10);
            await deleteComment(commentId, postId);
            return;
        }

        // Nút Xem/Ẩn câu trả lời
        const toggleRepliesBtn = e.target.closest('[data-toggle-replies]');
        if (toggleRepliesBtn) {
            const commentId = toggleRepliesBtn.dataset.toggleReplies;
            const postId = toggleRepliesBtn.dataset.postId;
            const section = document.querySelector(`[data-comments-section="${postId}"]`);
            const repliesContainer = section?.querySelector(`[data-replies-container="${commentId}"]`);
            const textSpan = toggleRepliesBtn.querySelector('[data-toggle-replies-text]');
            const count = toggleRepliesBtn.dataset.repliesCount || '1';
            if (repliesContainer) {
                const isHidden = repliesContainer.classList.toggle('hidden');
                if (textSpan) {
                    textSpan.textContent = isHidden ? `Xem ${count} câu trả lời` : 'Ẩn câu trả lời';
                }
            }
            return;
        }
    });

    document.addEventListener('input', (e) => {
        const replyInput = e.target.closest('[data-reply-input]');
        if (replyInput) {
            const composer = replyInput.closest('[data-reply-composer]');
            const submitBtn = composer?.querySelector('[data-submit-reply]');
            if (submitBtn) submitBtn.disabled = !replyInput.value.trim();
        }
    });

    document.addEventListener('keydown', async (e) => {
        const replyInput = e.target.closest('[data-reply-input]');
        if (replyInput && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const composer = replyInput.closest('[data-reply-composer]');
            const submitBtn = composer?.querySelector('[data-submit-reply]');
            if (!composer || !replyInput.value.trim() || submitBtn?.disabled) return;
            const postId = parseInt(composer.dataset.postId, 10);
            const parentId = parseInt(composer.dataset.parentCommentId, 10);
            await submitComment(postId, replyInput, parentId, submitBtn);
            composer.remove();
        }
    });
}

// Setup Modals & Events
function setupLightboxEvents() {
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('btnCloseLightbox');
    const prevBtn = document.getElementById('btnLightboxPrev');
    const nextBtn = document.getElementById('btnLightboxNext');

    backdrop?.addEventListener('click', closeLightbox);
    closeBtn?.addEventListener('click', closeLightbox);

    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        prevBlogLightbox();
    });

    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        nextBlogLightbox();
    });

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('imageLightboxModal');
        if (!modal || modal.classList.contains('pointer-events-none')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBlogLightbox();
        if (e.key === 'ArrowRight') nextBlogLightbox();
    });
}

function renderBlogCreateImagesPreview() {
    const grid = document.getElementById('createPostImagesGrid');
    const countContainer = document.getElementById('createPostImagesCount');
    const countNum = document.getElementById('createPostCountNum');
    const uploadPlaceholder = document.getElementById('createUploadPlaceholder');
    if (!grid) return;

    grid.innerHTML = '';
    if (selectedBlogCreateFiles.length === 0) {
        grid.classList.add('hidden');
        if (countContainer) countContainer.classList.add('hidden');
        if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    if (countContainer) countContainer.classList.remove('hidden');
    if (countNum) countNum.textContent = selectedBlogCreateFiles.length;

    selectedBlogCreateFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50';

        const img = document.createElement('img');
        img.className = 'w-full h-full object-cover';
        img.src = URL.createObjectURL(file);
        item.appendChild(img);

        // Badge ảnh đại diện cho ảnh đầu tiên (index 0)
        if (index === 0) {
            const badge = document.createElement('span');
            badge.className = 'absolute top-1 left-1 bg-[#8CC63F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-0.5';
            badge.innerHTML = '<i data-feather="star" class="w-3 h-3 fill-white"></i> Đại diện';
            item.appendChild(badge);
        }

        // Nút xoá từng ảnh
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10';
        removeBtn.innerHTML = '<i data-feather="x" class="w-3.5 h-3.5"></i>';
        removeBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            selectedBlogCreateFiles.splice(index, 1);
            renderBlogCreateImagesPreview();
        });
        item.appendChild(removeBtn);

        grid.appendChild(item);
    });

    if (window.feather) feather.replace();
}

function setupModalEvents() {
    // Nút mở modal tạo bài viết
    document.getElementById('btnOpenCreateModal')?.addEventListener('click', openCreateModal);
    document.getElementById('btnQuickPostTrigger')?.addEventListener('click', openCreateModal);

    // Đóng modal tạo bài viết
    const createModal = document.getElementById('createPostModal');
    document.getElementById('btnCloseCreateModal')?.addEventListener('click', closeCreateModal);
    document.getElementById('btnCancelCreateModal')?.addEventListener('click', closeCreateModal);
    document.getElementById('createModalBackdrop')?.addEventListener('click', closeCreateModal);

    // Form tạo bài viết
    const createForm = document.getElementById('createPostForm');
    createForm?.addEventListener('submit', handleCreatePostSubmit);

    // Xử lý upload ảnh modal tạo bài (Hỗ trợ nhiều ảnh, ảnh đầu là đại diện)
    const postImageInput = document.getElementById('createPostImage');
    const btnClearImages = document.getElementById('btnClearCreateImages');

    postImageInput?.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const maxTotal = 10;
        const validFiles = files.filter(f => f.type.startsWith('image/'));

        if (selectedBlogCreateFiles.length + validFiles.length > maxTotal) {
            showBlogToast(`Bạn chỉ có thể chọn tối đa ${maxTotal} ảnh cho một bài viết.`, true);
        }

        for (const file of validFiles) {
            if (selectedBlogCreateFiles.length >= maxTotal) break;
            if (file.size > 10 * 1024 * 1024) {
                showBlogToast(`Ảnh ${file.name} vượt quá 10MB và sẽ bị bỏ qua.`, true);
                continue;
            }
            selectedBlogCreateFiles.push(file);
        }

        renderBlogCreateImagesPreview();
        postImageInput.value = '';
    });

    btnClearImages?.addEventListener('click', () => {
        selectedBlogCreateFiles = [];
        if (postImageInput) postImageInput.value = '';
        renderBlogCreateImagesPreview();
    });

    // Modal Sửa bài viết
    const editModal = document.getElementById('editPostModal');
    document.getElementById('btnCloseEditModal')?.addEventListener('click', closeEditModal);
    document.getElementById('btnCancelEditModal')?.addEventListener('click', closeEditModal);
    document.getElementById('editModalBackdrop')?.addEventListener('click', closeEditModal);

    const editForm = document.getElementById('editPostForm');
    editForm?.addEventListener('submit', handleEditPostSubmit);

    // Modal Xóa bài viết
    const deleteModal = document.getElementById('deletePostModal');
    document.getElementById('btnCloseDeleteModal')?.addEventListener('click', closeDeleteModal);
    document.getElementById('btnCancelDeleteModal')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteModalBackdrop')?.addEventListener('click', closeDeleteModal);
    document.getElementById('btnConfirmDeletePost')?.addEventListener('click', handleConfirmDelete);
}

function openCreateModal() {
    const modal = document.getElementById('createPostModal');
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('createPostContent')?.classList.remove('scale-95');
    document.getElementById('createPostTitle')?.focus();
}

function closeCreateModal() {
    const modal = document.getElementById('createPostModal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('createPostContent')?.classList.add('scale-95');
    // Reset form & ảnh
    document.getElementById('createPostForm')?.reset();
    selectedBlogCreateFiles = [];
    renderBlogCreateImagesPreview();
}

async function handleCreatePostSubmit(e) {
    e.preventDefault();
    const titleInput = document.getElementById('createPostTitle');
    const contentInput = document.getElementById('createPostContentText');
    const postTypeSelect = document.getElementById('createPostType');
    const submitBtn = document.getElementById('btnSubmitCreatePost');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const postType = postTypeSelect ? postTypeSelect.value : 'general';

    if (!title || !content) {
        showBlogToast('Vui lòng nhập đầy đủ tiêu đề và nội dung.', true);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-feather="loader" class="w-4 h-4 animate-spin inline mr-1"></i> Đang đăng...';
    if (window.feather) window.feather.replace();

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('post_type', postType);

        // Gửi nhiều file ảnh (ảnh đầu tiên là đại diện)
        if (selectedBlogCreateFiles && selectedBlogCreateFiles.length > 0) {
            selectedBlogCreateFiles.forEach(file => {
                formData.append('files', file);
            });
            formData.append('file', selectedBlogCreateFiles[0]);
        }

        const res = await fetch(`${BLOG_API_URL}/community/posts`, {
            method: 'POST',
            headers: blogHeaders(),
            body: formData
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Không thể đăng bài viết.');
        }

        const newPost = await res.json();
        showBlogToast('Đăng bài viết thành công!');
        closeCreateModal();

        // Tải lại danh sách bài viết & profile
        await loadUserProfileAndPosts();

    } catch (err) {
        showBlogToast(err.message, true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Đăng bài viết';
    }
}

// Edit Modal
function openEditModal(post) {
    const modal = document.getElementById('editPostModal');
    if (!modal) return;
    document.getElementById('editPostId').value = post.id;
    document.getElementById('editPostTitle').value = post.title;
    document.getElementById('editPostContentText').value = post.content;

    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('editModalContent')?.classList.remove('scale-95');
    document.getElementById('editPostTitle')?.focus();
}

function closeEditModal() {
    const modal = document.getElementById('editPostModal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('editModalContent')?.classList.add('scale-95');
}

async function handleEditPostSubmit(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editPostId').value, 10);
    const title = document.getElementById('editPostTitle').value.trim();
    const content = document.getElementById('editPostContentText').value.trim();
    const submitBtn = document.getElementById('btnSubmitEditPost');

    if (!title || !content) {
        showBlogToast('Vui lòng không để trống tiêu đề hoặc nội dung.', true);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-feather="loader" class="w-4 h-4 animate-spin inline mr-1"></i> Đang lưu...';
    if (window.feather) window.feather.replace();

    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${id}`, {
            method: 'PUT',
            headers: blogHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ title, content })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Không thể cập nhật bài viết.');
        }

        showBlogToast('Cập nhật bài viết thành công!');
        closeEditModal();
        await loadUserProfileAndPosts();

    } catch (err) {
        showBlogToast(err.message, true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Lưu thay đổi';
    }
}

// Delete Modal
function openDeleteModal(postId) {
    deletePostIdTarget = postId;
    const modal = document.getElementById('deletePostModal');
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('deleteModalContent')?.classList.remove('scale-95');
}

function closeDeleteModal() {
    deletePostIdTarget = null;
    const modal = document.getElementById('deletePostModal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('deleteModalContent')?.classList.add('scale-95');
}

async function handleConfirmDelete() {
    if (!deletePostIdTarget) return;
    const btn = document.getElementById('btnConfirmDeletePost');
    btn.disabled = true;
    btn.innerHTML = '<i data-feather="loader" class="w-4 h-4 animate-spin inline mr-1"></i> Đang xóa...';
    if (window.feather) window.feather.replace();

    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${deletePostIdTarget}`, {
            method: 'DELETE',
            headers: blogHeaders()
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Không thể xóa bài viết.');
        }

        showBlogToast('Đã xóa bài viết thành công.');
        closeDeleteModal();
        await loadUserProfileAndPosts();

    } catch (err) {
        showBlogToast(err.message, true);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Xác nhận xóa';
    }
}

