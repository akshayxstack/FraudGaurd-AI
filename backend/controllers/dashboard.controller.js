import { 
  getDashboardStats, 
  getRiskTrends, 
  getRiskDistribution 
} from '../services/database/analytics.service.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

export const getTrends = async (req, res) => {
  try {
    const { interval } = req.query; // 'daily', 'weekly', 'monthly'
    const trends = await getRiskTrends(interval);
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trends', error: error.message });
  }
};

export const getDistribution = async (req, res) => {
  try {
    const distribution = await getRiskDistribution();
    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch risk distribution', error: error.message });
  }
};
