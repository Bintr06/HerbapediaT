const BLOG_API_URL = 'http://127.0.0.1:8000';

let currentUser = null;
let targetUserId = null;
let isOwner = false;
let blogPosts = [];
let deletePostIdTarget = null;
let currentPreviewImageFile = null;

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
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN', {
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

// Lightbox
function openLightbox(src) {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;
    img.src = src;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    img.classList.remove('scale-95');
}

function closeLightbox() {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    img.classList.add('scale-95');
    setTimeout(() => { if (img) img.src = ''; }, 200);
}

// Khởi tạo trang Blog cá nhân
document.addEventListener('DOMContentLoaded', async () => {
    setupLightboxEvents();
    setupModalEvents();

    const urlParams = new URLSearchParams(window.location.search);
    const paramUserId = urlParams.get('userId') || urlParams.get('author_id') || urlParams.get('id');

    // Lấy thông tin người dùng đang đăng nhập nếu có
    if (blogToken()) {
        try {
            const meRes = await fetch(`${BLOG_API_URL}/auth/me`, { headers: blogHeaders() });
            if (meRes.ok) {
                currentUser = await meRes.json();
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

function renderProfileHeader(profile) {
    const avatarImg = document.getElementById('profileAvatar');
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    const roleBadgeEl = document.getElementById('profileRoleBadge');
    const postCountEl = document.getElementById('profilePostCount');
    const likeCountEl = document.getElementById('profileLikeCount');
    const joinDateEl = document.getElementById('profileJoinDate');
    const ownerActionsEl = document.getElementById('profileOwnerActions');
    const quickCreatorEl = document.getElementById('blogQuickCreator');
    const tabPostCountEl = document.getElementById('tabPostCount');

    if (avatarImg) {
        avatarImg.src = getAvatarUrl(profile);
        avatarImg.alt = profile.display_name || profile.username;
    }
    if (nameEl) {
        nameEl.textContent = profile.display_name || profile.username;
    }
    if (emailEl) {
        emailEl.textContent = profile.username;
    }
    if (roleBadgeEl) {
        if (profile.role === 'admin') {
            roleBadgeEl.className = 'inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3.5 py-1 rounded-full text-xs font-bold border border-yellow-200';
            roleBadgeEl.innerHTML = '<i data-feather="shield" class="w-3.5 h-3.5"></i> Quản trị viên';
        } else {
            roleBadgeEl.className = 'inline-flex items-center gap-1.5 bg-[#F7F9F5] text-[#0A2F1D] px-3.5 py-1 rounded-full text-xs font-bold border border-[#E8F2DB]';
            roleBadgeEl.innerHTML = '<i data-feather="check-circle" class="w-3.5 h-3.5 text-[#8CC63F]"></i> Chuyên gia / Thành viên';
        }
    }
    if (postCountEl) postCountEl.textContent = profile.post_count ?? 0;
    if (likeCountEl) likeCountEl.textContent = profile.total_likes ?? 0;
    if (tabPostCountEl) tabPostCountEl.textContent = profile.post_count ?? 0;

    if (joinDateEl) {
        joinDateEl.textContent = profile.created_at
            ? new Date(profile.created_at).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
            : '--';
    }

    document.title = `Blog của ${profile.display_name || profile.username} - HerbaPedia`;

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
                            ${author.role === 'admin' ? '<span class="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Admin</span>' : ''}
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
            ${post.image_url ? `
                <div class="mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <img src="${blogEscape(post.image_url)}" alt="${blogEscape(post.title)}" class="post-lightbox-trigger w-full max-h-[460px] object-cover rounded-xl cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]" loading="lazy">
                </div>
            ` : ''}

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
                    <div class="flex items-start gap-2.5 pt-2">
                        <img src="${blogEscape(getAvatarUrl(currentUser))}" class="w-8 h-8 rounded-full object-cover shrink-0 mt-1">
                        <div class="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#8CC63F]/30 focus-within:border-[#8CC63F] focus-within:bg-white transition-all">
                            <input type="text" data-comment-input="${post.id}" placeholder="Viết bình luận của bạn..." class="w-full bg-transparent border-0 outline-none text-sm text-gray-800 placeholder-gray-400">
                            <button type="button" data-comment-submit="${post.id}" class="text-[#0A2F1D] font-bold text-sm px-2 py-1 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-40" disabled>
                                Gửi
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="text-center py-2 text-xs text-gray-500">
                        <a href="auth.html" class="text-[#0A2F1D] font-bold underline hover:text-[#8CC63F]">Đăng nhập</a> để tham gia bình luận.
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
        img.addEventListener('click', () => openLightbox(img.src));
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
                submitComment(postId, input);
            }
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => submitComment(postId, input));
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

async function loadComments(postId) {
    const list = document.querySelector(`[data-comments-list="${postId}"]`);
    if (!list) return;

    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${postId}/comments`, {
            headers: blogHeaders()
        });
        if (!res.ok) throw new Error('Không thể tải bình luận.');
        const comments = await res.json();

        if (comments.length === 0) {
            list.innerHTML = `<p class="text-xs text-gray-400 italic py-1">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>`;
            return;
        }

        list.innerHTML = comments.map(c => `
            <div class="flex items-start gap-2.5 group" data-comment-id="${c.id}">
                <img src="${blogEscape(getAvatarUrl(c.author))}" class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5">
                <div class="flex-1 bg-gray-50 rounded-2xl px-3.5 py-2 text-xs md:text-sm">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-bold text-[#0A2F1D]">${blogEscape(c.author.display_name)}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[11px] text-gray-400">${blogTime(c.created_at)}</span>
                            ${c.can_delete ? `
                                <button type="button" data-delete-comment="${c.id}" data-post-id="${postId}" class="text-gray-400 hover:text-red-500 transition-colors p-0.5 opacity-0 group-hover:opacity-100" title="Xóa bình luận">
                                    <i data-feather="trash-2" class="w-3 h-3"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">${blogEscape(c.content)}</p>
                </div>
            </div>
        `).join('');

        if (window.feather) window.feather.replace();

        // Gắn sự kiện xóa bình luận
        list.querySelectorAll('[data-delete-comment]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const commentId = parseInt(btn.dataset.deleteComment, 10);
                await deleteComment(commentId, postId);
            });
        });

    } catch (e) {
        list.innerHTML = `<p class="text-xs text-red-500 py-1">${blogEscape(e.message)}</p>`;
    }
}

async function submitComment(postId, input) {
    const content = input.value.trim();
    if (!content) return;
    input.disabled = true;

    try {
        const res = await fetch(`${BLOG_API_URL}/community/posts/${postId}/comments`, {
            method: 'POST',
            headers: blogHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ content })
        });
        if (!res.ok) throw new Error('Không thể gửi bình luận.');

        input.value = '';
        input.dispatchEvent(new Event('input'));
        await loadComments(postId);

        // Cập nhật comment count
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            post.comment_count = (post.comment_count || 0) + 1;
            const countDisplay = document.querySelector(`[data-comment-count-display="${postId}"]`);
            if (countDisplay) {
                countDisplay.innerHTML = `<i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-400"></i> ${post.comment_count} bình luận`;
                if (window.feather) window.feather.replace();
            }
        }
    } catch (e) {
        showBlogToast(e.message, true);
    } finally {
        input.disabled = false;
        input.focus();
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

        const post = blogPosts.find(p => p.id === postId);
        if (post && post.comment_count > 0) {
            post.comment_count -= 1;
            const countDisplay = document.querySelector(`[data-comment-count-display="${postId}"]`);
            if (countDisplay) {
                countDisplay.innerHTML = `<i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-400"></i> ${post.comment_count} bình luận`;
                if (window.feather) window.feather.replace();
            }
        }
    } catch (e) {
        showBlogToast(e.message, true);
    }
}

