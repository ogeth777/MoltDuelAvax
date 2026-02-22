import { getSupabase } from '../lib/supabase';

export type LeaderboardStats = {
  xp: number;
  wins: number;
  losses: number;
};

export type LeaderboardRow = LeaderboardStats & {
  address: string;
  updated_at?: string;
};

export async function upsertLeaderboard(address: string, data: LeaderboardStats): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const payload: LeaderboardRow = {
      address: address.toLowerCase(),
      xp: data.xp ?? 0,
      wins: data.wins ?? 0,
      losses: data.losses ?? 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from('leaderboard').upsert(payload, { onConflict: 'address' });
    if (error) return false;
    return true;
  } catch {
    return false;
  }
}

export async function fetchLeaderboard(limit = 100): Promise<LeaderboardRow[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('leaderboard')
      .select('address,xp,wins,losses,updated_at')
      .order('xp', { ascending: false })
      .limit(limit);
    if (error) return null;
    const rows = (data ?? []).map((d) => ({
      address: d.address.toLowerCase(),
      xp: d.xp ?? 0,
      wins: d.wins ?? 0,
      losses: d.losses ?? 0,
      updated_at: d.updated_at,
    }));
    return rows.filter((r) => r.xp > 0 || r.wins > 0 || r.losses > 0);
  } catch {
    return null;
  }
}
