import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || idea.trim() === "") {
      return NextResponse.json({ message: "Idea is empty" }, { status: 400 });
    }

    // Hugging Face AI generation
    const hfClient = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.HF_TOKEN,
    });

    const completion = await hfClient.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3.2:novita",
      messages: [
        {
          role: "user",
          content: `Create a viral tech tweet based on this idea: ${idea}. No hashtags, no exclamation marks.`,
        },
      ],
    });

    const tweetText =
      completion.choices?.[0]?.message?.content?.trim() || idea;

    // Post to Twitter
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    await twitterClient.v2.tweet(tweetText);

    return NextResponse.json({
      message: "Tweet posted successfully!",
      tweetText,
    });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: err.message || "Failed to generate or post tweet" },
      { status: 500 }
    );
  }
}
