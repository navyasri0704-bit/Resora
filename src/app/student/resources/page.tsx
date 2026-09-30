'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { MultiStepBookingModal } from '@/components/booking/MultiStepBookingModal';
import { Resource } from '@/types';
import {
  Search,
  Sparkles,
  MapPin,
  Users,
  ArrowRight,
  Clock,
  Wifi,
  Cpu,
  Projector,
  X
} from 'lucide-react';

export default function StudentResourcesPage() {
  const { resources, parseSmartQuery } = useResora();
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Smart Finder State
  const [isAiModeActive, setIsAiModeActive] = useState(false);
  const [aiQueryInput, setAiQueryInput] = useState(
    'I need a lab for 8 students tomorrow from 2 PM to 6 PM with Wi-Fi, Arduino kits and a projector.'
  );
  const [aiSearchResult, setAiSearchResult] = useState<ReturnType<typeof parseSmartQuery> | null>(null);

  const [bookingModalRes, setBookingModalRes] = useState<Resource | null>(null);

  const categories = ['All', 'Labs', 'Rooms', 'Equipment', 'Facility', 'Bundle'];

  const handleRunAiMatch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQueryInput.trim()) return;
    const res = parseSmartQuery(aiQueryInput);
    setAiSearchResult(res);
    setIsAiModeActive(true);
  };

  const handlePresetClick = (presetText: string) => {
    setAiQueryInput(presetText);
    const res = parseSmartQuery(presetText);
    setAiSearchResult(res);
    setIsAiModeActive(true);
  };

  const handleClearAiMatch = () => {
    setIsAiModeActive(false);
    setAiSearchResult(null);
  };

  // Determine resources list and match mapping
  let displayedItems: Array<{
    resource: Resource;
    matchScore?: number;
    reasons?: string[];
  }> = [];

  if (isAiModeActive && aiSearchResult) {
    displayedItems = aiSearchResult.matches
      .filter(m => {
        const res = m.resource;
        const matchesCat =
          selectedType === 'All' ||
          res.type === selectedType ||
          (selectedType === 'Labs' && res.type === 'Lab') ||
          (selectedType === 'Rooms' && res.type === 'Room');
        const matchesQuery =
          !searchQuery.trim() ||
          res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.department.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
      })
      .map(m => ({
        resource: m.resource,
        matchScore: m.matchScore,
        reasons: m.reasons,
      }));
  } else {
    const filtered = resources.filter(res => {
      const matchesCat =
        selectedType === 'All' ||
        res.type === selectedType ||
        (selectedType === 'Labs' && res.type === 'Lab') ||
        (selectedType === 'Rooms' && res.type === 'Room');
      const matchesQuery =
        !searchQuery.trim() ||
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });

    displayedItems = filtered.map(res => ({ resource: res }));
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <span>Explore Campus Resources</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
                  AI-Powered
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Browse labs, study rooms, microcontrollers, projectors, and compute nodes with AI Smart Match
              </p>
            </div>

            {!isAiModeActive && (
              <button
                onClick={() => handleRunAiMatch()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Activate AI Smart Match</span>
              </button>
            )}
          </div>

          {/* AI Smart Finder Engine Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white relative overflow-hidden shadow-card border border-purple-900/50">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Resora AI Smart Finder Engine</span>
                </span>
                {isAiModeActive && (
                  <button
                    onClick={handleClearAiMatch}
                    className="text-xs text-purple-300 hover:text-white bg-purple-900/60 hover:bg-purple-800/80 px-3 py-1 rounded-lg border border-purple-700/50 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset AI Search</span>
                  </button>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold font-heading text-white">Describe what you need in plain English</h2>
                <p className="text-xs text-purple-200 mt-0.5">
                  Describe team size, equipment, duration, or event requirements to get instant AI recommendations.
                </p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleRunAiMatch} className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={2}
                    value={aiQueryInput}
                    onChange={e => setAiQueryInput(e.target.value)}
                    placeholder="Example: I need a lab for 8 students tomorrow from 2 PM to 6 PM with Wi-Fi, Arduino kits and a projector."
                    className="w-full p-3.5 pr-36 text-xs bg-slate-900/80 border border-purple-500/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-slate-100 placeholder:text-slate-400 font-sans"
                  />
                  <button
                    type="submit"
                    className="absolute bottom-3 right-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Match</span>
                  </button>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-[11px] text-purple-300 font-medium">Try Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetClick(
                        'I need a lab for 8 students tomorrow from 2 PM to 6 PM with Wi-Fi, Arduino kits and a projector.'
                      )
                    }
                    className="text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    8 Students + Arduino + Projector
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetClick(
                        'Need high performance GPU workstation for deep learning model training for 3 hours.'
                      )
                    }
                    className="text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    GPU Deep Learning Node
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetClick(
                        'Auditorium hall for 200 people with Dolby surround sound audio and live streaming rig.'
                      )
                    }
                    className="text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    Seminar Hall Auditorium
                  </button>
                </div>
              </form>

              {/* AI Extracted Parameters Breakdown if active */}
              {isAiModeActive && aiSearchResult && (
                <div className="pt-2 border-t border-purple-800/60 space-y-2">
                  <h3 className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    AI Extracted Requirements
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-purple-500/30 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 block">Capacity</span>
                        <strong className="text-white text-xs">{aiSearchResult.extractedRequirements.people} Students</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-purple-500/30 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 block">Duration</span>
                        <strong className="text-white text-xs">{aiSearchResult.extractedRequirements.durationHours} Hours</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-purple-500/30 flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 block">Wi-Fi</span>
                        <strong className="text-emerald-300 text-xs">{aiSearchResult.extractedRequirements.wifi ? 'Required ✓' : 'Optional'}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-purple-500/30 flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 block">Arduino Kits</span>
                        <strong className="text-blue-300 text-xs">{aiSearchResult.extractedRequirements.arduino ? 'Required ✓' : 'Optional'}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-purple-500/30 flex items-center space-x-2">
                      <Projector className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 block">Projector</span>
                        <strong className="text-amber-300 text-xs">{aiSearchResult.extractedRequirements.projector ? 'Required ✓' : 'Optional'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search & Filter Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by name, building or department..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedType === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count & Mode Indicator */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {isAiModeActive ? `AI Match Recommendations (${displayedItems.length})` : `All Campus Resources (${displayedItems.length})`}
            </h3>
            {isAiModeActive && (
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Sorted by AI Match Score
              </span>
            )}
          </div>

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map(({ resource: res, matchScore, reasons }) => (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {matchScore !== undefined && (
                      <div className="absolute top-3 left-3 bg-purple-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{matchScore}% Match</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={res.status} />
                    </div>
                    {matchScore === undefined && (
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {res.type}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                        {res.department} Dept
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Cap: {res.capacity}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {res.name}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {res.building} · {res.floor}
                    </p>

                    {/* AI Match Reasons Box if AI mode is active */}
                    {reasons && reasons.length > 0 && (
                      <div className="space-y-1 bg-purple-50/70 p-3 rounded-2xl border border-purple-100 text-[11px] text-purple-950">
                        <strong className="block text-purple-900 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" /> Why it matched:
                        </strong>
                        <ul className="space-y-0.5 list-disc list-inside text-slate-700 text-[11px]">
                          {reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.features.slice(0, 4).map(f => (
                        <span key={f} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-2">
                  <Link
                    href={`/student/resources/${res.id}`}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-center font-semibold rounded-xl text-xs transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setBookingModalRes(res)}
                    disabled={res.status === 'MAINTENANCE'}
                    className={`flex-1 py-2 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1 ${
                      res.status === 'MAINTENANCE'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : matchScore !== undefined
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                    }`}
                  >
                    <span>{res.status === 'MAINTENANCE' ? 'Under Repair' : 'Book Space'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MultiStepBookingModal
        isOpen={!!bookingModalRes}
        onClose={() => setBookingModalRes(null)}
        preSelectedResource={bookingModalRes}
      />
    </div>
  );
}

