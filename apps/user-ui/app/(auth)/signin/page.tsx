"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@estore/components/ui";

export default function SignIn() {
  return (
    <div className="grid size-full place-content-center">
      <SignInCard />
    </div>
  );
}

const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .trim()
    .email("Invalid email address")
    .min(1)
    .max(255),
  password: z.string().nonempty("Password is required").trim().min(6).max(255),
});

export function SignInCard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  function onSubmit(data: any) {
    return;
  }

  return (
    <Card className="w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription className="mt-2">
          Login with your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid">
          <Button variant="outline" className="cursor-pointer" asChild>
            {/* TODO: Add google auth link*/}
            <Link href={"/test"}>
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
                <Button disabled className="cursor-pointer">
                  <Loader2 className="animate-spin" />
                  Logging in...
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || !isValid}
                  className="cursor-pointer"
                >
                  Login
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        Don&apos;t have an account?&nbsp;
        <Button variant="link" asChild className="cursor-pointer p-0 text-sm">
          <Link href="/auth/signup">Sign up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
