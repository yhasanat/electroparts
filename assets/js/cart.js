function renderCart() {
  const holder = document.querySelector('[data-cart-table]');
  const summary = document.querySelector('[data-cart-summary]');
  if (!holder || !summary) return;
  const details = getCartDetails();
  if (!details.items.length) {
    holder.innerHTML = '<div class="empty">السلة فارغة حاليًا.</div>';
    summary.innerHTML = '<div class="summary-line total"><span>الإجمالي</span><strong>0.00 ₪</strong></div><a class="btn" href="index.html">تصفح المنتجات</a>';
    return;
  }
  holder.innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>المنتج</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th><th></th></tr></thead>
      <tbody>
      ${details.items.map(item => `
        <tr>
          <td><b>${item.product.nameAr}</b><br><span class="small">${item.product.sku}</span></td>
          <td>${money(item.product.price)}</td>
          <td><input class="qty-input" type="number" min="1" max="${item.product.stock}" value="${item.qty}" data-cart-qty="${item.productId}"></td>
          <td>${money(Number(item.product.price) * Number(item.qty))}</td>
          <td><button class="btn-outline" data-cart-remove="${item.productId}">حذف</button></td>
        </tr>
      `).join('')}
      </tbody>
    </table></div>
  `;
  summary.innerHTML = `
    <div class="summary-line"><span>المجموع الفرعي</span><b>${money(details.subtotal)}</b></div>
    <div class="summary-line"><span>التوصيل</span><b>${money(details.delivery)}</b></div>
    <div class="summary-line total"><span>الإجمالي</span><strong>${money(details.total)}</strong></div>
    <a class="btn" style="display:block;text-align:center" href="checkout.html">إتمام الطلب</a>
    <button class="btn-outline" style="width:100%;margin-top:8px" data-clear-cart>تفريغ السلة</button>
  `;
  document.querySelectorAll('[data-cart-qty]').forEach(input => {
    input.addEventListener('change', () => { updateCartQty(input.dataset.cartQty, input.value); renderCart(); });
  });
  document.querySelectorAll('[data-cart-remove]').forEach(btn => {
    btn.addEventListener('click', () => { removeFromCart(btn.dataset.cartRemove); renderCart(); toast('تم حذف المنتج'); });
  });
  document.querySelector('[data-clear-cart]')?.addEventListener('click', () => {
    if (confirm('هل تريد تفريغ السلة؟')) { saveCart([]); renderCart(); }
  });
}

document.addEventListener('DOMContentLoaded', () => { renderHeaderSettings(); renderCart(); });
