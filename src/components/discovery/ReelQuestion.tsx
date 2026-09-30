'use client';

import React, { useState } from 'react';
import { ReelQuestion as ReelQuestionType, UserReelAnswer } from '@/types/discovery';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface ReelQuestionProps {
  question: ReelQuestionType;
  existingAnswer?: UserReelAnswer;
  onSubmitAnswer: (selectedOption: number) => void;
  onContinueToNextReel: () => void;
  isLastReelInCourse: boolean;
}

export const ReelQuestion: React.FC<ReelQuestionProps> = ({
  question,
  existingAnswer,
  onSubmitAnswer,
  onContinueToNextReel,
  isLastReelInCourse,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    existingAnswer ? existingAnswer.selectedOption : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption !== null && !existingAnswer) {
      onSubmitAnswer(selectedOption);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Reel Completed Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          <span>✅ Reel Completed</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          Step 2 of 2: Knowledge Check
        </span>
      </div>

      {/* Question Header */}
      <div>
        <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>❓ Question</span>
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
          {question.text}
        </h3>
      </div>

      {/* Answer Form or Feedback View */}
      {!existingAnswer ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2.5">
            {question.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-3.5 group ${
                    isSelected
                      ? 'bg-brand-50 border-brand-600 text-brand-950 font-bold shadow-sm ring-1 ring-brand-600'
                      : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100 hover:border-slate-300 font-medium'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-500 border border-slate-200 group-hover:border-slate-400'
                    }`}
                  >
                    {optionLabels[idx]}
                  </div>
                  <span className="text-xs sm:text-sm flex-1 leading-relaxed">
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={selectedOption === null}
              className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Submit Answer</span>
            </button>
          </div>
        </form>
      ) : (
        /* Answer Feedback Section */
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Result Banner */}
          {existingAnswer.isCorrect ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>✅ Correct! Well done! 🎉</span>
              </div>
              <p className="text-xs text-emerald-800 font-semibold">
                Your Answer:{' '}
                <span className="font-extrabold text-emerald-950">
                  {optionLabels[existingAnswer.selectedOption]}.{' '}
                  {question.options[existingAnswer.selectedOption]}
                </span>
              </p>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 text-rose-950 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-700 font-extrabold text-base">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>❌ Incorrect. Don't worry, keep learning! 💡</span>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-rose-800 font-semibold">
                  Your Answer:{' '}
                  <span className="font-bold text-rose-950">
                    {optionLabels[existingAnswer.selectedOption]}.{' '}
                    {question.options[existingAnswer.selectedOption]}
                  </span>
                </p>
                <p className="text-emerald-800 font-extrabold">
                  Correct Answer:{' '}
                  <span className="font-extrabold text-emerald-950">
                    {optionLabels[question.correctAnswer]}.{' '}
                    {question.options[question.correctAnswer]}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Explanation (MUST ALWAYS REMAIN VISIBLE) */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400" />
              <span>💡 Explanation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {question.explanation}
            </p>
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              onClick={onContinueToNextReel}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-card transition-all flex items-center justify-center space-x-2 group"
            >
              <span>
                {isLastReelInCourse
                  ? 'Complete Course 🎉'
                  : 'Continue to Next Reel'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
