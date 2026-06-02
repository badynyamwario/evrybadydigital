'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import TopBar from '@/components/TopBar';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';
import DeleteModal from '@/components/DeleteModal';
import { useDashboard } from '../layout';
import type { Project } from '@/types';

const statusFilters = ['all', 'active', 'paused', 'completed'] as const;

export default function ProjectsListPage() {
  const { user } = useAuth();
  const { projects, loading, deleteProject } = useProjects();
  const { pushToast } = useDashboard();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      pushToast(`"${deleteTarget.name}" deleted`, 'success');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <TopBar title="Projects" userEmail={user?.email} />

      <div className="p-6 space-y-6">
        {/* Filters bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <svg
              width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-projects"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="!pl-10"
            />
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
            {statusFilters.map((s) => (
              <button
                key={s}
                id={`filter-${s}`}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-[#3b82f6]/15 text-[#3b82f6] shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card h-44 animate-shimmer" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onDelete={(id) => {
                  const p = projects.find((x) => x.id === id);
                  if (p) setDeleteTarget(p);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          projectName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
