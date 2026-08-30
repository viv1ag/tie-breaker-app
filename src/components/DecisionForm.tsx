import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Wand2, RefreshCw, Check, Sparkles, SlidersHorizontal, Scale, Lightbulb } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { PresetScenario } from '../types';

interface DecisionFormProps {
  onAnalyze: (formData: {
    title: string;
    context: string;
    options: { id: string; title: string; description: string }[];
    priorities: string[];
  }) => Promise<void>;
  isLoading: boolean;
  initialData?: {
    title: string;
    context: string;
    options: { id: string; title: string; description: string }[];
    priorities: string[];
  } | null;
  onOpenInspiration?: () => void;
}

const COMMON_PRIORITY_TAGS = [
  'Cost & Budget',
  'Peace of Mind',
  'Daily Convenience',
  'Work-Life Balance',
  'Flexibility to Pivot',
  'Long-Term Value',
  'Family & Social Impact',
  'Health & Wellbeing',
  'Career & Skill Growth',
  'Autonomy & Freedom',
  'Safety & Reliability',
  'Ease of Execution',
];

const OPTION_THEMES = [
  { letter: 'A', bg: 'bg-indigo-600', border: 'border-indigo-200/70', soft: 'bg-indigo-50/50' },
  { letter: 'B', bg: 'bg-amber-600', border: 'border-amber-200/70', soft: 'bg-amber-50/50' },
  { letter: 'C', bg: 'bg-emerald-600', border: 'border-emerald-200/70', soft: 'bg-emerald-50/50' },
  { letter: 'D', bg: 'bg-rose-600', border: 'border-rose-200/70', soft: 'bg-rose-50/50' },
  { letter: 'E', bg: 'bg-violet-600', border: 'border-violet-200/70', soft: 'bg-violet-50/50' },
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onAnalyze,
  isLoading,
  initialData,
  onOpenInspiration,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [context, setContext] = useState(initialData?.context || '');
  const [options, setOptions] = useState<
    { id: string; title: string; description: string }[]
  >(
    initialData?.options && initialData.options.length > 0
      ? initialData.options
      : [
          { id: 'opt-1', title: 'Option A', description: '' },
          { id: 'opt-2', title: 'Option B', description: '' },
        ]
  );
  const [priorities, setPriorities] = useState<string[]>(
    initialData?.priorities && initialData.priorities.length > 0
      ? initialData.priorities
      : ['Cost & Budget', 'Peace of Mind']
  );
  const [customTagInput, setCustomTagInput] = useState('');

  // Sync if initialData changes externally
  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContext(initialData.context || '');
      if (initialData.options && initialData.options.length > 0) {
        setOptions(initialData.options);
      }
      if (initialData.priorities && initialData.priorities.length > 0) {
        setPriorities(initialData.priorities);
      }
    }
  }, [initialData]);

  // AI Quick Formulate
  const [magicDilemma, setMagicDilemma] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const magicTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (magicTextareaRef.current) {
      magicTextareaRef.current.style.height = 'auto';
      magicTextareaRef.current.style.height = `${Math.max(42, magicTextareaRef.current.scrollHeight)}px`;
    }
  }, [magicDilemma]);

  // Animated loading step indicator
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const loadingSteps = [
    'Evaluating trade-offs & pros/cons...',
    'Calibrating decision factor weights...',
    'Analyzing risk contingencies & SWOT...',
    'Synthesizing decisive recommendation...',
  ];

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % loadingSteps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleApplyPreset = (preset: PresetScenario) => {
    setTitle(preset.title);
    setContext(preset.context);
    setOptions(
      preset.options.map((opt, idx) => ({
        id: `opt-${idx + 1}`,
        title: opt.title,
        description: opt.description,
      }))
    );
    setPriorities(preset.priorities);
  };

  const handleMagicDraft = async () => {
    if (!magicDilemma.trim()) return;
    setIsSuggesting(true);
    setSuggestError(null);

    try {
      const res = await fetch('/api/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma: magicDilemma }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to generate options');
      }
      const data = await res.json();

      if (data.title) setTitle(data.title);
      if (data.suggestedContext) setContext(data.suggestedContext);
      if (data.options && Array.isArray(data.options)) {
        setOptions(data.options);
      }
      if (data.suggestedPriorities && Array.isArray(data.suggestedPriorities)) {
        setPriorities(data.suggestedPriorities);
      }
      setMagicDilemma('');
    } catch (err: any) {
      setSuggestError(err?.message || 'Could not auto-generate options');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddOption = () => {
    if (options.length >= 5) return;
    const nextIdx = options.length + 1;
    const letter = String.fromCharCode(64 + nextIdx);
    setOptions((prev) => [
      ...prev,
      { id: `opt-${Date.now()}`, title: `Option ${letter}`, description: '' },
    ]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleOptionChange = (id: string, field: 'title' | 'description', value: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const togglePriorityTag = (tag: string) => {
    setPriorities((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const trimmed = customTagInput.trim();
    if (!priorities.includes(trimmed)) {
      setPriorities((prev) => [...prev, trimmed]);
    }
    setCustomTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || options.length < 2) return;
    onAnalyze({
      title: title.trim(),
      context: context.trim(),
      options,
      priorities,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Balanced, Clean Hero */}
      <div className="text-center space-y-3 pt-1 sm:pt-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/80 border border-slate-300/80 px-3.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
          <Scale className="h-3.5 w-3.5 text-amber-600" />
          <span>Objective Decision Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Break the Deadlock Between Competing Choices
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Compare options systematically through structured trade-offs, customizable priority weights, and a clear, reasoned recommendation.
        </p>
      </div>

      {/* Quick AI Auto-Draft - Prominent Standout with Top-Right Example Dilemmas Button */}
      <div className="relative rounded-2xl border border-amber-300/90 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-50/60 p-5 sm:p-6 shadow-xs ring-1 ring-amber-400/20 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-2xs font-bold shrink-0">
              <Wand2 className="h-4 w-4 text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                <span>Fast-Track Auto-Draft</span>
                <span className="rounded bg-amber-200/90 border border-amber-300 px-1.5 py-0.2 text-[10px] font-extrabold text-amber-950 uppercase tracking-wide">
                  AI Formulator
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-normal">
                Describe your dilemma in plain words — we&apos;ll formulate options &amp; criteria.
              </p>
            </div>
          </div>

          {onOpenInspiration && (
            <button
              type="button"
              id="top-right-inspiration-btn"
              onClick={onOpenInspiration}
              className="inline-flex items-center gap-1.5 font-semibold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300/90 px-3 py-1.5 rounded-xl border border-amber-300 transition-all text-xs active:scale-95 cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-800" />
              <span>See Example Dilemmas</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5 pt-0.5">
          <textarea
            ref={magicTextareaRef}
            id="magic-dilemma-textarea"
            rows={1}
            value={magicDilemma}
            onChange={(e) => setMagicDilemma(e.target.value)}
            placeholder="e.g., Should I join an early-stage startup or take a stable corporate job?"
            className="w-full resize-none min-h-[42px] rounded-xl border border-amber-300/90 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all shadow-2xs leading-relaxed overflow-hidden"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              id="magic-draft-submit-btn"
              onClick={handleMagicDraft}
              disabled={isSuggesting || !magicDilemma.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shrink-0 active:scale-95 cursor-pointer shadow-2xs w-full sm:w-auto"
            >
              {isSuggesting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Formulating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Auto-Draft Form</span>
                </>
              )}
            </button>
          </div>
        </div>

        {suggestError && (
          <p className="text-xs text-rose-600 font-medium">{suggestError}</p>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dilemma Title */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <label className="block text-base font-bold text-slate-900">
              1. What decision are you trying to resolve? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              State the core choice or dilemma clearly.
            </p>
          </div>

          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Should I relocate for a higher-paying job or stay near family and friends?"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
          />

          {/* Context / Personal Constraints */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Personal Context & Constraints (Optional)
            </label>
            <textarea
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Working hybrid schedule, flexible savings buffer, prioritizing long-term stability over short-term excitement."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all resize-none font-normal"
            />
          </div>
        </div>

        {/* Options to Compare */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-base font-bold text-slate-900">
                2. Options Under Consideration <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Compare between 2 and 5 specific alternatives.
              </p>
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 text-slate-600" />
                <span>Add Option</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => {
              const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
              return (
                <div
                  key={opt.id}
                  className={`rounded-xl border ${theme.border} ${theme.soft} p-4 space-y-2.5 transition-all`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${theme.bg} text-xs font-bold text-white shadow-2xs`}>
                      {theme.letter}
                    </span>
                    <input
                      type="text"
                      required
                      value={opt.title}
                      onChange={(e) => handleOptionChange(opt.id, 'title', e.target.value)}
                      placeholder={`Option ${theme.letter} title (e.g., Relocate to Seattle)`}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt.id)}
                        title="Remove option"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={opt.description}
                    onChange={(e) => handleOptionChange(opt.id, 'description', e.target.value)}
                    placeholder="Key specifications, estimated costs, effort, or timeline"
                    className="w-full rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Criteria Tags */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <label className="block text-base font-bold text-slate-900">
              3. Key Evaluation Criteria
            </label>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select or add the factors that carry the most weight in this choice.
            </p>
          </div>

          {/* Tag Cloud */}
          <div className="flex flex-wrap gap-2">
            {COMMON_PRIORITY_TAGS.map((tag) => {
              const isSelected = priorities.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => togglePriorityTag(tag)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Custom tag adder */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag(e);
                }
              }}
              placeholder="Add custom criterion (e.g., Commute distance)..."
              className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-300"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Submit Action & Estimated Duration Notice */}
        <div className="pt-2 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Scale className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Multi-Factor Deep Analysis</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span>⏱️ Estimated Duration:</span>
              <strong className="text-slate-900 font-bold">2 to 8 minutes</strong>
              <span>(based on complexity)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim() || options.length < 2}
            className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 px-6 text-base font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />
                <span className="text-white font-semibold animate-pulse">
                  {loadingSteps[loadingStepIdx]}
                </span>
              </div>
            ) : (
              <>
                <Scale className="h-5 w-5 text-amber-400" />
                <span>Run Decision Analysis</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 text-slate-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
