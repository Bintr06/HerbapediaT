const COMMUNITY_API = 'http://127.0.0.1:8000';
let communityCurrentUserAvatar = 'assets/images/logo.png';

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

function communityTime(value) {
    const date = new Date(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
}

function communityAvatar(post) {
    return post.author.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.display_name)}&background=0A2F1D&color=fff`;
}

function communityAuthorAvatar(author) {
    return author.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(author.display_name)}&background=0A2F1D&color=fff`;
}

function renderCommunityPost(post) {
    const commentComposer = communityToken()
        ? `<div class="flex items-start gap-2.5 mt-3 pt-2 border-t border-gray-100">
                <img src="${communityEscape(communityCurrentUserAvatar)}" alt="Ảnh đại diện của bạn" class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-sm">
                <div class="flex-1 flex items-center gap-2 bg-[#F0F2F5] hover:bg-[#E4E6EB]/60 focus-within:bg-[#F0F2F5] focus-within:ring-2 focus-within:ring-[#8CC63F]/30 rounded-[20px] px-3.5 py-1.5 transition-all">
                    <input data-comment-input class="w-full bg-transparent border-0 outline-none text-[14px] text-gray-900 placeholder-gray-500 py-1" maxlength="2000" placeholder="Viết bình luận công khai...">
                    <button data-submit-comment type="button" class="text-[#0A2F1D] hover:text-[#8CC63F] p-1 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0" disabled title="Gửi (Enter)">
                        <i data-feather="send" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>`
        : '<div class="mt-3 text-center py-2 text-xs text-gray-500 bg-gray-50 rounded-xl"><a href="auth.html" class="text-[#0A2F1D] font-bold hover:underline">Đăng nhập</a> để tham gia bình luận.</div>';
    return `
        <article class="community-post bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5" data-post-id="${post.id}">
            <div class="flex items-center gap-3 mb-3">
                <a href="user-profile.html?userId=${post.author.id}" class="shrink-0 hover:opacity-80 transition-opacity" title="Xem blog của ${communityEscape(post.author.display_name)}">
                    <img src="${communityEscape(communityAvatar(post))}" alt="" class="w-10 h-10 rounded-full object-cover">
                </a>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <a href="user-profile.html?userId=${post.author.id}" class="hover:underline" title="Xem blog của ${communityEscape(post.author.display_name)}">
                            <h4 class="font-bold text-[#0A2F1D] text-sm truncate">${communityEscape(post.author.display_name)}</h4>
                        </a>
                        <a href="user-profile.html?userId=${post.author.id}" class="text-[11px] font-semibold text-gray-400 hover:text-[#0A2F1D] shrink-0 transition-colors" title="Xem blog cá nhân">
                            • Xem blog
                        </a>
                    </div>
                    <span class="text-xs text-gray-400">${communityTime(post.created_at)}</span>
                </div>
            </div>
            <h3 class="font-bold text-lg mb-2 text-gray-900">${communityEscape(post.title)}</h3>
            <p class="text-gray-700 text-sm whitespace-pre-line mb-4">${communityEscape(post.content)}</p>
            ${post.image_url ? `<img src="${communityEscape(post.image_url)}" alt="${communityEscape(post.title)}" class="w-full max-h-96 object-cover rounded-xl mb-4">` : ''}
            <div class="flex items-center gap-4 text-gray-500 text-sm mb-2 px-1">
                <span data-like-count class="flex items-center gap-1 font-medium"><i data-feather="heart" class="w-3.5 h-3.5 text-red-400"></i> ${post.like_count} lượt thích</span>
                <span data-toggle-comments data-comment-count role="button" tabindex="0" class="flex items-center gap-1 font-medium cursor-pointer hover:underline"><i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-400"></i> ${post.comment_count} bình luận</span>
            </div>
            <div class="flex gap-2 pt-2 border-t border-gray-100">
                <button data-like-post class="flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${post.liked ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-500 hover:bg-gray-50'}">
                    <i data-feather="heart" class="w-4 h-4 ${post.liked ? 'fill-red-600' : ''}"></i> <span>${post.liked ? 'Đã thích' : 'Thích'}</span>
                </button>
                <button data-toggle-comments class="flex-1 py-2 rounded-lg text-gray-500 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2">
                    <i data-feather="message-square" class="w-4 h-4"></i> <span>Bình luận</span>
                </button>
            </div>
            <div data-comments class="hidden mt-3 border-t border-gray-100 pt-3">
                <div data-comment-list class="space-y-3 mb-3"></div>
                ${commentComposer}
            </div>
        </article>`;
}

