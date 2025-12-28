// "use client";

// export default function Home() {
//   const handlePost = async () => {
//     const res = await fetch("/api/post", { method: "POST" });
//     const data = await res.json();
//     alert(data.message);
//   };

//   return (
//     <div>
//       <h1>Post Hello World to Twitter</h1>
//       <button onClick={handlePost}>Post Tweet</button>
//     </div>
//   );
// }
"use client";

import { useState } from "react";

export default function Home() {
  const [post, setPost] = useState("");
  const [response, setResponse] = useState("");

  const handlePost = async () => {
    if (!post.trim()) return;

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: post }),
      });
      const data = await res.json();
      setResponse(data.message);
      setPost("");
    } catch (err) {
      console.error(err);
      setResponse("Failed to post.");
    }
  };

  return (
    <div>
      <h1>Post to Twitter</h1>
      <textarea
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="Write your tweet..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handlePost}>Post Tweet</button>
      <p>{response}</p>
    </div>
  );
}
