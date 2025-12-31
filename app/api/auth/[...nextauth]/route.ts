import NextAuth, { NextAuthOptions, DefaultSession, User } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Extend the default Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      twitterAccessToken?: string;
    } & DefaultSession["user"];
  }
}

// Extend the default JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    twitterAccessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
  TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  version: "2.0",
  authorization: { params: { scope: "tweet.read tweet.write users.read offline.access" } },
}),
  ],

  secret: process.env.NEXTAUTH_SECRET as string,

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.access_token) {
        token.twitterAccessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.twitterAccessToken = token.twitterAccessToken;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
