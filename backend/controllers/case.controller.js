import { 
  getAllCases, 
  getCaseById, 
  deleteCase, 
  addCaseNote,
  countCases
} from '../services/database/case.service.js';
import { getTransactionsByCase } from '../services/database/transaction.service.js';
import { askAssistant as askGeminiAssistant } from '../services/gemini/gemini.service.js';
import {
  buildAssistantContext,
  saveAssistantConversation,
} from '../services/database/assistant.service.js';
import User from '../models/User.js';
import Case from '../models/Case.js';

export const listCases = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, riskLevel, search, assignedTo, dateRange } = req.query;
    
    const filter = {};
    if (status && status !== 'All' && status !== 'All Cases') filter.status = status;
    if (riskLevel && riskLevel !== 'All') filter.riskLevel = riskLevel;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caseId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Assigned To filter (must match uploadedBy's fullName)
    if (assignedTo && assignedTo !== 'All') {
      const user = await User.findOne({ fullName: { $regex: assignedTo, $options: 'i' } });
      if (user) {
        filter.uploadedBy = user._id;
      } else {
        filter.uploadedBy = null;
      }
    }

    // Date Range filter
    if (dateRange && dateRange !== 'All Time') {
      const now = new Date();
      if (dateRange === 'Last 7 Days') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        filter.createdAt = { $gte: sevenDaysAgo };
      } else if (dateRange === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        filter.createdAt = { $gte: thirtyDaysAgo };
      }
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    
    const total = await countCases(filter);
    const cases = await getAllCases(filter, { limit: parseInt(limit, 10), skip });
    
    res.status(200).json({ 
      success: true, 
      data: {
        cases,
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cases', error: error.message });
  }
};

export const getCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const caseDetails = await getCaseById(id);
    const transactions = await getTransactionsByCase(id, { limit: 100 }); // default fetch 100 for case view
    
    res.status(200).json({ 
      success: true, 
      data: { 
        ...caseDetails,
        transactions 
      } 
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Case not found', error: error.message });
  }
};

export const updateCaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // In a real scenario we'd use a generic updateCase, but we can reuse updateProcessingStatus or import updateCase
    const { updateCase } = await import('../services/database/case.service.js');
    const updatedCase = await updateCase(id, { status });
    
    res.status(200).json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

export const appendNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const updatedCase = await addCaseNote(id, text, req.user?._id);
    res.status(200).json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add note', error: error.message });
  }
};

export const removeCase = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCase(id);
    res.status(200).json({ success: true, data: null, message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete case', error: error.message });
  }
};

export const getCaseTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const transactions = await getTransactionsByCase(id, { skip, limit: parseInt(limit) });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve transactions', error: error.message });
  }
};

export const askAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const context = await buildAssistantContext({ question, caseId: id });
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
          requestedCaseId: context.specificCaseContext?.requestedCaseId || id,
          specificCaseFound: Boolean(context.specificCaseContext?.found),
        },
      },
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      success: false,
      error: status === 503 ? 'AI Assistant Unavailable' : 'AI Assistant Error',
      message:
        status === 503
          ? 'AI Assistant is temporarily unavailable. Please try again later.'
          : 'Failed to process AI request',
      details: error.message,
    });
  }
};
