import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n";
import { ICommonProps } from "@/types/types";
import { IconBTC } from "@/utils/constant";
import { ArrowRight } from "lucide-react";
import Image from "next/legacy/image";
import Link from "next/link";
import SectionList from "./_components/section-list";

export default async function Home({ params: { lng } }: ICommonProps) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <section
        className="max-w-[1220px] mx-auto px-6 lg:p-0 mb-10 flex items-start md:items-center justify-center lg:gap-x-5 md:flex-row flex-col"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="flex-grow lg:basis-1/2 basis-3/5 relative w-full h-full hidden md:block">
          <Image
            src="https://res.cloudinary.com/dw6jih4yt/image/upload/v1706436846/generated_public_links/hero_3x_w14phm.webp"
            sizes="100vw"
            layout="fill"
            priority
            objectFit="contain"
            alt="Slide"
            style={{filter: "drop-shadow(2px 2px 10px #706c6e)"}}
          />
        </div>
        <Button asChild variant="link" className="block md:hidden p-0">
          <Link href="/register" locale={lng} className="flex gap-x-2">
            <IconBTC />
            {t("common.title-to-signup")}
            <ArrowRight className="h-[1.2rem] w-[1.2rem]" />
          </Link>
        </Button>
        <div className="w-full lg:basis-1/2 basis-2/5">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            {t("home.title")}
          </h1>
          <h3 className="mt-5 pb-2 md:text-xl lg:text-3xl tracking-tight transition-colors first:mt-0">
            {t("home.subTitle")}
          </h3>
          <div>
            <h3 className="mt-4 md:mt-8 mb-4 text-2xl font-semibold tracking-tight">
              {t("common.emailaddress")}
            </h3>
            <div className="flex w-full max-w-md items-center space-x-2">
              <Input type="email" placeholder="example@ex.com" />
              <Button type="submit">{t("common.subscribe")}</Button>
            </div>
          </div>
        </div>
      </section>
      <SectionList lng={lng} t={t}/>
    </>
  );
}
