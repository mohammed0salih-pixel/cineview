"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import type { AnalysisResult } from "@/lib/analysis/schema";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PitchDeckDocument } from "@/components/pitch-deck-pdf";

export default function AnalysisStudioClient() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId;
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      Promise.resolve().then(() => {
        setLoading(false);
        setError("يجب تحديد المشروع.");
      });
      return;
    }
    fetch(`/api/analysis/latest?project_id=${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.result) {
          setResult(data.result);
        } else {
          setError("لا توجد نتائج تحليل.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("حدث خطأ أثناء جلب التحليل.");
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return (
    <div className="p-8 text-center flex flex-col items-center gap-6">
      <Spinner />
      <div className="w-full max-w-md mx-auto">
        <div className="animate-pulse bg-gray-200 h-6 rounded mb-2" />
        <div className="animate-pulse bg-gray-200 h-6 rounded mb-2" />
        <div className="animate-pulse bg-gray-200 h-6 rounded mb-2" />
        <div className="animate-pulse bg-gray-200 h-32 rounded mb-2" />
      </div>
      <div>جاري التحميل...</div>
    </div>
  );
  if (error) return (
    <div className="p-8 text-center text-red-600">
      <div className="mb-4">{error}</div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded mr-2" onClick={() => router.push(`/projects/${projectId}`)}>الذهاب لصفحة المشروع</button>
      <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => router.push(`/projects/${projectId}/assets/new/analysis`)}>تشغيل تحليل جديد</button>
    </div>
  );
  if (!result) return (
    <div className="p-8 text-center flex flex-col items-center gap-6">
      <div className="mb-4 text-lg font-semibold text-gray-700">لا توجد نتيجة تحليل حالياً لهذا المشروع.</div>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => router.push(`/projects/${projectId}/assets/new/analysis`)}>
          تشغيل تحليل جديد
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => router.push(`/projects/${projectId}`)}>
          الذهاب لصفحة المشروع
        </button>
      </div>
      <div className="mt-6 text-gray-500 text-sm">يمكنك بدء تحليل جديد أو مراجعة المشروع مباشرة.</div>
    </div>
  );

  // عرض النتيجة الكاملة
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">نتيجة التحليل الأخيرة</h1>
      <div className="mb-4">
        <strong>المشروع:</strong> {result.projectId ?? "-"} <br />
        <strong>الملف:</strong> {result.assetId ?? "-"} <br />
        <strong>المستخدم:</strong> {result.userId ?? "-"} <br />
        <strong>تاريخ الإنشاء:</strong> {result.createdAt ?? "-"}
      </div>
      <div className="mb-4">
        <strong>تحليل بصري:</strong> {result.visual?.details ?? "-"} <br />
        <strong>درجة:</strong> {result.visual?.score ?? "-"}
      </div>
      <div className="mb-4">
        <strong>تحليل سينمائي:</strong> {result.cinematic?.genre ?? "-"} <br />
        <strong>المزاج:</strong> {result.cinematic?.mood ?? "-"}
      </div>
      <div className="flex gap-4 justify-center mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => router.push("/projects")}>العودة للمشاريع</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => {/* TODO: Run new analysis */}}>تشغيل تحليل جديد</button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded"
          onClick={() => {
            // Future: generate token and share link
            const shareUrl = `${window.location.origin}/analysis/share/${result.projectId}/${result.assetId}`;
            navigator.clipboard.writeText(shareUrl);
            alert("تم نسخ رابط المشاركة! (ميزة النسخة الخاصة قريبًا)");
          }}
        >
          مشاركة النتيجة
        </button>
        <div>
          {/* Export PDF Button */}
          <PDFDownloadLink
            document={<PitchDeckDocument />}
            fileName={`Analysis-${result.projectId}-${result.assetId}.pdf`}
            className="inline-flex"
          >
            {({ loading }) => (
              <button className="px-4 py-2 bg-red-600 text-white rounded" disabled={loading}>
                {loading ? "جاري التصدير..." : "تصدير PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
