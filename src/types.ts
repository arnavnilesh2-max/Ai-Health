export type Gender = 'male' | 'female' | 'other';

export type BodyStructure = 
  | 'Ectomorph' // Slim / Fast metabolism
  | 'Mesomorph' // Athletic / Medium frame
  | 'Endomorph' // Stocky / High muscle & mass potential
  | 'Athletic Build'
  | 'Heavy Build';

export type FitnessGoal = 
  | 'muscle_gain' 
  | 'fat_loss' 
  | 'endurance' 
  | 'maintenance'
  | 'strength';

export type ActivityLevel = 
  | 'sedentary' 
  | 'light' 
  | 'moderate' 
  | 'active' 
  | 'very_active';

export interface UserProfile {
  name: string;
  avatarUrl: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  bodyStructure: BodyStructure;
  goal: FitnessGoal;
  activityLevel: ActivityLevel;
  // Computed & Gamified Metrics
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'workout' | 'nutrition' | 'streak' | 'social';
}

export interface Exercise {
  id: string;
  title: string;
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility' | 'Calisthenics';
  targetBodyPart: string;
  suitableBodyStructures: BodyStructure[];
  durationMinutes: number;
  sets?: number;
  reps?: string;
  caloriesBurned: number;
  xpReward: number;
  coinsReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: string[];
  tips: string[];
  equipmentNeeded?: string;
}

export interface WorkoutSession {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  durationSeconds: number;
  caloriesBurned: number;
  xpEarned: number;
  coinsEarned: number;
  completedAt: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'High Protein' | 'Quick & Easy' | 'Low Carb' | 'Post-Workout' | 'Meal Prep';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  efficiencyRating: number; // 1-10
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  tags: string[];
  imageUrl?: string;
}

export interface DailyMealLog {
  id: string;
  date: string; // YYYY-MM-DD
  mealName: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ProgressLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  caloriesBurned: number;
  waterIntakeLiters: number;
  workoutsCount: number;
  xpGained: number;
  notes?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  xpReward: number;
  coinsReward: number;
  completed: boolean;
  category: 'workout' | 'nutrition' | 'water' | 'social';
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: number;
  timestamp: string;
  postType: 'workout_complete' | 'level_up' | 'recipe_share' | 'pr_break' | 'motivation';
  content: string;
  statsHighlight?: {
    label: string;
    value: string;
  };
  likesCount: number;
  isLiked: boolean;
  comments: SocialComment[];
}

export interface SocialComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface AIFitnessPlanResponse {
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  bodySummary: string;
  suggestedExercises: {
    title: string;
    category: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility' | 'Calisthenics';
    targetBodyPart: string;
    durationMinutes: number;
    sets: number;
    reps: string;
    caloriesBurned: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    whySuitable: string;
    steps: string[];
  }[];
  sampleMealPlan: {
    mealType: string;
    title: string;
    calories: number;
    proteinGrams: number;
    prepTimeMinutes: number;
  }[];
}
