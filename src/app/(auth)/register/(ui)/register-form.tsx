"use client";

import * as customForm from "@/components/ui/form";
import { useRegister } from "../(lib)/useRegister";
import { TextInput } from "@/components/shared/form/text-input";
import { PasswordInput } from "@/components/shared/form/password-input";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/shared/loader/button-loader";

export const RegisterForm = () => {
  const { form, onRegister, isLoading } = useRegister();
  return (
    <customForm.Form {...form}>
      <form className="flex flex-col gap-3" onSubmit={onRegister}>
        <TextInput
          form={form}
          name="name"
          label="Name"
          placeholder="john doe"
        />
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
          {isLoading ? <ButtonLoader text="Signing up" /> : "Sign Up"}
        </Button>
      </form>
    </customForm.Form>
  );
};
