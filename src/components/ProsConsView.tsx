import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, Filter, Award, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { DecisionAnalysis, ProConItem } from '../types';

interface ProsConsViewProps {
  decision: DecisionAnalysis;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ decision }) => {
  const [filterType, setFilterType] = useState<'all' | 'pros' | 'cons' | 'critical'>('all');

  const getImpactBadge = (impact: ProConItem['impact']) => {
    switch (impact) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 uppercase tracking-wider">
            Critical Impact
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            High Impact
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            Minor
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Filter Factors:</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Factors
            </button>
            <button
              type="button"
              onClick={() => setFilterType('pros')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'pros'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Pros Only</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('cons')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'cons'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>Cons Only</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('critical')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'critical'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Zap className="h-3 w-3" />
              <span>High Impact</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Detailed Pros & Cons Analysis
        </div>
      </div>

      {/* Grid of Options */}
      <div className={`grid gap-6 ${decision.options.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {decision.options.map((option) => {
          const isWinner = option.id === decision.verdict.recommendedOptionId;
          const allItems = decision.prosAndCons[option.id] || [];

          const filteredItems = allItems.filter((item) => {
            if (filterType === 'pros') return item.type === 'pro';
            if (filterType === 'cons') return item.type === 'con';
            if (filterType === 'critical') return item.impact === 'critical' || item.impact === 'high';
            return true;
          });

          const pros = filteredItems.filter((i) => i.type === 'pro');
          const cons = filteredItems.filter((i) => i.type === 'con');

          const proScoreTotal = allItems
            .filter((i) => i.type === 'pro')
            .reduce((acc, curr) => acc + (curr.impactScore || 3), 0);
          const conScoreTotal = allItems
            .filter((i) => i.type === 'con')
            .reduce((acc, curr) => acc + (curr.impactScore || 3), 0);

          return (
            <div
              key={option.id}
              className={`flex flex-col rounded-2xl border bg-white shadow-xs overflow-hidden transition-all ${
                isWinner ? 'border-slate-400 ring-2 ring-slate-900/10' : 'border-slate-200'
              }`}
            >
              {/* Option Header */}
              <div
                className={`p-6 border-b ${
                  isWinner ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div>
                  {isWinner && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-amber-300 px-2.5 py-0.5 rounded mb-2 shadow-2xs">
                      <Award className="h-3.5 w-3.5 text-slate-900" />
                      Top Recommended
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-slate-900">
                    {option.title}
                  </h3>
                </div>

                {option.description && (
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {option.description}
                  </p>
                )}

                {/* Score balance indicator */}
                <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Pros Score: +{proScoreTotal}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-800 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg">
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span>Cons Score: -{conScoreTotal}</span>
                  </div>
                </div>
              </div>

              {/* Pros & Cons List Body */}
              <div className="p-6 flex-1 space-y-6">
                {/* Pros Section */}
                {(filterType === 'all' || filterType === 'pros' || filterType === 'critical') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Strengths & Advantages ({pros.length})</span>
                    </div>

                    {pros.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No points matching filter</p>
                    ) : (
                      <div className="space-y-2.5">
                        {pros.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs space-y-1.5 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-900 leading-snug">
                                {item.point}
                              </span>
                              <div className="shrink-0">{getImpactBadge(item.impact)}</div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="rounded bg-white px-1.5 py-0.5 font-medium text-slate-600 border border-emerald-100">
                                {item.category}
                              </span>
                            </div>

                            {item.caveat && (
                              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-slate-600 border-l-2 border-emerald-400 pl-2 pt-0.5">
                                <AlertCircle className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="italic font-normal">{item.caveat}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cons Section */}
                {(filterType === 'all' || filterType === 'cons' || filterType === 'critical') && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                      <ThumbsDown className="h-3.5 w-3.5 text-rose-600" />
                      <span>Drawbacks & Limitations ({cons.length})</span>
                    </div>

                    {cons.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No points matching filter</p>
                    ) : (
                      <div className="space-y-2.5">
                        {cons.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-xs space-y-1.5 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-900 leading-snug">
                                {item.point}
                              </span>
                              <div className="shrink-0">{getImpactBadge(item.impact)}</div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="rounded bg-white px-1.5 py-0.5 font-medium text-slate-600 border border-rose-100">
                                {item.category}
                              </span>
                            </div>

                            {item.caveat && (
                              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-slate-600 border-l-2 border-rose-400 pl-2 pt-0.5">
                                <AlertCircle className="h-3 w-3 text-rose-600 shrink-0 mt-0.5" />
                                <span className="italic font-normal">{item.caveat}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
