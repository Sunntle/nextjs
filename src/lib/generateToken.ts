import { verificaitionTokenByEmail } from "@/data/verificationToken";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { deleteVerifyToken } from "./deleteToken";
import jwt from "jsonwebtoken";

export const generateVerifyToken = async (email: string, type: string) => {
  try {
    const token = await uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hours
    const isExistToken = await verificaitionTokenByEmail(email, type);
    if (isExistToken) {
      await deleteVerifyToken(isExistToken.id);
    }
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
        type,
      },
    });
    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// Two Factor Token
export const generateTwoFactorToken = async (email: string, type: string) => {
  try {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes
    const isExistToken = await verificaitionTokenByEmail(email, type);
    if (isExistToken) {
      await deleteVerifyToken(isExistToken.id);
    }
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
        type,
      },
    });
    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
//refreshToken
export const generateRefreshToken = async(id: string) => {
  try {
    const expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).valueOf();
    const token = await jwt.sign(
      { iat: new Date().valueOf(), exp: expires, sub: id },
      process.env.SECRET_TOKEN ?? "secret",
      { algorithm: "HS256" }
    );
    return token
  } catch (error) {
    console.log(error);
    return null;
  }
};
