'use client'
import CardWrapper from "./card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
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
import { useSearchParams } from "next/navigation";
import FormError from "./form-error";
import FormSuccess from "./from-success";
import { useState, useTransition } from "react";
import { IResponseError, loginAction } from "@/actions/login";
import { BeatLoader } from "react-spinners";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { useAppState } from "@/contexts/AppContext";
import { errorCode } from "@/utils/error-code";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setSuccess] = useState<IResponseError>({
    message: "",
    code: 0,
    status: ""
  });
  const {t} = useTranslation()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl")
  const errorText =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? t("auth.emailUsed")
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      code: ""
    },
  });

  const handleSend2FA = (values?: z.infer<typeof LoginSchema>) =>{
    const value = values ?? {...form.getValues(), code: "0"};
    startTransition(() => {
      loginAction(value, callbackUrl).then((data: IResponseError) => {
        if(!data) return;
        data?.status === "error" && form.resetField("code")
        setSuccess(data);
      });
    });
  }
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    handleSend2FA(values)
  };

  return (
    <CardWrapper
      headerLabel={t("auth.loginform")}
      backButton={{ label: t("auth.dhaccount"), href: "/register" }}
      showSocial
      title={t("auth.auth")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isSuccess?.status === "pending" ||
          isSuccess?.status === "error2fa"? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.2facode")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="123456"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm">
                  {t("auth.2famailsent")}
                    <Button variant="link" type="button" size="sm" onClick={()=>handleSend2FA()}>
                    {t("auth.resend")}
                    </Button>
                  </FormDescription>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="example@ex.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                     {t("auth.publicName")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.password")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="password"
                        placeholder={t("auth.password")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <Button asChild variant="link" size="sm" className="p-0">
                      <Link href="/reset">{t("auth.forgotpw")}</Link>
                    </Button>
                  </FormItem>
                )}
              />
            </>
          )}
          <FormSuccess
            message={isSuccess?.status === "ok" ? t(`error.${errorCode(isSuccess.code)}`) : ""}
          />
          <FormError
            message={
              (isSuccess?.status === "error" || isSuccess?.status === "error2fa"
                ? t(`error.${errorCode(isSuccess.code)}`)
                : "") || errorText
            }
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <BeatLoader />
            ) : isSuccess.status === "pending" ? (
              t("auth.confirm")
            ) : (
              t("auth.login")
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
