// Global utilities, language system, and shared functions
(function() {
  // Language translations
  const translations = {
    en: {
      // Common
      'loading': 'Loading...',
      'error': 'An error occurred',
      'retry': 'Retry',
      'save': 'Save',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'edit': 'Edit',
      'confirm': 'Confirm',
      'add_to_cart': 'Add to Cart',
      'cart': 'Cart',
      'checkout': 'Checkout',
      'total': 'Total',
      'price': 'Price',
      'quantity': 'Quantity',
      'remove': 'Remove',
      'products': 'Products',
      'search': 'Search',
      'filters': 'Filters',
      'clear_filters': 'Clear Filters',
      'apply': 'Apply',
      'no_results': 'No products found',
      'logout': 'Logout',
      'login': 'Login',
      'signup': 'Signup',
      'welcome': 'Welcome',
      'dashboard': 'Dashboard',
      'home': 'Home',
      'back': 'Back',
      'continue_shopping': 'Continue Shopping',
      'proceed_payment': 'Proceed to Payment',
      'order_summary': 'Order Summary',
      'total_items': 'Total Items',
      'total_amount': 'Total Amount'
    },
    hi: {
      'loading': 'लोड हो रहा है...',
      'error': 'एक त्रुटि हुई',
      'retry': 'पुनः प्रयास करें',
      'save': 'सहेजें',
      'cancel': 'रद्द करें',
      'delete': 'हटाएं',
      'edit': 'संपादित करें',
      'confirm': 'पुष्टि करें',
      'add_to_cart': 'कार्ट में जोड़ें',
      'cart': 'कार्ट',
      'checkout': 'चेकआउट',
      'total': 'कुल',
      'price': 'कीमत',
      'quantity': 'मात्रा',
      'remove': 'हटाएं',
      'products': 'उत्पाद',
      'search': 'खोजें',
      'filters': 'फ़िल्टर',
      'clear_filters': 'फ़िल्टर हटाएं',
      'apply': 'लागू करें',
      'no_results': 'कोई उत्पाद नहीं मिला',
      'logout': 'लॉगआउट',
      'login': 'लॉगिन',
      'signup': 'साइनअप',
      'welcome': 'स्वागत है',
      'dashboard': 'डैशबोर्ड',
      'home': 'होम',
      'back': 'वापस',
      'continue_shopping': 'खरीदारी जारी रखें',
      'proceed_payment': 'भुगतान के लिए आगे बढ़ें',
      'order_summary': 'ऑर्डर सारांश',
      'total_items': 'कुल आइटम',
      'total_amount': 'कुल राशि'
    }
  };

  let currentLang = localStorage.getItem('lang') || 'en';

  window.__t = function(key) {
    return translations[currentLang][key] || translations.en[key] || key;
  };

  window.__setLang = function(lang) {
    if (lang !== 'en' && lang !== 'hi') return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    document.body.setAttribute('data-lang', lang);
    updateAllTexts();
  };

  function updateAllTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = window.__t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = window.__t(key);
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
  }

  // Loading spinner helper
  window.showLoading = function(container, message = null) {
    if (!container) return;
    const existing = container.querySelector('.loading-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      ${message ? `<p class="loading-message">${message}</p>` : ''}
    `;
    container.style.position = 'relative';
    container.appendChild(overlay);
    return overlay;
  };

  window.hideLoading = function(container) {
    if (!container) return;
    const overlay = container.querySelector('.loading-overlay');
    if (overlay) overlay.remove();
  };

  // Toast notifications
  window.showToast = function(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // Debounce utility
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Add these styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 100;
      border-radius: inherit;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top: 4px solid #2e7d32;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      transition: transform 0.3s ease;
      opacity: 0;
      pointer-events: none;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .toast-success { background: #2e7d32; }
    .toast-error { background: #c62828; }
    .toast-info { background: #1565c0; }
    .toast-icon {
      font-weight: bold;
      font-size: 18px;
    }
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .fade-in {
      animation: fadeIn 0.3s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-up {
      animation: slideUp 0.4s ease forwards;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .btn-ripple {
      position: relative;
      overflow: hidden;
    }
    .btn-ripple:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: translate(-50%, -50%);
      transition: width 0.4s ease, height 0.4s ease;
    }
    .btn-ripple:active:after {
      width: 200px;
      height: 200px;
    }
    button {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    button:hover {
      transform: translateY(-2px);
    }
    button:active {
      transform: translateY(0);
    }
    img {
      transition: transform 0.3s ease;
    }
    img:hover {
      transform: scale(1.02);
    }
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', () => {
    updateAllTexts();
  });
})();