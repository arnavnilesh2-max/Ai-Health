import React from 'react';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Dumbbell, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Activity, 
  User, 
  Zap, 
  Award,
  ArrowUpRight,
  TrendingUp,
  Utensils
} from 'lucide-react';
import { UserProfile, DailyQuest, Exercise, AIFitnessPlanResponse } from '../types';
import { getLevelFromXP, getRankTitle, calculateBMI, calculateBMR, calculateTDEE, calculateTargetCalories, calculateTargetMacros } from '../utils/fitnessCalculators';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  user: UserProfile;
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onStartWorkout: (exercise: Exercise) => void;
  onNavigateTab: (tab: string) => void;
  onOpenProfileModal: () => void;
  aiPlan: AIFitnessPlanResponse | null;
  defaultExercises: Exercise[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  quests,
  onClaimQuest,
  onStartWorkout,
  onNavigateTab,
  onOpenProfileModal,
  aiPlan,
  defaultExercises
}) => {
  const { level, currentLevelXp, nextLevelXp, progressPercent } = getLevelFromXP(user.xp);
  const rankTitle = getRankTitle(level);

  // Body math
  const { bmi, category } = calculateBMI(user.weightKg, user.heightCm);
  const bmr = calculateBMR(user.weightKg, user.heightCm, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, user.goal);
  const macros = calculateTargetMacros(targetCalories, user.weightKg, user.goal, user.bodyStructure);

  // Recommended Exercise
  const recommendedExercise = defaultExercises.find(e => e.suitableBodyStructures.includes(user.bodyStructure)) || defaultExercises[0];

  const handleQuestClaim = (q: DailyQuest) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClaimQuest(q.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: RPG Character Status & Gamified Profile */}
      <div className="glass rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Avatar & RPG Status */}
          <div className="lg:col-span-5 flex items-center space-x-4">
            <div className="relative shrink-0">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-[#ccff00]/50 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#ccff00] text-black font-black text-xs px-2.5 py-1 rounded-lg border border-[#050505] shadow-md uppercase tracking-wider">
                LVL {level}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">{user.name}</h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10 font-bold uppercase tracking-wider">
                  {user.bodyStructure}
                </span>
              </div>
              <p className="text-xs text-[#ccff00] font-bold font-mono mt-0.5 uppercase tracking-wide">{rankTitle}</p>
              
              {/* XP Bar */}
              <div className="mt-3 w-full sm:w-64">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">
                  <span>Level Progress</span>
                  <span className="text-[#ccff00] font-mono font-bold">{currentLevelXp} / {nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-[#050505] border border-white/10 rounded-full h-2.5 p-0.5">
                  <div 
                    className="bg-[#ccff00] h-1.5 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(204,255,0,0.5)]" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Weight</span>
              <div className="mt-2">
                <span className="text-xl font-black font-mono text-white">{user.weightKg}</span>
                <span className="text-xs text-zinc-500 ml-1">kg</span>
              </div>
              <span className="text-[10px] text-[#ccff00] mt-1 font-bold font-mono">Target: {user.targetWeightKg}kg</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">BMI</span>
              <div className="mt-2">
                <span className="text-xl font-black font-mono text-white">{bmi}</span>
              </div>
              <span className="text-[10px] text-cyan-400 mt-1 font-bold uppercase">{category}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Calorie Target</span>
              <div className="mt-2">
                <span className="text-xl font-black font-mono text-amber-400">{targetCalories}</span>
                <span className="text-xs text-zinc-500 ml-1">kcal</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 font-mono">TDEE: {tdee} kcal</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Protein</span>
              <div className="mt-2">
                <span className="text-xl font-black font-mono text-[#ccff00]">{macros.proteinGrams}</span>
                <span className="text-xs text-zinc-500 ml-1">g/day</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold">Goal: {user.goal.replace('_', ' ')}</span>
            </div>
          </div>

        </div>
      </div>

      {/* AI Personalized Body & Metabolism Summary Banner (if AI plan applied) */}
      {aiPlan ? (
        <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl p-5 text-zinc-200 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-[#ccff00] font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Protocol Recommendation for {user.bodyStructure}</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-300 font-medium">{aiPlan.bodySummary}</p>
        </div>
      ) : (
        <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Generate Tailored AI Fitness Protocol</h3>
              <p className="text-xs text-zinc-400">Get customized exercises and diet breakdown based on your height, weight, age, and {user.bodyStructure} structure.</p>
            </div>
          </div>
          <button
            onClick={onOpenProfileModal}
            className="w-full sm:w-auto shrink-0 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl text-xs transition shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            Configure Body Metrics
          </button>
        </div>
      )}

      {/* Main Grid: Daily Quests + Recommended Exercise */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Daily Quests */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 space-y-4 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Current Missions &amp; Quests</h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 rounded-lg border border-[#ccff00]/30">
              {quests.filter(q => q.completed).length} / {quests.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {quests.map((q) => {
              const progressPct = Math.min(100, Math.round((q.current / q.target) * 100));
              return (
                <div 
                  key={q.id}
                  className={`p-4 rounded-2xl border transition ${
                    q.completed 
                      ? 'bg-[#ccff00]/10 border-[#ccff00]/30' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{q.title}</span>
                        {q.completed && <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{q.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        +{q.xpReward} XP
                      </span>
                      {q.completed ? (
                        <span className="text-xs font-black text-black bg-[#ccff00] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          Claimed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleQuestClaim(q)}
                          className="bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg transition shadow-[0_0_10px_rgba(204,255,0,0.2)]"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1 font-mono">
                      <span className="uppercase tracking-widest text-[9px] text-zinc-500">Progress</span>
                      <span>{q.current} / {q.target} {q.unit}</span>
                    </div>
                    <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/10">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${q.completed ? 'bg-[#ccff00]' : 'bg-[#ccff00]'}`} 
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Recommended Workout & Quick Navigation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Start Recommended Exercise */}
          <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 rounded-lg border border-[#ccff00]/30">
                Recommended Protocol
              </span>
              <span className="text-xs text-zinc-400 font-mono">{recommendedExercise.durationMinutes} mins</span>
            </div>

            <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight">{recommendedExercise.title}</h3>
            <p className="text-xs text-zinc-400 mb-4 line-clamp-2 leading-relaxed">{recommendedExercise.description}</p>

            <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-2xl border border-white/10 mb-4 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Target Zone</span>
                <span className="font-bold text-white">{recommendedExercise.targetBodyPart}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Reward</span>
                <span className="font-black text-[#ccff00] font-mono">+{recommendedExercise.xpReward} XP / +{recommendedExercise.coinsReward} Coins</span>
              </div>
            </div>

            <button
              onClick={() => onStartWorkout(recommendedExercise)}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-black py-3 rounded-2xl flex items-center justify-center space-x-2 transition shadow-[0_0_20px_rgba(204,255,0,0.25)] uppercase tracking-wider text-xs"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>Start Game Workout Mode</span>
            </button>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('nutrition')}
              className="p-4 glass rounded-2xl text-left transition group border border-white/10 hover:border-[#ccff00]/40 hover:bg-white/10"
            >
              <Utensils className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Fuel Protocol</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">High-protein recipes &lt;15m</p>
            </button>

            <button
              onClick={() => onNavigateTab('progress')}
              className="p-4 glass rounded-2xl text-left transition group border border-white/10 hover:border-[#ccff00]/40 hover:bg-white/10"
            >
              <TrendingUp className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Vitals History</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Weight, calories &amp; XP analytics</p>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

