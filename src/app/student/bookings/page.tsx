'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { MultiStepBookingModal } from '@/components/booking/MultiStepBookingModal';
import { CalendarCheck, QrCode, Building2, Plus } from 'lucide-react';

export default function StudentBookingsPage() {
  const { bookings } = useResora();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Reservation History</span>
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
                My Bookings & Access Passes
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                View status, approval progress, and QR code access passes
              </p>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="divide-y divide-slate-100">
              {bookings.map(b => (
                <div key={b.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{b.resourceName}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{b.location} · {b.purpose} Work</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Date: {b.date} ({b.startTime} - {b.endTime}) · ID: #{b.bookingCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {b.status === 'APPROVED' && (
                      <Link
                        href="/student/qr-pass"
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
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
