import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Play, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Flame, 
  Trophy, 
  Coins, 
  RotateCcw, 
  Pause, 
  X, 
  Zap, 
  Filter, 
  Share2,
  ChevronRight,
  Info
} from 'lucide-react';
import { Exercise, UserProfile, WorkoutSession } from '../types';
import confetti from 'canvas-confetti';

interface WorkoutsViewProps {
  user: UserProfile;
  exercises: Exercise[];
  onCompleteWorkout: (session: WorkoutSession) => void;
  onShareToSocial: (content: string, stats: { label: string; value: string }) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  user,
  exercises,
  onCompleteWorkout,
  onShareToSocial
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeWorkout, setActiveWorkout] = useState<Exercise | null>(null);
  
  // Active Workout Game State
  const [workoutTimer, setWorkoutTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // AI Generator state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customExercisePrompt, setCustomExercisePrompt] = useState<string>('');
  const [aiCustomExercises, setAiCustomExercises] = useState<Exercise[]>([]);

  // Categories
  const categories = ['All', 'Suitable for Me', 'Calisthenics', 'HIIT', 'Strength', 'Cardio', 'Flexibility'];

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeWorkout]);

  const handleStartWorkout = (ex: Exercise) => {
    setActiveWorkout(ex);
    setWorkoutTimer(0);
    setIsTimerRunning(true);
    setCompletedSteps([]);
    setIsVictory(false);
  };

  const handleToggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleFinishWorkout = () => {
    if (!activeWorkout) return;
    setIsTimerRunning(false);
    setIsVictory(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const session: WorkoutSession = {
      id: 'session-' + Date.now(),
      exerciseId: activeWorkout.id,
      exerciseTitle: activeWorkout.title,
      durationSeconds: workoutTimer,
      caloriesBurned: activeWorkout.caloriesBurned,
      xpEarned: activeWorkout.xpReward,
      coinsEarned: activeWorkout.coinsReward,
      completedAt: new Date().toISOString()
    };

    onCompleteWorkout(session);
  };

  const handleShareAchievement = () => {
    if (!activeWorkout) return;
    const durationMins = Math.max(1, Math.round(workoutTimer / 60));
    onShareToSocial(
      `Smashed the ${activeWorkout.title} routine in game mode! Body feeling fully primed and energized! ⚡💪`,
      {
        label: 'Workout Victory',
        value: `${durationMins} Mins • ${activeWorkout.caloriesBurned} kcal • +${activeWorkout.xpReward} XP`
      }
    );
    setActiveWorkout(null);
  };

  const handleGenerateAIExercise = async () => {
    if (!customExercisePrompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/fitness-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heightCm: user.heightCm,
          weightKg: user.weightKg,
          age: user.age,
          gender: user.gender,
          bodyStructure: user.bodyStructure,
          goal: customExercisePrompt || user.goal,
          activityLevel: user.activityLevel
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestedExercises && data.suggestedExercises.length > 0) {
          const generated: Exercise[] = data.suggestedExercises.map((ex: any, idx: number) => ({
            id: 'ai-ex-' + Date.now() + '-' + idx,
            title: ex.title,
            category: ex.category || 'HIIT',
            targetBodyPart: ex.targetBodyPart,
            suitableBodyStructures: [user.bodyStructure],
            durationMinutes: ex.durationMinutes || 20,
            sets: ex.sets || 4,
            reps: ex.reps || '12 reps',
            caloriesBurned: ex.caloriesBurned || 200,
            xpReward: 180,
            coinsReward: 45,
            difficulty: ex.difficulty || 'Intermediate',
            description: ex.whySuitable || 'Custom AI generated exercise routine.',
            steps: ex.steps || ['Warm up for 2 mins', 'Perform main sets', 'Cool down']
          }));
          setAiCustomExercises([...generated, ...aiCustomExercises]);
          setCustomExercisePrompt('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const allExercises = [...aiCustomExercises, ...exercises];
  const filteredExercises = allExercises.filter(ex => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Suitable for Me') return ex.suitableBodyStructures.includes(user.bodyStructure);
    return ex.category === selectedCategory;
  });

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2 tracking-tight">
            <Dumbbell className="w-6 h-6 text-[#ccff00]" />
            <span className="uppercase">Strategic Exercises &amp; Workouts</span>
          </h1>
          <p className="text-xs text-zinc-400">Playable exercise routines tailored for your <span className="text-[#ccff00] font-bold">{user.bodyStructure}</span> body structure.</p>
        </div>

        {/* AI Quick Routine Generator Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="e.g. Abs & Core for Ectomorph..."
            value={customExercisePrompt}
            onChange={(e) => setCustomExercisePrompt(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] w-48 sm:w-64"
          />
          <button
            onClick={handleGenerateAIExercise}
            disabled={isGenerating || !customExercisePrompt}
            className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition disabled:opacity-50 shrink-0 shadow-[0_0_12px_rgba(204,255,0,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating...' : 'AI Routine'}</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                : 'glass text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercises List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((ex) => (
          <div 
            key={ex.id}
            className="glass rounded-3xl p-5 flex flex-col justify-between transition shadow-xl border border-white/10 hover:border-[#ccff00]/40 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded border border-[#ccff00]/30">
                  {ex.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{ex.durationMinutes}m</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-[#ccff00] transition mb-1 uppercase tracking-tight">{ex.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{ex.description}</p>

              <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-2xl border border-white/10">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Target Area</span>
                  <span className="font-bold text-white">{ex.targetBodyPart}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Est. Calories</span>
                  <span className="font-mono font-bold text-amber-400">{ex.caloriesBurned} kcal</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Quest Reward</span>
                  <span className="font-mono font-bold text-[#ccff00]">+{ex.xpReward} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartWorkout(ex)}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold py-2.5 rounded-xl border border-[#ccff00] flex items-center justify-center space-x-2 transition uppercase tracking-wider text-xs shadow-[0_0_12px_rgba(204,255,0,0.2)]"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Start Game Workout</span>
            </button>
          </div>
        ))}
      </div>

      {/* ACTIVE WORKOUT GAME MODE MODAL */}
      {activeWorkout && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white shadow-2xl p-6 relative border border-white/10">
            
            {/* Close Button */}
            <button
              onClick={() => {
                if (confirm('Cancel workout session? Progress won\'t be saved.')) {
                  setActiveWorkout(null);
                }
              }}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!isVictory ? (
              <div className="space-y-6">
                
                {/* Header */}
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black text-[#ccff00] uppercase tracking-widest mb-1">
                    <Zap className="w-4 h-4 fill-[#ccff00]" />
                    <span>ACTIVE GAME WORKOUT SESSION</span>
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{activeWorkout.title}</h2>
                  <p className="text-xs text-zinc-400 font-mono">{activeWorkout.targetBodyPart}</p>
                </div>

                {/* Gamified Live HUD (Timer & Calories Burned) */}
                <div className="grid grid-cols-3 gap-3 bg-black/50 p-4 rounded-2xl border border-white/10 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Elapsed Time</span>
                    <span className="text-2xl font-black font-mono text-[#ccff00] neon-text-glow">{formatTimer(workoutTimer)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Est. Burn</span>
                    <span className="text-2xl font-black font-mono text-amber-400">{activeWorkout.caloriesBurned} <span className="text-xs">kcal</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Completion</span>
                    <span className="text-2xl font-black font-mono text-cyan-400">
                      {Math.round((completedSteps.length / activeWorkout.steps.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Exercise Steps Interactive Checklist */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    Movement &amp; Sets Queue
                  </h3>
                  <div className="space-y-2.5">
                    {activeWorkout.steps.map((step, idx) => {
                      const isDone = completedSteps.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleStep(idx)}
                          className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                            isDone 
                              ? 'bg-[#ccff00]/15 border-[#ccff00]/50 text-[#ccff00]' 
                              : 'bg-black/40 border-white/10 text-zinc-200 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                              isDone ? 'bg-[#ccff00] text-black' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className="text-xs font-semibold">{step}</span>
                          </div>
                          {isDone ? (
                            <CheckCircle className="w-5 h-5 text-[#ccff00] shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-zinc-700 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Workout Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-white/10 transition"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-[#ccff00]" />}
                    <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                  </button>

                  <button
                    onClick={handleFinishWorkout}
                    className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-black py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                  >
                    <Trophy className="w-4 h-4 text-black" />
                    <span>Finish Workout &amp; Claim XP</span>
                  </button>
                </div>

              </div>
            ) : (
              /* VICTORY SCREEN */
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center text-4xl shadow-2xl animate-bounce">
                  🏆
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">WORKOUT VICTORY!</h2>
                  <p className="text-xs text-[#ccff00] font-bold mt-1 font-mono uppercase tracking-wider">You earned +{activeWorkout.xpReward} XP &amp; +{activeWorkout.coinsReward} Coins!</p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto bg-black/50 p-4 rounded-2xl border border-white/10 font-mono text-sm">
                  <div>
                    <span className="text-xs text-zinc-500 block font-sans uppercase tracking-widest text-[10px]">Time Completed</span>
                    <span className="text-[#ccff00] font-bold">{formatTimer(workoutTimer)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 block font-sans uppercase tracking-widest text-[10px]">Calories Burned</span>
                    <span className="text-amber-400 font-bold">{activeWorkout.caloriesBurned} kcal</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handleShareAchievement}
                    className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                  >
                    <Share2 className="w-4 h-4 text-black" />
                    <span>Share to Squad Feed</span>
                  </button>
                  <button
                    onClick={() => setActiveWorkout(null)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition border border-white/10"
                  >
                    Return to Workouts
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

