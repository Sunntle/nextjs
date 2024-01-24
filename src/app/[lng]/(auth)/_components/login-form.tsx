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

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setSuccess] = useState<IResponseError>({
    message: "",
    status: ""
  });
  const searchParams = useSearchParams();
  const errorText =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      code: ""
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      loginAction(values).then((data: IResponseError) => {
        if(!data) return;
        data?.status === "error" && form.resetField("code")
        setSuccess(data);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Login Form"
      backButton={{ label: "Don't have an account?", href: "/register" }}
      showSocial
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
                  <FormLabel>Two factor code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="123456"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm">
                    Email two-factor code sent!{" "}
                    <Button variant="link" size="sm" onClick={() => {}}>
                      Resend
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
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <Button asChild variant="link" size="sm" className="p-0">
                      <Link href="/reset">Forgot your password?</Link>
                    </Button>
                  </FormItem>
                )}
              />
            </>
          )}
          <FormSuccess
            message={isSuccess?.status === "ok" ? isSuccess.message : ""}
          />
          <FormError
            message={
              (isSuccess?.status === "error" || isSuccess?.status === "error2fa"
                ? isSuccess.message
                : "") || errorText
            }
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <BeatLoader />
            ) : isSuccess.status === "pending" ? (
              "Confirm"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
