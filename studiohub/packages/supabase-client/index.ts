import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

/**
 * Browser-safe Supabase client.
 * Only created when running in the browser with env vars present.
 */
export const supabase = (typeof window !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY)
	? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
	: null as unknown as ReturnType<typeof createClient> | null;

/**
 * Server-side admin client using the service role key.
 * Must only be called in server contexts (API routes, server components).
 */
export function createServerSupabase() {
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in server environment");
	if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL in server environment");
	return createClient(SUPABASE_URL, key);
}

export { createClient } from "@supabase/supabase-js";
