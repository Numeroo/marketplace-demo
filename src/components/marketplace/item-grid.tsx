import Link from "next/link"
import type { MarketplaceItem } from "@/data/items"

export function ItemGrid({ items }: { items: MarketplaceItem[] }) {
  if (!items.length) {
    return <p className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">No listings found in this category yet.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 xl:gap-x-4">
      {items.map((item) => (
        <Link key={item.id} href={`/item/${item.id}`} className="group min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877F2]">
          <article className="overflow-hidden rounded-lg bg-white transition-shadow duration-200 group-hover:shadow-md">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
              <img src={item.image} alt={item.title} loading={Number(item.id) > 5 ? "lazy" : "eager"} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
              {item.condition === "New" && <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold text-zinc-800 shadow-sm">New</span>}
            </div>
            <div className="px-0.5 pb-1 pt-2">
              <p className="text-[15px] font-semibold leading-5 text-zinc-950">${item.price.toLocaleString()}</p>
              <h3 className="mt-0.5 truncate text-[13px] leading-[18px] text-zinc-800">{item.title}</h3>
              <p className="mt-1 truncate text-[11px] leading-4 text-zinc-500">{item.location} · {item.posted}</p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
