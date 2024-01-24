import CardWrapper from "./card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from 'next/navigation'
import FormError from "./form-error";
import FormSuccess from "./from-success";
import { useState, useTransition } from "react";
import { IResponseError } from "@/actions/login";
import { BeatLoader } from "react-spinners";
import { newPassword, resetPassword } from "@/actions/reset";

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setSuccess] = useState<IResponseError>({message: "", status: ""})
  const searchParams = useSearchParams()
  const token = searchParams.get("token");
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    if(!token) {
        setSuccess({status: "error", message: "Missing token"})
        return
    }
    startTransition(()=>{
        newPassword(values, token).then((data: IResponseError)=> {
        setSuccess(data)
      })
    })
  };
  return (
    <CardWrapper
      headerLabel="New password"
      backButton={{ label: "Back to login?", href: "/login" }}
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input disabled={isPending} type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={isSuccess?.status === "ok" ? isSuccess.message : ""}/>
          <FormError message={isSuccess?.status === "error" ? isSuccess.message : ""}/>
          <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <BeatLoader/> :"Reset password"}</Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
