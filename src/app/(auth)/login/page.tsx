"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "./actions";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth, isAuthenticated, role } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await loginAction(formData);

      if (response.status === 200) {
        setAuth(true, response.role ?? null);

        // Redirect to dashboard for admins, home for regular users
        const route = response.role === 'admin' ? '/dashboard' : '/';

        // Use replace instead of push to prevent going back to login
        router.replace(route);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8">
      <Card className="mx-auto w-full lg:w-1/3">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          {/* Conditionally render error message */}
            {errorMessage ? <CardDescription className="text-red-500">{errorMessage}</CardDescription> : <CardDescription>Enter your credentials to log in</CardDescription>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </Form>
          <div className="flex justify-center mt-4">
            <Button variant="link" onClick={() => router.push('/signup')}>
              Don&apos;t have an account? Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
