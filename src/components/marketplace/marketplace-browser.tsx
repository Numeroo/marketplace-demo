"use client"

import { useEffect, useState } from "react"
import { AlertCircle, LoaderCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ItemGrid } from "@/components/marketplace/item-grid"
import { MobileCategoryNav } from "@/components/layout/sidebar"
import type { MarketplaceItem } from "@/data/items"

type ListingRecord = {
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
  listing_images?: { image_url: string; sort_order: number }[]
}

const categoryLabels: Record<string, string> = {
  vehicles: "Vehicles",
  property: "Property Rentals",
  fashion: "Apparel",
  electronics: "Electronics",
  entertainment: "Entertainment",
  family: "Family",
  garden: "Garden & Outdoor",
  home: "Home Goods",
  sports: "Sporting Goods",
  toys: "Toys & Games",
  other: "Other",
}

function toItem(row: ListingRecord): MarketplaceItem {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    location: row.location || "Palo Alto, CA",
    category: row.category,
    image: row.image_url || row.listing_images?.[0]?.image_url || "",
    description: row.description || "",
    seller: row.seller_email || "Marketplace seller",
    condition: row.condition || "Used",
    posted: new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(row.created_at)),
  }
}

export function MarketplaceBrowser({ initialCategory = "" }: { initialCategory?: string }) {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [searchText, setSearchText] = useState("")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(initialCategory)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(searchText.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    const controller = new AbortController()
    async function loadListings() {
      setLoading(true)
      setError("")
      const params = new URLSearchParams({ limit: "100" })
      if (category) params.set("category", category)
      if (query) params.set("search", query)

      try {
        const response = await fetch(`/api/listings?${params}`, { signal: controller.signal })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Could not load listings.")
        setItems((result.data as ListingRecord[]).map(toItem))
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") return
        setError(loadError instanceof Error ? loadError.message : "Could not load listings.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadListings()
    return () => controller.abort()
  }, [category, query])

  const categories = ["", ...Object.keys(categoryLabels)]

  return (
    <div className="min-w-0 flex-1">
      <MobileCategoryNav activeCategory={category} />
      <main className="min-h-[calc(100vh-64px)] min-w-0 bg-white px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1877F2]">Marketplace</p>
              <h1 className="mt-1 text-[22px] font-bold tracking-tight">
                {category ? categoryLabels[category] || category : "Today’s picks"}
              </h1>
            </div>
            <label className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search listings" aria-label="Search listings" className="h-10 rounded-full pl-9" />
            </label>
          </div>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
            {categories.map((slug) => (
              <button
                key={slug || "all"}
                type="button"
                onClick={() => setCategory(slug)}
                aria-pressed={category === slug}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${category === slug ? "bg-[#E7F3FF] text-[#1877F2]" : "bg-[#F0F2F5] text-zinc-700 hover:bg-zinc-200"}`}
              >
                {slug ? categoryLabels[slug] : "All"}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500"><LoaderCircle className="size-5 animate-spin" /> Loading listings…</div>
          ) : error ? (
            <p role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="size-4 shrink-0" /> {error}</p>
          ) : <ItemGrid items={items} />}
        </div>
      </main>
    </div>
  )
}
