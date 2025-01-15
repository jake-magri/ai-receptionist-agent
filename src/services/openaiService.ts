import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();


// Initialize OpenAI client
const openai = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY || '',
  });

// Process speech and determine intent
export const processSpeech = async (speechText: string): Promise<{ content: string; intent: string }> => {
  try {
    const response = await openai.invoke([
        { role: 'system', content: 'You are an AI Dental Receptionist. Always respond with a JSON string containing "content" (what the AI says) and "intent" (e.g., "schedule_appointment", "end_call", "clarification_needed", etc.).' },
        { role: 'user', content: speechText },
      ]);

    // Extract the content from the response
    if (typeof response.content === 'string') {
      const content = JSON.parse(response.content);
      return content;
    } else {
      throw new Error('Invalid response content type');
    }
  
    
  } catch (error) {
    console.error('Error processing speech:', error);
    throw new Error('Failed to process speech.');
  }
};
