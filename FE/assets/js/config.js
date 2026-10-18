/**
 * HerbaPedia - Global Environment & API Configuration
 * 
 * Tự động nhận diện môi trường chạy để trỏ đúng API URL:
 * - Khi chạy Localhost (127.0.0.1 hoặc localhost hoặc mở file HTML trực tiếp):
 *     => Trỏ về 'http://127.0.0.1:8000'
 * - Khi deploy Production (Vercel, Netlify, Render, VPS...):
 *     => Tự động dùng PRODUCTION_API_URL hoặc cấu hình lưu trong localStorage
 */

(function (root) {
    'use strict';

    // 1. Kiểm tra URL tùy chỉnh được lưu trong localStorage (cho phép đổi nhanh khi test)
    const savedApiUrl = (function () {
        try {
            return typeof localStorage !== 'undefined' ? localStorage.getItem('HERBAPEDIA_API_URL') : null;
        } catch (e) {
            return null;
        }
    })();

    // 2. Nhận diện có đang chạy ở localhost / máy dev hay không
    const hostname = typeof window !== 'undefined' && window.location ? window.location.hostname : '';
    const protocol = typeof window !== 'undefined' && window.location ? window.location.protocol : '';
    const isLocalhost = Boolean(
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local') ||
        hostname === '' ||
        protocol === 'file:'
    );

    // 3. Khai báo endpoint
    const LOCAL_API_URL = 'http://127.0.0.1:8000';
    
    // Backend production trên Railway (Singapore edge server)
    const PRODUCTION_API_URL = 'https://herbapedia-production.up.railway.app';

    // Lựa chọn API URL phù hợp
    const rawApiUrl = savedApiUrl || (isLocalhost ? LOCAL_API_URL : PRODUCTION_API_URL);
    const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');

    const HerbaConfig = {
        API_BASE_URL: cleanApiUrl,
        isLocalhost: isLocalhost,

        /**
         * Tạo URL đầy đủ cho một endpoint API
         * @param {string} endpoint - Đường dẫn endpoint, ví dụ '/herbs' hoặc 'auth/login'
         * @returns {string} URL đầy đủ
         */
        apiUrl: function (endpoint) {
            const path = String(endpoint || '').startsWith('/') ? endpoint : `/${endpoint}`;
            return `${this.API_BASE_URL}${path}`;
        },

        /**
         * Cho phép đổi nhanh URL Backend trong Console (ví dụ khi test server phụ)
         * HerbaConfig.setApiUrl('https://my-backend.com')
         * HerbaConfig.setApiUrl(null) để reset về mặc định
         */
        setApiUrl: function (newUrl) {
            if (typeof localStorage === 'undefined') return;
            if (newUrl && typeof newUrl === 'string') {
                localStorage.setItem('HERBAPEDIA_API_URL', newUrl.trim());
                console.log(`[HerbaPedia] Đã cập nhật API Base URL thành: ${newUrl.trim()}`);
            } else {
                localStorage.removeItem('HERBAPEDIA_API_URL');
                console.log('[HerbaPedia] Đã reset API Base URL về mặc định.');
            }
            if (typeof window !== 'undefined' && window.location) {
                window.location.reload();
            }
        }
    };

    // Đưa vào window scope toàn cục
    root.HerbaConfig = HerbaConfig;
    root.API_BASE_URL = HerbaConfig.API_BASE_URL;

})(typeof window !== 'undefined' ? window : this);

