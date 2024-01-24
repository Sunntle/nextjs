"use server"
import { db } from "@/lib/db"
//confirm email token - reset password token - two factor token =>
export const verificaitionTokenByToken = async (token:string, type: string) => {
    try {     
        const data = await db.verificationToken.findUnique({where: {token, type}})
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const verificaitionTokenByEmail = async (email:string, type:string) => {
    try {
        const data = await db.verificationToken.findFirst({where: {email, type}})
        return data
    } catch (error) {
        return null
    }
}
 