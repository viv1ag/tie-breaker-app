import React from 'react';
import { X, Target, RotateCcw, Heart, Compass } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400 shadow-2xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Evaluation Methodology
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                How The Tiebreaker structures complex decisions into actionable conclusions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm text-slate-600">
          <p className="leading-relaxed font-normal text-slate-700">
            Rather than providing open-ended or ambiguous comparisons, 
            <strong className="text-slate-900 font-semibold"> The Tiebreaker</strong> applies multi-dimensional decision analysis to resolve trade-offs systematically:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <Target className="h-4 w-4 text-amber-600" />
                <span>Primary Utility & Value</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Measures tangible gains, practical ROI, or lifestyle fulfillment against required resource investment.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <RotateCcw className="h-4 w-4 text-emerald-600" />
                <span>Reversibility & Adaptability</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Assesses the ease of switching paths or mitigating lock-in should parameters or preferences change.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Downside Risk & Friction</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Evaluates hidden maintenance, mental fatigue, financial exposure, and likelihood of buyer&apos;s remorse.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <Compass className="h-4 w-4 text-sky-600" />
                <span>The Deciding Factor</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Isolates the single pivotal pivot point that tips the balance in favor of the winning option.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-100/80 border border-slate-200 p-4 text-slate-800 text-xs leading-relaxed">
            <strong className="font-semibold block mb-1 text-slate-900">Direct Recommendations:</strong>
            We avoid non-committal answers. You receive a decisive recommendation, transparent trade-offs, and explicit conditions where an alternative option would take precedence.
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
