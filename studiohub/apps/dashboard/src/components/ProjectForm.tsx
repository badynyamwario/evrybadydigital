'use client';

import { useState, useEffect } from 'react';
import type { Project, ProjectFormData } from '@/types';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  project?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

const emptyForm: ProjectFormData = {
  name: '',
  description: null,
  status: 'active',
  client_name: null,
  start_date: null,
  end_date: null,
  budget: null,
  tags: [],
  thumbnail_url: null,
};

export default function ProjectForm({ mode, project, onSubmit, onCancel, saving }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [devUrl, setDevUrl] = useState('http://localhost:3000');
  const [recentDevUrls, setRecentDevUrls] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentDevUrls');
      if (stored) {
        setRecentDevUrls(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleOpenDevEnv = () => {
    if (devUrl) {
      const updated = [devUrl, ...recentDevUrls.filter(u => u !== devUrl)].slice(0, 5);
      setRecentDevUrls(updated);
      try {
        localStorage.setItem('recentDevUrls', JSON.stringify(updated));
      } catch (e) {}
      window.open(devUrl, '_blank');
    }
  };

  useEffect(() => {
    if (mode === 'edit' && project) {
      setForm({
        name: project.name,
        description: project.description,
        status: project.status,
        client_name: project.client_name,
        start_date: project.start_date,
        end_date: project.end_date,
        budget: project.budget,
        tags: project.tags ?? [],
        thumbnail_url: project.thumbnail_url,
      });
      setTagInput((project.tags ?? []).join(', '));
    }
  }, [mode, project]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'Name is required (min 2 chars)';
    if (form.budget !== null && form.budget < 0) e.budget = 'Budget must be positive';
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      e.end_date = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((f) => ({ ...f, tags }));
  };

  const removeTag = (index: number) => {
    const newTags = form.tags.filter((_, i) => i !== index);
    setForm((f) => ({ ...f, tags: newTags }));
    setTagInput(newTags.join(', '));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 animate-fade-in">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2">
          <label htmlFor="project-name" className="block text-xs font-medium text-white/50 mb-1.5">
            Project Name *
          </label>
          <input
            id="project-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Enter project name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Client */}
        <div>
          <label htmlFor="project-client" className="block text-xs font-medium text-white/50 mb-1.5">
            Client Name
          </label>
          <input
            id="project-client"
            type="text"
            value={form.client_name ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value || null }))}
            placeholder="Client name"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="project-status" className="block text-xs font-medium text-white/50 mb-1.5">
            Status
          </label>
          <select
            id="project-status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProjectFormData['status'] }))}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="project-description" className="block text-xs font-medium text-white/50 mb-1.5">
            Description
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || null }))}
            placeholder="Describe the project..."
            className="resize-none"
          />
        </div>

        {/* Start date */}
        <div>
          <label htmlFor="project-start" className="block text-xs font-medium text-white/50 mb-1.5">
            Start Date
          </label>
          <input
            id="project-start"
            type="date"
            value={form.start_date ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value || null }))}
          />
        </div>

        {/* End date */}
        <div>
          <label htmlFor="project-end" className="block text-xs font-medium text-white/50 mb-1.5">
            End Date
          </label>
          <input
            id="project-end"
            type="date"
            value={form.end_date ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value || null }))}
          />
          {errors.end_date && <p className="mt-1 text-xs text-red-400">{errors.end_date}</p>}
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="project-budget" className="block text-xs font-medium text-white/50 mb-1.5">
            Budget (£)
          </label>
          <input
            id="project-budget"
            type="number"
            step="0.01"
            min="0"
            value={form.budget ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value ? parseFloat(e.target.value) : null }))}
            placeholder="0.00"
          />
          {errors.budget && <p className="mt-1 text-xs text-red-400">{errors.budget}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="project-thumbnail" className="block text-xs font-medium text-white/50 mb-1.5">
            Thumbnail URL
          </label>
          <input
            id="project-thumbnail"
            type="url"
            value={form.thumbnail_url ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value || null }))}
            placeholder="https://..."
          />
        </div>

        {/* Tags */}
        <div className="sm:col-span-2">
          <label htmlFor="project-tags" className="block text-xs font-medium text-white/50 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            id="project-tags"
            type="text"
            value={tagInput}
            onChange={(e) => handleTagInputChange(e.target.value)}
            placeholder="web, design, branding"
          />
          {form.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.tags.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#3b82f6]/10 px-2.5 py-0.5 text-xs text-[#3b82f6]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="ml-0.5 text-[#3b82f6]/60 hover:text-[#3b82f6]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dev Environment Actions */}
        {mode === 'edit' && (
          <div className="sm:col-span-2 pt-4 mt-2 border-t border-white/10">
            <label htmlFor="dev-url" className="block text-xs font-medium text-white/50 mb-1.5">
              Development Environment URL
            </label>
            <div className="flex items-center gap-3">
              <input
                id="dev-url"
                type="url"
                list="recent-dev-urls"
                value={devUrl}
                onChange={(e) => setDevUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="flex-1"
              />
              <datalist id="recent-dev-urls">
                {recentDevUrls.map((url, idx) => (
                  <option key={idx} value={url} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={handleOpenDevEnv}
                className="whitespace-nowrap rounded-xl bg-purple-500/20 text-purple-400 px-4 py-2 text-sm font-medium transition hover:bg-purple-500/30"
              >
                Open Dev Env
              </button>
              <a
                href="http://localhost:3000/dashboard"
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap rounded-xl bg-emerald-500/20 text-emerald-400 px-4 py-2 text-sm font-medium transition hover:bg-emerald-500/30 flex items-center"
              >
                Open Dashboard
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          id="btn-submit-project"
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#3b82f6] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2563eb] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.6s linear infinite' }} />
              Saving...
            </span>
          ) : mode === 'create' ? 'Create Project' : 'Save Changes'}
        </button>
        <button
          id="btn-cancel-project"
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.04] hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
