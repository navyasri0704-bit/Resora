'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { MultiStepBookingModal } from '@/components/booking/MultiStepBookingModal';
import { Building2, MapPin, Users, Calendar, Clock, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ResourceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { resources, bookings } = useResora();
  const [activeTab, setActiveTab] = useState<'Availability' | 'Equipment' | 'Rules' | 'Reviews'>('Availability');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const resourceId = params?.id as string;
  const resource = resources.find(r => r.id === resourceId) || resources[0];

  // Relevant bookings for calendar
  const resBookings = bookings.filter(b => b.resourceId === resource.id);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Resources</span>
          </button>

          {/* Hero Resource Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-72 lg:h-auto">
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <StatusBadge status={resource.status} />
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  {resource.department} Department Resource
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
                  {resource.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {resource.building} · {resource.floor}
                </p>

                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  {resource.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Capacity</span>
                    <strong className="text-slate-900 text-sm font-heading">{resource.capacity} Students</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Department</span>
                    <strong className="text-slate-900 text-sm font-heading">{resource.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Sharing</span>
                    <strong className="text-slate-900 text-sm font-heading">{resource.isShared ? 'Cross-Dept' : 'Internal'}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Operating Hours: <strong className="text-slate-800">{resource.operatingHours || '08:00 AM - 08:00 PM'}</strong>
                </span>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  disabled={resource.status === 'MAINTENANCE'}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all ${
                    resource.status === 'MAINTENANCE'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 hover:scale-[1.02]'
                  }`}
                >
                  {resource.status === 'MAINTENANCE' ? 'Resource Under Maintenance' : 'Book Resource Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Details & Availability Tabs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6">
            <div className="flex border-b border-slate-200 mb-6 space-x-6 text-xs font-bold">
              {(['Availability', 'Equipment', 'Rules', 'Reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 transition-colors relative ${
                    activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Availability Schedule */}
            {activeTab === 'Availability' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Today & Upcoming Reserved Slots</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {resBookings.map(b => (
                    <div key={b.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{b.userName}</span>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-slate-500 text-[11px]">{b.date} · {b.startTime} - {b.endTime}</p>
                      <p className="text-slate-400 text-[10px]">Purpose: {b.purpose}</p>
                    </div>
                  ))}
                  {resBookings.length === 0 && (
                    <div className="text-slate-400 text-xs py-4 col-span-full">No existing bookings for this space today.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Equipment */}
            {activeTab === 'Equipment' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Installed Hardware & Kits</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.features.map(f => (
                    <span key={f} className="px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-800 rounded-xl text-xs font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Rules */}
            {activeTab === 'Rules' && (
              <div className="space-y-2 text-xs text-slate-600">
                <p>✓ Check-in within 15 minutes of slot start time using your QR Access Pass.</p>
                <p>✓ Ensure equipment is returned to default docking state after use.</p>
                <p>✓ Faculty approval required for slots exceeding 4 hours.</p>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'Reviews' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Rahul V. (CSE 4th Year)</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                  <p className="text-slate-500 mt-1">Excellent GPU speeds and solid Wi-Fi stability during our hackathon project.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MultiStepBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preSelectedResource={resource}
      />
    </div>
  );
}
