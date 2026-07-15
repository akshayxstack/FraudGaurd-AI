import { askAssistant as askGeminiAssistant } from '../services/gemini/gemini.service.js';
import {
  buildAssistantContext,
  getAssistantInsights,
  getRecentConversations,
  saveAssistantConversation,
} from '../services/database/assistant.service.js';

const getQuestion = (body) => String(body.question || body.query || '').trim();

const sendAssistantError = (res, error) => {
  const status = error.statusCode || 500;
  console.error('[Assistant Controller] Error:', error.message);

  res.status(status).json({
    success: false,
    error: status === 503 ? 'AI Assistant Unavailable' : 'AI Assistant Error',
    message:
      status === 503
        ? 'AI Assistant is temporarily unavailable. Please try again later.'
        : 'Failed to process AI assistant request.',
    details: error.message,
  });
};

export const askAssistant = async (req, res) => {
  try {
    const question = getQuestion(req.body);
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const context = await buildAssistantContext({
      question,
      caseId: req.body.caseId,
    });

    const answer = await askGeminiAssistant(null, [], question, { context });
    const conversation = await saveAssistantConversation({
      question,
      response: answer,
      sessionId: req.body.sessionId || 'global',
      userId: req.user?._id,
      caseContext: context.specificCaseContext,
    });

    res.status(200).json({
      success: true,
      data: {
        ...answer,
        conversationId: String(conversation._id),
        context: {
          requestedCaseId: context.specificCaseContext?.requestedCaseId || null,
          specificCaseFound: Boolean(context.specificCaseContext?.found),
        },
      },
    });
  } catch (error) {
    sendAssistantError(res, error);
  }
};

export const getAssistantSidebar = async (_req, res) => {
  try {
    const [insights, recentConversations] = await Promise.all([
      getAssistantInsights(),
      getRecentConversations(3),
    ]);

    res.status(200).json({
      success: true,
      data: {
        insights,
        recentConversations,
      },
    });
  } catch (error) {
    sendAssistantError(res, error);
  }
};

export const listRecentConversations = async (_req, res) => {
  try {
    const recentConversations = await getRecentConversations(3);
    res.status(200).json({ success: true, data: recentConversations });
  } catch (error) {
    sendAssistantError(res, error);
  }
};