async function loadCommunityPosts() {
    const main = document.querySelector('main');
    if (!main) return;
    const creator = document.getElementById('postCreator');
    if (!creator) return;
    while (creator.nextElementSibling) creator.nextElementSibling.remove();
    if (!communityToken()) {
        creator.classList.add('hidden');
    } else {
        creator.classList.remove('hidden');
    }
    const response = await fetch(`${COMMUNITY_API}/community/posts`, { headers: communityHeaders() });
    if (!response.ok) throw new Error('Không thể tải bài viết cộng đồng.');
    const posts = await response.json();
    while (main.firstElementChild) {
        if (main.firstElementChild !== creator) {
            main.firstElementChild.remove();
        } else {
            break;
        }
    }
    const feed = document.createElement('div');
    feed.id = 'communityFeed';
    feed.innerHTML = posts.length
        ? posts.map(renderCommunityPost).join('')
        : '<p class="text-center text-gray-500 bg-white rounded-2xl p-6">Chưa có bài viết nào.</p>';
    main.appendChild(feed);
    if (window.feather) feather.replace();

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
                await loadComments(targetPost);
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
        countEl.innerHTML = `<i data-feather="heart" class="w-3.5 h-3.5 text-red-400"></i> ${result.like_count} lượt thích`;
    }
    const button = postElement.querySelector('[data-like-post]');
    if (button) {
        button.className = `flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            result.liked ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-500 hover:bg-gray-50'
        }`;
        button.innerHTML = `<i data-feather="heart" class="w-4 h-4 ${result.liked ? 'fill-red-600' : ''}"></i> <span>${result.liked ? 'Đã thích' : 'Thích'}</span>`;
    }
    if (window.feather) feather.replace();
}

