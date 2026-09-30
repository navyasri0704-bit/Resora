'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useResora } from '@/context/ResoraContext';
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  CalendarCheck,
  Map,
  GraduationCap,
  Target,
  Briefcase,
  BookOpen,
  Trophy,
  Globe,
  FolderGit2,
  TrendingUp,
  QrCode,
  Bell,
  CheckSquare,
  Users,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Wrench,
  Settings,
  Share2,
  FileText,
  LogOut,
  ChevronUp,
  Video,
  Compass,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useResora();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const role = currentUser.role;

  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Discovery', href: '/student/discovery', icon: Compass, badge: 'Course' },
    { label: 'Resources', href: '/student/resources', icon: Boxes, badge: 'AI' },
    { label: 'My Bookings', href: '/student/bookings', icon: CalendarCheck },
    { label: 'Preparation', href: '/student/preparation', icon: Target },
    { label: 'EduReels', href: '/student/edureels', icon: Video, badge: 'NEW' },
    { label: 'Opportunities', href: '/student/opportunities', icon: GraduationCap },
    { label: 'My Projects', href: '/student/projects', icon: FolderGit2 },
    { label: 'My Progress', href: '/student/progress', icon: TrendingUp },
    { label: 'QR Access Pass', href: '/student/qr-pass', icon: QrCode },
  ];

  const facultyLinks = [
    { label: 'Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Approvals', href: '/faculty/approvals', icon: CheckSquare, badge: '7' },
    { label: 'My Classes', href: '/faculty/classes', icon: BookOpen },
    { label: 'Student Mentoring', href: '/faculty/students', icon: Users },
    { label: 'Projects', href: '/faculty/projects', icon: FolderGit2 },
    { label: 'Opportunities', href: '/faculty/opportunities', icon: GraduationCap },
    { label: 'Department Analytics', href: '/faculty/analytics', icon: BarChart3 },
    { label: 'Issues', href: '/faculty/issues', icon: AlertTriangle },
  ];

  const adminLinks = [
    { label: 'Command Center', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Resource Management', href: '/admin/resources', icon: Boxes },
    { label: 'Bookings & Approvals', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Users & Access', href: '/admin/users', icon: Users },
    { label: 'Maintenance', href: '/admin/maintenance', icon: Wrench, badge: 'Issues' },
    { label: 'Opportunities', href: '/admin/opportunities', icon: GraduationCap },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Policies & Rules', href: '/admin/policies', icon: ShieldAlert },
    { label: 'Resource Sharing', href: '/admin/sharing', icon: Share2 },
    { label: 'Audit Logs', href: '/admin/audit', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'FACULTY' ? facultyLinks : studentLinks;

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full min-h-screen shrink-0 select-none relative">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold font-heading text-xl shadow-glow">
            R
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight group-hover:text-brand-400 transition-colors">
              RESORA
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              {role} Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>

        {links.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'AI'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-brand-500/20 text-brand-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Card at Bottom with Logout Popup */}
      <div className="p-3 m-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 relative">
        {/* Profile Popup Menu */}
        {showProfileMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-850 border border-slate-700 rounded-2xl p-3 shadow-2xl space-y-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-1 py-1 border-b border-slate-700/60 pb-2">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              <span className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 bg-brand-500/20 text-brand-300 rounded border border-brand-500/30">
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/80 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Profile Card Click Target */}
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-600"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser.title}</p>
          </div>
          <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </aside>
  );
};

