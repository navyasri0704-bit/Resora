'use client';

import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold font-heading text-xl shadow-glow">
            R
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xl tracking-tight group-hover:text-brand-600 transition-colors">
              RESORA
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link href="/" className="text-brand-600 font-semibold hover:text-brand-700">
            Home
          </Link>
          <Link href="/student/resources" className="hover:text-brand-600 transition-colors">
            Resources
          </Link>
          <Link href="/student/discovery" className="hover:text-brand-600 transition-colors">
            Discovery
          </Link>
          <Link href="/student/opportunities" className="hover:text-brand-600 transition-colors">
            Opportunities
          </Link>
          <Link href="/student/placements" className="hover:text-brand-600 transition-colors">
            Learning
          </Link>
          <Link href="#about" className="hover:text-brand-600 transition-colors">
            About
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
