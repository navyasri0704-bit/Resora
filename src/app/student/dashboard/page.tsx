'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { MultiStepBookingModal } from '@/components/booking/MultiStepBookingModal';
import { StatusBadge } from '@/components/common/Badge';
import {
  Search,
  Building2,
  CalendarCheck,
  Cpu,
  MapPin,
  Briefcase,
  BookOpen,
  Trophy,
  Globe,
  TrendingUp,
  Sparkles,
  QrCode,
  GraduationCap,
  FolderGit2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, bookings, opportunities, progress, applyToOpportunity, toggleSaveOpportunity } = useResora();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Student specific bookings
  const studentBookings = bookings.filter(b => b.userId === currentUser.id || b.userName.includes(currentUser.name.split(' ')[0]));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                  Campus Fest & Registration 2026
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
                  Good morning, {currentUser.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                  Keep learning, exploring campus resources, and building your future.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href="/student/resources"
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Smart Match</span>
                </Link>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all"
                >
                  <CalendarCheck className="w-4 h-4 text-brand-600" />
                  <span>Quick Book</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Cards matching UI screenshot #3 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-500">
              Quick Resource Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/student/resources"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    Find a Lab
                  </h4>
                  <p className="text-[10px] text-slate-400">40+ Labs Available</p>
                </div>
              </Link>

              <Link
                href="/student/resources"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    Book a Room
                  </h4>
                  <p className="text-[10px] text-slate-400">Halls & Study Pods</p>
                </div>
              </Link>

              <Link
                href="/student/resources"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    Get Equipment
                  </h4>
                  <p className="text-[10px] text-slate-400">Projectors, Kits, GPUs</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Career Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Placements', sub: 'DSA, Aptitude, Prep', icon: Briefcase, href: '/student/placements', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Exam Prep', sub: 'GATE, CAT, GRE', icon: BookOpen, href: '/student/exam-preparation', color: 'bg-blue-50 text-blue-600' },
              { label: 'Opportunities', sub: 'Hackathons & Roles', icon: GraduationCap, href: '/student/opportunities', color: 'bg-purple-50 text-purple-600' },
              { label: 'My Projects', sub: 'Team & Milestones', icon: FolderGit2, href: '/student/projects', color: 'bg-amber-50 text-amber-600' },
              { label: 'Skill Progress', sub: 'Readiness Metrics', icon: TrendingUp, href: '/student/progress', color: 'bg-brand-50 text-brand-600' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Link
                  key={i}
                  href={c.href}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-xl ${c.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{c.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.sub}</p>
                </Link>
              );
            })}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: My Bookings & Recommended Opportunities */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Bookings Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">My Bookings</h3>
                    <p className="text-xs text-slate-500">Upcoming space & equipment reservations</p>
                  </div>
                  <Link href="/student/bookings" className="text-xs font-bold text-brand-600 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {studentBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-900">{b.resourceName}</h4>
                            <StatusBadge status={b.status} />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {b.date === new Date().toISOString().split('T')[0] ? 'Today' : b.date},{' '}
                            {b.startTime} – {b.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {b.status === 'APPROVED' ? (
                          <Link
                            href="/student/qr-pass"
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 shadow-sm"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>View Pass</span>
                          </Link>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Pending Approval</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Recommended Opportunities</h3>
                    <p className="text-xs text-slate-500">Hackathons, internships & competitions tailored for CSE</p>
                  </div>
                  <Link href="/student/opportunities" className="text-xs font-bold text-brand-600 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {opportunities.map(opp => (
                    <div
                      key={opp.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                              {opp.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{opp.organization} · Deadline: {opp.deadline}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {opp.tags.map(t => (
                              <span key={t} className="text-[9px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {opp.applicationUrl || opp.officialWebsiteUrl ? (
                        <a
                          href={(opp.applicationUrl || opp.officialWebsiteUrl)!.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => applyToOpportunity(opp.id)}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1"
                        >
                          <span>Apply Now →</span>
                        </a>
                      ) : (
                        <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200">
                          Link Unavailable
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Circular Progress & Skill Readiness Chart */}
            <div className="space-y-6">
              {/* Circular Readiness Chart Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft text-center">
                <h3 className="font-bold text-slate-900 text-base mb-1">Your Readiness</h3>
                <p className="text-xs text-slate-500 mb-6">Placement & Skill Evaluation</p>

                {/* Simulated SVG Circular Meter */}
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="#E2E8F0"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="#2563EB"
                      strokeWidth="12"
                      strokeDasharray="408"
                      strokeDashoffset={408 - (408 * progress.overallReadiness) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-slate-900 font-heading">
                      {progress.overallReadiness}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Overall</span>
                  </div>
                </div>

                {/* Progress Breakdown */}
                <div className="mt-6 space-y-2.5 text-left text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600">DSA & Algorithms</span>
                      <span className="text-slate-900">{progress.dsaScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${progress.dsaScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600">Aptitude</span>
                      <span className="text-slate-900">{progress.aptitudeScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress.aptitudeScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600">CS Fundamentals</span>
                      <span className="text-slate-900">{progress.csFundamentalsScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress.csFundamentalsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600">Capstone Projects</span>
                      <span className="text-slate-900">{progress.projectsScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progress.projectsScore}%` }} />
                    </div>
                  </div>
                </div>

                <Link
                  href="/student/placements"
                  className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-all"
                >
                  <span>View Full Placement Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MultiStepBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
