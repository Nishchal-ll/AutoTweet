"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState(""); // User input idea
  const [response, setResponse] = useState(""); // Feedback
  const [generated, setGenerated] = useState(""); // Generated tweet

  const handleGenerateAndPost = async () => {
    if (!idea.trim()) return;

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (data.tweetText) setGenerated(data.tweetText);
      setResponse(data.message || "Tweet posted successfully!");
      setIdea("");
    } catch (err) {
      console.error(err);
      setResponse("Failed to generate or post tweet.");
    }
  };

  return (
    <div>
      <h1>AI Tweet Generator</h1>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Enter your idea or topic..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleGenerateAndPost}>Generate & Post</button>

      {generated && (
        <div>
          <h3>Generated Tweet:</h3>
          <p>{generated}</p>
        </div>
      )}

      <p>{response}</p>
    </div>
  );
}
