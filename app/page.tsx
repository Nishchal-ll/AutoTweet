// "use client";

// import { useState, useEffect } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";

// type TweetData = {
//   id: string;
//   content: string;
//   scheduledAt: string | null;
//   status: string;
//   createdAt: string;
// };

// export default function Dashboard() {
//   const { data: session, status } = useSession();

//   const [manualTweet, setManualTweet] = useState("");
//   const [manualSchedule, setManualSchedule] = useState("");

//   const [idea, setIdea] = useState("");
//   const [aiTweet, setAiTweet] = useState("");

//   const [aiSchedule, setAiSchedule] = useState("");

//   const [tweets, setTweets] = useState<TweetData[]>([]);
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Fetch all tweets from Prisma
//   const fetchTweets = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/tweets");
//       const data = await res.json();
//       setTweets(data.tweets || []);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (status === "authenticated") fetchTweets();
//   }, [status]);

//   if (status === "unauthenticated") {
//     return (
//       <div style={{ padding: "2rem" }}>
//         <h1>AI Tweet Generator & Dashboard</h1>
//         <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
//       </div>
//     );
//   }

//   // Manual Tweet
//   const sendManualTweet = async () => {
//     if (!manualTweet.trim()) return;

//     try {
//       const res = await fetch("/api/post", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idea: manualTweet,
//           scheduledAt: manualSchedule || null,
//           isAI: false,
//         }),
//       });
//       const data = await res.json();

//       setResponse(
//         manualSchedule && data.scheduledAt
//           ? `Tweet scheduled for ${new Date(data.scheduledAt).toLocaleString()}`
//           : data.message
//       );

//       setManualTweet("");
//       setManualSchedule("");
//       fetchTweets();
//     } catch (err) {
//       console.error(err);
//       setResponse("Something went wrong");
//     }
//   };

//   // AI Tweet
//   const sendAiTweet = async () => {
//     if (!idea.trim()) return;

//     try {
//       const res = await fetch("/api/post", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idea,
//           scheduledAt: aiSchedule || null,
//           isAI: true,
//         }),
//       });
//       const data = await res.json();

//       setResponse(
//         aiSchedule && data.scheduledAt
//           ? `AI Tweet scheduled for ${new Date(data.scheduledAt).toLocaleString()}`
//           : data.message
//       );

//       setAiTweet(data.tweetText || "");
//       setIdea("");
//       setAiSchedule("");
//       fetchTweets();
//     } catch (err) {
//       console.error(err);
//       setResponse("Something went wrong");
//     }
//   };

//   const postedTweets = tweets.filter((t) => t.status === "POSTED");
//   const upcomingTweets = tweets
//     .filter((t) => t.status === "SCHEDULED")
//     .sort(
//       (a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()
//     );

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1>AI Tweet Generator & Dashboard</h1>
//       <p>
//         Logged in as: <strong>{session?.user?.name}</strong>
//       </p>

//       {/* Manual Tweet */}
//       <div style={{ margin: "2rem 0", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
//         <h2>Write Your Own Tweet</h2>
//         <textarea
//           value={manualTweet}
//           onChange={(e) => setManualTweet(e.target.value)}
//           placeholder="Type your tweet here..."
//           rows={4}
//           style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
//         />
//         <label>Schedule time (optional)</label><br/>
//         <input
//           type="datetime-local"
//           value={manualSchedule}
//           onChange={(e) => setManualSchedule(e.target.value)}
//           style={{ padding: "0.5rem", marginBottom: "1rem" }}
//         /><br/>
//         <button onClick={sendManualTweet}>Post Now</button>
//         <button
//           onClick={sendManualTweet}
//           disabled={!manualSchedule}
//           style={{ marginLeft: "1rem" }}
//         >
//           Schedule
//         </button>
//       </div>

//       {/* AI Tweet */}
//       <div style={{ margin: "2rem 0", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
//         <h2>Generate Tweet Using AI</h2>
//         <textarea
//           value={idea}
//           onChange={(e) => setIdea(e.target.value)}
//           placeholder="Enter an idea for AI to generate a tweet..."
//           rows={3}
//           style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
//         />
//         <label>Schedule time (optional)</label><br/>
//         <input
//           type="datetime-local"
//           value={aiSchedule}
//           onChange={(e) => setAiSchedule(e.target.value)}
//           style={{ padding: "0.5rem", marginBottom: "1rem" }}
//         /><br/>
//         <button onClick={sendAiTweet}>Generate & Post Now</button>
//         <button
//           onClick={sendAiTweet}
//           disabled={!aiSchedule}
//           style={{ marginLeft: "1rem" }}
//         >
//           Schedule
//         </button>
//         {aiTweet && (
//           <div style={{ marginTop: "1rem" }}>
//             <h4>Generated Tweet</h4>
//             <p>{aiTweet}</p>
//           </div>
//         )}
//       </div>

//       {response && <p style={{ color: "green", marginBottom: "1rem" }}>{response}</p>}

//       {/* Dashboard */}
//       <div style={{ marginTop: "2rem" }}>
//         <h2>Dashboard</h2>
//         <h3>Total Posted Tweets: {postedTweets.length}</h3>
//         <h3>Upcoming Scheduled Tweets</h3>
//         {upcomingTweets.length === 0 ? (
//           <p>No upcoming tweets</p>
//         ) : (
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ borderBottom: "1px solid #ccc" }}>
//                 <th style={{ textAlign: "left", padding: "0.5rem" }}>Content</th>
//                 <th style={{ textAlign: "left", padding: "0.5rem" }}>Scheduled At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {upcomingTweets.map((tweet) => (
//                 <tr key={tweet.id} style={{ borderBottom: "1px solid #eee" }}>
//                   <td style={{ padding: "0.5rem" }}>{tweet.content}</td>
//                   <td style={{ padding: "0.5rem" }}>
//                     {new Date(tweet.scheduledAt!).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <button style={{ marginTop: "2rem" }} onClick={() => signOut({ callbackUrl: "/" })}>
//         Logout
//       </button>
//     </div>
//   );
// }



"use client";

import { useEffect, } from "react";
import { useSession ,} from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
   
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      router.push("/dashboard"); // if logged in → go to dashboard
    } else {
      router.push("/login"); // if not logged in → go to login
    }
  }, [session, status, router]);

  return <p>Welcomee</p>;
}
