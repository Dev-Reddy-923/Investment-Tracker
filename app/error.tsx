"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isEnvError =
    error.message?.includes("Supabase") ||
    error.message?.includes("env") ||
    error.message?.includes("NEXT_PUBLIC");

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-300 p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
        <p className="text-sm text-zinc-400">
          {isEnvError
            ? error.message
            : "A server error occurred. Check Vercel logs for details."}
        </p>
        {isEnvError && (
          <p className="text-xs text-zinc-500 text-left">
            On Vercel: Project → Settings → Environment Variables. Add
            NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and
            NEXT_PUBLIC_FINNHUB_API_KEY for Production (and Preview if needed).
          </p>
        )}
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
