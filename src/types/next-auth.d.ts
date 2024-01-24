import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
          role: string
        };
      }
    interface User extends DefaultUser {
        userRole: string;
    }
}