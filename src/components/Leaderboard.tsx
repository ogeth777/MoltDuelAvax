import React, { useEffect, useState } from 'react';
import { Trophy, Crown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchLeaderboard } from '../services/leaderboard';

interface LeaderboardEntry {
  rank: number;
  address: string;
  xp: number;
  wins: number;
  losses: number;
  isUser?: boolean;
}

interface LeaderboardProps {
  refreshKey?: number;
  currentAddress?: string;
}

const STORAGE_KEY = 'moltduel_xp_v2';

export const Leaderboard: React.FC<LeaderboardProps> = ({ refreshKey, currentAddress }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [manualRefresh, setManualRefresh] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cloud = await fetchLeaderboard(100);
      if (cloud && cloud.length > 0) {
        const filteredCloud = cloud.filter((r) => r.xp > 0 || r.wins > 0 || r.losses > 0);
        if (filteredCloud.length === 0) {
          setEntries([]);
          return;
        }
        const mapped: LeaderboardEntry[] = filteredCloud.map((r, idx) => ({
          rank: idx + 1,
          address: r.address,
          xp: r.xp,
          wins: r.wins,
          losses: r.losses,
          isUser: currentAddress ? r.address.toLowerCase() === currentAddress.toLowerCase() : false,
        }));
        setEntries(mapped);
        setLoading(false);
        return;
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setEntries([]);
          return;
        }
        const parsed = JSON.parse(raw) as Record<string, { xp: number; wins: number; losses: number }>;
        const list: LeaderboardEntry[] = Object.entries(parsed).map(([addr, stats]) => ({
          rank: 0,
          address: addr,
          xp: stats.xp,
          wins: stats.wins,
          losses: stats.losses,
          isUser: currentAddress ? addr.toLowerCase() === currentAddress.toLowerCase() : false,
        }));
        const filtered = list.filter((e) => e.xp > 0 || e.wins > 0 || e.losses > 0);
        if (filtered.length === 0) {
          setEntries([]);
          setLoading(false);
          return;
        }
        filtered.sort((a, b) => b.xp - a.xp);
        filtered.forEach((entry, index) => {
          entry.rank = index + 1;
        });
        setEntries(filtered);
        setLoading(false);
      } catch {
        setEntries([]);
        setLoading(false);
      }
    })();
  }, [refreshKey, currentAddress, manualRefresh]);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-avax-red/30 rounded-lg p-4 w-full max-w-sm h-fit">
      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-avax-red/20">
        <div className="flex items-center gap-2">
          <Trophy className="text-avax-red" size={20} />
          <h3 className="text-avax-red font-bold tracking-widest text-sm">TOP OPERATORS // XP</h3>
        </div>
        <button
          onClick={() => setManualRefresh(v => v + 1)}
          disabled={loading}
          className="flex items-center gap-1 px-2 py-1 rounded border border-avax-red/40 text-[10px] text-avax-red hover:bg-avax-red/10 disabled:opacity-40 disabled:cursor-default transition-all"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          <span>REFRESH</span>
        </button>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const short =
            entry.address.length > 10
              ? `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`
              : entry.address;
          return (
          <motion.div 
            key={entry.rank} // Use rank as key for simple reordering anims, or address if stable
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center justify-between p-2 rounded ${
              entry.rank === 1
                ? 'bg-avax-red/20 border border-avax-red/50 shadow-[0_0_10px_rgba(131,110,249,0.2)]'
                : entry.isUser
                ? 'bg-white/10 border border-avax-red/40'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs ${
                entry.rank === 1 ? 'text-yellow-400' : 
                entry.rank === 2 ? 'text-gray-300' :
                entry.rank === 3 ? 'text-amber-600' : 'text-gray-500'
              }`}>
                {entry.rank === 1 ? <Crown size={14} /> : `#${entry.rank}`}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-gray-300">{short}</span>
                <span className="font-mono text-[10px] text-gray-500">
                  {entry.wins}W / {entry.losses}L
                </span>
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-avax-red">
              {entry.xp.toLocaleString()} XP
            </div>
          </motion.div>
        );
        })}
      </div>
    </div>
  );
};
