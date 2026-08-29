import React, { useState, useMemo } from 'react';
import { Sliders, RotateCcw, Award, Check, Info, HelpCircle } from 'lucide-react';
import { DecisionAnalysis, ComparisonDimension } from '../types';

interface ComparisonMatrixViewProps {
  decision: DecisionAnalysis;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({ decision }) => {
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    decision.comparisonDimensions.forEach((dim) => {
      initial[dim.id] = dim.weight || 3;
    });
    return initial;
  });

  const [expandedDimensionId, setExpandedDimensionId] = useState<string | null>(null);

  const resetWeights = () => {
    const initial: Record<string, number> = {};
    decision.comparisonDimensions.forEach((dim) => {
      initial[dim.id] = dim.weight || 3;
    });
    setWeights(initial);
  };

  const handleWeightChange = (dimId: string, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [dimId]: val,
    }));
  };

  const weightedResults = useMemo(() => {
    const results: Record<string, { totalScore: number; maxPossible: number; percentage: number }> = {};

    decision.options.forEach((opt) => {
      results[opt.id] = { totalScore: 0, maxPossible: 0, percentage: 0 };
    });

    decision.comparisonDimensions.forEach((dim) => {
      const w = weights[dim.id] || 1;

      decision.options.forEach((opt) => {
        const score = dim.scores[opt.id] ?? 5;
        results[opt.id].totalScore += score * w;
        results[opt.id].maxPossible += 10 * w;
      });
    });

    let leadingOptionId = decision.options[0]?.id || '';
    let highestPct = -1;

    decision.options.forEach((opt) => {
      const max = results[opt.id].maxPossible || 1;
      const pct = Math.round((results[opt.id].totalScore / max) * 1000) / 10;
      results[opt.id].percentage = pct;
      if (pct > highestPct) {
        highestPct = pct;
        leadingOptionId = opt.id;
      }
    });

    return {
      scores: results,
      leadingOptionId,
    };
  }, [decision, weights]);

  const originalWinner = decision.verdict.recommendedOptionId;
  const currentLeader = weightedResults.leadingOptionId;
  const hasLeaderFlipped = currentLeader !== originalWinner;

  return (
    <div className="space-y-8">
      {/* Interactive Weight Simulator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-bold text-slate-900">
                Priority & Weight Calibration
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
              Adjust the weight of each factor to simulate how shifts in priority alter the leading choice.
            </p>
          </div>

          <button
            type="button"
            onClick={resetWeights}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Live Leaderboard Score Cards */}
        <div className={`grid gap-4 ${decision.options.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
          {decision.options.map((opt) => {
            const scoreData = weightedResults.scores[opt.id];
            const isCurrentLeader = opt.id === currentLeader;
            const isOriginalWinner = opt.id === originalWinner;

            return (
              <div
                key={opt.id}
                className={`relative rounded-xl border p-5 transition-all ${
                  isCurrentLeader
                    ? 'border-slate-400 bg-slate-50/70 ring-2 ring-slate-900/10 shadow-xs'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {opt.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {isCurrentLeader && (
                        <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                          <Award className="h-3 w-3 text-amber-400" />
                          Leading Option
                        </span>
                      )}
                      {isOriginalWinner && !isCurrentLeader && (
                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          Initial Baseline
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {scoreData?.percentage ?? 0}%
                    </span>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      Weighted Score
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCurrentLeader ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${scoreData?.percentage || 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {hasLeaderFlipped && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs sm:text-sm text-amber-950 flex items-center gap-2.5 font-medium shadow-2xs">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Leading Option Shifted:</strong> Based on these customized weights, the top choice is now{' '}
              <strong>{decision.options.find((o) => o.id === currentLeader)?.title}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Criteria Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-slate-100 bg-slate-50 p-5 sm:p-6">
          <h3 className="text-base font-bold text-slate-900">
            Factor-by-Factor Evaluation Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
            Adjust factor weights (1x to 5x) or click any factor to view qualitative rationales.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {decision.comparisonDimensions.map((dimension) => {
            const currentWeight = weights[dimension.id] || 3;
            const isExpanded = expandedDimensionId === dimension.id;

            return (
              <div key={dimension.id} className="p-5 sm:p-6 transition-colors hover:bg-slate-50/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Dimension Name and Weight Slider */}
                  <div className="lg:w-1/3 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedDimensionId(isExpanded ? null : dimension.id)}
                        className="text-left font-bold text-slate-900 text-sm sm:text-base hover:text-amber-700 flex items-center gap-1.5 transition-colors"
                      >
                        <span>{dimension.name}</span>
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Weight: {currentWeight}x
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 font-normal">
                      {dimension.description}
                    </p>

                    {/* Slider */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400">1x</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={currentWeight}
                        onChange={(e) => handleWeightChange(dimension.id, Number(e.target.value))}
                        className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-slate-400">5x</span>
                    </div>
                  </div>

                  {/* Options Scores Grid */}
                  <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {decision.options.map((opt) => {
                      const score = dimension.scores[opt.id] ?? 5;
                      const justification = dimension.analysis[opt.id] || '';

                      return (
                        <div
                          key={opt.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                              {opt.title}
                            </span>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-base font-bold text-slate-900">
                                {score}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">/10</span>
                            </div>
                          </div>

                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                score >= 8
                                  ? 'bg-emerald-600'
                                  : score >= 5
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pt-0.5 font-normal">
                            {justification}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded Justification Drawer */}
                {isExpanded && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Factor Evaluation: {dimension.name}
                    </h5>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {decision.options.map((opt) => (
                        <div key={opt.id} className="bg-white rounded-lg p-3 border border-slate-200">
                          <strong className="text-xs font-bold text-slate-900 block mb-1">
                            {opt.title} ({dimension.scores[opt.id]}/10):
                          </strong>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {dimension.analysis[opt.id]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
