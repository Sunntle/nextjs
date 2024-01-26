import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import { useTranslation } from "@/i18n/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { defaultAvt } from "@/utils/constant";
import { getFallBackName } from "@/utils/helper";
import {  useMemo } from "react";

function AvatarComponent() {
    const {t} = useTranslation()
    const user = useCurrentUser()
    const fallbackName = useMemo(()=>getFallBackName(user.name),[user.name])
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="cursor-pointer">
      <AvatarImage src={user.image ?? defaultAvt} alt="@shadcn" />
      <AvatarFallback>{fallbackName}</AvatarFallback>
    </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem >
        {t("auth.profile")}
      </DropdownMenuItem>
      <DropdownMenuItem>
      {t("auth.logout")}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}
export default AvatarComponent