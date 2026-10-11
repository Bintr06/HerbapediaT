const HISTORY_API_URL = 'http://127.0.0.1:8000';

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function openHistoryDetail(item) {
    sessionStorage.setItem('selectedHistoryItem', JSON.stringify(item));
    const herbQuery = item.herb_slug
        ? `&id=${encodeURIComponent(item.herb_slug)}`
        : '';
    window.location.href = `detail.html?historyId=${encodeURIComponent(item.id)}${herbQuery}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    const grid = document.getElementById('historyGrid');
    if (!token) {
        window.location.replace('auth.html');
        return;
    }

    try {
        const response = await fetch(`${HISTORY_API_URL}/auth/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const items = await response.json();
        if (response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('isLoggedIn');
            window.location.replace('auth.html');
            return;
        }
        if (!response.ok) throw new Error(items.detail || 'Không thể tải lịch sử.');
        grid.innerHTML = '';
        if (!items.length) {
            grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Chưa có lịch sử nhận diện.</p>';
            return;
        }
        items.forEach((item) => {
            const card = document.createElement('article');
            card.className = 'history-card bg-white/80 backdrop-blur-md border border-white shadow-sm rounded-3xl p-4 flex flex-col gap-4 relative overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl';
            card.dataset.historyId = item.id;
            card.innerHTML = `
                <button type="button" class="delete-history absolute top-3 right-3 text-white bg-black/20 hover:text-red-500 hover:bg-white rounded-full p-2 z-10" data-id="${item.id}">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
                <div class="overflow-hidden rounded-2xl w-full h-40 bg-gray-100">
                    <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.predicted_class)}" class="w-full h-full object-cover">
                </div>
                <h4 class="font-bold text-forest-900 text-lg">${escapeHtml(item.predicted_class)}</h4>
                <span class="bg-gradient-to-r from-forest-900 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full self-start">AI: ${item.confidence}%</span>
                <div class="text-xs text-gray-500">${new Date(item.created_at).toLocaleString('vi-VN')}</div>
            `;
            grid.appendChild(card);
            card.addEventListener('click', () => openHistoryDetail(item));
        });
        feather.replace();
        grid.querySelectorAll('.delete-history').forEach((button) => {
            button.addEventListener('click', async (event) => {
                event.stopPropagation();
                const response = await fetch(`${HISTORY_API_URL}/auth/history/${button.dataset.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    button.closest('article').remove();
                    if (!grid.querySelector('article')) {
                        grid.innerHTML = '<p id="historyState" class="col-span-full text-center text-gray-500">Chưa có lịch sử nhận diện.</p>';
                    }
                }
            });
        });
    } catch (error) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500">${error.message}</p>`;
    }
});
