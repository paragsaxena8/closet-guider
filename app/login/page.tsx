import { ClerkLoginForm } from "@/components/clerk-login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        <ClerkLoginForm />
      </div>
    </main>
  )
}
