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

    // Include a dynamic check for whether this is the loopback phase
    const isLoopback = req.query.loopback === 'true';

    // Use Twilio's say() method to speak the AI's response

    voiceResponse.say(response.content); // AI's response spoken to the caller 

    // Add the follow-up question only for loopback phase
    if (isLoopback) {
      voiceResponse.say("Is there anything else I can help with?");
    }

    // Gather input for the next turn
    voiceResponse.gather({
      input: ['speech', 'dtmf'], // Accept speech and DTMF
      timeout: 10, // Timeout after 10 seconds
      speechTimeout: 'auto', // Stop listening automatically when silence is detected
      
      // **TODO: use intent from LLM  to check if the user wants to end the call instead of flag (if user intent == exit then break the recursion)**
      // **TODO: set up intent checking with LLM  to check if the user wants to end the call instead of flag (if user intent == exit then break the recursion)**
      action: '/handle-call?loopback=true', // Loop back to this endpoint and flag as loopback
    });

    // Process the intent and take action
    
    // switch (intent) {
    //   case 'schedule_appointment':
    //     await createAppointment(intent.details);
    //     res.send('Appointment scheduled.');
    //     break;
    //   default:
    //     res.send('Sorry, I did not understand that.');
    // }

    // Send the TwiML response to Twilio
    res.type('text/xml');  // Twilio expects XML
    res.send(voiceResponse.toString());  // Send the TwiML response as XML

  } catch (error) {
    console.error('Error processing the call:', error);
    res.status(500).send('An error occurred.');
  }
};
