import { SITE_CHAT_PROMPT } from '@/lib/constants';
import { db } from '@/lib/db';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  let { messages, websiteId } = await req.json();

  messages = messages.slice(1);
  if (messages.length > 50) {
    // last 50 messages only
    messages = messages.slice(-50);
  }

  // get page content
  const pageContent = await db.website.findUnique({
    where: { id: websiteId },
    select: { pageContent: true }
  })
  
  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: [
        {
            role: "system",
            content: SITE_CHAT_PROMPT
        },
        {
            role: "user",
            content: pageContent?.pageContent as string
        },
        ...messages
    ],
    onFinish: async (  ) => {
      console.log('Chat finished');
    }
  });

  return result.toDataStreamResponse();
}