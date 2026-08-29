import React, { useState } from 'react';
import { Award, Shield, AlertTriangle, TrendingUp, AlertOctagon } from 'lucide-react';
import { DecisionAnalysis, SWOTQuadrant } from '../types';

interface SWOTMatrixViewProps {
  decision: DecisionAnalysis;
}

export const SWOTMatrixView: React.FC<SWOTMatrixViewProps> = ({ decision }) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(
    decision.verdict.recommendedOptionId || decision.options[0]?.id || ''
  );

  const currentOption = decision.options.find((o) => o.id === activeOptionId) || decision.options[0];
  const isWinner = currentOption?.id === decision.verdict.recommendedOptionId;
  const swot: SWOTQuadrant = decision.swotAnalysis[activeOptionId] || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Strategic Factor Assessment (SWOT)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Evaluating internal strengths, limitations, external opportunities, and risks.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
          {decision.options.map((opt) => {
            const isOptWinner = opt.id === decision.verdict.recommendedOptionId;
            const isSelected = opt.id === activeOptionId;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveOptionId(opt.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {isOptWinner && <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                <span>{opt.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Option Context Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-900">
              {currentOption?.title}
            </span>
            {isWinner && (
              <span className="rounded bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                Top Recommendation
              </span>
            )}
          </div>
          {currentOption?.description && (
            <p className="text-xs text-slate-600 mt-0.5 font-normal">{currentOption.description}</p>
          )}
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold border-b border-slate-100 pb-2.5">
            <Shield className="h-4 w-4 text-emerald-600" />
            <div>
              <h4 className="text-sm font-bold">Strengths</h4>
            </div>
          </div>
          <ul className="space-y-2 pt-1">
            {swot.strengths?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold border-b border-slate-100 pb-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <div>
              <h4 className="text-sm font-bold">Weaknesses & Limitations</h4>
            </div>
          </div>
          <ul className="space-y-2 pt-1">
            {swot.weaknesses?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-900 font-bold border-b border-slate-100 pb-2.5">
            <TrendingUp className="h-4 w-4 text-sky-600" />
            <div>
              <h4 className="text-sm font-bold">Opportunities & Growth Potential</h4>
            </div>
          </div>
          <ul className="space-y-2 pt-1">
            {swot.opportunities?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold border-b border-slate-100 pb-2.5">
            <AlertOctagon className="h-4 w-4 text-amber-600" />
            <div>
              <h4 className="text-sm font-bold">Threats & External Risks</h4>
            </div>
          </div>
          <ul className="space-y-2 pt-1">
            {swot.threats?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
