import Link from "next/link";
import { useTranslation } from "@/i18n";
import { ICommonProps } from "@/types/paramsProps";
export default async function Home({ params: { lng } }: ICommonProps) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <h1>{t("common.welcome")}</h1>
      <Link href={`/${lng}/tradingview`}>Trading View</Link>
      <Link href={`/${lng}/login`}>Login</Link>
      <Link href={`/${lng}/register`}>Register</Link>
      <Link href={`/${lng}/markets`}>Markets</Link>
    </>
  );
}
