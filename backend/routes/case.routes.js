import { Router } from 'express';
import { 
  listCases, 
  getCaseDetails, 
  updateCaseStatus, 
  appendNote, 
  removeCase, 
  getCaseTransactions,
  askAssistant
} from '../controllers/case.controller.js';

const router = Router();

router.get('/', listCases);
router.get('/:id', getCaseDetails);
router.patch('/:id/status', updateCaseStatus);
router.post('/:id/notes', appendNote);
router.post('/:id/ask', askAssistant);
router.delete('/:id', removeCase);
router.get('/:id/transactions', getCaseTransactions);

export default router;
