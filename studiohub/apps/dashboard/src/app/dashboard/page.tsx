'use client';

import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import TopBar from '@/components/TopBar';
import StatsCards from '@/components/StatsCards';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { projects, loading } = useProjects();

  const recentProjects = projects.slice(0, 5);
  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div>
      <TopBar title="Overview" userEmail={user?.email} />

      <div className="p-6 space-y-8">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-[#3b82f6]">{firstName}</span>
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Here&apos;s an overview of your projects and activity.
          </p>
        </div>

        {/* Stats */}
        <StatsCards projects={projects} />

        {/* Recent Projects */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
            {projects.length > 0 && (
              <Link
                href="/dashboard/projects"
                className="text-sm text-[#3b82f6] transition hover:text-[#60a5fa]"
              >
                View all →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass-card h-40 animate-shimmer" />
              ))}
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
