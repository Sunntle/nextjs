import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserByID } from './data/user';
import { getTwoFactorConfirmationByUserId } from './data/getTwoFactorToken';
import { deleteTwoFactorToken } from '@/lib/deleteToken';
import { generateRefreshToken } from '@/lib/generateToken';
import { verifyRefreshToken } from '@/lib/verifyToken';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages:{
    signIn: "/login",
    error: "/error"
  },
  events: {
    async linkAccount({user}){
       await db.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()}
       })
    }
  },
  callbacks: {
    async signIn({user, account}) {
      //adapter auto add information of user login in db by other providers
      if(account?.provider !== "credentials") return true
      const isExistUser = await getUserByID(user.id)
      if(!isExistUser?.emailVerified) return false
      if(isExistUser.isTwoFactorEnabled) {
        const isConfirmed = await getTwoFactorConfirmationByUserId(isExistUser.id)
        if(!isConfirmed) return false
        await deleteTwoFactorToken(isConfirmed.id)
      }
      return true
    },
    async session({ token, session }) {
        session.user.role = token.role;
        session.user.id = token.sub;
        // session.user.refresh_token = token.refresh_token;
      return session;
    },
    async jwt({ token, user, profile, trigger}) {
      if(!token.sub) return token;
      if (token && user) {
        token.role = user.userRole;
        // const refreshToken = await generateRefreshToken(token.sub)
        // token.refresh_token = refreshToken
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  ...authConfig,
});
