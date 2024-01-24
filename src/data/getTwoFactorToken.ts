"use server"
import { db } from "@/lib/db"

export const getTwoFactorConfirmationByUserId = async (id:string) => {
    try {
        const user = await db.twoFactorToken.findUnique({where: {userId: id}})
        return user
    } catch (error) {
        return null
    }
}