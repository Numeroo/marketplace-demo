import { notFound } from "next/navigation"
import { MobileCategoryNav, Sidebar } from "@/components/layout/sidebar"
import { ItemGrid } from "@/components/marketplace/item-grid"
import { marketplaceItems } from "@/data/items"

export function generateStaticParams() {
  return ["electronics", "home", "fashion", "sports", "vehicles", "property", "notifications", "inbox", "saved", "local", "deals"].map((slug) => ({ slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = ["electronics", "home", "fashion", "sports", "vehicles", "property", "notifications", "inbox", "saved", "local", "deals"]
  if (!categories.includes(slug)) notFound()

  const title = slug.charAt(0).toUpperCase() + slug.slice(1)
  const items = ["electronics", "home", "fashion", "sports"].includes(slug)
    ? marketplaceItems.filter((item) => item.category === slug)
    : marketplaceItems

  return (
    <div className="mx-auto flex max-w-[1600px]">
      <Sidebar activeCategory={slug} />
      <div className="min-w-0 flex-1">
        <MobileCategoryNav activeCategory={slug} />
        <main className="min-h-[calc(100vh-64px)] min-w-0 bg-white px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1877F2]">Marketplace categories</p>
          <h1 className="mb-5 mt-1 text-[22px] font-bold tracking-tight">{title}</h1>
          <ItemGrid items={items} />
        </div>
        </main>
      </div>
    </div>
  )
}
