"use client";

import { SocialAuth } from "./social-auth";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: {
            firstname: firstname,
            lastname: lastname,
          }
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Image
        src={'/logo.png'}
        alt="Logo"
        width={250}
        height={250}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Daftar</CardTitle>
          <CardDescription>Selamat datang, ayo buat akun baru!</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">

              <div className="flex gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="John"
                    required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Doe"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>


              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Confirm Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-start items-center mt-1">
                <input
                  type="checkbox"
                  id="show-password"
                  className="h-4 w-4 rounded-md border border-input bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onChange={() => setShowPassword(!showPassword)}
                />

                <Label htmlFor="show-password" className="ml-1 text-sm">
                  Show Password
                </Label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
              <SocialAuth />
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
