import { useTranslation } from "@/i18n";
import { ICommonProps } from "@/types/paramsProps";
import Image from "next/legacy/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconBTC } from "@/utils/constant";
import { ArrowRight } from "lucide-react";
export default async function Home({ params: { lng } }: ICommonProps) {
  const { t } = await useTranslation(lng);
  return (
    <div
      className="flex items-start md:items-center justify-center lg:gap-x-5 md:flex-row flex-col"
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
        />
      </div>
      <Button asChild variant="link" className="block md:hidden p-0">
        <Link href="/register" locale={lng} className="flex gap-x-2">
          <IconBTC/>
          {t("common.title-to-signup")}
          <ArrowRight className="h-[1.2rem] w-[1.2rem]"/>
        </Link>
      </Button>
      <div className="w-full lg:basis-1/2 basis-2/5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
          {t("home.title")}
        </h1>
        <h2 className="mt-5 scroll-m-20 pb-2 md:text-xl lg:text-3xl tracking-tight transition-colors first:mt-0">
          {t("home.subTitle")}
        </h2>
        <div>
          <h3 className="mt-4 md:mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
            {t("common.emailaddress")}
          </h3>
          <div className="flex w-full max-w-md items-center space-x-2">
            <Input type="email" placeholder="example@ex.com" />
            <Button type="submit">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
