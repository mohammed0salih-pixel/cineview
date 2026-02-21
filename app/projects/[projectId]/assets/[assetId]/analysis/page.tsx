"use client";
// صفحة التحليل القديمة: فقط Preview بسيط وزر للانتقال
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

export default function AssetAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId;
  useEffect(() => {
    router.replace(`/tools/analysis-studio?project_id=${projectId}`);
  }, [router, projectId]);
  return null;
}
