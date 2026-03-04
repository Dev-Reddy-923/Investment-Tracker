'use server';

/** No auth: no user table. Returns empty list so Inngest daily email does nothing. */
export async function getAllUsersForNewsEmail() {
  return [];
}
