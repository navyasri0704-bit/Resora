'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BarChart3, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const insights = [
    { title: 'Seminar Hall A Utilization Peak', text: 'Seminar Hall A is underutilized between 2 PM and 5 PM on Tuesdays.', type: 'Optimization' },
    { title: 'Robotics Lab Demand Spike', text: 'Robotics Lab demand has increased by 42% on Wednesdays due to drone project milestones.', type: 'Demand' },
    { title: 'Hardware Inspection Alert', text: 'Projector #04 has an unusually high maintenance frequency (3 tickets this month).', type: 'Maintenance' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Campus Intelligence</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Resource Analytics & AI Insights
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Deep-dive metrics into peak booking hours, cancellation rates, no-shows, and smart recommendations
            </p>
          </div>

          {/* AI Insights Cards Section #25 */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Automated AI Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((ins, i) => (
                <div key={i} className="bg-purple-900 text-white p-5 rounded-3xl border border-purple-800 shadow-card space-y-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 uppercase">
                    {ins.type}
                  </span>
                  <h4 className="text-sm font-bold">{ins.title}</h4>
                  <p className="text-xs text-purple-200 leading-relaxed">{ins.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Cancellation Rate</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading mt-1">2.4%</h3>
              <p className="text-[10px] text-emerald-600 mt-1">↓ 0.8% lower than last month</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">No-Show Rate</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading mt-1">1.1%</h3>
              <p className="text-[10px] text-emerald-600 mt-1">Auto-release grace period active</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Peak Booking Hour</span>
              <h3 className="text-2xl font-extrabold text-brand-600 font-heading mt-1">02:00 PM</h3>
              <p className="text-[10px] text-slate-500 mt-1">Highest load on Block A & B</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Most Requested Space</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading mt-1">AI/ML Lab</h3>
              <p className="text-[10px] text-slate-500 mt-1">94% average occupancy</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
