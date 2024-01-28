import * as React from "react"
import { GlobeIcon} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { languages, labelLanguages } from "@/i18n/setting"
import { useTranslation } from "@/i18n/client"
import { usePathname, useRouter } from "next/navigation"

const ModeSwitchLanguage = () => {
    const {t} = useTranslation()
    const route = useRouter()
    const pathname = usePathname()
    const handleSwitchLanguage = (language:string) =>{
        const splitPathname = pathname.split("/")
        splitPathname[1] = language
        const newURL = splitPathname.join("/")
        route.replace(newURL)
    }
    return  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <GlobeIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        <span className="sr-only"></span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center">
        {languages.map((language, index)=>{
            return  <DropdownMenuItem key={index} onClick={() => handleSwitchLanguage(language)}>
            {t(`common.${labelLanguages.find(el => el.symbol === language)?.label}`)}
          </DropdownMenuItem>
        })}
    </DropdownMenuContent>
  </DropdownMenu>;
}
 
export default ModeSwitchLanguage;