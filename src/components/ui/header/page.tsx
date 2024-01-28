"use client";
import Navbar from "@/components/ui/navbar/page";

import { Button } from "../button";
import { ModeToggle } from "./darkmode-button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AvatarComponent from "./avatar";
import Link from "next/link";
import { logOut } from "@/actions/logout";
import ModeSwitchLanguage from "./language-button";
import { useTranslation } from "@/i18n/client";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useCallback, useMemo, useState } from "react";
const Header = () => {
  const user = useCurrentUser();
  const { t } = useTranslation();
  const breakpoints = useBreakpoints();
  const isLargerLgScreen = useMemo(
    () => breakpoints.isLg || breakpoints.isXL || breakpoints.isXXL,
    [breakpoints]
  );
  const [show, setShow] = useState(false);

  const handleShowNav = useCallback(()=>{
    setShow(prev => !prev)
  },[])

  const handleLogout = () => {
    logOut();
  };
  
  return (
    <header className="sticky py-2 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-around items-center ">
        <Link href="/en/">Logo</Link>
        {isLargerLgScreen ? (
          <div className="flex justify-between items-center gap-5">
            <Navbar />
            <div className="flex items-center gap-x-3 ">
              <ModeToggle />
              <ModeSwitchLanguage />
              {user ? (
                <AvatarComponent logOut={handleLogout} />
              ) : (
                <>
                  <Button variant="outline">{t("auth.signin")}</Button>
                  <Button variant="default">{t("auth.signup")}</Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <Button  variant="ghost" size="icon" onClick={handleShowNav}>
              {show ? <Cross1Icon className="h-[1.2rem] w-[1.2rem]" />: <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" /> }
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
