import { cookies } from "next/headers";

const GUEST_ID_COOKIE = "signalist_guest_id";

function generateGuestId(): string {
  return `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/** Get or create a stable guest id (stored in cookie). Use this when auth is disabled. */
export async function getOrCreateGuestId(): Promise<string> {
  const store = await cookies();
  let id = store.get(GUEST_ID_COOKIE)?.value;
  if (!id) {
    id = generateGuestId();
    store.set(GUEST_ID_COOKIE, id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return id;
}
