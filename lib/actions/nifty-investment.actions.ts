/**
 * UTI Nifty 50 ETF (UTINIFTETF) snapshot + P&L for a lump-sum investment.
 * Uses Yahoo Finance chart API (unofficial, no API key). Chart on page uses TradingView NSE:UTINIFTETF.
 */

const YAHOO_NIFTY_ETF = 'UTINIFTETF.NS'; // UTI Nifty 50 ETF — NSE

export type NiftyInvestmentSnapshot = {
  ok: true;
  symbol: string;
  name: string;
  currency: string;
  investmentAmount: number;
  investmentDaysAgo: number;
  entryDate: string; // ISO date of bar used as entry
  entryPrice: number;
  currentPrice: number;
  units: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  asOf: string;
} | { ok: false; error: string };

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n);
}

export async function getNifty50InvestmentSnapshot(options?: {
  investmentAmount?: number;
  /** Calendar days ago you invested (default 2) */
  daysAgo?: number;
}): Promise<NiftyInvestmentSnapshot> {
  const investmentAmount = options?.investmentAmount ?? 130_000;
  const daysAgo = Math.max(0, options?.daysAgo ?? 2);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${YAHOO_NIFTY_ETF}?interval=1d&range=1mo`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Mockfolio/1.0)' },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return { ok: false, error: `Price data unavailable (${res.status}). Try again later.` };
    }
    const json = (await res.json()) as {
      chart?: { result?: Array<{
        meta?: { regularMarketPrice?: number; currency?: string; shortName?: string };
        timestamp?: number[];
        indicators?: { quote?: Array<{ close?: (number | null)[] }> };
      }> };
    };
    const result = json.chart?.result?.[0];
    if (!result?.timestamp?.length || !result.indicators?.quote?.[0]?.close) {
      return { ok: false, error: 'No price history returned for UTINIFTETF (UTI Nifty 50 ETF).' };
    }

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close!;
    const meta = result.meta ?? {};
    const currentPrice =
      typeof meta.regularMarketPrice === 'number' && meta.regularMarketPrice > 0
        ? meta.regularMarketPrice
        : (() => {
            for (let i = closes.length - 1; i >= 0; i--) {
              const c = closes[i];
              if (c != null && c > 0) return c;
            }
            return 0;
          })();

    if (!currentPrice || currentPrice <= 0) {
      return { ok: false, error: 'Could not read current price.' };
    }

    // Target entry: end of calendar day (UTC) that was `daysAgo` days before today
    const now = new Date();
    const target = new Date(now);
    target.setUTCDate(target.getUTCDate() - daysAgo);
    target.setUTCHours(23, 59, 59, 999);
    const targetSec = Math.floor(target.getTime() / 1000);

    // Last daily close on or before end of "investment" calendar day
    let entryIdx = 0;
    for (let i = timestamps.length - 1; i >= 0; i--) {
      if (timestamps[i] <= targetSec) {
        entryIdx = i;
        break;
      }
    }

    const entryClose = closes[entryIdx];
    if (entryClose == null || entryClose <= 0) {
      return { ok: false, error: 'Could not find entry-day close price.' };
    }

    const entryDate = new Date(timestamps[entryIdx] * 1000).toISOString().slice(0, 10);
    const units = investmentAmount / entryClose;
    const currentValue = units * currentPrice;
    const pnl = currentValue - investmentAmount;
    const pnlPercent = (pnl / investmentAmount) * 100;

    return {
      ok: true,
      symbol: YAHOO_NIFTY_ETF,
      name: meta.shortName ?? 'UTI Nifty 50 ETF',
      currency: meta.currency ?? 'INR',
      investmentAmount,
      investmentDaysAgo: daysAgo,
      entryDate,
      entryPrice: entryClose,
      currentPrice,
      units,
      currentValue,
      pnl,
      pnlPercent,
      asOf: now.toISOString(),
    };
  } catch (e) {
    console.error('getNifty50InvestmentSnapshot', e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Failed to load Nifty ETF data.',
    };
  }
}

export { formatINR, YAHOO_NIFTY_ETF };
