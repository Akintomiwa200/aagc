import { GoogleGenAI } from "@google/genai";
import { generateImage } from './imageAiService';

const CHRISTIAN_CONTEXT_INSTRUCTION = `
You are a dedicated AI assistant for the 'Apostolic Army Global' church application. 
CRITICAL RULE: You must ONLY answer questions related to Christianity, the Bible, God, Jesus, Church life, theology, prayer, and spiritual growth.
If a user asks about anything unrelated (e.g., math, coding, general news, celebrity gossip, recipes not related to fasting), you must politely decline, stating that you are designed only to assist with spiritual and church-related matters in the Apostolic Army Global community.
Tone: Compassionate, biblical, encouraging, prophetic, and wisdom-filled.
`;

/**
 * Generates an uplifting prayer using gemini-3-flash-preview.
 */
export const generatePrayer = async (topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
      ${CHRISTIAN_CONTEXT_INSTRUCTION}
      Task: Write an uplifting Christian prayer about: ${topic}. Make it natural, specific, and spiritually rich.`,
    });
    return response.text || "Could not generate prayer.";
  } catch (error) {
    console.error("Error generating prayer:", error);
    return "Sorry, I am unable to generate a prayer at this moment. Please check your connection.";
  }
};

/**
 * Answers Bible study questions using gemini-3-flash-preview.
 */
export const askBibleAi = async (question: string, context: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
      ${CHRISTIAN_CONTEXT_INSTRUCTION}
      Role: You are a helpful and knowledgeable Bible study assistant.
      Context: The user is reading the following scripture: "${context}".
      Question: ${question}
      
      Provide an encouraging and biblically accurate answer with enough depth to be helpful.`,
    });
    return response.text || "I couldn't find an answer to that.";
  } catch (error) {
    console.error("Error asking Bible AI:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

/**
 * General church assistant chat using gemini-3-flash-preview.
 */
export const askChurchAi = async (message: string, history: string = ""): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        ${CHRISTIAN_CONTEXT_INSTRUCTION}
        Previous Conversation Context: ${history}
        User Message: ${message}
        
        Answer helpfully and clearly. Provide info about service times (Sun 9am), location, or general spiritual guidance when relevant.`,
    });
    return response.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Error asking Church AI:", error);
    return "I'm currently offline. Please try again later.";
  }
};

/**
 * Generates artistic church-related images via external image AI service.
 */
export const generateChurchImage = async (prompt: string): Promise<string | null> => {
  return generateImage(prompt);
};
