// import { Configuration, OpenAIApi } from 'openai';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// export const processSpeech = async (speechText: string): Promise<string> => {
//   const response = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: `Determine the intent of the following speech: "${speechText}"`,
//     max_tokens: 50,
//   });

//   const intent = response.data.choices[0].text.trim();
//   return intent;
// };
