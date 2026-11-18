"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { AlertCircle, ChevronLeft, LoaderCircle, MapPin, Share2, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSeller } from "@/components/marketplace/message-seller"

type Listing = {
  id: string
  title: string
  price: number
  location: string | null
  category: string
  image_url: string | null
  description: string | null
  seller_email: string | null
  condition: string | null
  created_at: string
}

export default function ItemPage() {
  return (
    <Suspense fallback={<main className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-zinc-500"><LoaderCircle className="size-5 animate-spin" /> Loading listing…</main>}>
      <ItemDetail />
    </Suspense>
  )
}

function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    async function loadListing() {
      try {
        const response = await fetch(`/api/listings/${encodeURIComponent(id)}`, { signal: controller.signal })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Could not load this listing.")
        setItem(result.data)
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") return
        setError(loadError instanceof Error ? loadError.message : "Could not load this listing.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void loadListing()
    return () => controller.abort()
  }, [id])

  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-zinc-500"><LoaderCircle className="size-5 animate-spin" /> Loading listing…</main>
  }
  if (error || !item) {
    return <main className="mx-auto max-w-3xl px-4 py-12"><p role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="size-4" /> {error || "Listing not found."}</p><Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#1877F2]">Back to Marketplace</Link></main>
  }

  const sellerInitials = item.seller_email?.slice(0, 2).toUpperCase() || "S"
  const posted = new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.created_at))

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F0F2F5] px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto max-w-[1320px]">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-[#1877F2]"><ChevronLeft className="size-4" /> Back to Marketplace</Link>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
          <div className="min-w-0">
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 sm:p-3">
              {item.image_url ? <img src={item.image_url} alt={item.title} className="mx-auto max-h-[72vh] min-h-[260px] w-full rounded-lg bg-[#F0F2F5] object-contain" /> : <div className="grid min-h-[320px] place-items-center rounded-lg bg-[#F0F2F5] text-zinc-500">No photo provided</div>}
            </section>
            <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{item.description || "No description provided."}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-100 pt-4 text-sm">
                <div><p className="text-xs text-zinc-500">Condition</p><p className="mt-1 font-medium">{item.condition || "Used"}</p></div>
                <div><p className="text-xs text-zinc-500">Category</p><p className="mt-1 font-medium capitalize">{item.category}</p></div>
                <p className="flex items-center gap-1.5 self-end text-zinc-600"><MapPin className="size-4 text-zinc-500" /> {item.location || "Palo Alto, CA"}</p>
              </div>
            </section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-20">
            <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
              <p className="text-[28px] font-bold tracking-tight">${Number(item.price).toLocaleString()}</p>
              <h1 className="mt-1 text-lg font-semibold leading-6">{item.title}</h1>
              <p className="mt-1.5 text-sm text-zinc-500">{item.location || "Palo Alto, CA"} · Listed {posted}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4">
                <Avatar size="lg"><AvatarFallback>{sellerInitials}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">Seller</p><p className="truncate text-xs text-zinc-500">{item.seller_email || "Email unavailable"}</p></div>
                <ShieldCheck className="ml-auto size-5 shrink-0 text-[#1877F2]" aria-label="Seller" />
              </div>
              <Button variant="outline" className="mt-4 h-10 w-full gap-2 border-zinc-300 font-semibold text-zinc-800 hover:bg-zinc-50" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share2 className="size-4" /> Share listing</Button>
            </section>
            {item.seller_email && <MessageSeller listingId={item.id} />}
          </aside>
        </div>
      </div>
    </main>
  )
}
