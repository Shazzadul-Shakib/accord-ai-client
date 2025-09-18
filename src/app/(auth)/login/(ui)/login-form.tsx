"use client";

import * as customForm from "@/components/ui/form";
import { TextInput } from "@/components/shared/form/text-input";
import { PasswordInput } from "@/components/shared/form/password-input";
import { Button } from "@/components/ui/button";
import { useLogin } from "../(lib)/useLogin";
import { ButtonLoader } from "@/components/shared/loader/button-loader";

export const LoginForm = () => {
  const { form, handleAddDemoCredentials, onLogin, isLoading } = useLogin();
  return (
    <customForm.Form {...form}>
      <form className="flex flex-col gap-3" onSubmit={onLogin}>
        <TextInput
          form={form}
          name="email"
          label="Email"
          placeholder="@john@example.com"
        />
        <PasswordInput
          form={form}
          name="password"
          label="Password"
          placeholder="@John Doe"
        />
        <Button
          type="submit"
          className="mt-2 w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? <ButtonLoader text="Logging in" /> : "Login"}
        </Button>
        <Button
          type="button"
          className="text-muted-foreground"
          variant="ghost"
          onClick={handleAddDemoCredentials}
        >
          Use Demo credentials
        </Button>
      </form>
    </customForm.Form>
  );
};
