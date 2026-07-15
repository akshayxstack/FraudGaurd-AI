import Transaction from '../../models/Transaction.js';

export const createTransaction = async (transactionData) => {
  try {
    const newTransaction = await Transaction.create(transactionData);
    return newTransaction.toObject();
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

export const createTransactions = async (transactionsArray) => {
  try {
    const newTransactions = await Transaction.insertMany(transactionsArray, { lean: true });
    return newTransactions;
  } catch (error) {
    throw new Error(`Failed to batch create transactions: ${error.message}`);
  }
};

export const getTransactionsByCase = async (caseId, options = {}) => {
  try {
    const { limit = 100, skip = 0, sort = { date: -1 } } = options;
    const transactions = await Transaction.find({ case: caseId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return transactions;
  } catch (error) {
    throw new Error(`Failed to retrieve case transactions: ${error.message}`);
  }
};

export const getTransaction = async (id) => {
  try {
    const transaction = await Transaction.findById(id).populate('case', 'caseId title').lean();
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  } catch (error) {
    throw new Error(`Failed to retrieve transaction: ${error.message}`);
  }
};

export const updateTransaction = async (id, updateData) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedTransaction) throw new Error('Transaction not found');
    return updatedTransaction;
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
};

export const deleteTransaction = async (id) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id).lean();
    if (!deletedTransaction) throw new Error('Transaction not found');
    return deletedTransaction;
  } catch (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
};

export const getHighRiskTransactions = async (caseId = null) => {
  try {
    const filter = { riskLevel: { $in: ['High', 'Critical'] } };
    if (caseId) filter.case = caseId;
    
    return await Transaction.find(filter).sort({ predictionProbability: -1 }).lean();
  } catch (error) {
    throw new Error(`Failed to retrieve high risk transactions: ${error.message}`);
  }
};

export const countTransactions = async (filter = {}) => {
  try {
    return await Transaction.countDocuments(filter);
  } catch (error) {
    throw new Error(`Failed to count transactions: ${error.message}`);
  }
};

export const getFraudStatistics = async (caseId = null) => {
  try {
    const matchStage = caseId ? { $match: { case: caseId } } : { $match: {} };
    
    const stats = await Transaction.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          fraudulentCount: { $sum: { $cond: ['$isFraud', 1, 0] } },
          totalFraudAmount: { $sum: { $cond: ['$isFraud', '$amount', 0] } },
          flaggedCount: { $sum: { $cond: [{ $eq: ['$status', 'flagged'] }, 1, 0] } }
        }
      }
    ]);
    return stats[0] || { totalTransactions: 0, fraudulentCount: 0, totalFraudAmount: 0, flaggedCount: 0 };
  } catch (error) {
    throw new Error(`Failed to calculate fraud statistics: ${error.message}`);
  }
};
