'use client';

import React, { useState } from 'react';
import { useResora } from '@/context/ResoraContext';
import { Resource } from '@/types';
import { MapPin, Search, Filter, Compass, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/Badge';

interface CampusMapProps {
  onSelectResource?: (res: Resource) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({ onSelectResource }) => {
  const { resources } = useResora();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPinResource, setSelectedPinResource] = useState<Resource | null>(resources[0]);

  const categories = ['All', 'Labs', 'Rooms', 'Equipment', 'Facility'];

  const filteredResources = resources.filter(res => {
    const matchesCat = selectedCategory === 'All' || res.type === selectedCategory || (selectedCategory === 'Labs' && res.type === 'Lab') || (selectedCategory === 'Rooms' && res.type === 'Room');
    const matchesQuery = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.building.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Pin spatial mapping simulation on campus grid
  const pinPositions: Record<string, { top: string; left: string; color: string }> = {
    res_01: { top: '32%', left: '25%', color: 'bg-emerald-500' }, // AI Lab Block A
    res_02: { top: '55%', left: '68%', color: 'bg-blue-500' },    // Robotics Lab Block B
    res_03: { top: '22%', left: '50%', color: 'bg-indigo-500' },  // Seminar Hall Main
    res_04: { top: '70%', left: '35%', color: 'bg-emerald-500' }, // IoT Lab Block C
    res_05: { top: '38%', left: '28%', color: 'bg-emerald-500' }, // Innovation Lab Block A
    res_06: { top: '80%', left: '75%', color: 'bg-purple-500' },  // Media Studio
    res_07: { top: '26%', left: '52%', color: 'bg-rose-500' },    // Projector #07
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card">
      {/* Map Controls Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-600" />
            Interactive Smart Campus Map
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Locate labs, buildings & real-time resource availability</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[480px]">
        {/* Visual Vector Campus Map Area */}
        <div className="lg:col-span-2 bg-slate-900 relative overflow-hidden p-6 flex flex-col justify-between select-none">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          {/* Campus Map Buildings Graphic */}
          <div className="relative z-10 w-full h-full min-h-[400px]">
            {/* Campus Lawn / Greenery */}
            <div className="absolute top-[15%] left-[20%] w-[60%] h-[65%] bg-emerald-950/30 rounded-3xl border border-emerald-500/20 backdrop-blur-xs flex items-center justify-center">
              <span className="text-emerald-400/30 text-xs font-bold tracking-widest uppercase">Central Quad Green</span>
            </div>

            {/* Block A */}
            <div className="absolute top-[25%] left-[20%] w-[120px] h-[100px] bg-slate-800/90 rounded-2xl border border-brand-500/40 p-2 shadow-lg">
              <span className="text-[10px] font-bold text-brand-400 block">BLOCK A</span>
              <span className="text-[9px] text-slate-400 block">CSE & AI Labs</span>
            </div>

            {/* Block B */}
            <div className="absolute top-[50%] left-[62%] w-[130px] h-[110px] bg-slate-800/90 rounded-2xl border border-blue-500/40 p-2 shadow-lg">
              <span className="text-[10px] font-bold text-blue-400 block">BLOCK B</span>
              <span className="text-[9px] text-slate-400 block">ECE & Robotics</span>
            </div>

            {/* Main Auditorium */}
            <div className="absolute top-[18%] left-[45%] w-[140px] h-[75px] bg-slate-800/90 rounded-2xl border border-purple-500/40 p-2 shadow-lg">
              <span className="text-[10px] font-bold text-purple-400 block">MAIN AUDITORIUM</span>
              <span className="text-[9px] text-slate-400 block">Seminar Halls</span>
            </div>

            {/* Block C */}
            <div className="absolute top-[65%] left-[30%] w-[120px] h-[90px] bg-slate-800/90 rounded-2xl border border-emerald-500/40 p-2 shadow-lg">
              <span className="text-[10px] font-bold text-emerald-400 block">BLOCK C</span>
              <span className="text-[9px] text-slate-400 block">IoT & Hardware</span>
            </div>

            {/* Interactive Pins */}
            {filteredResources.map(res => {
              const pos = pinPositions[res.id] || { top: '45%', left: '50%', color: 'bg-brand-500' };
              const isSelected = selectedPinResource?.id === res.id;

              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedPinResource(res)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full ${
                      res.status === 'AVAILABLE' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    } flex items-center justify-center shadow-lg border-2 border-white ring-4 ${
                      isSelected ? 'ring-brand-400 animate-pulse' : 'ring-black/20'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap border border-slate-700 pointer-events-none transition-opacity">
                    {res.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="relative z-10 flex items-center space-x-4 bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 text-[11px] text-slate-300 w-fit">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Available Now</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Maintenance / Booked</span>
            </div>
          </div>
        </div>

        {/* Selected Resource Details Sidebar */}
        <div className="p-6 border-l border-slate-200/80 flex flex-col justify-between bg-white">
          {selectedPinResource ? (
            <div className="space-y-4">
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={selectedPinResource.imageUrl}
                  alt={selectedPinResource.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={selectedPinResource.status} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                  {selectedPinResource.department} Department
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedPinResource.name}</h3>
                <p className="text-xs text-slate-500">{selectedPinResource.building} · {selectedPinResource.floor}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3">{selectedPinResource.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Capacity</span>
                  <span className="font-semibold text-slate-800">{selectedPinResource.capacity} Seats</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Hours</span>
                  <span className="font-semibold text-slate-800">{selectedPinResource.operatingHours || '08:00 AM - 08:00 PM'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Features & Gear</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPinResource.features.map(f => (
                    <span key={f} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectResource && onSelectResource(selectedPinResource)}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-brand-500/20 transition-all"
              >
                <span>Book This Space</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Click any pin on the campus map to view location details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
