import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Clock, 
  Flame, 
  Award, 
  Plus, 
  Check, 
  Droplet, 
  ChefHat, 
  Filter, 
  X,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Recipe, UserProfile, DailyMealLog } from '../types';
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateTargetMacros } from '../utils/fitnessCalculators';

interface NutritionViewProps {
  user: UserProfile;
  recipes: Recipe[];
  onLogMeal: (meal: DailyMealLog) => void;
  onAddCustomRecipe: (recipe: Recipe) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  user,
  recipes,
  onLogMeal,
  onAddCustomRecipe
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCookRecipe, setActiveCookRecipe] = useState<Recipe | null>(null);
  
  // Water Tracker
  const [waterLogged, setWaterLogged] = useState<number>(1.8); // Liters
  
  // AI Recipe Creator Inputs
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [ingredientsInput, setIngredientsInput] = useState<string>('');
  const [dietPreference, setDietPreference] = useState<string>('High Protein & Fast');

  // Body macro targets
  const bmr = calculateBMR(user.weightKg, user.heightCm, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, user.goal);
  const targetMacros = calculateTargetMacros(targetCalories, user.weightKg, user.goal, user.bodyStructure);

  const categories = ['All', 'High Protein', 'Quick & Easy', 'Low Carb', 'Post-Workout', 'Meal Prep'];

  const filteredRecipes = recipes.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory || r.tags.includes(selectedCategory);
  });

  const handleGenerateAIRecipe = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/recipe-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredientsInput,
          preference: dietPreference,
          targetProtein: targetMacros.proteinGrams / 3,
          maxPrepTimeMinutes: 15
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newRecipe: Recipe = {
          id: 'rec-ai-' + Date.now(),
          title: data.title || 'AI Efficient Fitness Bowl',
          category: data.category || 'High Protein',
          prepTimeMinutes: data.prepTimeMinutes || 5,
          cookTimeMinutes: data.cookTimeMinutes || 10,
          calories: data.calories || 450,
          proteinGrams: data.proteinGrams || 40,
          carbsGrams: data.carbsGrams || 35,
          fatGrams: data.fatGrams || 12,
          efficiencyRating: data.efficiencyRating || 9.5,
          difficulty: data.difficulty || 'Easy',
          ingredients: data.ingredients || [],
          instructions: data.instructions || [],
          tags: data.tags || ['AI Created', 'High Protein']
        };
        onAddCustomRecipe(newRecipe);
        setIngredientsInput('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogRecipeMeal = (recipe: Recipe) => {
    const mealLog: DailyMealLog = {
      id: 'meal-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      mealName: recipe.title,
      mealType: 'Lunch',
      calories: recipe.calories,
      protein: recipe.proteinGrams,
      carbs: recipe.carbsGrams,
      fat: recipe.fatGrams
    };
    onLogMeal(mealLog);
    alert(`Logged "${recipe.title}" (${recipe.calories} kcal, ${recipe.proteinGrams}g Protein) to your daily journal!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2 tracking-tight">
            <Utensils className="w-6 h-6 text-[#ccff00]" />
            <span className="uppercase">Precision Fuel &amp; Efficient Recipes</span>
          </h1>
          <p className="text-xs text-zinc-400">High-efficiency fuel formulated for your <span className="text-[#ccff00] font-bold">{user.bodyStructure}</span> body structure.</p>
        </div>

        {/* Quick Water Tracker */}
        <div className="glass rounded-2xl p-3 flex items-center space-x-3 shrink-0 border border-white/10">
          <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          <div>
            <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-widest">Hydration Log</span>
            <span className="text-xs font-black font-mono text-cyan-300">{waterLogged.toFixed(1)} / 2.5 L</span>
          </div>
          <button
            onClick={() => setWaterLogged(prev => Math.min(4.0, prev + 0.25))}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-1.5 rounded-xl border border-cyan-500/30 text-xs font-bold transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>250ml</span>
          </button>
        </div>
      </div>

      {/* Target Macro Breakdown Card */}
      <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
          Daily Macro Target Distribution ({targetCalories} Total kcal)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Protein (40%)</span>
              <span className="text-sm font-mono font-black text-[#ccff00]">{targetMacros.proteinGrams}g</span>
            </div>
            <p className="text-[11px] text-zinc-500">Essential for muscle repair &amp; tissue synthesis.</p>
          </div>

          <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Carbs (35%)</span>
              <span className="text-sm font-mono font-black text-cyan-400">{targetMacros.carbsGrams}g</span>
            </div>
            <p className="text-[11px] text-zinc-500">Glycogen re-synthesis &amp; workout stamina.</p>
          </div>

          <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Fats (25%)</span>
              <span className="text-sm font-mono font-black text-amber-400">{targetMacros.fatGrams}g</span>
            </div>
            <p className="text-[11px] text-zinc-500">Hormonal balance &amp; joint lubrication.</p>
          </div>
        </div>
      </div>

      {/* AI Recipe Generator Input Section */}
      <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
        <div className="flex items-center space-x-2 text-[#ccff00] font-bold text-xs uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4" />
          <span>AI Fridge Chef: Generate Instant Healthy Recipe</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Enter ingredients you have (e.g., Chicken, Oats, Eggs, Avocado)..."
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
            >
              <option value="High Protein & Fast">High Protein &amp; Fast</option>
              <option value="Low Carb Keto">Low Carb / Keto</option>
              <option value="Post-Workout Recovery">Post-Workout Recovery</option>
              <option value="Budget Meal Prep">Budget Meal Prep</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleGenerateAIRecipe}
              disabled={isGenerating || !ingredientsInput}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition disabled:opacity-50 shadow-[0_0_12px_rgba(204,255,0,0.2)]"
            >
              <ChefHat className="w-4 h-4 text-black" />
              <span>{isGenerating ? 'AI Cooking...' : 'Generate Recipe'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Categories Filter */}
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

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecipes.map((r) => (
          <div 
            key={r.id}
            className="glass rounded-3xl p-5 flex flex-col justify-between transition shadow-xl border border-white/10 hover:border-[#ccff00]/40 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded border border-[#ccff00]/30 uppercase tracking-wider">
                  Efficiency Rating: {r.efficiencyRating}/10 ⚡
                </span>
                <span className="text-xs text-zinc-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{r.prepTimeMinutes + r.cookTimeMinutes} mins total</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white mb-2 uppercase tracking-tight">{r.title}</h3>

              {/* Macros Pill Grid */}
              <div className="grid grid-cols-4 gap-2 bg-black/40 p-2.5 rounded-2xl border border-white/10 mb-4 text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 block font-sans uppercase tracking-widest text-[9px]">Calories</span>
                  <span className="font-bold text-white">{r.calories}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-sans uppercase tracking-widest text-[9px]">Protein</span>
                  <span className="font-black text-[#ccff00]">{r.proteinGrams}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-sans uppercase tracking-widest text-[9px]">Carbs</span>
                  <span className="font-bold text-cyan-400">{r.carbsGrams}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-sans uppercase tracking-widest text-[9px]">Fat</span>
                  <span className="font-bold text-amber-400">{r.fatGrams}g</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Key Ingredients</span>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{r.ingredients.join(' • ')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setActiveCookRecipe(r)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition border border-white/10"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Directions</span>
              </button>

              <button
                onClick={() => handleLogRecipeMeal(r)}
                className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl text-xs transition shadow-[0_0_10px_rgba(204,255,0,0.2)]"
              >
                Log Meal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COOK MODE INSTRUCTIONS MODAL */}
      {activeCookRecipe && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass rounded-3xl border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto text-white p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveCookRecipe(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/30 font-mono uppercase">
                  Cook Mode • {activeCookRecipe.prepTimeMinutes + activeCookRecipe.cookTimeMinutes} Mins
                </span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1">{activeCookRecipe.title}</h2>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Required Ingredients</h3>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {activeCookRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="text-[#ccff00]">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Step-by-Step Directions</h3>
                <div className="space-y-2">
                  {activeCookRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-zinc-200 flex items-start space-x-3">
                      <span className="font-black text-[#ccff00] font-mono shrink-0">{idx + 1}.</span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  handleLogRecipeMeal(activeCookRecipe);
                  setActiveCookRecipe(null);
                }}
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider py-3 rounded-xl text-xs transition shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              >
                Done Cooking &amp; Log Meal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

