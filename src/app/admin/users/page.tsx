'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Users, Shield, GraduationCap, UserCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const usersList = [
    { name: 'Aryan Reddy', email: 'student@resora.demo', role: 'STUDENT', dept: 'CSE', roll: 'CSE-2023-042' },
    { name: 'Dr. S. Rao', email: 'faculty@resora.demo', role: 'FACULTY', dept: 'CSE', title: 'Faculty Lead' },
    { name: 'Campus Admin', email: 'admin@resora.demo', role: 'ADMIN', dept: 'Central', title: 'System Admin' },
    { name: 'Rahul Verma', email: 'rahul.v@college.edu', role: 'STUDENT', dept: 'CSE', roll: 'CSE-2023-018' },
    { name: 'Sneha Reddy', email: 'sneha.r@college.edu', role: 'STUDENT', dept: 'CSE', roll: 'CSE-2023-094' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Access Management</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Users & Access Control
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage student, faculty, and administrator roles and permissions
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                      <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{u.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'FACULTY'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-brand-100 text-brand-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-semibold">{u.dept}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px]">
                          Edit Permissions
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
    </div>
  );
}
