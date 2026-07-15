import Case from '../../models/Case.js';
import Transaction from '../../models/Transaction.js';

export const getDashboardStats = async () => {
  try {
    const stats = await Case.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalCases: { $sum: 1 },
          activeCases: { $sum: { $cond: [{ $in: ['$status', ['Open', 'In Progress', 'Under Review']] }, 1, 0] } },
          closedCases: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } },
          highRiskCases: { $sum: { $cond: [{ $eq: ['$riskLevel', 'High'] }, 1, 0] } },
          criticalCases: { $sum: { $cond: [{ $eq: ['$riskLevel', 'Critical'] }, 1, 0] } },
          amountAtRisk: { $sum: '$amountAtRisk' },
          totalTransactions: { $sum: '$transactionCount' },
          avgRiskScore: { $avg: '$riskScore' },
        }
      }
    ]);

    const result = stats[0] || {
      totalCases: 0,
      activeCases: 0,
      closedCases: 0,
      highRiskCases: 0,
      criticalCases: 0,
      amountAtRisk: 0,
      totalTransactions: 0,
      avgRiskScore: 0,
    };

    const [transactionStats, recentCases, recentAlerts] = await Promise.all([
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            fraudulentTransactions: { $sum: { $cond: ['$isFraud', 1, 0] } },
            anomalousTransactions: {
              $sum: {
                $cond: [
                  { $or: ['$isFraud', { $in: ['$riskLevel', ['High', 'Critical']] }] },
                  1,
                  0
                ]
              }
            },
          }
        }
      ]),
      Case.find({ isDeleted: false })
        .populate('uploadedBy', 'fullName email role')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Transaction.find({ isFraud: true })
        .populate('case', 'caseId')
        .sort({ date: -1 })
        .limit(5)
        .lean(),
    ]);

    const transactionResult = transactionStats[0] || {
      fraudulentTransactions: 0,
      anomalousTransactions: 0,
    };

    return {
      ...result,
      averageRiskScore: Math.round(result.avgRiskScore || 0),
      fraudulentTransactions: transactionResult.fraudulentTransactions,
      anomalousTransactions: transactionResult.anomalousTransactions,
      recentCases,
      recentAlerts
    };
  } catch (error) {
    throw new Error(`Failed to generate dashboard stats: ${error.message}`);
  }
};

export const getRiskTrends = async (interval = 'monthly') => {
  try {
    let dateFormat;
    if (interval === 'daily') dateFormat = "%Y-%m-%d";
    else if (interval === 'weekly') dateFormat = "%Y-%U"; // Year and week
    else dateFormat = "%Y-%m"; // Monthly default

    const trends = await Case.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          cases: { $sum: 1 },
          amountAtRisk: { $sum: '$amountAtRisk' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    return trends;
  } catch (error) {
    throw new Error(`Failed to get risk trends: ${error.message}`);
  }
};

export const getRiskDistribution = async () => {
  try {
    const distribution = await Case.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    distribution.forEach(d => {
      if (result[d._id] !== undefined) {
        result[d._id] = d.count;
      }
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to get risk distribution: ${error.message}`);
  }
};
