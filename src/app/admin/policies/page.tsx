'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function AdminPoliciesPage() {
  const policies = [
    { title: 'Maximum Booking Duration', config: '4 Hours per student request', desc: 'Prevents single user monopolization of high demand labs.' },
    { title: 'Advance Booking Limit', config: '7 Days in advance', desc: 'Prevents advance hoardings for upcoming months.' },
    { title: 'Check-In Grace Period', config: '15 Minutes', desc: 'If student does not scan QR pass within grace period, slot is auto-released to waitlist.' },
    { title: 'Faculty Approval Policy', config: 'Required for Labs & Auditoriums', desc: 'Equipment under $500 auto-approved; high end compute requires faculty signature.' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Governance</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Policies & Engine Rules
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure maximum booking durations, grace periods, no-show auto-release, and approval gates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    <span className="text-xs font-bold text-brand-600">{p.config}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
