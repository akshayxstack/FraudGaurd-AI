import { Router } from 'express';
import {
  askAssistant,
  getAssistantSidebar,
  listRecentConversations,
} from '../controllers/assistant.controller.js';

const router = Router();

router.post('/ask', askAssistant);
router.get('/sidebar', getAssistantSidebar);
router.get('/conversations', listRecentConversations);

export default router;
