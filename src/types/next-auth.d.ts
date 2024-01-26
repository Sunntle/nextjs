import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
          id:string;
          role: string;
          isTwoFactorEnabled: boolean;
        };
      }
    interface User extends DefaultUser {
        id:string;
        userRole: string;
        isTwoFactorEnabled: boolean;
    }
}