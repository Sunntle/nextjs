"use server"
import { getUserByEmail } from "@/data/user";
import { verificaitionTokenByToken } from "@/data/verificationToken";
import { db } from "@/lib/db";
import { IResponseError } from "./login";

const verifyEmail = async (token: string): Promise<IResponseError> => {
  try {
    const existingToken = await verificaitionTokenByToken(token, "email-verify");
    if (!existingToken)
      return { status: "error", code: 112 };
    const isExpired = new Date(existingToken.expires) < new Date();
    if (isExpired) return { status: "error", code: 105 };
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser)
      return { status: "error", code: 102 };
    await Promise.all([
      db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email }, // update email -> update new email -> old email send token to new email -> verify -> update email
      }),
      db.verificationToken.delete({
        where: { id: existingToken.id },
      }),
    ]);
    return { status: "ok", code: 204 };
  } catch (err) {
    console.log("error verify email: ", err);
    return { status: "error", code: 0};
  }
};

export default verifyEmail;
