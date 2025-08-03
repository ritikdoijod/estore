"use client";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@estore/schemas";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@estore/components/ui";
import { GoogleIcon } from "@estore/assets";
import { useRouter } from "next/navigation";

export default function SignIn() {
  return (
    <div className="grid size-full place-content-center">
      <SignInCard />
    </div>
  );
}

export function SignInCard() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  const signupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/auth/register`,
        data,
        {
          withCredentials: true,
        },
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      console.log(formData);
      router.push("/verify-otp");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function onSubmit(data: z.infer<typeof registerSchema>) {
    console.log(data);
    signupMutation.mutate(data);
  }

  return (
    <Card className="w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to Estore</CardTitle>
        <CardDescription className="mt-2">
          Login with your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid">
          <Button variant="outline" className="cursor-pointer" asChild>
            {/* TODO: Add google auth link*/}
            <Link href={"/test"}>
              <GoogleIcon className="size-6" />
              <span className="ml-4">Login with Google</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-nowrap"> Or continue with </span>
          <Separator className="flex-1" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset>
              <div className="grid gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@mail.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={!isDirty || !isValid || signupMutation.isPending}
                  className="cursor-pointer"
                >
                  {signupMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        Already have an account?&nbsp;
        <Button variant="link" asChild className="cursor-pointer p-0 text-sm">
          <Link href="/auth/signin">Sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
