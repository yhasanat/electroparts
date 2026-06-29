function renderCheckoutSummary() {
  const summary = document.querySelector('[data-checkout-summary]');
  if (!summary) return;
  const details = getCartDetails();
  if (!details.items.length) {
    summary.innerHTML = '<div class="empty">لا يوجد منتجات في السلة.</div><a class="btn" href="index.html">العودة للمتجر</a>';
    document.querySelector('[data-place-order]')?.setAttribute('disabled', 'disabled');
    return;
  }
  summary.innerHTML = `
    ${details.items.map(item => `
      <div class="summary-line"><span>${item.product.nameAr} × ${item.qty}</span><b>${money(Number(item.product.price) * Number(item.qty))}</b></div>
    `).join('')}
    <div class="summary-line"><span>التوصيل</span><b>${money(details.delivery)}</b></div>
    <div class="summary-line total"><span>الإجمالي</span><strong>${money(details.total)}</strong></div>
  `;
}

function placeOrder(event) {
  event.preventDefault();
  const details = getCartDetails();
  if (!details.items.length) return toast('السلة فارغة');
  const form = new FormData(event.target);
  const customer = {
    name: form.get('name')?.trim(),
    phone: form.get('phone')?.trim(),
    city: form.get('city')?.trim(),
    address: form.get('address')?.trim(),
    notes: form.get('notes')?.trim(),
    paymentMethod: form.get('paymentMethod')
  };
  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    return toast('أدخل بيانات الزبون المطلوبة');
  }
  const order = {
    id: uid('ORD'),
    createdAt: new Date().toISOString(),
    status: 'new',
    customer,
    items: details.items.map(item => ({ productId: item.productId, sku: item.product.sku, nameAr: item.product.nameAr, price: item.product.price, qty: item.qty })),
    subtotal: details.subtotal,
    delivery: details.delivery,
    total: details.total
  };
  const products = getProducts();
  order.items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) product.stock = Math.max(0, Number(product.stock || 0) - Number(item.qty || 0));
  });
  saveProducts(products);
  saveOrders([order, ...getOrders()]);
  saveCart([]);
  const settings = getSettings();
  const msg = encodeURIComponent(`طلب جديد ${order.id}\nالاسم: ${customer.name}\nالهاتف: ${customer.phone}\nالمدينة: ${customer.city}\nالإجمالي: ${money(order.total)}`);
  const box = document.querySelector('[data-order-result]');
  box.innerHTML = `
    <div class="card" style="border-color:#86efac;background:#f0fdf4">
      <h2>تم تسجيل الطلب</h2>
      <p>رقم الطلب: <b class="ltr">${order.id}</b></p>
      <p>الإجمالي: <b>${money(order.total)}</b></p>
      <a class="btn-success btn" href="https://wa.me/${settings.whatsapp || ''}?text=${msg}" target="_blank">إرسال الطلب عبر واتساب</a>
      <a class="btn-outline" href="index.html">العودة للمتجر</a>
    </div>
  `;
  event.target.reset();
  renderCheckoutSummary();
  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeaderSettings();
  renderCheckoutSummary();
  document.querySelector('[data-checkout-form]')?.addEventListener('submit', placeOrder);
});
