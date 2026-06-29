const EP_KEYS = {
  products: 'ep_products_v1',
  categories: 'ep_categories_v1',
  cart: 'ep_cart_v1',
  orders: 'ep_orders_v1',
  settings: 'ep_settings_v1',
  admin: 'ep_admin_session_v1'
};

const money = value => `${Number(value || 0).toFixed(2)} ₪`;
const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch (_) { return fallback; }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedStore() {
  if (!localStorage.getItem(EP_KEYS.categories)) writeJSON(EP_KEYS.categories, EP_DEFAULT_CATEGORIES);
  if (!localStorage.getItem(EP_KEYS.products)) writeJSON(EP_KEYS.products, EP_DEFAULT_PRODUCTS);
  if (!localStorage.getItem(EP_KEYS.cart)) writeJSON(EP_KEYS.cart, []);
  if (!localStorage.getItem(EP_KEYS.orders)) writeJSON(EP_KEYS.orders, []);
  if (!localStorage.getItem(EP_KEYS.settings)) {
    writeJSON(EP_KEYS.settings, {
      storeName: 'ElectroParts Palestine',
      phone: '0590000000',
      whatsapp: '970590000000',
      city: 'Hebron / Palestine',
      deliveryFee: 20,
      currency: 'NIS'
    });
  }
}

function getProducts() { return readJSON(EP_KEYS.products, []); }
function saveProducts(products) { writeJSON(EP_KEYS.products, products); }
function getCategories() { return readJSON(EP_KEYS.categories, []); }
function saveCategories(categories) { writeJSON(EP_KEYS.categories, categories); }
function getCart() { return readJSON(EP_KEYS.cart, []); }
function saveCart(cart) { writeJSON(EP_KEYS.cart, cart); updateCartBadge(); }
function getOrders() { return readJSON(EP_KEYS.orders, []); }
function saveOrders(orders) { writeJSON(EP_KEYS.orders, orders); }
function getSettings() { return readJSON(EP_KEYS.settings, {}); }
function saveSettings(settings) { writeJSON(EP_KEYS.settings, settings); }

function findProduct(id) {
  return getProducts().find(product => product.id === id);
}

function addToCart(productId, qty = 1) {
  const product = findProduct(productId);
  if (!product || product.status !== 'available') return false;
  const cart = getCart();
  const row = cart.find(item => item.productId === productId);
  if (row) row.qty = Math.min(Number(row.qty) + Number(qty), Number(product.stock || 0));
  else cart.push({ productId, qty: Math.min(Number(qty), Number(product.stock || 0)) });
  saveCart(cart);
  return true;
}

function removeFromCart(productId) {
  saveCart(getCart().filter(item => item.productId !== productId));
}

function updateCartQty(productId, qty) {
  const product = findProduct(productId);
  const cart = getCart().map(item => {
    if (item.productId === productId) item.qty = Math.max(1, Math.min(Number(qty), Number(product?.stock || 1)));
    return item;
  });
  saveCart(cart);
}

function getCartDetails() {
  const products = getProducts();
  const items = getCart()
    .map(item => ({ ...item, product: products.find(product => product.id === item.productId) }))
    .filter(item => item.product);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price) * Number(item.qty)), 0);
  const delivery = items.length ? Number(getSettings().deliveryFee || 0) : 0;
  return { items, subtotal, delivery, total: subtotal + delivery };
}

function updateCartBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (!badge) return;
  const count = getCart().reduce((sum, item) => sum + Number(item.qty || 0), 0);
  badge.textContent = count;
}

function toast(message) {
  let node = document.querySelector('.toast');
  if (!node) {
    node = document.createElement('div');
    node.className = 'toast';
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add('show');
  setTimeout(() => node.classList.remove('show'), 2200);
}

seedStore();
window.addEventListener('DOMContentLoaded', updateCartBadge);
