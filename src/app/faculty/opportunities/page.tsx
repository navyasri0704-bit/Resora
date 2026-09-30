'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import { Opportunity } from '@/types';
import {
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Award,
  Users,
  MessageSquare,
  Check,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function FacultyOpportunitiesPage() {
  const { currentUser, opportunities, recommendOpportunity, removeRecommendation, updateRecommendationMessage } = useResora();

  // Target Year from Faculty Profile
  const targetYear = currentUser.teachingYear || currentUser.academicYear || 3;
  const targetYearLabel = `${targetYear}${targetYear === 1 ? 'st' : targetYear === 2 ? 'nd' : targetYear === 3 ? 'rd' : 'th'} Year`;
  const audienceText = `All ${targetYearLabel} Students`;

  // Modals state
  const [oppToRecommend, setOppToRecommend] = useState<Opportunity | null>(null);
  const [recommendMessage, setRecommendMessage] = useState<string>('');
  
  const [oppToEdit, setOppToEdit] = useState<{ opp: Opportunity; recMessage: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Recommend Modal
  const handleOpenRecommendModal = (opp: Opportunity) => {
    // Check if already recommended by this faculty
    const existingRec = opp.recommendations?.find(
      r => r.facultyId === currentUser.id && r.targetYear === targetYear && r.isActive
    );

    if (existingRec) {
      showToast(`Already recommended to ${targetYearLabel} students.`);
      return;
    }

    setOppToRecommend(opp);
    setRecommendMessage(`Recommended for students interested in emerging technologies and career growth.`);
  };

  // Submit Recommendation
  const handleConfirmRecommend = () => {
    if (!oppToRecommend) return;
    const res = recommendOpportunity(oppToRecommend.id, recommendMessage);
    setOppToRecommend(null);
    setRecommendMessage('');
    if (res.success) {
      showToast(`✓ Recommended to all ${targetYearLabel} Students`);
    } else {
      showToast(res.message);
    }
  };

  // Submit Edit Message
  const handleSaveEditMessage = () => {
    if (!oppToEdit) return;
    updateRecommendationMessage(oppToEdit.opp.id, oppToEdit.recMessage);
    showToast('Recommendation note updated successfully.');
    setOppToEdit(null);
  };

  // Handle Remove Recommendation
  const handleRemove = (oppId: string) => {
    removeRecommendation(oppId);
    showToast('Recommendation removed.');
    setOppToEdit(null);
  };

  // Separate opportunities into "NEW OPPORTUNITIES" and "RECOMMENDED BY YOU"
  const recommendedByFaculty = opportunities.filter(opp =>
    opp.recommendations?.some(r => r.facultyId === currentUser.id && r.isActive)
  );

  const newOpportunities = opportunities.filter(opp =>
    !opp.recommendations?.some(r => r.facultyId === currentUser.id && r.isActive)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Faculty Opportunities Portal</span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Target: {audienceText}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-1">
                Faculty Opportunity Recommendations
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Review nationwide hackathons, grants, and internships. Recommending an opportunity automatically makes it visible to all <strong>{audienceText}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">Department: {currentUser.department} · Teaching: {targetYearLabel}</p>
              </div>
            </div>
          </div>

          {/* Section 1: NEW OPPORTUNITIES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                  NEW OPPORTUNITIES
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-200/70 px-2.5 py-0.5 rounded-full">
                {newOpportunities.length} Available
              </span>
            </div>

            {newOpportunities.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
                All available opportunities have been recommended to your students.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {newOpportunities.map(opp => (
                  <div
                    key={opp.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="text-base font-extrabold text-slate-900">{opp.title}</h3>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          opp.type === 'HACKATHON'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : opp.type === 'INTERNSHIP'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {opp.type}
                        </span>
                        {opp.isVerified && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            ✓ Verified
                          </span>
                        )}
                        {opp.visibility === 'FACULTY_ONLY' && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                            FACULTY ONLY
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {opp.organization || opp.organizer}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Deadline: <strong>{opp.deadline}</strong>
                        </span>
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{opp.description}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {(opp.applicationUrl || opp.officialWebsiteUrl) && (
                        <a
                          href={opp.applicationUrl || opp.officialWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenRecommendModal(opp)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Recommend to Class</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-slate-200/80" />

          {/* Section 2: RECOMMENDED BY YOU */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                  RECOMMENDED BY YOU
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {recommendedByFaculty.length} Shared
              </span>
            </div>

            {recommendedByFaculty.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
                You haven&apos;t recommended any opportunities yet. Click &quot;Recommend to Class&quot; on any opportunity above to share it with all {audienceText}.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {recommendedByFaculty.map(opp => {
                  const facultyRec = opp.recommendations?.find(
                    r => r.facultyId === currentUser.id && r.isActive
                  );

                  return (
                    <div
                      key={opp.id}
                      className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-soft flex flex-col space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <h3 className="text-base font-extrabold text-slate-900">{opp.title}</h3>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              opp.type === 'HACKATHON'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : opp.type === 'INTERNSHIP'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {opp.type}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ✓ Recommended to {targetYearLabel}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-semibold">
                            {opp.organization || opp.organizer} · Deadline: <strong className="text-slate-700">{opp.deadline}</strong>
                          </p>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          {(opp.applicationUrl || opp.officialWebsiteUrl) && (
                            <a
                              href={opp.applicationUrl || opp.officialWebsiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
                            >
                              <span>Official Portal</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() =>
                              setOppToEdit({
                                opp,
                                recMessage: facultyRec?.message || '',
                              })
                            }
                            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>✓ Recommended</span>
                          </button>
                        </div>
                      </div>

                      {/* Details banner for recommendation */}
                      <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-emerald-950 flex items-center gap-2">
                            <span>Recommended to: <strong>{audienceText}</strong></span>
                            {facultyRec?.recommendedAt && (
                              <span className="text-[11px] font-medium text-emerald-700">· Date: {facultyRec.recommendedAt}</span>
                            )}
                          </p>
                          {facultyRec?.message && (
                            <p className="text-emerald-800 text-[11px] italic">
                              &quot;{facultyRec.message}&quot;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              setOppToEdit({
                                opp,
                                recMessage: facultyRec?.message || '',
                              })
                            }
                            className="px-3 py-1.5 bg-white hover:bg-emerald-100/50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleRemove(opp.id)}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
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

      {/* ==================== RECOMMEND CONFIRMATION MODAL ==================== */}
      {oppToRecommend && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative">
            <button
              onClick={() => setOppToRecommend(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">Recommend Opportunity</h3>
                <p className="text-xs text-slate-500 font-medium">Automatic Target Audience Resolution</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Opportunity</span>
                <p className="text-sm font-extrabold text-slate-900">{oppToRecommend.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Audience</span>
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {audienceText}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Recommended By</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{currentUser.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                Optional Message for Students:
              </label>
              <textarea
                value={recommendMessage}
                onChange={e => setRecommendMessage(e.target.value)}
                placeholder="Recommended for students interested in emerging technologies..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOppToRecommend(null)}
                className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs text-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRecommend}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-xs text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Recommend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT / DETAILS MODAL ==================== */}
      {oppToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative">
            <button
              onClick={() => setOppToEdit(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">Recommendation Details</h3>
                <p className="text-xs text-slate-500 font-medium">Manage recommendation status</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Opportunity</span>
                <p className="text-sm font-extrabold text-slate-900">{oppToEdit.opp.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Audience</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{audienceText}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Recommended By</span>
                  <p className="font-bold text-slate-800 mt-0.5">{currentUser.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Recommendation Note:</label>
              <textarea
                value={oppToEdit.recMessage}
                onChange={e => setOppToEdit({ ...oppToEdit, recMessage: e.target.value })}
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOppToEdit(null)}
                  className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs text-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEditMessage}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-xs text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  Save Note
                </button>
              </div>

              <button
                onClick={() => handleRemove(oppToEdit.opp.id)}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
