"use server";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerifyToken,
} from "@/lib/generateToken";
import sendVerificationEmail from "@/lib/mail";
import { verificaitionTokenByEmail } from "@/data/verificationToken";
import { db } from "@/lib/db";
import { deleteVerifyToken } from "@/lib/deleteToken";
interface IResponseErrorServerAction {
  errors: { username: string; password: string } | undefined;
  status: string;
}
interface IResponseError {
  message?: string;
  status: string;
  code: number
}
const loginServerAction = async (
  currentState: IResponseErrorServerAction,
  formData: FormData
) => {
  const username = formData.get("username");
  const password = formData.get("password");
  const isSuccess = LoginSchema.safeParse({ username, password });
  if (!isSuccess.success) {
    const zodError = isSuccess.error;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      errors: {
        username: errorMap["username"]?.[0] || "",
        password: errorMap["password"]?.[0] || "",
      },
      status: "error",
    };
  }
  return { errors: undefined, status: "ok" };
};

const loginAction = async (
  values: z.infer<typeof LoginSchema>
): Promise<IResponseError> => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { code: 101, status: "error" };
  }
  try {
    const { username, password, code } = validatedFields.data;
    const isExistUser = await getUserByEmail(username);
    if (!isExistUser || !isExistUser.email || !isExistUser.password)
      return { code: 102, status: "error" };
    if (!isExistUser.emailVerified) {
      const dataToken = await generateVerifyToken(username, "email-verify");
      if (!dataToken)
        throw new Error("Something wrong with generate verify-token");
      await sendVerificationEmail(dataToken.email, dataToken.token);
      return { code: 201, status: "ok" };
    }
    if (isExistUser.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await verificaitionTokenByEmail(
          isExistUser.email,
          "2fa"
        );
        if (!twoFactorToken || twoFactorToken.token !== code)
          return { code: 104, status: "error2fa" };
        const isExpired = new Date(twoFactorToken.expires) < new Date();
        if (isExpired) return { code: 105, status: "error" };
        await Promise.all([
          deleteVerifyToken(twoFactorToken.id),
          db.twoFactorToken.create({ data: { userId: isExistUser.id } }),
        ]);
      } else {
        const isSentEmail = await verificaitionTokenByEmail(
          isExistUser.email,
          "2fa"
        );
        if (!isSentEmail || new Date(isSentEmail.expires) < new Date()) {
          const twoFactorToken = await generateTwoFactorToken(
            isExistUser.email,
            "2fa"
          );
          if (!twoFactorToken)
            return {
             code: 106,
              status: "error",
            };
          await sendVerificationEmail(
            twoFactorToken.email,
            twoFactorToken.token,
            undefined,
            "Your 2FA code is",
            false
          );
          return { status: "pending", message: "", code: 0 };
        }

        return {
          status: "error2fa",
          code: 301
        };
      }
    }
    await signIn("credentials", {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { code: 202, status: "pending" };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { code: 107, status: "error" };
        default:
          return { code: 0, status: "error" };
      }
    }
    throw err;
  }
};

const loginActionWithSocial = async (
  provider: "google" | "github"
): Promise<IResponseError> => {
  try {
    await signIn(provider, {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { code: 202, status: "ok" };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "OAuthSignInError":
          return { code: 108, status: "error" };
        case "OAuthAccountNotLinked":
          return { code: 109, status: "error" };
        default:
          return { code: 0, status: "error" };
      }
    }
    throw err;
  }
};
export { loginServerAction, loginAction, loginActionWithSocial };
export type { IResponseError };
