'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DISCOVERY_COURSES } from '@/data/discoveryCourses';
import { DiscoveryCourse, CourseReel, UserReelAnswer, CourseUserProgress } from '@/types/discovery';
import { CourseSwitcher } from '@/components/discovery/CourseSwitcher';
import { ProgressTracker } from '@/components/discovery/ProgressTracker';
import { ReelPlayer } from '@/components/discovery/ReelPlayer';
import { LockedQuestion } from '@/components/discovery/LockedQuestion';
import { ReelQuestion } from '@/components/discovery/ReelQuestion';
import { Sparkles, Trophy, BookOpen, Layers } from 'lucide-react';

export default function DiscoveryPage() {
  const [courses] = useState<DiscoveryCourse[]>(DISCOVERY_COURSES);
  const [activeCourseId, setActiveCourseId] = useState<string>('java');
  const [activeReelId, setActiveReelId] = useState<string>('java-1');

  // Video completion state for current reel
  const [isVideoCompleted, setIsVideoCompleted] = useState<boolean>(false);

  // User progress store by courseId
  const [userProgressMap, setUserProgressMap] = useState<Record<string, CourseUserProgress>>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resora_discovery_progress_map');
      if (saved) {
        setUserProgressMap(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load discovery progress from localStorage:', e);
    }
  }, []);

  // Persist progress to localStorage on update
  const saveProgressMap = (updated: Record<string, CourseUserProgress>) => {
    setUserProgressMap(updated);
    try {
      localStorage.setItem('resora_discovery_progress_map', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save discovery progress:', e);
    }
  };

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const activeReel = activeCourse.reels.find(r => r.id === activeReelId) || activeCourse.reels[0];

  const currentCourseProgress = userProgressMap[activeCourseId] || {
    courseId: activeCourseId,
    completedReelIds: [],
    answers: {},
  };

  // Check if a reel index is unlocked
  const isReelUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevReel = activeCourse.reels[index - 1];
    return currentCourseProgress.completedReelIds.includes(prevReel.id);
  };

  // Switch Course handler
  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    const targetCourse = courses.find(c => c.id === courseId) || courses[0];
    setActiveReelId(targetCourse.reels[0].id);
    setIsVideoCompleted(false);
  };

  // Select Reel handler
  const handleSelectReel = (reel: CourseReel) => {
    setActiveReelId(reel.id);
    setIsVideoCompleted(false);
  };

  // Video ended/completed handler
  const handleVideoCompleted = () => {
    setIsVideoCompleted(true);
  };

  // Answer submit handler
  const handleSubmitAnswer = (selectedOption: number) => {
    const isCorrect = selectedOption === activeReel.question.correctAnswer;
    const newAnswer: UserReelAnswer = {
      reelId: activeReel.id,
      selectedOption,
      isCorrect,
      answeredAt: new Date().toISOString(),
    };

    const updatedCourseProgress: CourseUserProgress = {
      ...currentCourseProgress,
      answers: {
        ...currentCourseProgress.answers,
        [activeReel.id]: newAnswer,
      },
    };

    const newMap = {
      ...userProgressMap,
      [activeCourseId]: updatedCourseProgress,
    };

    saveProgressMap(newMap);
  };

  // Continue to next reel handler
  const handleContinueToNextReel = () => {
    const isAlreadyCompleted = currentCourseProgress.completedReelIds.includes(activeReel.id);
    const updatedCompleted = isAlreadyCompleted
      ? currentCourseProgress.completedReelIds
      : [...currentCourseProgress.completedReelIds, activeReel.id];

    const updatedCourseProgress: CourseUserProgress = {
      ...currentCourseProgress,
      completedReelIds: updatedCompleted,
    };

    const newMap = {
      ...userProgressMap,
      [activeCourseId]: updatedCourseProgress,
    };

    saveProgressMap(newMap);

    // Find next reel index
    const currentIndex = activeCourse.reels.findIndex(r => r.id === activeReel.id);
    if (currentIndex < activeCourse.reels.length - 1) {
      const nextReel = activeCourse.reels[currentIndex + 1];
      setActiveReelId(nextReel.id);
      setIsVideoCompleted(false);
    }
  };

  const activeReelIndex = activeCourse.reels.findIndex(r => r.id === activeReel.id);
  const isLastReelInCourse = activeReelIndex === activeCourse.reels.length - 1;
  const existingAnswer = currentCourseProgress.answers[activeReel.id];

  const getCourseCompletedCount = (courseId: string) => {
    return userProgressMap[courseId]?.completedReelIds.length || 0;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Bar with Title & Switch Course */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Campora Discovery Learning</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
                Course Shorts & Quiz Discovery
              </h1>
              <p className="text-xs text-slate-300 max-w-lg">
                Watch full reel lessons to unlock interactive knowledge checks and advance through structured courses.
              </p>
            </div>

            {/* Course Switcher Component */}
            <CourseSwitcher
              courses={courses}
              activeCourse={activeCourse}
              onSelectCourse={handleSelectCourse}
              getCourseCompletedCount={getCourseCompletedCount}
            />
          </div>

          {/* Main Workspace Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Top: Reel Player + Locked/Unlocked Question (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Reel Player */}
              <ReelPlayer
                reel={activeReel}
                onVideoCompleted={handleVideoCompleted}
                isVideoCompleted={isVideoCompleted}
              />

              {/* 2. STRICT RULE: Question appears BELOW the reel ONLY when watched completely */}
              {!isVideoCompleted && !existingAnswer ? (
                <LockedQuestion />
              ) : (
                <ReelQuestion
                  question={activeReel.question}
                  existingAnswer={existingAnswer}
                  onSubmitAnswer={handleSubmitAnswer}
                  onContinueToNextReel={handleContinueToNextReel}
                  isLastReelInCourse={isLastReelInCourse}
                />
              )}
            </div>

            {/* Right/Bottom: Progress Tracker & Reel List (4 Cols) */}
            <div className="lg:col-span-4">
              <ProgressTracker
                course={activeCourse}
                completedReelIds={currentCourseProgress.completedReelIds}
                activeReel={activeReel}
                onSelectReel={handleSelectReel}
                isReelUnlocked={isReelUnlocked}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
