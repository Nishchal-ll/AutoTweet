export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1", // Hugging Face Router
  apiKey: process.env.HF_TOKEN,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [{ role: "user", content: "Hello" }];

    const completion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3.2:novita", // exact model ID
      messages,
    });

    const aiText = completion.choices[0]?.message?.content || "AI did not return any text";

    return NextResponse.json({ aiText });
  } catch (error: any) {
    console.error("AI generation failed:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
