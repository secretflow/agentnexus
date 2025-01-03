import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  trustHost: true,
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 10 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt: async ({
      token,
      trigger,
      session,
    }: {
      token: JWT;
      trigger?: "signIn" | "update" | "signUp";
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      session?: any;
    }) => {
      if (trigger === "update") {
        if (session) {
          if (session.name) {
            token.name = session.name;
          }
          if (session.email) {
            token.email = session.email;
          }
          if (session.image) {
            token.picture = session.image;
          }
        } else {
          return null;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        if (token) {
          if (token.sub) {
            session.user.id = token.sub;
          }
          if (token.email) {
            session.user.email = token.email;
          }
          if (token.name) {
            session.user.name = token.name;
          }
          if (token.picture) {
            session.user.image = token.picture;
          }
        } else {
          return { user: {}, expires: "0" };
        }
      }
      return session;
    },
  },
});
