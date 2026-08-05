import { UserProfile, FitnessGoal, ActivityLevel, BodyStructure } from '../types';

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5; // Default for male and other
  }
  return Math.round(bmr);
}

/**
 * Activity Multiplier
 */
export function getActivityMultiplier(activityLevel: ActivityLevel): number {
  switch (activityLevel) {
    case 'sedentary': return 1.2;
    case 'light': return 1.375;
    case 'moderate': return 1.55;
    case 'active': return 1.725;
    case 'very_active': return 1.9;
    default: return 1.55;
  }
}

/**
 * Total Daily Energy Expenditure
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  return Math.round(bmr * getActivityMultiplier(activityLevel));
}

/**
 * Target Calorie Adjustment based on Fitness Goal
 */
export function calculateTargetCalories(
  tdee: number,
  goal: FitnessGoal
): number {
  switch (goal) {
    case 'fat_loss': return Math.round(tdee * 0.80); // 20% deficit
    case 'muscle_gain': return Math.round(tdee * 1.12); // 12% surplus
    case 'strength': return Math.round(tdee * 1.08); // 8% surplus
    case 'endurance': return Math.round(tdee * 1.05);
    case 'maintenance':
    default: return tdee;
  }
}

/**
 * Macro Breakdown Calculation (Grams of Protein, Carbs, Fats)
 */
export function calculateTargetMacros(
  targetCalories: number,
  weightKg: number,
  goal: FitnessGoal,
  bodyStructure: BodyStructure
) {
  // Protein: 1.8g to 2.2g per kg depending on goal
  let proteinPerKg = 2.0;
  if (goal === 'muscle_gain' || goal === 'strength') proteinPerKg = 2.2;
  if (goal === 'fat_loss') proteinPerKg = 2.1;
  if (goal === 'endurance') proteinPerKg = 1.7;

  let proteinGrams = Math.round(weightKg * proteinPerKg);
  let proteinCalories = proteinGrams * 4;

  // Fat ratio: ~25-30% of total calories
  let fatPercent = 0.25;
  if (bodyStructure === 'Endomorph' || bodyStructure === 'Heavy Build') {
    fatPercent = 0.30; // Endomorphs respond well to slightly higher healthy fats and lower carbs
  } else if (bodyStructure === 'Ectomorph') {
    fatPercent = 0.22; // Ectomorphs respond better to higher carbs
  }

  let fatCalories = targetCalories * fatPercent;
  let fatGrams = Math.round(fatCalories / 9);

  // Remaining calories go to carbohydrates
  let carbCalories = targetCalories - proteinCalories - fatCalories;
  let carbsGrams = Math.max(50, Math.round(carbCalories / 4));

  return {
    proteinGrams,
    fatGrams,
    carbsGrams,
    proteinCalories,
    fatCalories,
    carbCalories: Math.max(0, carbCalories)
  };
}

/**
 * BMI Calculation and Category
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string; color: string } {
  if (!heightCm || heightCm <= 0) return { bmi: 0, category: 'Unknown', color: 'text-gray-400' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) return { bmi, category: 'Underweight', color: 'text-amber-500' };
  if (bmi < 24.9) return { bmi, category: 'Healthy Weight', color: 'text-emerald-500' };
  if (bmi < 29.9) return { bmi, category: 'Overweight', color: 'text-orange-500' };
  return { bmi, category: 'Obese Range', color: 'text-rose-500' };
}

/**
 * Gamification Level Math
 * Level = Math.floor(Math.sqrt(XP / 80)) + 1
 */
export function getLevelFromXP(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  const level = Math.floor(Math.sqrt(xp / 80)) + 1;
  const currentLevelStartXp = Math.pow(level - 1, 2) * 80;
  const nextLevelStartXp = Math.pow(level, 2) * 80;
  
  const xpInCurrentLevel = xp - currentLevelStartXp;
  const xpRequiredForNext = nextLevelStartXp - currentLevelStartXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100)));

  return {
    level,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpRequiredForNext,
    progressPercent
  };
}

/**
 * Rank Title based on Level
 */
export function getRankTitle(level: number): string {
  if (level >= 30) return 'Mythic Titan ⚡';
  if (level >= 25) return 'Iron Legend 👑';
  if (level >= 20) return 'Apex Athlete 🏆';
  if (level >= 15) return 'Master Crusher 💪';
  if (level >= 10) return 'Steel Champion ⚔️';
  if (level >= 5) return 'Rising Warrior 🔥';
  return 'Fit Novice 🌱';
}
