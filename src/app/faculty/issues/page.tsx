'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { AlertTriangle, Plus } from 'lucide-react';

export default function FacultyIssuesPage() {
  const { issues } = useResora();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Lab Maintenance</span>
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
                Reported Hardware Issues
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Report faulty projectors, damaged microcontrollers, or lab equipment maintenance tickets
              </p>
            </div>

            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md">
              <Plus className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Resource</th>
                    <th className="py-3.5 px-4">Reported By</th>
                    <th className="py-3.5 px-6">Issue Description</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map(iss => (
                    <tr key={iss.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{iss.resourceName}</td>
                      <td className="py-4 px-4 text-slate-500">{iss.reportedBy}</td>
                      <td className="py-4 px-6 text-slate-800 font-medium">{iss.issueDescription}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={iss.priority} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <StatusBadge status={iss.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
