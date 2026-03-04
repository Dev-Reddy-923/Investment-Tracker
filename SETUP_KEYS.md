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

## 4. **Google Gemini** (optional)

- [aistudio.google.com](https://aistudio.google.com) → Get API key → `GEMINI_API_KEY=...`

Used for AI summaries; optional.

---

## 5. **Nodemailer** (optional)

- Gmail: use App Password in `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD`.

Used for email alerts; optional.

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
| Gemini        | No        | [aistudio.google.com](https://aistudio.google.com) |
| Nodemailer    | No        | Gmail App Password or other SMTP |
| Inngest       | No (dev)  | `npx inngest-cli@latest dev` |

After editing `.env`, restart the dev server (`pnpm dev`).
