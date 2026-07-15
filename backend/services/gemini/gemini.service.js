import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { config } from '../../config/index.js';

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || 'MISSING_API_KEY');

// In-memory cache to prevent duplicate calls
const geminiCache = new Map();

// Helper: Retry mechanism
const withRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

// System Prompt enforcing constraints
const SYSTEM_INSTRUCTION = `You are an AI Financial Fraud Investigation Assistant for FraudGuard AI.
CRITICAL RULES:
1. The fraud predictions are produced by an ML model (XGBoost). DO NOT change, challenge, or recalculate the fraud probability or risk level.
2. DO NOT invent facts, names, or missing data.
3. Explain ONLY the supplied data. Your ONLY source of truth is the JSON context provided.
4. If insufficient context exists, state that you cannot answer based on the provided context.
5. Do not make legal conclusions (e.g., "This person is guilty of a crime").
6. When the context contains case data, answer concretely with case IDs, counts, dates, amounts, statuses, and risk levels from the supplied data.
7. If a requested subset is empty, say there are no matching records in the supplied data instead of saying the context is insufficient.
8. The context includes a "recentHighRiskTransactions" array — use these when answering questions about suspicious or flagged activity.
9. Each transaction has a "flaggedReason" field — this is the primary explanation for why it was flagged. Use it directly in your answers.
10. Transaction feature names like V1-V28 are anonymized PCA components. Do NOT try to interpret them by name — instead refer to the ML probability and flaggedReason fields.`;

class AssistantServiceError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AssistantServiceError';
    this.statusCode = 503;
    this.cause = cause;
  }
}

export const generateTransactionExplanation = async (transaction, mlProbability, riskLevel, topFeatures) => {
  if (!config.GEMINI_API_KEY) {
    return {
      explanation: "Gemini API key is not configured. Explanations are disabled.",
      investigationPoints: ["Provide a GEMINI_API_KEY in the environment."],
      confidenceNote: "N/A"
    };
  }

  const cacheKey = `txn_explain_${transaction.transactionId || transaction._id}`;
  if (geminiCache.has(cacheKey)) return geminiCache.get(cacheKey);

  const model = genAI.getGenerativeModel({
    model: config.GEMINI_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          explanation: { type: SchemaType.STRING, description: "Why the transaction was flagged" },
          investigationPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "What the investigator should verify" },
          confidenceNote: { type: SchemaType.STRING, description: "A note about the ML prediction's confidence" }
        },
        required: ["explanation", "investigationPoints", "confidenceNote"]
      }
    }
  });

  const prompt = `Analyze this transaction based on the ML model's prediction. The feature names (V1-V28) are anonymized PCA components — do not try to name them. Focus on the transaction amount, ML probability, risk level, and the relative importance of each feature.
Transaction Data: ${JSON.stringify(transaction)}
ML Fraud Probability: ${(mlProbability * 100).toFixed(1)}%
Risk Level: ${riskLevel}
Top Contributing ML Features (ranked by importance): ${JSON.stringify(topFeatures)}

Generate:
- explanation: A 2-3 sentence human-readable explanation of why this transaction was flagged, referencing its amount, risk score, and the most influential model features by rank (e.g., "the most significant driver", "the second most important factor").
- investigationPoints: 3-4 specific actions the investigator should take based on the transaction data provided.
- confidenceNote: A single sentence assessing the reliability of this prediction given the probability score.
Do not invent merchant names, customer names, or any data not supplied.`;

  try {
    const response = await withRetry(async () => {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    });
    geminiCache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error('[Gemini Service] Transaction Explanation Error:', error.message);
    return {
      explanation: "Failed to generate explanation due to an AI service error.",
      investigationPoints: ["Manually review transaction details.", "Check ML probability scores."],
      confidenceNote: "AI explanation unavailable."
    };
  }
};

export const generateCaseSummary = async (caseData, flaggedTransactions, averageRisk, amountAtRisk) => {
  if (!config.GEMINI_API_KEY) {
    return {
      executiveSummary: "Gemini API key is not configured.",
      findings: ["No AI findings available."],
      recommendations: ["Check configuration."],
      priority: "Medium"
    };
  }

  // To save tokens and avoid quota issues, limit to top 10 flagged transactions
  const topTransactions = flaggedTransactions.slice(0, 10);
  const cacheKey = `case_summary_${caseData.caseId || caseData._id}_${topTransactions.length}`;
  if (geminiCache.has(cacheKey)) return geminiCache.get(cacheKey);

  const model = genAI.getGenerativeModel({
    model: config.GEMINI_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          executiveSummary: { type: SchemaType.STRING },
          findings: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          recommendations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Recommended actions based strictly on ML output" },
          priority: { type: SchemaType.STRING, enum: ["Low", "Medium", "High", "Critical"] }
        },
        required: ["executiveSummary", "findings", "recommendations", "priority"]
      }
    }
  });

  const prompt = `Summarize this fraud investigation case.
Case ID: ${caseData.caseId}
Title: ${caseData.title}
Amount at Risk: ${amountAtRisk}
Average Risk Level: ${averageRisk}
Top High-Risk Transactions (Max 10): ${JSON.stringify(topTransactions)}

Output an Executive Summary, Overall Findings, Recommended Actions (e.g., Review manually, Freeze account, Request customer verification, Escalate to compliance, Monitor future activity), and a Priority Level. Do not guess any facts not provided.`;

  try {
    const response = await withRetry(async () => {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    });
    geminiCache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error('[Gemini Service] Case Summary Error:', error.message);
    return {
      executiveSummary: "Failed to generate AI summary.",
      findings: ["AI service error."],
      recommendations: ["Review case manually."],
      priority: "Medium"
    };
  }
};

export const askAssistant = async (caseData, transactions, question, options = {}) => {
  if (!config.GEMINI_API_KEY) {
    throw new AssistantServiceError('Gemini API key is not configured.');
  }

  const model = genAI.getGenerativeModel({
    model: config.GEMINI_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          answer: { type: SchemaType.STRING, description: "The answer to the investigator's question based only on context." },
          relatedTransactions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "List of transaction IDs mentioned or related to the answer." },
          suggestedNextSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        },
        required: ["answer", "relatedTransactions", "suggestedNextSteps"]
      }
    }
  });

  const suppliedContext = options.context || {
    caseData: caseData || null,
    transactions: transactions || [],
  };

  const prompt = `Use the following MongoDB-backed investigation context as the only source of truth.

System Context:
${JSON.stringify(suppliedContext, null, 2)}

Investigator Question: "${question}"

Answer the question strictly based on the supplied context. Reference concrete case IDs and transaction IDs when relevant. If the question asks for high-risk cases and none exist in the supplied period, say that no high-risk cases were found and summarize the available risk levels. Return JSON that matches the requested schema.`;

  try {
    const response = await withRetry(async () => {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    });
    return response;
  } catch (error) {
    console.error('[Gemini Service] Assistant Error:', error.message);
    throw new AssistantServiceError(`Gemini assistant request failed: ${error.message}`, error);
  }
};
