import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';
import { resolveOrgIdForUser } from '@/lib/organizations';

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token || null;
}

async function getUser(server: ReturnType<typeof createServerSupabase>, token: string) {
  const { data, error } = await server.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

async function projectInsertPayload(
  server: ReturnType<typeof createServerSupabase>,
  user: { id: string; email?: string },
  fields: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const base = { owner_id: user.id, ...fields };
  try {
    const orgId = await resolveOrgIdForUser(server, user);
    return { ...base, org_id: orgId };
  } catch (err) {
    console.warn('Could not resolve org_id for project insert', err);
    return base;
  }
}

// GET /api/projects - list all projects, or GET /api/projects?id=... for a single project
export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

  const server = createServerSupabase();
  const user = await getUser(server, token);
  if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const { data, error } = await server
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single();
    if (error || !data) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json({ project: data });
  }

  const { data, error } = await server
    .from('projects')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  const projects = data ?? [];

  // Read apps from filesystem
  let appFolders: string[] = [];
  try {
    const appsDir = path.join(process.cwd(), '..');
    const entries = await fs.readdir(appsDir, { withFileTypes: true });
    appFolders = entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);
  } catch (e) {
    console.error('Failed to read apps directory', e);
  }

  // Auto-insert missing projects for physical folders
  if (appFolders.length > 0) {
    const dbProjectNames = new Set(projects.map((p: any) => p.name));
    const newProjectsToInsert = [];

    let orgId: string | undefined;
    try {
      orgId = await resolveOrgIdForUser(server, user);
    } catch (err) {
      console.warn('Could not resolve org_id for auto-sync inserts', err);
    }

    for (const folder of appFolders) {
      if (!dbProjectNames.has(folder)) {
        newProjectsToInsert.push({
          owner_id: user.id,
          ...(orgId ? { org_id: orgId } : {}),
          name: folder,
          status: 'active',
          tags: ['auto-synced'],
        });
      }
    }

    if (newProjectsToInsert.length > 0) {
      const { data: inserted, error: insertError } = await server
        .from('projects')
        .insert(newProjectsToInsert)
        .select();
      
      if (insertError) {
        console.error('Auto-sync project insert failed', insertError.message);
      }
      
      if (!insertError && inserted) {
        projects.push(...inserted);
      }
    }
  }

  // Filter to only those matching physical folders
  const syncedProjects = appFolders.length > 0 
    ? projects.filter((p: any) => appFolders.includes(p.name))
    : projects;
    
  // Sort them by created_at descending
  syncedProjects.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ projects: syncedProjects });
}

// POST /api/projects - create a new project
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

  const server = createServerSupabase();
  const user = await getUser(server, token);
  if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    return NextResponse.json({ message: 'Name is required (min 2 chars)' }, { status: 400 });
  }

  const insert = await projectInsertPayload(server, user, {
    name: body.name.trim(),
    description: body.description ?? null,
    status: ['active', 'paused', 'completed'].includes(body.status) ? body.status : 'active',
    client_name: body.client_name ?? null,
    start_date: body.start_date ?? null,
    end_date: body.end_date ?? null,
    budget: body.budget != null ? Number(body.budget) : null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    thumbnail_url: body.thumbnail_url ?? null,
  });

  const { data, error } = await server.from('projects').insert(insert).select().single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ project: data });
}

// PATCH /api/projects - update an existing project
export async function PATCH(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

  const server = createServerSupabase();
  const user = await getUser(server, token);
  if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ message: 'Missing project id' }, { status: 400 });

  // Verify ownership
  const { data: existing } = await server
    .from('projects')
    .select('id, owner_id, name, org_id')
    .eq('id', body.id)
    .single();
  if (!existing) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  if (existing.owner_id !== user.id) return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

  // Handle folder rename if name is changing
  if (body.name !== undefined && body.name !== existing.name) {
    const oldAppDir = path.join(process.cwd(), '..', existing.name);
    const newAppDir = path.join(process.cwd(), '..', body.name);
    try {
      await fs.access(oldAppDir);
      await fs.rename(oldAppDir, newAppDir);
    } catch (e) {
      console.error('Failed to rename physical folder from', existing.name, 'to', body.name, e);
      // If we cannot rename the folder, we should probably fail the update to keep DB and FS in sync
      return NextResponse.json({ message: 'Could not rename project folder on disk. Please ensure the new name is valid.' }, { status: 400 });
    }
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (!existing.org_id) {
    try {
      update.org_id = await resolveOrgIdForUser(server, user);
    } catch (err) {
      console.warn('Could not resolve org_id for project update', err);
    }
  }
  if (body.name !== undefined) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (body.status !== undefined && ['active', 'paused', 'completed'].includes(body.status)) update.status = body.status;
  if (body.client_name !== undefined) update.client_name = body.client_name;
  if (body.start_date !== undefined) update.start_date = body.start_date;
  if (body.end_date !== undefined) update.end_date = body.end_date;
  if (body.budget !== undefined) update.budget = body.budget != null ? Number(body.budget) : null;
  if (body.tags !== undefined) update.tags = Array.isArray(body.tags) ? body.tags : [];
  if (body.thumbnail_url !== undefined) update.thumbnail_url = body.thumbnail_url;

  const { data, error } = await server
    .from('projects')
    .update(update)
    .eq('id', body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Auto-sync UI data
  if (data && data.name) {
    try {
      const appDir = path.join(process.cwd(), '..', data.name);
      // Check if folder exists
      await fs.access(appDir);
      const uiDataPath = path.join(appDir, 'ui-data.json');
      await fs.writeFile(uiDataPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to sync UI data for project', data.name, e);
    }
  }

  return NextResponse.json({ project: data });
}

// DELETE /api/projects?id=... - delete a project
export async function DELETE(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

  const server = createServerSupabase();
  const user = await getUser(server, token);
  if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

  // Verify ownership
  const { data: existing } = await server
    .from('projects')
    .select('id, owner_id')
    .eq('id', id)
    .single();
  if (!existing) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  if (existing.owner_id !== user.id) return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

  const { error } = await server.from('projects').delete().eq('id', id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
