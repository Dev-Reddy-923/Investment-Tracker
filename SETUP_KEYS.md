# How to get all the keys for Signalist

**Auth is disabled:** the app runs in **guest-only mode** (no sign-in). You only need **Finnhub** and **Supabase** to run it.

Copy `.env.example` to `.env` in this folder, then fill in the values below.

---

## 1. **Finnhub** (stock data – required for charts & search)

- Go to **[finnhub.io](https://finnhub.io)** → Sign up (free).
- Dashboard → **API Key** (or [direct link](https://finnhub.io/dashboard)).
- Copy the key and set in `.env`:
  - `NEXT_PUBLIC_FINNHUB_API_KEY=your_key`
  - `FINNHUB_BASE_URL=https://finnhub.io/api/v1` (leave as is)

Free tier: 60 calls/minute.

---

## 2. **Supabase** (watchlist – replaces MongoDB)

- Go to **[supabase.com](https://supabase.com)** → Create a project (free).
- In the project: **Settings** → **API**.
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL=...`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- (Optional) Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY=...` if you want server-side to bypass RLS.

**Create the watchlist table:** in Supabase go to **SQL Editor** and run the contents of `supabase/migrations/001_watchlist.sql` (creates the `watchlist` table and RLS policy).

Without Supabase the app still runs; watchlist add/remove just won’t persist (you’ll see “Supabase not configured” if you try).

---

## 3. **Better Auth / MongoDB** – not used

Auth is disabled. The app uses a **guest id** (cookie) instead of user accounts. You don’t need MongoDB or Better Auth.

---

## 4. **OpenAI** (optional – for Inngest AI)

- [platform.openai.com](https://platform.openai.com/api-keys) → Create API key → `OPENAI_API_KEY=...`

Used for AI-generated welcome email intros and daily news summaries (Inngest workflows). Optional.

---

## 5. **Resend** (optional – for custom emails)

- [resend.com](https://resend.com) → Sign up → API Keys → Create key → `RESEND_API_KEY=re_...`
- For testing you can use the default `onboarding@resend.dev` as sender. For production, set `RESEND_FROM_EMAIL` and verify your domain in Resend.

Used by Inngest to send welcome emails and daily news summaries. Supabase doesn’t send these; Resend is the provider (recommended by Supabase for custom email). Optional.

---

## 6. **Inngest** (optional for dev)

- For local dev: `npx inngest-cli@latest dev` (no key needed).

---

## Quick checklist

| Key / Service | Required? | Where to get it |
|---------------|-----------|------------------|
| Finnhub       | Yes       | [finnhub.io](https://finnhub.io) |
| Supabase      | Yes (for watchlist) | [supabase.com](https://supabase.com) → Project → Settings → API |
| MongoDB       | No        | Not used (guest-only mode) |
| Better Auth   | No        | Not used |
| OpenAI        | No        | [platform.openai.com](https://platform.openai.com/api-keys) |
| Resend        | No        | [resend.com](https://resend.com) (API key) |
| Inngest       | No (dev)  | `npx inngest-cli@latest dev` |

After editing `.env`, restart the dev server (`pnpm dev`).
