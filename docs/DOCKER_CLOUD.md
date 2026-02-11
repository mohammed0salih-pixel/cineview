# Docker + Cloud تشغيل المرحلة 4

## محليًا (Docker Compose)

1. انسخ ملفات البيئة:

- انسخ .env.example إلى .env
- انسخ .env.ai.example إلى .env.ai

2. أضف الأسرار (اختياري للمحلي):

- أنشئ مجلد secrets/ وضع داخله:
  - supabase_service_role_key
  - ai_engine_api_key (اختياري)
  - openai_api_key (اختياري)

3. شغّل الحاويات:

- استخدم docker-compose.yml لتشغيل app و ai-engine معًا.

## إدارة الأسرار

- التطوير المحلي: استخدم .env وملفات secrets/ (غير مُضافة للـ Git).
- الإنتاج:
  - AWS ECS/Secrets Manager أو GCP Secret Manager أو Vercel Environment Variables.
  - في حال استخدام Docker Secrets، اربط الملفات مع متغيرات \*\_FILE.

## ملاحظات السعة (Scalability)

- app: قابل للتوسعة أفقياً (stateless).
- ai-engine: قابل للتوسعة أفقياً مع Load Balancer.
- أضف كاش خارجي (Redis) إذا لزم لتقليل الحمل.

## توجيهات Cloud

- Vercel: شغّل app على Vercel، و ai-engine على ECS/Cloud Run.
- AWS: استخدم ECS/Fargate لكل خدمة مع ALB.
- GCP: استخدم Cloud Run لكل خدمة.
