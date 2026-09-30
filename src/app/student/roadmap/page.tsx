'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TrendingUp, Sparkles, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function RoadmapPage() {
  const steps = [
    { title: 'HTML & Semantic Markup', status: 'Completed', date: 'Done' },
    { title: 'CSS & Modern Layouts (Flexbox/Grid)', status: 'Completed', date: 'Done' },
    { title: 'JavaScript ES6+ & Async/Await', status: 'Completed', date: 'Done' },
    { title: 'React & Component State Architecture', status: 'Current', date: 'Active Now' },
    { title: 'Next.js App Router & Server Actions', status: 'Upcoming', date: 'Next Up' },
    { title: 'Fullstack Capstone Project Deployment', status: 'Upcoming', date: 'Final Step' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Learning Pathway</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Skill & Career Roadmap
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Personalized roadmap for Frontend / Fullstack Software Developer
            </p>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-purple-900 text-white p-6 rounded-3xl border border-purple-800 shadow-card flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-300 uppercase">AI Recommendation</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Next recommended skill: React & State Management
              </h3>
              <p className="text-xs text-purple-200 mt-1">
                You have completed JavaScript fundamentals with 85% score. Reserve Innovation Lab node to build your React capstone.
              </p>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Fullstack Web Developer Track</h3>
                <p className="text-xs text-slate-500">6 Step Mastery Path</p>
              </div>
              <span className="text-lg font-extrabold text-brand-600 font-heading">65% Complete</span>
            </div>

            <div className="space-y-4">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    st.status === 'Completed'
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : st.status === 'Current'
                      ? 'bg-brand-50/70 border-brand-300 text-slate-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        st.status === 'Completed'
                          ? 'bg-emerald-500 text-white'
                          : st.status === 'Current'
                          ? 'bg-brand-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {st.status === 'Completed' ? '✓' : i + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                      <p className="text-[10px] text-slate-500">{st.date}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      st.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : st.status === 'Current'
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
