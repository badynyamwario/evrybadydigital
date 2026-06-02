'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { upsertSection, deleteSection as deleteSectionSvc, SectionRecord } from '@/services/sectionService';
import type { Session } from '@supabase/supabase-js';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownToasts from '@/components/Toasts';

type Business = { id: string; name: string; owner_id: string };
type SectionForm = Partial<SectionRecord> & { metadata?: Record<string, unknown> };

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s?.session ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      setBusinesses([]);
      return;
    }

    setLoading(true);
    fetch('/api/businesses', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then((r) => r.json())
      .then((json) => setBusinesses(json.businesses ?? []))
      .catch(() => setMessage('Failed to load businesses'))
      .finally(() => setLoading(false));
  }, [session]);

  // Section management state
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [sectionForm, setSectionForm] = useState<SectionForm>({ title: '', page_slug: 'home', section_key: '', subtitle: '', content: '', position: 0, cta_text: '', cta_url: '', metadata: {} });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  async function fetchSectionsForBusiness(bizId: string) {
    setLoading(true);
    try {
      const token = session?.access_token;
      const res = await fetch(`/api/sections?business_id=${encodeURIComponent(bizId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const json = await res.json();
      if (res.ok) setSections(json.sections ?? []);
      else setFormError(json.message || 'Unable to fetch sections');
    } catch (err) {
      setFormError('Unable to fetch sections');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  function selectBusiness(biz: Business | null) {
    setSelectedBusiness(biz);
    setSelectedPage('home');
    setSections([]);
    setSectionForm({ title: '', page_slug: 'home', section_key: '', subtitle: '', content: '', position: 0, cta_text: '', cta_url: '', metadata: {} });
    setFormError(null);
    if (biz?.id) fetchSectionsForBusiness(biz.id);
  }

  const visibleSections = sections
    .filter((s) => s.page_slug === selectedPage)
    .sort((a, b) => (Number(a.position ?? 0) - Number(b.position ?? 0)));

  function setPage(page: string) {
    setSelectedPage(page);
    setSectionForm((s) => ({ ...s, page_slug: page }));
  }

  function updateMetadata(key: string, value: string) {
    setSectionForm((s) => ({
      ...s,
      metadata: { ...(s.metadata ?? {}), [key]: value },
    }));
  }

  function validateSectionForm(f: SectionForm) {
    if (!f.title || f.title.trim().length < 2) return 'Title is required (min 2 chars)';
    if (!f.section_key || f.section_key.trim().length < 1) return 'Section key is required';
    if (!f.page_slug || f.page_slug.trim().length < 1) return 'Page slug is required';
    if (f.position != null && isNaN(Number(f.position))) return 'Position must be a number';
    if (f.cta_url && f.cta_url.trim()) {
      try { new URL(f.cta_url, 'http://localhost'); } catch (e) { return 'CTA URL is invalid'; }
    }
    return null;
  }

  async function handleSaveSection(e?: React.FormEvent) {
    e?.preventDefault();
    setFormError(null);
    if (!selectedBusiness) return setFormError('Select a business first');
    const v = validateSectionForm(sectionForm);
    if (v) return setFormError(v);
    // Optimistic create/update
    setSaving(true);
    const isUpdate = !!sectionForm.id;
    const tempId = isUpdate ? sectionForm.id : `temp-${Date.now()}`;
    const optimistic = { ...sectionForm, id: tempId, business_id: selectedBusiness.id };
    setSections((s) => {
      if (isUpdate) return s.map((x) => (x.id === optimistic.id ? { ...x, ...optimistic, _saving: true } : x));
      return [...s, { ...optimistic, _saving: true }];
    });
    try {
      const payload = { section: { ...sectionForm, business_id: selectedBusiness.id } };
      const saved = await upsertSection(payload);
      // replace temp entry with saved data
      setSections((s) => s.map((x) => (x.id === tempId ? saved : x)));
      setSectionForm({ title: '', page_slug: selectedPage, section_key: '', subtitle: '', content: '', position: 0, cta_text: '', cta_url: '', metadata: {} });
      pushToast('Section saved', 'success');
    } catch (err) {
      // rollback optimistic
      setSections((s) => s.filter((x) => x.id !== tempId));
      const msg = err instanceof Error ? err.message : String(err);
      setFormError(msg || 'Save failed');
      pushToast(msg || 'Save failed', 'error');
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }

  async function handleDeleteSection(id: string) {
    if (!selectedBusiness) return setFormError('Select a business first');
    if (!confirm('Delete this section?')) return;
    // Optimistic delete
    setSaving(true);
    const prev = sections;
    setSections((s) => s.filter((x) => x.id !== id));
    try {
      await deleteSectionSvc(id);
      pushToast('Section deleted', 'success');
    } catch (err) {
      setSections(prev);
      const msg = err instanceof Error ? err.message : String(err);
      setFormError(msg || 'Delete failed');
      pushToast(msg || 'Delete failed', 'error');
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }

  // Optimistic UI helpers + toasts
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'info' | 'success' | 'error' }>>([]);
  function pushToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    const t = { id: String(Date.now()) + Math.random().toString(36).slice(2, 8), message, type };
    setToasts((s) => [t, ...s]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 4000);
  }

  // Markdown is rendered by shared component below

  async function createBusiness(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) return setMessage('Enter name');
    setMessage(null);
    setLoading(true);
    const res = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ name: newName }),
    });
    const json = await res.json();
    if (!res.ok) setMessage(json.message || 'Failed');
    else {
      setBusinesses((b) => [...b, json.business]);
      setNewName('');
    }
    setLoading(false);
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08140d] text-white">
        <div className="max-w-md p-8">
          <p className="mb-4">You must <a href="/login" className="underline">sign in</a> to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08140d] text-white p-8">
      <div className="max-w-4xl">
        <h1 className="mb-4 text-2xl font-semibold">Admin dashboard</h1>
        <p className="mb-6 text-sm text-white/70">Signed in as {session.user?.email}</p>

        <form onSubmit={createBusiness} className="mb-6 flex gap-3">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New business name" className="flex-1 rounded-md border border-white/10 bg-transparent px-4 py-2" />
          <button disabled={loading} className="rounded-md bg-[#f7e7a6] px-4 py-2 text-[#0a1e0a]">Create</button>
        </form>

        {message ? <div className="mb-4 text-sm">{message}</div> : null}

        <section>
          <h2 className="mb-3 text-lg font-semibold">Your businesses</h2>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <ul className="space-y-3">
              {businesses.map((b) => (
                <li key={b.id} className="rounded-md border border-white/10 p-3">{b.name} — {b.id}</li>
              ))}
              {businesses.length === 0 ? <li className="text-sm text-white/70">No businesses yet.</li> : null}
            </ul>
          )}
        </section>
        {/* Sections management UI */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Manage sections</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="sr-only">Select business</span>
              <select aria-label="Select business" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2" onChange={(e) => {
                const id = e.target.value;
                const biz = businesses.find(b => b.id === id) ?? null;
                selectBusiness(biz);
              }} value={selectedBusiness?.id ?? ''}>
                <option value="">— Choose business —</option>
                {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </label>

            {selectedBusiness && (
              <div className="bg-white/5 p-4 rounded">
                <h3 className="font-medium mb-2">Sections for {selectedBusiness.name}</h3>
                <form className="space-y-3" onSubmit={handleSaveSection} aria-describedby="section-form-error">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-sm">Title</span>
                      <input aria-required="true" value={sectionForm.title} onChange={(e) => setSectionForm(s => ({ ...s, title: e.target.value }))} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm">Section Key</span>
                      <input value={sectionForm.section_key} onChange={(e) => setSectionForm(s => ({ ...s, section_key: e.target.value }))} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm">Page</span>
                      <select value={selectedPage} onChange={(e) => setPage(e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2">
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
                      <input type="number" value={sectionForm.position} onChange={(e) => setSectionForm(s => ({ ...s, position: Number(e.target.value) }))} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Content</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setPreviewMode('edit')} className={`px-2 py-1 rounded ${previewMode === 'edit' ? 'bg-white/10' : ''}`}>Edit</button>
                        <button type="button" onClick={() => setPreviewMode('preview')} className={`px-2 py-1 rounded ${previewMode === 'preview' ? 'bg-white/10' : ''}`}>Preview</button>
                      </div>
                    </div>
                    {/* Use MarkdownEditor component for editing and preview */}
                    <div className="mt-2">
                      {/* Lazy load client Markdown editor via dynamic import could be added later */}
                      <MarkdownEditor value={sectionForm.content} onChange={(next) => setSectionForm(s => ({ ...s, content: next }))} businessId={selectedBusiness.id} />
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-sm">Subtitle</span>
                    <input value={sectionForm.subtitle} onChange={(e) => setSectionForm(s => ({ ...s, subtitle: e.target.value }))} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-sm">CTA label</span>
                      <input value={sectionForm.cta_text} onChange={(e) => setSectionForm(s => ({ ...s, cta_text: e.target.value }))} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm">CTA URL</span>
                      <input value={sectionForm.cta_url} onChange={(e) => setSectionForm(s => ({ ...s, cta_url: e.target.value }))} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                    </label>
                  </div>

                  {sectionForm.section_key === 'hero' && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-white">Hero metadata</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm">Top badge text</span>
                          <input value={sectionForm.metadata?.label || ''} onChange={(e) => updateMetadata('label', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Hero image URL</span>
                          <input value={sectionForm.metadata?.image_url || ''} onChange={(e) => updateMetadata('image_url', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Primary CTA label</span>
                          <input value={sectionForm.metadata?.primary_cta || ''} onChange={(e) => updateMetadata('primary_cta', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Primary CTA href</span>
                          <input value={sectionForm.metadata?.primary_href || ''} onChange={(e) => updateMetadata('primary_href', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Secondary CTA label</span>
                          <input value={sectionForm.metadata?.secondary_cta || ''} onChange={(e) => updateMetadata('secondary_cta', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Secondary CTA href</span>
                          <input value={sectionForm.metadata?.secondary_href || ''} onChange={(e) => updateMetadata('secondary_href', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Feature 1 title</span>
                          <input value={sectionForm.metadata?.feature_a_title || ''} onChange={(e) => updateMetadata('feature_a_title', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Feature 1 detail</span>
                          <input value={sectionForm.metadata?.feature_a_detail || ''} onChange={(e) => updateMetadata('feature_a_detail', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Feature 2 title</span>
                          <input value={sectionForm.metadata?.feature_b_title || ''} onChange={(e) => updateMetadata('feature_b_title', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Feature 2 detail</span>
                          <input value={sectionForm.metadata?.feature_b_detail || ''} onChange={(e) => updateMetadata('feature_b_detail', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-sm">Featured case study title</span>
                          <input value={sectionForm.metadata?.featured_name || ''} onChange={(e) => updateMetadata('featured_name', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-sm">Featured case study description</span>
                          <input value={sectionForm.metadata?.featured_description || ''} onChange={(e) => updateMetadata('featured_description', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-sm">Featured badges (comma separated)</span>
                          <input value={([sectionForm.metadata?.featured_badge_1, sectionForm.metadata?.featured_badge_2, sectionForm.metadata?.featured_badge_3].filter(Boolean) as string[]).join(', ')} onChange={(e) => {
                            const [a, b, c] = e.target.value.split(',').map((value) => value.trim());
                            updateMetadata('featured_badge_1', a || '');
                            updateMetadata('featured_badge_2', b || '');
                            updateMetadata('featured_badge_3', c || '');
                          }} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Stat 1 value</span>
                          <input value={sectionForm.metadata?.stat_1 || ''} onChange={(e) => updateMetadata('stat_1', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Stat 1 label</span>
                          <input value={sectionForm.metadata?.stat_1_label || ''} onChange={(e) => updateMetadata('stat_1_label', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Stat 2 value</span>
                          <input value={sectionForm.metadata?.stat_2 || ''} onChange={(e) => updateMetadata('stat_2', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Stat 2 label</span>
                          <input value={sectionForm.metadata?.stat_2_label || ''} onChange={(e) => updateMetadata('stat_2_label', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                        </label>
                      </div>
                    </div>
                  )}

                    {sectionForm.section_key === 'footer' && (
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <h4 className="mb-3 text-sm font-semibold text-white">Footer metadata</h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block sm:col-span-2">
                            <span className="text-sm">Brand blurb</span>
                            <input value={sectionForm.metadata?.brand_blurb || ''} onChange={(e) => updateMetadata('brand_blurb', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                          </label>
                          <label className="block sm:col-span-2">
                            <span className="text-sm">Address</span>
                            <input value={sectionForm.metadata?.address || ''} onChange={(e) => updateMetadata('address', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                          </label>
                          <label className="block">
                            <span className="text-sm">Latitude</span>
                            <input value={sectionForm.metadata?.lat || ''} onChange={(e) => updateMetadata('lat', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                          </label>
                          <label className="block">
                            <span className="text-sm">Longitude</span>
                            <input value={sectionForm.metadata?.lon || ''} onChange={(e) => updateMetadata('lon', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                          </label>
                          <label className="block sm:col-span-2">
                            <span className="text-sm">Footer links (label|href, comma separated)</span>
                            <input value={sectionForm.metadata?.links || ''} onChange={(e) => updateMetadata('links', e.target.value)} className="mt-1 w-full border rounded px-2 py-2 focus:outline-none focus:ring-2" />
                          </label>
                        </div>
                      </div>
                    )}

                  <div className="flex items-center gap-2">
                    <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2">{saving ? 'Saving…' : 'Save section'}</button>
                    <button type="button" onClick={() => setSectionForm({ title: '', page_slug: selectedPage, section_key: '', subtitle: '', content: '', position: 0, cta_text: '', cta_url: '', metadata: {} })} className="px-3 py-2 border rounded">Reset</button>
                  </div>
                </form>
                <div id="section-form-error" role="status" aria-live="polite" className="mt-2 text-sm text-red-400">{formError}</div>

                <div className="mt-4">
                  <h4 className="font-medium">Existing sections</h4>
                  <ul className="mt-2 space-y-2">
                    {visibleSections.length === 0 && <li className="text-sm text-white/70">No sections yet for this page</li>}
                    {visibleSections.map((s) => (
                      <li key={s.id} className="flex items-start justify-between border rounded p-2 bg-white/2">
                        <div>
                          <div className="font-semibold text-sm text-white">{s.title}</div>
                          <div className="text-xs text-white/60">{s.page_slug} · key: {s.section_key} · pos: {s.position}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
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
                          }} className="px-2 py-1 border rounded">Edit</button>
                          <button onClick={() => handleDeleteSection(s.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
          {/* Toasts */}
          <MarkdownToasts toasts={toasts} />
      </div>
    </div>
  );
}
