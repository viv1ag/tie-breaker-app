/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisView } from './components/AnalysisView';
import { SavedDecisionsDrawer } from './components/SavedDecisionsDrawer';
import { ExportModal } from './components/ExportModal';
import { MethodologyModal } from './components/MethodologyModal';
import { DecisionAnalysis } from './types';
import { getSavedDecisions, saveDecision, deleteSavedDecision } from './lib/storage';
import { AlertCircle, Sparkles, Heart } from 'lucide-react';
import { AnalysisLoadingOverlay } from './components/AnalysisLoadingOverlay';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form initial state for editing / re-running
  const [formInitialData, setFormInitialData] = useState<{
    title: string;
    context: string;
    options: { id: string; title: string; description: string }[];
    priorities: string[];
  } | null>(null);
  const [activeAnalysisTitle, setActiveAnalysisTitle] = useState<string>('');
  const [isRerunningActive, setIsRerunningActive] = useState<boolean>(false);

  // Modals / Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Load saved decisions on mount
  useEffect(() => {
    const list = getSavedDecisions();
    setSavedDecisions(list);
  }, []);

  const handleAnalyzeDecision = async (formData: {
    title: string;
    context: string;
    options: { id: string; title: string; description: string }[];
    priorities: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    setActiveAnalysisTitle(formData.title);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Decision analysis failed');
      }

      const data: DecisionAnalysis = await response.json();
      setCurrentDecision(data);
      saveDecision(data);
      setSavedDecisions(getSavedDecisions());

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Decision analysis error:', err);
      setError(err?.message || 'Failed to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRerunningActive(false);
    }
  };

  const handleRerunDecision = async (decisionToRerun: DecisionAnalysis) => {
    const formData = {
      title: decisionToRerun.title,
      context: decisionToRerun.context || '',
      options: decisionToRerun.options.map((opt) => ({
        id: opt.id,
        title: opt.title,
        description: opt.description,
      })),
      priorities: decisionToRerun.userPriorities || [],
    };

    // Populate the form so fields are never blank
    setFormInitialData(formData);
    setActiveAnalysisTitle(decisionToRerun.title);
    setIsRerunningActive(true);

    await handleAnalyzeDecision(formData);
  };

  const handleEditDecision = (decisionToEdit: DecisionAnalysis) => {
    setFormInitialData({
      title: decisionToEdit.title,
      context: decisionToEdit.context || '',
      options: decisionToEdit.options.map((opt) => ({
        id: opt.id,
        title: opt.title,
        description: opt.description,
      })),
      priorities: decisionToEdit.userPriorities || [],
    });
    setCurrentDecision(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSavedDecision = (decision: DecisionAnalysis) => {
    setCurrentDecision(decision);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSavedDecision = (id: string) => {
    const updated = deleteSavedDecision(id);
    setSavedDecisions(updated);
  };

  const handleNewDecision = () => {
    setFormInitialData(null);
    setCurrentDecision(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      <Header
        hasActiveDecision={!!currentDecision}
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        savedCount={savedDecisions.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block">Something went wrong</strong>
              <p className="mt-0.5">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-900 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {!currentDecision ? (
          <DecisionForm
            onAnalyze={handleAnalyzeDecision}
            isLoading={isLoading}
            initialData={formInitialData}
          />
        ) : (
          <AnalysisView
            decision={currentDecision}
            onEditDecision={() => handleEditDecision(currentDecision)}
            onOpenExport={() => setIsExportOpen(true)}
            onRerunDecision={() => handleRerunDecision(currentDecision)}
            isRerunning={isLoading}
          />
        )}
      </main>

      {/* Full Splash Loading Overlay when analysis or re-run is underway */}
      <AnalysisLoadingOverlay
        isOpen={isLoading}
        decisionTitle={activeAnalysisTitle}
        isRerun={isRerunningActive}
      />

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span><strong>The Tiebreaker</strong> — Structured decision analysis and deadlock resolution</span>
          </div>
          <p className="text-slate-400 font-normal">
            Clarity for complex dilemmas and everyday choices
          </p>
        </div>
      </footer>

      {/* Slide-over Vault */}
      <SavedDecisionsDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSavedDecision}
        onDeleteDecision={handleDeleteSavedDecision}
        onRerunDecision={handleRerunDecision}
      />

      {/* Export Modal */}
      {currentDecision && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          decision={currentDecision}
        />
      )}

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
