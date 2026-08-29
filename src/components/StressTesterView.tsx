import React, { useState } from 'react';
import { HelpCircle, Send, AlertCircle, ArrowRight, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface StressTesterViewProps {
  decision: DecisionAnalysis;
}

interface StressTestResult {
  summary: string;
  winnerShift: string;
  impactAnalysis: { optionTitle: string; assessment: string }[];
  contingencyPlan: string;
  takeaway: string;
}

export const StressTesterView: React.FC<StressTesterViewProps> = ({ decision }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsHistory, setResultsHistory] = useState<
    { question: string; result: StressTestResult; timestamp: string }[]
  >([]);

  const samplePrompts = [
    'What if I need to change my mind after 6 months?',
    'What if peace of mind matters more to me than saving money?',
    'What if unexpected expenses come up?',
    'What if my daily schedule gets much busier?',
  ];

  const handleRunStressTest = async (queryText?: string) => {
    const activeQuery = queryText || question;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          question: activeQuery,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to run scenario test');
      }

      const data: StressTestResult = await res.json();
      setResultsHistory((prev) => [
        {
          question: activeQuery,
          result: data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
      setQuestion('');
    } catch (err: any) {
      setError(err?.message || 'Error processing scenario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              Scenario & &quot;What-If&quot; Stress Testing
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Test how resilient this decision remains if constraints, timelines, or priorities change.
          </p>
        </div>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 self-center">Try a scenario:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuestion(prompt);
                handleRunStressTest(prompt);
              }}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 transition-all disabled:opacity-50 shadow-2xs"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Custom Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunStressTest();
          }}
          className="relative mt-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a scenario question (e.g., 'What if my budget is tighter than expected?')..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pr-28 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all font-normal"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="absolute right-1.5 top-1.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-2xs disabled:opacity-40 transition-all cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <span>Evaluate</span>
                <Send className="h-3 w-3" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {resultsHistory.length === 0 && !loading && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500 text-xs sm:text-sm font-normal">
            No scenarios evaluated yet. Select a prompt above or input a custom scenario.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-2 shadow-xs">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-amber-400 animate-spin">
              <RefreshCw className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Evaluating scenario resilience and outcome shifts...
            </p>
          </div>
        )}

        {resultsHistory.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Evaluated Scenario
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  &ldquo;{item.question}&rdquo;
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
            </div>

            {/* Verdict Stability */}
            <div className="rounded-xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                  Impact on Recommendation
                </span>
                <p className="text-sm font-bold text-white">{item.result.winnerShift}</p>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
              {item.result.summary}
            </p>

            {/* Option impact breakdown */}
            <div className="grid gap-3 sm:grid-cols-2">
              {item.result.impactAnalysis.map((imp, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                  <strong className="text-slate-900 font-bold block mb-1 text-xs">{imp.optionTitle}:</strong>
                  <p className="text-slate-600 leading-relaxed font-normal">{imp.assessment}</p>
                </div>
              ))}
            </div>

            {/* Contingency Plan */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                <ShieldCheck className="h-4 w-4 text-slate-700" />
                <span>Contingency & Mitigation</span>
              </div>
              <p className="text-slate-600 pl-5 leading-relaxed font-normal">{item.result.contingencyPlan}</p>
            </div>

            <p className="text-[11px] text-slate-500 italic border-t border-slate-100 pt-2 font-normal">
              Takeaway: {item.result.takeaway}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
