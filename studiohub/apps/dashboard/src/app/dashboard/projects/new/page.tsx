'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import TopBar from '@/components/TopBar';
import ProjectForm from '@/components/ProjectForm';
import { useDashboard } from '../../layout';
import type { ProjectFormData } from '@/types';
import Link from 'next/link';

export default function NewProjectPage() {
  const { user } = useAuth();
  const { createProject } = useProjects();
  const { pushToast } = useDashboard();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    try {
      await createProject(data);
      pushToast('Project created successfully', 'success');
      router.push('/dashboard/projects');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Failed to create project', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <TopBar title="New Project" userEmail={user?.email} />

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

        <h2 className="text-xl font-bold text-white mb-6 animate-fade-in">Create New Project</h2>

        <ProjectForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => router.push('/dashboard/projects')}
          saving={saving}
        />
      </div>
    </div>
  );
}
