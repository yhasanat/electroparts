let activeCategory = 'all';
let searchTerm = '';

function categoryName(id) {
  return getCategories().find(cat => cat.id === id)?.name || id;
}

function renderHeaderSettings() {
  const settings = getSettings();
  document.querySelectorAll('[data-store-name]').forEach(el => el.textContent = settings.storeName || 'ElectroParts Palestine');
  document.querySelectorAll('[data-store-phone]').forEach(el => el.textContent = settings.phone || '');
  document.querySelectorAll('[data-store-city]').forEach(el => el.textContent = settings.city || '');
  const wa = document.querySelector('[data-whatsapp-link]');
  if (wa) wa.href = `https://wa.me/${settings.whatsapp || ''}`;
}

function renderCategories() {
  const holder = document.querySelector('[data-categories]');
  const chips = document.querySelector('[data-category-chips]');
  if (holder) {
    holder.innerHTML = getCategories().map(cat => `
      <button class="category-card" data-filter-category="${cat.id}">
        <span class="category-icon">${cat.icon || '📦'}</span>
        <strong>${cat.name}</strong>
      </button>
    `).join('');
  }
  if (chips) {
    chips.innerHTML = `
      <button class="chip ${activeCategory === 'all' ? 'active' : ''}" data-filter-category="all">الكل</button>
      ${getCategories().map(cat => `<button class="chip ${activeCategory === cat.id ? 'active' : ''}" data-filter-category="${cat.id}">${cat.name}</button>`).join('')}
    `;
  }
  document.querySelectorAll('[data-filter-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.filterCategory;
      renderProducts();
      renderCategories();
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function productCard(product) {
  const out = product.status !== 'available' || Number(product.stock) <= 0;
  return `
    <article class="product-card">
      <img class="product-img" src="${product.image || 'assets/img/placeholder.svg'}" alt="${product.nameAr}" loading="lazy">
      <div class="product-body">
        <div class="product-meta">
          <span>${categoryName(product.category)}</span>
          <span class="status ${out ? 'out' : ''}">${out ? 'نفد' : 'متوفر'}</span>
        </div>
        <h3 class="product-title">${product.nameAr}</h3>
        <p class="product-desc">${product.description || ''}</p>
        <div class="product-meta"><span>SKU: ${product.sku || '-'}</span><span>${product.voltage || ''}</span></div>
        <div class="row" style="justify-content:space-between;margin:12px 0;">
          <strong class="price">${money(product.price)}</strong>
          <span class="small">المخزون: ${product.stock || 0}</span>
        </div>
        <div class="product-actions">
          <button class="btn" data-add-cart="${product.id}" ${out ? 'disabled' : ''}>أضف للسلة</button>
          <button class="btn-outline" data-product-info="${product.id}">تفاصيل</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const holder = document.querySelector('[data-products]');
  if (!holder) return;
  const term = searchTerm.trim().toLowerCase();
  const products = getProducts().filter(product => {
    const categoryOk = activeCategory === 'all' || product.category === activeCategory;
    const searchOk = !term || [product.nameAr, product.nameEn, product.sku, product.description, product.interface]
      .join(' ').toLowerCase().includes(term);
    return categoryOk && searchOk;
  });
  holder.innerHTML = products.length ? products.map(productCard).join('') : '<div class="empty card">لا توجد منتجات مطابقة.</div>';
  bindProductButtons();
}

function bindProductButtons() {
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (addToCart(btn.dataset.addCart, 1)) toast('تمت إضافة المنتج إلى السلة');
      else toast('المنتج غير متوفر');
    });
  });
  document.querySelectorAll('[data-product-info]').forEach(btn => {
    btn.addEventListener('click', () => showProductInfo(btn.dataset.productInfo));
  });
}

function showProductInfo(productId) {
  const product = findProduct(productId);
  if (!product) return;
  const text = [
    `${product.nameAr}`,
    `English: ${product.nameEn || '-'}`,
    `SKU: ${product.sku || '-'}`,
    `السعر: ${money(product.price)}`,
    `الفئة: ${categoryName(product.category)}`,
    `الجهد: ${product.voltage || '-'}`,
    `الاتصال: ${product.interface || '-'}`,
    `التوافق: ${product.compatibility || '-'}`,
    '',
    product.description || ''
  ].join('\n');
  alert(text);
}

function initHome() {
  renderHeaderSettings();
  renderCategories();
  renderProducts();
  const search = document.querySelector('[data-search]');
  if (search) search.addEventListener('input', e => { searchTerm = e.target.value; renderProducts(); });
}

document.addEventListener('DOMContentLoaded', initHome);
