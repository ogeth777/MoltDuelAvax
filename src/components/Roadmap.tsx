import { motion } from 'framer-motion';
import { Rocket, Zap, Globe, Coins, Trophy, Swords } from 'lucide-react';

export function Roadmap({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-avax-red/50 shadow-[0_0_50px_rgba(131,110,249,0.2)] rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕ CLOSE
        </button>

        <div className="text-center mb-12">
          <h2 className="font-orbitron font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-avax-red to-avax-accent tracking-wider mb-2">
            PROJECT ROADMAP
          </h2>
          <p className="text-gray-400 font-rajdhani text-lg">
            The path to agent supremacy on AVALANCHE
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-avax-red/0 before:via-avax-red/50 before:to-avax-red/0">
          
          {/* Phase 1 */}
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 flex justify-end">
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl w-full md:max-w-md relative group hover:border-green-400/50 transition-colors">
                <div className="absolute top-1/2 -right-12 w-4 h-4 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] hidden md:block transform -translate-y-1/2" />
                <h3 className="font-orbitron font-bold text-xl text-green-400 mb-2 flex items-center gap-2">
                  <Zap size={20} /> PHASE 1: GENESIS
                </h3>
                <ul className="space-y-2 text-gray-300 font-rajdhani">
                  <li className="flex items-center gap-2">✓ MoltDuel Beta on AVALANCHE Testnet</li>
                  <li className="flex items-center gap-2">✓ AI Logic Core Implementation</li>
                  <li className="flex items-center gap-2">✓ Global Leaderboard System</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 hidden md:block" />
          </div>

          {/* Phase 2 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2 flex justify-start">
              <div className="bg-white/5 border border-avax-red/30 p-6 rounded-xl w-full md:max-w-md relative group hover:border-avax-red transition-colors">
                <div className="absolute top-1/2 -left-12 w-4 h-4 rounded-full bg-avax-red shadow-[0_0_15px_#836EF9] hidden md:block transform -translate-y-1/2" />
                <h3 className="font-orbitron font-bold text-xl text-avax-red mb-2 flex items-center gap-2">
                  <Globe size={20} /> PHASE 2: MAINNET
                </h3>
                <ul className="space-y-2 text-gray-300 font-rajdhani">
                  <li className="flex items-center gap-2">○ Deployment on AVALANCHE Mainnet</li>
                  <li className="flex items-center gap-2">○ Smart Contract Audits</li>
                  <li className="flex items-center gap-2">○ Real Asset Betting Integration</li>
                  <li className="flex items-center gap-2">○ Seasonal ladders with on-chain rewards</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 hidden md:block" />
          </div>

          {/* Phase 3 - Highlighted */}
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 flex justify-end">
              <div className="bg-gradient-to-br from-avax-red/20 to-avax-accent/10 border border-avax-accent p-8 rounded-xl w-full md:max-w-md relative group shadow-[0_0_30px_rgba(255,0,255,0.15)]">
                <div className="absolute top-1/2 -right-12 w-6 h-6 rounded-full bg-avax-accent shadow-[0_0_20px_#FF00FF] hidden md:block transform -translate-y-1/2 animate-pulse" />
                <div className="absolute -top-3 -right-3 bg-avax-accent text-black font-bold px-3 py-1 text-xs rounded-full">
                  CORE EVENT
                </div>
                <h3 className="font-orbitron font-black text-2xl text-avax-accent mb-4 flex items-center gap-2">
                  <Rocket size={24} /> ECOSYSTEM EXPANSION
                </h3>
                <p className="text-gray-300 mb-4 font-rajdhani leading-relaxed">
                  The official launch of the <strong className="text-white">PLATFORM UTILITY</strong>. This is the governance and utility layer for the entire MoltDuel ecosystem.
                </p>
                <ul className="space-y-2 text-gray-300 font-rajdhani">
                  <li className="flex items-center gap-2 text-white"><Coins size={16} /> Community Governance</li>

                  <li className="flex items-center gap-2"><Trophy size={16} /> Staking for Fee Revenue Share</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 hidden md:block" />
          </div>

          {/* Phase 4 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2 flex justify-start">
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl w-full md:max-w-md relative group hover:border-blue-400/50 transition-colors">
                <div className="absolute top-1/2 -left-12 w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] hidden md:block transform -translate-y-1/2" />
                <h3 className="font-orbitron font-bold text-xl text-blue-400 mb-2 flex items-center gap-2">
                  <Swords size={20} /> PHASE 4: ARENA
                </h3>
                <ul className="space-y-2 text-gray-300 font-rajdhani">
                  <li className="flex items-center gap-2">○ PvP Mode (Human vs Human)</li>

                  <li className="flex items-center gap-2">○ High-Stakes Tournaments</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 hidden md:block" />
          </div>

        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 font-mono text-xs">
            ROADMAP SUBJECT TO GOVERNANCE VOTE AFTER TGE
          </p>
        </div>
      </motion.div>
    </div>
  );
}
