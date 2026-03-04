import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Creates a Supabase client with the current request's cookies (for auth + RLS). Use in Server Components and Server Actions. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore in Server Component when set is not allowed
        }
      },
    },
  });
}

/** Get current user from Supabase Auth (server). Returns null if not signed in. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export function hasSupabase(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export type WatchlistRow = {
  id: string;
  user_id: string;
  symbol: string;
  company: string;
  added_at: string;
};
