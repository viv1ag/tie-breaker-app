# Product Requirements Document (PRD): The Tiebreaker
## AI-First Structured Decision Analysis & Tiebreaker Engine

---

## 1. Executive Summary & AI-First Philosophy

Traditional PRDs follow a months-long waterfall documentation process preceding any code. **This is an AI-First PRD**, reflecting modern prompt-driven development:
1. **The Genesis Prompt (Core Epic)**: A high-level intent provided to the AI agent that automatically scaffolded the complete full-stack application, schemas, heuristic decision engines, and responsive UI.
2. **Evolutionary Prompts (Refinements & Enhancements)**: Subsequent targeted prompts that incrementally refined user experience, typography, micro-interactions, layout density, and visual balance.

---

## 2. Core Epic (Genesis Prompt): The Decision Engine

### 2.1 The Genesis Prompt
> *"Create a structured decision analysis tool that compares choices, evaluates trade-offs, and provides a clear tiebreaker recommendation."*

### 2.2 Objective & Problem Statement
* **The Problem**: People face analysis paralysis when choosing between competing options (e.g., job offers, apartment rentals, car purchases, tech stacks, lifestyle choices). Standard pros-and-cons lists fail because they lack weighted impact scoring, SWOT context, and decisive tiebreaker algorithms.
* **The Solution**: A multi-dimensional Decision Support System powered by Gemini that takes any dilemma, formulates options and criteria, performs Multi-Criteria Decision Analysis (MCDA), produces SWOT matrices, and outputs an unequivocal, confidence-scored **Tiebreaker Verdict** with action steps.

### 2.3 Core Functional Architecture Built in Genesis

| Module | Feature | Description |
| :--- | :--- | :--- |
| **Ingestion** | **Fast-Track Auto-Draft** | AI analyzes raw unstructured text into structured options & criteria via `/api/suggest-options`. |
| **Ingestion** | **Manual Formulation** | Custom multi-option builder with dynamic tags, priority chips, and scenario presets. |
| **Engine** | **Multi-Model Fallback** | Resilient Gemini pipeline (`gemini-3.7-flash` -> `gemini-flash-latest` -> `gemini-3.1-flash-lite`) with JSON schema enforcement. |
| **Analysis** | **Pros & Cons Matrix** | Impact rating (`low` to `critical`), impact score (1–5), caveats, and category filtering. |
| **Analysis** | **Weighted MCDA Grid** | Interactive weight sliders (1–5) dynamically recalculating composite option rankings in real time. |
| **Analysis** | **SWOT Quadrants** | Strengths, Weaknesses, Opportunities, and Threats breakdown for every alternative. |
| **Verdict** | **Decisive Recommendation** | Explicit single winner, confidence rating (%), pivotal tipping point factor, and "Alternative Condition" trigger. |
| **Execution** | **Tactical Action Plan** | Time-framed action steps (Today, This Week, Next Month) and risk mitigation safeguards. |
| **Stress-Testing**| **Devil's Advocate** | Real-time "What-If" scenario simulator testing if unexpected conditions flip the winning choice. |
| **Persistence** | **Local Vault & Export** | Offline-safe localStorage saving, Markdown report generation, and Print/PDF formatting. |

---

## 3. Evolutionary Enhancements (Subsequent Prompts)

Every subsequent prompt represented a micro-cycle of feedback, UX tightening, and visual polish.

---

### Increment 1: Brand Identity & Favicon Integration
* **User Intent**: The application required a dedicated browser tab identity and cohesive vector branding.
* **Requirements & Implementation**:
  - Generated `/public/favicon.svg` matching the app's dark slate balance scale and golden decisive checkmark.
  - Linked `<link rel="icon">`, `<link rel="apple-touch-icon">` in `index.html`.
  - Added high-contrast vector assets for retina and dark-mode tabs.

---

### Increment 2: Multi-Line Dilemma Input
* **User Prompt / Feedback**: *"Currently Auto-Draft text box is one row and when we will type it will keep shifting sentence backward and so user can't see whole prompt without scrolling."*
* **Requirements & Implementation**:
  - Converted single-line `<input>` to a responsive `<textarea>`.
  - Added multi-sentence wrapping so complex dilemmas with context, salary details, and constraints remain visible.

---

### Increment 3: Auto-Expanding Textarea & Keyboard Ergonomics
* **User Prompt / Feedback**:
  1. *"Newly changed multi-line textarea should initially be shown as a single line to save space while vertically resizing as the user adds text."*
  2. *"Pressing Enter must not trigger AI formulator. Pressing Enter should insert a new line."*
  3. *"Shift 'See Example Dilemmas' button to top right of section to save space."*
