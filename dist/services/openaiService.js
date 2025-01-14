import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';
dotenv.config();
// Initialize OpenAI client
const openai = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY || '',
});
// Process speech and determine intent
export const processSpeech = async (speechText) => {
    try {
        const response = await openai.invoke([
            { role: 'system', content: 'You are an AI Dental Receptionist.' },
            { role: 'user', content: speechText },
        ]);
        // Extract the content from the response
        const content = response.content.toString() || "I'm sorry, can you please clarify?";
        return content;
    }
    catch (error) {
        console.error('Error processing speech:', error);
        throw new Error('Failed to process speech.');
    }
};
