import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginForm } from "./(ui)/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="bg-secondary border-primary w-[400px]">
        <CardHeader className="pb-4 text-center">
          <h1 className="text-primary text-lg font-semibold">
            Login Your Account
          </h1>
        </CardHeader>
        <CardContent className="pb-4">
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <p className="text-muted-foreground text-xs">
            New here?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
