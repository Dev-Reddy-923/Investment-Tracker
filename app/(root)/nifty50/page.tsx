import TradingViewWidget from '@/components/TradingViewWidget';
import { CANDLE_CHART_WIDGET_CONFIG } from '@/lib/constants';
import { getNifty50InvestmentSnapshot, formatINR } from '@/lib/actions/nifty-investment.actions';

const NSE_NIFTY_ETF = 'NSE:NIFTYBEES';

export default async function Nifty50Page() {
  const snapshot = await getNifty50InvestmentSnapshot({
    investmentAmount: 130_000,
    daysAgo: 2,
  });
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Nifty 50 index ETF</h1>
        <p className="text-zinc-500 text-sm mt-1 max-w-2xl">
          Chart is <strong className="text-zinc-400">Nippon India ETF Nifty 50 BeES</strong> (
          {NSE_NIFTY_ETF}) — a liquid NSE-listed fund that tracks the Nifty 50. P&amp;L uses public
          daily prices (no extra API key). Not financial advice.
        </p>
      </div>

      {snapshot.ok ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Invested (₹1,30,000)</p>
            <p className="text-lg font-medium text-zinc-200">{formatINR(snapshot.investmentAmount)}</p>
            <p className="text-xs text-zinc-600 mt-1">~{snapshot.investmentDaysAgo} calendar days ago</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Entry ({snapshot.entryDate})</p>
            <p className="text-lg font-medium text-zinc-200">{formatINR(snapshot.entryPrice)} / unit</p>
            <p className="text-xs text-zinc-600 mt-1">{snapshot.units.toFixed(4)} units</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Current (approx.)</p>
            <p className="text-lg font-medium text-zinc-200">{formatINR(snapshot.currentPrice)} / unit</p>
            <p className="text-xs text-zinc-600 mt-1">Value today</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">P&amp;L</p>
            <p
              className={`text-lg font-semibold ${snapshot.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {snapshot.pnl >= 0 ? '+' : ''}
              {formatINR(snapshot.pnl)} ({snapshot.pnlPercent >= 0 ? '+' : ''}
              {snapshot.pnlPercent.toFixed(2)}%)
            </p>
            <p className="text-xs text-zinc-600 mt-1">Holdings ≈ {formatINR(snapshot.currentValue)}</p>
          </div>
        </section>
      ) : (
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-amber-200 text-sm">
          Could not load live P&amp;L: {snapshot.error} Chart below still works.
        </div>
      )}

      <TradingViewWidget
        title="NIFTYBEES — daily chart"
        scriptUrl={`${scriptUrl}advanced-chart.js`}
        config={CANDLE_CHART_WIDGET_CONFIG(NSE_NIFTY_ETF)}
        className="custom-chart"
        height={560}
        fullscreenLabel="Nifty 50 BeES — chart"
      />

      <p className="text-xs text-zinc-600">
        To change amount or &quot;days ago&quot;, we can add inputs or env vars later. Slippage, charges,
        and exact fill time are not included.
      </p>
    </div>
  );
}
