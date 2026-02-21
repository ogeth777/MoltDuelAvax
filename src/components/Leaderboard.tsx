import React, { useEffect, useState } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

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

export const Leaderboard: React.FC<LeaderboardProps> = ({ refreshKey, currentAddress }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('moltduel_xp_v1');
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
      list.sort((a, b) => b.xp - a.xp);
      list.forEach((entry, index) => {
        entry.rank = index + 1;
      });
      setEntries(list);
    } catch {
      setEntries([]);
    }
  }, [refreshKey, currentAddress]);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-avax-red/30 rounded-lg p-4 w-full max-w-sm h-fit">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-avax-red/20">
        <Trophy className="text-avax-red" size={20} />
        <h3 className="text-avax-red font-bold tracking-widest text-sm">TOP OPERATORS // XP</h3>
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
