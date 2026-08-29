import React from 'react';
import { Award, Zap, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Scale, Check } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface VerdictHeroProps {
  decision: DecisionAnalysis;
  onNavigateToView: (view: 'verdict' | 'proscons' | 'comparison' | 'swot' | 'stresstest') => void;
}

export const VerdictHero: React.FC<VerdictHeroProps> = ({ decision, onNavigateToView }) => {
  const winner = decision.options.find((o) => o.id === decision.verdict.recommendedOptionId);

  return (
    <div className="space-y-6">
      {/* Primary Verdict Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3.5 flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs font-bold text-amber-900">
              <Scale className="h-3.5 w-3.5 text-amber-600" />
              <span>Tiebreaker Verdict</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {winner?.title || 'Recommended Option'}
              </h2>
              {winner?.description && (
                <p className="mt-1 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {winner.description}
                </p>
              )}
            </div>

            <div className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed border-l-3 border-amber-500 pl-4 py-1 italic bg-slate-50 rounded-r-xl">
              &ldquo;{decision.verdict.oneLineSummary}&rdquo;
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900 p-5 text-center text-white shadow-sm sm:min-w-[170px] shrink-0">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Decision Confidence
            </span>
            <div className="my-1 flex items-baseline gap-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">
                {decision.verdict.confidenceScore}
              </span>
              <span className="text-lg font-bold text-amber-400">%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${decision.verdict.confidenceScore}%` }}
              />
            </div>
            <span className="mt-2 text-[11px] text-slate-300 font-medium">
              {decision.verdict.confidenceScore >= 80 ? 'High Decisive Margin' : 'Close Differential'}
            </span>
          </div>
        </div>

        {/* The Deciding Tiebreaker Factor */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-amber-400 font-bold shadow-2xs">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pivotal Factor (Why this option edges ahead)
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-800 leading-relaxed">
                {decision.verdict.pivotalFactor}
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Trigger Condition */}
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Alternative Scenario: When to pick the other option instead
              </h4>
              <p className="mt-0.5 text-xs text-slate-600 leading-relaxed font-normal">
                {decision.verdict.alternativeCondition}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Trade-offs & Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trade-offs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-bold">Key Trade-offs to Accept</h3>
          </div>
          <p className="text-xs text-slate-500">
            Conscious sacrifices associated with choosing this option:
          </p>
          <ul className="space-y-2 pt-1">
            {decision.verdict.keyTradeoffs.map((tradeoff, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-200/70">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-800">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-normal">{tradeoff}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Roadmap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-bold">Recommended Implementation Roadmap</h3>
          </div>
          <p className="text-xs text-slate-500">
            Next steps to execute this decision with clarity:
          </p>
          <div className="space-y-2 pt-1">
            {decision.verdict.actionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="shrink-0 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {step.timeframe}
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {step.step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Potential Risks & Handling */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="h-4 w-4 text-slate-700" />
          <h3 className="text-base font-bold">Risk Management & Contingencies</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decision.verdict.riskMitigation.map((rm, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span>Risk: {rm.risk}</span>
              </div>
              <div className="text-xs text-slate-600 pl-3.5 border-l-2 border-slate-300 font-normal leading-relaxed">
                <span className="font-semibold text-slate-800 block mb-0.5 text-[11px]">Mitigation:</span>
                {rm.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Thought */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            Summary Conclusion
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-800 italic leading-relaxed">
            &ldquo;{decision.verdict.finalThought}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToView('comparison')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-all shadow-2xs active:scale-95"
          >
            <span>Compare Matrix</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