async function loadComments(postElement, autoExpandParentId = null) {
    const list = postElement.querySelector('[data-comment-list]');

    // Ghi nhớ các câu trả lời đang mở trước đó
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
                            <a href="user-profile.html?userId=${comment.author.id}" class="block text-[13px] font-bold text-gray-900 hover:underline leading-tight" title="Xem blog của ${communityEscape(comment.author.display_name)}">
                                ${communityEscape(comment.author.display_name)}
                            </a>
                        ` : `
                            <strong class="block text-[13px] font-bold text-gray-900 leading-tight">${communityEscape(comment.author.display_name)}</strong>
                        `}
                        <p class="text-[14px] text-gray-800 leading-relaxed whitespace-pre-line break-words mt-0.5">${communityEscape(comment.content)}</p>
                    </div>
                    <div class="flex items-center gap-3 ml-3 mt-0.5 text-[12px] font-semibold text-gray-500">
                        <span class="text-gray-400 font-normal">${communityTime(comment.created_at)}</span>
                        <button type="button" data-reply-comment="${comment.id}" class="hover:underline text-gray-600 hover:text-[#0A2F1D]">Trả lời</button>
                        ${comment.can_delete ? `
                            <button type="button" data-delete-community-comment="${comment.id}" class="hover:underline text-gray-400 hover:text-red-500 transition-colors">Xóa</button>
                        ` : ''}
                    </div>

                    ${hasChildren ? `
                        <button type="button" data-toggle-replies="${comment.id}" data-replies-count="${children.length}" class="flex items-center gap-1.5 ml-3 mt-1.5 text-[12px] font-bold text-gray-600 hover:text-[#0A2F1D] hover:underline transition-colors">
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
    const commentCountEl = postElement.querySelector('[data-comment-count]');
    if (commentCountEl) {
        commentCountEl.innerHTML = `<i data-feather="message-circle" class="w-3.5 h-3.5 text-blue-400"></i> ${comments.length} bình luận`;
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

function resetCommunityImagePreview(inputId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(`${inputId}Preview`);
    const container = input?.closest('label');
    if (!input || !preview || !container) return;

    if (preview.dataset.objectUrl) {
        URL.revokeObjectURL(preview.dataset.objectUrl);
        delete preview.dataset.objectUrl;
    }
    input.value = '';
    preview.src = '';
    preview.classList.add('hidden');
    container.querySelector('[data-upload-placeholder]')?.classList.remove('hidden');
    container.querySelector('[data-upload-label]')?.classList.remove('hidden');
    const name = document.getElementById(`${inputId}Name`);
    if (name) name.textContent = '';
    container.querySelector(`[data-remove-image="${inputId}"]`)?.classList.add('hidden');
}

function updateCommunityImagePreview(inputId) {
    const input = document.getElementById(inputId);
    const file = input?.files?.[0];
    const preview = document.getElementById(`${inputId}Preview`);
    const container = input?.closest('label');
    if (!input || !file || !preview || !container) return;

    if (preview.dataset.objectUrl) URL.revokeObjectURL(preview.dataset.objectUrl);
    const objectUrl = URL.createObjectURL(file);
    preview.dataset.objectUrl = objectUrl;
    preview.src = objectUrl;
    preview.classList.remove('hidden');
    container.querySelector('[data-upload-placeholder]')?.classList.add('hidden');
    container.querySelector('[data-upload-label]')?.classList.add('hidden');
    const name = document.getElementById(`${inputId}Name`);
    if (name) name.textContent = file.name;
    container.querySelector(`[data-remove-image="${inputId}"]`)?.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCommunityUserProfile();
    loadCommunityPosts().catch((error) => console.error(error));

    for (const inputId of ['normalPostImage', 'remedyPostImage']) {
        document.getElementById(inputId)?.addEventListener('change', (event) => {
            updateCommunityImagePreview(inputId);
        });
    }
    document.querySelectorAll('[data-remove-image]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            resetCommunityImagePreview(button.dataset.removeImage);
        });
    });
    document.getElementById('btnCancelPostModal')?.addEventListener('click', () => {
        resetCommunityImagePreview('normalPostImage');
        resetCommunityImagePreview('remedyPostImage');
    });

    document.addEventListener('click', async (event) => {
        const post = event.target.closest('.community-post');
        if (!post) return;
        try {
            if (event.target.closest('[data-like-post]')) {
                if (!communityToken()) {
                    window.location.assign('auth.html');
                    return;
                }
                await toggleCommunityLike(post);
            }
            if (event.target.closest('[data-toggle-comments]')) {
                const comments = post.querySelector('[data-comments]');
                comments.classList.toggle('hidden');
                if (!comments.classList.contains('hidden')) await loadComments(post);
            }
            if (event.target.closest('[data-submit-comment]')) {
                if (!communityToken()) {
                    window.location.assign('auth.html');
                    return;
                }
                await submitCommunityComment(post);
            }
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
            replyButton.disabled = !replyInput.value.trim();
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

    document.getElementById('btnSubmitPost')?.addEventListener('click', async () => {
        if (!communityToken()) {
            window.location.assign('auth.html');
            return;
        }
        const normalFormVisible = document.getElementById('formNormalPost').style.display !== 'none';
        const title = document.getElementById(normalFormVisible ? 'normalPostTitle' : 'remedyPostTitle').value.trim();
        const content = document.getElementById(normalFormVisible ? 'normalPostContent' : 'remedyPostContent').value.trim();
        if (!title || !content) return alert('Vui lòng nhập tiêu đề và nội dung bài viết.');
        const imageInput = document.getElementById(normalFormVisible ? 'normalPostImage' : 'remedyPostImage');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('post_type', normalFormVisible ? 'general' : 'remedy');
        if (imageInput.files[0]) formData.append('file', imageInput.files[0]);
        const submitButton = document.getElementById('btnSubmitPost');
        submitButton.disabled = true;
        const response = await fetch(`${COMMUNITY_API}/community/posts`, {
            method: 'POST',
            headers: communityHeaders(),
            body: formData
        });
        submitButton.disabled = false;
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return alert(error.detail || 'Không thể đăng bài viết.');
        }
        document.getElementById('normalPostTitle').value = '';
        document.getElementById('normalPostContent').value = '';
        document.getElementById('remedyPostTitle').value = '';
        document.getElementById('remedyPostContent').value = '';
        resetCommunityImagePreview('normalPostImage');
        resetCommunityImagePreview('remedyPostImage');
        document.getElementById('btnCancelPostModal')?.click();
        await loadCommunityPosts();
    });
});
