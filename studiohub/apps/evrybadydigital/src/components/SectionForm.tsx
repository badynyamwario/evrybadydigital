'use client';

import { useState } from 'react';
import type { Business, SectionFormState, FooterLink } from '@/types';
import type { SectionRecord } from '@/services/sectionService';
import MarkdownEditor from '@/components/MarkdownEditor';

interface SectionFormProps {
  selectedBusiness: Business;
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  sectionForm: SectionFormState;
  setSectionForm: React.Dispatch<React.SetStateAction<SectionFormState>>;
  onSave: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  formError: string | null;
  setFormError: (err: string | null) => void;
  visibleSections: SectionRecord[];
  onDelete: (id: string) => Promise<void>;
}

export default function SectionForm({
  selectedBusiness,
  selectedPage,
  setSelectedPage,
  sectionForm,
  setSectionForm,
  onSave,
  saving,
  formError,
  setFormError,
  visibleSections,
  onDelete,
}: SectionFormProps) {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  const setPage = (page: string) => {
    setSelectedPage(page);
    setSectionForm((s) => ({ ...s, page_slug: page }));
  };

  const updateMetadata = (key: string, value: string) => {
    setSectionForm((s) => ({
      ...s,
      metadata: { ...(s.metadata ?? {}), [key]: value },
    }));
  };

  const metaStr = (key: string): string => {
    const v = sectionForm.metadata?.[key];
    return typeof v === 'string' ? v : '';
  };

  const getFooterLinks = (): FooterLink[] => {
    const raw = sectionForm.metadata?.links;
    if (Array.isArray(raw)) return raw as FooterLink[];
    if (typeof raw === 'string' && raw.trim()) {
      return raw.split(',').map((l) => {
        const parts = l.split('|').map((p) => p.trim());
        return { label: parts[0] ?? l, href: parts[1] ?? '#' };
      });
    }
    return [];
  };

  const setFooterLinks = (next: FooterLink[]) => {
    setSectionForm((s) => ({ ...s, metadata: { ...(s.metadata ?? {}), links: next } }));
  };

  return (
    <div className="bg-white/5 p-4 rounded">
      <h3 className="font-medium mb-2">Sections for {selectedBusiness.name}</h3>
      <form className="space-y-3" onSubmit={onSave} aria-describedby="section-form-error">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label className="block">
            <span className="text-sm">Title</span>
            <input 
              aria-required="true" 
              value={sectionForm.title ?? ''} 
              onChange={(e) => setSectionForm(s => ({ ...s, title: e.target.value }))} 
              className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black" 
            />
          </label>
          <label className="block">
            <span className="text-sm">Section Key</span>
            <input 
              value={sectionForm.section_key ?? ''} 
              onChange={(e) => setSectionForm(s => ({ ...s, section_key: e.target.value }))} 
              className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black" 
            />
          </label>
          <label className="block">
            <span className="text-sm">Page</span>
            <select 
              value={selectedPage} 
              onChange={(e) => setPage(e.target.value)} 
              className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black"
            >
              <option value="home">home</option>
              <option value="about">about</option>
              <option value="services">services</option>
              <option value="work">work</option>
              <option value="global">global</option>
              <option value="contact">contact</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm">Position</span>
            <input 
              type="number" 
              value={sectionForm.position ?? 0} 
              onChange={(e) => setSectionForm(s => ({ ...s, position: Number(e.target.value) }))} 
              className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black" 
            />
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Content</label>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setPreviewMode('edit')} 
                className={`px-2 py-1 rounded ${previewMode === 'edit' ? 'bg-white/10' : ''}`}
              >
                Edit
              </button>
              <button 
                type="button" 
                onClick={() => setPreviewMode('preview')} 
                className={`px-2 py-1 rounded ${previewMode === 'preview' ? 'bg-white/10' : ''}`}
              >
                Preview
              </button>
            </div>
          </div>
          <div className="mt-2 text-black">
            <MarkdownEditor 
              value={sectionForm.content ?? ''} 
              onChange={(next) => setSectionForm(s => ({ ...s, content: next }))} 
              businessId={selectedBusiness.id} 
            />
          </div>
        </div>

        <label className="block">
          <span className="text-sm">Subtitle</span>
          <input 
            value={sectionForm.subtitle ?? ''} 
            onChange={(e) => setSectionForm(s => ({ ...s, subtitle: e.target.value }))} 
            className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black" 
          />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label className="block">
            <span className="text-sm">CTA label</span>
            <input 
              value={sectionForm.cta_text ?? ''} 
              onChange={(e) => setSectionForm(s => ({ ...s, cta_text: e.target.value }))} 
              className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black" 
          />
          </label>
          <label className="block">
            <span className="text-sm">CTA URL</span>
            <input 
              value={sectionForm.cta_url ?? ''} 
              onChange={(e) => setSectionForm(s => ({ ...s, cta_url: e.target.value }))} 
              className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 text-black" 
            />
          </label>
        </div>

        {/* Hero Metadata Conditional block */}
        {sectionForm.section_key === 'hero' && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 mt-4">
            <h4 className="mb-3 text-sm font-semibold text-white">Hero metadata</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm">Top badge text</span>
                <input value={metaStr('label')} onChange={(e) => updateMetadata('label', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 text-black" />
              </label>
              <label className="block">
                <span className="text-sm">Hero image URL</span>
                <input value={metaStr('image_url')} onChange={(e) => updateMetadata('image_url', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 text-black" />
              </label>
              <label className="block">
                <span className="text-sm">Primary CTA label</span>
                <input value={metaStr('primary_cta')} onChange={(e) => updateMetadata('primary_cta', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 text-black" />
              </label>
              <label className="block">
                <span className="text-sm">Primary CTA href</span>
                <input value={metaStr('primary_href')} onChange={(e) => updateMetadata('primary_href', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 text-black" />
              </label>
            </div>
          </div>
        )}

        {/* Footer Metadata Conditional block */}
        {sectionForm.section_key === 'footer' && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 mt-4">
            <h4 className="mb-3 text-sm font-semibold text-white">Footer metadata</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm">Brand blurb</span>
                <input value={metaStr('brand_blurb')} onChange={(e) => updateMetadata('brand_blurb', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 text-black" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm">Footer links</span>
                <div className="space-y-2 mt-2">
                  {getFooterLinks().map((l, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input 
                        value={l.label} 
                        onChange={(e) => {
                          const current = getFooterLinks();
                          const next = current.map((item, idx) => idx === i ? { ...item, label: e.target.value } : item);
                          setFooterLinks(next);
                        }} 
                        placeholder="Label" 
                        className="flex-1 border rounded px-2 py-2 text-black" 
                      />
                      <input 
                        value={l.href} 
                        onChange={(e) => {
                          const current = getFooterLinks();
                          const next = current.map((item, idx) => idx === i ? { ...item, href: e.target.value } : item);
                          setFooterLinks(next);
                        }} 
                        placeholder="URL" 
                        className="flex-1 border rounded px-2 py-2 text-black" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setFooterLinks(getFooterLinks().filter((_, idx) => idx !== i))} 
                        className="px-2 py-2 bg-red-600 text-white rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => setFooterLinks([...getFooterLinks(), { label: 'New link', href: '#' }])} 
                    className="px-3 py-2 bg-[#f7e7a6] text-[#0a1e0a] rounded mt-2"
                  >
                    Add link
                  </button>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-4">
          <button 
            type="submit" 
            disabled={saving} 
            className="bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save section'}
          </button>
          <button 
            type="button" 
            onClick={() => setSectionForm({ title: '', page_slug: selectedPage, section_key: '', subtitle: '', content: '', position: 0, cta_text: '', cta_url: '', metadata: {} })} 
            className="px-3 py-2 border rounded"
          >
            Reset
          </button>
        </div>
      </form>
      
      <div id="section-form-error" role="status" aria-live="polite" className="mt-2 text-sm text-red-400">
        {formError}
      </div>

      <div className="mt-6">
        <h4 className="font-medium">Existing sections</h4>
        <ul className="mt-2 space-y-2">
          {visibleSections.length === 0 && <li className="text-sm text-white/70">No sections yet for this page</li>}
          {visibleSections.map((s) => (
            <li key={s.id} className="flex items-start justify-between border rounded p-2 bg-white/5">
              <div>
                <div className="font-semibold text-sm text-white">{s.title}</div>
                <div className="text-xs text-white/60">{s.page_slug} · key: {s.section_key} · pos: {s.position}</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedPage(s.page_slug || 'home');
                    setSectionForm({
                      title: s.title,
                      page_slug: s.page_slug,
                      section_key: s.section_key,
                      subtitle: s.subtitle ?? '',
                      content: s.content ?? '',
                      position: s.position ?? 0,
                      cta_text: s.cta_text ?? '',
                      cta_url: s.cta_url ?? '',
                      metadata: s.metadata ?? {},
                      id: s.id,
                    });
                  }} 
                  className="px-2 py-1 border rounded text-xs"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(s.id)} 
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}