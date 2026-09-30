'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { FileText, Shield } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs } = useResora();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Security & Compliance</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              System Audit Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger of all booking approvals, door check-ins, maintenance blocks, and administrative actions
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-6">Action</th>
                    <th className="py-3.5 px-4">Target Resource</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{log.user}</td>
                      <td className="py-4 px-4 font-semibold text-purple-600">{log.role}</td>
                      <td className="py-4 px-6 text-slate-800 font-medium">{log.action}</td>
                      <td className="py-4 px-4 text-slate-600 font-semibold">{log.resource}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={log.status} />
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
