import express from 'express';
import dotenv from 'dotenv';
import twilio from 'twilio';
import http from 'http';
dotenv.config();
// Ports for different servers
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3001; // API server port
const TWILIO_PORT = process.env.TWILIO_PORT || 3002; // Twilio voice response port
// Twilio Voice Response Handler
const { twiml } = twilio;
// ----------------------------------
// Twilio-Specific Server (Voice Response)
// ----------------------------------
http.createServer((_req, res) => {
    const voiceResponse = new twiml.VoiceResponse();
    voiceResponse.say('Hello! Welcome to the AI receptionist. How can I assist you today?');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
}).listen(TWILIO_PORT, () => {
    console.log(`TwiML server running at http://localhost:${TWILIO_PORT}`);
});
// ----------------------------------
// Express Server (API for configuration, calendar, etc.)
// ----------------------------------
const app = express();
app.use(express.json());
// Example endpoint to save configuration (e.g., type of receptionist)
app.post('/api/configure', (req, res) => {
    // Logic for saving the receptionist's configuration (e.g., service questions, type)
    const config = req.body;
    // Example: save to DB or memory
    res.send(`Configuration saved: ${JSON.stringify(config)}`);
});
// Example endpoint for Google Calendar integration (just as a placeholder)
app.post('/api/calendar/update', (_req, res) => {
    // Logic to update Google Calendar
    res.send('Google Calendar updated.');
});
// Start the Express server
app.listen(EXPRESS_PORT, () => {
    console.log(`Express API server running on port ${EXPRESS_PORT}`);
});
