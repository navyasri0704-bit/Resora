'use client';

import React, { useState } from 'react';
import { useResora } from '@/context/ResoraContext';
import { Resource } from '@/types';
import { X, Calendar, Clock, CheckCircle2, AlertTriangle, Layers, Cpu, Projector, Wifi, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiStepBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedResource?: Resource | null;
}

export const MultiStepBookingModal: React.FC<MultiStepBookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedResource,
}) => {
  const { resources, createBooking } = useResora();

  const [step, setStep] = useState(1);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(preSelectedResource || resources[0]);
  const [date, setDate] = useState('2026-10-01');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');
  const [additionalItems, setAdditionalItems] = useState<string[]>(['Wi-Fi', 'Arduino Kits']);
  const [purpose, setPurpose] = useState<'Class' | 'Project' | 'Research' | 'Hackathon' | 'Other'>('Project');
  const [numberOfStudents, setNumberOfStudents] = useState(8);

  const [bookingResult, setBookingResult] = useState<{
    success?: boolean;
    error?: string;
    bookingCode?: string;
    alternatives?: Resource[];
  } | null>(null);

  if (!isOpen) return null;

  const handleItemToggle = (item: string) => {
    setAdditionalItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmitBooking = () => {
    if (!selectedResource) return;

    const result = createBooking({
      resourceId: selectedResource.id,
      date,
      startTime,
      endTime,
      purpose,
      additionalItems,
      numberOfStudents,
    });

    if (result.success && result.booking) {
      setBookingResult({
        success: true,
        bookingCode: result.booking.bookingCode,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setBookingResult({
        success: false,
        error: result.error,
        alternatives: result.alternatives,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col border border-slate-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">
              Campus Resource Network
            </span>
            <h3 className="text-lg font-bold">Reserve Resource</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-600">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === s
                    ? 'bg-brand-600 text-white font-bold'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? '✓' : s}
              </span>
              <span className="hidden sm:inline">
                {s === 1 ? 'Resource' : s === 2 ? 'Schedule' : s === 3 ? 'Items' : s === 4 ? 'Purpose' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {bookingResult?.success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Booking Request Submitted ✓</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Your reservation for <strong>{selectedResource?.name}</strong> has been submitted. Booking ID:{' '}
                <span className="font-mono font-bold text-brand-600">#{bookingResult.bookingCode}</span>.
              </p>
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Slot:</strong> {startTime} – {endTime}</p>
                <p><strong>Status:</strong> Pending Faculty Approval</p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all"
              >
                Done & View Pass
              </button>
            </div>
          ) : bookingResult?.success === false ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reservation Conflict</h3>
              <p className="text-sm text-rose-600 mt-2 font-medium px-4">{bookingResult.error}</p>

              {bookingResult.alternatives && bookingResult.alternatives.length > 0 && (
                <div className="mt-6 text-left">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Available Smart Alternatives:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookingResult.alternatives.map(alt => (
                      <div
                        key={alt.id}
                        onClick={() => {
                          setSelectedResource(alt);
                          setBookingResult(null);
                        }}
                        className="p-3 border border-slate-200 rounded-xl hover:border-brand-500 cursor-pointer bg-slate-50 hover:bg-brand-50 transition-all"
                      >
                        <p className="text-xs font-bold text-slate-800">{alt.name}</p>
                        <p className="text-[10px] text-slate-500">{alt.building} · Capacity {alt.capacity}</p>
                        <span className="text-[10px] text-brand-600 font-semibold mt-1 inline-block">
                          Select Alternative →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setBookingResult(null)}
                className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition-all"
              >
                Back to Edit Time
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Select Resource */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 1: Choose Campus Resource</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                    {resources.map(res => (
                      <div
                        key={res.id}
                        onClick={() => setSelectedResource(res)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedResource?.id === res.id
                            ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{res.name}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              res.status === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{res.building} · {res.floor}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Capacity: {res.capacity} students</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 2: Date & Slot Schedule</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Reservation Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Attendees</label>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={numberOfStudents}
                        onChange={e => setNumberOfStudents(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Resources */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 3: Select Additional Equipment & Kits</h4>
                  <p className="text-xs text-slate-500">Atomic check will be performed for dependencies.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Wi-Fi', 'Arduino Kits', 'Projector #04', 'Raspberry Pi', 'GPU Workstation', 'Dolby Audio'].map(item => (
                      <div
                        key={item}
                        onClick={() => handleItemToggle(item)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          additionalItems.includes(item)
                            ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-xs">{item}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            additionalItems.includes(item) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {additionalItems.includes(item) && '✓'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Purpose */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 4: Purpose of Reservation</h4>
                  <div className="space-y-2">
                    {(['Project', 'Hackathon', 'Research', 'Class', 'Other'] as const).map(p => (
                      <label
                        key={p}
                        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          purpose === p
                            ? 'border-brand-600 bg-brand-50/70 text-slate-900 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="purpose"
                          checked={purpose === p}
                          onChange={() => setPurpose(p)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-xs">{p} Work / Event</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Step 5: Review & Transaction Lock</h4>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">Resource:</span>
                      <span className="font-bold text-slate-900">{selectedResource?.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-800">{selectedResource?.building} ({selectedResource?.floor})</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">Date & Time:</span>
                      <span className="font-medium text-slate-800">{date} · {startTime} – {endTime}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">Purpose:</span>
                      <span className="font-medium text-slate-800">{purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Additional Kits:</span>
                      <span className="font-medium text-slate-800">{additionalItems.join(', ') || 'None'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Server-side transactional engine will lock requested resources. Overlapping slots will be auto-rejected.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!bookingResult && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitBooking}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Reservation</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
