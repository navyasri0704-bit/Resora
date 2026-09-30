'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { Share2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminResourceSharingPage() {
  const { resources, enableResourceSharing } = useResora();
  const underutilized = resources.filter(r => r.isShared || r.capacity > 10);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Inter-Departmental Network</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Cross-Department Resource Sharing
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enable underutilized departmental hardware and labs for students across CSE, ECE, EEE, and Mechanical
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {underutilized.map(res => (
              <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{res.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                    Owner: {res.department}
                  </span>
                </div>

                <p className="text-xs text-slate-500">{res.description}</p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Current Sharing Status:</span>
                  <p className="font-semibold text-slate-800">
                    {res.isShared ? `Available to: ${res.sharedWith?.join(', ') || 'All Departments'}` : 'Restricted to owner department only'}
                  </p>
                </div>

                <button
                  onClick={() => enableResourceSharing(res.id, ['CSE', 'ECE', 'EEE'])}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Enable Inter-Dept Sharing</span>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
