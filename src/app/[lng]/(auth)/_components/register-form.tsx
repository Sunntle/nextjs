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

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setSuccess] = useState<IResponseError>({
    message: "",
    status: "",
  });
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
      headerLabel="Register Form"
      backButton={{ label: "Already have an account?", href: "/login" }}
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="Name" {...field} />
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
              </FormItem>
            )}
          />
          {isSuccess.status == "ok" && (
            <FormSuccess message={isSuccess.message} />
          )}
          {isSuccess.status == "error" && (
            <FormError message={isSuccess.message} />
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading" : "Create an account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
