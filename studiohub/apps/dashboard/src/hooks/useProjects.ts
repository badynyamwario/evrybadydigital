'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Project, ProjectFormData } from '@/types';

export function useProjects() {
  const { session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const headers = useCallback(() => {
    const h: Record<string, string> = { 'content-type': 'application/json' };
    if (session?.access_token) h.Authorization = `Bearer ${session.access_token}`;
    return h;
  }, [session]);

  const fetchProjects = useCallback(async () => {
    if (!session?.access_token) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects', { headers: headers() });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to fetch');
      const json = await res.json();
      if (mountedRef.current) setProjects(json.projects ?? []);
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [session, headers]);

  useEffect(() => {
    if (session?.access_token) fetchProjects();
  }, [session?.access_token, fetchProjects]);

  const createProject = useCallback(async (data: ProjectFormData): Promise<Project> => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create project');
    }
    const json = await res.json();
    const newProject = json.project as Project;
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }, [headers]);

  const updateProject = useCallback(async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const snapshot = [...projects];
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } as Project : p)));
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update project');
      }
      const json = await res.json();
      const updated = json.project as Project;
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      setProjects(snapshot);
      throw err;
    }
  }, [projects, headers]);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    const snapshot = [...projects];
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete project');
      }
    } catch (err) {
      setProjects(snapshot);
      throw err;
    }
  }, [projects, headers]);

  return { projects, loading, error, refetch: fetchProjects, createProject, updateProject, deleteProject };
}
