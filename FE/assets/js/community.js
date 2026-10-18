const COMMUNITY_API = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'https://herbapedia-production.up.railway.app';
let communityCurrentUserAvatar = 'assets/images/logo.png';
let allCommunityPosts = [];
let currentFilter = 'all';
let currentSearch = '';

function communityEscape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
}

function communityToken() {
    return localStorage.getItem('accessToken');
}

function communityHeaders() {
    const token = communityToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function communityFirstName(fullName) {
    const normalizedName = String(fullName || '').trim();
    if (!normalizedName) return '';
    const nameParts = normalizedName.split(/\s+/);
    return nameParts[nameParts.length - 1];
}

async function loadCommunityUserProfile() {
    const avatar = document.getElementById('communityUserAvatar');
    const creatorAvatar = document.getElementById('communityPostCreatorAvatar');
    const name = document.getElementById('communityUserName');
    const blogLink = document.getElementById('communityBlogLink');
    if (!communityToken()) {
        document.querySelector('[data-notification-bell]')?.closest('li')?.remove();
    }
    if (!avatar || !name) return;

    if (!communityToken()) {
        const accountItem = avatar.closest('.nav-links > li.relative.group');
        accountItem?.remove();
        document.querySelector('[data-notification-bell]')?.closest('li')?.remove();
        const nav = document.querySelector('.nav-links');
        if (nav && !nav.querySelector('[data-login-link]')) {
            const loginItem = document.createElement('li');
            loginItem.dataset.loginLink = 'true';
            loginItem.innerHTML = `
                <a href="auth.html" class="text-[#0A2F1D] font-bold hover:text-[#8CC63F] transition-colors">
                    Đăng nhập
                </a>
            `;
            nav.appendChild(loginItem);
        }
        return;
    }

    const fallbackName = localStorage.getItem('userName') || '';
    let displayName = fallbackName;
    let avatarUrl = avatar.src;

    if (communityToken()) {
        try {
            const response = await fetch(`${COMMUNITY_API}/auth/me`, {
                headers: communityHeaders()
            });
            if (response.ok) {
                const profile = await response.json();
                const profileName = String(profile.display_name || '').trim();
                const username = String(profile.username || '').trim();
                displayName = profileName && !profileName.includes('@') &&
                    profileName.toLowerCase() !== username.toLowerCase()
                    ? profileName
                    : '';
                avatarUrl = profile.avatar_url || avatarUrl;
                localStorage.setItem('userName', displayName);
                if (profile.avatar_url) localStorage.setItem('userAvatar', profile.avatar_url);
                communityCurrentUserAvatar = profile.avatar_url || 'assets/images/logo.png';
            }
        } catch (error) {
            console.warn('Không thể tải thông tin hồ sơ trên navbar.', error);
        }
    }

    if (communityCurrentUserAvatar === 'assets/images/logo.png') {
        communityCurrentUserAvatar = localStorage.getItem('userAvatar') || avatarUrl;
    }
    if (creatorAvatar) {
        creatorAvatar.src = communityCurrentUserAvatar;
    }

    const firstName = communityFirstName(displayName);
    name.textContent = `Hi, ${firstName}`;
    avatar.src = avatarUrl;
    avatar.alt = `Ảnh đại diện của ${displayName}`;
    if (blogLink) {
        blogLink.href = 'user-profile.html';
    }
}

function parseUtcDate(value) {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    let s = String(value).trim();
    if (!s.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(s)) {
        s = s.replace(' ', 'T') + 'Z';
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date(value) : d;
}

function communityTime(value) {
    if (!value) return '';
    const date = parseUtcDate(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
}

function sanitizePublicName(name) {
    if (!name) return 'Người dùng HerbaPedia';
    const s = String(name).trim();
    if (s.includes('@')) {
        return s.split('@')[0];
    }
    return s;
}

function communityAvatar(post) {
    const authorName = sanitizePublicName(post.author?.display_name);
    return post.author?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0A2F1D&color=fff`;
}

function communityAuthorAvatar(author) {
    const authorName = sanitizePublicName(author?.display_name);
    return author?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0A2F1D&color=fff`;
}

function renderPostImages(post) {
    const images = Array.isArray(post.images) && post.images.length > 0
        ? post.images
        : (post.image_url ? [post.image_url] : []);

    if (images.length === 0) return '';

    const safeTitle = communityEscape(post.title || '');
    const galleryJson = encodeURIComponent(JSON.stringify(images));

    if (images.length === 1) {
        return `
            <div class="rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 max-h-[460px] cursor-pointer group relative post-gallery-container" data-gallery="${galleryJson}">
                <img src="${communityEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-300" loading="lazy">
            </div>`;
    }

    if (images.length === 2) {
        return `
            <div class="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 h-64 sm:h-80 post-gallery-container" data-gallery="${galleryJson}">
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${communityEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${communityEscape(images[1])}" alt="${safeTitle}" data-gallery-index="1" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
            </div>`;
    }

    if (images.length === 3) {
        return `
            <div class="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 h-72 sm:h-96 post-gallery-container" data-gallery="${galleryJson}">
                <div class="col-span-2 relative overflow-hidden cursor-pointer group h-full">
                    <img src="${communityEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="col-span-1 flex flex-col gap-2 h-full">
                    <div class="relative overflow-hidden cursor-pointer group flex-1">
                        <img src="${communityEscape(images[1])}" alt="${safeTitle}" data-gallery-index="1" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    </div>
                    <div class="relative overflow-hidden cursor-pointer group flex-1">
                        <img src="${communityEscape(images[2])}" alt="${safeTitle}" data-gallery-index="2" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    </div>
                </div>
            </div>`;
    }

    const remainingCount = images.length - 4;
    return `
        <div class="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 h-80 sm:h-96 post-gallery-container" data-gallery="${galleryJson}">
            <div class="relative overflow-hidden cursor-pointer group h-full">
                <img src="${communityEscape(images[0])}" alt="${safeTitle}" data-gallery-index="0" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 h-full">
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${communityEscape(images[1])}" alt="${safeTitle}" data-gallery-index="1" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="relative overflow-hidden cursor-pointer group h-full">
                    <img src="${communityEscape(images[2])}" alt="${safeTitle}" data-gallery-index="2" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="col-span-full relative overflow-hidden cursor-pointer group h-full">
                    <img src="${communityEscape(images[3])}" alt="${safeTitle}" data-gallery-index="3" class="post-lightbox-trigger w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    ${remainingCount > 0 ? `
                        <div class="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center text-white text-xl sm:text-2xl font-bold group-hover:bg-black/65 transition-colors">
                            +${remainingCount}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
}

function renderCommunityPost(post) {
    const isRemedy = post.post_type === 'remedy';
    const postTypeBadge = isRemedy
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-50 text-forest-900 border border-green-200"><i data-feather="book-open" class="w-3 h-3 text-[#8CC63F]"></i> Bài thuốc dân gian</span>`
        : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200"><i data-feather="message-circle" class="w-3 h-3 text-gray-400"></i> Chia sẻ kinh nghiệm</span>`;

    const deleteButton = post.can_delete
        ? `<button data-delete-post type="button" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Xóa bài viết">
                <i data-feather="trash-2" class="w-4 h-4"></i>
           </button>`
        : '';

    const commentComposer = communityToken()
        ? `<div class="flex items-start gap-2.5 mt-3 pt-2 border-t border-gray-100">
                <img src="${communityEscape(communityCurrentUserAvatar)}" alt="Ảnh đại diện của bạn" class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-sm">
                <div class="flex-1 flex items-center gap-2 bg-[#F0F2F5] hover:bg-[#E4E6EB]/60 focus-within:bg-[#F0F2F5] focus-within:ring-2 focus-within:ring-[#8CC63F]/30 rounded-[20px] px-3.5 py-1.5 transition-all">
                    <input data-comment-input class="w-full bg-transparent border-0 outline-none text-[13px] text-gray-900 placeholder-gray-500 py-1" maxlength="2000" placeholder="Viết bình luận công khai...">
                    <button data-submit-comment type="button" class="text-[#0A2F1D] hover:text-[#8CC63F] p-1 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0" disabled title="Gửi (Enter)">
                        <i data-feather="send" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>`
        : '<div class="mt-3 text-center py-2 text-xs text-gray-500 bg-gray-50 rounded-xl"><a href="auth.html" class="text-[#0A2F1D] font-bold hover:underline">Đăng nhập</a> để tham gia bình luận.</div>';

    return `
        <article class="community-post bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5 mb-5 transition-all hover:shadow-md" data-post-id="${post.id}">
            <!-- Header post -->
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <a href="user-profile.html?userId=${post.author.id}" class="shrink-0 hover:opacity-85 transition-opacity" title="Xem blog của ${communityEscape(sanitizePublicName(post.author.display_name))}">
                        <img src="${communityEscape(communityAvatar(post))}" alt="" class="w-10 h-10 rounded-full object-cover shadow-sm">
                    </a>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <a href="user-profile.html?userId=${post.author.id}" class="hover:underline" title="Xem blog của ${communityEscape(sanitizePublicName(post.author.display_name))}">
                                <h4 class="font-bold text-[#0A2F1D] text-sm truncate">${communityEscape(sanitizePublicName(post.author.display_name))}</h4>
                            </a>
                            <span class="text-xs text-gray-400">• ${communityTime(post.created_at)}</span>
                        </div>
                        <div class="mt-0.5">
                            ${postTypeBadge}
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    ${deleteButton}
                </div>
            </div>

            <!-- Title & Content -->
            <h3 class="font-bold text-base sm:text-lg mb-2 text-gray-900 leading-snug">${communityEscape(post.title)}</h3>
            <div class="text-gray-700 text-sm whitespace-pre-line leading-relaxed mb-4 font-light">${communityEscape(post.content)}</div>
            
            ${renderPostImages(post)}
            
            <!-- Reactions counter bar -->
            <div class="flex items-center justify-between text-gray-500 text-xs mb-3 px-1 border-b border-gray-50 pb-2">
                <span data-like-count class="flex items-center gap-1 font-medium"><i data-feather="heart" class="w-3.5 h-3.5 text-red-500"></i> ${post.like_count} lượt thích</span>
                <span data-toggle-comments data-comment-count role="button" tabindex="0" class="flex items-center gap-1 font-medium cursor-pointer hover:underline"><i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-500"></i> ${post.comment_count} bình luận</span>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-between gap-1 pt-1 border-t border-gray-100 text-xs">
                <button data-like-post class="flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${post.liked ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-600 hover:bg-gray-50'}">
                    <i data-feather="heart" class="w-4 h-4 ${post.liked ? 'fill-red-600' : ''}"></i> <span>${post.liked ? 'Đã thích' : 'Thích'}</span>
                </button>
                <button data-toggle-comments class="flex-1 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2">
                    <i data-feather="message-square" class="w-4 h-4"></i> <span>Bình luận</span>
                </button>
                <button data-share-post class="flex-1 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2">
                    <i data-feather="share-2" class="w-4 h-4"></i> <span>Chia sẻ</span>
                </button>
            </div>

            <!-- Comments section -->
            <div data-comments class="hidden mt-3 border-t border-gray-100 pt-3">
                <div data-comment-list class="space-y-3 mb-3"></div>
                ${commentComposer}
            </div>
        </article>`;
}

async function loadCommunityPosts() {
    const feed = document.getElementById('communityFeed');
    const creator = document.getElementById('postCreator');
    if (!feed) return;

    if (creator) {
        if (!communityToken()) {
            creator.classList.add('hidden');
        } else {
            creator.classList.remove('hidden');
        }
    }

    try {
        const response = await fetch(`${COMMUNITY_API}/community/posts`, { headers: communityHeaders() });
        if (!response.ok) throw new Error('Không thể tải bài viết cộng đồng.');
        allCommunityPosts = await response.json();
        renderFilteredPosts();
    } catch (err) {
        console.error(err);
        feed.innerHTML = '<p class="text-center text-gray-500 bg-white rounded-2xl p-6">Không thể tải bài viết cộng đồng.</p>';
    }
}

function renderFilteredPosts() {
    const feed = document.getElementById('communityFeed');
    if (!feed) return;

    let posts = allCommunityPosts;
    if (currentFilter !== 'all') {
        posts = posts.filter(p => (p.post_type || 'general') === currentFilter);
    }
    if (currentSearch) {
        const q = currentSearch.toLowerCase();
        posts = posts.filter(p => 
            (p.title || '').toLowerCase().includes(q) ||
            (p.content || '').toLowerCase().includes(q) ||
            (p.author?.display_name || '').toLowerCase().includes(q)
        );
    }

    if (posts.length === 0) {
        feed.innerHTML = `
            <div class="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                <i data-feather="inbox" class="w-10 h-10 mx-auto mb-2 text-gray-300"></i>
                <p class="text-sm font-semibold text-gray-700">Chưa có bài viết nào phù hợp.</p>
                <p class="text-xs text-gray-400 mt-1">Hãy là người đầu tiên đăng bài thuốc hay chia sẻ kinh nghiệm!</p>
            </div>
        `;
    } else {
        feed.innerHTML = posts.map(renderCommunityPost).join('');
    }
    if (window.feather) feather.replace();

    // Tự động cuộn đến bài viết cụ thể nếu có query param ?post=ID
    const targetPostId = new URLSearchParams(window.location.search).get('post');
    if (targetPostId) {
        const targetPost = feed.querySelector(`[data-post-id="${CSS.escape(targetPostId)}"]`);
        if (targetPost) {
            targetPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetPost.classList.add('ring-2', 'ring-[#8CC63F]');
            window.setTimeout(() => targetPost.classList.remove('ring-2', 'ring-[#8CC63F]'), 2500);
            const comments = targetPost.querySelector('[data-comments]');
            if (comments) {
                comments.classList.remove('hidden');
                loadComments(targetPost);
            }
        }
    }
}

async function toggleCommunityLike(postElement) {
    const response = await fetch(`${COMMUNITY_API}/community/posts/${postElement.dataset.postId}/like`, {
        method: 'POST', headers: communityHeaders()
    });
    if (!response.ok) throw new Error('Không thể cập nhật lượt thích.');
    const result = await response.json();
    const countEl = postElement.querySelector('[data-like-count]');
    if (countEl) {
        countEl.innerHTML = `<i data-feather="heart" class="w-3.5 h-3.5 text-red-500"></i> ${result.like_count} lượt thích`;
    }
    const button = postElement.querySelector('[data-like-post]');
    if (button) {
        button.className = `flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            result.liked ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-600 hover:bg-gray-50'
        }`;
        button.innerHTML = `<i data-feather="heart" class="w-4 h-4 ${result.liked ? 'fill-red-600' : ''}"></i> <span>${result.liked ? 'Đã thích' : 'Thích'}</span>`;
    }
    if (window.feather) feather.replace();
}

async function loadComments(postElement, autoExpandParentId = null) {
    const list = postElement.querySelector('[data-comment-list]');

    const expandedIds = new Set();
    postElement.querySelectorAll('[data-replies-container]:not(.hidden)').forEach(el => {
        expandedIds.add(el.dataset.repliesContainer);
    });
    if (autoExpandParentId) {
        expandedIds.add(String(autoExpandParentId));
    }

    list.innerHTML = '<p class="text-center text-xs text-gray-400 py-2">Đang tải bình luận...</p>';
    const response = await fetch(`${COMMUNITY_API}/community/posts/${postElement.dataset.postId}/comments`, {
        headers: communityHeaders()
    });
    if (!response.ok) throw new Error('Không thể tải bình luận.');
    const comments = await response.json();
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
            <div class="flex items-start gap-2.5 ${depth ? 'ml-10 mt-2' : 'mt-2.5'}" data-comment-id="${comment.id}">
                ${comment.author?.id ? `
                    <a href="user-profile.html?userId=${comment.author.id}" class="shrink-0 hover:opacity-85 transition-opacity" title="Xem blog của ${communityEscape(comment.author.display_name)}">
                        <img src="${communityEscape(communityAuthorAvatar(comment.author))}" alt="" class="${depth ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover mt-0.5 shadow-sm">
                    </a>
                ` : `
                    <img src="${communityEscape(communityAuthorAvatar(comment.author))}" alt="" class="${depth ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover mt-0.5 shadow-sm shrink-0">
                `}
                <div class="min-w-0 flex-1">
                    <div class="inline-block bg-[#F0F2F5] rounded-[18px] px-3.5 py-2 max-w-full">
                        ${comment.author?.id ? `
                            <a href="user-profile.html?userId=${comment.author.id}" class="block text-[13px] font-bold text-gray-900 hover:underline leading-tight" title="Xem blog của ${communityEscape(sanitizePublicName(comment.author.display_name))}">
                                ${communityEscape(sanitizePublicName(comment.author.display_name))}
                            </a>
                        ` : `
                            <strong class="block text-[13px] font-bold text-gray-900 leading-tight">${communityEscape(sanitizePublicName(comment.author?.display_name))}</strong>
                        `}
                        <p class="text-[13px] text-gray-800 leading-relaxed whitespace-pre-line break-words mt-0.5">${communityEscape(comment.content)}</p>
                    </div>
                    <div class="flex items-center gap-3 ml-3 mt-0.5 text-[11px] font-semibold text-gray-500">
                        <span class="text-gray-400 font-normal">${communityTime(comment.created_at)}</span>
                        <button type="button" data-reply-comment="${comment.id}" class="hover:underline text-gray-600 hover:text-[#0A2F1D]">Trả lời</button>
                        ${comment.can_delete ? `
                            <button type="button" data-delete-community-comment="${comment.id}" class="hover:underline text-gray-400 hover:text-red-500 transition-colors">Xóa</button>
                        ` : ''}
                    </div>

                    ${hasChildren ? `
                        <button type="button" data-toggle-replies="${comment.id}" data-replies-count="${children.length}" class="flex items-center gap-1.5 ml-3 mt-1.5 text-[11px] font-bold text-gray-600 hover:text-[#0A2F1D] hover:underline transition-colors">
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
        : '<p class="text-center text-xs text-gray-400 py-2">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến.</p>';
    const commentCountEl = postElement.querySelector('[data-comment-count]');
    if (commentCountEl) {
        commentCountEl.innerHTML = `<i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-500"></i> ${comments.length} bình luận`;
    }
    if (window.feather) feather.replace();
    const input = postElement.querySelector('[data-comment-input]');
    input?.focus();
}

async function submitCommunityComment(postElement, parentCommentId = null, input = null, submitButton = null) {
    input = input || postElement.querySelector('[data-comment-input]');
    const content = input.value.trim();
    if (!content) return;
    submitButton = submitButton || postElement.querySelector('[data-submit-comment]');
    if (submitButton) submitButton.disabled = true;
    const response = await fetch(`${COMMUNITY_API}/community/posts/${postElement.dataset.postId}/comments`, {
        method: 'POST',
        headers: { ...communityHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parent_comment_id: parentCommentId })
    });
    if (!response.ok) {
        if (submitButton) submitButton.disabled = false;
        throw new Error('Không thể đăng bình luận.');
    }
    input.value = '';
    await loadComments(postElement, parentCommentId);
    if (submitButton) submitButton.disabled = true;
}

let selectedNormalFiles = [];
let selectedRemedyFiles = [];
let currentLightboxGallery = [];
let currentLightboxIndex = 0;

function clearCommunityImages(type) {
    if (type === 'normal') {
        selectedNormalFiles = [];
    } else {
        selectedRemedyFiles = [];
    }
    const input = document.getElementById(`${type}PostImage`);
    if (input) input.value = '';
    renderMultiImagePreview(type);
}

function removeCommunityImageAt(type, index) {
    if (type === 'normal') {
        selectedNormalFiles.splice(index, 1);
    } else {
        selectedRemedyFiles.splice(index, 1);
    }
    renderMultiImagePreview(type);
}

function renderMultiImagePreview(type) {
    const files = type === 'normal' ? selectedNormalFiles : selectedRemedyFiles;
    const grid = document.getElementById(`${type}PostImagesGrid`);
    const countContainer = document.getElementById(`${type}PostImagesCount`);
    const countNum = document.getElementById(`${type}PostCountNum`);
    if (!grid) return;

    if (files.length === 0) {
        grid.innerHTML = '';
        grid.classList.add('hidden');
        grid.classList.remove('grid');
        if (countContainer) countContainer.classList.add('hidden');
        return;
    }

    grid.classList.remove('hidden');
    grid.classList.add('grid');
    if (countContainer) countContainer.classList.remove('hidden');
    if (countNum) countNum.textContent = files.length;

    grid.innerHTML = files.map((file, idx) => {
        const objectUrl = URL.createObjectURL(file);
        const isCover = idx === 0;
        return `
            <div class="relative group rounded-xl overflow-hidden border ${isCover ? 'border-[#8CC63F] ring-2 ring-[#8CC63F]/30' : 'border-gray-200'} bg-gray-50 h-28 flex items-center justify-center">
                ${isCover ? `
                    <span class="absolute top-1.5 left-1.5 bg-[#8CC63F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1 pointer-events-none">
                        <i data-feather="star" class="w-3 h-3 fill-white"></i> Đại diện
                    </span>
                ` : `
                    <span class="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md z-10 pointer-events-none">
                        #${idx + 1}
                    </span>
                `}
                <button type="button" class="btn-remove-selected-img absolute top-1.5 right-1.5 bg-black/65 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors z-20 shadow-sm" data-type="${type}" data-idx="${idx}" title="Xóa ảnh này">
                    &times;
                </button>
                <img src="${objectUrl}" alt="Ảnh tải lên" class="w-full h-full object-cover">
            </div>
        `;
    }).join('');

    if (window.feather) feather.replace();

    grid.querySelectorAll('.btn-remove-selected-img').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const t = btn.dataset.type;
            const i = parseInt(btn.dataset.idx, 10);
            removeCommunityImageAt(t, i);
        });
    });
}

