import { MobileCategoryNav, Sidebar } from "@/components/layout/sidebar"
import { ItemGrid } from "@/components/marketplace/item-grid"
import { marketplaceItems } from "@/data/items"

export default function Home() {
  return (
    <div className="mx-auto flex max-w-[1600px]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileCategoryNav />
        <main className="min-h-[calc(100vh-64px)] min-w-0 bg-white px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1877F2]">Marketplace</p>
              <h1 className="mt-1 text-[22px] font-bold tracking-tight">Today&apos;s picks</h1>
            </div>
            <p className="hidden text-sm text-zinc-500 sm:block">Find something you love, right around the corner.</p>
          </div>
          <ItemGrid items={marketplaceItems} />
        </div>
        </main>
      </div>
    </div>
  )
}
