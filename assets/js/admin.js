const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
let editingProductId = null;

function isAdminLogged() { return sessionStorage.getItem(EP_KEYS.admin) === '1'; }
function setAdminLogged(value) { value ? sessionStorage.setItem(EP_KEYS.admin, '1') : sessionStorage.removeItem(EP_KEYS.admin); }

function renderAdminShell() {
  document.querySelector('[data-admin-login]')?.classList.toggle('hidden', isAdminLogged());
  document.querySelector('[data-admin-panel]')?.classList.toggle('hidden', !isAdminLogged());
  if (isAdminLogged()) {
    renderDashboard();
    renderAdminProducts();
    renderAdminOrders();
    renderSettingsForm();
    renderCategoryOptions();
  }
}

function renderDashboard() {
  const holder = document.querySelector('[data-admin-kpis]');
  if (!holder) return;
  const products = getProducts();
  const orders = getOrders();
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = products.filter(product => Number(product.stock || 0) <= 5).length;
  holder.innerHTML = `
    <div class="kpi"><strong>${products.length}</strong><span>عدد المنتجات</span></div>
    <div class="kpi"><strong>${orders.length}</strong><span>عدد الطلبات</span></div>
    <div class="kpi"><strong>${money(totalSales)}</strong><span>إجمالي الطلبات</span></div>
    <div class="kpi"><strong>${lowStock}</strong><span>منتجات مخزون منخفض</span></div>
  `;
}

function renderCategoryOptions() {
  const select = document.querySelector('[name="category"]');
  if (!select) return;
  select.innerHTML = getCategories().map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

function productRow(product) {
  return `
    <tr>
      <td><b>${product.nameAr}</b><br><span class="small">${product.sku || '-'}</span></td>
      <td>${categoryName(product.category)}</td>
      <td>${money(product.price)}</td>
      <td>${product.stock || 0}</td>
      <td>${product.status === 'available' ? 'متوفر' : 'مخفي/نفد'}</td>
      <td>
        <button class="btn-outline" data-edit-product="${product.id}">تعديل</button>
        <button class="btn-outline" data-toggle-product="${product.id}">${product.status === 'available' ? 'إخفاء' : 'إظهار'}</button>
        <button class="btn-danger btn" data-delete-product="${product.id}">حذف</button>
      </td>
    </tr>
  `;
}

function renderAdminProducts() {
  const holder = document.querySelector('[data-admin-products]');
  if (!holder) return;
  const products = getProducts();
  holder.innerHTML = products.length ? `
    <div class="table-wrap"><table>
      <thead><tr><th>المنتج</th><th>الفئة</th><th>السعر</th><th>المخزون</th><th>الحالة</th><th>إجراءات</th></tr></thead>
      <tbody>${products.map(productRow).join('')}</tbody>
    </table></div>
  ` : '<div class="empty">لا توجد منتجات.</div>';
  document.querySelectorAll('[data-edit-product]').forEach(btn => btn.addEventListener('click', () => loadProductToForm(btn.dataset.editProduct)));
  document.querySelectorAll('[data-toggle-product]').forEach(btn => btn.addEventListener('click', () => toggleProduct(btn.dataset.toggleProduct)));
  document.querySelectorAll('[data-delete-product]').forEach(btn => btn.addEventListener('click', () => deleteProduct(btn.dataset.deleteProduct)));
}

function loadProductToForm(id) {
  const product = findProduct(id);
  if (!product) return;
  editingProductId = id;
  const form = document.querySelector('[data-product-form]');
  Object.entries(product).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      if (field.type === 'checkbox') field.checked = Boolean(value);
      else field.value = value ?? '';
    }
  });
  document.querySelector('[data-product-form-title]').textContent = 'تعديل منتج';
  document.querySelector('[data-cancel-edit]').classList.remove('hidden');
  form.scrollIntoView({ behavior: 'smooth' });
}

function clearProductForm() {
  editingProductId = null;
  const form = document.querySelector('[data-product-form]');
  form.reset();
  form.querySelector('[name="status"]').value = 'available';
  form.querySelector('[name="stock"]').value = '0';
  form.querySelector('[name="price"]').value = '0';
  form.querySelector('[name="cost"]').value = '0';
  document.querySelector('[data-product-form-title]').textContent = 'إضافة منتج';
  document.querySelector('[data-cancel-edit]').classList.add('hidden');
}

function saveProduct(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.nameAr || !data.sku) return toast('اسم المنتج و SKU مطلوبان');
  data.price = Number(data.price || 0);
  data.cost = Number(data.cost || 0);
  data.stock = Number(data.stock || 0);
  data.featured = form.querySelector('[name="featured"]').checked;
  const products = getProducts();
  if (editingProductId) {
    const index = products.findIndex(product => product.id === editingProductId);
    products[index] = { ...products[index], ...data };
    toast('تم تعديل المنتج');
  } else {
    products.unshift({ id: uid('p'), ...data });
    toast('تمت إضافة المنتج');
  }
  saveProducts(products);
  clearProductForm();
  renderAdminProducts();
  renderDashboard();
}

