const HISTORY_API_URL = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'http://127.0.0.1:8000';

let allHistoryItems = [];
let pendingDeleteId = null;

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function timeAgo(dateString) {
    if (!dateString) return '';
    let s = String(dateString).trim();
    if (!s.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(s)) {
        s = s.replace(' ', 'T') + 'Z';
    }
    const date = new Date(s);
    const validDate = isNaN(date.getTime()) ? new Date(dateString) : date;
    const seconds = Math.floor((Date.now() - validDate.getTime()) / 1000);
    if (seconds < 60) return 'Vừa quét';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return validDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showHistoryToast(message, isError = false) {
    const toast = document.getElementById('historyToast');
    if (!toast) return;
    toast.innerHTML = isError
        ? `<i data-feather="alert-circle" class="w-4 h-4 text-white"></i> <span>${escapeHtml(message)}</span>`
        : `<i data-feather="check-circle" class="w-4 h-4 text-yellow-300"></i> <span>${escapeHtml(message)}</span>`;
    toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2 ${
        isError ? 'bg-red-600 text-white' : 'bg-forest-900 text-white'
    }`;
    if (window.feather) window.feather.replace();

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-8 opacity-0 flex items-center gap-2 pointer-events-none';
    }, 3500);
}

function openHistoryDetail(item) {
    sessionStorage.setItem('selectedHistoryItem', JSON.stringify(item));
    const herbQuery = item.herb_slug
        ? `&id=${encodeURIComponent(item.herb_slug)}`
        : '';
    window.location.href = `detail.html?historyId=${encodeURIComponent(item.id)}${herbQuery}`;
}

function updateMetrics(items) {
    const totalScans = items.length;
    const statTotalScans = document.getElementById('statTotalScans');
    const statTotalSpecies = document.getElementById('statTotalSpecies');
    const statAvgConfidence = document.getElementById('statAvgConfidence');

    if (statTotalScans) statTotalScans.textContent = totalScans;

    if (totalScans > 0) {
        const uniqueSpecies = new Set(items.map(item => String(item.predicted_class || '').trim().toLowerCase()));
        if (statTotalSpecies) statTotalSpecies.textContent = uniqueSpecies.size;

        const sumConf = items.reduce((acc, curr) => acc + (parseFloat(curr.confidence) || 0), 0);
        const avg = (sumConf / totalScans).toFixed(1);
        if (statAvgConfidence) statAvgConfidence.textContent = `${avg}%`;
    } else {
        if (statTotalSpecies) statTotalSpecies.textContent = '0';
        if (statAvgConfidence) statAvgConfidence.textContent = '--%';
    }
}

function renderHistoryGrid() {
    const grid = document.getElementById('historyGrid');
    if (!grid) return;

    const searchInput = document.getElementById('historySearchInput');
    const sortSelect = document.getElementById('historySort');
    const confSelect = document.getElementById('historyFilterConf');

    const query = (searchInput?.value || '').trim().toLowerCase();
    const sortMode = sortSelect?.value || 'newest';
    const confFilter = confSelect?.value || 'all';

    let filtered = allHistoryItems.filter(item => {
        const title = String(item.predicted_class || '').toLowerCase();
        const matchesQuery = !query || title.includes(query);

        const conf = parseFloat(item.confidence) || 0;
        let matchesConf = true;
        if (confFilter === 'high') matchesConf = conf >= 80;
        else if (confFilter === 'medium') matchesConf = conf >= 50;

        return matchesQuery && matchesConf;
    });

    if (sortMode === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortMode === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    } else if (sortMode === 'highest_conf') {
        filtered.sort((a, b) => (parseFloat(b.confidence) || 0) - (parseFloat(a.confidence) || 0));
    }

    if (!filtered.length) {
        grid.innerHTML = `
            <div class="col-span-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white/90 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm">
                <div class="w-16 h-16 rounded-full bg-green-50 text-[#8CC63F] flex items-center justify-center mb-3">
                    <i data-feather="inbox" class="w-8 h-8"></i>
                </div>
                <h3 class="font-bold text-forest-900 text-lg mb-1">Chưa có lịch sử phù hợp</h3>
                <p class="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed font-light">
                    ${query || confFilter !== 'all' ? 'Không tìm thấy kết quả theo bộ lọc hiện tại. Hãy thử tìm từ khóa khác.' : 'Bạn chưa quét lá cây nào. Hãy bật camera hoặc tải ảnh lên để AI phân tích ngay!'}
                </p>
                <a href="index.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-900 hover:bg-[#132a18] text-white text-xs font-bold shadow-sm transition-all">
                    <i data-feather="maximize" class="w-3.5 h-3.5 text-[#8CC63F]"></i>
                    <span>Bắt đầu quét lá ngay</span>
                </a>
            </div>
        `;
        if (window.feather) window.feather.replace();
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const conf = parseFloat(item.confidence) || 0;
        let badgeColor = 'bg-emerald-600 text-white';
        let badgeIcon = 'check-circle';
        if (conf < 50) {
            badgeColor = 'bg-amber-600 text-white';
            badgeIcon = 'alert-triangle';
        } else if (conf < 80) {
            badgeColor = 'bg-lime-600 text-white';
            badgeIcon = 'info';
        }

        const fallbackImg = 'assets/images/logo.png';
        const imgUrl = item.image_url || fallbackImg;
        const formattedDate = timeAgo(item.created_at);

        return `
            <article class="history-card bg-white/90 backdrop-blur-md border border-white/80 shadow-sm rounded-3xl p-4 flex flex-col gap-3 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" data-id="${item.id}">
                <!-- Delete Button -->
                <button type="button" class="btn-delete-card absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-red-600 text-white flex items-center justify-center z-20 backdrop-blur-sm transition-all" title="Xóa bản ghi này" data-id="${item.id}">
                    <i data-feather="trash-2" class="w-3.5 h-3.5"></i>
                </button>

                <!-- Image thumbnail -->
                <div class="relative w-full h-44 rounded-2xl overflow-hidden bg-gray-100">
                    <span class="absolute top-2.5 left-2.5 ${badgeColor} text-[11px] font-bold px-2.5 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1 backdrop-blur-sm">
                        <i data-feather="${badgeIcon}" class="w-3 h-3"></i> AI: ${conf}%
                    </span>
                    <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(item.predicted_class)}" 
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         onerror="this.onerror=null;this.src='${fallbackImg}'">
                </div>

                <!-- Info -->
                <div class="flex-1 flex flex-col pt-1">
                    <h4 class="font-bold text-forest-900 text-base leading-snug group-hover:text-[#8CC63F] transition-colors mb-1">
                        ${escapeHtml(item.predicted_class)}
                    </h4>
                    <div class="text-[11px] text-gray-400 font-light flex items-center gap-1 mb-3">
                        <i data-feather="clock" class="w-3 h-3"></i>
                        <span>${escapeHtml(formattedDate)}</span>
                    </div>

                    <div class="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span class="text-gray-400 font-light">Xem vị thuốc</span>
                        <span class="text-[#8CC63F] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Chi tiết &rarr;
                        </span>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    if (window.feather) window.feather.replace();

    // Attach card click handlers
    grid.querySelectorAll('.history-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-card')) return;
            const itemId = card.dataset.id;
            const item = allHistoryItems.find(it => String(it.id) === String(itemId));
            if (item) openHistoryDetail(item);
        });
    });

    // Attach delete button handlers
    grid.querySelectorAll('.btn-delete-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            pendingDeleteId = btn.dataset.id;
            openDeleteModal();
        });
    });
}

function openDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.querySelector('.transform')?.classList.remove('scale-95');
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.querySelector('.transform')?.classList.add('scale-95');
        pendingDeleteId = null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.replace('auth.html');
        return;
    }

    // Modal listeners
    document.getElementById('btnCancelDelete')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteModalBackdrop')?.addEventListener('click', closeDeleteModal);

    document.getElementById('btnConfirmDelete')?.addEventListener('click', async () => {
        if (!pendingDeleteId) return;
        const deleteBtn = document.getElementById('btnConfirmDelete');
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Đang xóa...';
        try {
            const response = await fetch(`${HISTORY_API_URL}/auth/history/${pendingDeleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                allHistoryItems = allHistoryItems.filter(item => String(item.id) !== String(pendingDeleteId));
                updateMetrics(allHistoryItems);
                renderHistoryGrid();
                showHistoryToast('Đã xóa bản ghi nhận diện thành công.');
            } else {
                const resData = await response.json().catch(() => ({}));
                showHistoryToast(resData.detail || 'Không thể xóa bản ghi.', true);
            }
        } catch (error) {
            showHistoryToast('Lỗi mạng khi xóa: ' + error.message, true);
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Xác nhận xóa';
            closeDeleteModal();
        }
    });

    // Search and filter listeners
    document.getElementById('historySearchInput')?.addEventListener('input', () => renderHistoryGrid());
    document.getElementById('historySort')?.addEventListener('change', () => renderHistoryGrid());
    document.getElementById('historyFilterConf')?.addEventListener('change', () => renderHistoryGrid());

    // Fetch user details for navbar
    fetch(`${HISTORY_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.ok ? r.json() : null)
    .then(user => {
        if (user) {
            const navbarAvatar = document.getElementById('navbarAvatar');
            const navGreeting = document.getElementById('navGreeting');
            if (navbarAvatar && user.avatar_url) navbarAvatar.src = user.avatar_url;
            if (navGreeting && (user.display_name || user.username)) {
                navGreeting.textContent = (user.display_name || user.username).split(' ').slice(-1)[0];
            }
        }
    })
    .catch(() => {});

    // Fetch history
    try {
        const response = await fetch(`${HISTORY_API_URL}/auth/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('isLoggedIn');
            window.location.replace('auth.html');
            return;
        }
        if (!response.ok) throw new Error('Không thể tải dữ liệu lịch sử.');
        const items = await response.json();
        allHistoryItems = Array.isArray(items) ? items : [];
        updateMetrics(allHistoryItems);
        renderHistoryGrid();
    } catch (error) {
        const grid = document.getElementById('historyGrid');
        if (grid) {
            grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-10 font-medium">${escapeHtml(error.message)}</p>`;
        }
    }
});
