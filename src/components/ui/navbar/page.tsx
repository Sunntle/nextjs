"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useTranslation } from "@/i18n/client";
import Link from "next/link";
import { useMemo } from "react";
import { ModeToggle } from "./darkmode-button";
import ModeSwitchLanguage from "./language-button";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
const menuList = [
  {
    label: "markets",
  },
  {
    label: "discover",
    child: [
      {
        label: "notifications",
      },
      {
        label: "knowledge",
      },
      {
        label: "research",
      },
    ],
  },
  {
    label: "products",
  },
  {
    label: "supports",
  },
  {
    label: "about",
  },
  {
    label: "event",
  },
];
const Navbar = () => {
  const { t } = useTranslation();
  const breakpoints = useBreakpoints();
  const isLargerLgScreen = useMemo(
    () => breakpoints.isLg || breakpoints.isXL || breakpoints.isXXL,
    [breakpoints]
  );
  const renderList = useMemo(() => {
    return menuList.map((item, key) => (
      <NavigationMenuItem key={key}>
        {item?.child ? (
          <>
            <NavigationMenuTrigger>
              {t(`navbar.${item.label}`)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-fit md:w-[400px] lg:w-[600px] max-[640px]:max-w-[160px] sm:max-w-[200px] md:max-w-[250px]">
                <li className="w-full">
                  {item?.child?.map((el) => (
                    <NavigationMenuLink key={el.label + key}>
                      <p>{t(`navbar.${el.label}`)}</p>
                      <p className="text-sm text-muted-foreground max-[281px]:d-none">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                      </p>
                    </NavigationMenuLink>
                  ))}
                </li>
              </ul>
            </NavigationMenuContent>
          </>
        ) : (
          <Link href={`/${item.label}`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t(`navbar.${item.label}`)}
            </NavigationMenuLink>
          </Link>
        )}
      </NavigationMenuItem>
    ));
  }, [t]);

  if (!isLargerLgScreen)
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
          </PopoverTrigger>
          <PopoverContent sideOffset={18} align="end">
            <NavigationMenu orientation="vertical">
              <NavigationMenuList className="flex-col items-start">
                {renderList}
                <div className="flex items-center px-2">
                  <ModeToggle />
                  <ModeSwitchLanguage />
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
      </>
    );
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>{renderList}</NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <ModeSwitchLanguage />
      </div>
    </>
  );
};

export default Navbar;
