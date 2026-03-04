"use client";

import { useCallback } from "react";
import WatchlistButton from "@/components/WatchlistButton";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

type Props = {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
};

export default function WatchlistButtonWithActions({ symbol, company, isInWatchlist }: Props) {
  const onWatchlistChange = useCallback(
    async (sym: string, isAdded: boolean) => {
      if (isAdded) {
        await addToWatchlist(sym, company || sym);
      } else {
        await removeFromWatchlist(sym);
      }
    },
    [company]
  );

  return (
    <WatchlistButton
      symbol={symbol}
      company={company}
      isInWatchlist={isInWatchlist}
      onWatchlistChange={onWatchlistChange}
    />
  );
}
