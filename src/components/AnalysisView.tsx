import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Scale,
  TableProperties,
  LayoutGrid,
  Share2,
  Edit3,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { DecisionAnalysis } from '../types';
import { VerdictHero } from './VerdictHero';
import { ProsConsView } from './ProsConsView';
import { ComparisonMatrixView } from './ComparisonMatrixView';
import { SWOTMatrixView } from './SWOTMatrixView';
import { StressTesterView } from './StressTesterView';

interface AnalysisViewProps {
  decision: DecisionAnalysis;
  onEditDecision: () => void;
  onOpenExport: () => void;
  onRerunDecision?: () => void;
  isRerunning?: boolean;
}

type TabType = 'verdict' | 'proscons' | 'comparison' | 'swot' | 'stresstest';

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  decision,
  onEditDecision,
  onOpenExport,
  onRerunDecision,
  isRerunning = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('verdict');

  // Trigger celebratory confetti when verdict loads
  useEffect(() => {
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#0f172a', '#64748b', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  }, [decision.id]);

  const winner = decision.options.find((o) => o.id === decision.verdict.recommendedOptionId);

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'verdict',
      label: 'The Verdict',
      icon: <Award className="h-4 w-4 text-amber-500" />,
      badge: `${decision.verdict.confidenceScore}%`,
    },
    {
      id: 'proscons',
      label: 'Pros & Cons',
      icon: <Scale className="h-4 w-4 text-slate-600" />,
    },
    {
      id: 'comparison',
      label: 'Compare Factors',
      icon: <TableProperties className="h-4 w-4 text-slate-600" />,
    },
    {
      id: 'swot',
      label: 'Strategic SWOT',
      icon: <LayoutGrid className="h-4 w-4 text-slate-600" />,
    },
    {
      id: 'stresstest',
      label: 'Scenario Tester',
      icon: <Sliders className="h-4 w-4 text-slate-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Dilemma Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Dilemma Analysis
            </span>
            {winner && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900 border border-amber-200">
                <Award className="h-3.5 w-3.5 text-amber-600" />
                <span>Recommended: {winner.title}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {decision.title}
          </h1>

          {decision.context && (
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              <strong className="text-slate-800 font-semibold">Context:</strong> {decision.context}
            </p>
          )}

          {decision.userPriorities && decision.userPriorities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Priorities:</span>
              {decision.userPriorities.map((p, i) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {onRerunDecision && (
            <button
              type="button"
              disabled={isRerunning}
              onClick={onRerunDecision}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-amber-700 transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Re-run analysis with current decision model"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-amber-600 ${isRerunning ? 'animate-spin' : ''}`} />
              <span>{isRerunning ? 'Re-analyzing...' : 'Re-run Analysis'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onEditDecision}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            <span>Edit Dilemma</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Export & Share</span>
          </button>
        </div>
      </div>

      {/* Navigation Perspective Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 p-1 bg-slate-200/70 rounded-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="pt-1">
        {activeTab === 'verdict' && (
          <VerdictHero
            decision={decision}
            onNavigateToView={(view) => setActiveTab(view)}
          />
        )}
        {activeTab === 'proscons' && <ProsConsView decision={decision} />}
        {activeTab === 'comparison' && <ComparisonMatrixView decision={decision} />}
        {activeTab === 'swot' && <SWOTMatrixView decision={decision} />}
        {activeTab === 'stresstest' && <StressTesterView decision={decision} />}
      </div>
    </div>
  );
};
