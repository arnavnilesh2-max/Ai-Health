import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, UserProfile } from 'lucide-react';

interface AICoachDrawerProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const PRESET_QUESTIONS = [
  'How to adjust macros for muscle gain?',
  'Quick form tip for deep squats',
  'Best post-workout recovery meal under 15 mins',
  'How to improve active workout streak?'
];

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  user,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Hey Champion ${user.name}! I'm FitBot, your AI Fitness & Nutrition Coach. Based on your ${user.bodyStructure} body structure and ${user.goal.replace('_', ' ')} goal, what workout or nutrition quest can I assist you with today?`
    }
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const handleAskCoach = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAsking) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/ai/coach-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          profile: user
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: data.advice || "Keep pushing hard Champion!"
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'bot',
          text: "I had a temporary connection glitch, but keep grinding! Try asking again."
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#050505]/95 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center shadow-[0_0_10px_rgba(204,255,0,0.2)]">
            <Bot className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">FitBot AI Coach</h3>
            <p className="text-[10px] text-[#ccff00] font-mono uppercase tracking-wider font-bold">Personalized for {user.bodyStructure}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#ccff00] text-black font-bold rounded-br-none shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                  : 'bg-black/60 border border-white/10 text-zinc-200 rounded-bl-none font-medium'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isAsking && (
          <div className="flex justify-start">
            <div className="bg-black/60 border border-white/10 text-[#ccff00] p-3 rounded-2xl text-xs animate-pulse font-mono">
              FitBot is formulating advice...
            </div>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="px-4 py-2.5 bg-black/80 border-t border-white/10">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Quick Coach Prompts:</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskCoach(q)}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 px-2.5 py-1 rounded-xl transition font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-black border-t border-white/10 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask FitBot anything about fitness or diet..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
          className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
        />
        <button
          onClick={() => handleAskCoach()}
          disabled={isAsking || !inputQuery.trim()}
          className="bg-[#ccff00] hover:bg-[#b8e600] text-black p-2.5 rounded-xl transition disabled:opacity-50 shadow-[0_0_10px_rgba(204,255,0,0.2)]"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </div>

    </div>
  );
};

