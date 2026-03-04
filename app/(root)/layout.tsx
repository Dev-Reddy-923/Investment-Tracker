import Header from "@/components/Header";
import { getUser } from "@/lib/supabase/server";
import { getWatchlistSymbols } from "@/lib/actions/watchlist.actions";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const profile = {
    id: user.id,
    name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
    email: user.email ?? "",
  };

  const initialStocks = await searchStocks();
  const watchlistSymbols = await getWatchlistSymbols();
  const watchlistSet = new Set(watchlistSymbols.map((s) => s.toUpperCase()));
  const stocksWithWatchlist = initialStocks.map((s) => ({
    ...s,
    isInWatchlist: watchlistSet.has((s.symbol || "").toUpperCase()),
  }));

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={profile} initialStocks={stocksWithWatchlist} />

      <div className="container py-10">
        {children}
      </div>
    </main>
  );
};
export default Layout;
