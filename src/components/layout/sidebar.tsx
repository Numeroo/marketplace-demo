import Link from "next/link"
import {
  Armchair, Bell, Bookmark, Car, CircleDollarSign,
  Home, Laptop, MapPin, Plus, Shirt, ShoppingBag, Tag
} from "lucide-react"

const categories = [
  { label: "Browse all", slug: "", icon: ShoppingBag },
  { label: "Notifications", slug: "notifications", icon: Bell },
  { label: "Inbox", slug: "inbox", icon: Tag },
  { label: "Vehicles", slug: "vehicles", icon: Car },
  { label: "Property Rentals", slug: "property", icon: Home },
  { label: "Apparel", slug: "fashion", icon: Shirt },
  { label: "Electronics", slug: "electronics", icon: Laptop },
  { label: "Home Goods", slug: "home", icon: Armchair },
]

export function Sidebar({ activeCategory }: { activeCategory?: string } = {}) {
  return (
    <aside className="hidden w-[260px] shrink-0 self-start lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)] lg:overflow-y-auto lg:border-r lg:border-zinc-200 lg:bg-white lg:px-3 lg:py-4">
      <Link href="/create" className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] text-sm font-semibold text-white transition-colors hover:bg-[#166fe5]">
        <Plus className="size-[18px]" /> Create new listing
      </Link>
      <nav className="space-y-1" aria-label="Marketplace categories">
        {categories.map(({ label, slug, icon: Icon }) => {
          const active = slug === "" ? !activeCategory : slug === activeCategory
          return (
          <Link key={label} href={slug ? `/category/${slug}` : "/"} aria-current={active ? "page" : undefined} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${active ? "bg-[#E7F3FF] text-[#1877F2]" : "text-zinc-900 hover:bg-[#F0F2F5]"}`}>
            <span className={`grid size-8 place-items-center rounded-full ${active ? "bg-white" : "bg-[#E4E6EB]"}`}><Icon className="size-4" /></span>
            <span className="flex-1">{label}</span>
          </Link>
          )
        })}
      </nav>
      <div className="mt-5 border-t pt-4 text-sm">
        <p className="mb-2 px-3 font-semibold text-zinc-700">More on Marketplace</p>
        <Link href="/category/saved" className="flex h-10 items-center gap-3 rounded-lg px-3 text-zinc-800 hover:bg-[#F0F2F5]"><Bookmark className="size-[18px]" /> Saved listings</Link>
        <Link href="/category/local" className="flex h-10 items-center gap-3 rounded-lg px-3 text-zinc-800 hover:bg-[#F0F2F5]"><MapPin className="size-[18px]" /> Local listings</Link>
        <Link href="/category/deals" className="flex h-10 items-center gap-3 rounded-lg px-3 text-zinc-800 hover:bg-[#F0F2F5]"><CircleDollarSign className="size-[18px]" /> Deals</Link>
      </div>
      <div className="mt-6 border-t px-3 pt-4 text-xs leading-5 text-zinc-500">Privacy · Terms · Advertising · Cookies · More</div>
    </aside>
  )
}

export function MobileCategoryNav({ activeCategory }: { activeCategory?: string } = {}) {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-3 lg:hidden" aria-label="Browse categories">
      {categories.filter(({ slug }) => slug !== "notifications" && slug !== "inbox").map(({ label, slug }) => {
        const active = slug === "" ? !activeCategory : slug === activeCategory
        return (
          <Link
            key={label}
            href={slug ? `/category/${slug}` : "/"}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-[#E7F3FF] text-[#1877F2]" : "bg-[#F0F2F5] text-zinc-700 hover:bg-zinc-200"}`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
