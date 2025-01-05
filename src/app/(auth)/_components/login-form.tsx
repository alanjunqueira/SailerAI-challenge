"use client";

import { useRouter } from "next/navigation";

import { FormEvent } from "react";

import { useServerAction } from "zsa-react";

import { login } from "../_actions/login";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { toast } = useToast();
  const router = useRouter();

  const { execute, error, isPending } = useServerAction(login, {
    onSuccess: ({ data }) => {
      toast({
        title: "Success!",
        description: data.message ?? "Login realized successful!",
      });
      router.push("/chats");
    },
    onError: ({ err }) => {
      if (err.fieldErrors) {
        toast({
          title: "Validation error",
          description: "Fill in the fields correctly",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "An error occurred",
        description: err.message ?? "Wasn't possible to login, try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await execute(formData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Please enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                />
                {error?.fieldErrors?.email && (
                  <p className="text-sm text-destructive">
                    {error.fieldErrors.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="**********"
                />
                {error?.fieldErrors?.password && (
                  <p className="text-sm text-destructive">
                    {error.fieldErrors.password}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
