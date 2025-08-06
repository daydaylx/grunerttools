import { Message, ApiResponse } from '@/types';

class MockService {
  async sendMessage(
    messages: Message[],
    config: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<ApiResponse<any>> {
    // Einfacher Mock für die Antwort
    return {
      data: {
        choices: [{
          message: {
            content: "Dies ist eine Mock-Antwort, da wir derzeit Probleme mit der OpenRouter-Integration haben."
          }
        }]
      },
      success: true
    };
  }

  async getAvailableModels(): Promise<ApiResponse<any[]>> {
    return {
      data: [
        { id: 'mock/model-1', name: 'Mock Model 1' },
        { id: 'mock/model-2', name: 'Mock Model 2' }
      ],
      success: true
    };
  }
}

export const mockService = new MockService();
