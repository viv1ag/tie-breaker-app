import React from 'react';
import { X, Trash2, ArrowRight, Award, Calendar, FolderArchive, RefreshCw } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface SavedDecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onRerunDecision?: (decision: DecisionAnalysis) => void;
}

export const SavedDecisionsDrawer: React.FC<SavedDecisionsDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onRerunDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
              <FolderArchive className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Saved Dilemmas
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                {savedDecisions.length} stored {savedDecisions.length === 1 ? 'analysis' : 'analyses'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-400 space-y-2">
              <FolderArchive className="h-9 w-9 text-slate-300 stroke-1" />
              <p className="text-sm font-bold text-slate-700">No saved choices yet</p>
              <p className="text-xs text-slate-500 max-w-xs font-normal">
                Analyses you evaluate are saved locally in your browser so you can revisit them anytime.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const winner = dec.options.find((o) => o.id === dec.verdict?.recommendedOptionId);
              return (
                <div
                  key={dec.id}
                  className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 
                      onClick={() => {
                        onSelectDecision(dec);
                        onClose();
                      }}
                      className="text-sm font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-amber-700 transition-colors"
                    >
                      {dec.title}
                    </h3>
                    <button
                      type="button"
                      title="Delete saved decision"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(dec.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {winner && (
                    <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-medium">
                      <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        Top Pick: {winner.title}
                      </span>
                      <span className="ml-auto text-[10px] font-bold text-slate-600 shrink-0">
                        {dec.verdict?.confidenceScore}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {onRerunDecision && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRerunDecision(dec);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 px-2 py-0.5 rounded transition-colors"
                          title="Re-run fresh analysis with current AI parameters"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Re-run</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDecision(dec);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-amber-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded transition-colors"
                      >
                        <span>Open</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-200 p-3.5 bg-slate-50 text-xs text-slate-500 text-center font-normal">
          Decisions are stored in your local browser storage.
        </div>
      </div>
    </div>
  );
};
