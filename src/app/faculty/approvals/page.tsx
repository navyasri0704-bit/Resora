'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { CheckSquare, CheckCircle2, XCircle, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { Booking } from '@/types';

export default function FacultyApprovalsPage() {
  const { bookings, approveBooking, rejectBooking, requestChangesBooking } = useResora();
  const [selectedBookingForChanges, setSelectedBookingForChanges] = useState<Booking | null>(null);
  const [changesComment, setChangesComment] = useState('Please reduce the booking duration to 3 hours.');

  const handleSendRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForChanges || !changesComment.trim()) return;
    requestChangesBooking(selectedBookingForChanges.id, changesComment);
    setSelectedBookingForChanges(null);
    setChangesComment('Please reduce the booking duration to 3 hours.');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Faculty Governance</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Student Resource Booking Approvals
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review, approve, request changes, or reject student requests for lab space and hardware
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="divide-y divide-slate-100">
              {bookings.map(b => (
                <div key={b.id} className="p-6 flex flex-wrap items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1.5 flex-1 min-w-[280px]">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-slate-900">{b.resourceName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                        #{b.bookingCode}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-slate-600">
                      Requested by student: <strong>{b.userName}</strong> ({b.userRole})
                    </p>
                    <p className="text-xs text-slate-500">
                      Location: {b.location} · Purpose: <strong>{b.purpose}</strong> · Date: {b.date} ({b.startTime} - {b.endTime})
                    </p>
                    {b.additionalItems && b.additionalItems.length > 0 && (
                      <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded-xl border border-purple-100 inline-block">
                        <strong>Requested Equipment Dependencies:</strong> {b.additionalItems.join(', ')}
                      </p>
                    )}
                    {b.requestChangesNote && (
                      <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                        <strong>Faculty Note:</strong> {b.requestChangesNote}
                      </p>
                    )}
                    {b.rejectionReason && (
                      <p className="text-xs text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200">
                        <strong>Rejection Reason:</strong> {b.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {b.status === 'PENDING' || b.status === 'CHANGES_REQUESTED' ? (
                      <>
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setSelectedBookingForChanges(b)}
                          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-xl text-xs flex items-center space-x-1 transition-all"
                        >
                          <MessageSquare className="w-4 h-4 text-amber-600" />
                          <span>Request Changes</span>
                        </button>

                        <button
                          onClick={() => rejectBooking(b.id, 'Schedule conflict with department class.')}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-xs flex items-center space-x-1 transition-all"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">Action Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Request Changes Modal */}
      {selectedBookingForChanges && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span>Request Changes from Student</span>
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Booking <strong>#{selectedBookingForChanges.bookingCode}</strong> ({selectedBookingForChanges.resourceName}) requested by {selectedBookingForChanges.userName}.
            </p>

            <form onSubmit={handleSendRequestChanges} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comments / Required Modifications
                </label>
                <textarea
                  rows={3}
                  value={changesComment}
                  onChange={e => setChangesComment(e.target.value)}
                  placeholder="e.g. Please reduce the booking duration to 3 hours or select Block B."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForChanges(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Send Request Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
