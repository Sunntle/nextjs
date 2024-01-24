"use server";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import { IResponseError } from "./login";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerifyToken } from "@/lib/generateToken";
import sendVerificationEmail from "@/lib/mail";

const registerAction = async (
  values: z.infer<typeof RegisterSchema>
): Promise<IResponseError> => {
  try {
    const vaildatedFields = RegisterSchema.safeParse(values);
    if (!vaildatedFields.success) {
      return {code: 101, status: "error" };
    }
    const { password, name, username } = vaildatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isExistUser = await getUserByEmail(username);
    if (isExistUser)
      return {code: 110, status: "error" };
    await db.user.create({
      data: {
        email: username,
        password: hashedPassword,
        name: name,
      },
    });
    const dataToken = await generateVerifyToken(username, "email-verify");
    if (!dataToken) throw new Error("Something wrong with generate verify token")
    await sendVerificationEmail(dataToken.email, dataToken.token); 
    return { code: 201, status: "ok" };
  } catch (err) {
    console.log(err);
    return { code: 0, status: "error" };
  }
};
export { registerAction };
