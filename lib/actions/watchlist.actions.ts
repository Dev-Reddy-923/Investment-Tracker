'use server';

import { createClient, hasSupabase } from '@/lib/supabase/server';

export async function getWatchlistSymbols(): Promise<string[]> {
  if (!hasSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('watchlist')
      .select('symbol')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });
    if (error) {
      console.error('getWatchlistSymbols error:', error);
      return [];
    }
    return (data ?? []).map((r) => String(r.symbol));
  } catch (err) {
    console.error('getWatchlistSymbols error:', err);
    return [];
  }
}

/** Used by Inngest when auth is enabled. */
export async function getWatchlistSymbolsByEmail(_email: string): Promise<string[]> {
  return [];
}

export async function addToWatchlist(symbol: string, company: string): Promise<{ ok: boolean; error?: string }> {
  if (!symbol?.trim() || !hasSupabase()) return { ok: false, error: 'Missing symbol or Supabase not configured' };
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not signed in' };
    const { error } = await supabase.from('watchlist').insert({
      user_id: user.id,
      symbol: symbol.trim().toUpperCase(),
      company: (company || symbol).trim(),
    });
    if (error) {
      if (error.code === '23505') return { ok: true };
      console.error('addToWatchlist error:', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { ok: false, error: String(err) };
  }
}

export async function removeFromWatchlist(symbol: string): Promise<{ ok: boolean; error?: string }> {
  if (!symbol?.trim() || !hasSupabase()) return { ok: false, error: 'Missing symbol or Supabase not configured' };
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not signed in' };
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('symbol', symbol.trim().toUpperCase());
    if (error) {
      console.error('removeFromWatchlist error:', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { ok: false, error: String(err) };
  }
}
