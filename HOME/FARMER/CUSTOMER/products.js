(function() {
  const API_ORIGIN = (typeof window !== 'undefined' && window.F2C_API_ORIGIN) ? window.F2C_API_ORIGIN : (function() {
    try { if (String(window.location.port) === '5000') return window.location.origin; } catch (e) {}
    return 'http://localhost:5000';
  })();
  const API_BASE = API_ORIGIN + '/api/products';
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const categoryFilter = document.getElementById('categoryFilter');
  const ownerFilter = document.getElementById('ownerFilter');
  const locationFilter = document.getElementById('locationFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  const pageSizeSel = document.getElementById('pageSize');

  let state = { page: 1, limit: parseInt(pageSizeSel.value, 10), totalPages: 1, total: 0, loading: false };

  // Language support
  if (document.getElementById('langEnBtn')) {
    document.getElementById('langEnBtn').addEventListener('click', () => window.__setLang('en'));
    document.getElementById('langHiBtn').addEventListener('click', () => window.__setLang('hi'));
  }

  function debounce(fn, ms) {
    let t;
    return function() {
      clearTimeout(t);
      const args = arguments;
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  function showSkeletons() {
    grid.innerHTML = '';
    for (let i = 0; i < state.limit; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-card';
      skeleton.innerHTML = '<div class="skeleton-img skeleton"></div><div class="skeleton-text skeleton"></div><div class="skeleton-text skeleton"></div>';
      grid.appendChild(skeleton);
    }
  }

  function addProductToCart(p) {
    let pid = String(p._id || p.id || '');
    if (!pid) {
      window.showToast('Cannot add to cart (missing id)', 'error');
      return;
    }
    let farmerName = (p.ownerId && p.ownerId.name) || 'Farmer';
    let farmerPhone = (p.ownerId && p.ownerId.phone) ? String(p.ownerId.phone).replace(/\D/g, '') : '';
    let img = p.image || '';
    if (img.startsWith('/uploads')) img = API_ORIGIN + img;
    try {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let existing = cart.find(i => String(i.productId) === pid);
      if (existing) {
        existing.quantity += 1;
        if (farmerPhone) existing.farmerPhone = farmerPhone;
      } else {
        cart.push({
          productId: pid,
          name: p.name || 'Product',
          price: (function(v){
            if (v === undefined || v === null) return 0;
            if (typeof v === 'number' && !isNaN(v)) return v;
            const s = String(v).replace(/[^\d.\-]/g, '');
            const n = parseFloat(s);
            return isNaN(n) ? 0 : n;
          })(p.price),
          image: img,
          farmer: farmerName,
          farmerPhone: farmerPhone,
          quantity: 1
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.showToast((p.name || 'Item') + ' added to cart!', 'success');
    } catch (e) {
      window.showToast('Could not update cart', 'error');
    }
  }

  function makeCard(p) {
    const card = document.createElement('article');
    card.className = 'card fade-in';
    let src = p.image || '';
    if (src.startsWith('/uploads')) src = API_ORIGIN + src;
    const img = document.createElement('img');
    img.src = src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="20">No image</text></svg>';
    img.alt = p.name || 'product image';
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'body';

    const title = document.createElement('h3');
    title.textContent = p.name || 'Untitled';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const farmerName = (p.ownerId && p.ownerId.name) || p.ownerName || 'Farmer';
    const tags = [];
    if (p.quantity != null) tags.push(`Qty: ${p.quantity} kg`);
    tags.push(`👨‍🌾 ${farmerName}`);
    if (p.category) tags.push(`📁 ${p.category}`);
    if (p.location) tags.push(`📍 ${p.location}`);
    if (p.notes) tags.push(`📝 ${p.notes}`);
    meta.textContent = tags.join(' • ');

    const price = document.createElement('div');
    price.className = 'price';
    price.innerHTML = p.price != null ? `<i class="fas fa-rupee-sign"></i> ${p.price} / kg` : 'Price N/A';

    const phoneRow = document.createElement('div');
    phoneRow.className = 'phone-row';
    let ph = (p.ownerId && p.ownerId.phone) ? String(p.ownerId.phone).trim() : '';
    if (ph) {
      let digits = ph.replace(/\D/g, '');
      phoneRow.innerHTML = `<i class="fas fa-phone-alt"></i> Farmer: <a href="tel:${digits}" class="phone-link">${ph}</a> <span style="color:#666;font-size:0.8rem">(call to order)</span>`;
    } else {
      phoneRow.innerHTML = '<i class="fas fa-phone-slash"></i> Farmer phone: not provided';
      phoneRow.style.color = '#888';
    }

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-cart btn-ripple';
    btn.innerHTML = '<i class="fas fa-cart-plus"></i> <span data-i18n="add_to_cart">Add to cart</span>';
    btn.addEventListener('click', () => addProductToCart(p));

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(price);
    body.appendChild(phoneRow);
    actions.appendChild(btn);
    body.appendChild(actions);
    card.appendChild(img);
    card.appendChild(body);

    return card;
  }

  async function fetchPage() {
    if (state.loading) return;
    state.loading = true;
    showSkeletons();

    const q = (searchInput.value || '').trim();
    const minPrice = (minPriceInput.value || '').trim();
    const maxPrice = (maxPriceInput.value || '').trim();
    const category = (categoryFilter.value || '').trim();
    const owner = (ownerFilter && ownerFilter.value || '').trim();
    const location = (locationFilter.value || '').trim();
    let url = `${API_BASE}?page=${state.page}&limit=${state.limit}&q=${encodeURIComponent(q)}`;
    if (minPrice) url += `&minPrice=${encodeURIComponent(minPrice)}`;
    if (maxPrice) url += `&maxPrice=${encodeURIComponent(maxPrice)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (owner) url += `&owner=${encodeURIComponent(owner)}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('network');
      const data = await res.json();
      state.total = data.total || 0;
      state.totalPages = data.totalPages || 1;
      render(data.products || []);
      updatePager();
    } catch (err) {
      // Fallback to local storage
      const local = localStorage.getItem('localProducts');
      const arr = local ? JSON.parse(local) : [];
      let filtered = arr;
      if (q) filtered = filtered.filter(p => ((p.name || '') + ' ' + (p.notes || '')).toLowerCase().includes(q.toLowerCase()));
      if (minPrice) filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
      if (category) filtered = filtered.filter(p => (p.category || '').toLowerCase().includes(category.toLowerCase()));
      if (owner) {
        const o = owner.toLowerCase();
        filtered = filtered.filter(p => String((p.ownerId && p.ownerId.name) || p.ownerName || '').toLowerCase().includes(o));
      }
      if (location) filtered = filtered.filter(p => (p.location || '').toLowerCase().includes(location.toLowerCase()));
      state.total = filtered.length;
      state.totalPages = Math.max(1, Math.ceil(state.total / state.limit));
      const start = (state.page - 1) * state.limit;
      const pageItems = filtered.slice(start, start + state.limit);
      render(pageItems);
      updatePager();
    } finally {
      state.loading = false;
    }
  }

  function render(list) {
    grid.innerHTML = '';
    if (!list || list.length === 0) {
      grid.innerHTML = `<div class="empty"><i class="fas fa-search"></i><p>${window.__t('no_results')}</p></div>`;
      return;
    }
    list.forEach(p => grid.appendChild(makeCard(p)));
  }

  function updatePager() {
    pageInfo.textContent = `${state.page} / ${state.totalPages}`;
    prevBtn.disabled = state.page <= 1;
    nextBtn.disabled = state.page >= state.totalPages;
    
    // Update i18n on buttons
    if (window.__t) {
      prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i> ${window.__t('prev') || 'Prev'}`;
      nextBtn.innerHTML = `${window.__t('next') || 'Next'} <i class="fas fa-chevron-right"></i>`;
    }
  }

  const scheduleFetch = debounce(() => { state.page = 1; fetchPage(); }, 300);
  
  searchInput.addEventListener('input', scheduleFetch);
  categoryFilter.addEventListener('input', scheduleFetch);
  if (ownerFilter) ownerFilter.addEventListener('input', scheduleFetch);
  locationFilter.addEventListener('input', scheduleFetch);
  minPriceInput.addEventListener('input', () => { state.page = 1; fetchPage(); });
  maxPriceInput.addEventListener('input', () => { state.page = 1; fetchPage(); });
  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    categoryFilter.value = '';
    if (ownerFilter) ownerFilter.value = '';
    locationFilter.value = '';
    state.page = 1;
    fetchPage();
  });
  prevBtn.addEventListener('click', () => { if (state.page > 1) { state.page--; fetchPage(); } });
  nextBtn.addEventListener('click', () => { if (state.page < state.totalPages) { state.page++; fetchPage(); } });
  pageSizeSel.addEventListener('change', () => { state.limit = parseInt(pageSizeSel.value, 10); state.page = 1; fetchPage(); });

  document.addEventListener('DOMContentLoaded', () => {
    // Parse URL query param for search
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    if (qParam && searchInput) searchInput.value = qParam;
    fetchPage();
  });
})();