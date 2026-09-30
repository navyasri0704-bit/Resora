'use client';

import React from 'react';
import { Lock, Sparkles, AlertCircle, Video } from 'lucide-react';

export const LockedQuestion: React.FC = () => {
  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 text-center shadow-card space-y-3 relative overflow-hidden">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto text-xl shadow-glow">
        <Lock className="w-6 h-6 animate-pulse" />
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center space-x-2">
          <span>🔒 Question Locked</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
          Watch the reel completely to unlock the question. The quiz question will appear right here once the video playback ends.
        </p>
      </div>

      <div className="pt-2 inline-flex items-center space-x-2 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
        <Video className="w-3.5 h-3.5" />
        <span>Video Playback Completion Required</span>
      </div>
    </div>
  );
};