* **Requirements & Implementation**:
  - **Auto-Expansion Hook**: Created a `useRef` + `useEffect` dynamic height calculator (`Math.max(42, scrollHeight)px`).
  - **Standardized Keyboard Flow**: Reserved `Enter` strictly for paragraph formatting and linebreaks; decoupled AI formulation to the explicit primary submit button.
  - **Layout Optimization**: Lifted the *See Example Dilemmas* button into the header flex row to recover ~40px of vertical space.

---

### Increment 4: Spatial Hierarchy & Placeholder Tightening
* **User Prompt / Feedback**:
  1. *"Sentence 'Describe what you're debating in natural words — we'll formulate the options and criteria.' should be reduced so that word 'criteria' will not go to new line."*
  2. *"There shouldn't be any scroll bar visible in the text box."*
  3. *"Also provide the example in text box which is of one line only so that text box will initially be one liner."*
* **Requirements & Implementation**:
  - **Copy Fitting**: Shortened header guidance to prevent widows/orphans across mobile and desktop breakpoints.
  - **Zero Scrollbar**: Enforced `overflow-hidden` on the textarea, allowing pure optical growth without OS scrollbar tracks.
  - **Compact Placeholder**: Replaced paragraph placeholder with single-line prompt: `"e.g., Should I join an early-stage startup or take a stable corporate job?"`.

---

### Increment 5: Semantic Precision ("Dilemma" over "Debate")
* **User Prompt / Feedback**: *"Use word 'dilemma' rather than 'debate'."*
* **Requirements & Implementation**:
  - Refined copy to: *"Describe your dilemma in plain words — we'll formulate options & criteria."*
  - Aligned psychological framing from external debate to personal decision dilemma.

---

### Increment 6: Light-Themed Progress Splash Overlay
* **User Prompt / Feedback**: *"Can we make little lighter background of the progress splash pop-up?"*
* **Requirements & Implementation**:
  - Shifted loading backdrop from heavy `bg-slate-950/80` to an airy, translucent `bg-slate-900/40 backdrop-blur-sm`.
  - Rebuilt modal container with crisp white card surfaces (`bg-white border-slate-200 shadow-2xl`).
  - Styled milestone states with pastel status tints (`bg-amber-50` active, `bg-emerald-50` completed) and high-contrast dark typography.

---

## 4. Technical Specifications & Data Contracts

### 4.1 System Topology
```
[React 18 Client (Tailwind + Lucide)]
       │
       ├── POST /api/suggest-options  ──► [Gemini 3.7 Flash Engine]
       ├── POST /api/analyze-decision ──► [Gemini 3.7 Flash + Structured Schema]
       └── POST /api/stress-test      ──► [Gemini 3.7 Flash / Devil's Advocate]
```

### 4.2 Data Models

#### Decision Analysis Schema (`/api/analyze-decision`)
```typescript
interface DecisionAnalysisResult {
  id: string;
  title: string;
  context?: string;
  userPriorities: string[];
  options: Array<{ id: string; title: string; description: string }>;
  prosAndCons: Record<string, Array<{
    id: string;
    point: string;
    type: 'pro' | 'con';
    impact: 'low' | 'medium' | 'high' | 'critical';
    impactScore: number; // 1-5
    caveat: string;
    category: string;
  }>>;
  comparisonDimensions: Array<{
    id: string;
    name: string;
    description: string;
    weight: number; // 1-5
    scores: Record<string, number>; // 1-10 per option
    analysis: Record<string, string>;
  }>;
  swotAnalysis: Record<string, {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  }>;
  verdict: {
    recommendedOptionId: string;
    confidenceScore: number; // 65-95%
    oneLineSummary: string;
    pivotalFactor: string;
    alternativeCondition: string;
    keyTradeoffs: string[];
    actionSteps: Array<{ timeframe: string; step: string }>;
    riskMitigation: Array<{ risk: string; mitigation: string }>;
    finalThought: string;
  };
}
```

---

## 5. Non-Functional Requirements & UX Standards
* **Decisiveness Guarantee**: AI prompt system instructions strictly prohibit "it all depends" cop-outs. A clear winner is always declared alongside conditional triggers for the runner-up.
* **Jargon-Free Tone**: Eliminates MBA/finance jargon in favor of natural, empathetic human prose.
* **Resilience**: Client automatically survives API rate limits through exponential backoff and multi-model fallback.
* **Performance**: Real-time slider recalculations execute in `<5ms` via memoized client-side state.
* **Zero Data Loss**: Form states and historical decisions persist locally in browser storage.

---

## 6. Future AI-First Roadmap
1. **Multi-Stakeholder Mode**: Ingest multiple perspectives/votes from different team members and compute Pareto consensus.
2. **Audio/Voice Intake**: Speak dilemmas naturally via streaming voice input.
3. **Follow-Up Journaling**: Revisit decisions after 30/90 days to log outcome quality and calibrate personal decision bias.
