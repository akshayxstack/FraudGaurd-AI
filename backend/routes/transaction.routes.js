import { Router } from 'express';
import { getTransactionDetails } from '../controllers/transaction.controller.js';

const router = Router();

router.get('/:id', getTransactionDetails);

export default router;
