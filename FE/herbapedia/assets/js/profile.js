const PROFILE_API_URL = 'http://127.0.0.1:8000';

function clearProfileSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    localStorage.removeItem('userPhone');
}

function showProfileMessage(message, isError = false) {
    const element = document.getElementById('profileMessage');
    element.textContent = message;
    element.className = isError
        ? 'rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600'
        : 'rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700';
}

async function profileRequest(path, options = {}) {
    const response = await fetch(`${PROFILE_API_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(body.detail || 'Không thể hoàn tất yêu cầu.');
        error.status = response.status;
        throw error;
    }
    return body;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.replace('auth.html');
        return;
    }

    const displayNameInput = document.getElementById('displayName');
    const phoneInput = document.getElementById('phone');
    const displayNameHeading = document.getElementById('profileDisplayName');
    const usernameElements = document.querySelectorAll('#profileUsername, #profileEmail');

    try {
        const user = await profileRequest('/auth/me');
        const displayName = user.display_name || '';
        phoneInput.value = user.phone || '';
        displayNameInput.value = displayName;
        localStorage.setItem('userName', displayName);
        document.getElementById('historyCount').textContent = user.history_count;
        document.getElementById('speciesCount').textContent = user.species_count;
        document.getElementById('registeredAt').textContent = user.created_at
            ? new Date(user.created_at).toLocaleDateString('vi-VN')
            : '--';
        if (user.avatar_url) {
            document.getElementById('profileAvatar').src = user.avatar_url;
        }
        displayNameHeading.textContent = displayName;
        usernameElements.forEach((element) => {
            element.textContent = user.username;
            if (element.tagName === 'INPUT') {
                element.value = user.username;
            }
        });
    } catch (error) {
        if (error.status === 401) {
            clearProfileSession();
            window.location.replace('auth.html');
            return;
        }
        showProfileMessage(error.message, true);
    }

    document.getElementById('profileForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const newName = displayNameInput.value.trim();
        const phone = phoneInput.value.trim();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        if (!newName) {
            showProfileMessage('Vui lòng nhập họ và tên.', true);
            return;
        }
        if (!currentPassword && !newPassword) {
            await profileRequest('/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: newName, phone })
            });
            localStorage.setItem('userName', newName);
            displayNameHeading.textContent = newName;
            showProfileMessage('Đã lưu thông tin cá nhân.');
            return;
        }
        if (!currentPassword || newPassword.length < 8) {
            showProfileMessage('Hãy nhập mật khẩu hiện tại và mật khẩu mới tối thiểu 8 ký tự.', true);
            return;
        }
        if (new TextEncoder().encode(newPassword).length > 72) {
            showProfileMessage('Mật khẩu mới không được vượt quá 72 byte.', true);
            return;
        }

        const submitButton = event.currentTarget.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        try {
            await profileRequest('/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
            await profileRequest('/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: newName, phone })
            });
            localStorage.setItem('userName', newName);
            displayNameHeading.textContent = newName;
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            showProfileMessage('Đã cập nhật hồ sơ và đổi mật khẩu thành công.');
        } catch (error) {
            if (error.status === 401) {
                clearProfileSession();
                window.location.replace('auth.html');
                return;
            }
            showProfileMessage(error.message, true);
        } finally {
            submitButton.disabled = false;
        }
    });

    document.getElementById('cancelProfile').addEventListener('click', () => {
        window.location.reload();
    });

    document.getElementById('profileLogout').addEventListener('click', () => {
        clearProfileSession();
        window.location.replace('auth.html');
    });

    const avatarInput = document.getElementById('avatarInput');
    document.getElementById('changeAvatarButton').addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', async () => {
        const file = avatarInput.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const user = await profileRequest('/auth/me/avatar', {
                method: 'POST',
                body: formData
            });
            document.getElementById('profileAvatar').src = user.avatar_url;
            showProfileMessage('Đã cập nhật ảnh đại diện.');
        } catch (error) {
            showProfileMessage(error.message, true);
        } finally {
            avatarInput.value = '';
        }
    });
});
