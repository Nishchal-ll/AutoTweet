// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { TwitterApi } from "twitter-api-v2";

// const twitterClient = new TwitterApi({
//   appKey: process.env.TWITTER_CONSUMER_KEY!,
//   appSecret: process.env.TWITTER_CONSUMER_SECRET!,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN!,
//   accessSecret: process.env.TWITTER_ACCESS_SECRET!,
// });

// export async function GET() {
//  const posts = await prisma.tweet.findMany({
//   where: {
//     status: "SCHEDULED",
//     scheduledAt: { lte: new Date() },
//   },
// });

//   for (const post of posts) {
//     try {
//   await prisma.tweet.update({
//   where: { id: post.id },
//   data: { status: "POSTED" },
// });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   return NextResponse.json({ status: "done" });
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TwitterApi } from "twitter-api-v2";

// This route will be triggered by a cron job (once per day)
export async function GET() {
  try {
    // Fetch scheduled tweets that should go out now
    const scheduledTweets = await prisma.tweet.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: new Date() },
      },
      include: {
        user: {
          select: {
            id:true,
            accounts: {
              where: { provider: "twitter" },
              select: { access_token: true },
            },
          },
        },
      },
    });

    for (const tweet of scheduledTweets) {
      const twitterToken = tweet.user.accounts[0]?.access_token;

      if (!twitterToken) {
        console.warn(`No Twitter token found for user ${tweet.user.id}, skipping tweet ${tweet.id}`);
        continue;
      }

      try {
        const twitterClient = new TwitterApi(twitterToken);
        await twitterClient.v2.tweet(tweet.content);

        // Mark as posted
        await prisma.tweet.update({
          where: { id: tweet.id },
          data: { status: "POSTED" },
        });
      } catch (err) {
        console.error(`Failed to post tweet ${tweet.id}:`, err);
        // Optional: mark as FAILED or keep as SCHEDULED for retry
      }
    }

    return NextResponse.json({ status: "done", count: scheduledTweets.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
