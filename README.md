# ورق العنب اللذيذ — فرع القاهرة

مشروع Full-Stack لموقع ورق العنب اللذيذ، مبني باستخدام React وVite وExpress وtRPC وMySQL/Drizzle. يحتوي على واجهة الطلب، لوحة المالك، تسجيل الدخول، إدارة المنيو والنصوص والصور وآراء العملاء.

## النشر على Vercel

1. اربط مستودع GitHub بهذا المشروع في Vercel.
2. استخدم الإعدادات التالية:

```text
Framework Preset: Vite
Install Command: pnpm install --frozen-lockfile
Build Command: pnpm build
Output Directory: dist/public
```

تمت إضافة `api/index.ts` لتشغيل Express كـ Vercel Serverless Function، و`vercel.json` لإعداد البناء والدالة الخلفية.

## متغيرات البيئة

أضف القيم الفعلية من إعدادات مشروع Manus أو مزود الخدمة إلى Vercel Project Settings → Environment Variables. لا تضعها في GitHub:

```text
DATABASE_URL
JWT_SECRET
VITE_APP_ID
OAUTH_SERVER_URL
OWNER_OPEN_ID
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI
ADMIN_EMAIL
```

لرفع الصور، يجب أيضًا أن تكون إعدادات التخزين المستخدمة في `server/storage.ts` متوفرة في بيئة Vercel أو استبدالها بتخزين S3 متوافق.

## التشغيل المحلي

```bash
pnpm install
pnpm dev
```

للتأكد من سلامة المشروع قبل النشر:

```bash
pnpm check
pnpm build
```
