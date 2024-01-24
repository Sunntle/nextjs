"use client";
import CardWrapper from "./card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
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
import FormError from "./form-error";
import FormSuccess from "./from-success";
import { useState, useTransition } from "react";
import { IResponseError } from "@/actions/login";
import { registerAction } from "@/actions/register";
import { useAppState } from "@/contexts/AppContext";
import { useTranslation } from "@/i18n/client";
import { errorCode } from "@/utils/error-code";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setSuccess] = useState<IResponseError>({
    message: "",
    status: "",
    code: 0
  });
  const { language } = useAppState();
  const { t } = useTranslation(language);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      registerAction(values).then((data: IResponseError) => {
        setSuccess(data);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel={t("auth.registerform")}
      backButton={{ label: t("auth.haccount"), href: "/login" }}
      showSocial
      title={t("auth.auth")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.name")}</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>{t("auth.publicName")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="example@example.com"
                    {...field}
                  />
                </FormControl>
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
              </FormItem>
            )}
          />
          <FormSuccess
            message={
              isSuccess?.status === "ok" ? t(`error.${errorCode(isSuccess.code)}`) : ""
            }
          />
          <FormError
            message={
              isSuccess?.status === "error" ? t(`error.${errorCode(isSuccess.code)}`) : ""
            }
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("loading") : t("auth.createaccount")}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
