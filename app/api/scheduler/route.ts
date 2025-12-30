import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY!,
  appSecret: process.env.TWITTER_CONSUMER_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function GET() {
 const posts = await prisma.tweet.findMany({
  where: {
    status: "SCHEDULED",
    scheduledAt: { lte: new Date() },
  },
});

  for (const post of posts) {
    try {
  await prisma.tweet.update({
  where: { id: post.id },
  data: { status: "POSTED" },
});
    } catch (err) {
      console.error(err);
    }
  }

  return NextResponse.json({ status: "done" });
}
