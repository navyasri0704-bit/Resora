'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { StatusBadge } from '@/components/common/Badge';
import { Resource } from '@/types';
import { Boxes, Plus, Search, Edit, Wrench, CheckCircle2, X, Sparkles, Layers, ShieldCheck } from 'lucide-react';

const AVAILABLE_FEATURE_CHIPS = [
  'Wi-Fi',
  'Projector',
  'AC',
  'Smart Board',
  'GPU',
  'Arduino',
  'Raspberry Pi',
  '3D Printer',
  'Oscilloscope',
  'Live Streaming',
];

export default function AdminResourceManagementPage() {
  const { resources, addResource, updateResource, toggleMaintenance } = useResora();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [resourceCode, setResourceCode] = useState('');
  const [type, setType] = useState<'Lab' | 'Room' | 'Equipment' | 'Facility' | 'Bundle'>('Lab');
  const [building, setBuilding] = useState('Block A');
  const [floor, setFloor] = useState('Floor 1');
  const [roomNumber, setRoomNumber] = useState('A-102');
  const [campusZone, setCampusZone] = useState('North Tech Zone');
  const [capacity, setCapacity] = useState(30);
  const [department, setDepartment] = useState('CSE');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Wi-Fi', 'Projector', 'AC']);
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 08:00 PM');
  const [isShared, setIsShared] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600');

  const categories = ['All', 'Lab', 'Room', 'Equipment', 'Facility', 'Bundle'];

  const filteredResources = resources.filter(res => {
    const matchesCat = selectedCategory === 'All' || res.type === selectedCategory;
    const matchesQuery =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleFeatureChip = (chip: string) => {
    if (selectedFeatures.includes(chip)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== chip));
    } else {
      setSelectedFeatures([...selectedFeatures, chip]);
    }
  };

  const toggleDependencyChip = (depName: string) => {
    if (selectedDependencies.includes(depName)) {
      setSelectedDependencies(selectedDependencies.filter(d => d !== depName));
    } else {
      setSelectedDependencies([...selectedDependencies, depName]);
    }
  };

  const openAddModal = () => {
    setEditingResource(null);
    setName('');
    setResourceCode(`RES-${Math.floor(1000 + Math.random() * 9000)}`);
    setType('Lab');
    setBuilding('Block A');
    setFloor('Floor 1');
    setRoomNumber('A-102');
    setCapacity(30);
    setDepartment('CSE');
    setSelectedFeatures(['Wi-Fi', 'Projector', 'AC']);
    setSelectedDependencies([]);
    setIsAddModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setName(res.name);
    setResourceCode(res.resourceCode || `RES-${Math.floor(1000 + Math.random() * 9000)}`);
    setType(res.type);
    setBuilding(res.building);
    setFloor(res.floor);
    setRoomNumber(res.roomNumber || 'A-101');
    setCapacity(res.capacity);
    setDepartment(res.department);
    setSelectedFeatures(res.features || []);
    setSelectedDependencies(res.requiredDependencies || []);
    setIsShared(res.isShared || false);
    setImageUrl(res.imageUrl);
    setIsAddModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingResource) {
      updateResource(editingResource.id, {
        name,
        resourceCode,
        type,
        building,
        floor,
        roomNumber,
        campusZone,
        capacity,
        department,
        features: selectedFeatures,
        requiredDependencies: selectedDependencies,
        isShared,
        imageUrl,
      });
    } else {
      addResource({
        name,
        resourceCode,
        type,
        building,
        floor,
        roomNumber,
        campusZone,
        capacity,
        department,
        status: 'AVAILABLE',
        imageUrl,
        features: selectedFeatures,
        requiredDependencies: selectedDependencies,
        isShared,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Administration</span>
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
                Manage Campus Resources & Bundles
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure lab spaces, equipment dependencies, features chips, and cross-department access rules
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Campus Resource</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources by name, building, or department..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Code & Name</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Dependencies</th>
                    <th className="py-3.5 px-4">Capacity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResources.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {res.resourceCode || `RES-${res.id.slice(-4)}`}
                          </span>
                          <span className="font-bold text-slate-900">{res.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{res.type}</td>
                      <td className="py-4 px-4 font-semibold text-brand-600">{res.department}</td>
                      <td className="py-4 px-4 text-slate-500">{res.building} · {res.floor}</td>
                      <td className="py-4 px-4 text-slate-500">
                        {res.requiredDependencies && res.requiredDependencies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {res.requiredDependencies.map(d => (
                              <span key={d} className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 font-semibold">
                                {d}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{res.capacity} Seats</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={res.status} />
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(res)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center space-x-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => toggleMaintenance(res.id, 'Administrator scheduled maintenance')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                            res.status === 'MAINTENANCE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {res.status === 'MAINTENANCE' ? 'Restore Service' : 'Toggle Repair'}
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

      {/* Add / Edit Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingResource ? `Edit Resource: ${editingResource.name}` : 'Add New Campus Resource'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resource Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Innovation Lab"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resource Code</label>
                  <input
                    type="text"
                    value={resourceCode}
                    onChange={e => setResourceCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Lab">Lab</option>
                    <option value="Room">Room</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Facility">Facility</option>
                    <option value="Bundle">Bundle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Building</label>
                  <input
                    type="text"
                    value={building}
                    onChange={e => setBuilding(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={e => setFloor(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Selectable Feature Chips */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Selectable Feature Chips</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVAILABLE_FEATURE_CHIPS.map(chip => {
                    const isSelected = selectedFeatures.includes(chip);
                    return (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => toggleFeatureChip(chip)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {chip} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hardware Dependencies Picker */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Hardware Dependencies Required for Booking</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {resources
                    .filter(r => r.type === 'Equipment' || r.type === 'Bundle')
                    .map(dep => {
                      const isSelected = selectedDependencies.includes(dep.name);
                      return (
                        <button
                          type="button"
                          key={dep.id}
                          onClick={() => toggleDependencyChip(dep.name)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-sm'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {dep.name} {isSelected ? '✓' : '+'}
                        </button>
                      );
                    })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md mt-2"
              >
                {editingResource ? 'Save Resource Changes' : 'Create Campus Resource'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
