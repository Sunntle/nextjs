"use client"
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";
import FormError from "./_components/form-error";
import { useAppState } from "@/contexts/AppContext";
import { errorCode } from "@/utils/error-code";
import { useTranslation } from "@/i18n/client";

interface RoleGateProps {
    children: React.ReactNode;
    allowRoles: UserRole
}
const RoleGate = ({children, allowRoles}:RoleGateProps) => {
    const user = useCurrentUser()
    const {language} = useAppState()
    const {t} = useTranslation(language)
    console.log(user);
    
    if(!(allowRoles === user.role)) return <FormError message={t(`error.${errorCode(401)}`)}/>
    return <>{children}</>;
}
 
export default RoleGate;