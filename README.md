# ElectroParts Palestine - متجر قطع إلكترونية

نسخة MVP ثابتة قابلة للنشر على GitHub Pages.

## المزايا الحالية

- واجهة متجر عربية RTL.
- تصنيفات منتجات.
- بحث مباشر.
- إضافة منتجات إلى السلة.
- صفحة سلة وتعديل كميات.
- صفحة إتمام طلب Checkout.
- حفظ الطلبات داخل المتصفح LocalStorage.
- لوحة مدير لإضافة وتعديل وحذف المنتجات.
- تحديث حالة الطلبات.
- إعدادات المتجر: الاسم، الهاتف، واتساب، المدينة، التوصيل.
- تصدير واستيراد نسخة احتياطية JSON.

## بيانات دخول المدير التجريبية

- Username: `admin`
- Password: `admin123`

> تنبيه: هذه بيانات تجريبية فقط. لا تعتمد لوحة المدير الحالية كحماية إنتاجية لأنها تعمل بالكامل من جهة المتصفح. عند التشغيل الحقيقي يجب ربط Backend مثل Laravel/MySQL أو Google Apps Script + Google Sheets أو Firebase.

## تشغيل محلي

افتح الملف:

```bash
index.html
```

أو استخدم VS Code Extension مثل Live Server.

## النشر على GitHub Pages

1. أنشئ Repository جديد على GitHub.
2. ارفع ملفات المشروع.
3. ادخل إلى Settings.
4. اختر Pages.
5. Source: Deploy from a branch.
6. Branch: `main` و Folder: `/root`.
7. اضغط Save.

سيظهر رابط الموقع بعد تفعيل GitHub Pages.

## أوامر Git المقترحة

```bash
git init
git add .
git commit -m "Initial ElectroParts Palestine store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/electroparts-palestine.git
git push -u origin main
```

## الملفات الأساسية

```text
index.html              الصفحة الرئيسية
cart.html               السلة
checkout.html           إتمام الطلب
admin.html              لوحة المدير
assets/css/style.css    التصميم
assets/js/data.js       بيانات أولية
assets/js/storage.js    التخزين والسلة
assets/js/app.js        واجهة المتجر
assets/js/cart.js       منطق السلة
assets/js/checkout.js   منطق الطلبات
assets/js/admin.js      لوحة المدير
```

## التطوير القادم المقترح

- ربط المنتجات والطلبات مع Google Sheets.
- رفع صور المنتجات من لوحة المدير بدل رابط الصورة.
- حسابات زبائن.
- بوابة دفع PalPay / Jawwal Pay / Bank of Palestine.
- لوحة صلاحيات متعددة: admin / manager / sales / inventory.
- إدارة مخزون متقدمة مع حركات دخول وخروج.