function toggleProduct(id) {
  const products = getProducts().map(product => product.id === id ? { ...product, status: product.status === 'available' ? 'hidden' : 'available' } : product);
  saveProducts(products);
  renderAdminProducts();
}

function deleteProduct(id) {
  const product = findProduct(id);
  if (!product) return;
  if (!confirm(`حذف المنتج: ${product.nameAr}؟`)) return;
  saveProducts(getProducts().filter(p => p.id !== id));
  saveCart(getCart().filter(item => item.productId !== id));
  renderAdminProducts();
  renderDashboard();
  toast('تم حذف المنتج');
}

function renderAdminOrders() {
  const holder = document.querySelector('[data-admin-orders]');
  if (!holder) return;
  const orders = getOrders();
  holder.innerHTML = orders.length ? `
    <div class="table-wrap"><table>
      <thead><tr><th>رقم الطلب</th><th>الزبون</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
      <tbody>${orders.map(order => `
        <tr>
          <td class="ltr">${order.id}</td>
          <td><b>${order.customer?.name || '-'}</b><br><span class="small">${order.customer?.phone || ''} - ${order.customer?.city || ''}</span></td>
          <td>${money(order.total)}</td>
          <td><select data-order-status="${order.id}">
            ${['new','processing','ready','delivered','cancelled'].map(status => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select></td>
          <td>${new Date(order.createdAt).toLocaleString('ar')}</td>
          <td><button class="btn-outline" data-order-view="${order.id}">تفاصيل</button></td>
        </tr>
      `).join('')}</tbody>
    </table></div>
  ` : '<div class="empty">لا توجد طلبات بعد.</div>';
  document.querySelectorAll('[data-order-status]').forEach(select => select.addEventListener('change', () => updateOrderStatus(select.dataset.orderStatus, select.value)));
  document.querySelectorAll('[data-order-view]').forEach(btn => btn.addEventListener('click', () => viewOrder(btn.dataset.orderView)));
}

function updateOrderStatus(id, status) {
  const orders = getOrders().map(order => order.id === id ? { ...order, status } : order);
  saveOrders(orders);
  toast('تم تحديث حالة الطلب');
}

function viewOrder(id) {
  const order = getOrders().find(o => o.id === id);
  if (!order) return;
  const lines = order.items.map(item => `- ${item.nameAr} × ${item.qty} = ${money(Number(item.price) * Number(item.qty))}`).join('\n');
  alert(`طلب ${order.id}\nالزبون: ${order.customer.name}\nالهاتف: ${order.customer.phone}\nالعنوان: ${order.customer.city} - ${order.customer.address}\n\n${lines}\n\nالإجمالي: ${money(order.total)}\nملاحظات: ${order.customer.notes || '-'}`);
}

function renderSettingsForm() {
  const form = document.querySelector('[data-settings-form]');
  if (!form) return;
  const settings = getSettings();
  Object.entries(settings).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) field.value = value ?? '';
  });
}

function saveSettingsForm(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  data.deliveryFee = Number(data.deliveryFee || 0);
  saveSettings(data);
  renderHeaderSettings();
  toast('تم حفظ الإعدادات');
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    categories: getCategories(),
    products: getProducts(),
    orders: getOrders(),
    settings: getSettings()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `electroparts-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (payload.categories) saveCategories(payload.categories);
      if (payload.products) saveProducts(payload.products);
      if (payload.orders) saveOrders(payload.orders);
      if (payload.settings) saveSettings(payload.settings);
      renderAdminShell();
      toast('تم استيراد البيانات');
    } catch (_) { toast('ملف غير صالح'); }
  };
  reader.readAsText(file);
}

function resetSeed() {
  if (!confirm('سيتم استبدال المنتجات والتصنيفات بالبيانات الافتراضية. هل أنت متأكد؟')) return;
  saveCategories(EP_DEFAULT_CATEGORIES);
  saveProducts(EP_DEFAULT_PRODUCTS);
  renderAdminShell();
  toast('تمت استعادة البيانات الافتراضية');
}

function bindAdmin() {
  document.querySelector('[data-login-form]')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (data.username === ADMIN_USER && data.password === ADMIN_PASS) {
      setAdminLogged(true);
      renderAdminShell();
    } else toast('بيانات الدخول غير صحيحة');
  });
  document.querySelector('[data-logout]')?.addEventListener('click', () => { setAdminLogged(false); renderAdminShell(); });
  document.querySelectorAll('[data-admin-tab]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`[data-section="${btn.dataset.adminTab}"]`)?.classList.add('active');
  }));
  document.querySelector('[data-product-form]')?.addEventListener('submit', saveProduct);
  document.querySelector('[data-cancel-edit]')?.addEventListener('click', clearProductForm);
  document.querySelector('[data-settings-form]')?.addEventListener('submit', saveSettingsForm);
  document.querySelector('[data-export]')?.addEventListener('click', exportData);
  document.querySelector('[data-import]')?.addEventListener('change', importData);
  document.querySelector('[data-reset-seed]')?.addEventListener('click', resetSeed);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeaderSettings();
  bindAdmin();
  renderAdminShell();
});
