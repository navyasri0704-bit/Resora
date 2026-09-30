'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { MultiStepBookingModal } from '@/components/booking/MultiStepBookingModal';
import { Users, Search, FolderGit2, CheckCircle2, Eye } from 'lucide-react';

export default function FacultyStudentMentoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const students = [
    { name: 'Rahul Verma', year: 'CSE · 4th Year', project: 'Smart Agriculture IoT', status: 'In Progress', progress: 78, dept: 'CSE' },
    { name: 'Sneha Reddy', year: 'CSE · 3rd Year', project: 'AI for Healthcare', status: 'In Progress', progress: 65, dept: 'CSE' },
    { name: 'Karthik Sai', year: 'ECE · 4th Year', project: 'Autonomous Drone', status: 'Planning', progress: 45, dept: 'ECE' },
    { name: 'Priya Sharma', year: 'CSE · 3rd Year', project: 'Web3 Learning Platform', status: 'In Progress', progress: 82, dept: 'CSE' },
    { name: 'Aditya Kumar', year: 'CSE · 2nd Year', project: 'Campus Navigation App', status: 'Completed', progress: 100, dept: 'CSE' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Faculty Mentorship</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Student Mentoring & Capstone Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review student progress, project milestones, and approve lab resource requests
            </p>
          </div>

          {/* Student Mentoring Table matching Screenshot #7 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex space-x-2 text-xs">
                <button className="px-3 py-1 bg-brand-50 text-brand-600 font-bold rounded-lg">My Students</button>
                <button className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200">Projects</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Student</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Project / Interest</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{st.name}</td>
                      <td className="py-4 px-4 text-slate-500">{st.year}</td>
                      <td className="py-4 px-4 font-semibold text-brand-600">{st.project}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            st.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : st.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-600 rounded-full" style={{ width: `${st.progress}%` }} />
                          </div>
                          <span className="font-bold text-slate-700 text-[11px]">{st.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setIsBookingModalOpen(true)}
                          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-[11px] shadow-sm"
                        >
                          Approve Resources
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
