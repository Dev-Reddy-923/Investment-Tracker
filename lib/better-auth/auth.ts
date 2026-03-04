/**
 * Auth is disabled: app runs in guest-only mode (no sign-in).
 * Session is always null; sign-in/sign-up/sign-out are no-ops.
 * Remove this stub and restore Better Auth + MongoDB if you add authentication later.
 */

export const auth = {
  api: {
    getSession: async () => ({ user: null, session: null }),
    signInEmail: async () => ({ error: "Auth disabled" }),
    signUpEmail: async () => ({ error: "Auth disabled" }),
    signOut: async () => {},
  },
};
