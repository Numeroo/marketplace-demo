"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Marketplace route error:", error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="size-10 text-red-600" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-bold">This page couldn&apos;t load</h1>
      <p className="mt-2 text-sm text-zinc-600">Please try again, or return to Marketplace.</p>
      <div className="mt-5 flex gap-3">
        <Button type="button" onClick={reset} className="gap-2 bg-[#1877F2] text-white hover:bg-[#166FE5]">
          <RotateCcw className="size-4" /> Try again
        </Button>
        <Link href="/" className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50">Marketplace home</Link>
      </div>
    </main>
  )
}
