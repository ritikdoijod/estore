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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import axios, { AxiosError } from "axios"
import { KeyRound, Mail } from "lucide-react"

export function SignUpForm() {
  const navigate = useNavigate()
  const singUpMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await axios.post("/auth/signup", data)
      return result.data
    },
    onSuccess: (data) => {
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
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login in to your CarePlus Account</CardDescription>
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
                        <InputGroup className="h-12">
                          <InputGroupInput
                            name={field.name}
                            id={field.name}
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="Joe"
                            className="h-12"
                          />
                          <InputGroupAddon className="p-3">
                            <Mail />
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    )
                  }}
                />{" "}
                <form.Field
                  name="lastName"
                  children={(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <InputGroup className="h-12">
                          <InputGroupInput
                            name={field.name}
                            id={field.name}
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="Brevis"
                            className="h-12"
                          />
                          <InputGroupAddon className="p-3">
                            <Mail />
                          </InputGroupAddon>
                        </InputGroup>
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
                      <InputGroup className="h-12">
                        <InputGroupInput
                          name={field.name}
                          id={field.name}
                          type="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="abc@example.com"
                          className="h-12"
                        />
                        <InputGroupAddon className="p-3">
                          <Mail />
                        </InputGroupAddon>
                      </InputGroup>
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

                      <InputGroup className="h-12">
                        <InputGroupInput
                          name={field.name}
                          id={field.name}
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="••••••••"
                        />
                        <InputGroupAddon className="p-3">
                          <KeyRound />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" form="signup-form" className="h-12">
              Login
            </Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "p-0 text-black"
                )}
              >
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
