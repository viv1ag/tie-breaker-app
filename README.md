# ⚖️ The Tiebreaker — AI-Powered Strategic Decision Engine

> **Cut through analysis paralysis.** Transform tough personal, technical, and strategic dilemmas into clear, weighted trade-off evaluations and decisive verdicts.

---

## 🌟 Overview

**The Tiebreaker** is a modern decision intelligence web application. When facing tough forks in the road—such as job offers, tech stack selections, major financial investments, or strategic pivots—people often get stuck in analysis paralysis.

The Tiebreaker takes your context, candidate options, and core priorities, and conducts a deep multi-faceted evaluation using Google Gemini models:
- Generates a **Decisive Verdict & Tiebreaker Recommendation** with confidence scores.
- Builds an in-depth **Weighted Multi-Factor Comparison Matrix**.
- Breaks down **Pros & Cons with Impact Ratings**.
- Constructs a full **SWOT Matrix** (Strengths, Weaknesses, Opportunities, Threats) for each candidate.
- Performs **Worst-Case Stress Testing & Contingency Planning**.
- Allows **Interactive Sensitivity Tuning** with live sliders to see how shifting priorities change the outcome.

---

## ✨ Key Features

### 🚀 1. Fast-Track Auto-Draft
- **One-Sentence Dilemma Formulation**: Type a natural language question (e.g. *"Should I accept a high-paying enterprise role or join an early-stage AI startup?"*) and let AI automatically generate balanced candidate options, descriptive backgrounds, and relevant criteria tags.
- **Pre-Built Decision Templates**: Quick-start from popular dilemmas across Career, Engineering, Finance, Relocation, and Lifestyle.

### 🎯 2. Decisive Verdict Hero
- **Clear Winner & Confidence Index**: Unambiguous recommendation with a calculated decision confidence percentage.
- **The Core "Tiebreaker Reason"**: A concise, bottom-line justification explaining why the winning option edges out the alternatives.
- **Pivotal Factors & Immediate Action Plan**: Structured milestones and next steps to execute the chosen path.

### 📊 3. Deep Analytical Frameworks
- **Pros & Cons with Impact Ratings**: High, medium, and low impact trade-off indicators for every candidate option.
- **Interactive Criteria Weighting Matrix**: Multi-attribute scoring across all dimensions (Cost, Growth, Risk, Work-Life Balance, etc.) with real-time slider re-weighting.
- **Comparative SWOT Analysis**: Side-by-side Strengths, Weaknesses, Opportunities, and Threats.
- **Worst-Case Stress Testing**: Evaluates what happens if things go wrong, probability/severity ratings, and mitigation plans.

### 🔄 4. Live Progress Overlay & Re-Run Engine
- **Full-Screen Analysis Splash**: Visual milestone indicator during generation (*Trade-offs evaluation → Multi-Factor calibration → SWOT & Stress-testing → Recommendation synthesis*).
- **Saved Dilemmas Vault**: Local persistence to review past decisions.
- **Instant Re-run & Edit**: Re-run existing dilemmas with updated models or tweak fields without re-typing from scratch.

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
  - [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 Flash)
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

## 📦 Build & Production

To bundle the client with Vite and package the backend server with esbuild:

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── server.ts                  # Express backend & Gemini API integration
├── src/
│   ├── App.tsx                # Main Application shell & navigation state
│   ├── main.tsx               # Client entrypoint
│   ├── index.css              # Tailwind CSS imports & theme styling
│   ├── types.ts               # Shared TypeScript models & decision schemas
│   ├── lib/
│   │   └── storage.ts         # Local storage manager for saved decisions
│   └── components/
│       ├── Header.tsx                 # Top navigation and history vault trigger
│       ├── DecisionForm.tsx           # Dilemma form with Fast-Track Auto-Draft
│       ├── AnalysisLoadingOverlay.tsx # Full splash screen with step-by-step progress
│       ├── AnalysisView.tsx           # Multi-tab analysis dashboard
│       ├── VerdictHero.tsx            # Top recommendation, score & action plan
│       ├── ProsConsView.tsx           # Side-by-side pros, cons & caveats
│       ├── ComparisonMatrixView.tsx   # Weighted scores & interactive sensitivity sliders
│       ├── SWOTMatrixView.tsx         # Strategic SWOT grid
│       ├── StressTesterView.tsx       # Worst-case failure modes & mitigations
│       ├── SavedDecisionsDrawer.tsx   # History drawer with one-click re-run
│       ├── ExportModal.tsx            # Multi-format report exporter
│       └── MethodologyModal.tsx       # Explanation of decision science framework
├── .env.example               # Environment variables specification
├── package.json
└── vite.config.ts
```

---

## 💡 How the Decision Framework Works

1. **Multi-Attribute Utility Theory (MAUT)**: Every option is rated across user-defined priority dimensions and weighted according to your preferences.
2. **Qualitative Adversarial Stress-Testing**: Options are tested against external risk factors and worst-case scenario outcomes.
3. **Decisive Tiebreaking**: When options are closely matched, the system isolates the single highest-leverage constraint (the "Tiebreaker Factor") to break deadlocks with clear conviction.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
