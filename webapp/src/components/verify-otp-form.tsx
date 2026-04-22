import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import axios, { AxiosError } from "axios"
import { RefreshCwIcon } from "lucide-react"

export function VerifyOtpForm() {
  const navigate = useNavigate()
  const verifyOtpMuatation = useMutation({
    mutationFn: async (data: any) => {
      const result = await axios.post("/auth/sign-up", data)
      return result.data
    },
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: AxiosError) => {
      console.log(
        (err.response?.data as { message?: string }).message || err.message
      )
    },
  })
  const form = useForm({
    defaultValues: {
      sessionId: "",
      otp: "",
    },
    onSubmit: ({ value }) => {
      console.log(value)
      // verifyOtpMuatation.mutate(value)
    },
  })
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify Account</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="verify-otp-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="otp"
            children={(field) => {
              return (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="otp-verification">
                      Verification code
                    </FieldLabel>
                    <Button
                      variant="link"
                      size="xs"
                      className="text-muted-foreground"
                    >
                      <RefreshCwIcon />
                      Resend Code
                    </Button>
                  </div>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    name={field.name}
                    id={field.name}
                    onChange={(value) => field.handleChange(value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  >
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-11 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-2" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-11 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
              )
            }}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="submit" form="verify-otp-form">
            Verify
          </Button>
          <FieldDescription className="text-center">
            Having trouble signing in? {/* TODO: add link to contact support */}
            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 text-black"
              )}
            >
              Contact support
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  )
}
