'use client';

import Link from 'next/link';

interface TopBarProps {
  title: string;
  userEmail?: string;
}

export default function TopBar({ title, userEmail }: TopBarProps) {
  return (
    <header
      id="topbar"
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-xl px-6"
    >
      <h1 className="text-lg font-semibold text-white tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        {/* New Project CTA */}
        <Link
          href="/dashboard/projects/new"
          id="btn-new-project-topbar"
          className="flex items-center gap-2 rounded-full bg-[#3b82f6] px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2563eb] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>

        {/* User avatar */}
        {userEmail && (
          <div
            id="user-avatar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-xs font-bold text-white uppercase cursor-default"
            title={userEmail}
          >
            {userEmail[0]}
          </div>
        )}
      </div>
    </header>
  );
}
