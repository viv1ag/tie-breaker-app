import { DecisionAnalysis, SavedDecisionSummary } from '../types';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export function getSavedDecisions(): DecisionAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved decisions:', e);
    return [];
  }
}

export function saveDecision(analysis: DecisionAnalysis): void {
  try {
    const existing = getSavedDecisions();
    const filtered = existing.filter((d) => d.id !== analysis.id);
    const updated = [analysis, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save decision:', e);
  }
}

export function deleteSavedDecision(id: string): DecisionAnalysis[] {
  try {
    const existing = getSavedDecisions();
    const updated = existing.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete decision:', e);
    return [];
  }
}

export function getDecisionSummaries(): SavedDecisionSummary[] {
  const decisions = getSavedDecisions();
  return decisions.map((d) => {
    const winnerOpt = d.options.find((o) => o.id === d.verdict?.recommendedOptionId);
    return {
      id: d.id,
      title: d.title,
      createdAt: d.createdAt,
      optionCount: d.options.length,
      winnerOptionName: winnerOpt?.title || 'Evaluated',
      confidenceScore: d.verdict?.confidenceScore || 75,
    };
  });
}
