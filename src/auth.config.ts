import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "./data/user"
import { deleteTwoFactorToken } from "@/lib/deleteToken"
import { getTwoFactorConfirmationByUserId } from './data/getTwoFactorToken';

export default {
  trustHost: true,
  providers: [
    Github({clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET}),
    Google({clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET}),
    CredentialsProvider({
    async authorize (credential): Promise<any>{
      const validatedFields = LoginSchema.safeParse(credential)
      if(validatedFields.success){
        const {username, password} = validatedFields.data
        const user = await getUserByEmail(username)
        if(!user || !user.password) return null
        const passwordCompared = await bcrypt.compare(password, user.password)
        if(passwordCompared) return user
        const isConfirmed = await getTwoFactorConfirmationByUserId(user.id)
        isConfirmed && await deleteTwoFactorToken(isConfirmed.id)
        return null
      }
    }
  })],
} satisfies NextAuthConfig