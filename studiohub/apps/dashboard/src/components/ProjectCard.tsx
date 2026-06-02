'use client';

import Link from 'next/link';
import type { Project } from '@/types';
import StatusBadge from './StatusBadge';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  index?: number;
}

export default function ProjectCard({ project, onDelete, index = 0 }: ProjectCardProps) {
  const budget = project.budget
    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(project.budget)
    : null;

  const dateRange =
    project.start_date || project.end_date
      ? [project.start_date, project.end_date].filter(Boolean).join(' → ')
      : null;

  return (
    <div
      className="glass-card glass-card-hover group relative p-5"
      style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/dashboard/projects/${project.id}`}
            id={`project-card-${project.id}`}
            className="block"
          >
            <h3 className="truncate text-[15px] font-semibold text-white transition group-hover:text-[#3b82f6]">
              {project.name}
            </h3>
          </Link>
          {project.client_name && (
            <p className="mt-0.5 text-xs text-white/40">{project.client_name}</p>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#3b82f6]/8 px-2.5 py-0.5 text-[11px] font-medium text-[#3b82f6]/80 border border-[#3b82f6]/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/35">
        <div className="flex items-center gap-3">
          {budget && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {budget}
            </span>
          )}
          {dateRange && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dateRange}
            </span>
          )}
        </div>

        {/* Action buttons (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/dashboard/projects/${project.id}`}
            id={`btn-edit-${project.id}`}
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/[0.06] hover:text-white/80"
            title="Edit project"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
              id={`btn-delete-${project.id}`}
              className="rounded-lg p-1.5 text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
              title="Delete project"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
