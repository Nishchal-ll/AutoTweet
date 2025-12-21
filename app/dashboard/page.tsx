"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [postText, setPostText] = useState("");

  if (!session) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Welcome to GitHub Scheduler App</h1>
        <button onClick={() => signIn("github")}>Login with GitHub</button>
      </div>
    );
  }

  const handlePost = async () => {
    // This is a placeholder. Replace with your backend API if needed.
    try {
      await axios.post("/api/post", { text: postText });
      alert("Post sent!");
      setPostText("");
    } catch (err) {
      console.error(err);
      alert("Error sending post");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {session.user?.name}</h1>
      <button onClick={() => signOut()}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        <h2>Create a Demo Post</h2>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Type something..."
          style={{ width: "300px", height: "100px" }}
        />
        <br />
        <button onClick={handlePost}>Send Post</button>
      </div>
    </div>
  );
}
