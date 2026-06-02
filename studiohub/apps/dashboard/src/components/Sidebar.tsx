'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  userEmail?: string;
  onSignOut: () => void;
}

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/dashboard/projects',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ userEmail, onSignOut }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-[#0d1225]/80 backdrop-blur-xl"
      style={{
        width: collapsed ? 72 : 240,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-sm font-bold text-white">
          S
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold tracking-tight text-white animate-fade-in">
            StudioHub
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white/90'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              )}
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-white/[0.06] p-3 space-y-2">
        {!collapsed && userEmail && (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2 animate-fade-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-xs font-bold text-white uppercase">
              {userEmail[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-white/70">{userEmail}</p>
            </div>
          </div>
        )}

        {!collapsed && (
          <button
            id="btn-sign-out"
            onClick={onSignOut}
            className="w-full rounded-xl px-3 py-2 text-left text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white/70 animate-fade-in"
          >
            Sign out
          </button>
        )}

        <button
          id="btn-collapse-sidebar"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl py-2 text-white/40 transition hover:bg-white/[0.04] hover:text-white/70"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
