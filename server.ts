import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Resilient Gemini Content Generation with automatic retry and model fallback
 * to handle temporary 503 high demand or 429 rate limit spikes.
 */
async function generateContentWithFallback(options: {
  contents: any;
  config?: any;
  preferredModels?: string[];
}) {
  const models = options.preferredModels || [
    'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        // Apply low thinking level for fast response on models that support it
        const finalConfig = {
          ...options.config,
        };

        if (model.startsWith('gemini-3.')) {
          finalConfig.thinkingConfig = {
            thinkingLevel: ThinkingLevel.LOW,
          };
        }

        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: finalConfig,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('temporarily unavailable') ||
          errMsg.includes('overloaded');

        if (isTransient && attempt < 2) {
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        } else {
          // Switch to fallback model immediately
          break;
        }
      }
    }
  }

  throw lastError;
}

function parseJsonSafely(rawText: string | undefined): any {
  if (!rawText) return {};
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auto-suggest options & criteria for any dilemma
app.post('/api/suggest-options', async (req, res) => {
  try {
    const { dilemma } = req.body;
    if (!dilemma || typeof dilemma !== 'string') {
      return res.status(400).json({ error: 'Dilemma description is required' });
    }

    const prompt = `The user is facing this decision dilemma (which could be about everyday personal life, lifestyle, travel, purchases, career, family, health, education, or business):
"${dilemma}"

Please formulate 2 to 3 distinct, realistic, mutually exclusive options to compare, along with 4 clear, everyday criteria/priorities that should guide this decision. Use clean, friendly, accessible language suitable for any audience (no unnecessary business or academic jargon).

Return ONLY valid JSON matching this schema:
{
  "title": "Clean concise decision title (e.g., Should I buy an iPhone or Android?, Renting alone vs with roommates, etc.)",
  "suggestedContext": "Brief 1-2 sentence context framing what makes this choice important or tricky",
  "options": [
    {
      "id": "opt-1",
      "title": "Clear option title (e.g. Option A: Adopt a Puppy)",
      "description": "1-2 sentence practical description with realistic expectations, costs, or lifestyle factors"
    }
  ],
  "suggestedPriorities": ["Priority 1", "Priority 2", "Priority 3", "Priority 4"]
}`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            suggestedContext: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'title', 'description'],
              },
            },
            suggestedPriorities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'suggestedContext', 'options', 'suggestedPriorities'],
        },
      },
    });

    const parsed = parseJsonSafely(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/suggest-options:', error);
    res.status(500).json({
      error: 'Failed to suggest options. Please try again in a moment.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Full Decision Analysis Engine
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { title, context, options, priorities } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Title and at least 2 options are required' });
    }

    const optionsDescription = options
      .map((opt: any, idx: number) => `Option ${idx + 1} (ID: "${opt.id || `opt-${idx + 1}`}"): ${opt.title}\nDetails: ${opt.description || 'No additional details provided.'}`)
      .join('\n\n');

    const prioritiesText = priorities && priorities.length > 0
      ? `User's Key Priorities: ${priorities.join(', ')}`
      : 'User has not specified explicit priorities; evaluate across standard natural dimensions for this domain (e.g. Cost, Time/Effort, Daily Happiness, Peace of Mind, Long-term Value).';

    const systemPrompt = `You are "The Tiebreaker", an insightful, friendly, and objective decision advisor.
Your mission is to help anyone—regardless of background—cut through hesitation and make a clear, confident choice.

ADAPTABILITY GUIDELINES:
- Adapt your tone and depth directly to the subject matter. Whether the dilemma is everyday personal (e.g. buying a gadget, adopting a pet, vacation destination, moving apartments) or major life/career (e.g. job offers, buying a home, education, starting a project), speak in clear, relatable, everyday human language.
- STRICTLY AVOID overly dense corporate, MBA, or finance jargon (do NOT use terms like "asymmetric fat-tailed downside drag", "two-way door optionality vectors", or "composite multiplier matrices"). Use natural phrases like "easy to change your mind if needed", "long-term peace of mind", "better value for your money", "day-to-day happiness", "practical time commitment".
- Be decisive: Pick ONE clear winner. Never give a vague "it all depends" cop-out. But also provide the exact conditions under which someone should pick the alternative.

Provide a comprehensive analysis including:
1. Pros and Cons: 3-4 clear pros and 3-4 honest cons for EACH option. Include impact level ('low'|'medium'|'high'|'critical'), an impact score (1 to 5), a practical nuance/tip ("caveat"), and a simple category (e.g. 'Cost & Value', 'Lifestyle & Time', 'Peace of Mind', 'Growth & Learning', 'Effort', 'Happiness').
2. Comparison Dimensions: 4 to 6 relevant comparison criteria specifically tailored to this domain. Give each dimension a default weight (1 to 5), an integer score (1 to 10) for each option ID, and a clear 1-2 sentence everyday justification.
3. Overview & Insights (SWOT): For EACH option ID, provide Strengths (what's great), Weaknesses (drawbacks/challenges), Opportunities (potential upsides or future benefits), and Risks (what to watch out for). Keep bullet points concise and easy to understand.
4. The Decisive Verdict:
   - "recommendedOptionId": The exact ID of the best option.
   - "confidenceScore": Integer between 65 and 95 reflecting analytical confidence.
   - "oneLineSummary": A friendly, punchy sentence explaining the recommendation.
   - "pivotalFactor": The single deciding factor that tips the scale.
   - "alternativeCondition": A clear statement explaining when the user SHOULD choose the other option instead (e.g. "Go with Option B if your top priority is keeping monthly costs as low as possible...").
   - "keyTradeoffs": 2-3 honest trade-offs to keep in mind with the winning choice.
   - "actionSteps": 3-4 practical next steps with realistic timeframes suited to the decision scale (e.g., "Step 1 (Today)", "Step 2 (This Week)", "Step 3 (Next Month)").
   - "riskMitigation": 2-3 risks of the winning choice and simple, actionable ways to manage them.
   - "finalThought": A warm, encouraging closing thought.`;

    const userPrompt = `DECISION TO EVALUATE:
Title: ${title}
Context: ${context || 'None provided'}
${prioritiesText}

OPTIONS TO COMPARE:
${optionsDescription}

Ensure option IDs used in your response match: ${options.map((o: any) => `"${o.id}"`).join(', ')}.`;

    const response = await generateContentWithFallback({
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prosAndConsList: {
              type: Type.ARRAY,
              description: 'List of pros and cons evaluated for each option',
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        type: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        impactScore: { type: Type.NUMBER },
                        caveat: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'point', 'type', 'impact', 'impactScore', 'caveat', 'category'],
                    },
                  },
                },
                required: ['optionId', 'items'],
              },
            },
            comparisonDimensions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weight: { type: Type.NUMBER },
                  optionScores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionId: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        analysis: { type: Type.STRING },
                      },
                      required: ['optionId', 'score', 'analysis'],
                    },
                  },
                },
                required: ['id', 'name', 'description', 'weight', 'optionScores'],
              },
            },
            swotList: {
              type: Type.ARRAY,
              description: 'SWOT strategic assessment for each option',
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  weaknesses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  opportunities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  threats: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['optionId', 'strengths', 'weaknesses', 'opportunities', 'threats'],
              },
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionId: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                oneLineSummary: { type: Type.STRING },
                pivotalFactor: { type: Type.STRING },
                alternativeCondition: { type: Type.STRING },
                keyTradeoffs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                actionSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeframe: { type: Type.STRING },
                      step: { type: Type.STRING },
                    },
                    required: ['timeframe', 'step'],
                  },
                },
                riskMitigation: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      risk: { type: Type.STRING },
                      mitigation: { type: Type.STRING },
                    },
                    required: ['risk', 'mitigation'],
                  },
                },
                finalThought: { type: Type.STRING },
              },
              required: [
                'recommendedOptionId',
                'confidenceScore',
                'oneLineSummary',
                'pivotalFactor',
                'alternativeCondition',
                'keyTradeoffs',
                'actionSteps',
                'riskMitigation',
                'finalThought',
              ],
            },
          },
          required: ['prosAndConsList', 'comparisonDimensions', 'swotList', 'verdict'],
        },
      },
    });

    const parsedData = parseJsonSafely(response.text);

    // Normalize option IDs to ensure perfect client mapping
    const optionIds = options.map((opt: any) => opt.id);

    // Map Pros & Cons dictionary
    const normalizedProsAndCons: Record<string, any[]> = {};
    options.forEach((opt: any, index: number) => {
      // Find matching item in prosAndConsList
      const entry = (parsedData.prosAndConsList || []).find(
        (p: any) => p.optionId === opt.id || p.optionId === `opt-${index + 1}`
      ) || (parsedData.prosAndConsList || [])[index];

      normalizedProsAndCons[opt.id] = (entry?.items || []).map((item: any, i: number) => ({
        id: item.id || `pc-${opt.id}-${i}`,
        point: item.point || 'Key consideration',
        type: item.type === 'con' ? 'con' : 'pro',
        impact: ['low', 'medium', 'high', 'critical'].includes(item.impact) ? item.impact : 'medium',
        impactScore: Number(item.impactScore) || 3,
        caveat: item.caveat || '',
        category: item.category || 'General',
      }));
    });

    // Map SWOT dictionary
    const normalizedSwot: Record<string, any> = {};
    options.forEach((opt: any, index: number) => {
      const entry = (parsedData.swotList || []).find(
        (s: any) => s.optionId === opt.id || s.optionId === `opt-${index + 1}`
      ) || (parsedData.swotList || [])[index];

      normalizedSwot[opt.id] = {
        strengths: entry?.strengths || [],
        weaknesses: entry?.weaknesses || [],
        opportunities: entry?.opportunities || [],
        threats: entry?.threats || [],
      };
    });

    // Map Comparison Dimensions with normalized scores and analysis maps
    const normalizedDimensions = (parsedData.comparisonDimensions || []).map((dim: any, dIndex: number) => {
      const scoresMap: Record<string, number> = {};
      const analysisMap: Record<string, string> = {};

      options.forEach((opt: any, index: number) => {
        const scoreEntry = (dim.optionScores || []).find(
          (os: any) => os.optionId === opt.id || os.optionId === `opt-${index + 1}`
        ) || (dim.optionScores || [])[index];

        scoresMap[opt.id] = typeof scoreEntry?.score === 'number' ? scoreEntry.score : 7;
        analysisMap[opt.id] = scoreEntry?.analysis || `Solid performance on ${dim.name}.`;
      });

      return {
        id: dim.id || `dim-${dIndex + 1}`,
        name: dim.name || `Factor ${dIndex + 1}`,
        description: dim.description || '',
        weight: typeof dim.weight === 'number' ? dim.weight : 3,
        scores: scoresMap,
        analysis: analysisMap,
      };
    });

    // Normalize recommended option ID in verdict
    let recommendedId = parsedData.verdict?.recommendedOptionId;
    if (!optionIds.includes(recommendedId)) {
      // Find match or default to first option
      const matchingOpt = options.find(
        (opt: any, idx: number) =>
          recommendedId === `opt-${idx + 1}` ||
          (opt.title && recommendedId?.toLowerCase().includes(opt.title.toLowerCase()))
      );
      recommendedId = matchingOpt ? matchingOpt.id : optionIds[0];
    }

    const normalizedVerdict = {
      ...(parsedData.verdict || {}),
      recommendedOptionId: recommendedId,
      confidenceScore: typeof parsedData.verdict?.confidenceScore === 'number' ? parsedData.verdict.confidenceScore : 82,
      oneLineSummary: parsedData.verdict?.oneLineSummary || 'Clear recommended path based on balanced trade-offs.',
      pivotalFactor: parsedData.verdict?.pivotalFactor || 'Optimal balance between core priorities and adaptability.',
      alternativeCondition: parsedData.verdict?.alternativeCondition || 'Choose the alternative if your primary constraint shifts.',
      keyTradeoffs: parsedData.verdict?.keyTradeoffs || [],
      actionSteps: parsedData.verdict?.actionSteps || [],
      riskMitigation: parsedData.verdict?.riskMitigation || [],
      finalThought: parsedData.verdict?.finalThought || 'Make your choice with confidence knowing you have planned for the key trade-offs.',
    };

    // Assemble complete decision analysis record
    const result = {
      id: `decision-${Date.now()}`,
      title,
      context,
      userPriorities: priorities || [],
      createdAt: new Date().toISOString(),
      options: options.map((opt: any) => ({
        id: opt.id,
        title: opt.title,
        description: opt.description,
      })),
      prosAndCons: normalizedProsAndCons,
      comparisonDimensions: normalizedDimensions,
      swotAnalysis: normalizedSwot,
      verdict: normalizedVerdict,
    };

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/analyze-decision:', error);
    res.status(500).json({
      error: 'Failed to analyze decision. Please try again in a moment.',
      details: error?.message || 'Unknown server error',
    });
  }
});

