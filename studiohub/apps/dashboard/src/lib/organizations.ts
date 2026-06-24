import type { SupabaseClient, User } from '@supabase/supabase-js';

type OrgRow = { id: string };

/**
 * Resolve the organization id for a user before inserting/updating projects.
 * Creates a default organization + membership when none exists.
 *
 * Required when the Supabase `projects` table has `org_id` referencing `organizations`.
 */
export async function resolveOrgIdForUser(
  server: SupabaseClient,
  user: Pick<User, 'id' | 'email'>
): Promise<string> {
  const userId = user.id;

  const { data: membership, error: membershipError } = await server
    .from('organization_members')
    .select('org_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (membershipError && !isMissingRelationError(membershipError.message)) {
    throw new Error(membershipError.message);
  }
  if (membership?.org_id) return membership.org_id;

  const { data: ownedOrg, error: ownedOrgError } = await server
    .from('organizations')
    .select('id')
    .eq('owner_id', userId)
    .limit(1)
    .maybeSingle();

  if (ownedOrgError && !isMissingColumnError(ownedOrgError.message)) {
    throw new Error(ownedOrgError.message);
  }
  if (ownedOrg?.id) {
    await ensureOrganizationMembership(server, ownedOrg.id, userId);
    return ownedOrg.id;
  }

  const label = user.email?.split('@')[0] ?? 'workspace';
  const orgName = `${label}'s workspace`;

  const { data: createdOrg, error: createOrgError } = await server
    .from('organizations')
    .insert({ name: orgName, owner_id: userId })
    .select('id')
    .single();

  if (createOrgError) {
    const { data: fallbackOrg, error: fallbackError } = await server
      .from('organizations')
      .insert({ name: orgName })
      .select('id')
      .single();

    if (fallbackError || !fallbackOrg) {
      throw new Error(createOrgError.message);
    }

    await ensureOrganizationMembership(server, fallbackOrg.id, userId);
    return fallbackOrg.id;
  }

  if (!createdOrg) throw new Error('Failed to create organization');

  await ensureOrganizationMembership(server, createdOrg.id, userId);
  return createdOrg.id;
}

async function ensureOrganizationMembership(
  server: SupabaseClient,
  orgId: string,
  userId: string
): Promise<void> {
  const { error } = await server.from('organization_members').upsert(
    { org_id: orgId, user_id: userId, role: 'owner' },
    { onConflict: 'org_id,user_id', ignoreDuplicates: true }
  );

  if (error && !isMissingRelationError(error.message)) {
    throw new Error(error.message);
  }
}

function isMissingRelationError(message: string): boolean {
  return /relation .* does not exist/i.test(message);
}

function isMissingColumnError(message: string): boolean {
  return /column .* does not exist/i.test(message);
}
