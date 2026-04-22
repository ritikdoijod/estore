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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import axios, { AxiosError } from "axios"

export function SignUpForm() {
  const navigate = useNavigate()
  const singUpMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await axios.post("/auth/sign-up", data)
      return result.data
    },
    onSuccess: () => {
      navigate({ to: "/verify-otp" })
    },
    onError: (err: AxiosError) => {
      console.log(
        (err.response?.data as { message?: string }).message || err.message
      )
    },
  })
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      singUpMutation.mutate(value)
    },
  })
  return (
    <div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign up to your Estore Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="firstName"
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                        <Input
                          name={field.name}
                          id={field.name}
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Joe"
                        />
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name="lastName"
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          name={field.name}
                          id={field.name}
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Brevis"
                        />
                      </Field>
                    )
                  }}
                />
              </div>
              <form.Field
                name="email"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        name={field.name}
                        id={field.name}
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="abc@example.com"
                      />
                    </Field>
                  )
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                      <Input
                        name={field.name}
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="••••••••"
                      />
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" form="signup-form">
              Sign up
            </Button>
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "p-0 text-black"
                )}
              >
                Login
              </Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
