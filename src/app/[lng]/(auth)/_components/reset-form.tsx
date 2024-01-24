import CardWrapper from "./card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotPasswordSchema } from "@/schemas";
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
import { resetPassword } from "@/actions/reset";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setSuccess] = useState<IResponseError>({message: "", status: ""})
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(()=>{
        resetPassword(values).then((data: IResponseError)=> {
        setSuccess(data)
      })
    })
  };
  return (
    <CardWrapper
      headerLabel="Reset Password"
      backButton={{ label: "Back to login?", href: "/login" }}
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="example@ex.com" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={isSuccess?.status === "ok" ? isSuccess.message : ""}/>
          <FormError message={(isSuccess?.status === "error" ? isSuccess.message : "")}/>
          <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <BeatLoader/> :"Send"}</Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
