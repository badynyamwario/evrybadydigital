import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';

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

  return NextResponse.json({ projects: data ?? [] });
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

  const insert = {
    owner_id: user.id,
    name: body.name.trim(),
    description: body.description ?? null,
    status: ['active', 'paused', 'completed'].includes(body.status) ? body.status : 'active',
    client_name: body.client_name ?? null,
    start_date: body.start_date ?? null,
    end_date: body.end_date ?? null,
    budget: body.budget != null ? Number(body.budget) : null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    thumbnail_url: body.thumbnail_url ?? null,
  };

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
    .select('id, owner_id')
    .eq('id', body.id)
    .single();
  if (!existing) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  if (existing.owner_id !== user.id) return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
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
