import { SignIn } from "@clerk/nextjs"

import { ClerkLoginForm } from "@/components/clerk-login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ fallback?: string }>
}) {
  const { fallback } = await searchParams

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        {fallback === "clerk" ? (
          <SignIn routing="hash" />
        ) : (
          <ClerkLoginForm />
        )}
      </div>
    </main>
  )
}
