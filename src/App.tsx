import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { AIAvatar } from './components/AIAvatar';
import { GameChat, type ChatMessage } from './components/GameChat';
import { Leaderboard } from './components/Leaderboard';
import { Roadmap } from './components/Roadmap';
import { playSound } from './utils/audio';
import logo from './assets/logo.jpg';
import avaxLogo from './assets/avalanche-symbol.png';
import { Scroll, Scissors, Trophy, Wallet, RefreshCw, Zap, Shield, Swords, Lock, Users, Droplets, Map, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameState = 'idle' | 'playing' | 'result';
type Winner = 'player' | 'ai' | 'draw' | null;
type Difficulty = 'easy' | 'medium' | 'hard';

const BET_AMOUNT = 100;

const DIFFICULTY_CONFIG = {
  easy: { multiplier: 2, label: 'EASY', color: 'text-green-400', border: 'border-green-400/50' },
  medium: { multiplier: 5, label: 'MEDIUM', color: 'text-yellow-400', border: 'border-yellow-400/50' },
  hard: { multiplier: 10, label: 'HARD', color: 'text-red-500', border: 'border-red-500/50' },
};

const BOT_MESSAGES = {
  start: ["System initialized.", "Waiting for input...", "I can see your cursor shaking."],
  win: ["Lucky guess.", "My algorithms missed that.", "Glitch in the matrix.", "You won... for now."],
  lose: ["Calculated.", "Too easy.", "Thanks for the $DUEL.", "Predictable human.", "Better luck next block."],
  draw: ["Copycat.", "Sync error.", "Great minds?", "Stalemate detected."]
};

function App() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [gameState, setGameState] = useState<GameState>('idle');
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [aiChoice, setAiChoice] = useState<Choice>(null);
  const [winner, setWinner] = useState<Winner>(null);
  const [winStreak, setWinStreak] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const addMessage = (sender: 'bot' | 'system', text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev.slice(-4), newMessage]); // Keep last 5 messages
  };

  useEffect(() => {
    playSound('start');
    addMessage('system', 'Connection established to MoltDuel Local Node');
    setTimeout(() => addMessage('bot', "Ready to lose some credits, human?"), 1000);
  }, []);

  // Force Avalanche Fuji Testnet
  useEffect(() => {
    if (isConnected && chainId !== 43113) {
      switchChain({ chainId: 43113 });
    }
  }, [isConnected, chainId, switchChain]);

  const handleChoice = (choice: Choice) => {
    if (gameState === 'playing') return;

    playSound('click');
    setGameState('playing');
    setPlayerChoice(choice);
    
    // Web3 Simulation Logic (Visuals only)
    const steps = ['Encrypting choice...', 'Hashing...', 'Submitting to mempool...', 'Confirming block...'];
    
    let step = 0;
    const interval = setInterval(() => {
        if (step < steps.length) {
            addMessage('system', steps[step]);
            step++;
        }
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      const choices: Choice[] = ['rock', 'paper', 'scissors'];
      
      let aiMove: Choice = null;
      
      // AI Logic based on Difficulty
      const randomMove = choices[Math.floor(Math.random() * choices.length)];
      
      if (difficulty === 'easy') {
        // 100% Random
        aiMove = randomMove;
      } else if (difficulty === 'medium') {
        // 30% Chance to Counter Player (Cheating)
        if (Math.random() < 0.3) {
          if (choice === 'rock') aiMove = 'paper';
          else if (choice === 'paper') aiMove = 'scissors';
          else aiMove = 'rock';
        } else {
          aiMove = randomMove;
        }
      } else if (difficulty === 'hard') {
        // 60% Chance to Counter Player (Cheating)
        if (Math.random() < 0.6) {
           if (choice === 'rock') aiMove = 'paper';
           else if (choice === 'paper') aiMove = 'scissors';
           else aiMove = 'rock';
        } else {
           aiMove = randomMove;
        }
      }
      
      // Fallback just in case
      if (!aiMove) aiMove = randomMove;

      setAiChoice(aiMove);
      determineWinner(choice, aiMove);
    }, 2500);
  };

  const determineWinner = (player: Choice, ai: Choice) => {
    let result: Winner = 'draw';
    
    if (player === ai) {
      result = 'draw';
    } else if (
      (player === 'rock' && ai === 'scissors') ||
      (player === 'paper' && ai === 'rock') ||
      (player === 'scissors' && ai === 'paper')
    ) {
      result = 'player';
    } else {
      result = 'ai';
    }

    setWinner(result);
    setGameState('result');

    if (result === 'player') {
      playSound('win');
      setWinStreak(prev => prev + 1);
      const msg = BOT_MESSAGES.win[Math.floor(Math.random() * BOT_MESSAGES.win.length)];
      setTimeout(() => addMessage('bot', msg), 500);
    } else if (result === 'ai') {
      playSound('lose');
      setWinStreak(0);
      const msg = BOT_MESSAGES.lose[Math.floor(Math.random() * BOT_MESSAGES.lose.length)];
      setTimeout(() => addMessage('bot', msg), 500);
    } else {
      const msg = BOT_MESSAGES.draw[Math.floor(Math.random() * BOT_MESSAGES.draw.length)];
      setTimeout(() => addMessage('bot', msg), 500);
    }
  };

  const resetGame = () => {
    playSound('click');
    setGameState('idle');
    setPlayerChoice(null);
    setAiChoice(null);
    setWinner(null);
  };

  const handleConnectWallet = () => {
    playSound('click');
    connect({ connector: injected(), chainId: 43113 });
    setShowWalletModal(false);
  };

  const getMood = () => {
    if (gameState === 'playing') return 'thinking';
    if (gameState === 'result') {
      if (winner === 'player') return 'angry';
      if (winner === 'ai') return 'happy';
    }
    return 'neutral';
  };

  return (
    <div className="min-h-screen flex flex-col font-rajdhani selection:bg-avax-red/30 bg-[#050505]">
      
      {/* HUD Header */}
      <header className="p-4 flex justify-between items-center fixed w-full z-50 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={logo} 
                alt="MoltDuel Logo" 
                className="w-12 h-12 object-cover rounded-none border border-avax-red/50 shadow-[0_0_15px_rgba(131,110,249,0.5)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron font-black text-2xl tracking-widest text-white glitch-wrapper" data-text="MOLTDUEL">MOLTDUEL</span>
              <span className="text-[10px] text-avax-accent tracking-[0.3em] uppercase">System v2.0.4</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-avax-red/10 border border-avax-red/20 text-[10px] font-medium text-avax-red">
            <div className="w-1.5 h-1.5 rounded-full bg-avax-red animate-pulse" />
            AVALANCHE FUJI TESTNET
          </div>

          <div className="h-8 w-px bg-white/10" />

          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all
              ${showLeaderboard 
                ? 'bg-avax-red/20 border-avax-red text-white shadow-[0_0_15px_rgba(131,110,249,0.3)]' 
                : 'bg-transparent border-white/10 text-gray-400 hover:text-avax-red hover:border-avax-red/50'}
            `}
          >
            <Users size={16} />
            <span className="font-orbitron font-bold text-xs tracking-wide hidden md:inline">LEADERBOARD</span>
          </button>
        </div>
        
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-xs font-bold">WIN STREAK: <span className="text-avax-red text-base">{winStreak}</span></span>
          </div>
          
          <button 
            onClick={() => {
              if (isConnected) {
                disconnect();
              } else {
                playSound('click');
                setShowWalletModal(true);
              }
            }}
            className={`flex items-center gap-2 border px-3 py-1.5 font-bold text-[10px] tracking-widest transition-all rounded hover:shadow-[0_0_15px_rgba(131,110,249,0.3)] ${
              isConnected 
                ? 'bg-avax-accent/10 border-avax-accent text-avax-accent'
                : 'bg-avax-red/20 hover:bg-avax-red/40 border-avax-red/50 text-avax-red'
            }`}
          >
            <Lock size={12} />
            {isConnected && address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'CONNECT WALLET'}
          </button>
        </div>
      </header>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-avax-red/5 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-orbitron font-bold text-xl text-white">CONNECT WALLET</h3>
                <button 
                  onClick={() => setShowWalletModal(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 relative z-10">
                <button
                  onClick={() => handleConnectWallet()}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-avax-red/10 border border-white/10 hover:border-avax-red/50 rounded-lg group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#181A26] flex items-center justify-center">
                      <img src="https://rabby.io/assets/logo.png" alt="Rabby" className="w-5 h-5" onError={(e) => e.currentTarget.src = 'https://placehold.co/20x20/blue/white?text=R'} />
                    </div>
                    <span className="font-bold text-gray-200 group-hover:text-white">Rabby Wallet</span>
                  </div>
                  {isConnecting && <div className="w-4 h-4 border-2 border-avax-red/30 border-t-avax-red rounded-full animate-spin" />}
                </button>

                <button
                  onClick={() => handleConnectWallet()}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-avax-red/10 border border-white/10 hover:border-avax-red/50 rounded-lg group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-200 group-hover:text-white">MetaMask</span>
                  </div>
                  {isConnecting && <div className="w-4 h-4 border-2 border-avax-red/30 border-t-avax-red rounded-full animate-spin" />}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-[10px] text-gray-500 font-mono">By connecting, you agree to the Terms of Service. Supported network: Avalanche Fuji Testnet.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Leaderboard Overlay */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-6 top-32 z-40"
          >
            <Leaderboard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap Modal */}
      <AnimatePresence>
        {showRoadmap && <Roadmap onClose={() => setShowRoadmap(false)} />}
      </AnimatePresence>

      {/* Main Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      {/* Avalanche Background Logo */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
        <motion.img 
          src={avaxLogo} 
          alt="Avalanche Background" 
          className="w-[140vh] h-[140vh] object-cover rounded-full mix-blend-screen grayscale transition-all duration-1000"
          animate={{ rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Roadmap Button (Fixed Bottom Left) */}
      <button
        onClick={() => setShowRoadmap(true)}
        className="fixed bottom-12 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-avax-accent hover:border-avax-accent/50 transition-all hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] group"
      >
        <Map size={18} className="group-hover:rotate-12 transition-transform" />
        <span className="font-orbitron font-bold text-xs tracking-wide">ROADMAP</span>
      </button>

      {/* BUILT ON AVALANCHE Badge */}
      <a 
        href="https://avax.network" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-12 right-6 z-50 flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-xl border border-avax-red/30 rounded-full hover:bg-avax-red/10 hover:border-avax-red/80 transition-all group shadow-[0_0_20px_rgba(131,110,249,0.15)] hover:shadow-[0_0_30px_rgba(131,110,249,0.4)]"
      >
        <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase group-hover:text-white transition-colors">BUILT ON</span>
        <div className="w-px h-4 bg-white/10 group-hover:bg-avax-red/50 transition-colors" />
        <img src={avaxLogo} alt="AVALANCHE" className="w-6 h-6 rounded-full group-hover:rotate-12 transition-transform" />
        <span className="font-orbitron font-bold text-avax-red group-hover:text-white transition-colors tracking-wide">AVALANCHE</span>
      </a>

      {/* Arena */}
      <main className="flex-1 flex flex-col items-center justify-center pt-48 pb-32 relative z-10">
        
        {/* VS Badge */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <Swords size={200} />
        </div>

        {/* AI Entity */}
        <div className="w-full max-w-2xl h-[200px] flex items-center justify-center relative mb-24">
          <div className="absolute inset-0 bg-avax-red/5 blur-[100px] rounded-full" />
          <AIAvatar mood={getMood()} />
          
          {/* Status Rings */}
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border border-dashed border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        {/* Interaction Area */}
        <div className="w-full max-w-4xl px-4 flex flex-col items-center mt-20">
          
          {/* Difficulty Selector */}
          {gameState === 'idle' && (
            <div className="flex gap-4 mb-8">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    playSound('click');
                    setDifficulty(d);
                  }}
                  className={`px-4 py-1.5 border ${
                    difficulty === d 
                      ? `${DIFFICULTY_CONFIG[d].border} bg-white/10 ${DIFFICULTY_CONFIG[d].color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                      : 'border-white/10 text-gray-500 hover:border-white/30'
                  } font-orbitron font-bold text-xs tracking-widest transition-all`}
                >
                  <span className="inline-block">
                    {DIFFICULTY_CONFIG[d].label} <span className="text-[10px] opacity-70 ml-1">x{DIFFICULTY_CONFIG[d].multiplier}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {gameState === 'result' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center w-full glass-panel p-8 border-t-4 border-b-4 border-avax-red"
              >
                <h2 className={`font-orbitron text-5xl md:text-7xl font-black italic tracking-tighter mb-4 ${
                  winner === 'player' ? 'text-avax-accent drop-shadow-[0_0_30px_rgba(32,227,178,0.5)]' :
                  winner === 'ai' ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]' :
                  'text-gray-400'
                }`}>
                  {winner === 'player' ? 'VICTORY' : winner === 'ai' ? 'DEFEAT' : 'DRAW'}
                </h2>

                <div className="flex justify-center items-center gap-8 mb-6">
                   <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-2">YOU</span>
                      <div className="text-4xl p-4 bg-white/5 rounded-full border border-white/10">
                        {playerChoice === 'rock' && '💎'}
                        {playerChoice === 'paper' && <Scroll size={32} className="text-avax-accent" />}
                        {playerChoice === 'scissors' && <Scissors size={32} className="text-avax-glow" />}
                      </div>
                   </div>
                   <div className="text-2xl font-bold text-white/20">VS</div>
                   <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-2">AI</span>
                      <div className="text-4xl p-4 bg-white/5 rounded-full border border-white/10">
                        {aiChoice === 'rock' && '💎'}
                        {aiChoice === 'paper' && <Scroll size={32} className="text-avax-accent" />}
                        {aiChoice === 'scissors' && <Scissors size={32} className="text-avax-glow" />}
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="text-2xl font-bold font-orbitron">
                    {winner === 'player' ? (
                      <span className="text-avax-accent flex items-center gap-2">
                        <Zap className="fill-current" /> YOU WIN
                      </span>
                    ) : winner === 'ai' ? (
                      <span className="text-red-500 flex items-center gap-2">
                        <Shield className="fill-current" /> YOU LOSE
                      </span>
                    ) : (
                      <span className="text-gray-400">DRAW GAME</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={resetGame}
                  className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none border border-white/20 hover:border-white/50 transition-all"
                >
                  <div className="absolute inset-0 w-0 bg-white/10 transition-all duration-[250ms] ease-out group-hover:w-full" />
                  <span className="relative flex items-center gap-3 font-orbitron font-bold text-xl">
                    <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" /> 
                    REBOOT SYSTEM
                  </span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-3 gap-4 w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CyberCard 
                  icon={<div className="text-2xl md:text-4xl mb-2">💎</div>}
                  title="ROCK"
                  subtitle="CRUSHES SCISSORS"
                  onClick={() => handleChoice('rock')}
                  disabled={gameState === 'playing'}
                  delay={0}
                />
                <CyberCard 
                  icon={<Scroll size={32} className="text-avax-accent mb-2" />}
                  title="PAPER"
                  subtitle="COVERS ROCK"
                  onClick={() => handleChoice('paper')}
                  disabled={gameState === 'playing'}
                  delay={0.1}
                />
                <CyberCard 
                  icon={<Scissors size={32} className="text-avax-glow mb-2" />}
                  title="SCISSORS"
                  subtitle="CUTS PAPER"
                  onClick={() => handleChoice('scissors')}
                  disabled={gameState === 'playing'}
                  delay={0.2}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {gameState === 'idle' && (
            <div className="mt-12 flex items-center gap-4 opacity-50">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/50" />
              <p className="font-orbitron text-sm tracking-[0.2em] text-avax-accent animate-pulse">
                INITIATE PROTOCOL // READY FOR BATTLE
              </p>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/50" />
            </div>
          )}
        </div>
      </main>

      <GameChat messages={messages} />
      
      {/* Footer */}
      <footer className="fixed bottom-0 w-full p-2 bg-[#050505]/80 backdrop-blur-md border-t border-white/5 flex justify-between px-6 text-[10px] font-mono text-gray-600 uppercase tracking-widest z-50">
        <div>Node: AVX-9942 [ACTIVE]</div>
        <div className="flex gap-4">
          <span>Latency: 12ms</span>
          <span>Block: #99,234,121</span>
        </div>
      </footer>
    </div>
  );
}

const CyberCard = ({ icon, title, subtitle, onClick, disabled, delay }: any) => (
  <motion.button
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    disabled={disabled}
    className={`
      relative group h-[140px] md:h-[180px] w-full
      flex flex-col items-center justify-center
      bg-[#0A0A0A] border border-white/10
      hover:border-avax-red/50 hover:bg-avax-red/5
      transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      overflow-hidden rounded-xl
    `}
  >
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/20 group-hover:border-avax-red transition-colors" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/20 group-hover:border-avax-red transition-colors" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/20 group-hover:border-avax-red transition-colors" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/20 group-hover:border-avax-red transition-colors" />

    <div className="relative z-10 flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-300">
      <div className="p-3 rounded-full bg-white/5 border border-white/5 group-hover:border-avax-red/30 group-hover:shadow-[0_0_30px_rgba(131,110,249,0.2)] transition-all">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-orbitron font-bold text-lg tracking-wider text-gray-200 group-hover:text-white mb-1">{title}</h3>
        <p className="text-[9px] tracking-[0.2em] text-gray-500 group-hover:text-avax-accent">{subtitle}</p>
      </div>
    </div>
  </motion.button>
);

export default App;
