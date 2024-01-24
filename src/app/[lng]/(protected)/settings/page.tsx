"use client"
import { logOut } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
const SettingPage = () => {
  const user = useCurrentUser()
  const handleSignOut = async() =>{
    await logOut()
  }
  return <div>{JSON.stringify(user)}<Button onClick={handleSignOut}>Sign out</Button></div>;
}
 
export default SettingPage;