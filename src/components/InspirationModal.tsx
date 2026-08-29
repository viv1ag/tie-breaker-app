import React from 'react';
import { X, Sparkles, ArrowRight, Layers, Lightbulb } from 'lucide-react';
import { PresetScenario } from '../types';
import { PRESET_SCENARIOS } from '../data/presets';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
}

export const InspirationModal: React.FC<InspirationModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="inspiration-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="inspiration-modal-content"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-2xs font-bold shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Example Dilemmas & Inspiration
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Click any scenario to populate the form and see how the analysis works.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Cards List */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-3">
          {PRESET_SCENARIOS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-400 hover:bg-amber-50/40 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                    {preset.tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                    {preset.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {preset.context}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {preset.priorities.slice(0, 3).map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded"
                    >
                      {p}
                    </span>
                  ))}
                  {preset.priorities.length > 3 && (
                    <span className="text-[10px] text-slate-400">
                      +{preset.priorities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 rounded-lg bg-slate-100 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-700 px-3 py-1.5 text-xs font-bold transition-all">
                <span>Load</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <span>You can modify any fields after loading.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
