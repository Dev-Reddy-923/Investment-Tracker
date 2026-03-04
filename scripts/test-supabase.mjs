/**
 * Quick Supabase connection test. Run from app root: node scripts/test-supabase.mjs
 * Loads .env from this app folder or parent (Investment Tracker).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const parentRoot = resolve(appRoot, "..");

// Load .env from app root first (so Next.js and this script use same file), then parent
let loadedFrom = null;
for (const root of [appRoot, parentRoot]) {
  const envPath = resolve(root, ".env");
  if (existsSync(envPath)) {
    loadedFrom = envPath;
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([^#=]+)=(.*)$/);
      if (m) {
        const k = m[1].trim();
        const v = m[2].trim().replace(/\r$/, "").replace(/^["']|["']$/g, "");
        if (k && v !== undefined) process.env[k] = v;
      }
    }
    break;
  }
}

if (!loadedFrom) {
  console.error("No .env found in app folder or parent. Put .env in signalist_stock-tracker-app or Investment Tracker.");
  process.exit(1);
}

// Support both NEXT_PUBLIC_* and plain SUPABASE_* names
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const key = service || anon;

if (!url || !key) {
  const names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SERVICE_KEY",
  ];
  const found = names.filter((n) => process.env[n]);
  console.error("Loaded .env from:", loadedFrom);
  console.error("Supabase-related keys found:", found.length ? found.join(", ") : "none");
  console.error("Add to .env: NEXT_PUBLIC_SUPABASE_URL=... and NEXT_PUBLIC_SUPABASE_ANON_KEY=... (or SUPABASE_SERVICE_ROLE_KEY=...)");
  process.exit(1);
}

async function main() {
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("watchlist").select("id").limit(1);
  if (error) {
    if (error.code === "42P01" || /relation.*does not exist|schema cache/i.test(error.message)) {
      console.log("OK: Connected to Supabase. Table 'watchlist' does not exist yet.");
      console.log("   Run the SQL in supabase/migrations/001_watchlist.sql in Supabase SQL Editor.");
    } else {
      console.error("Supabase error:", error.message);
      process.exit(1);
    }
  } else {
    console.log("OK: Connected to Supabase. watchlist table exists.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
