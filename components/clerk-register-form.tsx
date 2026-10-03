"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { ShirtIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ClerkRegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp, fetchStatus } = useSignUp()
  const router = useRouter()
  const [step, setStep] = useState<"details" | "email-code">("details")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isLoading = fetchStatus === "fetching"

  async function finishSignUp() {
    await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        const destination = session?.currentTask
          ? "/login?fallback=clerk"
          : "/dashboard"
        const url = decorateUrl(destination)

        if (url.startsWith("http")) {
          window.location.href = url
          return
        }

        router.replace(url)
      },
    })
  }

  async function handleRegister(formData: FormData) {
    setErrorMessage(null)
    const emailAddress = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const firstName = String(formData.get("firstName") ?? "").trim()
    const lastName = String(formData.get("lastName") ?? "").trim()
    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName,
      lastName,
    })

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    if (signUp.status === "complete") {
      await finishSignUp()
      return
    }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address")
    ) {
      const { error: verificationError } =
        await signUp.verifications.sendEmailCode()

      if (verificationError) {
        setErrorMessage(
          verificationError.longMessage ?? verificationError.message
        )
        return
      }

      setStep("email-code")
      return
    }

    setErrorMessage("Registration could not be completed. Please try again.")
  }

  async function handleVerifyEmail(formData: FormData) {
    setErrorMessage(null)
    const code = String(formData.get("code") ?? "").trim()
    const { error } = await signUp.verifications.verifyEmailCode({ code })

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    if (signUp.status === "complete") {
      await finishSignUp()
      return
    }

    setErrorMessage("Email verification could not be completed. Try again.")
  }

  async function resendCode() {
    setErrorMessage(null)
    const { error } = await signUp.verifications.sendEmailCode()

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
    }
  }

  async function handleGoogleSignUp() {
    setErrorMessage(null)
    const { error } = await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: "/dashboard",
      redirectCallbackUrl: "/sso-callback",
    })

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
    }
  }

  function startOver() {
    signUp.reset()
    setErrorMessage(null)
    setStep("details")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShirtIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {step === "email-code" ? "Verify your email" : "Create your account"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {step === "email-code"
                  ? "Enter the code we sent to your email address."
                  : "Join Closet Guider to organize your wardrobe."}
              </p>
            </div>
          </div>

          {step === "email-code" ? (
            <form action={handleVerifyEmail}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="verification-code">
                    Verification code
                  </FieldLabel>
                  <Input
                    id="verification-code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                  />
                </Field>
                {errorMessage && (
                  <p className="text-sm text-destructive" role="alert">
                    {errorMessage}
                  </p>
                )}
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify and create account"}
                </Button>
                <Button
                  className="w-full"
                  type="button"
                  variant="ghost"
                  onClick={resendCode}
                  disabled={isLoading}
                >
                  Resend code
                </Button>
                <Button
                  className="w-full"
                  type="button"
                  variant="ghost"
                  onClick={startOver}
                  disabled={isLoading}
                >
                  Use a different email
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <form action={handleRegister}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="first-name">First name</FieldLabel>
                  <Input id="first-name" name="firstName" autoComplete="given-name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last name</FieldLabel>
                  <Input id="last-name" name="lastName" autoComplete="family-name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </Field>
                {errorMessage && (
                  <p className="text-sm text-destructive" role="alert">
                    {errorMessage}
                  </p>
                )}
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                <FieldSeparator>or</FieldSeparator>
                <Button
                  className="w-full"
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  <span aria-hidden="true" className="font-semibold">G</span>
                  Continue with Google
                </Button>
                <div id="clerk-captcha" />
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}