import { Router } from 'express';
import { getDashboardSummary, getTrends, getDistribution } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', getDashboardSummary);
router.get('/trends', getTrends);
router.get('/risk-distribution', getDistribution);

export default router;
