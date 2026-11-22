/**
 * HerbaPedia - Global Environment & API Configuration
 * 
 * Cấu hình API cho môi trường local.
 */

(function (root) {
    'use strict';

    const LOCAL_API_URL = 'http://127.0.0.1:8000';

    const HerbaConfig = {
        LOCAL_API_URL: LOCAL_API_URL,
        API_BASE_URL: LOCAL_API_URL,

        /**
         * Tạo URL đầy đủ cho một endpoint API
         * @param {string} endpoint - Đường dẫn endpoint, ví dụ '/herbs' hoặc 'auth/login'
         * @returns {string} URL đầy đủ
         */
        apiUrl: function (endpoint) {
            const path = String(endpoint || '').startsWith('/') ? endpoint : `/${endpoint}`;
            return `${this.API_BASE_URL}${path}`;
        },

    };

    // Đưa vào window scope toàn cục
    root.HerbaConfig = HerbaConfig;
    root.API_BASE_URL = HerbaConfig.API_BASE_URL;

})(typeof window !== 'undefined' ? window : this);

