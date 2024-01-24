"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useTranslation } from "@/i18n/client";
import { useMemo } from "react";
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
const Navbar = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);
  const renderList = useMemo(() => {
    return menuList.map((item, key) => (
      <NavigationMenuItem key={key}>
        <NavigationMenuTrigger>{t(`navbar.${item.label}`)}</NavigationMenuTrigger>
        <NavigationMenuContent>
          {item?.child?.map((el) => (
            <NavigationMenuLink key={el.label + key}>
              {t(`navbar.${el.label}`)}
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    ));
  }, [t]);
  return (
    <NavigationMenu>
      <NavigationMenuList>{renderList}</NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
