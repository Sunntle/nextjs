"use client";
import Navbar from "@/components/ui/navbar/page";

import { Button } from "../button";
import { ModeToggle } from "./darkmode-button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AvatarComponent from "./avatar"
import Link from "next/link";
const Header = () => {
  const user = useCurrentUser()
  return (
    <header className="sticky py-2 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-around items-center gap-5">
      <Link href="/en/">Logo</Link>
        <Navbar />
        <div className="flex items-center gap-x-5">
        <ModeToggle />
        {user ? <AvatarComponent/> : <Button variant="ghost">
          Login
        </Button>}
        
        </div>
      </div>
    </header>
  );
};

export default Header;
