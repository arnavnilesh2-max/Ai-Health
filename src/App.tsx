import React, { useState } from 'react';
import { UserProfile, DailyQuest, Exercise, Recipe, ProgressLog, SocialPost, WorkoutSession, DailyMealLog, AIFitnessPlanResponse } from './types';
import { INITIAL_USER_PROFILE, DEFAULT_EXERCISES, DEFAULT_RECIPES, INITIAL_DAILY_QUESTS, INITIAL_PROGRESS_LOGS, INITIAL_SOCIAL_POSTS } from './data/initialData';
import { getLevelFromXP } from './utils/fitnessCalculators';

// Components
import { Navbar } from './components/Navbar';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { DashboardView } from './components/DashboardView';
import { WorkoutsView } from './components/WorkoutsView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';
import { SocialView } from './components/SocialView';
import { AICoachDrawer } from './components/AICoachDrawer';

export default function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_DAILY_QUESTS);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_RECIPES);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>(INITIAL_PROGRESS_LOGS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [aiPlan, setAiPlan] = useState<AIFitnessPlanResponse | null>(null);

  // UI Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCoachDrawerOpen, setIsCoachDrawerOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Claim Quest Logic
  const handleClaimQuest = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        if (!q.completed) {
          // Award XP and Coins
          setUser(u => ({
            ...u,
            xp: u.xp + q.xpReward,
            coins: u.coins + q.coinsReward
          }));
        }
        return { ...q, completed: true, current: q.target };
      }
      return q;
    }));
  };

  // Complete Workout Logic
  const handleCompleteWorkout = (session: WorkoutSession) => {
    // Add XP & Coins to user
    setUser(prev => {
      const newXp = prev.xp + session.xpEarned;
      const newCoins = prev.coins + session.coinsEarned;
      return {
        ...prev,
        xp: newXp,
        coins: newCoins
      };
    });

    // Update quest progress for workout
    setQuests(prev => prev.map(q => {
      if (q.category === 'workout') {
        const newCurr = q.current + 1;
        const isDone = newCurr >= q.target;
        return { ...q, current: newCurr, completed: isDone };
      }
      return q;
    }));

    // Add entry to progress log
    const today = new Date().toISOString().split('T')[0];
    setProgressLogs(prev => {
      const existingToday = prev.find(p => p.date === today);
      if (existingToday) {
        return prev.map(p => p.date === today ? {
          ...p,
          caloriesBurned: p.caloriesBurned + session.caloriesBurned,
          workoutsCount: p.workoutsCount + 1,
          xpGained: p.xpGained + session.xpEarned
        } : p);
      } else {
        return [...prev, {
          id: 'log-' + Date.now(),
          date: today,
          weightKg: user.weightKg,
          caloriesBurned: session.caloriesBurned,
          waterIntakeLiters: 2.0,
          workoutsCount: 1,
          xpGained: session.xpEarned
        }];
      }
    });
  };

  // Apply AI Generated Plan
  const handleApplyAIFitnessPlan = (plan: AIFitnessPlanResponse) => {
    setAiPlan(plan);
    
    // Add AI suggested exercises if any
    if (plan.suggestedExercises && plan.suggestedExercises.length > 0) {
      const newAiExercises: Exercise[] = plan.suggestedExercises.map((ex, i) => ({
        id: 'ai-plan-ex-' + Date.now() + '-' + i,
        title: ex.title,
        category: ex.category || 'HIIT',
        targetBodyPart: ex.targetBodyPart,
        suitableBodyStructures: [user.bodyStructure],
        durationMinutes: ex.durationMinutes || 20,
        sets: ex.sets || 4,
        reps: ex.reps || '12 reps',
        caloriesBurned: ex.caloriesBurned || 200,
        xpReward: 200,
        coinsReward: 50,
        difficulty: ex.difficulty || 'Intermediate',
        description: ex.whySuitable || 'Tailored by AI for your body structure.',
        steps: ex.steps || ['Warm up', 'Execute sets', 'Cool down']
      }));

      setExercises(prev => [...newAiExercises, ...prev]);
    }
  };

  // Share Achievement to Social Feed
  const handleShareToSocial = (content: string, stats: { label: string; value: string }) => {
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      authorLevel: user.level,
      timestamp: 'Just now',
      postType: 'workout_complete',
      content,
      statsHighlight: stats,
      likesCount: 1,
      isLiked: true,
      comments: []
    };
    setSocialPosts([newPost, ...socialPosts]);
    setActiveTab('social');
  };

  const handleToggleLike = (postId: string) => {
    setSocialPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    setSocialPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: 'comm-' + Date.now(),
              authorName: user.name,
              authorAvatar: user.avatarUrl,
              text,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenCoachDrawer={() => setIsCoachDrawerOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView 
            user={user}
            quests={quests}
            onClaimQuest={handleClaimQuest}
            onStartWorkout={(ex) => {
              setActiveTab('workouts');
            }}
            onNavigateTab={setActiveTab}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            aiPlan={aiPlan}
            defaultExercises={exercises}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView 
            user={user}
            exercises={exercises}
            onCompleteWorkout={handleCompleteWorkout}
            onShareToSocial={handleShareToSocial}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView 
            user={user}
            recipes={recipes}
            onLogMeal={(meal) => {
              // Update protein quest
              setQuests(prev => prev.map(q => {
                if (q.category === 'nutrition') {
                  const newCurrent = q.current + meal.protein;
                  return { ...q, current: newCurrent, completed: newCurrent >= q.target };
                }
                return q;
              }));
            }}
            onAddCustomRecipe={(newRec) => setRecipes([newRec, ...recipes])}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView 
            user={user}
            logs={progressLogs}
            onAddLog={(newLog) => setProgressLogs([...progressLogs, newLog])}
          />
        )}

        {activeTab === 'social' && (
          <SocialView 
            user={user}
            posts={socialPosts}
            onAddPost={(newPost) => setSocialPosts([newPost, ...socialPosts])}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      {/* Body Metric Setup Modal */}
      <ProfileSetupModal 
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(updated) => setUser(updated)}
        onApplyAIFitnessPlan={handleApplyAIFitnessPlan}
      />

      {/* AI Coach Drawer */}
      <AICoachDrawer 
        user={user}
        isOpen={isCoachDrawerOpen}
        onClose={() => setIsCoachDrawerOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>FitQuest AI — Gamified Fitness Tracking & AI Nutrition Planner</p>
      </footer>

    </div>
  );
}
