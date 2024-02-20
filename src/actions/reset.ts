"use server";
import { IResponseError } from "./login";
import { z } from "zod";
import { ForgotPasswordSchema, NewPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerifyToken } from "@/lib/generateToken";
import sendVerificationEmail from "@/lib/mail";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verificaitionTokenByToken } from "@/data/verificationToken";
import { deleteVerifyToken } from "@/lib/deleteToken";

const resetPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>
): Promise<IResponseError> => {
  try {
    const validatedFields = ForgotPasswordSchema.safeParse(values);
    if (!validatedFields.success)
      return { status: "error", code: 102 };
    const { username } = validatedFields.data;
    const existingEmail = await getUserByEmail(username);
    if (!existingEmail) return { status: "error", code: 113 };
    const dataToken = await generateVerifyToken(username, "reset-password");
    if (!dataToken)
      throw new Error("Something wrong with generate verify token");
    await sendVerificationEmail(
      dataToken.email,
      dataToken.token,
      `http://localhost:3000/en/new-password`,
      "Click here to reset your password"
    );
    return { code: 205, status: "ok" };
  } catch (err) {
    console.log("Error", err);
    return { code: 0, status: "error" };
  }
};
const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string
): Promise<IResponseError> => {
  try {
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success)
      return { status: "error", code: 111 };
    const existingToken = await verificaitionTokenByToken(token, "reset-password");
    if (!existingToken)
      return { status: "error", code: 104 };
    const isExpired = new Date(existingToken.expires) < new Date();
    if (isExpired) return { status: "error", code: 105 };
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser)
      return { status: "error", code: 113 };
    const { password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Promise.all([
      db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      }),
      deleteVerifyToken(existingToken.id)
    ]);
    return { code:203, status: "ok" };
  } catch (err) {
    console.log("Error", err);
    return { code: 0, status: "error" };
  }
};
export { resetPassword, newPassword };
