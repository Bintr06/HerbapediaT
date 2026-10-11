/**
 * HerbaPedia - Module Tra cứu Dược liệu
 * Hỗ trợ tìm kiếm theo tên, tên khoa học, công dụng, nhóm tác dụng;
 * Đồng bộ với API backend (fallback sang dữ liệu offline từ herbs.js).
 */

document.addEventListener('DOMContentLoaded', () => {
    const resultsGrid = document.getElementById('resultsGrid');
    const searchInput = document.getElementById('searchInput');
    const tags = Array.from(document.querySelectorAll('.tag-pill'));
    const resultSummary = document.getElementById('resultsSummary');
    const clearSearch = document.getElementById('clearSearch');

    if (!resultsGrid) return;

    const params = new URLSearchParams(window.location.search);
    let activeFilter = params.get('filter') || 'all';
    let herbRecords = Array.isArray(window.HerbaPediaHerbs) ? [...window.HerbaPediaHerbs] : [];

    function normalize(value) {
        return String(value || '')
            .toLocaleLowerCase('vi')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .trim();
    }

    function escapeHtml(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderHerbs(herbs) {
        if (!herbs.length) {
            resultsGrid.innerHTML = `
                <div id="searchEmptyState" class="col-span-full text-center text-gray-500 bg-white/80 rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <p class="text-base font-semibold text-gray-700 mb-1">Không tìm thấy dược liệu phù hợp</p>
                    <p class="text-sm font-light text-gray-500">Hãy thử đổi từ khóa tìm kiếm hoặc bấm "Xóa bộ lọc".</p>
                </div>
            `;
        } else {
            resultsGrid.innerHTML = herbs.map((herb) => {
                const herbSlug = herb.slug || herb.id;
                const datasetName = herb.datasetName || herb.dataset_name || '';
                const herbName = herb.name || herb.name_vi || '';
                const scientificName = herb.scientific || herb.scientific_name || '';
                const usage = herb.usage || '';
                const imageUrl = herb.image || herb.image_url || 'assets/images/logo.png';
                const tagList = Array.isArray(herb.tags) ? herb.tags : [];

                return `
                    <a href="detail.html?id=${encodeURIComponent(herbSlug)}" 
                       data-tags="${escapeHtml(tagList.join(', '))}" 
                       class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div class="h-48 w-full overflow-hidden bg-gray-50">
                            <img src="${escapeHtml(imageUrl)}" 
                                 alt="${escapeHtml(herbName)}" 
                                 loading="lazy" 
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                 onerror="this.onerror=null;this.src='assets/images/logo.png'">
                        </div>
                        <div class="p-5 flex-1 flex flex-col">
                            ${datasetName ? `<p class="text-xs font-bold uppercase tracking-wide text-[#8CC63F] mb-1">${escapeHtml(datasetName)}</p>` : ''}
                            <h3 class="text-lg font-bold text-[#0A2F1D] leading-tight mb-1">${escapeHtml(herbName)}</h3>
                            <p class="text-sm italic text-gray-500 mb-3">${escapeHtml(scientificName)}</p>
                            <p class="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-4">${escapeHtml(usage)}</p>
                            <div class="mt-auto flex justify-end">
                                <span class="text-[#8CC63F] font-medium text-sm flex items-center gap-1 group-hover:underline">
                                    Xem chi tiết <i data-feather="arrow-right" class="w-3.5 h-3.5"></i>
                                </span>
                            </div>
                        </div>
                    </a>
                `;
            }).join('');
        }

        if (window.feather) {
            window.feather.replace();
        }
    }

    function updateTagState() {
        tags.forEach((tag) => {
            const isSelected = tag.dataset.filter === activeFilter;
            tag.classList.toggle('active', isSelected);
            tag.setAttribute('aria-pressed', String(isSelected));
        });
    }

    function applyFilters(updateUrl = true) {
        const keyword = searchInput ? normalize(searchInput.value) : '';
        const normalizedActiveFilter = normalize(activeFilter);

        const filtered = herbRecords.filter((herb) => {
            const datasetName = herb.datasetName || herb.dataset_name || '';
            const herbName = herb.name || herb.name_vi || '';
            const scientificName = herb.scientific || herb.scientific_name || '';
            const usage = herb.usage || '';
            const identification = herb.identification || '';
            const tagList = Array.isArray(herb.tags) ? herb.tags : [];

            const searchable = normalize([
                datasetName,
                herbName,
                scientificName,
                usage,
                identification,
                tagList.join(' ')
            ].join(' '));

            const matchesKeyword = !keyword || searchable.includes(keyword);
            const matchesFilter = activeFilter === 'all' || tagList.some((tag) => normalize(tag) === normalizedActiveFilter);

            return matchesKeyword && matchesFilter;
        });

        renderHerbs(filtered);

        if (resultSummary) {
            resultSummary.textContent = `Hiển thị ${filtered.length} / ${herbRecords.length} dược liệu`;
        }

        if (clearSearch) {
            const hasCriteria = Boolean(keyword) || activeFilter !== 'all';
            clearSearch.classList.toggle('hidden', !hasCriteria);
        }

        updateTagState();

        if (updateUrl) {
            const nextParams = new URLSearchParams();
            if (searchInput && searchInput.value.trim()) {
                nextParams.set('q', searchInput.value.trim());
            }
            if (activeFilter !== 'all') {
                nextParams.set('filter', activeFilter);
            }
            const queryStr = nextParams.toString();
            const nextUrl = `${window.location.pathname}${queryStr ? `?${queryStr}` : ''}`;
            window.history.replaceState(null, '', nextUrl);
        }
    }

    // Gán dữ liệu URL ban đầu
    if (searchInput) {
        searchInput.value = params.get('q') || '';
    }
    if (!tags.some((tag) => tag.dataset.filter === activeFilter)) {
        activeFilter = 'all';
    }

    // Gắn sự kiện tags
    tags.forEach((tag) => {
        tag.addEventListener('click', () => {
            activeFilter = tag.dataset.filter || 'all';
            applyFilters();
        });
    });

    // Gắn sự kiện ô tìm kiếm
    if (searchInput) {
        searchInput.addEventListener('input', () => applyFilters());
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') applyFilters();
        });
    }

    // Gắn sự kiện nút xóa bộ lọc
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            activeFilter = 'all';
            applyFilters();
            if (searchInput) searchInput.focus();
        });
    }

    // Hiển thị dữ liệu tĩnh offline trước để người dùng thấy ngay
    applyFilters(false);

    // Đồng thời gọi API backend để lấy dữ liệu mới nhất nếu có
    fetch('http://127.0.0.1:8000/herbs')
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Backend offline'))))
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                herbRecords = data;
                applyFilters(false);
            }
        })
        .catch(() => {
            // Đã có dữ liệu tĩnh hiển thị, không cần báo lỗi gián đoạn trải nghiệm
        });
});
