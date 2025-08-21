import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of 3 open-ended, engaging questions suitable for an anonymous social messaging platform (like quooouh.me). Format the output as a single string, with each question separated by ||. The output should only be this single string, without any extra text, labels, or explanations. Each question should encourage conversation, be casual, and safe for general audiences.";

        const model = google('gemini-2.0-flash');

        const result = streamText({
            model: model,
            prompt: prompt,
        });
        
        return result.toTextStreamResponse();
    } catch (error) {
        console.error("An unexpected error occurred: ", error);
        throw error;
    }
}``