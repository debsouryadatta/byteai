import OpenAI from "openai";
import { PAGE_SUMMARY_PROMPT } from "./constants";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generatePageSummary = async(pageContent: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash-exp",
            // max_tokens: 5000,
            messages: [
                { role: "system", content: PAGE_SUMMARY_PROMPT },
                {
                    role: "user",
                    content: pageContent || "NO_CONTENT",
                },
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}

