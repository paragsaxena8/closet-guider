import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-medium text-primary">404 · PAGE NOT FOUND</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-muted-foreground">
          The address may be incorrect, or the page may have moved.
        </p>
        <Link
          href="/dashboard"
          className={buttonVariants({ className: "mt-8" })}
        >
          <ArrowLeftIcon />
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}