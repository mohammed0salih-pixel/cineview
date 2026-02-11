# Stage 5: UX & Design

## الهدف

واجهة تشرح القرار للمستخدم وتوضح:

- لماذا هذا القرار؟
- ماذا سيحدث لاحقًا؟

## ما تم تنفيذه

- إضافة أقسام Explainability داخل تجربة القرار.
- مسارين واضحين: **Why this decision** و **What happens next**.

## Design Tokens

- اعتمد على `design-tokens.json` لتغذية Figma أو نظام التصميم.
- حافظ على ربط القيم مع Tokens في CSS داخل `app/globals.css`.

## المطلوب في Figma

- Decision Detail: بطاقة قرار + rationale + next actions.
- Comparison View: مقارنة نسختين مع فروقات واضحة.
- Export Preview: معاينة جاهزة قبل التصدير.

## ملاحظات للبراءة

شرح القرار للمستخدم يرفع القيمة القانونية ويزيد قابلية التمييز.
