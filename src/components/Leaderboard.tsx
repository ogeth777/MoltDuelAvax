import React, { useEffect, useState } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  address: string;
  winnings: number;
  isUser?: boolean;
}

const generateMockData = (): LeaderboardEntry[] => {
  return []; // Start empty
};

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries([]);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-avax-red/30 rounded-lg p-4 w-full max-w-sm h-fit">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-avax-red/20">
        <Trophy className="text-avax-red" size={20} />
        <h3 className="text-avax-red font-bold tracking-widest text-sm">TOP GLADIATORS</h3>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <motion.div 
            key={entry.rank} // Use rank as key for simple reordering anims, or address if stable
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center justify-between p-2 rounded ${
              entry.rank === 1 ? 'bg-avax-red/20 border border-avax-red/50 shadow-[0_0_10px_rgba(131,110,249,0.2)]' : 'bg-white/5 hover:bg-white/10'
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
              <span className="font-mono text-xs text-gray-300">{entry.address}</span>
            </div>
            <div className="font-mono text-xs font-bold text-avax-red">
              {entry.winnings.toLocaleString()} $DUEL
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
