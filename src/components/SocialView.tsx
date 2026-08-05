import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  MessageSquare, 
  Share2, 
  Trophy, 
  Send, 
  Sparkles, 
  Plus, 
  Award,
  Heart,
  TrendingUp,
  X
} from 'lucide-react';
import { SocialPost, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface SocialViewProps {
  user: UserProfile;
  posts: SocialPost[];
  onAddPost: (post: SocialPost) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
  user,
  posts,
  onAddPost,
  onToggleLike,
  onAddComment
}) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [highlightLabel, setHighlightLabel] = useState('Workout Highlight');
  const [highlightValue, setHighlightValue] = useState('+200 XP • 25 Mins');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const LEADERBOARD_CHAMPIONS = [
    { rank: 1, name: 'Marcus Chen', level: 14, xp: 4820, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', title: 'Apex Titan 👑' },
    { rank: 2, name: 'Elena Rostova', level: 11, xp: 3450, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', title: 'Iron Warrior ⚔️' },
    { rank: 3, name: user.name, level: user.level, xp: user.xp, avatar: user.avatarUrl, title: 'Rising Star 🔥' },
    { rank: 4, name: 'Sarah Jenkins', level: 8, xp: 2190, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', title: 'Steel Champion' },
  ];

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      authorLevel: user.level,
      timestamp: 'Just now',
      postType: 'workout_complete',
      content: postContent,
      statsHighlight: {
        label: highlightLabel,
        value: highlightValue
      },
      likesCount: 1,
      isLiked: true,
      comments: []
    };
    onAddPost(newPost);
    setPostContent('');
    setIsPostModalOpen(false);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2 tracking-tight">
            <Users className="w-6 h-6 text-[#ccff00]" />
            <span className="uppercase">Squad Feed &amp; Motivation</span>
          </h1>
          <p className="text-xs text-zinc-400">Share achievements, cheer on fellow athletes, and climb the weekly XP leaderboard.</p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition shadow-[0_0_15px_rgba(204,255,0,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Post Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-5">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="glass rounded-3xl p-6 shadow-xl border border-white/10 space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={post.authorAvatar} 
                    alt={post.authorName} 
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#ccff00]/40"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">{post.authorName}</h3>
                      <span className="text-[9px] bg-[#ccff00]/20 text-[#ccff00] font-black px-2 py-0.5 rounded border border-[#ccff00]/30 font-mono">
                        LVL {post.authorLevel}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{post.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-xs text-zinc-200 leading-relaxed font-medium">{post.content}</p>

              {/* Stats Highlight Banner */}
              {post.statsHighlight && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-sans font-bold">{post.statsHighlight.label}</span>
                  <span className="font-black text-[#ccff00]">{post.statsHighlight.value}</span>
                </div>
              )}

              {/* Footer Actions (Cheer / Like & Comment Count) */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={`flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-xl transition uppercase tracking-wider ${
                    post.isLiked 
                      ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${post.isLiked ? 'fill-[#ccff00] text-[#ccff00]' : 'text-zinc-400'}`} />
                  <span>{post.likesCount} Cheers</span>
                </button>

                <span className="text-xs text-zinc-400 flex items-center space-x-1 font-mono">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{post.comments.length} Comments</span>
                </span>
              </div>

              {/* Comments Thread */}
              {post.comments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {post.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-black/40 rounded-2xl border border-white/10 text-xs flex items-start space-x-2.5">
                      <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                      <div>
                        <span className="font-bold text-white uppercase text-[11px] block">{c.authorName}</span>
                        <p className="text-zinc-300 mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Leave an encouraging comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                  className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                />
                <button
                  onClick={() => handleSendComment(post.id)}
                  className="bg-white/10 hover:bg-white/20 text-[#ccff00] p-2 rounded-xl transition border border-white/10"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Sidebar: Weekly XP Leaderboard Podium */}
        <div className="lg:col-span-4 space-y-5">
          <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
            <div className="flex items-center space-x-2 text-[#ccff00] font-black text-xs uppercase tracking-widest mb-4">
              <Trophy className="w-4 h-4 text-[#ccff00]" />
              <span>Weekly XP Leaderboard</span>
            </div>

            <div className="space-y-3">
              {LEADERBOARD_CHAMPIONS.map((champ) => (
                <div 
                  key={champ.rank}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    champ.rank === 1 
                      ? 'bg-[#ccff00]/15 border-[#ccff00]/40 shadow-[0_0_12px_rgba(204,255,0,0.15)]' 
                      : champ.rank === 2
                      ? 'bg-white/10 border-white/20'
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 text-center font-black text-xs font-mono ${
                      champ.rank === 1 ? 'text-[#ccff00]' : champ.rank === 2 ? 'text-zinc-300' : 'text-zinc-500'
                    }`}>
                      #{champ.rank}
                    </span>
                    <img src={champ.avatar} alt={champ.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">{champ.name}</h4>
                      <span className="text-[10px] text-zinc-400 block font-medium">{champ.title}</span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-xs text-[#ccff00]">
                    {champ.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CREATE POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass rounded-3xl border border-white/10 w-full max-w-lg text-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">Share Workout Achievement</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Post Description</label>
                <textarea
                  rows={3}
                  placeholder="Share how your workout felt or motivate others..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Highlight Label</label>
                  <input
                    type="text"
                    value={highlightLabel}
                    onChange={(e) => setHighlightLabel(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Highlight Value</label>
                  <input
                    type="text"
                    value={highlightValue}
                    onChange={(e) => setHighlightValue(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider py-3 rounded-xl text-xs transition shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              >
                Publish Post
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

