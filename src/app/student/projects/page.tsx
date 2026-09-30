'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { MultiStepBookingModal } from '@/components/booking/MultiStepBookingModal';
import {
  FolderGit2,
  Users,
  CalendarCheck,
  CheckCircle2,
  Plus,
  Sparkles,
  ArrowRight,
  X,
  Building2,
  Trash2,
  Layers,
  Search
} from 'lucide-react';

export default function StudentProjectsPage() {
  const { projects, addProject, deleteProject, currentUser } = useResora();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Create Project
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mentor, setMentor] = useState('Dr. S. Rao');
  const [status, setStatus] = useState<'In Progress' | 'Planning' | 'Completed'>('In Progress');
  const [teamMembersInput, setTeamMembersInput] = useState(`${currentUser.name} (Lead)`);
  const [resourcesInput, setResourcesInput] = useState('Innovation Lab, High Performance GPU Server');
  const [milestonesInput, setMilestonesInput] = useState('System Architecture Design, Hardware Integration & Testing, Final Prototype Demo');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill out the Project Title and Description.');
      return;
    }

    const teamMembers = teamMembersInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    const requiredResources = resourcesInput
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const milestones = milestonesInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)
      .map(mTitle => ({ title: mTitle, completed: false }));

    addProject({
      title: title.trim(),
      description: description.trim(),
      mentor,
      status,
      progress: status === 'Planning' ? 15 : status === 'Completed' ? 100 : 35,
      teamMembers: teamMembers.length > 0 ? teamMembers : [currentUser.name],
      requiredResources: requiredResources.length > 0 ? requiredResources : ['Innovation Lab'],
      bookedResourceIds: [],
      milestones: milestones.length > 0 ? milestones : [
        { title: 'Project Initialization', completed: true },
        { title: 'Development & Testing', completed: false }
      ],
    });

    // Reset Form & Close Modal
    setTitle('');
    setDescription('');
    setTeamMembersInput(`${currentUser.name} (Lead)`);
    setResourcesInput('Innovation Lab, High Performance GPU Server');
    setMilestonesInput('System Architecture Design, Hardware Integration & Testing, Final Prototype Demo');
    setIsCreateModalOpen(false);
  };

  const filteredProjects = projects.filter(pj => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      pj.title.toLowerCase().includes(q) ||
      pj.description.toLowerCase().includes(q) ||
      pj.mentor.toLowerCase().includes(q) ||
      pj.teamMembers.some(m => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header & Title Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Capstone Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                My Student Projects
              </h1>
              <p className="text-sm text-slate-300 font-normal leading-relaxed">
                Collaborate with team members, track milestones, and request campus lab resources for your research.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-brand-600/30 hover:scale-[1.02] transition-all relative z-10 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>

          {/* Search Bar & Project Count */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search project by title, mentor, or team member..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 font-medium"
              />
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredProjects.length} Projects
            </span>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-soft">
              <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Projects Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't created any student projects yet or no projects match your search query.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                + Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map(pj => (
                <div
                  key={pj.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft hover:border-brand-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Status & Mentor Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        pj.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : pj.status === 'Planning'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {pj.status}
                      </span>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-500">
                          Mentor: <strong className="text-slate-800">{pj.mentor}</strong>
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${pj.title}"?`)) {
                              deleteProject(pj.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                        {pj.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {pj.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-600">Milestone Progress</span>
                        <span className="text-slate-900">{pj.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full transition-all duration-500"
                          style={{ width: `${pj.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones Checklist */}
                    {pj.milestones && pj.milestones.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Key Milestones</span>
                        <div className="space-y-1 text-xs">
                          {pj.milestones.map((m, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-slate-700">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${m.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                              <span className={`truncate ${m.completed ? 'line-through text-slate-400' : 'font-medium'}`}>{m.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Infrastructure & Lab Requirements */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Required Project Infrastructure</span>
                      <div className="flex flex-wrap gap-1.5">
                        {pj.requiredResources.map((r, i) => (
                          <span
                            key={r}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                              i === 0
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : i === 1
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{r}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[200px]">
                      Team: {pj.teamMembers.join(', ')}
                    </span>
                    <Link
                      href={`/student/resources`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Request Missing Resource</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ==================================================
          CREATE NEW PROJECT MODAL
         ================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-6 text-white flex items-center justify-between relative">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">
                    Create New Student Project
                  </h2>
                  <p className="text-xs text-slate-300">
                    Register a new capstone research or hardware innovation project
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone Delivery Path Planner"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Project Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe the research objective, hardware stack, and AI methodology..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Faculty Mentor
                  </label>
                  <select
                    value={mentor}
                    onChange={e => setMentor(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-800"
                  >
                    <option value="Dr. S. Rao">Dr. S. Rao (Dept of CSE)</option>
                    <option value="Dr. A. Sharma">Dr. A. Sharma (Dept of ECE)</option>
                    <option value="Prof. R. Mehta">Prof. R. Mehta (Robotics Lab)</option>
                    <option value="Dr. K. Patel">Dr. K. Patel (AI Research)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Current Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-800"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Team Members <span className="text-slate-400 font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={teamMembersInput}
                  onChange={e => setTeamMembersInput(e.target.value)}
                  placeholder="e.g. Aryan Reddy (Lead), Sneha Patel, Vikram Singh"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Required Campus Infrastructure / Labs <span className="text-slate-400 font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={resourcesInput}
                  onChange={e => setResourcesInput(e.target.value)}
                  placeholder="e.g. Innovation Lab, IoT Kit #04, NVIDIA Jetson Compute"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Milestones <span className="text-slate-400 font-normal">(Comma separated steps)</span>
                </label>
                <input
                  type="text"
                  value={milestonesInput}
                  onChange={e => setMilestonesInput(e.target.value)}
                  placeholder="e.g. Architecture Setup, Sensor Calibration, Final Field Test"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium text-slate-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MultiStepBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

