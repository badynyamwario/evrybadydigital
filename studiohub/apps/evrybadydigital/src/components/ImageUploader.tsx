'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ImageUploader({ businessId, onUpload }: { businessId: string; onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const bucket = 'section-content';
    const path = `${businessId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    try {
      if (!supabase) throw new Error('Client not initialized');
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {cacheControl: '3600', upsert: false});
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const url = data?.publicUrl ?? '';
      if (!url) throw new Error('No public URL returned');
      onUpload(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Upload failed');
    } finally {
      setUploading(false);
      // clear input value
      (e.target as HTMLInputElement).value = '';
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <span className="text-sm">Upload image</span>
      </label>
      {uploading && <span className="text-sm text-white/60">Uploading…</span>}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
}
