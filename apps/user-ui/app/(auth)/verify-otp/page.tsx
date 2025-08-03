"use client";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@estore/components/ui";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { fc } from "../../utils";

export default function VerifyOTP() {
  return (
    <div className="grid size-full place-content-center">
      <VerifyOTPCard />
    </div>
  );
}

const schema = z.object({
  otp: z.string(),
});

export function VerifyOTPCard() {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
    mode: "onTouched",
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  function startTimer() {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const verifyOTPMutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const response = await fc.post("/auth/verify", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: AxiosError) => {
      console.log(error?.response?.data);
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: async () => {
      const response = await fc.get("/auth/resend-otp");
      return response.data;
    },
    onSuccess: () => {
      setTimer(60);
      startTimer();
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    verifyOTPMutation.mutate(data);
  }

  useEffect(() => {
    startTimer();
  }, []);

  return (
    <Card className="min-w-sm">
      <CardContent className="grid gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset>
              <div className="flex flex-col items-center gap-8">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="justify-center space-y-6">
                      <FormLabel className="justify-center">
                        One Time Password
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          tabIndex={0}
                          autoFocus
                          maxLength={4}
                          {...field}
                        >
                          <InputOTPGroup className="gap-4">
                            <InputOTPSlot
                              index={0}
                              className="rounded-md border"
                            />
                            <InputOTPSlot
                              index={1}
                              className="rounded-md border"
                            />
                            <InputOTPSlot
                              index={2}
                              className="rounded-md border"
                            />
                            <InputOTPSlot
                              index={3}
                              className="rounded-md border"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={!isDirty || !isValid || verifyOTPMutation.isPending}
                  className="w-3xs"
                >
                  Verify
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="items-center justify-center">
        {canResend ? (
          <Button
            variant="link"
            className="text-xs"
            onClick={() => {
              resendOTPMutation.mutate();
            }}
            disabled={resendOTPMutation.isPending}
          >
            Resend OTP
          </Button>
        ) : (
          <p className="text-muted-foreground text-xs">
            Resend OTP in {timer}s
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
