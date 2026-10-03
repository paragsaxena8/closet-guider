import { ClerkRegisterForm } from "@/components/clerk-register-form"

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        <ClerkRegisterForm />
      </div>
    </main>
  )
}