'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import ImageUploader from './ImageUploader';

export default function MarkdownEditor({
  value,
  onChange,
  businessId,
}: {
  value: string;
  onChange: (next: string) => void;
  businessId: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Content (Markdown)</div>
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded p-2 bg-transparent" style={{ minHeight: 120 }} />

      <div className="mt-2 flex items-center justify-between">
        <ImageUploader businessId={businessId} onUpload={(url) => onChange(`${value}\n\n![](${url})`)} />
        <div className="text-sm text-white/60">Preview below</div>
      </div>

      <div className="mt-3 p-3 border rounded bg-white/5 prose max-w-none">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ReactMarkdown remarkPlugins={[remarkGfm as any]} rehypePlugins={[rehypeSanitize as any]}>{value || ''}</ReactMarkdown>
      </div>
    </div>
  );
}
