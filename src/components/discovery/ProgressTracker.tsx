'use client';

import React from 'react';
import { DiscoveryCourse, CourseReel } from '@/types/discovery';
import { CheckCircle2, PlayCircle, Lock, Trophy, Sparkles, BookOpen } from 'lucide-react';

interface ProgressTrackerProps {
  course: DiscoveryCourse;
  completedReelIds: string[];
  activeReel: CourseReel;
  onSelectReel: (reel: CourseReel) => void;
  isReelUnlocked: (index: number) => boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  course,
  completedReelIds,
  activeReel,
  onSelectReel,
  isReelUnlocked,
}) => {
  const completedCount = completedReelIds.length;
  const totalCount = course.totalReels;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
              Course Progress
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
              <span>{course.icon}</span>
              <span>{course.name}</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-slate-900 block">
              {completedCount} / {totalCount} Reels
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {progressPercent}% Completed
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
          <div
            className="bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Reels List Header */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-600" />
            <span>Course Reels ({totalCount})</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            Watch & Answer to Unlock
          </span>
        </div>

        {/* List of Reels */}
        <div className="space-y-2">
          {course.reels.map((reel, idx) => {
            const isCompleted = completedReelIds.includes(reel.id);
            const isActive = reel.id === activeReel.id;
            const unlocked = isReelUnlocked(idx);

            return (
              <button
                key={reel.id}
                disabled={!unlocked}
                onClick={() => unlocked && onSelectReel(reel)}
                className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-900 border-slate-800 text-white shadow-card scale-[1.01]'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 hover:bg-emerald-50'
                    : unlocked
                    ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                    : 'bg-slate-100/70 border-slate-200/60 text-slate-400 cursor-not-allowed opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isActive ? (
                      <PlayCircle className="w-5 h-5 text-brand-400 fill-brand-400/20 animate-pulse" />
                    ) : unlocked ? (
                      <PlayCircle className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'text-emerald-950 font-semibold'
                          : unlocked
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {reel.title}
                    </p>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      Duration: {reel.duration}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isCompleted ? (
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Done
                    </span>
                  ) : isActive ? (
                    <span className="text-[10px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">
                      Playing
                    </span>
                  ) : unlocked ? (
                    <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-slate-200/60 text-slate-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
