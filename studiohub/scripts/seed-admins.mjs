/**
 * Seed 3 admin accounts into Supabase Auth via signUp.
 *
 * Usage:  node scripts/seed-admins.mjs
 *
 * Reads env vars from apps/dashboard/.env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/* ── Load env vars from apps/dashboard/.env.local ────────────────────── */
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", "apps", "dashboard", ".env.local");

try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.warn(`⚠  Could not read ${envPath} — relying on existing env vars`);
}

/* ── Also load root .env.local for the real service role key ─────────── */
const rootEnvPath = resolve(__dirname, "..", ".env.local");
try {
  const envContent = readFileSync(rootEnvPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    // Override with root values (root may have real service role key)
    process.env[key] = val;
  }
} catch {
  // root .env.local may not exist, that's fine
}

/* ── Supabase client ─────────────────────────────────────────────────── */
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error("❌  Missing SUPABASE_URL");
  process.exit(1);
}

/* ── Admin accounts to seed ──────────────────────────────────────────── */
const ADMINS = [
  { email: "kedogosospeter36@gmail.com", password: "admin1201" },
  { email: "pete@espeezy.com", password: "admin1201" },
  { email: "sospeter.kedogo22@my.northampton.ac.uk", password: "admin1201" },
];

/* ── Try admin API first, fall back to signUp ────────────────────────── */
async function seed() {
  console.log("🌱  Seeding admin accounts …\n");

  // Try admin API with service role key
  if (SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== ANON_KEY) {
    console.log("Using admin API (service role key) …\n");
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    for (const admin of ADMINS) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: { role: "admin" },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already") ||
            error.message.toLowerCase().includes("exists") ||
            error.message.toLowerCase().includes("duplicate")) {
          console.log(`⏭  ${admin.email} already exists`);
        } else {
          console.error(`❌  ${admin.email}: ${error.message}`);
        }
      } else {
        console.log(`✅  Created ${admin.email}  (id: ${data.user.id})`);
      }
    }
  } else {
    // Fallback: use signUp with anon key (users may need email confirmation)
    console.log("⚠  Service role key unavailable or same as anon key.");
    console.log("Using signUp API (anon key) — users will be auto-confirmed if email confirmation is disabled in Supabase settings.\n");
    
    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    for (const admin of ADMINS) {
      const { data, error } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          data: { role: "admin" },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already") ||
            error.message.toLowerCase().includes("registered")) {
          console.log(`⏭  ${admin.email} already registered`);
        } else {
          console.error(`❌  ${admin.email}: ${error.message}`);
        }
      } else {
        const confirmed = data.user?.email_confirmed_at ? "✅ confirmed" : "⚠ needs email confirmation";
        console.log(`✅  Signed up ${admin.email}  (id: ${data.user?.id}) — ${confirmed}`);
      }
    }
  }

  console.log("\n🎉  Done!");
}

seed().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
