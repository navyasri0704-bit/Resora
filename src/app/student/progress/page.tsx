'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import {
  Trophy,
  Code2,
  GraduationCap,
  Flame,
  CheckCircle2,
  Target,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

export default function StudentProgressPage() {
  const { progress } = useResora();

  // Primary Skills dataset
  const skillList = [
    { name: 'DSA', level: progress?.dsaScore || 70, color: 'bg-brand-600' },
    { name: 'Programming', level: 80, color: 'bg-blue-600' },
    { name: 'Web Development', level: 85, color: 'bg-emerald-600' },
    { name: 'Communication', level: progress?.communicationScore || 70, color: 'bg-amber-500' },
  ];

  // Achievements
  const achievements = [
    {
      title: 'Hackathons',
      count: '3',
      icon: Trophy,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Projects',
      count: '4',
      icon: Code2,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Certifications',
      count: '6',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Learning Streak',
      count: '12 Days',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  // Recent Activity Items
  const recentActivities = [
    {
      id: 1,
      title: 'Completed React project',
      date: '2 days ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 2,
      title: 'Solved 20 DSA problems',
      date: '3 days ago',
      icon: Target,
      iconColor: 'text-brand-600 bg-brand-50',
    },
    {
      id: 3,
      title: 'Completed Web Development course',
      date: '5 days ago',
      icon: Award,
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      id: 4,
      title: 'Participated in Hackathon',
      date: '1 week ago',
      icon: Trophy,
      iconColor: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* ==================================================
              1. PAGE HEADER
             ================================================== */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Student Growth & Achievements</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              My Progress
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Track your skills, achievements and current goals.
            </p>
          </div>

          {/* ==================================================
              2. OVERALL PROGRESS SECTION
             ================================================== */}
          <div className="space-y-4">
            {/* Main Overall Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    OVERALL PROGRESS
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 font-heading">
                      76%
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Steady Progress
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                    You're making steady progress toward your career goals.
                  </p>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-blue-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: '76%' }}
                  />
                </div>
              </div>
            </div>

            {/* 4 Small Sub Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Technical Skills', val: 82, color: 'bg-brand-600' },
                { label: 'Placement Readiness', val: 72, color: 'bg-blue-600' },
                { label: 'Projects', val: 85, color: 'bg-purple-600' },
                { label: 'Learning', val: 78, color: 'bg-emerald-600' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{item.label}</span>
                    <span className="font-extrabold text-slate-900">{item.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              TWO-COLUMN LAYOUT FOR DETAILED SECTIONS
             ================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: SKILL PROGRESS & CURRENT GOAL */}
            <div className="space-y-8">
              {/* ==================================================
                  3. SKILL PROGRESS
                 ================================================== */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                      Skill Progress
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Core technical and soft skill proficiency</p>
                  </div>
                  <Link
                    href="/student/preparation"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <span>View All Skills</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-5">
                  {skillList.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{skill.name}</span>
                        <span className="font-extrabold text-slate-900">{skill.level}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==================================================
                  5. CURRENT GOAL
                 ================================================== */}
              <div className="bg-gradient-to-br from-white via-slate-50/60 to-brand-50/40 p-6 rounded-3xl border border-brand-200/80 shadow-soft space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-brand-700 uppercase tracking-wider bg-brand-100 px-3 py-1 rounded-full border border-brand-200/80">
                    CURRENT GOAL
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">74%</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Complete 250 DSA Problems
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-1">
                    <span>Target Progress</span>
                    <span className="font-bold text-slate-900">184 / 250</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white border border-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full shadow-xs"
                    style={{ width: '74%' }}
                  />
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <Link
                    href="/student/preparation"
                    className="w-full py-3 px-5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACHIEVEMENTS & RECENT ACTIVITY */}
            <div className="space-y-8">
              {/* ==================================================
                  4. ACHIEVEMENTS
                 ================================================== */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                    Achievements
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Highlights of your campus contributions and milestones</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((ach, idx) => {
                    const Icon = ach.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-xl border ${ach.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-slate-900 font-heading leading-none">
                            {ach.count}
                          </div>
                          <span className="text-xs font-bold text-slate-600 mt-1 block">
                            {ach.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ==================================================
                  6. RECENT ACTIVITY
                 ================================================== */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                    Recent Activity
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Your latest learning updates and platform activity</p>
                </div>

                <div className="space-y-4">
                  {recentActivities.map(act => {
                    const Icon = act.icon;
                    return (
                      <div
                        key={act.id}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl ${act.iconColor} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {act.title}
                          </span>
                        </div>

                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {act.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

