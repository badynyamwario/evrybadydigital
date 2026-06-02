'use client';

import { useState, useEffect, useRef } from 'react';
import type { Project } from '@/types';

interface StatsCardsProps {
  projects: Project[];
}

function AnimatedCounter({ target, prefix = '' }: { target: number; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const duration = 800;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target]);

  return <>{prefix}{count.toLocaleString()}</>;
}

const stats = [
  {
    label: 'Total Projects',
    key: 'total' as const,
    gradient: 'from-[#3b82f6]/20 to-[#3b82f6]/5',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Active',
    key: 'active' as const,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: 'Completed',
    key: 'completed' as const,
    gradient: 'from-slate-400/20 to-slate-400/5',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Budget',
    key: 'budget' as const,
    gradient: 'from-[#f7e7a6]/20 to-[#f7e7a6]/5',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#f7e7a6" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
];

export default function StatsCards({ projects }: StatsCardsProps) {
  const data = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    budget: projects.reduce((sum, p) => sum + (p.budget ?? 0), 0),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.key}
          className={`glass-card relative overflow-hidden p-5`}
          style={{ animation: `fadeIn 0.4s ease-out ${i * 0.08}s both` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60`} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white/45 uppercase tracking-wider">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-white tracking-tight">
                <AnimatedCounter
                  target={data[stat.key]}
                  prefix={stat.key === 'budget' ? '£' : ''}
                />
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04]">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
