import {z} from "zod"

const LoginSchema = z.object({
    username: z.string().email({
        message: "Username must be email"
    }),
    password: z.string().min(1,{
        message: "Password is required"
    }),
    code: z.optional(z.string())
})
const RegisterSchema = z.object({
    name: z.string().min(1,{
        message: "Name is required"
    }),
    username: z.string().email({
        message: "Username must be email"
    }),
    password: z.string().min(1,{
        message: "Password is required"
    })
})
const ForgotPasswordSchema = z.object({
    username: z.string().email({
        message: "Username must be email"
    })
})
const NewPasswordSchema = z.object({
    password: z.string().min(1,{
        message: "Password is required"
    })
})
export {LoginSchema, RegisterSchema, ForgotPasswordSchema, NewPasswordSchema}