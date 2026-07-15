import mongoose from 'mongoose';
import Case from '../../models/Case.js';
import Transaction from '../../models/Transaction.js';
import ChatMessage from '../../models/ChatMessage.js';

const HIGH_RISK_LEVELS = ['High', 'Critical'];
const ACTIVE_CASE_STATUSES = ['Open', 'In Progress', 'Under Review'];
const CONTEXT_CASE_LIMIT = 100;
const TOP_CASE_LIMIT = 5;
const TOP_TRANSACTIONS_PER_CASE = 15;
const SPECIFIC_CASE_TRANSACTION_LIMIT = 500;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const extractCaseIdFromQuestion = (question = '') => {
  const match = question.match(/\bCASE(?:[-_\s]*[A-Z0-9]+)+\b/i);
  if (!match) return null;

  return match[0]
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toUpperCase();
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const findCaseByIdentifier = async (identifier) => {
  if (!identifier) return null;

  const trimmed = String(identifier).trim();
  if (!trimmed) return null;

  if (isValidObjectId(trimmed)) {
    const byId = await Case.findOne({ _id: trimmed, isDeleted: false })
      .populate('uploadedBy', 'fullName email role')
      .lean();
    if (byId) return byId;
  }

  const normalized = trimmed
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toUpperCase();

  return Case.findOne({
    caseId: { $regex: `^${escapeRegExp(normalized)}$`, $options: 'i' },
    isDeleted: false,
  })
    .populate('uploadedBy', 'fullName email role')
    .lean();
};

const summarizeCase = (caseData) => ({
  id: String(caseData._id),
  caseId: caseData.caseId,
  title: caseData.title,
  status: caseData.status,
  riskLevel: caseData.riskLevel,
  riskScore: caseData.riskScore || 0,
  amountAtRisk: caseData.amountAtRisk || 0,
  transactionCount: caseData.transactionCount || 0,
  createdAt: caseData.createdAt,
  updatedAt: caseData.updatedAt,
  assignedTo: caseData.uploadedBy?.fullName || 'Unassigned',
});

const summarizeTopFeatures = (topFeatures) => {
  if (!topFeatures) return undefined;
  if (Array.isArray(topFeatures)) return topFeatures.slice(0, 8);
  if (typeof topFeatures === 'object') return topFeatures;
  return String(topFeatures);
};

const getFlaggedReason = (transaction) => {
  // Prefer the stored Gemini AI explanation (already a string)
  if (transaction.geminiExplanation && transaction.geminiExplanation.trim()) {
    return transaction.geminiExplanation.trim();
  }
  if (transaction.explanation && transaction.explanation.trim()) {
    return transaction.explanation.trim();
  }
  if (transaction.isFraud && HIGH_RISK_LEVELS.includes(transaction.riskLevel)) {
    return `ML model flagged as fraud. Risk level: ${transaction.riskLevel} (${Math.round((transaction.predictionProbability || 0) * 100)}% probability).`;
  }
  if (transaction.isFraud) return `ML model marked this transaction as fraud (${Math.round((transaction.predictionProbability || 0) * 100)}% probability).`;
  if (HIGH_RISK_LEVELS.includes(transaction.riskLevel)) return `ML risk level is ${transaction.riskLevel} (${Math.round((transaction.predictionProbability || 0) * 100)}% probability).`;
  return '';
};

const summarizeTransaction = (transaction) => {
  const summary = {
    transactionId: transaction.transactionId,
    date: transaction.date,
    amount: transaction.amount || 0,
    merchant: transaction.merchant || '',
    customerName: transaction.customerName || '',
    description: transaction.description || '',
    riskLevel: transaction.riskLevel,
    riskScore: Math.round((transaction.predictionProbability || 0) * 100),
    isFraud: Boolean(transaction.isFraud),
    status: transaction.status,
    flaggedReason: getFlaggedReason(transaction),
    topFeatures: summarizeTopFeatures(transaction.topFeatures),
  };
  // Only include topFeatures when they exist and are informative
  if (!transaction.topFeatures || (Array.isArray(transaction.topFeatures) && transaction.topFeatures.length === 0)) {
    delete summary.topFeatures;
  }
  return summary;
};

const getRiskLevelCounts = async () => {
  const rows = await Case.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
  ]);

  return rows.reduce(
    (acc, row) => {
      if (acc[row._id] !== undefined) acc[row._id] = row.count;
      return acc;
    },
    { Low: 0, Medium: 0, High: 0, Critical: 0 }
  );
};

const getTopCaseTransactionSummaries = async (caseIds) => {
  if (!caseIds.length) return {};

  const transactions = await Transaction.find({ case: { $in: caseIds } })
    .sort({ predictionProbability: -1, amount: -1, date: -1 })
    .lean();

  return transactions.reduce((acc, transaction) => {
    const key = String(transaction.case);
    if (!acc[key]) acc[key] = [];
    if (acc[key].length < TOP_TRANSACTIONS_PER_CASE) {
      acc[key].push(summarizeTransaction(transaction));
    }
    return acc;
  }, {});
};

