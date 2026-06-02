import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

  const server = createServerSupabase();
  const { data: userData, error: userErr } = await server.auth.getUser(token);
  if (userErr || !userData?.user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  const user = userData.user;

  const { data, error } = await server.from('business_profiles').select('id,name,owner_id').eq('owner_id', user.id);
  if (error) return NextResponse.json({ message: error.message || 'Failed' }, { status: 500 });

  return NextResponse.json({ businesses: data ?? [] });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

  const server = createServerSupabase();
  const { data: userData, error: userErr } = await server.auth.getUser(token);
  if (userErr || !userData?.user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  const user = userData.user;

  const body = await req.json().catch(() => ({}));
  const name = body.name && String(body.name).trim();
  if (!name) return NextResponse.json({ message: 'Missing name' }, { status: 400 });

  const { data, error } = await server.from('business_profiles').insert({ name, owner_id: user.id }).select().single();
  if (error) return NextResponse.json({ message: error.message || 'Insert failed' }, { status: 500 });

  return NextResponse.json({ business: data });
}
