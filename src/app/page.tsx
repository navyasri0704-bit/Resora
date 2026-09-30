'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import {
  Boxes,
  Sparkles,
  Briefcase,
  BookOpen,
  Trophy,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Building2,
  Zap,
  FolderGit2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-24 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Smart Campus. Brighter Futures.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Discover.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">
                  Book.
                </span>{' '}
                Access. Grow.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                One intelligent campus platform for resources, learning, opportunities and student growth.
              </p>

              {/* Hero Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-sm shadow-card shadow-brand-500/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/student/resources"
                  className="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold rounded-2xl text-sm shadow-sm flex items-center space-x-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Try Smart AI Finder</span>
                </Link>
              </div>

              {/* Quick Search Tag Pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-xs text-slate-400 font-medium mr-1">Popular:</span>
                {['AI/ML Lab', 'Robotics Kit', 'Seminar Hall', 'Projector #07', 'Gate Prep'].map(tag => (
                  <Link
                    key={tag}
                    href="/student/resources"
                    className="text-[11px] bg-white text-slate-600 hover:text-brand-600 border border-slate-200 px-3 py-1 rounded-xl shadow-xs transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Hero Graphic with Floating Cards */}
            <div className="relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200"
                  alt="Resora Campus"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating Card 1: Innovation Lab */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-white/40 flex items-center space-x-3 max-w-xs animate-in fade-in duration-500">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Innovation Lab</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Available Now · Block A
                    </span>
                  </div>
                </div>

                {/* Floating Card 2: Stats Badge */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-white flex items-center space-x-4 shadow-xl">
                  <div className="border-r border-slate-700 pr-4">
                    <span className="text-xl font-bold text-brand-400 block">1,200+</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">Active Students</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-emerald-400 block">250+</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">Campus Resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-white border-y border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">250+</span>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Campus Resources</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-600 font-heading">1,200+</span>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Enrolled Students</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-heading">120+</span>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Faculty Mentors</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading">98%</span>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything Your Campus Needs
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Streamline space bookings, equipment access, placement readiness, and project mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Boxes,
                title: '🏫 Labs & Rooms',
                desc: 'Book campus spaces, high-end compute labs, and AV equipment with instant availability check.',
                link: '/student/resources',
                color: 'text-brand-600 bg-brand-50',
              },
              {
                icon: Sparkles,
                title: '🤖 Smart Resource Finder',
                desc: 'Find the right resource using natural language AI query parser & matching algorithm.',
                link: '/student/resources',
                color: 'text-purple-600 bg-purple-50',
              },
              {
                icon: Briefcase,
                title: '💼 Placements',
                desc: 'Prepare for top tech careers with structured DSA, aptitude, and CS fundamental roadmaps.',
                link: '/student/placements',
                color: 'text-blue-600 bg-blue-50',
              },
              {
                icon: BookOpen,
                title: '📚 Exam Preparation',
                desc: 'Study smarter for GATE, CAT, GRE, and university examinations with practice modules.',
                link: '/student/exam-preparation',
                color: 'text-amber-600 bg-amber-50',
              },
              {
                icon: GraduationCap,
                title: '🎓 Opportunities Hub',
                desc: 'Discover national competitions, hackathons, tech internships, and innovation challenges.',
                link: '/student/opportunities',
                color: 'text-rose-600 bg-rose-50',
              },
              {
                icon: FolderGit2,
                title: '📁 Student Projects',
                desc: 'Track capstone milestones, collaborate with team members, and request missing hardware.',
                link: '/student/projects',
                color: 'text-emerald-600 bg-emerald-50',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={idx}
                  href={feat.link}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{feat.desc}</p>
                  <span className="mt-4 text-xs font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore feature →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW RESORA WORKS */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How Resora Works</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { step: '1', title: 'Discover', desc: 'Search labs & gear' },
              { step: '2', title: 'Match', desc: 'AI smart parsing' },
              { step: '3', title: 'Reserve', desc: 'Multi-step booking' },
              { step: '4', title: 'Approve', desc: 'Faculty validation' },
              { step: '5', title: 'Access', desc: 'QR code pass' },
              { step: '6', title: 'Grow', desc: 'Track progress' },
            ].map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3 shadow-md">
                  {st.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Tailored Roles & Experiences</h2>
            <p className="text-slate-400 text-sm mt-2">Built for students, faculty leads, and campus administrators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Students</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Discover campus labs, book equipment, generate QR access passes, and access career roadmaps.
              </p>
              <Link
                href="/student/dashboard"
                className="mt-6 inline-flex items-center text-xs font-bold text-brand-400 hover:text-brand-300 gap-1"
              >
                Open Student Dashboard →
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Faculty</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Review and approve student resource requests, manage schedule timelines, and mentor capstone projects.
              </p>
              <Link
                href="/faculty/dashboard"
                className="mt-6 inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 gap-1"
              >
                Open Faculty Dashboard →
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Administrators</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Campus Command Center with resource utilization analytics, maintenance management, and audit logs.
              </p>
              <Link
                href="/admin/dashboard"
                className="mt-6 inline-flex items-center text-xs font-bold text-purple-400 hover:text-purple-300 gap-1"
              >
                Open Command Center →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-gradient-to-tr from-brand-700 to-brand-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Make your campus smarter.
          </h2>
          <p className="text-brand-100 text-sm max-w-xl mx-auto">
            Empower students, streamline faculty approvals, and optimize resource usage across every department.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-brand-900 font-bold rounded-2xl text-sm shadow-xl transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 text-white font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-sm">R</div>
              <span>RESORA</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Smart Campus Resource Network. Discover, book, access, and grow with one unified platform.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/student/resources" className="hover:text-white">Labs & Rooms</Link></li>
              <li><Link href="/student/resources" className="hover:text-white">AI Resource Finder</Link></li>
              <li><Link href="/student/projects" className="hover:text-white">Student Projects</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Roles</h4>
            <ul className="space-y-2">
              <li><Link href="/student/dashboard" className="hover:text-white">Students</Link></li>
              <li><Link href="/faculty/dashboard" className="hover:text-white">Faculty</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-white">Administrators</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Legal & Info</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900 text-center text-slate-600">
          © 2026 RESORA Smart Campus Network. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
