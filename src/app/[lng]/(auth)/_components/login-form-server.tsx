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
import FormError from "./form-error";
import FormSuccess from "./from-success";
import { useFormState, useFormStatus } from "react-dom";
import {loginServerAction} from "@/actions/login";

export const ButtonSubmit = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Submitting..." : "Login"}
    </Button>
  );
};

const LoginFormServerAction = () => {
  const [state, formAction] = useFormState(loginServerAction, {
    errors: undefined,
    status: "",
  });
  console.log(state);

  return (
    <CardWrapper
      headerLabel="Login Form"
      backButton={{ label: "Back", href: "/" }}
      showSocial
    >
      <form action={formAction} className="space-y-4">
        <Input name="username" placeholder="Username" />
        {state.errors?.username && state.errors.username}
        <Input name="password" type="password" placeholder="Password" />
        {state.errors?.password && state.errors.password}
        {state.status == "success" ? <FormSuccess message="Email sent" /> : <FormError message="Something went wrong" />}
        <ButtonSubmit />
      </form>
    </CardWrapper>
  );
};

export default LoginFormServerAction;
