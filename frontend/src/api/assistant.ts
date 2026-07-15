import { apiClient } from './client';

export interface AskAssistantRequest {
  query: string;
  caseId?: string;
  sessionId?: string;
}

export interface AskAssistantResponse {
  answer: string;
  relatedTransactions?: string[];
  suggestedNextSteps?: string[];
  conversationId?: string;
  context?: {
    requestedCaseId: string | null;
    specificCaseFound: boolean;
  };
}

export interface AssistantConversation {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  caseId?: string;
  relatedTransactions: string[];
  timestamp: string;
}

export interface AssistantSidebarData {
  insights: {
    windowLabel: string;
    highRiskCases: number;
    anomalousTransactions: number;
    queriesAnswered: number;
  };
  recentConversations: AssistantConversation[];
}

export const assistantAPI = {
  askQuestion: async (query: string, options?: Omit<AskAssistantRequest, 'query'>): Promise<AskAssistantResponse> => {
    const rawData = await apiClient.post<any>('/assistant/ask', {
      question: query,
      caseId: options?.caseId,
      sessionId: options?.sessionId,
    });
    return {
      answer: rawData.answer,
      relatedTransactions: rawData.relatedTransactions || [],
      suggestedNextSteps: rawData.suggestedNextSteps || [],
      conversationId: rawData.conversationId,
      context: rawData.context,
    };
  },

  getSidebarData: async (): Promise<AssistantSidebarData> => {
    return apiClient.get<any>('/assistant/sidebar');
  },
};
