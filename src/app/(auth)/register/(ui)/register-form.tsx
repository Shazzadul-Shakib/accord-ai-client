"use client";

import * as customForm from "@/components/ui/form";
import { useRegister } from "../(lib)/useRegister";
import { TextInput } from "@/components/shared/form/text-input";
import { PasswordInput } from "@/components/shared/form/password-input";

export const RegisterForm = () => {
  const { form, onRegister } = useRegister();
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
        {/* <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <p className="text-center text-xs">
          New Here?{" "}
          <Link href={"/register"} className="text-blue-600 underline">
            Register
          </Link>
        </p>
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-full bg-border" />
          <span className="text-xs"> OR</span>
          <div className="h-[2px] w-full bg-border" />
        </div>
        <Button
          type="button"
          className="underline"
          variant="ghost"
          onClick={handleAddDemoCredentials}
        >
          Use Demo credentials
        </Button> */}
      </form>
    </customForm.Form>
  );
};
