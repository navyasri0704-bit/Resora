'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { CalendarCheck, Search } from 'lucide-react';

export default function AdminBookingsPage() {
  const { bookings } = useResora();
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredBookings = bookings.filter(b => filterStatus === 'All' || b.status === filterStatus);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Campus Bookings</span>
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
                All Campus Reservations
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Filter and inspect booking history across all departments
              </p>
            </div>

            <div className="flex space-x-2">
              {['All', 'APPROVED', 'PENDING', 'COMPLETED', 'REJECTED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === st
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Booking ID</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Resource</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Purpose</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-brand-600">#{b.bookingCode}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{b.userName}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{b.resourceName}</td>
                      <td className="py-4 px-4 text-slate-500">{b.date} ({b.startTime}-{b.endTime})</td>
                      <td className="py-4 px-4 text-slate-600">{b.purpose}</td>
                      <td className="py-4 px-6 text-right">
                        <StatusBadge status={b.status} />
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
