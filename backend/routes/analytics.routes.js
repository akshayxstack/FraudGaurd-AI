import { Router } from 'express';
import { 
  getSummary,
  getCasesOverTime,
  getCasesByStatus,
  getCasesByRisk,
  getCasesByType,
  getTopInvestigators,
  getAmountAtRisk
} from '../controllers/analytics.controller.js';

const router = Router();

router.get('/summary', getSummary);
router.get('/cases-over-time', getCasesOverTime);
router.get('/cases-by-status', getCasesByStatus);
router.get('/cases-by-risk', getCasesByRisk);
router.get('/cases-by-type', getCasesByType);
router.get('/top-investigators', getTopInvestigators);
router.get('/amount-at-risk', getAmountAtRisk);

export default router;
