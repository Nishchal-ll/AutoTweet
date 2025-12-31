// "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function PostPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [idea, setIdea] = useState("");
//   const [aiTweet, setAiTweet] = useState("");
//   const [scheduledAt, setScheduledAt] = useState("");
//   const [response, setResponse] = useState("");

//   if (!session) {
//     router.push("/login");
//     return <p>Redirecting...</p>;
//   }

//   const sendTweet = async (isAI: boolean) => {
//     if (!idea.trim()) return;

//     try {
//       const res = await fetch("/api/post", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idea,
//           scheduledAt: scheduledAt || null,
//           isAI,
//         }),
//       });
//       const data = await res.json();
//       setResponse(
//         scheduledAt && data.scheduledAt
//           ? `Tweet scheduled for ${new Date(data.scheduledAt).toLocaleString()}`
//           : data.message
//       );
//       setAiTweet(data.tweetText || "");
//       setIdea("");
//       setScheduledAt("");
//     } catch (err) {
//       console.error(err);
//       setResponse("Something went wrong");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Create a Tweet</h1>
//       <p>Logged in as: <strong>{session.user?.name}</strong></p>

//       <textarea
//         value={idea}
//         onChange={(e) => setIdea(e.target.value)}
//         placeholder="Enter your idea..."
//         rows={4}
//         style={{ width: "100%", marginBottom: "1rem" }}
//       />
//       <label>Schedule time (optional)</label><br/>
//       <input
//         type="datetime-local"
//         value={scheduledAt}
//         onChange={(e) => setScheduledAt(e.target.value)}
//         style={{ marginBottom: "1rem", padding: "0.5rem" }}
//       /><br/>

//       <button onClick={() => sendTweet(false)}>Post Now</button>
//       <button onClick={() => sendTweet(true)} style={{ marginLeft: "1rem" }}>
//         Generate AI & Post
//       </button>

//       {aiTweet && (
//         <div style={{ marginTop: "1rem" }}>
//           <h4>Generated Tweet</h4>
//           <p>{aiTweet}</p>
//         </div>
//       )}

//       {response && <p style={{ color: "green", marginTop: "1rem" }}>{response}</p>}

//       <button onClick={() => router.push("/dashboard")} style={{ marginTop: "2rem" }}>
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [aiTweet, setAiTweet] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [response, setResponse] = useState("");
  const [activeNav, setActiveNav] = useState("create");
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    router.push("/login");
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Redirecting...</p>
      </div>
    );
  }

  const sendTweet = async (isAI: boolean) => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setResponse("");
    setAiTweet("");

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          scheduledAt: scheduledAt || null,
          isAI,
        }),
      });
      const data = await res.json();
      setResponse(
        scheduledAt && data.scheduledAt
          ? `Tweet scheduled for ${new Date(data.scheduledAt).toLocaleString()}`
          : data.message
      );
      setAiTweet(data.tweetText || "");
      setIdea("");
      setScheduledAt("");
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const characterCount = idea.length;
  const maxChars = 280;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-gray-800 bg-black/50 backdrop-blur-xl z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-500 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            <span className="text-xl font-bold">Tweet Poster</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveNav("dashboard");
              router.push("/dashboard");
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeNav === "dashboard"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-900 hover:text-white"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveNav("create")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeNav === "create"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-900 hover:text-white"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Create Post</span>
          </button>

        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">All systems operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-gray-800 backdrop-blur-xl bg-black/50">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Create Post</h1>
              <p className="text-gray-400 text-sm mt-1">Craft your next tweet</p>
            </div>

            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-full border border-gray-800">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium max-w-32 truncate">{session?.user?.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-sm font-medium transition-all duration-200 border border-red-500/20 hover:border-red-500/40 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative p-8 max-w-4xl mx-auto">
          {/* Tweet Composer */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-6 animate-fade-in-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="What's happening?"
                  rows={6}
                  className="w-full bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none resize-none"
                  maxLength={maxChars}
                />
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-400">AI-powered generation available</span>
                  </div>
                  <div className={`text-sm font-medium ${characterCount > maxChars * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                    {characterCount} / {maxChars}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule for later (optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => sendTweet(false)}
                disabled={!idea.trim() || isLoading}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {scheduledAt ? 'Schedule Tweet' : 'Post Now'}
                  </>
                )}
              </button>

              <button
                onClick={() => sendTweet(true)}
                disabled={!idea.trim() || isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate AI & Post
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Generated Tweet Preview */}
          {aiTweet && (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 mb-6 animate-fade-in-up">
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">AI Generated Tweet</h3>
                  <p className="text-sm text-purple-300">Your idea has been transformed</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20">
                <p className="text-white leading-relaxed">{aiTweet}</p>
              </div>
            </div>
          )}

          {/* Response Message */}
          {response && (
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-6 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Success!</h3>
                  <p className="text-green-300">{response}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-1">Be Authentic</h4>
              <p className="text-sm text-gray-400">Share your genuine thoughts and ideas</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-1">Perfect Timing</h4>
              <p className="text-sm text-gray-400">Schedule posts for maximum engagement</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-1">AI Enhancement</h4>
              <p className="text-sm text-gray-400">Let AI refine your message perfectly</p>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}