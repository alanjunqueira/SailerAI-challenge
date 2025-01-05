"use client";

import { useRouter } from "next/navigation";

import { FormEvent } from "react";

import { useServerAction } from "zsa-react";

import { register } from "../_actions/register";

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

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { toast } = useToast();
  const router = useRouter();

  const { execute, error, isPending } = useServerAction(register, {
    onSuccess: ({ data }) => {
      toast({
        title: "Success!",
        description: data.message ?? "Register realized successful!",
      });

      router.push("/sign-in");
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
        description: err.message ?? "Wasn't possible to register, try again.",
        variant: "destructive",
      });
    },
  });

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await execute(formData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Register to access the application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input id="name" name="name" placeholder="Jhon Doe" />
                {error?.fieldErrors?.name && (
                  <p className="text-sm text-destructive">
                    {error.fieldErrors.name}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
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
                  autoComplete="new-password"
                  inputMode="text"
                  placeholder="**********"
                />
                {error?.fieldErrors?.password && (
                  <p className="text-sm text-destructive">
                    {error.fieldErrors.password}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
