import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { MarketplaceBrowser } from "@/components/marketplace/marketplace-browser"

export function generateStaticParams() {
  return ["electronics", "home", "fashion", "sports", "vehicles", "property", "notifications", "inbox", "saved", "local", "deals"].map((slug) => ({ slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = ["electronics", "home", "fashion", "sports", "vehicles", "property", "notifications", "inbox", "saved", "local", "deals"]
  if (!categories.includes(slug)) notFound()

  return (
    <div className="mx-auto flex max-w-[1600px]">
      <Sidebar activeCategory={slug} />
      <MarketplaceBrowser initialCategory={slug} />
    </div>
  )
}
