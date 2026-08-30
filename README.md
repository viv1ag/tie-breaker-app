# ⚖️ The Tiebreaker — AI-Powered Strategic Decision Engine

> **Cut through analysis paralysis.** Transform tough personal, technical, and strategic dilemmas into clear, weighted trade-off evaluations and decisive verdicts.

🌐 **Live Demo**: [https://tiebrkr.ai.studio/](https://tiebrkr.ai.studio/)

---

## 🌟 Overview

**The Tiebreaker** is a modern decision intelligence web application. When facing tough forks in the road—such as job offers, tech stack selections, major financial investments, or strategic pivots—people often get stuck in analysis paralysis.

The Tiebreaker takes your context, candidate options, and core priorities, and conducts a deep multi-faceted evaluation using Google Gemini models:
- Generates an unambiguous **Decisive Verdict & Tiebreaker Recommendation** with confidence scores.
- Builds an in-depth **Weighted Multi-Factor Comparison Matrix (MCDA)** with live interactive weight sliders.
- Breaks down **Pros & Cons with Impact Ratings** and caveats.
- Constructs a full **SWOT Matrix** (Strengths, Weaknesses, Opportunities, Threats) for each candidate.
- Performs **Worst-Case Stress Testing & Devil's Advocate Simulation**.
- Allows **Interactive Sensitivity Tuning** with live sliders to see how shifting priorities change the outcome in real time (<1ms recalculation).

---

## ✨ Key Features

### 🚀 1. Fast-Track Auto-Draft & Dynamic Ergonomics
- **Natural Language Dilemma Ingestion**: Type a dilemma in plain words (e.g. *"Should I join an early-stage startup or take a stable corporate job?"*) and let AI formulate candidate options, descriptive backgrounds, and relevant criteria tags.
- **Auto-Expanding Input Box**: Starts as a space-saving single line (`42px`), dynamically expanding vertically as you type or paste without intrusive scrollbars.
- **Keyboard Ergonomics**: Pressing <kbd>Enter</kbd> comfortably inserts new lines for notes and paragraphs; AI formulation is cleanly triggered via the dedicated action button.
- **Top-Right Dilemma Inspiration**: Quick-start from curated dilemma templates across Career, Engineering, Finance, Relocation, and Lifestyle.

### 🎯 2. Decisive Verdict Hero
- **Clear Winner & Confidence Index**: Unambiguous recommendation with a calculated decision confidence percentage (60–95%). Zero "it depends" cop-outs.
- **The Core "Tiebreaker Reason"**: A concise, bottom-line justification explaining why the winning option edges out the alternatives.
- **Pivotal Factors & Immediate Action Plan**: Structured milestones (*Today*, *This Week*, *Next Month*) and risk mitigation safeguards.

### 📊 3. Deep Analytical Frameworks
- **Pros & Cons with Impact Ratings**: Critical, high, medium, and low impact trade-off indicators for every candidate option.
- **Interactive MCDA Weighting Matrix**: Multi-attribute scoring across all dimensions with real-time slider re-weighting.
- **Comparative SWOT Analysis**: Side-by-side Strengths, Weaknesses, Opportunities, and Threats in color-coded quadrants.
- **Devil's Advocate Stress Testing**: Evaluates what happens in custom "What-If" crisis scenarios with contingency ratings.

### 🔄 4. Light-Themed Progress Overlay & Saved Vault
- **Refined Loading Splash**: Soft, high-contrast modal backdrop (`bg-slate-900/40`) with live step-by-step progress tracking and second-by-second elapsed timer.
- **Saved Dilemmas Vault**: Offline-ready local storage to review and restore past decisions.
- **Instant Re-run & Edit**: Re-run existing dilemmas or tweak candidate options and weights on the fly.

### 📤 5. Multi-Format Export & Sharing
- Export comprehensive decision briefs to **Markdown**, **JSON**, **Formatted HTML**, or **Print / PDF**.
- One-click copy formatted executive summary to clipboard.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Iconography)
  - [Motion](https://motion.dev/) (Animations & Transitions)
  - [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend & AI**:
  - [Express.js](https://expressjs.com/) (Node.js full-stack proxy server)
  - [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 3.7 Flash with multi-model fallback pipeline)
  - [Vite](https://vitejs.dev/) & [esbuild](https://esbuild.github.io/)

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- A **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/the-tiebreaker.git
   cd the-tiebreaker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the example environment file and add your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

The project includes an automated test suite verifying mathematical invariance, AI schema contracts, input ergonomics, and security:

```bash
# Run the complete QA test suite
npx tsx scripts/run-all-tests.ts

# Run TypeScript typechecks & linter
npm run lint
```

For complete test specifications and coverage matrix, see **[`TEST_CASES.md`](./TEST_CASES.md)**.

---

## 📄 Documentation

- **[`PRD.md`](./PRD.md)**: AI-First Product Requirements Document detailing the Genesis Prompt and evolutionary increments.
- **[`TEST_CASES.md`](./TEST_CASES.md)**: Principal QA Master Test Suite & Test Strategy.

---

## 📦 Build & Production

To bundle the client with Vite and package the backend server with esbuild:

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── PRD.md                     # AI-First Product Requirements Document
├── TEST_CASES.md              # Master QA Test Plan & Test Suite
├── scripts/
│   └── run-all-tests.ts       # Automated QA test runner script
├── server.ts                  # Express backend & Gemini API pipeline
├── src/
│   ├── App.tsx                # Main Application shell & navigation state
│   ├── main.tsx               # Client entrypoint
│   ├── index.css              # Tailwind CSS imports & theme styling
│   ├── types.ts               # Shared TypeScript models & decision schemas
│   ├── data/
│   │   └── presets.ts         # Pre-configured dilemma templates
│   ├── lib/
│   │   └── storage.ts         # Local storage manager for saved decisions
│   └── components/
│       ├── Header.tsx                 # Top navigation and history vault trigger
│       ├── DecisionForm.tsx           # Dilemma form with Fast-Track Auto-Draft
│       ├── AnalysisLoadingOverlay.tsx # Splash modal with step-by-step progress
│       ├── AnalysisView.tsx           # Multi-tab analysis dashboard
│       ├── VerdictHero.tsx            # Top recommendation, score & action plan
│       ├── ProsConsView.tsx           # Side-by-side pros, cons & caveats
│       ├── ComparisonMatrixView.tsx   # Weighted scores & interactive sensitivity sliders
│       ├── SWOTMatrixView.tsx         # Strategic SWOT grid
│       ├── StressTesterView.tsx       # Worst-case failure modes & mitigations
│       ├── SavedDecisionsDrawer.tsx   # History drawer with one-click re-run
│       ├── ExportModal.tsx            # Multi-format report exporter
│       ├── InspirationModal.tsx       # Example dilemmas modal
│       └── MethodologyModal.tsx       # Explanation of decision science framework
├── .env.example               # Environment variables specification
├── package.json
└── vite.config.ts
```

---

## 💡 How the Decision Framework Works

1. **Multi-Attribute Utility Theory (MAUT / MCDA)**: Every option is rated across user-defined priority dimensions and weighted according to your preferences with dynamic sensitivity adjustments.
2. **Qualitative Adversarial Stress-Testing**: Options are tested against external risk factors and worst-case scenario outcomes via a simulated Devil's Advocate.
3. **Decisive Tiebreaking**: When options are closely matched, the system isolates the single highest-leverage constraint (the "Tiebreaker Factor") to break deadlocks with clear conviction.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
