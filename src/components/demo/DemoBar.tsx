'use client';

import React, { useState } from 'react';
import { useResora } from '@/context/ResoraContext';
import { UserRole } from '@/types';
import { Shield, UserCheck, GraduationCap, CheckCircle2, ChevronRight, Play, RefreshCw } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { currentUser, setRole } = useResora();
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const demoSteps = [
    { step: 1, role: 'STUDENT', path: '/student/dashboard', title: '1. Student Dashboard', text: 'View upcoming bookings, career cards, and placement progress.' },
    { step: 2, role: 'STUDENT', path: '/student/resources', title: '2. Smart AI Resource Finder', text: 'Ask AI: "I need a lab for 8 students tomorrow from 2 PM to 6 PM..."' },
    { step: 3, role: 'STUDENT', path: '/student/resources/res_05', title: '3. Select Innovation Lab', text: 'View capacity, features, dependencies & submit multi-step booking request.' },
    { step: 4, role: 'FACULTY', path: '/faculty/dashboard', title: '4. Switch to Faculty & Approve', text: 'Log in as Dr. S. Rao, review pending request and click "Approve".' },
    { step: 5, role: 'STUDENT', path: '/student/qr-pass', title: '5. Student QR Access Pass', text: 'View dynamic QR code pass generated upon faculty approval.' },
    { step: 6, role: 'STUDENT', path: '/student/qr-pass', title: '6. Access Pass Security', text: 'Verify student digital access pass token and real-time status.' },
    { step: 7, role: 'ADMIN', path: '/admin/dashboard', title: '7. Admin Command Center', text: 'Inspect real-time campus metrics, department donut chart & audit logs.' },
    { step: 8, role: 'ADMIN', path: '/admin/maintenance', title: '8. Maintenance Engine', text: 'Mark Projector #07 under maintenance; conflict engine automatically blocks bookings!' },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs py-2 px-4 sticky top-0 z-50 flex flex-wrap items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold bg-brand-500 text-white uppercase tracking-wider text-[10px]">
          Demo Mode
        </span>
        <span className="hidden sm:inline text-slate-300">Switch role instantly:</span>
        <div className="flex space-x-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setRole('STUDENT')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              currentUser.role === 'STUDENT'
                ? 'bg-brand-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => setRole('FACULTY')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              currentUser.role === 'FACULTY'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>

          <button
            onClick={() => setRole('ADMIN')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              currentUser.role === 'ADMIN'
                ? 'bg-purple-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-1 sm:mt-0">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center space-x-1 text-slate-300 hover:text-brand-300 underline font-medium"
        >
          <Play className="w-3 h-3 text-brand-400" />
          <span>{showGuide ? 'Hide Demo Guide' : 'Interactive Demo Workflow'}</span>
        </button>

        <span className="text-slate-500">|</span>
        <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
          Active: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
        </span>
      </div>

      {/* Demo Guide Drawer */}
      {showGuide && (
        <div className="w-full mt-2 pt-2 border-t border-slate-800 bg-slate-900/90 rounded-b p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-brand-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Judge Demo Walkthrough Protocol (Requirement #39)
            </h4>
            <span className="text-[11px] text-slate-400">Step {currentStep} of {demoSteps.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {demoSteps.map(st => (
              <div
                key={st.step}
                onClick={() => {
                  setCurrentStep(st.step);
                  setRole(st.role as UserRole);
                  window.location.href = st.path;
                }}
                className={`cursor-pointer p-2 rounded border text-left transition-all ${
                  currentStep === st.step
                    ? 'border-brand-500 bg-brand-950/60 ring-1 ring-brand-500'
                    : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                  <span>{st.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {st.role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
