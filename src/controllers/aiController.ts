// import { Request, Response } from 'express';
// import { processSpeech } from '../services/openaiService.js';
// import { createAppointment } from '../services/googleCalendarService.js';

// export const handleCall = async (req: Request, res: Response) => {
//   const { SpeechResult } = req.body;

//   try {
//     const intent = await processSpeech(SpeechResult);

//     switch (intent) {
//       case 'schedule_appointment':
//         await createAppointment(intent.details);
//         res.send('Appointment scheduled.');
//         break;
//       default:
//         res.send('Sorry, I did not understand that.');
//     }
//   } catch (error) {
//     res.status(500).send('An error occurred.');
//   }
// };
