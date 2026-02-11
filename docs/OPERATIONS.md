# Stage 6: Automation & Scaling

## Cron Jobs

- Endpoint: /api/cron
- Auth: header `x-cron-secret` أو query `?token=`
- إعداد السر: `CRON_SECRET` (يدعم \*\_FILE)

## Observability

- استخدم `lib/logger.ts` لرسائل منظمة.
- اربط Sentry/Datadog في الإنتاج عند الحاجة.

## Logs & Metrics

- سجّل الأحداث الرئيسية: بدء تحليل، اكتمال تحليل، تصدير.
- استخدم `/api/metrics` لحفظ بيانات الكلفة والLatency.

## Scaling

- التطبيق stateless → توسعة أفقية.
- AI engine توسعة أفقية خلف Load Balancer.
- أضف Redis للكاش عند ارتفاع الحمل.
