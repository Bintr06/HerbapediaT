const API_BASE_URL = 'http://127.0.0.1:8000';
const GOOGLE_CLIENT_ID = '289763049496-ql91n06vqdqmsdp1j02j27na4kg31p4c.apps.googleusercontent.com';

function setAuthenticatedUser(token, username, displayName = username, role = 'user') {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', displayName);
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAdmin', String(role === 'admin'));
}

function clearAuthenticatedUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
}

function activateForm(formId) {
    const targetForm = document.getElementById(formId);
    if (!targetForm) {
        return;
    }
    document.querySelectorAll('.tab-btn').forEach((button) => {
        button.classList.toggle('active', button.dataset.target === formId);
    });
    document.querySelectorAll('.auth-form').forEach((form) => {
        form.classList.toggle('active', form.id === formId);
    });
}

function setFormError(formType, message) {
    const formId = `${formType}Form`;
    const errorElement = document.getElementById(`${formType}ApiError`);
    if (!errorElement) {
        return;
    }
    activateForm(formId);
    errorElement.textContent = message;
    errorElement.classList.toggle('hidden', !message);
}

function clearFormError(formType) {
    const errorElement = document.getElementById(`${formType}ApiError`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
}

async function requestJson(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, options);
    } catch {
        throw new Error('Không thể kết nối đến backend. Hãy kiểm tra API đang chạy tại cổng 8000.');
    }

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(body.detail || 'Yêu cầu không thành công.');
        error.status = response.status;
        throw error;
    }
    return body;
}

function validateCredentials(username, password) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(username)) {
        return 'Email không hợp lệ.';
    }
    if (password.length < 8) {
        return 'Mật khẩu phải có ít nhất 8 ký tự.';
    }
    if (new TextEncoder().encode(password).length > 72) {
        return 'Mật khẩu không được vượt quá 72 byte.';
    }
    return '';
}

function setLoading(button, loading, loadingText) {
    button.disabled = loading;
    button.setAttribute('aria-busy', String(loading));
    const label = button.querySelector('.button-label');
    if (label) {
        if (!label.dataset.defaultText) {
            label.dataset.defaultText = label.textContent;
        }
        label.textContent = loading ? loadingText : label.dataset.defaultText;
    } else {
        button.dataset.defaultText ||= button.textContent;
        button.textContent = loading ? loadingText : button.dataset.defaultText;
    }
}

async function handleGoogleCredential(response) {
    setFormError('login', '');
    try {
        const result = await requestJson('/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
        });
        setAuthenticatedUser(result.access_token, result.username, result.username, result.role);
        window.location.assign('index.html');
    } catch (error) {
        setFormError('login', error.message);
    }
}

function initializeGoogleSignIn(attempt = 0) {
    const button = document.getElementById('googleButton');
    if (!button) {
        return;
    }
    if (!window.google?.accounts?.id) {
        if (attempt < 20) {
            window.setTimeout(() => initializeGoogleSignIn(attempt + 1), 250);
        } else {
            setFormError('login', 'Không tải được dịch vụ đăng nhập Google.');
        }
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential
    });
    google.accounts.id.renderButton(button, {
        theme: 'outline',
        size: 'large',
        width: 350,
        text: 'signin_with',
        shape: 'pill'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activateForm(button.dataset.target);
            clearFormError('login');
            clearFormError('register');
        });
    });

    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        setFormError('login', '');

        const username = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPass').value;
        const validationError = validateCredentials(username, password);
        if (validationError) {
            setFormError('login', validationError);
            return;
        }

        const submitButton = loginForm.querySelector('button[type="submit"]');
        setLoading(submitButton, true, 'Đang đăng nhập...');
        try {
            const result = await requestJson('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            setAuthenticatedUser(result.access_token, result.username, result.username, result.role);
            window.location.assign('index.html');
        } catch (error) {
            setFormError('login', error.message);
        } finally {
            setLoading(submitButton, false);
        }
    });

    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        setFormError('register', '');

        const displayName = document.getElementById('registerName').value.trim();
        const username = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPass').value;
        const confirmation = document.getElementById('registerPassConfirm').value;
        const validationError = validateCredentials(username, password);

        if (!displayName) {
            setFormError('register', 'Vui lòng nhập họ và tên.');
            return;
        }
        if (validationError) {
            setFormError('register', validationError);
            return;
        }
        if (password !== confirmation) {
            setFormError('register', 'Mật khẩu nhập lại không khớp.');
            return;
        }

        const submitButton = registerForm.querySelector('button[type="submit"]');
        setLoading(submitButton, true, 'Đang tạo tài khoản...');
        try {
            await requestJson('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, display_name: displayName })
            });
            const result = await requestJson('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            setAuthenticatedUser(result.access_token, result.username, displayName, result.role);
            window.location.assign('index.html');
        } catch (error) {
            setFormError(
                'register',
                error.status === 409
                    ? 'Email này đã được sử dụng. Vui lòng dùng email khác.'
                    : error.message
            );
        } finally {
            setLoading(submitButton, false);
        }
    });

    document.getElementById('forgotPasswordButton')?.addEventListener('click', () => {
        setFormError('login', 'Chức năng khôi phục mật khẩu chưa được bật.');
    });

    initializeGoogleSignIn();
});
