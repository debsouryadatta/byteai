import { PDF_CHAT_PROMPT } from "@/lib/constants";
import { db } from "@/lib/db";
import { generateEmbedding } from "@/lib/rag";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  let { messages, pdfId } = await req.json();

  messages = messages.slice(1);
  if (messages.length > 50) {
    // last 50 messages only
    messages = messages.slice(-50);
  }

  // vector search
  const lastMessage = messages[messages.length - 1];
  const queryVector = await generateEmbedding(lastMessage.content);
  const vectorQuery = `[${queryVector.join(",")}]`;
  const result = (await db.$queryRaw`
        SELECT "content",
        1 - ("embedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "PdfContentEmbedding"
        WHERE 1 - ("embedding" <=> ${vectorQuery}::vector) > .2
        AND "pdfId" = ${pdfId}
        ORDER BY similarity DESC 
        LIMIT 10
     `) as { content: string }[];

     console.log("Result:", result);

    return NextResponse.json({"done": true});
     
}
