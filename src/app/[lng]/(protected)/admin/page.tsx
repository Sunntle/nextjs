import { UserRole } from "@prisma/client";
import RoleGate from "@/app/[lng]/(auth)/role-gate";

const AdminPage = () => {
    return <RoleGate allowRoles={UserRole.ADMIN}><div>Admin Page</div></RoleGate>;
}
 
export default AdminPage;