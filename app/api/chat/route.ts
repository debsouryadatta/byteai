import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("Messages on route.ts:", messages);
  

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages,
    onFinish: () => {
      console.log('Chat finished');
    }
  });

  return result.toDataStreamResponse();
}