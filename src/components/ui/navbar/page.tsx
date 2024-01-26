"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslation } from "@/i18n/client";
import Link from "next/link";
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
const Navbar = () => {
  const { t } = useTranslation();
  const renderList = useMemo(() => {
    return menuList.map((item, key) => (
      <NavigationMenuItem key={key}>
        {item?.child ? (
          <>
            <NavigationMenuTrigger>
              {t(`navbar.${item.label}`)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[600px]">
                <li className="w-full">
                  {item?.child?.map((el) => (
                    <NavigationMenuLink key={el.label + key}>
                      <p>{t(`navbar.${el.label}`)}</p>
                      <p className="text-sm text-muted-foreground">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Ex qui, aliquam vero et iusto expedita repudiandae
                        praesentium! Illo ratione quod nulla aperiam
                        voluptatibus tenetur, quis, deserunt, facilis ad ipsum
                        vero.
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
  return (
    <NavigationMenu>
      <NavigationMenuList>{renderList}</NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