// Setup Modals & Events
function setupLightboxEvents() {
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('btnCloseLightbox');
    backdrop?.addEventListener('click', closeLightbox);
    closeBtn?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
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

    // Xử lý upload ảnh modal tạo bài
    const postImageInput = document.getElementById('createPostImage');
    const postImagePreview = document.getElementById('createPostImagePreview');
    const removeImageBtn = document.getElementById('btnRemovePostImage');
    const uploadPlaceholder = document.getElementById('createUploadPlaceholder');

    postImageInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            currentPreviewImageFile = file;
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (postImagePreview) {
                    postImagePreview.src = evt.target.result;
                    postImagePreview.classList.remove('hidden');
                }
                uploadPlaceholder?.classList.add('hidden');
                removeImageBtn?.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (postImageInput) postImageInput.value = '';
        currentPreviewImageFile = null;
        postImagePreview?.classList.add('hidden');
        if (postImagePreview) postImagePreview.src = '';
        uploadPlaceholder?.classList.remove('hidden');
        removeImageBtn?.classList.add('hidden');
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
    // Reset form
    document.getElementById('createPostForm')?.reset();
    document.getElementById('btnRemovePostImage')?.click();
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
        if (currentPreviewImageFile) {
            formData.append('file', currentPreviewImageFile);
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

