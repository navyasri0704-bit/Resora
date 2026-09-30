'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

export default function QrPassPage() {
  const { currentUser, bookings } = useResora();
  const [refreshKey, setRefreshKey] = useState(0);

  // Active or approved booking
  const activeBooking =
    bookings.find(b => b.userId === currentUser.id && (b.status === 'APPROVED' || b.status === 'COMPLETED')) ||
    bookings[0];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full flex flex-col items-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Digital Access Pass
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Present this encrypted QR code at campus doors or scanner kiosks to check in
            </p>
          </div>

          {activeBooking ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-sm w-full text-center relative">
              {/* Pass Header Banner */}
              <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-sm">
                      R
                    </div>
                    <span className="font-bold text-sm tracking-tight">RESORA PASS</span>
                  </div>
                  <StatusBadge status={activeBooking.status} />
                </div>

                <div className="mt-4 text-left">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Resource</span>
                  <h3 className="text-lg font-bold text-white">{activeBooking.resourceName}</h3>
                  <p className="text-xs text-slate-300">{activeBooking.location}</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-8 bg-slate-50 flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-card">
                  <QRCodeSVG
                    key={refreshKey}
                    value={activeBooking.qrCodeUrl || `RESORA-${activeBooking.bookingCode}`}
                    size={180}
                    level="H"
                    includeMargin
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Booking Pass Code</span>
                  <strong className="text-lg font-mono font-bold text-brand-600 tracking-wider">
                    #{activeBooking.bookingCode}
                  </strong>
                </div>

                <button
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-brand-600 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh QR Security Token</span>
                </button>
              </div>

              {/* Pass Details Footer */}
              <div className="p-6 bg-white border-t border-slate-100 text-xs space-y-2 text-left">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Student Name:</span>
                  <strong className="text-slate-800">{activeBooking.userName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Date:</span>
                  <strong className="text-slate-800">{activeBooking.date}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Time Slot:</span>
                  <strong className="text-slate-800">{activeBooking.startTime} – {activeBooking.endTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purpose:</span>
                  <strong className="text-slate-800">{activeBooking.purpose}</strong>
                </div>
              </div>

              {/* Pass Security Notice Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Official Campus Access Pass</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border text-center text-slate-500 text-xs">
              No active approved bookings found. Request a resource to generate your access pass.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
