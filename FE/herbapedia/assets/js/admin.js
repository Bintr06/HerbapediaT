const ADMIN_API = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('herbManagementList');
    if (!list) return;

    let herbs = [];
    let editingSlug = null;

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));

    const tokenHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
    });

    function setStatus(message, type = 'success') {
        const element = document.getElementById('herbManagementStatus');
        element.textContent = message;
        element.className = `mb-4 rounded-xl px-4 py-3 text-sm ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`;
    }

    function renderList() {
        const keyword = document.getElementById('herbSearchInput').value.trim().toLocaleLowerCase('vi');
        const category = document.getElementById('herbCategoryFilter').value;
        const filtered = herbs.filter((herb) => {
            const matchesKeyword = !keyword || [herb.name, herb.slug, herb.dataset_name, herb.scientific]
                .join(' ').toLocaleLowerCase('vi').includes(keyword);
            const matchesCategory = !category || herb.tags.includes(category);
            return matchesKeyword && matchesCategory;
        });
        list.innerHTML = filtered.length ? filtered.map((herb) => `
            <article class="flex gap-4 rounded-2xl border border-gray-200 bg-white/70 p-4">
                <img src="${escapeHtml(herb.image || 'assets/images/logo.png')}" alt="${escapeHtml(herb.name)}" class="h-20 w-20 rounded-xl object-cover bg-sage-50">
                <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                        <div><h3 class="font-bold text-forest-900">${escapeHtml(herb.name)}</h3><p class="text-xs italic text-gray-500">${escapeHtml(herb.scientific)}</p></div>
                        <span class="rounded-full bg-sage-50 px-2 py-1 text-[10px] font-bold text-forest-900">${escapeHtml(herb.slug)}</span>
                    </div>
                    <p class="mt-2 line-clamp-2 text-sm text-gray-600">${escapeHtml(herb.usage)}</p>
                    <div class="mt-3 flex gap-2">
                        <button type="button" data-edit-herb="${escapeHtml(herb.slug)}" class="rounded-full border border-gray-200 px-3 py-1 text-xs font-bold text-forest-900 hover:bg-sage-50">Sửa</button>
                        <button type="button" data-delete-herb="${escapeHtml(herb.slug)}" class="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50">Xóa</button>
                    </div>
                </div>
            </article>
        `).join('') : '<p class="col-span-full rounded-2xl bg-white/70 p-8 text-center text-sm text-gray-500">Không tìm thấy cây phù hợp.</p>';
    }

    function closeModal() {
        document.getElementById('herbEditorModal')?.remove();
        editingSlug = null;
    }

    function openEditor(herb = null) {
        editingSlug = herb?.slug || null;
        const value = (key) => escapeHtml(herb?.[key] || '');
        document.body.insertAdjacentHTML('beforeend', `
            <div id="herbEditorModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-forest-900/40 p-4">
                <div class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                    <div class="mb-6 flex items-center justify-between"><div><h2 class="font-serif text-2xl font-bold text-forest-900">${herb ? 'Sửa dữ liệu cây' : 'Thêm cây mới'}</h2><p class="text-sm text-gray-500">Các trường có dấu * là bắt buộc.</p></div><button id="closeHerbEditor" type="button" class="rounded-full p-2 text-gray-500 hover:bg-gray-100"><i data-feather="x"></i></button></div>
                    <form id="herbEditorForm" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label class="text-sm font-semibold text-gray-700">Slug *<input name="slug" required value="${value('slug')}" class="admin-input"></label>
                        <label class="text-sm font-semibold text-gray-700">Tên dataset *<input name="dataset_name" required value="${value('dataset_name')}" class="admin-input"></label>
                        <label class="text-sm font-semibold text-gray-700">Tên tiếng Việt *<input name="name" required value="${value('name')}" class="admin-input"></label>
                        <label class="text-sm font-semibold text-gray-700">Tên khoa học *<input name="scientific" required value="${value('scientific')}" class="admin-input"></label>
                        <div class="md:col-span-2">
                            <div class="mb-2 flex items-center justify-between gap-3"><label for="herbImageFile" class="text-sm font-semibold text-gray-700">Ảnh cây</label><span class="text-xs font-normal text-gray-400">JPEG, PNG hoặc WEBP · tối đa 5 MB</span></div>
                            <input name="image" value="${value('image')}" type="hidden"><input type="hidden" name="image_public_id" value="${value('image_public_id')}">
                            <div id="herbImageDropzone" tabindex="0" role="button" class="group relative flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-sage-50 p-4 text-center transition hover:border-green-400 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100">
                                <img id="herbImagePreview" src="${value('image') || 'assets/images/logo.png'}" alt="Xem trước ảnh cây" class="absolute inset-0 hidden h-full w-full object-cover">
                                <div id="herbImageEmptyState" class="${value('image') ? 'hidden' : ''} relative flex flex-col items-center gap-2 text-green-900"><span class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm"><i data-feather="upload-cloud" class="h-6 w-6"></i></span><span class="font-bold">Kéo thả ảnh vào đây</span><span class="text-xs text-gray-500">hoặc bấm để chọn ảnh từ máy</span></div>
                                <div class="absolute inset-x-3 bottom-3 hidden items-center justify-between gap-2 rounded-xl bg-white/90 px-3 py-2 text-left shadow-sm backdrop-blur group-hover:flex" id="herbImageOverlay"><span id="herbImageFileName" class="min-w-0 truncate text-xs font-semibold text-forest-900">Ảnh hiện tại</span><span id="herbImageFileSize" class="shrink-0 text-[11px] text-gray-500"></span></div>
                                <input id="herbImageFile" name="image_file" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only">
                            </div>
                            <p id="imageUploadStatus" class="mt-3 text-xs text-gray-500">Ảnh sẽ được tải lên khi bạn bấm nút lưu.</p>
                        </div>
                        <label class="text-sm font-semibold text-gray-700 md:col-span-2">Nhóm công dụng, cách nhau bằng dấu phẩy<input name="tags" value="${escapeHtml((herb?.tags || []).join(', '))}" class="admin-input"></label>
                        <label class="text-sm font-semibold text-gray-700 md:col-span-2">Công dụng chính *<textarea name="usage" required class="admin-input">${value('usage')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700">Bộ phận sử dụng *<textarea name="parts" required class="admin-input">${value('parts')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700">Đặc điểm nhận dạng *<textarea name="identification" required class="admin-input">${value('identification')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700">Môi trường sống<textarea name="habitat" class="admin-input">${value('habitat')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700">Cách sơ chế<textarea name="preparation" class="admin-input">${value('preparation')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700 md:col-span-2">Cảnh báo an toàn *<textarea name="safety" required class="admin-input">${value('safety')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700 md:col-span-2">Lưu ý thêm<textarea name="caution" class="admin-input">${value('caution')}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700 md:col-span-2">Cách sử dụng (mỗi dòng một mục)<textarea name="usageDetails" class="admin-input min-h-32">${escapeHtml((herb?.usageDetails || []).join('\n'))}</textarea></label>
                        <label class="text-sm font-semibold text-gray-700 md:col-span-2">Bài thuốc/ứng dụng (mỗi dòng một mục)<textarea name="remedies" class="admin-input min-h-24">${escapeHtml((herb?.remedies || []).join('\n'))}</textarea></label>
                        <div class="flex justify-end gap-3 md:col-span-2"><button id="cancelHerbEditor" type="button" class="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">Hủy</button><button type="submit" class="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-950">${herb ? 'Lưu thay đổi' : 'Tạo cây'}</button></div>
                    </form>
                </div>
            </div>
        `);
        if (!document.getElementById('adminInputStyles')) {
            const style = document.createElement('style');
            style.id = 'adminInputStyles';
            style.textContent = '.admin-input{display:block;width:100%;margin-top:.4rem;border:1px solid #e5e7eb;border-radius:.75rem;padding:.65rem .8rem;font-weight:400;outline:none}.admin-input:focus{border-color:#22c55e;box-shadow:0 0 0 3px #dcfce7}';
            document.head.appendChild(style);
        }
        feather.replace();
        setupImagePicker(herb);
        document.getElementById('closeHerbEditor').addEventListener('click', closeModal);
        document.getElementById('cancelHerbEditor').addEventListener('click', closeModal);
        document.getElementById('herbEditorForm').addEventListener('submit', submitEditor);
    }

    function setupImagePicker(herb) {
        const dropzone = document.getElementById('herbImageDropzone');
        const input = document.getElementById('herbImageFile');
        const preview = document.getElementById('herbImagePreview');
        const emptyState = document.getElementById('herbImageEmptyState');
        const overlay = document.getElementById('herbImageOverlay');
        const fileName = document.getElementById('herbImageFileName');
        const fileSize = document.getElementById('herbImageFileSize');
        const status = document.getElementById('imageUploadStatus');
        const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

        if (herb?.image) {
            preview.classList.remove('hidden');
            overlay.classList.add('flex');
            fileName.textContent = 'Ảnh hiện tại';
            preview.onerror = () => {
                preview.classList.add('hidden');
                emptyState.classList.remove('hidden');
                overlay.classList.remove('flex');
            };
        }

        const showSelectedFile = (file) => {
            if (!file) return;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
                status.textContent = 'File không hợp lệ hoặc vượt quá 5 MB.';
                status.className = 'text-xs text-red-600';
                input.value = '';
                return;
            }
            const objectUrl = URL.createObjectURL(file);
            preview.src = objectUrl;
            preview.classList.remove('hidden');
            emptyState.classList.add('hidden');
            overlay.classList.add('flex');
            fileName.textContent = file.name;
            fileSize.textContent = formatSize(file.size);
            status.textContent = 'Ảnh đã sẵn sàng. Bấm nút lưu để tải ảnh lên và lưu toàn bộ dữ liệu.';
            status.className = 'text-xs text-green-700';
        };

        input.addEventListener('change', () => showSelectedFile(input.files[0]));
        dropzone.addEventListener('click', (event) => {
            if (event.target !== input) input.click();
        });
        dropzone.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') input.click();
        });
        ['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropzone.classList.add('border-green-500', 'bg-green-100');
        }));
        ['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropzone.classList.remove('border-green-500', 'bg-green-100');
        }));
        dropzone.addEventListener('drop', (event) => {
            const file = event.dataTransfer.files[0];
            input.files = event.dataTransfer.files;
            showSelectedFile(file);
        });
    }

    async function uploadHerbImage(file) {
        const form = document.getElementById('herbEditorForm');
        const status = document.getElementById('imageUploadStatus');
        const data = new FormData();
        data.append('file', file);
        status.textContent = 'Đang tải ảnh lên Cloudinary...';
        status.className = 'text-xs text-gray-500';
        const response = await fetch(`${ADMIN_API}/herbs/upload-image`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` },
            body: data
        });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.detail || 'Không thể tải ảnh lên.');
        }
        const result = await response.json();
        form.elements.image.value = result.url;
        form.elements.image_public_id.value = result.public_id;
        return result;
    }

    async function submitEditor(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const submitButton = event.currentTarget.querySelector('button[type="submit"]');
        const imageFile = form.get('image_file');
        submitButton.disabled = true;
        submitButton.textContent = 'Đang lưu...';
        const imageStatus = document.getElementById('imageUploadStatus');
        try {
            if (imageFile instanceof File && imageFile.size > 0) {
                await uploadHerbImage(imageFile);
                imageStatus.textContent = 'Đã tải ảnh lên, đang lưu dữ liệu cây...';
                imageStatus.className = 'text-xs text-green-700';
            }
        const lines = (name) => String(form.get(name) || '').split('\n').map((item) => item.trim()).filter(Boolean);
        const payload = {
            slug: form.get('slug').trim(), dataset_name: form.get('dataset_name').trim(),
            name: form.get('name').trim(), scientific: form.get('scientific').trim(),
            image: form.get('image').trim() || null,
            image_public_id: form.get('image_public_id').trim() || null,
            tags: form.get('tags').split(',').map((item) => item.trim()).filter(Boolean),
            usage: form.get('usage').trim(), parts: form.get('parts').trim(),
            identification: form.get('identification').trim(), safety: form.get('safety').trim(),
            habitat: form.get('habitat').trim() || null, preparation: form.get('preparation').trim() || null,
            caution: form.get('caution').trim() || null, usageDetails: lines('usageDetails'), remedies: lines('remedies')
        };
        const response = await fetch(`${ADMIN_API}/herbs${editingSlug ? `/${encodeURIComponent(editingSlug)}` : ''}`, {
            method: editingSlug ? 'PUT' : 'POST', headers: tokenHeaders(), body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.detail || 'Không thể lưu dữ liệu cây.');
        }
        closeModal();
        setStatus(editingSlug ? 'Đã cập nhật dữ liệu cây.' : 'Đã thêm cây mới.');
        await loadHerbs();
        } catch (error) {
            setStatus(error.message || 'Không thể lưu dữ liệu cây.', 'error');
            imageStatus.textContent = error.message || 'Không thể tải ảnh hoặc lưu dữ liệu.';
            imageStatus.className = 'text-xs text-red-600';
            submitButton.disabled = false;
            submitButton.textContent = editingSlug ? 'Lưu thay đổi' : 'Tạo cây';
        }
    }

    async function loadHerbs() {
        const response = await fetch(`${ADMIN_API}/herbs`);
        if (!response.ok) throw new Error('Không thể tải dữ liệu cây.');
        herbs = await response.json();
        const count = String(herbs.length);
        document.getElementById('herbCount').textContent = count;
        const tabHerb = document.getElementById('tabHerbCount');
        if (tabHerb) tabHerb.textContent = count;
        renderList();
    }

    list.addEventListener('click', async (event) => {
        const editButton = event.target.closest('[data-edit-herb]');
        const deleteButton = event.target.closest('[data-delete-herb]');
        if (editButton) openEditor(herbs.find((herb) => herb.slug === editButton.dataset.editHerb));
        if (deleteButton && window.confirm('Bạn có chắc muốn xóa cây này không? Dữ liệu cách dùng và bài thuốc cũng sẽ bị xóa.')) {
            const response = await fetch(`${ADMIN_API}/herbs/${encodeURIComponent(deleteButton.dataset.deleteHerb)}`, { method: 'DELETE', headers: tokenHeaders() });
            if (!response.ok) {
                setStatus('Không thể xóa dữ liệu cây.', 'error');
                return;
            }
            setStatus('Đã xóa dữ liệu cây.');
            await loadHerbs();
        }
    });
    document.getElementById('addHerbButton').addEventListener('click', () => openEditor());
    document.getElementById('herbSearchInput').addEventListener('input', renderList);
    document.getElementById('herbCategoryFilter').addEventListener('change', renderList);
    loadHerbs().catch(() => setStatus('Không thể tải dữ liệu. Hãy kiểm tra backend và quyền Admin.', 'error'));

    // ==========================================
    // USER MANAGEMENT LOGIC
    // ==========================================
    const userListContainer = document.getElementById('userManagementList');
    const userStatusElement = document.getElementById('userManagementStatus');
    const userSearchInput = document.getElementById('userSearchInput');
    const userRoleFilter = document.getElementById('userRoleFilter');
    const userStatusFilter = document.getElementById('userStatusFilter');
    const addUserButton = document.getElementById('addUserButton');
    const userCountElement = document.getElementById('userCount');

    let users = [];
    const currentUsername = (localStorage.getItem('username') || '').toLowerCase();

    function setUserStatus(message, type = 'success') {
        if (!userStatusElement) return;
        userStatusElement.textContent = message;
        userStatusElement.className = `mb-4 rounded-xl px-4 py-3 text-sm ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`;
        userStatusElement.classList.remove('hidden');
        setTimeout(() => {
            userStatusElement.classList.add('hidden');
        }, 5000);
    }

    function renderUserList() {
        if (!userListContainer) return;
        const keyword = (userSearchInput?.value || '').trim().toLocaleLowerCase('vi');
        const role = userRoleFilter?.value || '';
        const status = userStatusFilter?.value || '';

        const filtered = users.filter((u) => {
            const matchesKeyword = !keyword || [u.username, u.display_name, u.phone]
                .join(' ').toLocaleLowerCase('vi').includes(keyword);
            const matchesRole = !role || u.role === role;
            const matchesStatus = !status || (status === 'active' ? u.is_active : !u.is_active);
            return matchesKeyword && matchesRole && matchesStatus;
        });

        if (!filtered.length) {
            userListContainer.innerHTML = '<p class="p-8 text-center text-sm text-gray-500">Không tìm thấy người dùng phù hợp.</p>';
            return;
        }

        userListContainer.innerHTML = `
            <table class="w-full text-left text-sm text-gray-600">
                <thead class="bg-sage-50/80 text-xs font-bold uppercase tracking-wider text-forest-900 border-b border-gray-200">
                    <tr>
                        <th class="py-3.5 px-4">Người dùng</th>
                        <th class="py-3.5 px-4">Vai trò</th>
                        <th class="py-3.5 px-4">Trạng thái</th>
                        <th class="py-3.5 px-4">Số điện thoại</th>
                        <th class="py-3.5 px-4">Đăng nhập qua</th>
                        <th class="py-3.5 px-4">Lịch sử quét</th>
                        <th class="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${filtered.map((u) => {
                        const isSelf = u.username.toLowerCase() === currentUsername;
                        const roleBadge = u.role === 'admin'
                            ? '<span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">Admin</span>'
                            : '<span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">User</span>';
                        const statusBadge = u.is_active
                            ? '<span class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">Hoạt động</span>'
                            : '<span class="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Đã khóa</span>';
                        const providerBadge = u.auth_provider === 'google'
                            ? '<span class="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold">Google</span>'
                            : '<span class="inline-flex items-center gap-1 text-xs text-gray-600">Mật khẩu</span>';
                        
                        return `
                            <tr class="hover:bg-white transition-colors">
                                <td class="py-3.5 px-4">
                                    <div class="flex items-center gap-3">
                                        <img src="${escapeHtml(u.avatar_url || 'assets/images/logo.png')}" alt="" class="h-9 w-9 rounded-full object-cover border border-gray-200 bg-white" onerror="this.onerror=null;this.src='assets/images/logo.png'">
                                        <div>
                                            <div class="font-bold text-forest-900 flex items-center gap-1.5">
                                                ${escapeHtml(u.display_name || u.username)}
                                                ${isSelf ? '<span class="rounded bg-forest-900/10 px-1.5 py-0.5 text-[10px] font-bold text-forest-900">(Bạn)</span>' : ''}
                                            </div>
                                            <div class="text-xs text-gray-400">@${escapeHtml(u.username)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3.5 px-4">${roleBadge}</td>
                                <td class="py-3.5 px-4">${statusBadge}</td>
                                <td class="py-3.5 px-4 font-mono text-xs">${escapeHtml(u.phone || 'Chưa có')}</td>
                                <td class="py-3.5 px-4">${providerBadge}</td>
                                <td class="py-3.5 px-4 font-semibold text-forest-900">${u.history_count || 0} lượt</td>
                                <td class="py-3.5 px-4 text-right">
                                    <div class="inline-flex items-center gap-1.5">
                                        <button type="button" data-edit-user="${u.id}" class="rounded-full border border-gray-200 px-3 py-1 text-xs font-bold text-forest-900 hover:bg-sage-50 transition">Sửa</button>
                                        ${!isSelf ? `
                                            <button type="button" data-toggle-user="${u.id}" data-active="${u.is_active}" class="rounded-full border ${u.is_active ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-green-200 text-green-700 hover:bg-green-50'} px-3 py-1 text-xs font-bold transition">
                                                ${u.is_active ? 'Khóa' : 'Mở khóa'}
                                            </button>
                                            <button type="button" data-delete-user="${u.id}" class="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition">Xóa</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        if (window.feather) feather.replace();
    }

    async function loadUsers() {
        if (!userListContainer) return;
        try {
            const response = await fetch(`${ADMIN_API}/auth/users`, { headers: tokenHeaders() });
            if (!response.ok) throw new Error('Không thể tải danh sách người dùng.');
            users = await response.json();
            if (userCountElement) userCountElement.textContent = String(users.length);
            const tabUser = document.getElementById('tabUserCount');
            if (tabUser) tabUser.textContent = String(users.length);
            renderUserList();
        } catch (error) {
            setUserStatus(error.message || 'Lỗi khi tải người dùng.', 'error');
        }
    }

    function closeUserModal() {
        document.getElementById('userModal')?.remove();
    }

    function openCreateUserModal() {
        closeUserModal();
        document.body.insertAdjacentHTML('beforeend', `
            <div id="userModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-forest-900/40 p-4">
                <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                    <div class="mb-5 flex items-center justify-between">
                        <div>
                            <h2 class="font-serif text-2xl font-bold text-forest-900">Thêm người dùng mới</h2>
                            <p class="text-xs text-gray-500 mt-0.5">Tạo tài khoản và phân quyền trong hệ thống.</p>
                        </div>
                        <button id="closeUserModalBtn" type="button" class="rounded-full p-2 text-gray-500 hover:bg-gray-100"><i data-feather="x"></i></button>
                    </div>
                    <form id="createUserForm" class="space-y-4">
                        <label class="block text-sm font-semibold text-gray-700">Tên đăng nhập *
                            <input name="username" required minlength="3" maxlength="50" placeholder="nguyenvana" class="admin-input">
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Mật khẩu ban đầu *
                            <input name="password" type="password" required minlength="8" placeholder="Ít nhất 8 ký tự" class="admin-input">
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Họ và tên *
                            <input name="display_name" required placeholder="Nguyễn Văn A" class="admin-input">
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Số điện thoại
                            <input name="phone" placeholder="0901234567" class="admin-input">
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Vai trò
                            <select name="role" class="admin-input">
                                <option value="user">Người dùng (User)</option>
                                <option value="admin">Quản trị viên (Admin)</option>
                            </select>
                        </label>
                        <div class="flex justify-end gap-3 pt-3">
                            <button id="cancelUserModalBtn" type="button" class="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                            <button type="submit" class="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-950">Tạo tài khoản</button>
                        </div>
                    </form>
                </div>
            </div>
        `);
        feather.replace();
        document.getElementById('closeUserModalBtn').addEventListener('click', closeUserModal);
        document.getElementById('cancelUserModalBtn').addEventListener('click', closeUserModal);
        document.getElementById('createUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang tạo...';
            try {
                const payload = {
                    username: form.get('username').trim(),
                    password: form.get('password'),
                    display_name: form.get('display_name').trim(),
                    phone: form.get('phone').trim() || '',
                    role: form.get('role')
                };
                const res = await fetch(`${ADMIN_API}/auth/users`, {
                    method: 'POST',
                    headers: tokenHeaders(),
                    body: JSON.stringify(payload)
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.detail || 'Không thể tạo người dùng.');
                }
                closeUserModal();
                setUserStatus('Đã tạo tài khoản người dùng mới thành công.');
                await loadUsers();
            } catch (err) {
                alert(err.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Tạo tài khoản';
            }
        });
    }

    function openEditUserModal(user) {
        closeUserModal();
        const isSelf = user.username.toLowerCase() === currentUsername;
        document.body.insertAdjacentHTML('beforeend', `
            <div id="userModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-forest-900/40 p-4">
                <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                    <div class="mb-5 flex items-center justify-between">
                        <div>
                            <h2 class="font-serif text-2xl font-bold text-forest-900">Sửa thông tin tài khoản</h2>
                            <p class="text-xs text-gray-500 mt-0.5">Tài khoản: <strong>@${escapeHtml(user.username)}</strong></p>
                        </div>
                        <button id="closeUserModalBtn" type="button" class="rounded-full p-2 text-gray-500 hover:bg-gray-100"><i data-feather="x"></i></button>
                    </div>
                    <form id="editUserForm" class="space-y-4">
                        <label class="block text-sm font-semibold text-gray-700">Họ và tên *
                            <input name="display_name" required value="${escapeHtml(user.display_name || user.username)}" class="admin-input">
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Số điện thoại
                            <input name="phone" value="${escapeHtml(user.phone || '')}" placeholder="0901234567" class="admin-input">
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Vai trò
                            <select name="role" class="admin-input" ${isSelf ? 'disabled title="Không thể tự đổi vai trò của bản thân"' : ''}>
                                <option value="user" ${user.role === 'user' ? 'selected' : ''}>Người dùng (User)</option>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Quản trị viên (Admin)</option>
                            </select>
                            ${isSelf ? '<span class="text-[11px] text-gray-400 mt-1 block">Không thể tự đổi vai trò của chính mình</span>' : ''}
                        </label>
                        <label class="block text-sm font-semibold text-gray-700">Trạng thái tài khoản
                            <select name="is_active" class="admin-input" ${isSelf ? 'disabled' : ''}>
                                <option value="true" ${user.is_active ? 'selected' : ''}>Hoạt động</option>
                                <option value="false" ${!user.is_active ? 'selected' : ''}>Đã khóa</option>
                            </select>
                            ${isSelf ? '<span class="text-[11px] text-gray-400 mt-1 block">Không thể tự khóa tài khoản của chính mình</span>' : ''}
                        </label>
                        <div class="border-t border-gray-100 pt-3">
                            <label class="block text-sm font-semibold text-gray-700">Đặt lại mật khẩu mới
                                <input name="new_password" type="password" minlength="8" placeholder="Để trống nếu không muốn đổi" class="admin-input">
                                <span class="text-[11px] text-gray-400 mt-1 block">Tối thiểu 8 ký tự nếu nhập mật khẩu mới</span>
                            </label>
                        </div>
                        <div class="flex justify-end gap-3 pt-3">
                            <button id="cancelUserModalBtn" type="button" class="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                            <button type="submit" class="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-950">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        `);
        feather.replace();
        document.getElementById('closeUserModalBtn').addEventListener('click', closeUserModal);
        document.getElementById('cancelUserModalBtn').addEventListener('click', closeUserModal);
        document.getElementById('editUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang lưu...';
            try {
                const payload = {
                    display_name: form.get('display_name').trim(),
                    phone: form.get('phone').trim() || ''
                };
                if (!isSelf) {
                    payload.role = form.get('role');
                    payload.is_active = form.get('is_active') === 'true';
                }
                const newPass = form.get('new_password');
                if (newPass && newPass.trim().length >= 8) {
                    payload.new_password = newPass.trim();
                }
                const res = await fetch(`${ADMIN_API}/auth/users/${user.id}`, {
                    method: 'PUT',
                    headers: tokenHeaders(),
                    body: JSON.stringify(payload)
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.detail || 'Không thể cập nhật người dùng.');
                }
                closeUserModal();
                setUserStatus('Đã cập nhật thông tin tài khoản thành công.');
                await loadUsers();
            } catch (err) {
                alert(err.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Lưu thay đổi';
            }
        });
    }

    if (userListContainer) {
        userListContainer.addEventListener('click', async (event) => {
            const editBtn = event.target.closest('[data-edit-user]');
            const toggleBtn = event.target.closest('[data-toggle-user]');
            const deleteBtn = event.target.closest('[data-delete-user]');

            if (editBtn) {
                const u = users.find((item) => String(item.id) === editBtn.dataset.editUser);
                if (u) openEditUserModal(u);
            }

            if (toggleBtn) {
                const userId = toggleBtn.dataset.toggleUser;
                const currentActive = toggleBtn.dataset.active === 'true';
                const actionText = currentActive ? 'khóa' : 'mở khóa';
                if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này?`)) {
                    try {
                        const res = await fetch(`${ADMIN_API}/auth/users/${userId}`, {
                            method: 'PUT',
                            headers: tokenHeaders(),
                            body: JSON.stringify({ is_active: !currentActive })
                        });
                        if (!res.ok) {
                            const err = await res.json().catch(() => ({}));
                            throw new Error(err.detail || `Không thể ${actionText} tài khoản.`);
                        }
                        setUserStatus(`Đã ${actionText} tài khoản thành công.`);
                        await loadUsers();
                    } catch (err) {
                        setUserStatus(err.message, 'error');
                    }
                }
            }

            if (deleteBtn) {
                const userId = deleteBtn.dataset.deleteUser;
                if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này? Mọi dữ liệu lịch sử quét và bài viết liên quan sẽ bị xóa.')) {
                    try {
                        const res = await fetch(`${ADMIN_API}/auth/users/${userId}`, {
                            method: 'DELETE',
                            headers: tokenHeaders()
                        });
                        if (!res.ok) {
                            const err = await res.json().catch(() => ({}));
                            throw new Error(err.detail || 'Không thể xóa tài khoản.');
                        }
                        setUserStatus('Đã xóa tài khoản người dùng thành công.');
                        await loadUsers();
                    } catch (err) {
                        setUserStatus(err.message, 'error');
                    }
                }
            }
        });
    }

    if (addUserButton) {
        addUserButton.addEventListener('click', openCreateUserModal);
    }
    if (userSearchInput) {
        userSearchInput.addEventListener('input', renderUserList);
    }
    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', renderUserList);
    }
    if (userStatusFilter) {
        userStatusFilter.addEventListener('change', renderUserList);
    }

    loadUsers().catch(() => setUserStatus('Không thể tải người dùng. Hãy kiểm tra kết nối API.', 'error'));

    // ==========================================
    // COMMUNITY POSTS MANAGEMENT LOGIC
    // ==========================================
    let communityPosts = [];
    const communityListContainer = document.getElementById('communityManagementList');
    const communityStatusElement = document.getElementById('communityManagementStatus');
    const communitySearchInput = document.getElementById('communitySearchInput');
    const communityTypeFilter = document.getElementById('communityTypeFilter');
    const communityPostCountElement = document.getElementById('communityPostCount');
    const tabCommunityCountElement = document.getElementById('tabCommunityCount');

    function setCommunityStatus(message, type = 'success') {
        if (!communityStatusElement) return;
        communityStatusElement.textContent = message;
        communityStatusElement.className = `mb-4 rounded-xl px-4 py-3 text-sm ${
            type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
        }`;
        communityStatusElement.classList.remove('hidden');
        setTimeout(() => communityStatusElement?.classList.add('hidden'), 4000);
    }

    function renderCommunityList() {
        if (!communityListContainer) return;
        const keyword = (communitySearchInput?.value || '').trim().toLowerCase();
        const type = communityTypeFilter?.value || '';

        const filtered = communityPosts.filter((p) => {
            const authorName = (p.author?.display_name || '').toLowerCase();
            const title = (p.title || '').toLowerCase();
            const content = (p.content || '').toLowerCase();
            const matchesKeyword = !keyword || title.includes(keyword) || authorName.includes(keyword) || content.includes(keyword);
            const matchesType = !type || p.post_type === type;
            return matchesKeyword && matchesType;
        });

        if (!filtered.length) {
            communityListContainer.innerHTML = '<p class="p-8 text-center text-sm text-gray-500">Chưa có bài viết nào hoặc không tìm thấy bài viết phù hợp.</p>';
            return;
        }

        communityListContainer.innerHTML = `
            <table class="w-full text-left text-sm">
                <thead class="border-b border-gray-200 bg-gray-50/70 text-xs font-bold uppercase text-gray-600">
                    <tr>
                        <th class="px-5 py-3.5">Bài viết</th>
                        <th class="px-4 py-3.5">Tác giả</th>
                        <th class="px-3 py-3.5 text-center">Loại bài</th>
                        <th class="px-3 py-3.5 text-center">Tương tác</th>
                        <th class="px-4 py-3.5">Ngày đăng</th>
                        <th class="px-5 py-3.5 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${filtered.map((p) => `
                        <tr class="hover:bg-white transition-colors">
                            <td class="px-5 py-4 max-w-xs">
                                <div class="flex items-center gap-3">
                                    ${p.image_url ? `<img src="${escapeHtml(p.image_url)}" class="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0">` : `<div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-forest-900 shrink-0"><i data-feather="file-text" class="w-5 h-5"></i></div>`}
                                    <div class="min-w-0">
                                        <h4 class="font-bold text-forest-900 truncate">${escapeHtml(p.title)}</h4>
                                        <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">${escapeHtml(p.content)}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-800 text-xs">${escapeHtml(p.author?.display_name || 'Người dùng')}</span>
                                    ${p.author?.role === 'admin' ? '<span class="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Admin</span>' : ''}
                                </div>
                            </td>
                            <td class="px-3 py-4 text-center whitespace-nowrap">
                                <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${p.post_type === 'remedy' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}">
                                    ${p.post_type === 'remedy' ? 'Bài thuốc' : 'Chia sẻ'}
                                </span>
                            </td>
                            <td class="px-3 py-4 text-center whitespace-nowrap text-xs text-gray-500">
                                <span>${p.like_count || 0} thích</span> • <span>${p.comment_count || 0} cmt</span>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                                ${new Date(p.created_at).toLocaleDateString('vi-VN')}
                            </td>
                            <td class="px-5 py-4 text-right whitespace-nowrap">
                                <div class="flex items-center justify-end gap-2">
                                    <a href="user-profile.html?userId=${p.author?.id}" target="_blank" class="rounded-full border border-gray-200 px-3 py-1 text-xs font-bold text-forest-900 hover:bg-gray-50">Xem blog</a>
                                    <button type="button" data-delete-community-post="${p.id}" class="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50">Xóa bài</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        if (window.feather) feather.replace();
    }

    async function loadCommunityPostsAdmin() {
        try {
            const res = await fetch(`${ADMIN_API}/community/posts`, { headers: tokenHeaders() });
            if (!res.ok) throw new Error('Không thể tải bài viết cộng đồng.');
            communityPosts = await res.json();
            const count = String(communityPosts.length);
            if (communityPostCountElement) communityPostCountElement.textContent = count;
            if (tabCommunityCountElement) tabCommunityCountElement.textContent = count;
            renderCommunityList();
        } catch (e) {
            setCommunityStatus(e.message, 'error');
        }
    }

    if (communityListContainer) {
        communityListContainer.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('[data-delete-community-post]');
            if (deleteBtn) {
                const postId = deleteBtn.dataset.deleteCommunityPost;
                if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này khỏi cộng đồng?')) {
                    try {
                        const res = await fetch(`${ADMIN_API}/community/posts/${postId}`, {
                            method: 'DELETE',
                            headers: tokenHeaders()
                        });
                        if (!res.ok) {
                            const err = await res.json().catch(() => ({}));
                            throw new Error(err.detail || 'Không thể xóa bài viết.');
                        }
                        setCommunityStatus('Đã xóa bài viết thành công.');
                        await loadCommunityPostsAdmin();
                    } catch (err) {
                        setCommunityStatus(err.message, 'error');
                    }
                }
            }
        });
    }

    communitySearchInput?.addEventListener('input', renderCommunityList);
    communityTypeFilter?.addEventListener('change', renderCommunityList);

    // ==========================================
    // TOOL SWITCHER (TAB & CARD) LOGIC
    // ==========================================
    const toolSections = document.querySelectorAll('.tool-section');
    const toolCards = document.querySelectorAll('[data-tool-card]');
    const toolTabs = document.querySelectorAll('[data-tool-tab]');
    const statTargets = document.querySelectorAll('[data-tool-target]');

    function switchAdminTool(targetId, shouldScroll = false) {
        const validIds = ['herb-management', 'user-management', 'community-management', 'system-settings'];
        if (!validIds.includes(targetId)) targetId = 'herb-management';

        // 1. Hide all tool sections, show only target
        toolSections.forEach((sec) => {
            if (sec.id === targetId) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });

        // 2. Update Tool Cards Active State
        toolCards.forEach((card) => {
            const isCurrent = card.dataset.toolCard === targetId;
            const badge = card.querySelector('[data-active-badge]');
            if (isCurrent) {
                card.className = 'admin-tool-card text-left rounded-2xl border-2 border-forest-900 bg-green-50/80 p-5 shadow-md ring-2 ring-forest-900/10 transition-all flex flex-col justify-between transform scale-[1.01]';
                if (badge) {
                    badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-forest-900 text-white flex items-center gap-1 shadow-xs';
                    badge.innerHTML = '<i data-feather="check" class="w-3 h-3"></i> Đang hiển thị';
                }
            } else {
                card.className = 'admin-tool-card text-left rounded-2xl border border-gray-200 bg-white/70 p-5 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between';
                if (badge) {
                    badge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500';
                    badge.textContent = 'Bấm để chọn';
                }
            }
        });

        // 3. Update Tab Buttons Active State
        toolTabs.forEach((tab) => {
            const isCurrent = tab.dataset.toolTab === targetId;
            if (isCurrent) {
                tab.className = 'admin-tab-btn px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 shrink-0 bg-forest-900 text-white shadow-sm';
            } else {
                tab.className = 'admin-tab-btn px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 shrink-0 bg-white/80 text-gray-600 hover:text-forest-900 hover:bg-white border border-gray-200/60';
            }
        });

        // 4. Update URL Hash without unwanted jump
        if (window.location.hash !== '#' + targetId) {
            history.replaceState(null, '', '#' + targetId);
        }

        // 5. If community management, load posts if needed
        if (targetId === 'community-management' && communityPosts.length === 0) {
            loadCommunityPostsAdmin();
        }

        if (window.feather) feather.replace();

        // 6. Smooth scroll if requested
        if (shouldScroll) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const yOffset = -90;
                const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }

    toolCards.forEach((card) => {
        card.addEventListener('click', () => switchAdminTool(card.dataset.toolCard, true));
    });

    toolTabs.forEach((tab) => {
        tab.addEventListener('click', () => switchAdminTool(tab.dataset.toolTab, true));
    });

    statTargets.forEach((target) => {
        target.addEventListener('click', () => switchAdminTool(target.dataset.toolTarget, true));
    });

    const initialHash = (window.location.hash || '').replace('#', '');
    switchAdminTool(initialHash || 'herb-management', false);

    window.addEventListener('hashchange', () => {
        const hash = (window.location.hash || '').replace('#', '');
        switchAdminTool(hash, false);
    });

    // Reload all admin data button in System Settings
    document.getElementById('btnReloadAdminData')?.addEventListener('click', async () => {
        const btn = document.getElementById('btnReloadAdminData');
        btn.disabled = true;
        btn.innerHTML = '<i data-feather="loader" class="w-3.5 h-3.5 animate-spin"></i> Đang làm mới...';
        if (window.feather) feather.replace();
        try {
            await Promise.all([loadHerbs(), loadUsers(), loadCommunityPostsAdmin()]);
            alert('Đã làm mới toàn bộ dữ liệu quản trị thành công!');
        } catch (e) {
            alert('Lỗi làm mới dữ liệu: ' + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i data-feather="refresh-cw" class="w-3.5 h-3.5"></i> Làm mới toàn bộ dữ liệu';
            if (window.feather) feather.replace();
        }
    });

    // Tải trước bài viết cộng đồng cho số liệu thống kê
    loadCommunityPostsAdmin().catch(() => {});
});

