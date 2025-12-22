"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [postText, setPostText] = useState(""); // Text for posting
  const [aiPrompt, setAiPrompt] = useState(""); // User input for AI generation
  const [message, setMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  if (!session) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Welcome to Automatic Posting</h1>
        <button onClick={() => signIn("github")}>Login with GitHub</button>
      </div>
    );
  }

  // Handle manual post
  async function handlePost() {
    if (!postText.trim()) {
      setMessage("Cannot post empty text");
      return;
    }

    try {
      const res = await axios.post("/api/posts", { text: postText });
      setMessage(`Posted: "${res.data.post.text}" by ${res.data.post.user}`);
      setPostText(""); // Clear after posting
      setAiPrompt(""); // Optional: clear AI prompt
    } catch {
      setMessage("Error posting data");
    }
  }

  // Handle AI generation
  async function generateAI(inputContent: string) {
    if (!inputContent.trim()) {
      setMessage("Please enter a prompt for AI generation");
      return;
    }

    setLoadingAI(true);
    setMessage("");
    try {
      const res = await axios.post("/api/ai-posts", {
        messages: [{ role: "user", content: inputContent }],
      });

      const generated = res.data.aiText || "";
      setPostText(generated); // Show generated text in textarea
      setMessage("AI post generated! You can edit or post it.");
    } catch (error) {
      console.error(error);
      setMessage("AI generation failed");
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {session.user?.name}</h1>
      <button onClick={() => signOut()}>Logout</button>

      <hr />

      <h2>Create Post</h2>

      {/* AI Prompt Input */}
      <textarea
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        placeholder="Type a prompt for AI generation..."
        style={{ width: "300px", height: "60px", marginBottom: "10px" }}
      />

      <br />
      <button
        onClick={() => generateAI(aiPrompt)}
        disabled={loadingAI}
        style={{ marginBottom: "20px" }}
      >
        {loadingAI ? "Generating..." : "Generate AI Post"}
      </button>

      <hr />

      {/* Post Textarea */}
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Your post will appear here..."
        style={{ width: "300px", height: "100px" }}
      />

      <br />
      <button onClick={handlePost} disabled={!postText.trim()}>
        Post
      </button>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
