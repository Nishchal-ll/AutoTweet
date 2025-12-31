// "use client";

// import { useEffect } from "react";
// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "authenticated") {
//       router.push("/dashboard"); // redirect if already logged in
//     }
//   }, [status, router]);

//   if (status === "loading") return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Login to AI Tweet Poster</h1>
//       <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-500 fill-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side - Logo and text */}
        <div className="flex-1 space-y-8 animate-fade-in">
          {/* Twitter Logo */}
          <div className="transform hover:scale-110 transition-transform duration-300 hover:rotate-12">
            <svg viewBox="0 0 24 24" className="w-20 h-20 text-white fill-current drop-shadow-2xl" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl lg:text-8xl font-bold text-white tracking-tight animate-slide-up leading-tight">
              Happening now
            </h1>
            <p className="text-3xl lg:text-4xl font-bold text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Join today.
            </p>
            <p className="text-lg text-gray-400 animate-slide-up max-w-md" style={{ animationDelay: '0.2s' }}>
              Connect with AI-powered tweet posting. Share your thoughts with the world effortlessly.
            </p>
          </div>
        </div>

        {/* Right side - Login card */}
        <div className="flex-1 max-w-md w-full animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="text-gray-400">Sign in to AI Tweet Poster</p>
              </div>

              {/* Sign in button */}
              <button
                onClick={() => signIn("twitter")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                
                <span className="relative z-10">Sign in with Twitter</span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900 text-gray-500">Secure authentication</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: "🚀", text: "AI-powered tweet generation" },
                  { icon: "🔒", text: "Secure OAuth integration" },
                  { icon: "⚡", text: "Lightning-fast posting" }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-400 animate-slide-up"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Terms */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-xs text-center leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy. We'll never post without your permission.
                </p>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by OAuth 2.0</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}