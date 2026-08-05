import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Scale, 
  Flame, 
  Award, 
  Calendar, 
  X,
  Droplet
} from 'lucide-react';
import { ProgressLog, UserProfile } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

interface ProgressViewProps {
  user: UserProfile;
  logs: ProgressLog[];
  onAddLog: (log: ProgressLog) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  logs,
  onAddLog
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState<number>(user.weightKg);
  const [caloriesInput, setCaloriesInput] = useState<number>(350);
  const [waterInput, setWaterInput] = useState<number>(2.5);
  const [xpInput, setXpInput] = useState<number>(180);

  const handleSaveLog = () => {
    const newLog: ProgressLog = {
      id: 'log-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(weightInput),
      caloriesBurned: Number(caloriesInput),
      waterIntakeLiters: Number(waterInput),
      workoutsCount: 1,
      xpGained: Number(xpInput)
    };
    onAddLog(newLog);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2 tracking-tight">
            <TrendingUp className="w-6 h-6 text-[#ccff00]" />
            <span className="uppercase">Vitals Analytics &amp; Progress</span>
          </h1>
          <p className="text-xs text-zinc-400">Track weight trends, calorie burn, and gamified XP level growth over time.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition shadow-[0_0_15px_rgba(204,255,0,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Log Body Metrics</span>
        </button>
      </div>

      {/* Chart 1: Weight Progression Area Chart */}
      <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Weight Progression Trend (kg)</h2>
            <p className="text-xs text-zinc-400">Target Goal: <span className="text-[#ccff00] font-bold font-mono">{user.targetWeightKg} kg</span></p>
          </div>
          <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 rounded-lg border border-[#ccff00]/30">
            Latest: {logs[logs.length - 1]?.weightKg || user.weightKg} kg
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ccff00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#71717a" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050505', borderColor: '#ccff00', borderRadius: '16px', color: '#fff' }}
              />
              <ReferenceLine y={user.targetWeightKg} stroke="#06b6d4" strokeDasharray="5 5" label={{ value: 'Target Goal', fill: '#06b6d4', fontSize: 10 }} />
              <Area type="monotone" dataKey="weightKg" stroke="#ccff00" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Calories Burned & Gamified XP Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Calories Burned Bar Chart */}
        <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
          <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Daily Calorie Output (kcal)</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#3f3f46', borderRadius: '16px', color: '#fff' }}
                />
                <Bar dataKey="caloriesBurned" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gamified XP Gain Line Chart */}
        <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
          <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Gamified XP Acquisition History</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#ccff00', borderRadius: '16px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="xpGained" stroke="#ccff00" strokeWidth={3} dot={{ fill: '#ccff00', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass rounded-3xl border border-white/10 w-full max-w-md text-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">Log Today's Vitals &amp; Fitness</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Calories Burned (kcal)</label>
                <input
                  type="number"
                  value={caloriesInput}
                  onChange={(e) => setCaloriesInput(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Water Intake (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={waterInput}
                  onChange={(e) => setWaterInput(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">XP Earned Today</label>
                <input
                  type="number"
                  value={xpInput}
                  onChange={(e) => setXpInput(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] font-mono"
                />
              </div>

              <button
                onClick={handleSaveLog}
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider py-3 rounded-xl text-xs transition mt-2 shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              >
                Save Progress Entry
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

