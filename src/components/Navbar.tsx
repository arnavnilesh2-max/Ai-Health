import React from 'react';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Users, 
  User, 
  Bot, 
  Volume2, 
  VolumeX,
  LayoutDashboard
} from 'lucide-react';
import { UserProfile } from '../types';
import { getLevelFromXP, getRankTitle } from '../utils/fitnessCalculators';

interface NavbarProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfileModal: () => void;
  onOpenCoachDrawer: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenProfileModal,
  onOpenCoachDrawer,
  soundEnabled,
  setSoundEnabled,
}) => {
  const { level, progressPercent } = getLevelFromXP(user.xp);
  const rankTitle = getRankTitle(level);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts & Game', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition & Recipes', icon: Utensils },
    { id: 'progress', label: 'Progress Charts', icon: TrendingUp },
    { id: 'social', label: 'Social Feed', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.15)]">
              <div className="w-full h-full bg-[#050505] rounded-xl flex items-center justify-center border border-[#ccff00]/30">
                <Dumbbell className="w-5 h-5 text-[#ccff00]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight text-white font-mono">
                  Fit<span className="text-[#ccff00]">Quest</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-[#ccff00] text-black rounded uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono hidden sm:block uppercase tracking-wider">Gamified Fitness Protocol</p>
            </div>
          </div>

          {/* Gamified HUD Badges (Level, XP, Coins, Streak) */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Level & XP */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3.5 py-1.5 flex items-center space-x-3 backdrop-blur-md">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center font-black text-[#ccff00] text-sm font-mono shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                  {level}
                </div>
              </div>
              <div className="w-28">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-300 mb-1">
                  <span className="uppercase tracking-wider">{rankTitle.split(' ')[0]}</span>
                  <span className="text-[#ccff00] font-mono">{user.xp} XP</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-[#ccff00] h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(204,255,0,0.6)]" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Coins */}
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl px-3 py-1.5 flex items-center space-x-1.5 font-bold font-mono text-xs">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span>{user.coins}</span>
            </div>

            {/* Streak */}
            <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-2xl px-3 py-1.5 flex items-center space-x-1.5 font-bold font-mono text-xs">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400/40 animate-pulse" />
              <span>{user.streakDays}d Streak</span>
            </div>
          </div>

          {/* Action Tools & User Profile Trigger */}
          <div className="flex items-center space-x-2.5">
            
            {/* AI Coach Trigger */}
            <button
              onClick={onOpenCoachDrawer}
              className="flex items-center space-x-1.5 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              title="Ask FitBot AI Coach"
            >
              <Bot className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10"
              title={soundEnabled ? "Mute SFX" : "Enable SFX"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#ccff00]" /> : <VolumeX className="w-5 h-5 text-zinc-600" />}
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2.5 p-1 rounded-2xl hover:bg-white/10 border border-white/10 transition group"
              title="Edit Profile & Body Metrics"
            >
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#ccff00]/40 group-hover:ring-[#ccff00]"
              />
              <span className="text-xs font-bold text-zinc-200 hidden lg:inline tracking-tight">{user.name}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-2.5 border-t border-white/10 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
                  isActive
                    ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_12px_rgba(204,255,0,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#ccff00]' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

