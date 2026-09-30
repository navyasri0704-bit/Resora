'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export default function FacultyAnalyticsPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Department Performance</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Department & Student Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Lab attendance trends, booking approvals, and class performance indices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Average Attendance</span>
              <h3 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">91.4%</h3>
              <p className="text-xs text-emerald-600 mt-1">Across 4 CSE Sections</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Lab Utilization</span>
              <h3 className="text-3xl font-extrabold text-brand-600 font-heading mt-1">78.2%</h3>
              <p className="text-xs text-slate-500 mt-1">Peak: AI & IoT Labs</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Approval Speed</span>
              <h3 className="text-3xl font-extrabold text-emerald-600 font-heading mt-1">&lt; 15 mins</h3>
              <p className="text-xs text-slate-500 mt-1">Response time to student requests</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
