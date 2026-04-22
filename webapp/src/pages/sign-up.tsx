import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-r from-emerald-400 to-cyan-400">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  )
}