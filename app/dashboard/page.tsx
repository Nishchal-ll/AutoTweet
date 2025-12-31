// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";

// type TweetData = {
//   id: string;
//   content: string;
//   scheduledAt: string | null;
//   status: string;
//   createdAt: string;
// };

// export default function DashboardPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [tweets, setTweets] = useState<TweetData[]>([]);
//   const [loading, setLoading] = useState(true);

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
//     router.push("/login");
//     return <p>Redirecting...</p>;
//   }

//   const postedTweets = tweets.filter((t) => t.status === "POSTED");
//   const upcomingTweets = tweets
//     .filter((t) => t.status === "SCHEDULED")
//     .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1>Dashboard</h1>
//       <p>Welcome, <strong>{session?.user?.name}</strong></p>
//       <button
//         style={{ marginBottom: "1rem" }}
//         onClick={() => router.push("/post")}
//       >
//         Create Post
//       </button>

//       <h2>Total Posted Tweets: {postedTweets.length}</h2>
//       <h2>Upcoming Scheduled Tweets</h2>
//       {loading ? (
//         <p>Loading tweets...</p>
//       ) : upcomingTweets.length === 0 ? (
//         <p>No upcoming tweets</p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ borderBottom: "1px solid #ccc" }}>
//               <th style={{ textAlign: "left", padding: "0.5rem" }}>Content</th>
//               <th style={{ textAlign: "left", padding: "0.5rem" }}>Scheduled At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {upcomingTweets.map((tweet) => (
//               <tr key={tweet.id} style={{ borderBottom: "1px solid #eee" }}>
//                 <td style={{ padding: "0.5rem" }}>{tweet.content}</td>
//                 <td style={{ padding: "0.5rem" }}>{new Date(tweet.scheduledAt!).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <button style={{ marginTop: "2rem" }} onClick={() => signOut({ callbackUrl: "/login" })}>
//         Logout
//       </button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type TweetData = {
  id: string;
  content: string;
  scheduledAt: string | null;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tweets");
      const data = await res.json();
      setTweets(data.tweets || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchTweets();
  }, [status]);

  if (status === "unauthenticated") {
    router.push("/login");
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Redirecting...</p>
      </div>
    );
  }

  if (!mounted) return null;

  const postedTweets = tweets.filter((t) => t.status === "POSTED");
  const upcomingTweets = tweets
    .filter((t) => t.status === "SCHEDULED")
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());

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
            onClick={() => setActiveNav("dashboard")}
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
            onClick={() => {
              setActiveNav("create");
              router.push("/post");
            }}
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
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back, {session?.user?.name}</p>
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
        <main className="relative p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Tweets */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-bold mb-1">{postedTweets.length}</h3>
              <p className="text-gray-400 text-sm">Total Posted</p>
            </div>

            {/* Scheduled Tweets */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-bold mb-1">{upcomingTweets.length}</h3>
              <p className="text-gray-400 text-sm">Scheduled</p>
            </div>

            {/* Quick Action */}
            <button
              onClick={() => router.push("/post")}
              className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 animate-fade-in-up group"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex flex-col items-start justify-between h-full">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-1">Create</h3>
                  <p className="text-sm opacity-90">New Post</p>
                </div>
              </div>
            </button>
          </div>

          {/* Upcoming Tweets Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Scheduled Tweets
              </h3>
              {!loading && upcomingTweets.length > 0 && (
                <button
                  onClick={fetchTweets}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-500 fill-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </div>
                <p className="text-gray-400 mt-4">Loading your tweets...</p>
              </div>
            ) : upcomingTweets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg mb-4">No upcoming tweets scheduled</p>
                <button
                  onClick={() => router.push("/post")}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Schedule Your First Tweet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTweets.map((tweet, index) => (
                  <div
                    key={tweet.id}
                    className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-5 transition-all duration-200 hover:border-gray-600 animate-fade-in-up group"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-white mb-3 leading-relaxed">{tweet.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(tweet.scheduledAt!).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-start gap-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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