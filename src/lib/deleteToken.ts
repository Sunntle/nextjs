import { db } from "@/lib/db";
export const deleteTwoFactorToken = async (id: string) => {
  try {
    await db.twoFactorToken.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
};

export const deleteVerifyToken = async (id: string) => {
  try {
    await db.verificationToken.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
};
