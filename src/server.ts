import express from 'express';
import dotenv from 'dotenv';
import twilio from 'twilio';
// import routes from './routes/index.js';

const { twiml } = twilio;

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define routes
// app.use('/api', routes);

// TwiML endpoint
app.get('/twiml', (_req, res) => {
  const voiceResponse = new twiml.VoiceResponse();
  voiceResponse.say('Hello from your pals at Twilio! Have fun. This is some text to speech.');

  res.set('Content-Type', 'text/xml');
  res.send(voiceResponse.toString());
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
  console.log(`TwiML endpoint available at http://localhost:${port}/twiml`);
});
