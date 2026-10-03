"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
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

export function ClerkLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, fetchStatus } = useSignIn()
  const router = useRouter()
  const [step, setStep] = useState<"credentials" | "email-code">("credentials")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showHostedSignIn, setShowHostedSignIn] = useState(false)
  const isLoading = fetchStatus === "fetching"

  async function finishSignIn() {
    await signIn.finalize({
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

  async function handlePasswordSubmit(formData: FormData) {
    setErrorMessage(null)
    setShowHostedSignIn(false)
    const emailAddress = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const { error } = await signIn.password({ emailAddress, password })

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    if (signIn.status === "complete") {
      await finishSignIn()
      return
    }

    if (
      signIn.status === "needs_second_factor" ||
      signIn.status === "needs_client_trust"
    ) {
      const supportsEmailCode = signIn.supportedSecondFactors?.some(
        (factor) => factor.strategy === "email_code"
      )

      if (supportsEmailCode) {
        const { error: codeError } = await signIn.mfa.sendEmailCode()

        if (codeError) {
          setErrorMessage(codeError.longMessage ?? codeError.message)
          return
        }

        setStep("email-code")
        return
      }

      setErrorMessage("Your account requires another verification method.")
      setShowHostedSignIn(true)
      return
    }

    setErrorMessage("Sign-in could not be completed. Please try again.")
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null)
    setShowHostedSignIn(false)
    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/dashboard",
      redirectCallbackUrl: "/sso-callback",
    })

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
    }
  }

  async function handleCodeSubmit(formData: FormData) {
    setErrorMessage(null)
    const code = String(formData.get("code") ?? "").trim()
    const { error } = await signIn.mfa.verifyEmailCode({ code })

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    if (signIn.status === "complete") {
      await finishSignIn()
      return
    }

    setErrorMessage("The verification step is incomplete. Please try again.")
  }

  async function resendCode() {
    setErrorMessage(null)
    const { error } = await signIn.mfa.sendEmailCode()

    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
    }
  }

  function startOver() {
    signIn.reset()
    setErrorMessage(null)
    setStep("credentials")
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
                {step === "email-code" ? "Check your email" : "Welcome back"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {step === "email-code"
                  ? "Enter the verification code sent to your email."
                  : "Sign in to your Closet Guider account."}
              </p>
            </div>
          </div>

          {step === "email-code" ? (
            <form action={handleCodeSubmit}>
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
                  {isLoading ? "Verifying..." : "Verify and sign in"}
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
                  Use a different account
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <form action={handlePasswordSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="you@example.com"
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="/login?fallback=clerk"
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </Field>
                {errorMessage && (
                  <div className="text-sm text-destructive" role="alert">
                    <p>{errorMessage}</p>
                    {showHostedSignIn && (
                      <Link
                        className="mt-1 inline-block underline"
                        href="/login?fallback=clerk"
                      >
                        Continue with Clerk sign-in
                      </Link>
                    )}
                  </div>
                )}
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <FieldSeparator>or</FieldSeparator>
                <Button
                  className="w-full"
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <span aria-hidden="true" className="font-semibold">G</span>
                  Continue with Google
                </Button>
                <FieldDescription className="text-center">
                  New to Closet Guider?{" "}
                  <Link href="/register">Create an account</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}