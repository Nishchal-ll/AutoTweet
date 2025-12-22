import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  // 1. Check session (authentication)
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2. Read data sent from client
  const body = await req.json();

  // 3. Simulate saving post
  const post = {
    id: Date.now(),
    text: body.text,
    user: session.user?.name,
  };

  // 4. Send response
  return NextResponse.json({
    message: "Post created successfully",
    post,
  });
}
