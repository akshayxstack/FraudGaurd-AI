import { getTransaction } from '../services/database/transaction.service.js';

export const getTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await getTransaction(id);
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Transaction not found', error: error.message });
  }
};
