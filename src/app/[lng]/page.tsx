import { useTranslation } from "@/i18n";
import { ICommonProps } from "@/types/paramsProps";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default async function Home({ params: { lng } }: ICommonProps) {
  const { t } = await useTranslation(lng);
  return (
    <div className="flex items-center justify-center gap-x-5 lg:flex-row flex-col" style={{height: "calc(100vh - 60px)"}}>
      <div className="flex-grow relative w-full h-full">
        <Image
          src="https://res.cloudinary.com/dw6jih4yt/image/upload/v1706436846/generated_public_links/hero_3x_w14phm.webp"
          sizes="100vw"
          fill
          priority
          alt="Slide"
        />
      </div>
      <div className="w-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
          {t("home.title")}
        </h1>
        <h2 className="mt-5 scroll-m-20 pb-2 text-3xl tracking-tight transition-colors first:mt-0">
          {t("home.subTitle")}
        </h2>
        <div>
          <h3 className="mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
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
