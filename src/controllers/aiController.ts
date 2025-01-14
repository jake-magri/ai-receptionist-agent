import { Request, Response } from 'express';
import { processSpeech } from '../services/openaiService.js';
// import { createAppointment } from '../services/googleCalendarService.js';
import pkg from 'twilio';

const { twiml } = pkg;


export const handleCall = async (req: Request, res: Response) => {
  const speechResult = req.body.SpeechResult;
  console.log('Speech Result:', speechResult);
  try {
    const response = await processSpeech(speechResult);
    console.log('OpenAI Response:', JSON.stringify(response));


    // Create a TwiML voice response
    const voiceResponse = new twiml.VoiceResponse();

    // Use Twilio's say() method to speak the AI's response ** TODO: Drill into response object to get string. **

    voiceResponse.say(response); // AI's response spoken to the caller 

    // Optionally add more interactions after the AI response
    voiceResponse.say("Is there anything else I can help with?");

    // Send the TwiML response to Twilio
    res.type('text/xml');  // Twilio expects XML
    res.send(voiceResponse.toString());  // Send the TwiML response as XML

    // switch (intent) {
    //   case 'schedule_appointment':
    //     await createAppointment(intent.details);
    //     res.send('Appointment scheduled.');
    //     break;
    //   default:
    //     res.send('Sorry, I did not understand that.');
    // }
  } catch (error) {
    console.error('Error processing the call:', error);
    res.status(500).send('An error occurred.');
  }
};
