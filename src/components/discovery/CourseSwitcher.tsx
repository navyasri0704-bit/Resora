'use client';

import React, { useState } from 'react';
import { DiscoveryCourse } from '@/types/discovery';
import { RefreshCw, ChevronDown, CheckCircle2, BookOpen, Layers } from 'lucide-react';

interface CourseSwitcherProps {
  courses: DiscoveryCourse[];
  activeCourse: DiscoveryCourse;
  onSelectCourse: (courseId: string) => void;
  getCourseCompletedCount: (courseId: string) => number;
}

export const CourseSwitcher: React.FC<CourseSwitcherProps> = ({
  courses,
  activeCourse,
  onSelectCourse,
  getCourseCompletedCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-30">
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2.5 bg-slate-900 text-white rounded-2xl shadow-card hover:bg-slate-800 transition-all border border-slate-700/80 group"
      >
        <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center text-base font-bold">
          {activeCourse.icon || '📚'}
        </div>

        <div className="text-left">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-brand-300 uppercase tracking-wider">
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            <span>Switch Course</span>
          </div>
          <span className="text-sm font-extrabold text-white block">
            {activeCourse.name}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Modal / Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5">
            <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Available Courses ({courses.length})</span>
              </span>
              <span className="text-[10px] bg-brand-500/20 text-brand-300 font-semibold px-2 py-0.5 rounded-full border border-brand-500/30">
                Select One
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1 scrollbar-none">
              {courses.map(course => {
                const isSelected = course.id === activeCourse.id;
                const completedCount = getCourseCompletedCount(course.id);
                const percent = Math.round((completedCount / course.totalReels) * 100);

                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      onSelectCourse(course.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between group ${
                      isSelected
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-glow'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-2xl shrink-0">{course.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold truncate text-white">{course.name}</p>
                          {isSelected && (
                            <span className="text-[9px] bg-brand-500 text-white px-1.5 py-0.2 rounded font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {course.totalReels} Reels • {percent}% Completed
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {completedCount === course.totalReels ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-white">
                          {completedCount}/{course.totalReels}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
