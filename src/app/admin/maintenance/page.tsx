'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { Wrench, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminMaintenancePage() {
  const { issues, resolveIssue, toggleMaintenance } = useResora();
  const [activeTab, setActiveTab] = useState<'Active' | 'Schedule' | 'History'>('Active');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Maintenance & Hardware Center</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Maintenance & Hardware Repair
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track issues, schedule repairs, and auto-block conflicting student reservations
            </p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Automatic Policy Enforcement:</strong> Resources placed under maintenance are instantly blocked in the deterministic booking engine.
            </span>
          </div>

          {/* Table matching Screenshot #10 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex space-x-4 text-xs font-bold">
              {(['Active', 'Schedule', 'History'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition-colors border-b-2 ${
                    activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
                  }`}
                >
                  {tab === 'Active' ? 'Active Issues' : tab === 'Schedule' ? 'Maintenance Schedule' : 'Issue History'}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Resource</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-6">Issue Description</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map(iss => (
                    <tr key={iss.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{iss.resourceName}</td>
                      <td className="py-4 px-4 text-slate-500">{iss.resourceType}</td>
                      <td className="py-4 px-6 text-slate-700 font-medium">{iss.issueDescription}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={iss.priority} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={iss.status} />
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {iss.status !== 'RESOLVED' ? (
                          <button
                            onClick={() => resolveIssue(iss.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-sm"
                          >
                            Mark Resolved ✓
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Resolved</span>
                        )}
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
