"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutBrightVision() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-card/70 border border-border/30 rounded-xl shadow-lg p-8">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          العودة للأدوات
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-green-400 p-1 shadow-lg">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" fill="#fff" stroke="#0ea5e9" strokeWidth="2"/><path d="M13 27c2-6 12-6 14 0" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="17" r="2" fill="#0ea5e9"/><circle cx="24" cy="17" r="2" fill="#0ea5e9"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">BrightVision</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-900 text-xs font-semibold align-middle">اختراع</span>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground">عن الخدمة</h2>
        <p className="mb-4 text-muted-foreground text-sm">
          BrightVision هو نظام تحليل بصري ذكي يعتمد على الذكاء الاصطناعي لتحليل الصور والفيديوهات بدقة عالية وتقديم توصيات فورية لتحسين الجودة. تم تطويره ليكون أداة مبتكرة وسهلة الاستخدام للمصورين، المصممين، وصناع المحتوى.
        </p>
        <ul className="list-disc ml-6 text-sm text-foreground space-y-1 mb-4">
          <li>تحليل تلقائي للصور والفيديوهات (EXIF، الألوان، التقنية...)</li>
          <li>توصيات ذكية لتحسين التكوين، الإضاءة، والألوان</li>
          <li>تصدير التقارير كـ PDF أو JSON</li>
          <li>كل التحليل يتم محليًا للحفاظ على الخصوصية</li>
        </ul>
        <div className="text-xs text-muted-foreground mb-2">جميع الحقوق محفوظة © {new Date().getFullYear()} BrightVision</div>
        <div className="flex gap-2 mt-4">
          <Link href="/tools" className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">جرب الخدمة الآن</Link>
        </div>
      </div>
    </div>
  );
}
