import Link from "next/link"
import { Armchair, ArrowRight, Car, Home, Plus } from "lucide-react"

const types = [
  { title: "Item for sale", description: "Sell something from around your home", href: "/create/item", icon: Plus },
  { title: "Vehicle for sale", description: "Add a car, motorcycle or other vehicle", href: "/create/item", icon: Car },
  { title: "Home for sale or rent", description: "List a property", href: "/create/item", icon: Home },
  { title: "Create business listing", description: "Reach people looking for local services", href: "/create/item", icon: Armchair },
]

export default function CreatePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[760px]">
        <Link href="/" className="text-sm font-semibold text-[#1877F2] hover:underline">Marketplace</Link>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight">What are you listing?</h1>
        <p className="mt-1 text-sm text-zinc-500">Choose a listing type to get started.</p>
        <div className="mt-7 space-y-3">
        {types.map(({ title, description, href, icon: Icon }) => (
          <Link key={title} href={href} className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[#1877F2] hover:bg-[#F7FAFF] sm:p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#E7F3FF] text-[#1877F2] transition-colors group-hover:bg-[#d8ebff]"><Icon className="size-[21px]" /></span>
            <span className="min-w-0 flex-1"><span className="block font-semibold">{title}</span><span className="mt-0.5 block text-sm text-zinc-500">{description}</span></span>
            <ArrowRight className="size-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-[#1877F2]" />
          </Link>
        ))}
        </div>
      </div>
    </main>
  )
}
