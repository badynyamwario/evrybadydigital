import { supabase } from "@/lib/supabaseClient";

export type SectionRecord = {
  id: string;
  business_id?: string;
  owner_id?: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle?: string;
  content?: string;
  cta_text?: string | null;
  cta_url?: string | null;
  metadata?: Record<string, unknown>;
  position: number;
  created_at?: string;
  updated_at?: string;
};

export async function fetchSections(pageSlug: string) {
  // Fetch via server API to avoid exposing service keys in the client bundle
  const res = await fetch(`/api/sections?page=${encodeURIComponent(pageSlug)}`);
  if (!res.ok) {
    // Return fallback or throw to allow hook to handle fallback
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || 'Unable to fetch sections');
  }

  const json = await res.json();
  return (json.sections ?? []) as SectionRecord[];
}

export async function upsertSection(section: Partial<SectionRecord>) {
  // Use server API for writes to enforce RBAC and validation server-side.
  // Include the user's access token so the server can verify the user and enforce RBAC.
  const session = await supabase?.auth.getSession();
  const token = session?.data?.session?.access_token;

  const res = await fetch("/api/sections", {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ section }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message || "Unable to upsert section");
  }

  return (await res.json()).section as SectionRecord;
}

export async function deleteSection(sectionId: string) {
  const session = await supabase?.auth.getSession();
  const token = session?.data?.session?.access_token;

  const res = await fetch(`/api/sections?id=${encodeURIComponent(sectionId)}`, {
    method: "DELETE",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message || "Unable to delete section");
  }

  return true;
}
