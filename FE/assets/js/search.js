/**
 * HerbaPedia - Module Tra cứu & Từ điển Dược liệu Thảo mộc
 * Hỗ trợ tìm kiếm theo tên tiếng Việt, tên khoa học, công dụng, vị thuốc, bài thuốc;
 * Lọc theo nhóm công dụng và lọc riêng 20 loài AI nhận diện;
 * Sắp xếp đa dạng, tối ưu hiệu năng và đồng bộ API backend.
 */

document.addEventListener('DOMContentLoaded', () => {
    const resultsGrid = document.getElementById('resultsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnClearSearchInput = document.getElementById('btnClearSearchInput');
    const tags = Array.from(document.querySelectorAll('.tag-pill'));
    const resultSummary = document.getElementById('resultsSummary');
    const clearSearch = document.getElementById('clearSearch');
    const btnFilterAiOnly = document.getElementById('btnFilterAiOnly');
    const aiFilterLabel = document.getElementById('aiFilterLabel');
    const sortSelector = document.getElementById('sortSelector');
    const statTotalHerbs = document.getElementById('statTotalHerbs');

    if (!resultsGrid) return;
    const AI_RECOGNIZED_CLASSES = new Set([
        'aloe', 'aloevera', 'arabian-jasmine', 'jasmine', 'betel', 'bhrami', 'brahmi',
        'coffee', 'eucalyptus', 'guava', 'hibiscus', 'jackfruit', 'lemon', 'mango',
        'marigold', 'mint', 'neem', 'onion', 'papaya', 'pepper', 'rose', 'tomato', 'tulsi'
    ]);

    const params = new URLSearchParams(window.location.search);
    let activeFilter = params.get('filter') || 'all';
    let isAiOnly = params.get('ai_only') === 'true';
    let currentSort = params.get('sort') || 'name_asc';
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

    function isAiHerb(herb) {
        const slug = String(herb.slug || herb.id || '').toLowerCase();
        const dataset = String(herb.datasetName || herb.dataset_name || '').toLowerCase();
        return AI_RECOGNIZED_CLASSES.has(slug) || AI_RECOGNIZED_CLASSES.has(dataset);
    }

    function renderHerbs(herbs) {
        if (!herbs.length) {
            resultsGrid.innerHTML = `
                <div id="searchEmptyState" class="col-span-full text-center text-gray-500 bg-white/90 backdrop-blur-md rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col items-center">
                    <div class="w-14 h-14 rounded-full bg-green-50 text-[#8CC63F] flex items-center justify-center mb-3">
                        <i data-feather="inbox" class="w-7 h-7"></i>
                    </div>
                    <p class="text-base font-bold text-forest-900 mb-1">Không tìm thấy dược liệu phù hợp</p>
                    <p class="text-xs font-light text-gray-500 max-w-sm mb-4">Hãy thử tìm với các từ khóa khác hoặc bấm nút bên dưới để đặt lại bộ lọc.</p>
                    <div class="flex flex-wrap items-center justify-center gap-2 text-xs">
                        <span class="text-gray-400">Gợi ý từ khóa:</span>
                        <button type="button" class="quick-suggest px-3 py-1 bg-gray-100 hover:bg-[#8CC63F] hover:text-white rounded-full transition-colors text-gray-700">Nha đam</button>
                        <button type="button" class="quick-suggest px-3 py-1 bg-gray-100 hover:bg-[#8CC63F] hover:text-white rounded-full transition-colors text-gray-700">Bạc hà</button>
                        <button type="button" class="quick-suggest px-3 py-1 bg-gray-100 hover:bg-[#8CC63F] hover:text-white rounded-full transition-colors text-gray-700">Trầu không</button>
                        <button type="button" class="quick-suggest px-3 py-1 bg-gray-100 hover:bg-[#8CC63F] hover:text-white rounded-full transition-colors text-gray-700">Lá Xoài</button>
                    </div>
                </div>
            `;
            
            resultsGrid.querySelectorAll('.quick-suggest').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (searchInput) {
                        searchInput.value = btn.textContent.trim();
                        applyFilters();
                    }
                });
            });
        } else {
            const fallbackImg = 'assets/images/logo.png';
            resultsGrid.innerHTML = herbs.map((herb) => {
                const herbSlug = herb.slug || herb.id;
                const datasetName = herb.datasetName || herb.dataset_name || '';
                const herbName = herb.name || herb.name_vi || '';
                const scientificName = herb.scientific || herb.scientific_name || '';
                const usage = herb.usage || '';
                const parts = herb.parts || herb.parts_used || '';
                const imageUrl = herb.image || herb.image_url || fallbackImg;
                const tagList = Array.isArray(herb.tags) ? herb.tags : [];
                const hasAi = isAiHerb(herb);

                const aiBadge = hasAi
                    ? `<span class="absolute top-3 left-3 bg-forest-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm z-10 flex items-center gap-1 border border-white/20">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#8CC63F] animate-pulse"></span> AI Nhận diện
                       </span>`
                    : '';

                const tagsHtml = tagList.slice(0, 2).map(t => 
                    `<span class="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">#${escapeHtml(t)}</span>`
                ).join(' ');

                return `
                    <a href="detail.html?id=${encodeURIComponent(herbSlug)}" 
                       data-tags="${escapeHtml(tagList.join(', '))}" 
                       class="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/90 overflow-hidden flex flex-col group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                        <div class="relative h-48 w-full overflow-hidden bg-gray-100">
                            ${aiBadge}
                            <img src="${escapeHtml(imageUrl)}" 
                                 alt="${escapeHtml(herbName)}" 
                                 loading="lazy" 
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                 onerror="this.onerror=null;this.src='${fallbackImg}'">
                        </div>
                        <div class="p-4 sm:p-5 flex-1 flex flex-col">
                            <div class="flex items-center justify-between gap-1 mb-1">
                                ${datasetName ? `<span class="text-[11px] font-bold uppercase tracking-wider text-[#8CC63F]">${escapeHtml(datasetName)}</span>` : '<span></span>'}
                                <div class="flex gap-1">${tagsHtml}</div>
                            </div>
                            <h3 class="text-base sm:text-lg font-bold text-forest-900 leading-snug group-hover:text-[#8CC63F] transition-colors mb-0.5">${escapeHtml(herbName)}</h3>
                            <p class="text-xs italic text-gray-400 mb-2 font-light">${escapeHtml(scientificName)}</p>
                            ${parts ? `<p class="text-[11px] text-gray-500 mb-1.5 font-medium flex items-center gap-1"><i data-feather="feather" class="w-3 h-3 text-[#8CC63F]"></i> Dùng: ${escapeHtml(parts)}</p>` : ''}
                            <p class="text-gray-600 line-clamp-2 text-xs leading-relaxed font-light mb-4">${escapeHtml(usage)}</p>
                            <div class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                <span class="text-gray-400 font-light">Xem vị thuốc</span>
                                <span class="text-[#8CC63F] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Chi tiết &rarr;
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

        if (btnFilterAiOnly) {
            btnFilterAiOnly.className = isAiOnly
                ? "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#8CC63F] bg-green-50 text-forest-900 transition-all font-bold shadow-sm"
                : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-all font-semibold shadow-sm";
            if (aiFilterLabel) {
                aiFilterLabel.textContent = isAiOnly ? "✓ Đang lọc 20 loài AI nhận diện" : "Chỉ hiện 20 loài AI nhận diện";
            }
        }
    }

    function sortHerbs(list, mode) {
        const sorted = [...list];
        if (mode === 'name_asc') {
            sorted.sort((a, b) => (a.name || a.name_vi || '').localeCompare(b.name || b.name_vi || '', 'vi'));
        } else if (mode === 'name_desc') {
            sorted.sort((a, b) => (b.name || b.name_vi || '').localeCompare(a.name || a.name_vi || '', 'vi'));
        } else if (mode === 'scientific_asc') {
            sorted.sort((a, b) => (a.scientific || a.scientific_name || '').localeCompare(b.scientific || b.scientific_name || '', 'en'));
        }
        return sorted;
    }

    function applyFilters(updateUrl = true) {
        const keyword = searchInput ? normalize(searchInput.value) : '';
        const normalizedActiveFilter = normalize(activeFilter);

        // Hiển thị/ẩn nút Xóa nhanh trong ô input
        if (btnClearSearchInput && searchInput) {
            btnClearSearchInput.classList.toggle('hidden', !searchInput.value.trim());
            btnClearSearchInput.classList.toggle('flex', Boolean(searchInput.value.trim()));
        }

        let filtered = herbRecords.filter((herb) => {
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
            const matchesAi = !isAiOnly || isAiHerb(herb);

            return matchesKeyword && matchesFilter && matchesAi;
        });

        // Sắp xếp
        filtered = sortHerbs(filtered, currentSort);

        renderHerbs(filtered);

        if (resultSummary) {
            resultSummary.textContent = `Hiển thị ${filtered.length} / ${herbRecords.length} dược liệu`;
        }

        if (clearSearch) {
            const hasCriteria = Boolean(keyword) || activeFilter !== 'all' || isAiOnly;
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
            if (isAiOnly) {
                nextParams.set('ai_only', 'true');
            }
            if (currentSort !== 'name_asc') {
                nextParams.set('sort', currentSort);
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
    if (sortSelector) {
        sortSelector.value = currentSort;
        sortSelector.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilters();
        });
    }

    // Toggle lọc cây AI nhận diện
    if (btnFilterAiOnly) {
        btnFilterAiOnly.addEventListener('click', () => {
            isAiOnly = !isAiOnly;
            applyFilters();
        });
    }

    // Gắn sự kiện tags phân loại
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

    // Nút Xóa nhanh trong Search Input
    if (btnClearSearchInput && searchInput) {
        btnClearSearchInput.addEventListener('click', () => {
            searchInput.value = '';
            applyFilters();
            searchInput.focus();
        });
    }

    // Phím tắt bàn phím: bấm "/" để focus ô tìm kiếm
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // Nút xóa toàn bộ bộ lọc
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            activeFilter = 'all';
            isAiOnly = false;
            currentSort = 'name_asc';
            if (sortSelector) sortSelector.value = 'name_asc';
            applyFilters();
            if (searchInput) searchInput.focus();
        });
    }

    // Hiển thị dữ liệu tĩnh offline trước để người dùng thấy ngay
    applyFilters(false);

    // Đồng thời gọi API backend để lấy dữ liệu mới nhất nếu có
    const herbsApiUrl = (window.HerbaConfig ? window.HerbaConfig.apiUrl('/herbs') : 'http://127.0.0.1:8000/herbs');
    fetch(herbsApiUrl)
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Backend offline'))))
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                herbRecords = data;
                if (statTotalHerbs) {
                    statTotalHerbs.textContent = `${data.length} Dược liệu chuẩn hóa`;
                }
                applyFilters(false);
            }
        })
        .catch(() => {
        });
});
