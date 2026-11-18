import { MobileCategoryNav, Sidebar } from "@/components/layout/sidebar"
import { ItemGrid } from "@/components/marketplace/item-grid"
import { marketplaceItems } from "@/data/items"

export default function ElectronicsPage() {
  return (
    <div className="mx-auto flex max-w-[1600px]">
      <Sidebar activeCategory="electronics" />
      <div className="min-w-0 flex-1">
        <MobileCategoryNav activeCategory="electronics" />
        <main className="min-h-[calc(100vh-64px)] min-w-0 bg-white px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1877F2]">Marketplace categories</p>
          <h1 className="mb-5 mt-1 text-[22px] font-bold tracking-tight">Electronics</h1>
          <ItemGrid items={marketplaceItems.filter((item) => item.category === "electronics")} />
        </div>
        </main>
      </div>
    </div>
  )
}
