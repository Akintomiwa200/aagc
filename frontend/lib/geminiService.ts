const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const geminiService = {
  async generatePrayer(topic: string): Promise<string> {
    try {
      const response = await fetch(
        `${GEMINI_API_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate a prophetic prayer about "${topic}". The prayer should be Spirit-led, biblical, and encouraging. Keep it under 200 words.`
              }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error('Failed to generate prayer');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate prayer.';
    } catch (error) {
      console.error('Prayer generation error:', error);
      return 'Error generating prayer. Please try again.';
    }
  },

  async askBibleQuestion(verse: string, question: string): Promise<string> {
    try {
      const response = await fetch(
        `${GEMINI_API_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Based on ${verse}, ${question}. Provide a biblical exegesis with scripture references. Keep it concise and Spirit-led.`
              }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error('Failed to get answer');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to answer question.';
    } catch (error) {
      console.error('Bible question error:', error);
      return 'Error processing question. Please try again.';
    }
  },

  async churchAI(query: string): Promise<string> {
    try {
      const response = await fetch(
        `${GEMINI_API_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a helpful church assistant for AAGC (Apostolic Army Global Church). Answer this question: ${query}. Be biblical, encouraging, and point people to Christ.`
              }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error('Failed to get answer');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to process request.';
    } catch (error) {
      console.error('Church AI error:', error);
      return 'Error processing request. Please try again.';
    }
  },

  getChatHistory(): ChatHistory[] {
    try {
      const saved = localStorage.getItem('bible_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveChatHistory(history: ChatHistory[]): void {
    localStorage.setItem('bible_chat_history', JSON.stringify(history.slice(0, 20)));
  },

  createNewChat(title: string): ChatHistory {
    return {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};
