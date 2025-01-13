import express from 'express';
import dotenv from 'dotenv';
import pkg from 'twilio';
import { WebSocketServer, WebSocket } from 'ws';
import base64 from 'base-64';
dotenv.config();
// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EXPRESS_PORT = process.env.EXPRESS_PORT || 5000; // API server port
const VOICE = 'alloy';
const SYSTEM_MESSAGE = `
    You are a helpful and bubbly AI assistant who loves to chat about
    anything the user is interested in and is prepared to offer them facts.
    You have a penchant for dad jokes, owl jokes, and rickrolling – subtly.
    Always stay positive, but work in a joke when appropriate.`;
if (!OPENAI_API_KEY) {
    throw new Error('Missing the OpenAI API key. Please set it in the .env file.');
}
const { twiml } = pkg;
// Create Express app
const app = express();
app.use(express.json());
// Endpoint to handle incoming voice calls
app.post('/voice', (_req, res) => {
    try {
        const voiceResponse = new twiml.VoiceResponse();
        voiceResponse.say('Please wait while we connect your call to the AI voice assistant.');
        voiceResponse.pause({ length: 1 });
        voiceResponse.say('You can start speaking now.');
        // Use Gather to collect user input
        voiceResponse.gather({
            input: ['speech', 'dtmf'], // Capture speech input
            timeout: 10, // Wait for 10 seconds of silence
            speechTimeout: 'auto', // Automatically stop listening when no speech is detected
            action: '/handle-user-response', // Endpoint to handle response after gathering input
        });
        // If no input is received, redirect to the same route to prompt again
        voiceResponse.redirect('/voice');
        // Log the TwiML response for debugging
        console.log(voiceResponse.toString());
        res.type('text/xml'); // Set the response type to XML
        res.send(voiceResponse.toString()); // Send the raw TwiML response as XML
    }
    catch (error) {
        console.error('Error handling /voice endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// WebSocket server setup
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('Client connected.');
    const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1',
        },
    });
    openaiWs.on('open', () => {
        try {
            console.log('Connected to OpenAI WebSocket');
            initializeSession(openaiWs);
        }
        catch (error) {
            console.error('Error initializing session:', error);
        }
    });
    openaiWs.on('message', (data) => {
        try {
            const response = JSON.parse(data.toString());
            handleOpenAIResponse(response, ws);
        }
        catch (error) {
            console.error('Error handling OpenAI WebSocket message:', error);
        }
    });
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.event === 'media') {
                const audioAppend = {
                    type: 'input_audio_buffer.append',
                    audio: data.media.payload,
                };
                openaiWs.send(JSON.stringify(audioAppend));
            }
        }
        catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    });
    ws.on('close', () => {
        try {
            console.log('Client disconnected.');
            if (openaiWs.readyState === WebSocket.OPEN) {
                openaiWs.close();
            }
        }
        catch (error) {
            console.error('Error closing OpenAI WebSocket:', error);
        }
    });
});
// Handle session initialization with OpenAI
async function initializeSession(openaiWs) {
    try {
        const sessionUpdate = {
            type: 'session.update',
            session: {
                turn_detection: { type: 'server_vad' },
                input_audio_format: 'g711_ulaw',
                output_audio_format: 'g711_ulaw',
                voice: VOICE,
                instructions: SYSTEM_MESSAGE,
                modalities: ['text', 'audio'],
            },
        };
        openaiWs.send(JSON.stringify(sessionUpdate));
    }
    catch (error) {
        console.error('Error initializing session:', error);
    }
}
// Handle OpenAI response
function handleOpenAIResponse(response, ws) {
    try {
        // Handle OpenAI response
        if (response.type === 'response.audio.delta' && response.delta) {
            const audioPayload = base64.decode(response.delta);
            const audioDelta = {
                event: 'media',
                media: {
                    payload: base64.encode(audioPayload),
                },
            };
            ws.send(JSON.stringify(audioDelta));
        }
    }
    catch (error) {
        console.error('Error handling OpenAI response:', error);
    }
}
// Start the Express server
app.listen(EXPRESS_PORT, () => {
    console.log(`Express server running at http://localhost:${EXPRESS_PORT}`);
});
