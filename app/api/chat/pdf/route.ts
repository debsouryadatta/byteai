import { PDF_CHAT_PROMPT } from '@/lib/constants';
import { db } from '@/lib/db';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// Add at the top of your API route file
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let { messages, pdfId } = await req.json();

  messages = messages.slice(1);
  if (messages.length > 50) {
    // last 50 messages only
    messages = messages.slice(-50);
  }

  // get pdf content
  const pdfContent = await db.pdf.findUnique({
    where: { id: pdfId },
    select: { pdfContent: true }
  })
  
  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: [
        {
            role: "system",
            content: PDF_CHAT_PROMPT
        },
        {
            role: "user",
            content: pdfContent?.pdfContent as string
        },
        ...messages
    ],
    onFinish: async () => {
      console.log('Chat finished');
    }
  });

  return result.toDataStreamResponse();
}
