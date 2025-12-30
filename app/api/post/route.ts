import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { idea, scheduledAt, isAI } = await req.json();

    if (!idea || idea.trim() === "") {
      return NextResponse.json({ message: "Content is empty" }, { status: 400 });
    }

    const scheduleTime =
      scheduledAt && new Date(scheduledAt) > new Date() ? new Date(scheduledAt) : null;

    let tweetText = idea;

    if (isAI) {
      // Generate AI tweet
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

      tweetText = completion.choices?.[0]?.message?.content?.trim() || idea;
    }

    // Save to DB
    const tweet = await prisma.tweet.create({
      data: {
        content: tweetText,
        userId,
        status: scheduleTime ? "SCHEDULED" : "DRAFT",
        scheduledAt: scheduleTime,
      },
    });

    // If scheduled → just return
    if (scheduleTime) {
      return NextResponse.json({
        message: "Tweet scheduled successfully",
        tweetText,
        scheduledAt: scheduleTime,
        tweetId: tweet.id,
      });
    }

    // Post immediately
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    await twitterClient.v2.tweet(tweetText);

    // Update status
    await prisma.tweet.update({
      where: { id: tweet.id },
      data: { status: "POSTED" },
    });

    return NextResponse.json({
      message: "Tweet posted successfully!",
      tweetText,
      tweetId: tweet.id,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
