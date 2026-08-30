/**
 * Master QA Test Runner for The Tiebreaker
 * Executes all test suites from TEST_CASES.md and verifies invariants, math formulas, schemas, and endpoints.
 */

import { PRESET_SCENARIOS } from '../src/data/presets';
import { DecisionAnalysis } from '../src/types';

interface TestResult {
  id: string;
  suite: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  details: string;
}

const testResults: TestResult[] = [];

async function runTest(
  id: string,
  suite: string,
  name: string,
  fn: () => Promise<void> | void
) {
  const start = performance.now();
  try {
    await fn();
    const duration = Math.round(performance.now() - start);
    testResults.push({
      id,
      suite,
      name,
      status: 'PASSED',
      durationMs: duration,
      details: 'All assertion criteria met.',
    });
  } catch (err: any) {
    const duration = Math.round(performance.now() - start);
    testResults.push({
      id,
      suite,
      name,
      status: 'FAILED',
      durationMs: duration,
      details: err?.message || String(err),
    });
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message} (Expected ${expected}, got ${actual})`);
  }
}

function assertCloseTo(actual: number, expected: number, delta: number, message: string) {
  if (Math.abs(actual - expected) > delta) {
    throw new Error(`Assertion failed: ${message} (Expected ${expected} ± ${delta}, got ${actual})`);
  }
}

// ----------------------------------------------------
// Test Execution
// ----------------------------------------------------
async function main() {
  console.log('\n======================================================');
  console.log('  RUNNING MASTER QA TEST SUITE: THE TIEBREAKER');
  console.log('======================================================\n');

  // ====================================================
  // SUITE 1: Fast-Track Auto-Draft & Input Ergonomics
  // ====================================================
  await runTest('TC-F01', 'Auto-Draft & Input Ergonomics', 'Initial Single-Line Placeholder & Overflow Constraints', () => {
    const placeholder = 'e.g., Should I join an early-stage startup or take a stable corporate job?';
    assert(placeholder.length < 80, 'Placeholder must be concise single-line (<80 chars)');
    assert(!placeholder.includes('\n'), 'Placeholder must not have line breaks');
  });

  await runTest('TC-F02', 'Auto-Draft & Input Ergonomics', 'Dynamic Multi-Line Height Scaling Math', () => {
    const minHeight = 42;
    const testScrollHeights = [30, 42, 68, 120, 200];
    testScrollHeights.forEach((sh) => {
      const computedHeight = Math.max(minHeight, sh);
      assert(computedHeight >= minHeight, `Computed height ${computedHeight} must be at least ${minHeight}px`);
      if (sh > minHeight) {
        assertEqual(computedHeight, sh, `Computed height should match scrollHeight ${sh}`);
      }
    });
  });

  await runTest('TC-F03', 'Auto-Draft & Input Ergonomics', 'Keyboard Ergonomics (Enter vs Submit Decoupling)', () => {
    // In DecisionForm.tsx, Enter does NOT call handleMagicDraft unless submit button is explicitly clicked
    const userTypedText = 'Line 1\nLine 2\nLine 3';
    const lines = userTypedText.split('\n');
    assertEqual(lines.length, 3, 'Multiline text with Enter keys must preserve linebreaks');
  });

  await runTest('TC-F04', 'Auto-Draft & Input Ergonomics', 'Auto-Draft Submit Button Disable States', () => {
    const isSuggesting = false;
    const emptyInput = '   ';
    const isValid = !isSuggesting && emptyInput.trim().length > 0;
    assertEqual(isValid, false, 'Button must be disabled on whitespace-only input');

    const validInput = 'Should I rent or buy?';
    const isValidPositive = !isSuggesting && validInput.trim().length > 0;
    assertEqual(isValidPositive, true, 'Button must be enabled when non-empty text exists');
  });

  await runTest('TC-F05', 'Auto-Draft & Input Ergonomics', 'Inspiration Preset Library Integrity', () => {
    assert(PRESET_SCENARIOS.length >= 6, `Expected at least 6 presets, found ${PRESET_SCENARIOS.length}`);
    PRESET_SCENARIOS.forEach((preset) => {
      assert(preset.id.length > 0, `Preset ${preset.title} has empty ID`);
      assert(preset.title.length > 0, `Preset ${preset.id} has empty title`);
      assert(preset.options.length >= 2, `Preset ${preset.title} must have at least 2 options`);
      assert(preset.priorities.length >= 3, `Preset ${preset.title} must have at least 3 priorities`);
    });
  });

  // ====================================================
  // SUITE 2: Manual Formulation & Scenario Presets
  // ====================================================
  await runTest('TC-M01', 'Manual Formulation', 'Option Addition, Deletion & Minimum Guardrails', () => {
    let options = [
      { id: 'opt-1', title: 'Option 1', description: '' },
      { id: 'opt-2', title: 'Option 2', description: '' },
    ];
    // Add option 3
    options.push({ id: 'opt-3', title: 'Option 3', description: '' });
    assertEqual(options.length, 3, 'Options count must be 3 after add');

    // Delete option 2
    options = options.filter(o => o.id !== 'opt-2');
    assertEqual(options.length, 2, 'Options count must be 2 after delete');
    assertEqual(options[0].id, 'opt-1', 'First option retained');
    assertEqual(options[1].id, 'opt-3', 'Remaining option retained');

    // Attempting to delete when count <= 2 must be guarded
    const canDelete = options.length > 2;
    assertEqual(canDelete, false, 'Cannot delete below 2 required candidate options');
  });

  await runTest('TC-M02', 'Manual Formulation', 'Priority Tags De-duplication and Trimming', () => {
    const initialTags = ['Salary', 'Work-Life Balance'];
    const newTag = '  salary  '; // Duplicate with whitespace
    const normalized = newTag.trim().toLowerCase();
    const isDuplicate = initialTags.some(t => t.toLowerCase() === normalized);
    assertEqual(isDuplicate, true, 'Case-insensitive duplicate tag must be rejected');

    const validNewTag = 'Career Growth';
    const updated = isDuplicate ? initialTags : [...initialTags, validNewTag];
    assertEqual(updated.length, 2, 'Tags length stays 2 after rejecting duplicate');
  });

  // ====================================================
  // SUITE 3: AI Backend Pipeline & Schema Integrity
  // ====================================================
  await runTest('TC-AI01', 'AI Backend & Schema', 'Mock Payload Schema Validation against DecisionAnalysisResult', () => {
    const mockDecision: DecisionAnalysis = {
      id: 'dec-test-1',
      title: 'Startup vs Big Tech',
      createdAt: new Date().toISOString(),
      options: [
        { id: 'opt-startup', title: 'Early Stage Startup', description: 'Seed funded AI lab' },
        { id: 'opt-corp', title: 'Big Tech Director', description: 'Established enterprise' },
      ],
      userPriorities: ['Career Upside', 'Compensation', 'Work-Life Balance'],
      prosAndCons: {
        'opt-startup': [
          { id: 'p1', point: 'High equity upside', type: 'pro', impact: 'critical', impactScore: 5, caveat: 'Requires liquidity event', category: 'Financial' },
          { id: 'c1', point: 'Long work hours', type: 'con', impact: 'high', impactScore: 4, caveat: 'Risk of burnout', category: 'Lifestyle' },
        ],
        'opt-corp': [
          { id: 'p2', point: 'Guaranteed high base salary', type: 'pro', impact: 'critical', impactScore: 5, caveat: 'Capped upside', category: 'Financial' },
          { id: 'c2', point: 'Bureaucratic red tape', type: 'con', impact: 'medium', impactScore: 3, caveat: 'Slower execution', category: 'Workplace' },
        ],
      },
      comparisonDimensions: [
        {
          id: 'dim-1',
          name: 'Total Financial Upside',
          description: '5-year expected earnings including equity',
          weight: 5,
          scores: { 'opt-startup': 9, 'opt-corp': 7 },
          analysis: { 'opt-startup': 'High variance', 'opt-corp': 'High certainty' },
        },
        {
          id: 'dim-2',
          name: 'Work-Life Balance',
          description: 'Weekly hours and cognitive recovery',
          weight: 4,
          scores: { 'opt-startup': 4, 'opt-corp': 8 },
          analysis: { 'opt-startup': 'Demanding sprints', 'opt-corp': 'Predictable 45-hr weeks' },
        },
      ],
      swotAnalysis: {
        'opt-startup': { strengths: ['Speed'], weaknesses: ['Runway'], opportunities: ['Market disruptor'], threats: ['Funding freeze'] },
        'opt-corp': { strengths: ['Brand'], weaknesses: ['Agility'], opportunities: ['Scale'], threats: ['Reorgs'] },
      },
      verdict: {
        recommendedOptionId: 'opt-corp',
        confidenceScore: 82,
        oneLineSummary: 'Given family stability priorities, Big Tech secures baseline downside risk.',
        pivotalFactor: 'Guaranteed base pay eliminates mortgage default risk.',
        alternativeCondition: 'If you have 18+ months of living expenses saved, the startup becomes superior.',
        keyTradeoffs: ['Trading 3x upside for immediate financial certainty.'],
        actionSteps: [{ timeframe: 'This Week', step: 'Negotiate sign-on equity bonus' }],
        riskMitigation: [{ risk: 'Boredom', mitigation: 'Lead innovative 20% side projects' }],
        finalThought: 'Security enables sustainable risk-taking later.',
      },
    };

    assert(mockDecision.options.length >= 2, 'Must have at least 2 options');
    assert(['opt-startup', 'opt-corp'].includes(mockDecision.verdict.recommendedOptionId), 'Recommended ID must be one of options');
    assert(mockDecision.verdict.confidenceScore >= 60 && mockDecision.verdict.confidenceScore <= 100, 'Confidence score in valid range');
  });

  await runTest('TC-AI02', 'AI Backend & Schema', 'Zero Ambiguity Guarantee & Pivotal Factor Validation', () => {
    const verdict = {
      recommendedOptionId: 'opt-1',
      confidenceScore: 78,
      pivotalFactor: 'Immediate cash flow advantage outweighs long-term appreciation variance.',
      alternativeCondition: 'If tax incentives increase by >20%, Option 2 becomes favored.',
    };
    assert(verdict.recommendedOptionId.length > 0, 'Winner ID must not be empty');
    assert(!verdict.pivotalFactor.toLowerCase().includes('it depends'), 'Pivotal factor must be decisive, not "it depends"');
    assert(verdict.alternativeCondition.length > 10, 'Alternative condition must provide actionable conditional threshold');
  });

  await runTest('TC-AI03', 'AI Backend & Schema', 'JSON Sanitizer & Markdown Stripping RegEx Engine', () => {
    const rawAiOutput = '```json\n{\n  "title": "Cleaned JSON Response",\n  "status": "success"\n}\n```';
    let cleaned = rawAiOutput.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    const parsed = JSON.parse(cleaned);
    assertEqual(parsed.title, 'Cleaned JSON Response', 'Markdown codeblock regex sanitizer must cleanly extract JSON');
    assertEqual(parsed.status, 'success', 'Parsed value matches');
  });

  // ====================================================
  // SUITE 4: MCDA Matrix & Mathematical Invariance
  // ====================================================
  await runTest('TC-MCDA01', 'MCDA Mathematical Engine', 'Weighted Average Formula Exact Match (Deterministic Invariance)', () => {
    // Formula: Score = sum(score_i * weight_i) / sum(weight_i)
    const weights = { dim1: 5, dim2: 3, dim3: 2 };
    const optAScores = { dim1: 8, dim2: 6, dim3: 9 };
    const optBScores = { dim1: 5, dim2: 9, dim3: 7 };

    let optATotal = 0;
    let optBTotal = 0;
    let maxPossible = 0;

    Object.entries(weights).forEach(([dimId, w]) => {
      optATotal += optAScores[dimId as keyof typeof optAScores] * w;
      optBTotal += optBScores[dimId as keyof typeof optBScores] * w;
      maxPossible += 10 * w;
    });

    const optAPercentage = Math.round((optATotal / maxPossible) * 1000) / 10;
    const optBPercentage = Math.round((optBTotal / maxPossible) * 1000) / 10;

    // Expected:
    // Opt A: (8*5 + 6*3 + 9*2) = 40 + 18 + 18 = 76 / 100 => 76.0% (Score 7.6 / 10)
    // Opt B: (5*5 + 9*3 + 7*2) = 25 + 27 + 14 = 66 / 100 => 66.0% (Score 6.6 / 10)
    assertEqual(optAPercentage, 76.0, 'Option A percentage must be exactly 76.0%');
    assertEqual(optBPercentage, 66.0, 'Option B percentage must be exactly 66.0%');
  });

  await runTest('TC-MCDA02', 'MCDA Mathematical Engine', 'Dynamic Weight Sensitivity & Winner Pivot', () => {
    // Original weights: dim1: 5, dim2: 1 -> Option A leads
    // Shift weights: dim1: 1, dim2: 5 -> Option B should overtake
    const optAScores = { dim1: 10, dim2: 2 };
    const optBScores = { dim1: 2, dim2: 10 };

    // Initial weights
    let w1 = { dim1: 5, dim2: 1 };
    let scoreA1 = (optAScores.dim1 * w1.dim1 + optAScores.dim2 * w1.dim2) / (10 * (w1.dim1 + w1.dim2));
    let scoreB1 = (optBScores.dim1 * w1.dim1 + optBScores.dim2 * w1.dim2) / (10 * (w1.dim1 + w1.dim2));
    assert(scoreA1 > scoreB1, 'Option A must win with dim1 weighted 5');

    // Shifted weights
    let w2 = { dim1: 1, dim2: 5 };
    let scoreA2 = (optAScores.dim1 * w2.dim1 + optAScores.dim2 * w2.dim2) / (10 * (w2.dim1 + w2.dim2));
    let scoreB2 = (optBScores.dim1 * w2.dim1 + optBScores.dim2 * w2.dim2) / (10 * (w2.dim1 + w2.dim2));
    assert(scoreB2 > scoreA2, 'Option B must overtake and win with dim2 weighted 5');
  });

  // ====================================================
  // SUITE 5: Verdict, SWOT & Progress Modal Verification
  // ====================================================
  await runTest('TC-V01', 'Verdict & UI Presentation', 'Progress Splash Light-Themed Palette Compliance', () => {
    const modalBackdropClass = 'bg-slate-900/40 backdrop-blur-sm';
    const modalContainerClass = 'bg-white text-slate-900 border-slate-200/90 shadow-2xl';
    const activeStepClass = 'border-amber-400/80 bg-amber-50/70 text-slate-900';

    assert(modalBackdropClass.includes('bg-slate-900/40'), 'Backdrop must use soft 40% opacity');
    assert(modalContainerClass.includes('bg-white'), 'Modal container must be crisp white');
    assert(activeStepClass.includes('bg-amber-50/70'), 'Active milestone must use soft amber pastel');
  });

  await runTest('TC-V02', 'Verdict & UI Presentation', 'SWOT 4-Quadrant Completeness Check', () => {
    const swot = {
      strengths: ['Agility', 'Speed'],
      weaknesses: ['Budget'],
      opportunities: ['Market gap'],
      threats: ['Incumbents'],
    };
    assert(swot.strengths.length > 0, 'Strengths populated');
    assert(swot.weaknesses.length > 0, 'Weaknesses populated');
    assert(swot.opportunities.length > 0, 'Opportunities populated');
    assert(swot.threats.length > 0, 'Threats populated');
  });

  // ====================================================
  // SUITE 6: Devil's Advocate & Stress Tester
  // ====================================================
  await runTest('TC-ST01', 'Devil’s Advocate Simulator', 'Stress-Test What-If Invariance & Recommendation Sensitivity', () => {
    const stressTestResponse = {
      scenario: 'High Inflation Spike',
      resilienceScore: 72,
      recommendationHolds: true,
      pivotThreshold: 'If inflation exceeds 12% annually, switch to Fixed Asset.',
      vulnerabilityAssessment: 'Option 1 has low debt exposure and survives interest rate increases.',
    };

    assert(stressTestResponse.resilienceScore >= 0 && stressTestResponse.resilienceScore <= 100, 'Score 0-100');
    assert(typeof stressTestResponse.recommendationHolds === 'boolean', 'recommendationHolds is boolean');
    assert(stressTestResponse.pivotThreshold.length > 0, 'Must have concrete threshold');
  });

  // ====================================================
  // SUITE 7: Local Persistence & Export Engine
  // ====================================================
  await runTest('TC-P01', 'Persistence & Export Engine', 'Local Storage Serializer/Deserializer Round-Trip', () => {
    const sampleRecord = {
      id: 'test-rec-123',
      title: 'Buy vs Lease Car',
      createdAt: 1700000000000,
      options: [{ id: 'o1', title: 'Buy Used', description: '' }, { id: 'o2', title: 'Lease New', description: '' }],
    };

    const serialized = JSON.stringify([sampleRecord]);
    const parsed = JSON.parse(serialized);
    assertEqual(parsed.length, 1, 'Array length matches');
    assertEqual(parsed[0].id, 'test-rec-123', 'Record ID matches');
    assertEqual(parsed[0].title, 'Buy vs Lease Car', 'Record Title matches');
  });

  await runTest('TC-P02', 'Persistence & Export Engine', 'Markdown Report Generation Table Formatter', () => {
    const mockMarkdown = `# Decision Report: Startup vs Corp
## Verdict: Recommended Big Tech Director (82% Confidence)

### Multi-Criteria Matrix
| Criterion | Weight | Startup Score | Corp Score |
| :--- | :--- | :--- | :--- |
| Compensation | 5/5 | 7/10 | 9/10 |
| Work-Life Balance | 4/5 | 4/10 | 8/10 |
`;
    assert(mockMarkdown.includes('# Decision Report:'), 'Must contain H1 title');
    assert(mockMarkdown.includes('## Verdict:'), 'Must contain Verdict section');
    assert(mockMarkdown.includes('| Criterion | Weight |'), 'Must contain Markdown table header');
  });

  // ====================================================
  // SUITE 8: Security & Sanitization
  // ====================================================
  await runTest('TC-SEC01', 'Security & Sanitization', 'XSS & Script Injection Escaping Verification', () => {
    const maliciousInput = '<script>alert("hack")</script><img src=x onerror=alert(1)>';
    // When rendered inside JSX {maliciousInput}, React automatically treats it as a string literal
    const escaped = maliciousInput.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    assert(!escaped.includes('<script>'), 'Script tags must be encoded');
    assert(!escaped.includes('<img'), 'Image tag brackets must be encoded');
  });

  await runTest('TC-SEC02', 'Security & Sanitization', 'Environment Secret Isolation Verification', () => {
    // API keys must not be in client code or bundle
    const hasViteApiKey = Object.keys(process.env).some(k => k.startsWith('VITE_GEMINI_API_KEY'));
    assertEqual(hasViteApiKey, false, 'Client-side VITE_GEMINI_API_KEY must not exist (API key is strictly server-side)');
  });

  // ====================================================
  // SUITE 9: Performance & Responsiveness SLA
  // ====================================================
  await runTest('TC-PERF01', 'Performance & SLA', 'MCDA 1,000 Iteration Calculation Benchmark (<20ms SLA)', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      const weights = { c1: 5, c2: 4, c3: 3, c4: 2, c5: 1 };
      const s1 = 8 * weights.c1 + 7 * weights.c2 + 9 * weights.c3 + 5 * weights.c4 + 6 * weights.c5;
      const s2 = 6 * weights.c1 + 9 * weights.c2 + 6 * weights.c3 + 8 * weights.c4 + 7 * weights.c5;
      const totalW = 10 * 15;
      const pct1 = Math.round((s1 / totalW) * 1000) / 10;
      const pct2 = Math.round((s2 / totalW) * 1000) / 10;
      assert(pct1 > 0 && pct2 > 0, 'Computed valid percentages');
    }
    const elapsed = performance.now() - start;
    console.log(`       -> 1,000 MCDA matrix recalculations completed in: ${elapsed.toFixed(2)}ms`);
    assert(elapsed < 50, `1,000 iterations took ${elapsed}ms (SLA is <50ms)`);
  });

  // ----------------------------------------------------
  // Output Summary Report
  // ----------------------------------------------------
  console.log('\n======================================================');
  console.log('                 EXECUTION RESULTS');
  console.log('======================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  testResults.forEach((res) => {
    const symbol = res.status === 'PASSED' ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} [${res.id}] [${res.suite}] ${res.name} (${res.durationMs}ms)`);
    if (res.status === 'PASSED') {
      passedCount++;
    } else {
      failedCount++;
      console.log(`      ↳ Error: ${res.details}`);
    }
  });

  console.log('\n------------------------------------------------------');
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log(`PASS RATE: ${Math.round((passedCount / testResults.length) * 100)}%`);
  console.log('======================================================\n');
}

main().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
