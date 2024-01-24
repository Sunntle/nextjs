import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import Social from "./social"
interface CardWrapperProps {
    children: React.ReactNode,
    headerLabel: string,
    backButton: {
        label: string, 
        href: string
    },
    showSocial?: boolean
    title?: string
}
const CardWrapper = ({children, headerLabel, backButton, showSocial, title}: CardWrapperProps) => {
  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle>{title ?? "Auth"}</CardTitle>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (<CardFooter>
        <Social/>
      </CardFooter>)}
      <CardFooter className="flex justify-center">
        <Button asChild variant="link"><Link href={backButton.href}>{backButton.label}</Link></Button>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
