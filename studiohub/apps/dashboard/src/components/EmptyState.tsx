'use client';

import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {/* Folder icon */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} className="text-white/20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#3b82f6] shadow-[0_0_16px_rgba(59,130,246,0.4)]">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
      <p className="text-sm text-white/40 mb-6 max-w-xs text-center">
        Create your first project to start tracking your work and managing your portfolio.
      </p>

      <Link
        href="/dashboard/projects/new"
        id="btn-empty-create"
        className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2563eb] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse-glow"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Create Project
      </Link>
    </div>
  );
}
