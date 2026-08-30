import React, { useEffect, useState } from 'react';
import { RefreshCw, Scale, CheckCircle2, ShieldAlert, Sparkles, Brain, Clock, Timer, Hourglass } from 'lucide-react';

interface AnalysisLoadingOverlayProps {
  isOpen: boolean;
  decisionTitle?: string;
  isRerun?: boolean;
  optionsCount?: number;
  prioritiesCount?: number;
  contextLength?: number;
}

export const AnalysisLoadingOverlay: React.FC<AnalysisLoadingOverlayProps> = ({
  isOpen,
  decisionTitle,
  isRerun = false,
  optionsCount = 2,
  prioritiesCount = 3,
  contextLength = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Calibrate estimated duration range based on complexity
  const calculateComplexity = () => {
    let score = 0;
    if (optionsCount > 2) score += (optionsCount - 2) * 1.5;
    if (prioritiesCount > 3) score += (prioritiesCount - 3) * 0.8;
    if (contextLength > 200) score += 1.5;

    if (score <= 1.2) {
      return {
        estRange: '2 – 4 minutes',
        label: 'Standard Depth',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      };
    } else if (score <= 3) {
      return {
        estRange: '3 – 6 minutes',
        label: 'Moderate Depth',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      };
    } else {
      return {
        estRange: '4 – 8 minutes',
        label: 'High Depth & Multi-Factor',
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      };
    }
  };

  const complexity = calculateComplexity();

  const steps = [
    {
      title: 'Evaluating Trade-offs & Pros/Cons',
      desc: 'Breaking down impact scores, caveats, and hidden costs for each candidate option.',
      icon: Scale,
    },
    {
      title: 'Calibrating Multi-Factor Criteria',
      desc: 'Scoring multi-attribute utilities and weighting against your priorities.',
      icon: Brain,
    },
    {
      title: 'Running Strategic SWOT & Stress-Test',
      desc: 'Adversarial failure testing, worst-case risk ratings, and contingency plans.',
      icon: ShieldAlert,
    },
    {
      title: 'Synthesizing Decisive Recommendation',
      desc: 'Formulating the core tiebreaker factor, confidence metrics, and action plan.',
      icon: Sparkles,
    },
  ];

  // Stopwatch & Step Progression
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setElapsedSeconds(0);
      return;
    }

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(seconds);

      // Smooth step pacing across analysis duration
      if (seconds < 12) {
        setCurrentStep(0);
      } else if (seconds < 30) {
        setCurrentStep(1);
      } else if (seconds < 60) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      id="analysis-loading-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-2xl p-6 sm:p-8 space-y-5 my-auto ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-1 shadow-2xs">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {isRerun ? 'Re-running Decision Analysis' : 'Synthesizing Decision Analysis'}
          </h2>
          {decisionTitle ? (
            <p className="text-xs sm:text-sm text-slate-700 font-medium line-clamp-2 px-3 bg-slate-50 py-1.5 rounded-lg border border-slate-200/80">
              &ldquo;{decisionTitle}&rdquo;
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Running deep trade-off evaluation and deadlock resolution...
            </p>
          )}
        </div>

        {/* Time & Complexity Dashboard Header */}
        <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Time Elapsed</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-extrabold text-slate-900 tracking-wider">
                {formatTimer(elapsedSeconds)}
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded font-medium animate-pulse">active</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-slate-200 pl-3">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Timer className="h-3.5 w-3.5 text-slate-400" />
              <span>Est. Duration</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-xs">
                {complexity.estRange}
              </span>
              <span className="text-[10px] text-slate-500">
                (2 to 8 mins max)
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-2.5 pt-1">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl p-3 border transition-all duration-300 ${
                  isCurrent
                    ? 'border-amber-400/80 bg-amber-50/70 text-slate-900 shadow-2xs scale-[1.01]'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50 text-slate-800'
                    : 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-70'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <StepIcon className="h-4 w-4 text-amber-600 animate-pulse" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-amber-950'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Context Notice */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-medium">
            <Hourglass className="h-3.5 w-3.5 text-amber-600 animate-spin" />
            <span>
              {elapsedSeconds < 25
                ? 'Deconstructing dilemma parameters and evaluating options...'
                : elapsedSeconds < 60
                ? 'Calibrating multi-criteria weights and utility matrix...'
                : elapsedSeconds < 120
                ? 'Stress-testing edge cases and worst-case scenarios...'
                : 'Finalizing decisive tiebreaker verdict and action plan...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Analysis duration varies between <strong className="text-slate-700">2 to 8 minutes</strong> based on dilemma complexity, candidate options, and multi-factor depth.
          </p>
        </div>
      </div>
    </div>
  );
};
