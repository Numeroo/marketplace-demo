import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, MapPin, Share2, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSeller } from "@/components/marketplace/message-seller"
import { marketplaceItems } from "@/data/items"

export function generateStaticParams() {
  return marketplaceItems.map((item) => ({ id: item.id }))
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = marketplaceItems.find((entry) => entry.id === id)
  if (!item) notFound()

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F0F2F5] px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto max-w-[1320px]">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-[#1877F2]"><ChevronLeft className="size-4" /> Back to Marketplace</Link>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
          <div className="min-w-0">
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 sm:p-3">
              <img src={item.image} alt={item.title} className="mx-auto max-h-[72vh] min-h-[260px] w-full rounded-lg bg-[#F0F2F5] object-contain" />
            </section>
            <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-100 pt-4 text-sm">
                <div><p className="text-xs text-zinc-500">Condition</p><p className="mt-1 font-medium">{item.condition}</p></div>
                <div><p className="text-xs text-zinc-500">Category</p><p className="mt-1 font-medium capitalize">{item.category}</p></div>
                <p className="flex items-center gap-1.5 self-end text-zinc-600"><MapPin className="size-4 text-zinc-500" /> {item.location}</p>
              </div>
            </section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-20">
            <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
              <p className="text-[28px] font-bold tracking-tight">${item.price.toLocaleString()}</p>
              <h1 className="mt-1 text-lg font-semibold leading-6">{item.title}</h1>
              <p className="mt-1.5 text-sm text-zinc-500">{item.location} · Listed {item.posted}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4">
                <Avatar size="lg"><AvatarFallback>{item.seller.split(" ").map((part) => part[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{item.seller}</p><p className="text-xs text-zinc-500">Joined Facebook in 2021</p></div>
                <ShieldCheck className="ml-auto size-5 shrink-0 text-[#1877F2]" aria-label="Verified seller" />
              </div>
              <Button variant="outline" className="mt-4 h-10 w-full gap-2 border-zinc-300 font-semibold text-zinc-800 hover:bg-zinc-50"><Share2 className="size-4" /> Share listing</Button>
            </section>
            <MessageSeller seller={item.seller} />
            <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 sm:p-5">
              <p className="flex items-center gap-2 font-semibold text-zinc-800"><ShieldCheck className="size-[18px] text-[#1877F2]" /> Buy and sell safely</p>
              <p className="mt-2 text-xs leading-5">Meet in a public place and inspect the item before completing your purchase.</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
