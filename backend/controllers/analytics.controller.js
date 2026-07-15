import Case from '../models/Case.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const STATUS_COLORS = {
  Open: '#DC2626',
  'In Progress': '#F97316',
  'Under Review': '#FBBF24',
  Closed: '#10B981',
};

const RISK_COLORS = {
  Critical: '#991B1B',
  High: '#DC2626',
  Medium: '#F97316',
  Low: '#FBBF24',
};

const currencyCompact = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  return `₹${Math.round(amount || 0).toLocaleString('en-IN')}`;
};

const percent = (part, total) => (total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0);

const initialsFor = (name = 'User') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

const lastValues = (rows, key, fallback = 0) => {
  const values = rows.slice(-5).map((row) => Number(row[key] || 0));
  while (values.length < 5) values.unshift(fallback);
  return values;
};

const buildCaseMatch = async (query = {}) => {
  const match = { isDeleted: false };

  if (query.status && query.status !== 'All' && query.status !== 'All Cases') {
    match.status = query.status;
  }

  if (query.riskLevel && query.riskLevel !== 'All') {
    match.riskLevel = query.riskLevel;
  }

  if (query.dateRange && query.dateRange !== 'All Time') {
    const now = new Date();
    const days = query.dateRange === 'Last 7 Days' ? 7 : 30;
    match.createdAt = { $gte: new Date(now.getTime() - days * 24 * 60 * 60 * 1000) };
  }

  if (query.assignedTo && query.assignedTo !== 'All') {
    const users = await User.find({
      fullName: { $regex: query.assignedTo, $options: 'i' },
    }).select('_id').lean();
    match.uploadedBy = users.length ? { $in: users.map((user) => user._id) } : null;
  }

  return match;
};

const getCaseTrendRows = async (match, groupFields) =>
  Case.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        ...groupFields,
      },
    },
    { $sort: { _id: 1 } },
  ]);

export const getSummary = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);

    const [
      caseStatsRows,
      resolutionRows,
      transactionStatsRows,
      caseTrendRows,
      closedTrendRows,
      amountTrendRows,
      flaggedTrendRows,
    ] = await Promise.all([
      Case.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalCases: { $sum: 1 },
            closedCases: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } },
            amountAtRisk: { $sum: '$amountAtRisk' },
          },
        },
      ]),
      Case.aggregate([
        { $match: { ...match, status: 'Closed' } },
        {
          $group: {
            _id: null,
            avgResolutionMs: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            flaggedTransactions: { $sum: { $cond: ['$isFraud', 1, 0] } },
          },
        },
      ]),
      getCaseTrendRows(match, { cases: { $sum: 1 } }),
      getCaseTrendRows({ ...match, status: 'Closed' }, { cases: { $sum: 1 } }),
      getCaseTrendRows(match, { amount: { $sum: '$amountAtRisk' } }),
      Transaction.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: 1 },
            flagged: { $sum: { $cond: ['$isFraud', 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const caseStats = caseStatsRows[0] || { totalCases: 0, closedCases: 0, amountAtRisk: 0 };
    const transactionStats = transactionStatsRows[0] || { totalTransactions: 0, flaggedTransactions: 0 };
    const avgResolutionHours = resolutionRows[0]?.avgResolutionMs
      ? Number((resolutionRows[0].avgResolutionMs / 3600000).toFixed(1))
      : 0;
    const flaggedRate = percent(transactionStats.flaggedTransactions, transactionStats.totalTransactions);
    const flaggedTrend = flaggedTrendRows.map((row) => ({
      rate: percent(row.flagged, row.total),
    }));

    const data = [
      {
        title: 'Total Cases Analyzed',
        value: caseStats.totalCases.toLocaleString('en-IN'),
        change: `${caseTrendRows.at(-1)?.cases || 0} latest day`,
        trendData: lastValues(caseTrendRows, 'cases'),
      },
      {
        title: 'Cases Closed',
        value: caseStats.closedCases.toLocaleString('en-IN'),
        change: `${percent(caseStats.closedCases, caseStats.totalCases)}% closure rate`,
        trendData: lastValues(closedTrendRows, 'cases'),
      },
      {
        title: 'Average Resolution Time',
        value: `${avgResolutionHours}h`,
        change: caseStats.closedCases ? 'From closed cases' : 'No closed cases yet',
        trendData: [avgResolutionHours, avgResolutionHours, avgResolutionHours, avgResolutionHours, avgResolutionHours],
      },
      {
        title: 'Flagged Transaction Rate',
        value: `${flaggedRate}%`,
        change: `${transactionStats.flaggedTransactions.toLocaleString('en-IN')} flagged`,
        trendData: lastValues(flaggedTrend, 'rate'),
      },
      {
        title: 'Amount at Risk',
        value: currencyCompact(caseStats.amountAtRisk),
        change: 'Total detected exposure',
        trendData: lastValues(amountTrendRows, 'amount'),
      },
    ];

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCasesOverTime = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);
    const rows = await getCaseTrendRows(match, { cases: { $sum: 1 } });
    const data = rows.map((row) => ({
      date: new Date(row._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cases: row.cases,
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCasesByStatus = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);
    const rows = await Case.aggregate([
      { $match: match },
      { $group: { _id: '$status', value: { $sum: 1 } } },
    ]);
    const counts = Object.fromEntries(rows.map((row) => [row._id, row.value]));
    const data = Object.keys(STATUS_COLORS).map((name) => ({
      name,
      value: counts[name] || 0,
      fill: STATUS_COLORS[name],
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCasesByRisk = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);
    const rows = await Case.aggregate([
      { $match: match },
      { $group: { _id: '$riskLevel', value: { $sum: 1 } } },
    ]);
    const counts = Object.fromEntries(rows.map((row) => [row._id, row.value]));
    const data = Object.keys(RISK_COLORS).map((name) => ({
      name,
      value: counts[name] || 0,
      fill: RISK_COLORS[name],
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCasesByType = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);
    const rows = await Case.aggregate([
      { $match: match },
      {
        $project: {
          category: {
            $switch: {
              branches: [
                { case: { $in: ['$riskLevel', ['Critical', 'High']] }, then: 'High-Risk Review' },
                { case: { $eq: ['$riskLevel', 'Medium'] }, then: 'Manual Review' },
                { case: { $eq: ['$status', 'Closed'] }, then: 'Resolved Investigation' },
              ],
              default: 'Routine Monitoring',
            },
          },
        },
      },
      { $group: { _id: '$category', value: { $sum: 1 } } },
      { $sort: { value: -1, _id: 1 } },
    ]);
    const data = rows.map((row) => ({ name: row._id, value: row.value }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopInvestigators = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);
    const rows = await Case.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$uploadedBy',
          casesHandled: { $sum: 1 },
          closedCases: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $sort: { casesHandled: -1 } },
      { $limit: 5 },
    ]);

    const data = rows.map((row) => {
      const name = row.user?.fullName || 'Unassigned';
      return {
        name,
        initials: initialsFor(name),
        casesHandled: row.casesHandled,
        closedRate: Math.round(percent(row.closedCases, row.casesHandled)),
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAmountAtRisk = async (req, res) => {
  try {
    const match = await buildCaseMatch(req.query);
    const rows = await getCaseTrendRows(match, { amount: { $sum: '$amountAtRisk' } });
    const data = rows.map((row) => ({
      date: new Date(row._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: row.amount,
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
