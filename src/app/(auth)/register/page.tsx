import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RegisterForm } from "./(ui)/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px] bg-secondary border-primary">
        <CardHeader className="text-center pb-4">
          <h1 className="text-lg font-semibold text-primary">
            Create an Account
          </h1>
        </CardHeader>
        <CardContent className="pb-4">
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
