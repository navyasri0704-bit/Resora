'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { Opportunity, OpportunityType } from '@/types';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  Globe,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  Trophy,
  Briefcase,
  Eye,
  Sliders,
  AlertCircle
} from 'lucide-react';

export default function AdminOpportunitiesPage() {
  const { opportunities, addOpportunity, updateOpportunity, deleteOpportunity, auditLogs } = useResora();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'HACKATHON' | 'INTERNSHIP'>('ALL');
  
  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [formType, setFormType] = useState<OpportunityType>('HACKATHON');

  // Form Fields State
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '',
    organization: '',
    type: 'HACKATHON',
    mode: 'Hybrid',
    location: '',
    deadline: '',
    stipendOrPrize: '',
    stipend: '',
    prizePool: '',
    teamSize: '',
    duration: '',
    domain: '',
    role: '',
    eligibility: '',
    skillsRequired: [],
    tags: [],
    officialWebsiteUrl: '',
    applicationUrl: '',
    source: '',
    isVerified: true,
    isFeatured: false,
    registrationStatus: 'OPEN',
    description: '',
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Analytics Metrics
  const totalClickLogs = auditLogs.filter(a => a.action === 'APPLICATION_LINK_OPENED').length;

  const openCreateModal = (type: OpportunityType) => {
    setEditingOpp(null);
    setFormType(type);
    setFormData({
      title: '',
      organization: '',
      type: type,
      mode: 'Hybrid',
      location: 'Pan-India',
      deadline: '30 Nov 2026',
      stipendOrPrize: type === 'HACKATHON' ? '₹1,00,000 Cash Prize' : '₹50,000 / month',
      stipend: type === 'INTERNSHIP' ? '₹50,000 / month' : '',
      prizePool: type === 'HACKATHON' ? '₹1,00,000 Cash Prize' : '',
      teamSize: type === 'HACKATHON' ? '1 - 4 Members' : '',
      duration: type === 'INTERNSHIP' ? '8 Weeks' : '',
      domain: type === 'INTERNSHIP' ? 'Software Engineering' : '',
      eligibility: 'B.Tech / B.E. / M.Tech Students',
      skillsRequired: ['React', 'Node.js', 'Python'],
      tags: [type === 'HACKATHON' ? 'Hackathon' : 'Internship', 'Official'],
      officialWebsiteUrl: 'https://example.com',
      applicationUrl: 'https://example.com/apply',
      source: 'Admin Verified Portal',
      isVerified: true,
      isFeatured: false,
      registrationStatus: 'OPEN',
      description: 'Official verified opportunity published by campus administration.',
    });
    setSkillsInput('React, Node.js, Python');
    setTagsInput(type === 'HACKATHON' ? 'Hackathon, Official' : 'Internship, Official');
    setIsModalOpen(true);
  };

  const openEditModal = (opp: Opportunity) => {
    setEditingOpp(opp);
    setFormType(opp.type);
    setFormData({ ...opp });
    setSkillsInput((opp.skillsRequired || opp.technologies || []).join(', '));
    setTagsInput((opp.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.organization) {
      alert('Please fill in required fields: Title and Organization');
      return;
    }

    const processedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const processedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      ...formData,
      type: formType,
      skillsRequired: processedSkills,
      tags: processedTags,
      deadline: formData.deadline || '30 Nov 2026',
      description: formData.description || 'Verified opportunity published by campus administration.',
    } as Omit<Opportunity, 'id'>;

    if (editingOpp) {
      updateOpportunity(editingOpp.id, payload);
    } else {
      addOpportunity(payload);
    }

    setIsModalOpen(false);
  };

  const filtered = opportunities.filter(o => {
    if (filterType !== 'ALL' && o.type !== filterType) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.organization.toLowerCase().includes(q) ||
      (o.source && o.source.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Admin Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Admin Management</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Opportunity Management Center
              </h1>
              <p className="text-xs text-slate-400">
                Publish, verify, and manage official hackathons & tech internships for students.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openCreateModal('HACKATHON')}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>Create Hackathon</span>
              </button>

              <button
                onClick={() => openCreateModal('INTERNSHIP')}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>Create Internship</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs text-slate-500 font-semibold block">Total Active Opportunities</span>
              <span className="text-2xl font-extrabold text-slate-900">{opportunities.length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs text-slate-500 font-semibold block">Verified Official Records</span>
              <span className="text-2xl font-extrabold text-emerald-600">{opportunities.filter(o => o.isVerified).length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs text-slate-500 font-semibold block">Featured Opportunities</span>
              <span className="text-2xl font-extrabold text-purple-600">{opportunities.filter(o => o.isFeatured).length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs text-slate-500 font-semibold block">Application Link Clicks</span>
              <span className="text-2xl font-extrabold text-brand-600">{totalClickLogs}</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by title, organizer, or source..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex items-center space-x-2">
              {(['ALL', 'HACKATHON', 'INTERNSHIP'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === t
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunity Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-4">Opportunity</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Official Website & App URL</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status & Flags</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(opp => (
                    <tr key={opp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={opp.logoUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120'}
                            alt={opp.title}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">{opp.title}</div>
                            <div className="text-[11px] text-slate-500">{opp.organization || opp.organizer}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          opp.type === 'HACKATHON' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          {opp.type}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {opp.applicationUrl ? (
                            <a
                              href={opp.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-600 hover:underline font-semibold flex items-center gap-1 truncate text-[11px]"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{opp.applicationUrl}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No App URL</span>
                          )}

                          {opp.officialWebsiteUrl && (
                            <a
                              href={opp.officialWebsiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 truncate text-[10px]"
                            >
                              <Globe className="w-3 h-3 shrink-0" />
                              <span className="truncate">{opp.officialWebsiteUrl}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {opp.deadline}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {opp.isVerified && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                          {!opp.isVerified && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Demo
                            </span>
                          )}
                          {opp.isFeatured && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            opp.registrationStatus === 'CLOSED' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {opp.registrationStatus || 'OPEN'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(opp)}
                            className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
                            title="Edit Opportunity"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${opp.title}?`)) {
                                deleteOpportunity(opp.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Opportunity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs text-brand-400 font-bold uppercase">Admin Form</span>
                <h2 className="text-xl font-extrabold text-white font-heading">
                  {editingOpp ? `Edit ${editingOpp.title}` : `Create New ${formType === 'HACKATHON' ? 'Hackathon' : 'Internship'}`}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Type Switcher */}
              <div className="flex items-center space-x-3 bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setFormType('HACKATHON')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    formType === 'HACKATHON' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Hackathon Format
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('INTERNSHIP')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    formType === 'INTERNSHIP' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Internship Format
                </button>
              </div>

              {/* Core Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Smart India Hackathon 2026"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Organization / Organizer *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization || ''}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Ministry of Education / Google India"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* CRITICAL EXTERNAL URL FIELDS (Requirement 6, 7 & 18) */}
              <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-200/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-600" />
                  <h4 className="font-bold text-brand-900 text-xs">Official Source & Outbound Application URLs</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Application URL (Opens when "Apply Now" is clicked) *
                    </label>
                    <input
                      type="url"
                      value={formData.applicationUrl || ''}
                      onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-slate-900"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Must start with https://</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.officialWebsiteUrl || ''}
                      onChange={e => setFormData({ ...formData, officialWebsiteUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Specific fields based on type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Work Mode / Event Mode</label>
                  <select
                    value={formData.mode || formData.workMode || 'Hybrid'}
                    onChange={e => setFormData({ ...formData, mode: e.target.value, workMode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On Campus">On Campus</option>
                    <option value="Online">Online</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Pan-India / Bengaluru"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Registration Deadline</label>
                  <input
                    type="text"
                    value={formData.deadline || ''}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="e.g. 25 Oct 2026"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
              </div>

              {formType === 'HACKATHON' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Prize Pool</label>
                    <input
                      type="text"
                      value={formData.stipendOrPrize || formData.prizePool || ''}
                      onChange={e => setFormData({ ...formData, stipendOrPrize: e.target.value, prizePool: e.target.value })}
                      placeholder="e.g. ₹1,00,000 Cash Prize"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Team Size</label>
                    <input
                      type="text"
                      value={formData.teamSize || ''}
                      onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                      placeholder="e.g. 6 Members (Mandatory 1 Female)"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Stipend Amount</label>
                    <input
                      type="text"
                      value={formData.stipend || formData.stipendOrPrize || ''}
                      onChange={e => setFormData({ ...formData, stipend: e.target.value, stipendOrPrize: e.target.value })}
                      placeholder="e.g. ₹85,000 / month"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Duration & Role</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 8 Weeks / Summer Intern"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                </div>
              )}

              {/* Description & Eligibility */}
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={formData.eligibility || ''}
                    onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. UG/PG Students in Computer Science or STEM"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={e => setSkillsInput(e.target.value)}
                    placeholder="React, Node.js, Python, AI/ML"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="AI/ML, Web3, National Level, Top Tech"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isVerified}
                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded text-brand-600"
                  />
                  <span className="font-bold text-slate-800">Mark as Verified Official</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brand-600"
                  />
                  <span className="font-bold text-slate-800">Mark as Featured</span>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">Registration Status:</span>
                  <select
                    value={formData.registrationStatus || 'OPEN'}
                    onChange={e => setFormData({ ...formData, registrationStatus: e.target.value as any })}
                    className="p-1 border rounded-lg bg-white font-bold text-xs"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSING_SOON">CLOSING_SOON</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="UPCOMING">UPCOMING</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20"
                >
                  {editingOpp ? 'Save Changes' : 'Publish Opportunity'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