function openCommunityLightbox(gallery, startIndex = 0) {
    if (!Array.isArray(gallery) || gallery.length === 0) return;
    currentLightboxGallery = gallery;
    currentLightboxIndex = Math.max(0, Math.min(startIndex, gallery.length - 1));
    updateCommunityLightboxUI();

    const modal = document.getElementById('imageLightboxModal');
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
}

function updateCommunityLightboxUI() {
    const img = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');
    const btnPrev = document.getElementById('btnLightboxPrev');
    const btnNext = document.getElementById('btnLightboxNext');

    if (img) img.src = currentLightboxGallery[currentLightboxIndex];
    if (counter) {
        if (currentLightboxGallery.length > 1) {
            counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxGallery.length}`;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
    if (btnPrev && btnNext) {
        if (currentLightboxGallery.length > 1) {
            btnPrev.classList.remove('hidden');
            btnNext.classList.remove('hidden');
        } else {
            btnPrev.classList.add('hidden');
            btnNext.classList.add('hidden');
        }
    }
    if (window.feather) feather.replace();
}

function closeCommunityLightbox() {
    const modal = document.getElementById('imageLightboxModal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
    currentLightboxGallery = [];
    currentLightboxIndex = 0;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCommunityUserProfile();
    loadCommunityPosts().catch((error) => console.error(error));

    // Filter Buttons (Tất cả, Bài thuốc, Chia sẻ)
    const filterBtns = document.querySelectorAll('.community-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.className = 'community-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:text-forest-900 hover:bg-gray-100 transition-all shrink-0';
            });
            btn.className = 'community-filter-btn px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-forest-900 text-white shadow-sm shrink-0';
            currentFilter = btn.dataset.filter || 'all';
            renderFilteredPosts();
        });
    });

    // Search Input
    const searchInput = document.getElementById('communitySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            renderFilteredPosts();
        });
    }

    // Hashtag Topic Buttons in Sidebar
    const topicBtns = document.querySelectorAll('.tag-topic');
    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic || '';
            if (searchInput) {
                searchInput.value = topic;
                currentSearch = topic;
                renderFilteredPosts();
            }
        });
    });

    // Xử lý chọn nhiều ảnh cho Bài viết thường
    const normalInput = document.getElementById('normalPostImage');
    if (normalInput) {
        normalInput.addEventListener('change', () => {
            const files = Array.from(normalInput.files || []);
            for (const f of files) {
                if (selectedNormalFiles.length < 10) {
                    selectedNormalFiles.push(f);
                }
            }
            normalInput.value = '';
            renderMultiImagePreview('normal');
        });
    }
    document.getElementById('btnClearNormalImages')?.addEventListener('click', () => {
        clearCommunityImages('normal');
    });

    // Xử lý chọn nhiều ảnh cho Đóng góp bài thuốc
    const remedyInput = document.getElementById('remedyPostImage');
    if (remedyInput) {
        remedyInput.addEventListener('change', () => {
            const files = Array.from(remedyInput.files || []);
            for (const f of files) {
                if (selectedRemedyFiles.length < 10) {
                    selectedRemedyFiles.push(f);
                }
            }
            remedyInput.value = '';
            renderMultiImagePreview('remedy');
        });
    }
    document.getElementById('btnClearRemedyImages')?.addEventListener('click', () => {
        clearCommunityImages('remedy');
    });

    const resetBothModalImages = () => {
        clearCommunityImages('normal');
        clearCommunityImages('remedy');
    };
    document.getElementById('btnCancelPostModal')?.addEventListener('click', resetBothModalImages);
    document.getElementById('btnClosePostModal')?.addEventListener('click', resetBothModalImages);
    document.getElementById('createPostBackdrop')?.addEventListener('click', resetBothModalImages);

    document.addEventListener('click', async (event) => {
        // Mở lightbox khi nhấp vào bất kỳ ảnh nào trong bộ sưu tập bài viết
        const lightboxTrigger = event.target.closest('.post-lightbox-trigger');
        if (lightboxTrigger) {
            const container = lightboxTrigger.closest('.post-gallery-container');
            const galleryRaw = container?.dataset.gallery;
            let gallery = [];
            if (galleryRaw) {
                try {
                    gallery = JSON.parse(decodeURIComponent(galleryRaw));
                } catch {
                    gallery = [];
                }
            }
            if (!gallery.length && lightboxTrigger.src) {
                gallery = [lightboxTrigger.src];
            }
            const idx = parseInt(lightboxTrigger.dataset.galleryIndex || '0', 10);
            openCommunityLightbox(gallery, idx);
            return;
        }

        // Đóng lightbox khi nhấp nút X hoặc nền đen
        if (event.target.closest('#btnCloseLightbox') || event.target.id === 'lightboxBackdrop') {
            closeCommunityLightbox();
            return;
        }

        // Điều hướng ảnh trước / sau trong lightbox
        if (event.target.closest('#btnLightboxPrev')) {
            if (currentLightboxGallery.length > 1) {
                currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxGallery.length) % currentLightboxGallery.length;
                updateCommunityLightboxUI();
            }
            return;
        }
        if (event.target.closest('#btnLightboxNext')) {
            if (currentLightboxGallery.length > 1) {
                currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxGallery.length;
                updateCommunityLightboxUI();
            }
            return;
        }

        const post = event.target.closest('.community-post');
        if (!post) return;
        try {
            // Xóa bài viết
            if (event.target.closest('[data-delete-post]')) {
                if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
                const postId = post.dataset.postId;
                const response = await fetch(`${COMMUNITY_API}/community/posts/${postId}`, {
                    method: 'DELETE',
                    headers: communityHeaders()
                });
                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.detail || 'Không thể xóa bài viết.');
                }
                post.remove();
                allCommunityPosts = allCommunityPosts.filter(p => String(p.id) !== String(postId));
                alert('Đã xóa bài viết thành công.');
                return;
            }

            // Chia sẻ liên kết bài viết
            if (event.target.closest('[data-share-post]')) {
                const postId = post.dataset.postId;
                const shareUrl = `${window.location.origin}${window.location.pathname}?post=${encodeURIComponent(postId)}`;
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
                } else {
                    prompt('Sao chép liên kết:', shareUrl);
                }
                return;
            }

            // Thích bài viết
            if (event.target.closest('[data-like-post]')) {
                if (!communityToken()) {
                    window.location.assign('auth.html');
                    return;
                }
                await toggleCommunityLike(post);
            }

            // Ẩn/Hiện bình luận
            if (event.target.closest('[data-toggle-comments]')) {
                const comments = post.querySelector('[data-comments]');
                comments.classList.toggle('hidden');
                if (!comments.classList.contains('hidden')) await loadComments(post);
            }

            // Gửi bình luận
            if (event.target.closest('[data-submit-comment]')) {
                if (!communityToken()) {
                    window.location.assign('auth.html');
                    return;
                }
                await submitCommunityComment(post);
            }

            // Trả lời bình luận
            const replyButton = event.target.closest('[data-reply-comment]');
            if (replyButton) {
                if (!communityToken()) {
                    window.location.assign('auth.html');
                    return;
                }
                post.querySelector('[data-reply-composer]')?.remove();
                const composer = document.createElement('div');
                composer.dataset.replyComposer = 'true';
                composer.dataset.parentCommentId = replyButton.dataset.replyComment;
                composer.className = 'ml-10 mt-2 flex items-center gap-2';
                composer.innerHTML = `
                    <img src="${communityEscape(communityCurrentUserAvatar)}" alt="" class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 shadow-sm">
                    <div class="flex-1 flex items-center gap-2 bg-[#F0F2F5] hover:bg-[#E4E6EB]/60 focus-within:bg-[#F0F2F5] focus-within:ring-2 focus-within:ring-[#8CC63F]/30 rounded-[20px] px-3.5 py-1.5 transition-all">
                        <input data-reply-input class="w-full bg-transparent border-0 outline-none text-xs md:text-sm text-gray-900 placeholder-gray-500 py-0.5" maxlength="2000" placeholder="Trả lời bình luận...">
                        <button data-submit-reply type="button" class="text-[#0A2F1D] hover:text-[#8CC63F] p-1 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0" disabled title="Gửi (Enter)">
                            <i data-feather="send" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <button data-cancel-reply type="button" class="text-xs text-gray-400 hover:text-gray-600 font-semibold px-1 transition-colors">Hủy</button>`;
                replyButton.closest('[data-comment-id]').after(composer);
                if (window.feather) feather.replace();
                composer.querySelector('[data-reply-input]').focus();
            }

            if (event.target.closest('[data-submit-reply]')) {
                const composer = event.target.closest('[data-reply-composer]');
                await submitCommunityComment(
                    post,
                    Number(composer.dataset.parentCommentId),
                    composer.querySelector('[data-reply-input]'),
                    event.target.closest('[data-submit-reply]')
                );
                composer.remove();
            }

            if (event.target.closest('[data-cancel-reply]')) {
                event.target.closest('[data-reply-composer]').remove();
            }

            // Xóa bình luận
            const deleteCommentBtn = event.target.closest('[data-delete-community-comment]');
            if (deleteCommentBtn) {
                if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;
                const commentId = deleteCommentBtn.dataset.deleteCommunityComment;
                const response = await fetch(`${COMMUNITY_API}/community/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: communityHeaders()
                });
                if (!response.ok) throw new Error('Không thể xóa bình luận.');
                await loadComments(post);
            }

            const toggleRepliesBtn = event.target.closest('[data-toggle-replies]');
            if (toggleRepliesBtn) {
                const commentId = toggleRepliesBtn.dataset.toggleReplies;
                const repliesContainer = post.querySelector(`[data-replies-container="${commentId}"]`);
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
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    document.addEventListener('input', (event) => {
        const commentInput = event.target.closest('[data-comment-input]');
        if (commentInput) {
            const post = commentInput.closest('.community-post');
            const submitButton = post?.querySelector('[data-submit-comment]');
            if (submitButton) submitButton.disabled = !commentInput.value.trim();
        }

        const replyInput = event.target.closest('[data-reply-input]');
        if (replyInput) {
            const replyButton = replyInput.closest('[data-reply-composer]').querySelector('[data-submit-reply]');
            if (replyButton) replyButton.disabled = !replyInput.value.trim();
        }
    });

    document.addEventListener('keydown', async (event) => {
        const commentTrigger = event.target.closest('[data-toggle-comments]');
        if (commentTrigger && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            const post = commentTrigger.closest('.community-post');
            const comments = post?.querySelector('[data-comments]');
            if (!comments) return;
            comments.classList.toggle('hidden');
            if (!comments.classList.contains('hidden')) {
                try {
                    await loadComments(post);
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            }
            return;
        }

        const replyInput = event.target.closest('[data-reply-input]');
        if (replyInput && event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const post = replyInput.closest('.community-post');
            const composer = replyInput.closest('[data-reply-composer]');
            const submitButton = composer?.querySelector('[data-submit-reply]');
            if (!post || !composer || !replyInput.value.trim() || submitButton?.disabled) return;
            try {
                await submitCommunityComment(
                    post,
                    Number(composer.dataset.parentCommentId),
                    replyInput,
                    submitButton
                );
                composer.remove();
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
            return;
        }

        const commentInput = event.target.closest('[data-comment-input]');
        if (!commentInput || event.key !== 'Enter' || event.shiftKey) return;
        event.preventDefault();
        if (!commentInput.value.trim()) return;
        const post = commentInput.closest('.community-post');
        try {
            await submitCommunityComment(post);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Xử lý nộp bài viết mới
    document.getElementById('btnSubmitPost')?.addEventListener('click', async () => {
        if (!communityToken()) {
            window.location.assign('auth.html');
            return;
        }
        const normalFormVisible = document.getElementById('formNormalPost').style.display !== 'none';
        const title = document.getElementById(normalFormVisible ? 'normalPostTitle' : 'remedyPostTitle').value.trim();
        let content = document.getElementById(normalFormVisible ? 'normalPostContent' : 'remedyPostContent').value.trim();
        
        if (!title || !content) return alert('Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết.');

        // Gom vị thuốc nếu là tab bài thuốc
        if (!normalFormVisible) {
            const rows = document.querySelectorAll('#ingredientsContainer .ingredient-row');
            const ings = [];
            rows.forEach(r => {
                const name = r.querySelector('[data-ing-name]')?.value.trim();
                const amount = r.querySelector('[data-ing-amount]')?.value.trim();
                const note = r.querySelector('[data-ing-note]')?.value.trim();
                if (name) {
                    ings.push(`• ${name}${amount ? ' (' + amount + ')' : ''}${note ? ' - ' + note : ''}`);
                }
            });
            if (ings.length > 0) {
                content = `🌿 VỊ THUỐC:\n${ings.join('\n')}\n\n📝 CÁCH DÙNG & BÀO CHẾ:\n${content}`;
            }
        }

        const selectedFiles = normalFormVisible ? selectedNormalFiles : selectedRemedyFiles;
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('post_type', normalFormVisible ? 'general' : 'remedy');
        for (const file of selectedFiles) {
            formData.append('files', file);
        }
        if (selectedFiles.length > 0) {
            formData.append('file', selectedFiles[0]);
        }

        const submitButton = document.getElementById('btnSubmitPost');
        submitButton.disabled = true;
        submitButton.textContent = 'Đang đăng bài...';

        try {
            const response = await fetch(`${COMMUNITY_API}/community/posts`, {
                method: 'POST',
                headers: communityHeaders(),
                body: formData
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Không thể đăng bài viết.');
            }
            document.getElementById('normalPostTitle').value = '';
            document.getElementById('normalPostContent').value = '';
            document.getElementById('remedyPostTitle').value = '';
            document.getElementById('remedyPostContent').value = '';
            clearCommunityImages('normal');
            clearCommunityImages('remedy');
            document.getElementById('btnCancelPostModal')?.click();
            await loadCommunityPosts();
        } catch (err) {
            alert(err.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Đăng bài viết';
        }
    });

    // Phím tắt điều hướng lightbox
    document.addEventListener('keydown', (event) => {
        const lightboxModal = document.getElementById('imageLightboxModal');
        const isLightboxOpen = lightboxModal && !lightboxModal.classList.contains('opacity-0');
        if (isLightboxOpen) {
            if (event.key === 'Escape') {
                closeCommunityLightbox();
            } else if (event.key === 'ArrowLeft' && currentLightboxGallery.length > 1) {
                currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxGallery.length) % currentLightboxGallery.length;
                updateCommunityLightboxUI();
            } else if (event.key === 'ArrowRight' && currentLightboxGallery.length > 1) {
                currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxGallery.length;
                updateCommunityLightboxUI();
            }
        }
    });
});

