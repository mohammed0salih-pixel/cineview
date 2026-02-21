"use client";
import React from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return (
    <div className="p-8 text-center text-red-600">
      <h2 className="text-xl font-bold mb-4">حدث خطأ غير متوقع</h2>
      <div className="mb-4">{error.message}</div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={reset}>
        إعادة المحاولة
      </button>
    </div>
  );
}
