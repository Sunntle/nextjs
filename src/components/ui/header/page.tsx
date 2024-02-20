import Navbar from "@/components/ui/navbar/page";
import { Button } from "../button";
import AvatarComponent from "./avatar";
import Link from "next/link";
import { logOut } from "@/actions/logout";
import { currentUser } from "@/lib/auth-server";
import { useTranslation } from "@/i18n";
import { headers } from "next/headers";
import { getSelectorsByUserAgent } from "react-device-detect"

const Header = async({lng} : {lng:string}) => {
  const user = await currentUser();
  const { t } = await useTranslation(lng);
  const detectDevice = headers().get("user-agent")
  const { isMobile } = getSelectorsByUserAgent(detectDevice ?? "")
  return (
    <header className="sticky py-2 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between lg:justify-around items-center px-6">
        <Link href="/en/">Logo</Link>
        <div className="flex justify-between items-center gap-3 lg:gap-5">
            <Navbar isMobile={isMobile}/>
            {user ? (
                <AvatarComponent />
              ) : (
                <div className="flex items-center gap-x-2">
                  <Button variant="outline" asChild><Link href="/register" locale={lng}>{t("auth.signin")}</Link></Button>
                  <Button variant="default" asChild><Link href="/login" locale={lng}>{t("auth.signup")}</Link></Button>
                </div>
              )}
          </div>
      </div>
    </header>
  );
};

export default Header;
