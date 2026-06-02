import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';
import type { SectionRecord } from '@/services/sectionService';

type SectionInput = { 
  section: Partial<SectionRecord>;
};

function validateSection(payload: unknown) {
  if (!payload) return 'Missing payload';
  const p = payload as Record<string, unknown>;
  const s = (p.section ?? p) as Record<string, unknown>;
  if (!s) return 'Missing section object';
  if (!s.page_slug || typeof s.page_slug !== 'string') return 'Invalid page_slug';
  if (!s.section_key || typeof s.section_key !== 'string') return 'Invalid section_key';
  if (!s.title || typeof s.title !== 'string') return 'Invalid title';
  if (s.position != null && typeof s.position !== 'number') return 'Invalid position';
  if (s.cta_url) {
    try {
      // basic URL validation
      // allow relative paths as well
      const u = new URL(s.cta_url as string, 'http://localhost');
      if (!u) return 'Invalid cta_url';
    } catch (e) {
      return 'Invalid cta_url';
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) return NextResponse.json({ message: 'Missing Authorization token' }, { status: 401 });

  const server = createServerSupabase();

  // Validate token and extract user
  const { data: userData, error: userErr } = await server.auth.getUser(token);
  if (userErr || !userData?.user) {
    return NextResponse.json({ message: 'Invalid user token' }, { status: 401 });
  }

  const user = userData.user;

  const body = await req.json().catch(() => ({}));
  const validationError = validateSection(body);
  if (validationError) return NextResponse.json({ message: validationError }, { status: 400 });

  const section = body.section;

  // Ensure user owns the business profile referenced (business_id)
  if (!section.business_id) {
    return NextResponse.json({ message: 'Missing business_id' }, { status: 400 });
  }

  const { data: profile, error: profileErr } = await server
    .from('business_profiles')
    .select('id, owner_id')
    .eq('id', section.business_id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ message: 'Business profile not found' }, { status: 404 });
  }

  if (profile.owner_id !== user.id) {
    return NextResponse.json({ message: 'Not authorized for this business' }, { status: 403 });
  }

  // Enforce owner_id matches user
  section.owner_id = user.id;

  // Upsert the section (server key used - bypasses RLS, but we enforce ownership above)
  const { data, error } = await server.from('sections').upsert(section, { onConflict: 'id' }).select();

  if (error) {
    return NextResponse.json({ message: error.message || 'Upsert failed' }, { status: 500 });
  }

  return NextResponse.json({ section: data?.[0] ?? null });
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) return NextResponse.json({ message: 'Missing Authorization token' }, { status: 401 });

  const server = createServerSupabase();
  const { data: userData, error: userErr } = await server.auth.getUser(token);
  if (userErr || !userData?.user) {
    return NextResponse.json({ message: 'Invalid user token' }, { status: 401 });
  }
  const user = userData.user;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

  // Verify ownership
  const { data: section, error: sectionErr } = await server.from('sections').select('id, owner_id, business_id').eq('id', id).single();
  if (sectionErr || !section) return NextResponse.json({ message: 'Section not found' }, { status: 404 });
  if (section.owner_id !== user.id) return NextResponse.json({ message: 'Not authorized to delete this section' }, { status: 403 });

  const { error } = await server.from('sections').delete().eq('id', id);
  if (error) return NextResponse.json({ message: error.message || 'Delete failed' }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page');
  const businessId = url.searchParams.get('business_id');
  const server = createServerSupabase();

  // If business_id is provided, return business-specific sections (owner-only)
  if (businessId) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

    const { data: userData, error: userErr } = await server.auth.getUser(token);
    if (userErr || !userData?.user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    const user = userData.user;

    // Verify owner for the business
    const { data: profile, error: profileErr } = await server.from('business_profiles').select('id,owner_id').eq('id', businessId).single();
    if (profileErr || !profile) return NextResponse.json({ message: 'Business profile not found' }, { status: 404 });
    if (profile.owner_id !== user.id) return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

    const { data, error } = await server.from('sections').select('*').eq('business_id', businessId).order('position', { ascending: true });
    if (error) return NextResponse.json({ message: error.message || 'Unable to fetch sections' }, { status: 500 });
    return NextResponse.json({ sections: data ?? [] });
  }

  if (!page) {
    return NextResponse.json({ message: 'Missing page param' }, { status: 400 });
  }

  const { data, error } = await server.from('sections').select('*').eq('page_slug', page).order('position', { ascending: true });
  if (error) {
    return NextResponse.json({ message: error.message || 'Unable to fetch sections' }, { status: 500 });
  }

  return NextResponse.json({ sections: data ?? [] });
}

