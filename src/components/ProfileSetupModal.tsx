import React, { useState } from 'react';
import { X, Sparkles, Scale, Ruler, User as UserIcon, Activity, Flame, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { UserProfile, BodyStructure, FitnessGoal, ActivityLevel, Gender, AIFitnessPlanResponse } from '../types';
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateTargetMacros, calculateBMI } from '../utils/fitnessCalculators';

interface ProfileSetupModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
  onApplyAIFitnessPlan: (plan: AIFitnessPlanResponse) => void;
}

const BODY_STRUCTURE_OPTIONS: { type: BodyStructure; title: string; desc: string; icon: string }[] = [
  {
    type: 'Ectomorph',
    title: 'Ectomorph (Slim Build)',
    desc: 'Lean frame, fast metabolism, finds it harder to gain muscle weight. Needs higher complex carbohydrates & explosive resistance.',
    icon: '⚡'
  },
  {
    type: 'Mesomorph',
    title: 'Mesomorph (Athletic Build)',
    desc: 'Naturally muscular, medium bone structure, responds quickly to weight training and hyper-efficient calorie synthesis.',
    icon: '🏋️'
  },
  {
    type: 'Endomorph',
    title: 'Endomorph (Stocky / Heavy Mass)',
    desc: 'Broader structure, gains muscle & strength easily, slower metabolism. Higher response to low-carb/high-protein & HIIT workouts.',
    icon: '🛡️'
  },
  {
    type: 'Athletic Build',
    title: 'Athletic / Toned',
    desc: 'Balanced strength, lean muscle mass, high metabolic flexibility for endurance & agility sports.',
    icon: '🏆'
  },
  {
    type: 'Heavy Build',
    title: 'Heavy / High Frame',
    desc: 'Large physical frame focusing on weight management, knee joint protection, and cardiovascular stamina.',
    icon: '💪'
  }
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveProfile,
  onApplyAIFitnessPlan
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Live metric calculations
  const bmr = calculateBMR(formData.weightKg, formData.heightCm, formData.age, formData.gender);
  const tdee = calculateTDEE(bmr, formData.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, formData.goal);
  const macros = calculateTargetMacros(targetCalories, formData.weightKg, formData.goal, formData.bodyStructure);
  const { bmi, category, color } = calculateBMI(formData.weightKg, formData.heightCm);

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  const handleGenerateAIPlan = async () => {
    setIsGeneratingAI(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/fitness-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heightCm: formData.heightCm,
          weightKg: formData.weightKg,
          age: formData.age,
          gender: formData.gender,
          bodyStructure: formData.bodyStructure,
          goal: formData.goal,
          activityLevel: formData.activityLevel
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch AI fitness plan from server');
      }

      const plan: AIFitnessPlanResponse = await res.json();
      onSaveProfile(formData);
      onApplyAIFitnessPlan(plan);
      onClose();
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error reaching AI generator');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-3xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto text-white shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 p-5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center shadow-[0_0_10px_rgba(204,255,0,0.2)]">
              <UserIcon className="w-5 h-5 text-[#ccff00]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Body Vitals &amp; Personal Profile</h2>
              <p className="text-xs text-zinc-400">Tailor your workouts and nutrition plans based on body physics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Calculated Live Indicator Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/50 p-4 rounded-2xl border border-white/10 font-mono">
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-widest font-sans">BMI Index</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-lg font-black text-white">{bmi}</span>
                <span className={`text-xs font-bold ${color}`}>{category}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-widest font-sans">Est. BMR</span>
              <span className="text-lg font-black text-[#ccff00]">{bmr} <span className="text-xs text-zinc-500">kcal</span></span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-widest font-sans">Daily TDEE</span>
              <span className="text-lg font-black text-cyan-400">{tdee} <span className="text-xs text-zinc-500">kcal</span></span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-widest font-sans">Target Protein</span>
              <span className="text-lg font-black text-amber-400">{macros.proteinGrams}g</span>
            </div>
          </div>

          {/* Basic Metrics Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-mono">cm</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Current Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-mono">kg</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Target Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.targetWeightKg}
                  onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-mono">kg</span>
              </div>
            </div>
          </div>

          {/* Body Structure Selection */}
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              Body Structure Classification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BODY_STRUCTURE_OPTIONS.map((item) => {
                const isSelected = formData.bodyStructure === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setFormData({ ...formData, bodyStructure: item.type })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#ccff00]/15 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className={`text-xs font-black uppercase tracking-tight ${isSelected ? 'text-[#ccff00]' : 'text-white'}`}>
                          {item.title}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#ccff00]" />}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goal & Activity Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Primary Fitness Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as FitnessGoal })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              >
                <option value="muscle_gain">Muscle Gain &amp; Hypertrophy 🏋️</option>
                <option value="fat_loss">Fat Loss &amp; Definition 🔥</option>
                <option value="strength">Raw Power &amp; Strength ⚔️</option>
                <option value="endurance">Cardio &amp; Athletic Endurance 🏃</option>
                <option value="maintenance">Maintenance &amp; Longevity 🧘</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Daily Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              >
                <option value="sedentary">Sedentary (Office job, little exercise)</option>
                <option value="light">Light Activity (1-2 workouts/week)</option>
                <option value="moderate">Moderate Activity (3-4 workouts/week)</option>
                <option value="active">Active (5+ workouts/week)</option>
                <option value="very_active">Very Active (Physical job / double sessions)</option>
              </select>
            </div>
          </div>

          {aiError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleGenerateAIPlan}
            disabled={isGeneratingAI}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(204,255,0,0.25)] text-xs disabled:opacity-50"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>AI Analyzing Body Metrics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Generate AI Personal Fitness &amp; Nutrition Plan</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 transition"
            >
              Save Metrics
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

