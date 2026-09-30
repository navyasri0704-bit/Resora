'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { Opportunity } from '@/types';
import {
  GraduationCap,
  Bookmark,
  Trophy,
  Briefcase,
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X,
  Building2,
  Globe,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Award,
  Users,
  Filter
} from 'lucide-react';

// Helper for URL validation
function isValidExternalUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    trimmed === '#' ||
    trimmed === '/apply' ||
    trimmed === '/opportunities/apply' ||
    trimmed.startsWith('javascript:') ||
    trimmed.includes('example.com') ||
    trimmed.includes('localhost') ||
    trimmed.includes('127.0.0.1')
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Calculate deadline status and display text
function getDeadlineInfo(deadlineStr?: string, regStatus?: string) {
  if (regStatus === 'CLOSED') {
    return { status: 'CLOSED', text: 'Registration Closed', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
  if (regStatus === 'UPCOMING') {
    return { status: 'UPCOMING', text: 'Opening Soon', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  }
  if (!deadlineStr) {
    return { status: 'OPEN', text: 'Registration Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }

  const now = new Date();
  const deadlineDate = new Date(deadlineStr);

  if (!isNaN(deadlineDate.getTime())) {
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'CLOSED', text: 'Registration Closed', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    } else if (diffDays <= 7) {
      return { status: 'CLOSING_SOON', text: `Deadline in ${diffDays} days`, color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  }

  return { status: 'OPEN', text: `Deadline: ${deadlineStr}`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
}

export default function StudentOpportunitiesPage() {
  const { currentUser, opportunities, toggleSaveOpportunity, applyToOpportunity } = useResora();

  // Navigation & Filter State (Section 6: [ All ] [ Hackathons ] [ Internships ] [ Faculty Recommended ])
  const [activeTab, setActiveTab] = useState<'All' | 'HACKATHON' | 'INTERNSHIP' | 'RECOMMENDED'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'deadline' | 'featured' | 'newest'>('featured');

  // Demo Academic Year Selector for Testing (Requirement #19: Student A = 3rd Year, Student B = 2nd Year, Student C = 4th Year)
  const [simulatedAcademicYear, setSimulatedAcademicYear] = useState<number>(currentUser.academicYear || 3);

  // Selected Opportunity for Detail Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Active student academic year label
  const studentYearLabel = `${simulatedAcademicYear}${simulatedAcademicYear === 1 ? 'st' : simulatedAcademicYear === 2 ? 'nd' : simulatedAcademicYear === 3 ? 'rd' : 'th'} Year`;

  // Track apply click
  const handleApplyClick = (e: React.MouseEvent, opp: Opportunity) => {
    e.stopPropagation();
    applyToOpportunity(opp.id);
  };

  // Visibility Filter (Section 9, 10, 15):
  // PUBLIC opportunities + RECOMMENDED opportunities matching student.academicYear === recommendation.targetYear
  const visibleOpportunities = useMemo(() => {
    if (!opportunities || !Array.isArray(opportunities)) return [];

    return opportunities.filter(opp => {
      if (!opp) return false;

      // Check if faculty-only without valid student recommendation
      const hasMatchingRec = opp.recommendations?.some(
        r => r.targetYear === simulatedAcademicYear && r.isActive
      );

      if (opp.visibility === 'FACULTY_ONLY' && !hasMatchingRec) {
        return false;
      }

      if (opp.visibility === 'RECOMMENDED' && !hasMatchingRec) {
        return false;
      }

      // Filter by Active Tab
      if (activeTab === 'HACKATHON' && opp.type !== 'HACKATHON') return false;
      if (activeTab === 'INTERNSHIP' && opp.type !== 'INTERNSHIP') return false;
      if (activeTab === 'RECOMMENDED' && !hasMatchingRec) return false;

      if (showSavedOnly && !opp.saved) return false;

      if (selectedMode !== 'All') {
        const modeVal = (opp.mode || opp.workMode || '').toLowerCase();
        if (!modeVal.includes(selectedMode.toLowerCase())) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (opp.title || '').toLowerCase().includes(q);
        const matchOrg = (opp.organization || opp.organizer || '').toLowerCase().includes(q);
        const matchDesc = (opp.description || opp.shortDescription || '').toLowerCase().includes(q);
        const matchTags = (opp.tags || []).some(t => (t || '').toLowerCase().includes(q));

        if (!(matchTitle || matchOrg || matchDesc || matchTags)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort recommendations first, then featured
      const aIsRec = a.recommendations?.some(r => r.targetYear === simulatedAcademicYear && r.isActive);
      const bIsRec = b.recommendations?.some(r => r.targetYear === simulatedAcademicYear && r.isActive);
      if (aIsRec && !bIsRec) return -1;
      if (!aIsRec && bIsRec) return 1;

      if (sortBy === 'featured') {
        if (a?.isFeatured && !b?.isFeatured) return -1;
        if (!a?.isFeatured && b?.isFeatured) return 1;
      }
      return 0;
    });
  }, [opportunities, simulatedAcademicYear, activeTab, showSavedOnly, selectedMode, searchQuery, sortBy]);

  // Separate Faculty Recommended section for top banner
  const facultyRecommendedList = useMemo(() => {
    return (opportunities || []).filter(opp =>
      opp.recommendations?.some(r => r.targetYear === simulatedAcademicYear && r.isActive)
    );
  }, [opportunities, simulatedAcademicYear]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* ==================================================
              1. PAGE HEADER & DEMO YEAR SWITCHER
             ================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student Career Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Discover curated hackathons, research internships, and faculty-recommended programs targeted for your academic standing.
              </p>
            </div>

            {/* Demo Tester Controls for Requirement #19 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Academic Year:</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[2, 3, 4].map(year => (
                  <button
                    key={year}
                    onClick={() => setSimulatedAcademicYear(year)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${simulatedAcademicYear === year
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                  >
                    {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ==================================================
              2. CATEGORY NAVIGATION TABS (Requirement #6)
             ================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 bg-slate-200/70 p-1.5 rounded-2xl flex-wrap gap-y-1">
                <button
                  onClick={() => { setActiveTab('All'); setShowSavedOnly(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'All' && !showSavedOnly
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  All
                </button>

                <button
                  onClick={() => { setActiveTab('HACKATHON'); setShowSavedOnly(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeTab === 'HACKATHON' && !showSavedOnly
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  Hackathons
                </button>

                <button
                  onClick={() => { setActiveTab('INTERNSHIP'); setShowSavedOnly(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeTab === 'INTERNSHIP' && !showSavedOnly
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Internships
                </button>

                <button
                  onClick={() => { setActiveTab('RECOMMENDED'); setShowSavedOnly(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeTab === 'RECOMMENDED' && !showSavedOnly
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-700 bg-emerald-100/70 hover:bg-emerald-100'
                    }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Faculty Recommended
                  {facultyRecommendedList.length > 0 && (
                    <span className="bg-white text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded-full ml-1">
                      {facultyRecommendedList.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${showSavedOnly
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-slate-950' : ''}`} />
                  <span>Saved</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                {['All', 'Remote', 'Online', 'Hybrid', 'On-site'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${selectedMode === mode
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ==================================================
              3. FACULTY RECOMMENDED TOP SECTION (Requirement #6, #7, #18, #22)
             ================================================== */}
          {(activeTab === 'All' || activeTab === 'RECOMMENDED') && !searchQuery && !showSavedOnly && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                    FACULTY RECOMMENDED
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Directly recommended by faculty for <strong>{studentYearLabel} Students</strong>
                </span>
              </div>

              {facultyRecommendedList.length === 0 ? (
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-200/80 text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-900">No faculty recommendations yet for {studentYearLabel} Students.</p>
                  <p className="text-[11px] text-emerald-700">Faculty members recommend relevant hackathons and research grants directly to your year.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {facultyRecommendedList.map(opp => {
                    // Get recommendation details for this student year
                    const rec = opp.recommendations?.find(
                      r => r.targetYear === simulatedAcademicYear && r.isActive
                    );
                    const isHackathon = opp.type === 'HACKATHON';

                    return (
                      <div
                        key={`rec_card_${opp.id}`}
                        className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                      >
                        {/* Top banner tag */}
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              ✓ Faculty Recommended
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${isHackathon ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                              }`}>
                              {opp.type}
                            </span>
                          </div>

                          <span className="text-[11px] font-bold text-slate-500">
                            Deadline: <strong className="text-slate-800">{opp.deadline}</strong>
                          </span>
                        </div>

                        {/* Recommendation Banner details (Requirement #7: Recommended by Dr. S. Rao / For 3rd Year Students) */}
                        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-bold text-emerald-950">
                              Recommended by: <span className="text-emerald-700 font-extrabold">{rec?.facultyName || 'Dr. S. Rao'}</span>
                            </p>
                            <span className="text-[10px] font-extrabold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md">
                              For: {rec?.targetYearLabel || `${studentYearLabel} Students`}
                            </span>
                          </div>
                          {rec?.message && (
                            <p className="text-emerald-800 text-[11px] italic pt-0.5">
                              &quot;{rec.message}&quot;
                            </p>
                          )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                            {opp.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold">
                            {opp.organization || opp.organizer} · Mode: {opp.mode || opp.workMode || 'Hybrid'}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {opp.description}
                          </p>
                        </div>

                        {/* Actions (Requirement #6, #20) */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedOpportunity(opp)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                          >
                            View Details
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => toggleSaveOpportunity(opp.id)}
                              className={`p-2 rounded-xl border transition-colors ${opp.saved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                              <Bookmark className={`w-4 h-4 ${opp.saved ? 'fill-amber-500' : ''}`} />
                            </button>

                            {/* External Application Link (Requirement #20: <a href target="_blank">) */}
                            {isValidExternalUrl(opp.applicationUrl || opp.officialWebsiteUrl) ? (
                              <a
                                href={(opp.applicationUrl || opp.officialWebsiteUrl)!.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => handleApplyClick(e, opp)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all"
                              >
                                <span>Apply Now →</span>
                              </a>
                            ) : (
                              <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed">
                                Application Link
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================================================
              4. ALL OPPORTUNITIES SECTION
             ================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                {activeTab === 'RECOMMENDED' ? 'FACULTY RECOMMENDED OPPORTUNITIES' : 'ALL OPPORTUNITIES'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {visibleOpportunities.length} Available
              </span>
            </div>

            {visibleOpportunities.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-soft">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No opportunities match your current selection</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting search terms or toggling academic year testing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleOpportunities.map(opp => {
                  const isHackathon = opp.type === 'HACKATHON';
                  const deadlineInfo = getDeadlineInfo(opp.deadline, opp.registrationStatus);
                  const isFacultyRec = opp.recommendations?.some(
                    r => r.targetYear === simulatedAcademicYear && r.isActive
                  );

                  return (
                    <div
                      key={opp.id}
                      className={`bg-white p-5 sm:p-6 rounded-3xl border shadow-soft hover:shadow-md transition-all flex flex-col md:flex-row items-start justify-between gap-6 ${isFacultyRec ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/90'
                        }`}
                    >
                      <div className="flex items-start space-x-4 flex-1 min-w-0 w-full">
                        <img
                          src={opp.logoUrl || (isHackathon ? 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120' : 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120')}
                          alt={opp.organization}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200/80 shadow-xs shrink-0"
                        />

                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${isHackathon ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                              }`}>
                              {opp.type}
                            </span>

                            {isFacultyRec && (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ✓ Faculty Recommended
                              </span>
                            )}

                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${deadlineInfo.color}`}>
                              {deadlineInfo.text}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                              {opp.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-semibold">
                              {opp.organization || opp.organizer} · Mode: {opp.mode || opp.workMode || 'Hybrid'}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {opp.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between w-full md:w-auto self-stretch gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => toggleSaveOpportunity(opp.id)}
                            className={`p-2.5 rounded-xl border transition-colors ${opp.saved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                              }`}
                          >
                            <Bookmark className={`w-4 h-4 ${opp.saved ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOpportunity(opp)}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            View Details
                          </button>

                          {isValidExternalUrl(opp.applicationUrl || opp.officialWebsiteUrl) ? (
                            <a
                              href={(opp.applicationUrl || opp.officialWebsiteUrl)!.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleApplyClick(e, opp)}
                              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 transition-all"
                            >
                              <span>Apply Now →</span>
                            </a>
                          ) : (
                            <span className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 cursor-not-allowed">
                              Apply Now
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================================================
          5. OPPORTUNITY DETAIL MODAL
         ================================================== */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 p-6 text-white flex items-start justify-between relative shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                  {selectedOpportunity.type}
                </span>
                <h2 className="text-xl font-extrabold text-white font-heading mt-1">
                  {selectedOpportunity.title}
                </h2>
                <p className="text-xs text-slate-300">{selectedOpportunity.organization || selectedOpportunity.organizer}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-700">
              {/* If Faculty Recommended, show details */}
              {selectedOpportunity.recommendations?.some(r => r.targetYear === simulatedAcademicYear && r.isActive) && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <p className="font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recommended by: {selectedOpportunity.recommendations.find(r => r.targetYear === simulatedAcademicYear)?.facultyName || 'Dr. S. Rao'}
                  </p>
                  <p className="text-emerald-800 text-xs italic">
                    &quot;{selectedOpportunity.recommendations.find(r => r.targetYear === simulatedAcademicYear)?.message}&quot;
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Description</h3>
                <p className="text-slate-600 leading-relaxed">{selectedOpportunity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Deadline</span>
                  <span className="font-bold text-slate-800">{selectedOpportunity.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Stipend / Prize</span>
                  <span className="font-bold text-emerald-700">{selectedOpportunity.stipend || selectedOpportunity.stipendOrPrize || selectedOpportunity.prizePool || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>

              {isValidExternalUrl(selectedOpportunity.applicationUrl || selectedOpportunity.officialWebsiteUrl) && (
                <a
                  href={(selectedOpportunity.applicationUrl || selectedOpportunity.officialWebsiteUrl)!.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleApplyClick(e, selectedOpportunity)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>Apply Now →</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
