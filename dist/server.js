import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import twilio from 'twilio';
// import routes from './routes/index.js';
const { twiml } = twilio;
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
// Define routes
// app.use('/api', routes);
// Start Express server
app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});
// Create TwiML server
http
    .createServer((_req, res) => {
    // Create TwiML response
    const voiceResponse = new twiml.VoiceResponse();
    voiceResponse.say('Hello from your pals at Twilio! Have fun.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(voiceResponse.toString());
})
    .listen(1337, '127.0.0.1');
console.log('TwiML server running at http://127.0.0.1:1337/');
