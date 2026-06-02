'use client';

import React from 'react';

export type ToastItem = { id: string; message: string; type?: 'info' | 'success' | 'error' };

export default function Toasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`max-w-sm rounded px-4 py-2 text-sm shadow ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-slate-700'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
