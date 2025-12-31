// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }


import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      twitterAccessToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    twitterAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    twitterAccessToken?: string;
  }
}
