'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { FolderGit2, CheckCircle2, Users } from 'lucide-react';

export default function FacultyProjectsPage() {
  const { projects } = useResora();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Capstone Supervision</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Mentored Student Projects
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Supervise senior capstone research projects, review milestones, and authorize lab access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(pj => (
              <div key={pj.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {pj.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{pj.progress}% Complete</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{pj.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{pj.description}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Team Members</span>
                  <p className="font-semibold text-slate-800">{pj.teamMembers.join(', ')}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Project Milestones</span>
                  {pj.milestones.map((m, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${m.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={m.completed ? 'line-through text-slate-400' : ''}>{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
