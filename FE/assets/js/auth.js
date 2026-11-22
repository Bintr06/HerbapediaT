const API_BASE_URL = (window.HerbaConfig && window.HerbaConfig.API_BASE_URL) || window.API_BASE_URL || 'http://127.0.0.1:8000';
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
    const isForgot = formId === 'forgotForm';
    const authTabs = document.querySelector('.auth-tabs');
    const forgotHeader = document.getElementById('forgotHeader');

    if (authTabs) {
        authTabs.classList.toggle('hidden', isForgot);
    }
    if (forgotHeader) {
        forgotHeader.classList.toggle('hidden', !isForgot);
    }

    document.querySelectorAll('.tab-btn').forEach((button) => {
        button.classList.toggle('active', !isForgot && button.dataset.target === formId);
    });
    document.querySelectorAll('.auth-form').forEach((form) => {
        form.classList.toggle('active', form.id === formId);
    });

    if (window.feather) {
        window.feather.replace();
    }
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

function setForgotError(message) {
    const errEl = document.getElementById('forgotApiError');
    const succEl = document.getElementById('forgotApiSuccess');
    if (succEl) succEl.classList.add('hidden');
    if (errEl) {
        errEl.textContent = message;
        errEl.classList.toggle('hidden', !message);
    }
}

function setForgotSuccess(message) {
    const errEl = document.getElementById('forgotApiError');
    const succEl = document.getElementById('forgotApiSuccess');
    if (errEl) errEl.classList.add('hidden');
    if (succEl) {
        succEl.textContent = message;
        succEl.classList.toggle('hidden', !message);
    }
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

    let resendTimer = null;

    function startResendCooldown(seconds = 60) {
        const resendBtn = document.getElementById('btnResendOtp');
        if (!resendBtn) return;
        clearInterval(resendTimer);
        let remaining = seconds;
        resendBtn.disabled = true;
        resendBtn.textContent = `Gửi lại mã (${remaining}s)`;

        resendTimer = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                clearInterval(resendTimer);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Gửi lại mã';
            } else {
                resendBtn.textContent = `Gửi lại mã (${remaining}s)`;
            }
        }, 1000);
    }

    function openForgotPassword() {
        activateForm('forgotForm');
        setForgotError('');
        setForgotSuccess('');

        // Pre-fill email from login form if user already typed it
        const loginEmail = document.getElementById('loginEmail')?.value.trim();
        const forgotEmail = document.getElementById('forgotEmail');
        if (loginEmail && forgotEmail && !forgotEmail.value.trim()) {
            forgotEmail.value = loginEmail;
        }

        // Show step 1, hide step 2
        document.getElementById('forgotStep1')?.classList.remove('hidden');
        document.getElementById('forgotStep2')?.classList.add('hidden');
        document.getElementById('devOtpBox')?.classList.add('hidden');
        forgotEmail?.focus();
    }

    function backToLogin() {
        activateForm('loginForm');
        setForgotError('');
        setForgotSuccess('');
        clearFormError('login');
    }

    async function handleSendOtp(isResend = false) {
        setForgotError('');
        setForgotSuccess('');

        const emailInput = document.getElementById('forgotEmail');
        const email = emailInput?.value.trim().toLowerCase() || '';

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email || !emailPattern.test(email)) {
            setForgotError('Vui lòng nhập địa chỉ email hợp lệ.');
            emailInput?.focus();
            return;
        }

        const actionBtn = isResend ? document.getElementById('btnResendOtp') : document.getElementById('btnSendOtp');
        if (actionBtn && !isResend) {
            setLoading(actionBtn, true, 'Đang gửi mã...');
        }

        try {
            const result = await requestJson('/auth/forgot-password/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            // Transition to step 2
            document.getElementById('forgotStep1')?.classList.add('hidden');
            document.getElementById('forgotStep2')?.classList.remove('hidden');

            const sentEmailLabel = document.getElementById('sentEmailLabel');
            if (sentEmailLabel) {
                sentEmailLabel.textContent = email;
            }

            // If running in dev mode / without SMTP, show helper dev box
            const devOtpBox = document.getElementById('devOtpBox');
            const devOtpValue = document.getElementById('devOtpValue');
            const otpInput = document.getElementById('forgotOtp');
            if (result.dev_otp && devOtpBox && devOtpValue) {
                devOtpValue.textContent = result.dev_otp;
                devOtpBox.classList.remove('hidden');
                if (otpInput && !otpInput.value) {
                    otpInput.value = result.dev_otp;
                }
            } else if (devOtpBox) {
                devOtpBox.classList.add('hidden');
            }

            startResendCooldown(60);
            setForgotSuccess(result.message || 'Mã xác thực đã được gửi!');
            if (otpInput) {
                otpInput.focus();
            }
        } catch (error) {
            setForgotError(error.message);
        } finally {
            if (actionBtn && !isResend) {
                setLoading(actionBtn, false);
            }
        }
    }

    async function handleResetPassword(event) {
        event.preventDefault();
        setForgotError('');
        setForgotSuccess('');

        const email = document.getElementById('forgotEmail')?.value.trim().toLowerCase();
        const otpCode = document.getElementById('forgotOtp')?.value.trim();
        const newPassword = document.getElementById('forgotNewPass')?.value || '';
        const newPasswordConfirm = document.getElementById('forgotNewPassConfirm')?.value || '';

        if (!email) {
            setForgotError('Thiếu thông tin email.');
            return;
        }
        if (!otpCode || otpCode.length < 6) {
            setForgotError('Vui lòng nhập đủ 6 chữ số mã OTP.');
            document.getElementById('forgotOtp')?.focus();
            return;
        }
        if (newPassword.length < 8) {
            setForgotError('Mật khẩu mới phải có ít nhất 8 ký tự.');
            document.getElementById('forgotNewPass')?.focus();
            return;
        }
        if (new TextEncoder().encode(newPassword).length > 72) {
            setForgotError('Mật khẩu mới không được vượt quá 72 byte.');
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            setForgotError('Mật khẩu nhập lại không khớp.');
            document.getElementById('forgotNewPassConfirm')?.focus();
            return;
        }

        const submitBtn = document.getElementById('btnResetPass');
        if (submitBtn) {
            setLoading(submitBtn, true, 'Đang cập nhật...');
        }

        try {
            const result = await requestJson('/auth/forgot-password/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp_code: otpCode,
                    new_password: newPassword
                })
            });

            setForgotSuccess(result.message || 'Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...');

            // Automatically switch back to login with pre-filled email
            setTimeout(() => {
                backToLogin();
                const loginEmailInput = document.getElementById('loginEmail');
                const loginPassInput = document.getElementById('loginPass');
                if (loginEmailInput) {
                    loginEmailInput.value = email;
                }
                if (loginPassInput) {
                    loginPassInput.value = '';
                    loginPassInput.focus();
                }
            }, 1800);
        } catch (error) {
            setForgotError(error.message);
        } finally {
            if (submitBtn) {
                setLoading(submitBtn, false);
            }
        }
    }

    // Attach forgot password event listeners
    document.getElementById('forgotPasswordButton')?.addEventListener('click', openForgotPassword);
    document.getElementById('btnBackToLoginHeader')?.addEventListener('click', backToLogin);
    document.getElementById('btnCancelForgot')?.addEventListener('click', backToLogin);
    document.getElementById('btnSendOtp')?.addEventListener('click', () => handleSendOtp(false));
    document.getElementById('btnResendOtp')?.addEventListener('click', () => handleSendOtp(true));

    document.getElementById('forgotEmail')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendOtp(false);
        }
    });

    const forgotForm = document.getElementById('forgotForm');
    forgotForm?.addEventListener('submit', handleResetPassword);

    initializeGoogleSignIn();
});
