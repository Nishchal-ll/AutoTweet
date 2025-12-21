import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  // Replace with actual Bearer token or use OAuth token from user session
  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

  try {
    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      { text },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}
