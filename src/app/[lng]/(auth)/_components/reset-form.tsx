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
import { useAppState } from "@/contexts/AppContext";
import { useTranslation } from "@/i18n/client";
import { errorCode } from "@/utils/error-code";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setSuccess] = useState<IResponseError>({message: "", status: "", code: 0})
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      username: "",
    },
  });
  const {language} = useAppState()
  const {t} = useTranslation(language)
  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(()=>{
        resetPassword(values).then((data: IResponseError)=> {
        setSuccess(data)
      })
    })
  };
  return (
    <CardWrapper
      headerLabel={t("auth.newpassword")}
      backButton={{ label: t("auth.backtologin"), href: "/login" }}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={isSuccess?.status === "ok" ? t(`error.${errorCode(isSuccess.code)}`) : ""}/>
          <FormError message={(isSuccess?.status === "error" ? t(`error.${errorCode(isSuccess.code)}`) : "")}/>
          <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <BeatLoader/> : t("auth.send")}</Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