const getRequestedCaseContext = async (question, providedCaseId) => {
  const requestedCaseId = providedCaseId || extractCaseIdFromQuestion(question);
  if (!requestedCaseId) return null;

  const caseData = await findCaseByIdentifier(requestedCaseId);
  if (!caseData) {
    return {
      requestedCaseId,
      found: false,
      note: 'No matching case was found in MongoDB for the requested case identifier.',
    };
  }

  const [transactions, transactionCount] = await Promise.all([
    Transaction.find({ case: caseData._id })
      .sort({ predictionProbability: -1, date: -1 })
      .limit(SPECIFIC_CASE_TRANSACTION_LIMIT)
      .lean(),
    Transaction.countDocuments({ case: caseData._id }),
  ]);

  return {
    requestedCaseId,
    found: true,
    case: summarizeCase(caseData),
    transactionCount,
    includedTransactionCount: transactions.length,
    transactions: transactions.map(summarizeTransaction),
  };
};

export const buildAssistantContext = async ({ question, caseId } = {}) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalCaseCount,
    activeCaseCount,
    allCases,
    topCases,
    riskLevelCounts,
    specificCaseContext,
  ] = await Promise.all([
    Case.countDocuments({ isDeleted: false }),
    Case.countDocuments({ isDeleted: false, status: { $in: ACTIVE_CASE_STATUSES } }),
    Case.find({ isDeleted: false })
      .populate('uploadedBy', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(CONTEXT_CASE_LIMIT)
      .lean(),
    Case.find({ isDeleted: false })
      .populate('uploadedBy', 'fullName email role')
      .sort({ riskScore: -1, amountAtRisk: -1, createdAt: -1 })
      .limit(TOP_CASE_LIMIT)
      .lean(),
    getRiskLevelCounts(),
    getRequestedCaseContext(question, caseId),
  ]);

  const topCaseIds = topCases.map((caseData) => caseData._id);
  const topCaseTransactionMap = await getTopCaseTransactionSummaries(topCaseIds);

  // For general questions, proactively fetch recent high-risk transactions
  // so the assistant always has concrete flagged transaction data
  const recentHighRiskTransactions = await Transaction.find({
    case: { $in: topCaseIds },
    $or: [{ isFraud: true }, { riskLevel: { $in: HIGH_RISK_LEVELS } }],
  })
    .sort({ predictionProbability: -1, amount: -1, date: -1 })
    .limit(20)
    .lean();

  const caseList = allCases.map(summarizeCase);
  const lastSevenDaysCases = caseList.filter((caseData) => new Date(caseData.createdAt) >= sevenDaysAgo);
  const highRiskCaseCount = riskLevelCounts.High + riskLevelCounts.Critical;

  return {
    generatedAt: now.toISOString(),
    periodContext: {
      lastSevenDaysStart: sevenDaysAgo.toISOString(),
      lastSevenDaysEnd: now.toISOString(),
    },
    portfolioSummary: {
      totalCaseCount,
      activeCaseCount,
      highRiskCaseCount,
      riskLevelCounts,
      caseListTruncated: totalCaseCount > CONTEXT_CASE_LIMIT,
      includedCaseCount: caseList.length,
    },
    cases: caseList,
    lastSevenDaysCases,
    topRiskCases: topCases.map((caseData) => ({
      ...summarizeCase(caseData),
      keyTransactions: topCaseTransactionMap[String(caseData._id)] || [],
    })),
    // Concrete high-risk transactions for grounding general questions
    recentHighRiskTransactions: recentHighRiskTransactions.map(summarizeTransaction),
    specificCaseContext,
  };
};

export const getAssistantInsights = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [highRiskCases, anomalousTransactions, queriesAnswered] = await Promise.all([
    Case.countDocuments({
      isDeleted: false,
      createdAt: { $gte: sevenDaysAgo },
      riskLevel: { $in: HIGH_RISK_LEVELS },
    }),
    Transaction.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      $or: [{ isFraud: true }, { riskLevel: { $in: HIGH_RISK_LEVELS } }],
    }),
    ChatMessage.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
  ]);

  return {
    windowLabel: 'Last 7 days',
    highRiskCases,
    anomalousTransactions,
    queriesAnswered,
  };
};

export const saveAssistantConversation = async ({
  question,
  response,
  sessionId = 'global',
  userId,
  caseContext,
}) => {
  const payload = {
    sessionId,
    question,
    answer: response.answer,
    relatedTransactions: response.relatedTransactions || [],
    suggestedNextSteps: response.suggestedNextSteps || [],
  };

  if (userId && isValidObjectId(userId)) payload.userId = userId;
  if (caseContext?.found && caseContext.case?.id) {
    payload.case = caseContext.case.id;
    payload.caseId = caseContext.case.caseId;
  }

  return ChatMessage.create(payload);
};

export const getRecentConversations = async (limit = 3) => {
  const conversations = await ChatMessage.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return conversations.map((conversation) => ({
    id: String(conversation._id),
    sessionId: conversation.sessionId,
    question: conversation.question,
    answer: conversation.answer,
    caseId: conversation.caseId,
    relatedTransactions: conversation.relatedTransactions || [],
    timestamp: conversation.createdAt,
  }));
};
