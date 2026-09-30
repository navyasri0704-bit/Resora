'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import {
  Calendar,
  CheckSquare,
  FolderGit2,
  Boxes,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function FacultyDashboard() {
  const { currentUser, bookings, approveBooking, rejectBooking, projects } = useResora();

  // Pending bookings awaiting faculty approval
  const pendingApprovals = bookings.filter(b => b.status === 'PENDING');

  const todaySchedule = [
    { time: '09:00 – 10:00', title: 'DBMS (CSE-K)', location: 'Room 302', type: 'Class' },
    { time: '11:00 – 12:00', title: 'OS (CSE-B)', location: 'Lab 1', type: 'Lab' },
    { time: '02:00 – 04:00', title: 'AI Lab Session', location: 'Innovation Lab', type: 'Lab' },
    { time: '04:30 – 06:00', title: 'Project Mentoring', location: 'Room 201', type: 'Mentoring' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Faculty Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Faculty Workspace · CSE Department
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
                  Good morning, {currentUser.name}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                  Manage your classes, approve student resource requests, and mentor project teams.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href="/faculty/approvals"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Review {pendingApprovals.length} Approvals</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Bar matching UI Screenshot #4 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold font-heading text-xl">
                4
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Today&apos;s Classes</span>
                <span className="text-sm font-bold text-slate-900">Active Schedule</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold font-heading text-xl">
                {pendingApprovals.length}
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Pending Approvals</span>
                <span className="text-sm font-bold text-slate-900">Requires Action</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-heading text-xl">
                {projects.length}
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Student Projects</span>
                <span className="text-sm font-bold text-slate-900">Under Mentorship</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-heading text-xl">
                45
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Enrolled Students</span>
                <span className="text-sm font-bold text-slate-900">CSE Department</span>
              </div>
            </div>
          </div>

          {/* Today's Schedule Timeline & Pending Approvals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Schedule Timeline */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Today&apos;s Schedule</h3>
                <span className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString()}</span>
              </div>

              <div className="space-y-3">
                {todaySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-20 font-bold text-brand-600 shrink-0">{item.time}</div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-500">{item.location}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold text-[10px]">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals Widget matching UI screenshot #4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Pending Approvals</h3>
                  <p className="text-xs text-slate-500">Student resource booking requests</p>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {pendingApprovals.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {pendingApprovals.map(appr => (
                  <div
                    key={appr.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-100/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-xs">{appr.resourceName}</h4>
                        <span className="text-[10px] bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded">
                          #{appr.bookingCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Requested by: <strong>{appr.userName}</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {appr.date} · {appr.startTime} – {appr.endTime} · Purpose: {appr.purpose}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => approveBooking(appr.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => rejectBooking(appr.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-xs flex items-center space-x-1 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}

                {pendingApprovals.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    All student booking requests have been processed!
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
