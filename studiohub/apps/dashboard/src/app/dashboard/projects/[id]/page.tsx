'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import TopBar from '@/components/TopBar';
import ProjectForm from '@/components/ProjectForm';
import StatusBadge from '@/components/StatusBadge';
import DeleteModal from '@/components/DeleteModal';
import { useDashboard } from '../../layout';
import type { Project, ProjectFormData } from '@/types';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, session } = useAuth();
  const { projects, updateProject, deleteProject, refetch } = useProjects();
  const { pushToast } = useDashboard();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setProject(found);
      setLoading(false);
    } else if (projects.length > 0) {
      // Try fetching directly if not in the list
      setLoading(false);
    }
  }, [id, projects]);

  // Also try direct fetch if project not found in hook
  useEffect(() => {
    if (project || !session?.access_token) return;
    fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.project) setProject(json.project);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, project, session]);

  const handleUpdate = async (data: ProjectFormData) => {
    setSaving(true);
    try {
      const updated = await updateProject(id, data);
      setProject(updated);
      setEditing(false);
      pushToast('Project updated', 'success');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      pushToast('Project deleted', 'success');
      router.push('/dashboard/projects');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopBar />
        <div className="flex items-center justify-center p-20">
          <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[#3b82f6]" style={{ animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <TopBar />
        <div className="flex flex-col items-center justify-center p-20 animate-fade-in">
          <p className="text-lg text-white/50 mb-4">Project not found</p>
          <Link href="/dashboard/projects" className="text-sm text-[#3b82f6] hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const budget = project.budget
    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(project.budget)
    : '—';

  return (
    <div>
      <TopBar />

      <div className="p-6 max-w-3xl">
        {/* Back link */}
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white/70 mb-6"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>

        {editing ? (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Edit Project</h2>
            <ProjectForm
              mode="edit"
              project={project}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              saving={saving}
            />
          </div>
        ) : (
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{project.name}</h2>
                {project.client_name && (
                  <p className="mt-1 text-sm text-white/40">{project.client_name}</p>
                )}
              </div>
              <StatusBadge status={project.status} />
            </div>

            {project.description && (
              <p className="text-sm text-white/60 leading-relaxed mb-6">{project.description}</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                <p className="text-xs text-white/40 mb-1">Budget</p>
                <p className="text-sm font-medium text-white">{budget}</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                <p className="text-xs text-white/40 mb-1">Timeline</p>
                <p className="text-sm font-medium text-white">
                  {project.start_date || '—'} → {project.end_date || '—'}
                </p>
              </div>
            </div>

            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#3b82f6]/8 px-3 py-1 text-xs font-medium text-[#3b82f6]/80 border border-[#3b82f6]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <button
                id="btn-edit-project"
                onClick={() => setEditing(true)}
                className="rounded-xl bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563eb]"
              >
                Edit Project
              </button>
              <button
                id="btn-delete-project"
                onClick={() => setShowDelete(true)}
                className="rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {showDelete && (
        <DeleteModal
          projectName={project.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
