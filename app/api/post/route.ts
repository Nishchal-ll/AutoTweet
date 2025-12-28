// import { NextResponse } from "next/server";
// import { TwitterApi } from "twitter-api-v2";

// export async function POST() {
//   try {
//     // Initialize Twitter client with your credentials
//     const client = new TwitterApi({
//       appKey: process.env.TWITTER_CONSUMER_KEY!,
//       appSecret: process.env.TWITTER_CONSUMER_SECRET!,
//       accessToken: process.env.TWITTER_ACCESS_TOKEN!,
//       accessSecret: process.env.TWITTER_ACCESS_SECRET!,
//     });

//     // Post "Hello World"
//     const tweet = await client.v2.tweet("Hello World from Next.js!");

//     return NextResponse.json({
//       message: "Tweet posted successfully!",
//       tweet,
//     });
//   } catch (err: any) {
//     console.error("Error posting tweet:", err);
//     return NextResponse.json(
//       { message: err.message || "Error posting tweet" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ message: "Text is empty" }, { status: 400 });
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    const tweet = await client.v2.tweet(text);

    return NextResponse.json({
      message: "Tweet posted successfully!",
      tweet,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Error posting tweet" },
      { status: 500 }
    );
  }
}
