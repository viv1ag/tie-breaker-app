import React from 'react';
import { History, PlusCircle, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  hasActiveDecision: boolean;
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenMethodology: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasActiveDecision,
  onNewDecision,
  onOpenHistory,
  onOpenMethodology,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          onClick={onNewDecision}
          id="header-brand-logo"
          className="flex cursor-pointer items-center gap-3 transition-transform hover:scale-[1.01] group select-none"
        >
          {/* Custom Tiebreaker Scale & Pivot Logo */}
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-800 transition-all duration-200 group-hover:bg-slate-800">
            {/* Minimalist decisive scale icon */}
            <svg
              className="h-6 w-6 text-amber-400 stroke-[1.8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Central Pivot Pillar */}
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
              {/* Tipped Crossbeam (Resolving the tie!) */}
              <path d="M4 8l8-2 8 2" />
              {/* Left Scale Pan */}
              <path d="M4 8v3a3 3 0 0 0 6 0V8" />
              {/* Right Scale Pan (Lower/Decisive) */}
              <path d="M14 10v3a3 3 0 0 0 6 0v-3" />
            </svg>
            {/* Decisive pivot indicator */}
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-slate-950 ring-2 ring-white shadow-2xs font-bold text-[9px]">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                The Tiebreaker
              </span>
              <span className="hidden xs:inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                Decision Analysis
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block font-medium">
              Weigh trade-offs, break deadlocks, and choose with clarity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="header-methodology-btn"
            onClick={onOpenMethodology}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>Methodology</span>
          </button>

          <button
            type="button"
            id="header-history-btn"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          {hasActiveDecision && (
            <button
              type="button"
              id="header-new-decision-btn"
              onClick={onNewDecision}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              <PlusCircle className="h-3.5 w-3.5 text-amber-400" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
