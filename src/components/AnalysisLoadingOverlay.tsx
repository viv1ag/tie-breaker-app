import React, { useEffect, useState } from 'react';
import { RefreshCw, Scale, CheckCircle2, ShieldAlert, Sparkles, Brain } from 'lucide-react';

interface AnalysisLoadingOverlayProps {
  isOpen: boolean;
  decisionTitle?: string;
  isRerun?: boolean;
}

export const AnalysisLoadingOverlay: React.FC<AnalysisLoadingOverlayProps> = ({
  isOpen,
  decisionTitle,
  isRerun = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Evaluating Trade-offs & Pros/Cons',
      desc: 'Breaking down impact scores, caveats, and hidden costs for each option.',
      icon: Scale,
    },
    {
      title: 'Calibrating Multi-Factor Criteria',
      desc: 'Weighting decision dimensions against your core priorities.',
      icon: Brain,
    },
    {
      title: 'Running Strategic SWOT & Stress-Test',
      desc: 'Assessing worst-case scenarios and mitigation contingencies.',
      icon: ShieldAlert,
    },
    {
      title: 'Synthesizing Decisive Recommendation',
      desc: 'Formulating pivotal factors and step-by-step action plan.',
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div
      id="analysis-loading-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900 text-white shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 mb-1 shadow-inner">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {isRerun ? 'Re-running Decision Analysis' : 'Analyzing Your Decision'}
          </h2>
          {decisionTitle ? (
            <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 px-2 bg-slate-800/80 py-1.5 rounded-lg border border-slate-700/60">
              &ldquo;{decisionTitle}&rdquo;
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Running deep trade-off evaluation and deadlock resolution...
            </p>
          )}
        </div>

        {/* Milestone Steps */}
        <div className="space-y-3 pt-1">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl p-3 border transition-all duration-300 ${
                  isCurrent
                    ? 'border-amber-400/50 bg-amber-500/10 text-white shadow-xs scale-[1.02]'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300'
                    : 'border-slate-800 bg-slate-800/30 text-slate-500 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <StepIcon className="h-4 w-4 text-amber-400 animate-pulse" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-amber-300'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="text-center pt-1">
          <span className="inline-flex items-center gap-2 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            Fast-track reasoning engine active (~2-4 seconds)
          </span>
        </div>
      </div>
    </div>
  );
};
