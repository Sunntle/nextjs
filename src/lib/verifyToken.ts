import jwt from "jsonwebtoken";
export const verifyRefreshToken = async (token: string) => {
  try {
    const decode = await jwt.verify(token, process.env.SECRET_TOKEN ?? "secret");
    console.log(decode);
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
