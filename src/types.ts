export interface DecisionOption {
  id: string;
  title: string;
  description?: string;
}

export interface ProConItem {
  id: string;
  point: string;
  type: 'pro' | 'con';
  impact: 'low' | 'medium' | 'high' | 'critical';
  impactScore: number; // 1 to 5
  caveat?: string;
  category: string; // e.g., 'Financial', 'Career', 'Time', 'Emotional', 'Strategic'
}

export interface ComparisonDimension {
  id: string;
  name: string;
  description: string;
  weight: number; // 1 to 5 default weight
  scores: Record<string, number>; // optionId -> score 1 to 10
  analysis: Record<string, string>; // optionId -> brief justification
}

export interface SWOTQuadrant {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  confidenceScore: number; // 0 to 100
  oneLineSummary: string;
  pivotalFactor: string; // The exact tiebreaker reason
  alternativeCondition: string; // "Choose Option B if..."
  keyTradeoffs: string[];
  actionSteps: {
    timeframe: string;
    step: string;
  }[];
  riskMitigation: {
    risk: string;
    mitigation: string;
  }[];
  finalThought: string;
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  context?: string;
  userPriorities?: string[];
  createdAt: string;
  options: DecisionOption[];
  prosAndCons: Record<string, ProConItem[]>; // optionId -> items
  comparisonDimensions: ComparisonDimension[];
  swotAnalysis: Record<string, SWOTQuadrant>; // optionId -> SWOT
  verdict: TiebreakerVerdict;
}

export interface SavedDecisionSummary {
  id: string;
  title: string;
  createdAt: string;
  optionCount: number;
  winnerOptionName: string;
  confidenceScore: number;
}

export interface PresetScenario {
  id: string;
  tag: string;
  title: string;
  context: string;
  options: { title: string; description: string }[];
  priorities: string[];
}
