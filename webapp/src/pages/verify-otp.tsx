import { VerifyOtpForm } from "@/components/verify-otp-form"

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-r from-emerald-400 to-cyan-400">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <VerifyOtpForm />
      </div>
    </div>
  )
}