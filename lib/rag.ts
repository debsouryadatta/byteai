import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generatePdfChunkEmbeddings(chunks: string[]) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })

    return await Promise.all(chunks.map(async (chunk) => {
        const result = await model.embedContent(chunk);
        const embedding = result.embedding
        return embedding.values
    }))
}

export async function generateEmbedding(summary: string) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })
    const result = await model.embedContent(summary);

    const embedding = result.embedding
    return embedding.values
}