// Stress-Test & Devil's Advocate / Follow-up Scenario endpoint
app.post('/api/stress-test', async (req, res) => {
  try {
    const { decision, question } = req.body;
    if (!decision || !question) {
      return res.status(400).json({ error: 'Decision object and question are required' });
    }

    const prompt = `You are "The Tiebreaker", advising a user on this ongoing decision:
Title: ${decision.title}
Context: ${decision.context || 'N/A'}
Options:
${decision.options.map((o: any) => `- ${o.title}: ${o.description}`).join('\n')}

Original Tiebreaker Winner: ${
      decision.options.find((o: any) => o.id === decision.verdict?.recommendedOptionId)?.title || 'Option'
    }

USER WHAT-IF CHALLENGE OR QUESTION:
"${question}"

Provide a sharp, direct analysis in response to this specific condition.
Address:
1. How this new condition / fear impacts the options.
2. Does this flip the winner or reinforce the original choice?
3. Recommended tactical contingency plan.

Return JSON matching:
{
  "summary": "Direct 1-2 sentence response to the scenario",
  "winnerShift": "No shift (Option A still holds)" OR "Shifts to Option B because...",
  "impactAnalysis": [
    { "optionTitle": "Option Name", "assessment": "How this option fares under this condition" }
  ],
  "contingencyPlan": "Key countermeasure or guardrail to put in place",
  "takeaway": "Closing insight"
}`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            winnerShift: { type: Type.STRING },
            impactAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionTitle: { type: Type.STRING },
                  assessment: { type: Type.STRING },
                },
                required: ['optionTitle', 'assessment'],
              },
            },
            contingencyPlan: { type: Type.STRING },
            takeaway: { type: Type.STRING },
          },
          required: ['summary', 'winnerShift', 'impactAnalysis', 'contingencyPlan', 'takeaway'],
        },
      },
    });

    const parsed = parseJsonSafely(response.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/stress-test:', error);
    res.status(500).json({
      error: 'Failed to evaluate stress-test scenario. Please try again in a moment.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Vite & Static file setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on port ${PORT}`);
  });
}

startServer();
